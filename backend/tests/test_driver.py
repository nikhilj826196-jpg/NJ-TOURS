from datetime import date, timedelta
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.connection import Base, get_db
from app.core.security import create_access_token
from app.models.user import User, UserRole
from app.models.vehicle import Vehicle, VehicleCategory, FuelType

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
async def test_driver_crud_and_assignment_lifecycle():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Setup seed records (Admin, Driver User, Customer User, Vehicle)
        async with TestingSessionLocal() as db:
            admin = User(
                full_name="Admin User",
                email="admin.d@test.com",
                phone="9876543210",
                password_hash="hash",
                role=UserRole.ADMIN
            )
            driver_user = User(
                full_name="Driver Person",
                email="driver.p@test.com",
                phone="9876543211",
                password_hash="hash",
                role=UserRole.DRIVER
            )
            cust_user = User(
                full_name="Cust Person",
                email="cust.p@test.com",
                phone="9876543212",
                password_hash="hash",
                role=UserRole.CUSTOMER
            )
            vehicle = Vehicle(
                name="Force Traveller",
                brand="Force",
                model_name="3350",
                vehicle_number="MH12CD5678",
                category=VehicleCategory.TEMPO_TRAVELLER,
                seating_capacity=13,
                per_km_rate=25.0,
                per_day_rate=5000.0,
                fuel_type=FuelType.DIESEL,
                is_ac=True,
                is_available=True
            )
            db.add_all([admin, driver_user, cust_user, vehicle])
            await db.commit()
            await db.refresh(admin)
            await db.refresh(driver_user)
            await db.refresh(cust_user)
            await db.refresh(vehicle)

            admin_id = admin.id
            driver_user_id = driver_user.id
            cust_id = cust_user.id
            vehicle_id = vehicle.id

        admin_token = create_access_token({"sub": admin_id, "role": "Admin"})
        driver_token = create_access_token({"sub": driver_user_id, "role": "Driver"})
        cust_token = create_access_token({"sub": cust_id, "role": "Customer"})

        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        driver_headers = {"Authorization": f"Bearer {driver_token}"}
        cust_headers = {"Authorization": f"Bearer {cust_token}"}

        # 2. Customer attempts to list drivers -> 403 Forbidden
        res_cust_list = await client.get("/api/v1/drivers", headers=cust_headers)
        assert res_cust_list.status_code == 403

        # 3. Admin creates driver profile -> 201 Created
        next_year = (date.today() + timedelta(days=365)).isoformat()
        driver_payload = {
            "user_id": driver_user_id,
            "license_number": "MH1220201234567",
            "license_expiry": next_year,
            "aadhar_number": "123456789012",
            "pan_number": "ABCDE1234F",
            "address": "Pune, Maharashtra",
            "experience_years": 5,
            "emergency_contact": "9876543210"
        }
        res_create = await client.post("/api/v1/drivers", json=driver_payload, headers=admin_headers)
        assert res_create.status_code == 201
        driver_data = res_create.json()["data"]
        driver_id = driver_data["id"]
        assert driver_data["license_number"] == "MH1220201234567"

        # 4. Driver views own profile (/me) -> 200 OK
        res_me = await client.get("/api/v1/drivers/me", headers=driver_headers)
        assert res_me.status_code == 200
        assert res_me.json()["data"]["id"] == driver_id

        # 5. Admin assigns vehicle to driver -> 200 OK
        res_assign = await client.put(
            f"/api/v1/drivers/{driver_id}/assign-vehicle",
            json={"vehicle_id": vehicle_id},
            headers=admin_headers
        )
        assert res_assign.status_code == 200
        assert res_assign.json()["data"]["assigned_vehicle_id"] == vehicle_id

        # 6. Driver updates status -> 200 OK
        res_status = await client.put(
            f"/api/v1/drivers/{driver_id}/status",
            json={"status": "On Trip"},
            headers=driver_headers
        )
        assert res_status.status_code == 200
        assert res_status.json()["data"]["status"] == "On Trip"

        # 7. Driver checks assigned trips (/me/trips) -> 200 OK
        res_trips = await client.get("/api/v1/drivers/me/trips", headers=driver_headers)
        assert res_trips.status_code == 200
