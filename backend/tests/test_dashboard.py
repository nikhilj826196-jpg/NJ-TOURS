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
async def test_dashboard_analytics_and_rbac():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Setup seed users (Admin & Customer)
        async with TestingSessionLocal() as db:
            admin = User(
                full_name="Admin Analytics",
                email="admin.dash@test.com",
                phone="9876566661",
                password_hash="hash",
                role=UserRole.ADMIN
            )
            customer = User(
                full_name="Customer Analytics",
                email="customer.dash@test.com",
                phone="9876566662",
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

        # 2. Customer attempt to view overview -> 403 Forbidden
        res_forbidden = await client.get("/api/v1/dashboard/overview", headers=cust_headers)
        assert res_forbidden.status_code == 403

        # 2.5 Customer attempt to view custom stats -> 403 Forbidden
        res_forbidden_stats = await client.get("/api/v1/admin/dashboard/stats", headers=cust_headers)
        assert res_forbidden_stats.status_code == 403

        # 3. Admin fetches overview -> 200 OK
        res_overview = await client.get("/api/v1/dashboard/overview", headers=admin_headers)
        assert res_overview.status_code == 200
        overview = res_overview.json()["data"]
        assert overview["total_users"] == 2
        assert overview["total_customers"] == 1

        # 4. Admin fetches revenue analytics -> 200 OK
        res_rev = await client.get("/api/v1/dashboard/revenue", headers=admin_headers)
        assert res_rev.status_code == 200
        assert "revenue_chart" in res_rev.json()["data"]

        # 5. Admin fetches booking analytics -> 200 OK
        res_book = await client.get("/api/v1/dashboard/bookings", headers=admin_headers)
        assert res_book.status_code == 200
        assert "most_popular_route" in res_book.json()["data"]

        # 6. Admin fetches driver analytics -> 200 OK
        res_driver = await client.get("/api/v1/dashboard/drivers", headers=admin_headers)
        assert res_driver.status_code == 200

        # 7. Admin fetches vehicle analytics -> 200 OK
        res_veh = await client.get("/api/v1/dashboard/vehicles", headers=admin_headers)
        assert res_veh.status_code == 200

        # 8. Admin fetches customer analytics -> 200 OK
        res_cust = await client.get("/api/v1/dashboard/customers", headers=admin_headers)
        assert res_cust.status_code == 200

        # 9. Admin fetches custom stats -> 200 OK
        res_stats = await client.get("/api/v1/admin/dashboard/stats", headers=admin_headers)
        assert res_stats.status_code == 200
        stats = res_stats.json()
        assert "total_users" in stats
        assert "total_drivers" in stats
        assert "active_drivers" in stats
        assert "total_vehicles" in stats
        assert "available_vehicles" in stats
        assert "total_bookings" in stats
        assert "weekly_bookings" in stats
        assert "total_revenue" in stats
        assert "pending_bookings" in stats
