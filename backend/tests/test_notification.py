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
async def test_notification_dispatch_and_reading_workflow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Setup seed users (Admin & Customer)
        async with TestingSessionLocal() as db:
            admin = User(
                full_name="Admin Notif",
                email="admin.notif@test.com",
                phone="9876577771",
                password_hash="hash",
                role=UserRole.ADMIN
            )
            customer = User(
                full_name="Customer Notif",
                email="customer.notif@test.com",
                phone="9876577772",
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

        test_payload = {
            "recipient": "customer.notif@test.com",
            "channel": "Email",
            "type": "Welcome Email",
            "title": "Welcome to NJ Tours",
            "message": "Thank you for registering on NJ Tours!"
        }

        # 2. Customer attempt to send test notification -> 403 Forbidden
        res_forbidden = await client.post("/api/v1/notifications/send-test", json=test_payload, headers=cust_headers)
        assert res_forbidden.status_code == 403

        # 3. Admin sends test notification -> 201 Created
        res_send = await client.post("/api/v1/notifications/send-test", json=test_payload, headers=admin_headers)
        assert res_send.status_code == 201
        notif_data = res_send.json()["data"]
        notif_id = notif_data["id"]
        assert notif_data["status"] == "Sent"
        assert notif_data["channel"] == "Email"

        # 4. Admin lists all notifications -> 200 OK
        res_list = await client.get("/api/v1/notifications", headers=admin_headers)
        assert res_list.status_code == 200
        assert len(res_list.json()["data"]) == 1

        # 5. Mark notification as read -> 200 OK
        res_read = await client.put(f"/api/v1/notifications/{notif_id}/read", headers=admin_headers)
        assert res_read.status_code == 200
        assert res_read.json()["data"]["is_read"] is True
