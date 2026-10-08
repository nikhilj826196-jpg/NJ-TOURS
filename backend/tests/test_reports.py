import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.connection import Base, get_db
from app.core.security import create_access_token
from app.models.user import User, UserRole

# In-memory SQLite DB for testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = async_sessionmaker(
    bind=test_engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


from collections.abc import AsyncGenerator

async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with TestingSessionLocal() as session:
        yield session


@pytest_asyncio.fixture(autouse=True)
async def setup_test_db():
    app.dependency_overrides[get_db] = override_get_db
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_reports_and_export_lifecycle():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Setup seed users (Admin & Customer)
        async with TestingSessionLocal() as db:
            admin = User(
                full_name="Admin Reports",
                email="admin.rep@test.com",
                phone="9876555551",
                password_hash="hash",
                role=UserRole.ADMIN
            )
            customer = User(
                full_name="Customer Reports",
                email="customer.rep@test.com",
                phone="9876555552",
                password_hash="hash",
                role=UserRole.CUSTOMER
            )
            db.add_all([admin, customer])
            await db.commit()
            await db.refresh(admin)
            await db.refresh(customer)
            admin_id = admin.id
            cust_id = customer.id

        admin_token = create_access_token({"sub": admin_id, "role": "Admin"})
        cust_token = create_access_token({"sub": cust_id, "role": "Customer"})

        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        cust_headers = {"Authorization": f"Bearer {cust_token}"}

        # 2. Customer attempt to fetch reports -> 403 Forbidden
        res_forbidden = await client.get("/api/v1/reports/bookings", headers=cust_headers)
        assert res_forbidden.status_code == 403

        # 3. Admin fetches booking report -> 200 OK
        res_bookings = await client.get("/api/v1/reports/bookings", headers=admin_headers)
        assert res_bookings.status_code == 200

        # 4. Admin fetches revenue report -> 200 OK
        res_revenue = await client.get("/api/v1/reports/revenue", headers=admin_headers)
        assert res_revenue.status_code == 200

        # 5. Admin exports CSV -> 200 OK
        res_csv = await client.get("/api/v1/reports/export/csv?report_type=bookings", headers=admin_headers)
        assert res_csv.status_code == 200
        assert "text/csv" in res_csv.headers["content-type"]

        # 6. Admin exports Excel -> 200 OK
        res_excel = await client.get("/api/v1/reports/export/excel?report_type=revenue", headers=admin_headers)
        assert res_excel.status_code == 200

        # 7. Admin exports PDF -> 200 OK
        res_pdf = await client.get("/api/v1/reports/export/pdf?report_type=customers", headers=admin_headers)
        assert res_pdf.status_code == 200
        assert "application/pdf" in res_pdf.headers["content-type"]
