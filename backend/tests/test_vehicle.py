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
async def test_vehicle_crud_workflow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create test admin user in DB
        async with TestingSessionLocal() as db:
            admin = User(
                full_name="Admin Test",
                email="admin.veh@test.com",
                phone="9990001111",
                password_hash="hashed",
                role=UserRole.ADMIN
            )
            customer = User(
                full_name="Customer Test",
                email="cust.veh@test.com",
                phone="9990002222",
                password_hash="hashed",
                role=UserRole.CUSTOMER
            )
            db.add_all([admin, customer])
            await db.commit()
            await db.refresh(admin)
            await db.refresh(customer)
            admin_id = admin.id
            customer_id = customer.id

        admin_token = create_access_token({"sub": admin_id, "role": "Admin"})
        customer_token = create_access_token({"sub": customer_id, "role": "Customer"})

        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        customer_headers = {"Authorization": f"Bearer {customer_token}"}

        # 1. Customer attempts to create vehicle -> 403 Forbidden
        veh_payload = {
            "name": "Toyota Innova Crysta",
            "brand": "Toyota",
            "model_name": "Innova Crysta VX",
            "vehicle_number": "MH12AB1234",
            "category": "SUV",
            "seating_capacity": 7,
            "per_km_rate": 18.5,
            "per_day_rate": 3500.0,
            "fuel_type": "Diesel",
            "is_ac": True,
            "is_available": True
        }
        res_forbidden = await client.post("/api/v1/vehicles", json=veh_payload, headers=customer_headers)
        assert res_forbidden.status_code == 403

        # 2. Admin creates vehicle -> 201 Created
        res_create = await client.post("/api/v1/vehicles", json=veh_payload, headers=admin_headers)
        assert res_create.status_code == 201
        data = res_create.json()["data"]
        vehicle_id = data["id"]
        assert data["vehicle_number"] == "MH12AB1234"
        assert data["name"] == "Toyota Innova Crysta"

        # 3. List vehicles -> 200 OK
        res_list = await client.get("/api/v1/vehicles")
        assert res_list.status_code == 200
        vehicles_data = res_list.json()["data"]
        assert len(vehicles_data) == 1

        # 4. Get vehicle by ID -> 200 OK
        res_get = await client.get(f"/api/v1/vehicles/{vehicle_id}")
        assert res_get.status_code == 200
        assert res_get.json()["data"]["id"] == vehicle_id

        # 5. Admin updates vehicle -> 200 OK
        res_update = await client.put(
            f"/api/v1/vehicles/{vehicle_id}",
            json={"per_km_rate": 20.0, "is_available": False},
            headers=admin_headers
        )
        assert res_update.status_code == 200
        assert res_update.json()["data"]["per_km_rate"] == 20.0
        assert res_update.json()["data"]["is_available"] is False

        # 6. Admin deletes vehicle -> 200 OK
        res_del = await client.delete(f"/api/v1/vehicles/{vehicle_id}", headers=admin_headers)
        assert res_del.status_code == 200

        # Verify get after delete returns 404
        res_404 = await client.get(f"/api/v1/vehicles/{vehicle_id}")
        assert res_404.status_code == 404
