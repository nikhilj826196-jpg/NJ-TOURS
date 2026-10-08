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
from app.models.booking import Booking, BookingStatus, PaymentStatus, TripType

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
async def test_coupon_crud_validation_and_application_lifecycle():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Setup seed records (Admin, Customer, Vehicle, Booking)
        async with TestingSessionLocal() as db:
            admin = User(
                full_name="Admin Coupon",
                email="admin.cp@test.com",
                phone="9876522221",
                password_hash="hash",
                role=UserRole.ADMIN
            )
            customer = User(
                full_name="Customer Coupon",
                email="customer.cp@test.com",
                phone="9876522222",
                password_hash="hash",
                role=UserRole.CUSTOMER
            )
            vehicle = Vehicle(
                name="Ertiga",
                brand="Maruti",
                model_name="Ertiga VXI",
                vehicle_number="MH12CP001",
                category=VehicleCategory.SUV,
                seating_capacity=6,
                per_km_rate=16.0,
                per_day_rate=3000.0,
                fuel_type=FuelType.PETROL,
                is_ac=True,
                is_available=True
            )
            db.add_all([admin, customer, vehicle])
            await db.commit()
            await db.refresh(admin)
            await db.refresh(customer)
            await db.refresh(vehicle)

            booking = Booking(
                booking_number="NJB-20260806-CPN1",
                customer_id=customer.id,
                vehicle_id=vehicle.id,
                trip_type=TripType.ONE_WAY,
                pickup_location="Pune",
                drop_location="Lonavala",
                pickup_date=date.today() + timedelta(days=2),
                pickup_time="09:00 AM",
                passengers=4,
                distance_km=100.0,
                estimated_duration="2 Hours",
                base_fare=2000.0,
                driver_allowance=300.0,
                gst=115.0,
                grand_total=2415.0,
                status=BookingStatus.PENDING,
                payment_status=PaymentStatus.PENDING
            )
            db.add(booking)
            await db.commit()
            await db.refresh(booking)

            admin_id = admin.id
            customer_id = customer.id
            booking_id = booking.id

        admin_token = create_access_token({"sub": admin_id, "role": "Admin"})
        cust_token = create_access_token({"sub": customer_id, "role": "Customer"})

        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        cust_headers = {"Authorization": f"Bearer {cust_token}"}

        # 2. Customer attempt to create coupon -> 403 Forbidden
        today_str = date.today().isoformat()
        next_month_str = (date.today() + timedelta(days=30)).isoformat()
        coupon_payload = {
            "coupon_code": "SAVE10",
            "title": "10 Percent Off",
            "discount_type": "Percentage",
            "discount_value": 10.0,
            "minimum_booking_amount": 1000.0,
            "maximum_discount_amount": 500.0,
            "usage_limit": 50,
            "per_user_limit": 2,
            "start_date": today_str,
            "end_date": next_month_str,
            "is_active": True
        }
        res_forbidden = await client.post("/api/v1/coupons", json=coupon_payload, headers=cust_headers)
        assert res_forbidden.status_code == 403

        # 3. Admin creates coupon -> 201 Created
        res_create = await client.post("/api/v1/coupons", json=coupon_payload, headers=admin_headers)
        assert res_create.status_code == 201
        c_data = res_create.json()["data"]
        coupon_id = c_data["id"]
        assert c_data["coupon_code"] == "SAVE10"

        # 4. Customer validates coupon -> 200 OK
        res_val = await client.post(
            "/api/v1/coupons/validate",
            json={"coupon_code": "SAVE10", "booking_amount": 2300.0},
            headers=cust_headers
        )
        assert res_val.status_code == 200
        val_data = res_val.json()["data"]
        assert val_data["is_valid"] is True
        assert val_data["calculated_discount"] == 230.0  # 10% of 2300

        # 5. Customer applies coupon to booking -> 200 OK
        res_apply = await client.post(
            "/api/v1/coupons/apply",
            json={"booking_id": booking_id, "coupon_code": "SAVE10"},
            headers=cust_headers
        )
        assert res_apply.status_code == 200
        book_res = res_apply.json()["data"]
        assert book_res["discount"] == 230.0

        # 6. Admin updates coupon -> 200 OK
        res_upd = await client.put(
            f"/api/v1/coupons/{coupon_id}",
            json={"is_active": False},
            headers=admin_headers
        )
        assert res_upd.status_code == 200
        assert res_upd.json()["data"]["is_active"] is False

        # 7. Customer validates inactive coupon -> 400 Bad Request
        res_val_inact = await client.post(
            "/api/v1/coupons/validate",
            json={"coupon_code": "SAVE10", "booking_amount": 2300.0},
            headers=cust_headers
        )
        assert res_val_inact.status_code == 400

        # 8. Admin deletes coupon -> 200 OK
        res_del = await client.delete(f"/api/v1/coupons/{coupon_id}", headers=admin_headers)
        assert res_del.status_code == 200
