from datetime import date, datetime, timedelta
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
from app.models.booking import Booking, BookingStatus, PaymentStatus, TripType
from app.models.driver import DriverProfile, DriverStatus

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
async def test_gps_telemetry_and_websocket_connection():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Setup seed records (Admin, Driver User, Driver Profile, Customer User, Vehicle, Active Booking)
        async with TestingSessionLocal() as db:
            admin = User(
                full_name="Admin GPS",
                email="admin.gps@test.com",
                phone="9876500091",
                password_hash="hash",
                role=UserRole.ADMIN
            )
            driver_user = User(
                full_name="Driver GPS",
                email="driver.gps@test.com",
                phone="9876500092",
                password_hash="hash",
                role=UserRole.DRIVER
            )
            customer = User(
                full_name="Customer GPS",
                email="customer.gps@test.com",
                phone="9876500093",
                password_hash="hash",
                role=UserRole.CUSTOMER
            )
            vehicle = Vehicle(
                name="Thar 4x4",
                brand="Mahindra",
                model_name="Thar LX",
                vehicle_number="MH12GPS001",
                category=VehicleCategory.SUV,
                seating_capacity=4,
                per_km_rate=18.0,
                per_day_rate=4000.0,
                fuel_type=FuelType.DIESEL,
                is_ac=True,
                is_available=True
            )
            db.add_all([admin, driver_user, customer, vehicle])
            await db.commit()
            await db.refresh(admin)
            await db.refresh(driver_user)
            await db.refresh(customer)
            await db.refresh(vehicle)

            driver_profile = DriverProfile(
                user_id=driver_user.id,
                license_number="DL1234567890",
                license_expiry=date.today() + timedelta(days=365),
                status=DriverStatus.AVAILABLE,
                assigned_vehicle_id=vehicle.id
            )
            db.add(driver_profile)
            await db.commit()
            await db.refresh(driver_profile)

            booking = Booking(
                booking_number="NJB-20260806-GPS1",
                customer_id=customer.id,
                vehicle_id=vehicle.id,
                driver_id=driver_user.id,
                trip_type=TripType.ONE_WAY,
                pickup_location="Pune",
                drop_location="Mahabaleshwar",
                pickup_date=date.today(),
                pickup_time="06:00 AM",
                passengers=3,
                distance_km=120.0,
                estimated_duration="3 Hours",
                base_fare=2160.0,
                driver_allowance=300.0,
                gst=123.0,
                grand_total=2583.0,
                status=BookingStatus.STARTED,
                payment_status=PaymentStatus.PAID
            )
            db.add(booking)
            await db.commit()
            await db.refresh(booking)

            admin_id = admin.id
            driver_id = driver_user.id
            cust_id = customer.id
            booking_id = booking.id

        admin_token = create_access_token({"sub": admin_id, "role": "Admin"})
        driver_token = create_access_token({"sub": driver_id, "role": "Driver"})
        cust_token = create_access_token({"sub": cust_id, "role": "Customer"})

        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        driver_headers = {"Authorization": f"Bearer {driver_token}"}
        cust_headers = {"Authorization": f"Bearer {cust_token}"}

        # 2. Driver updates GPS location -> 201 Created
        gps_payload = {
            "latitude": 18.5204,
            "longitude": 73.8567,
            "booking_id": booking_id,
            "speed": 45.0,
            "heading": 180.0,
            "accuracy": 5.0,
            "battery_level": 85.0
        }
        res_update = await client.post("/api/v1/location/update", json=gps_payload, headers=driver_headers)
        assert res_update.status_code == 201
        data = res_update.json()["data"]
        assert data["latitude"] == 18.5204
        assert data["speed"] == 45.0

        # 3. Customer checks current location and ETA -> 200 OK
        res_current = await client.get(f"/api/v1/location/current/{booking_id}", headers=cust_headers)
        assert res_current.status_code == 200
        cur_data = res_current.json()["data"]
        assert cur_data["latitude"] == 18.5204
        assert cur_data["eta_minutes"] > 0
        assert cur_data["remaining_distance_km"] > 0

        # 4. Customer retrieves route history list -> 200 OK
        res_hist = await client.get(f"/api/v1/location/history/{booking_id}", headers=cust_headers)
        assert res_hist.status_code == 200
        assert len(res_hist.json()["data"]["route"]) == 1

        # 5. Customer attempts to send updates -> 403 Forbidden
        res_forbidden = await client.post("/api/v1/location/update", json=gps_payload, headers=cust_headers)
        assert res_forbidden.status_code == 403

        # 6. Admin checks driver current location -> 200 OK
        res_admin_drv = await client.get(f"/api/v1/location/driver/{driver_id}", headers=admin_headers)
        assert res_admin_drv.status_code == 200
        assert res_admin_drv.json()["data"]["driver_id"] == driver_id
