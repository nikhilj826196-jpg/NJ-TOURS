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
async def test_review_creation_admin_reply_and_validation():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Setup seed records (Admin, Customer, Vehicle, Completed Booking, Pending Booking)
        async with TestingSessionLocal() as db:
            admin = User(
                full_name="Admin Review",
                email="admin.rev@test.com",
                phone="9876511111",
                password_hash="hash",
                role=UserRole.ADMIN
            )
            customer = User(
                full_name="Customer Review",
                email="cust.rev@test.com",
                phone="9876511112",
                password_hash="hash",
                role=UserRole.CUSTOMER
            )
            vehicle = Vehicle(
                name="Fortuner",
                brand="Toyota",
                model_name="Fortuner 4x4",
                vehicle_number="MH12REV001",
                category=VehicleCategory.SUV,
                seating_capacity=7,
                per_km_rate=22.0,
                per_day_rate=4500.0,
                fuel_type=FuelType.DIESEL,
                is_ac=True,
                is_available=True
            )
            db.add_all([admin, customer, vehicle])
            await db.commit()
            await db.refresh(admin)
            await db.refresh(customer)
            await db.refresh(vehicle)

            completed_booking = Booking(
                booking_number="NJB-20260806-REV1",
                customer_id=customer.id,
                vehicle_id=vehicle.id,
                trip_type=TripType.ONE_WAY,
                pickup_location="Pune",
                drop_location="Goa",
                pickup_date=date.today() - timedelta(days=2),
                pickup_time="07:00 AM",
                passengers=5,
                distance_km=450.0,
                estimated_duration="9 Hours",
                base_fare=9900.0,
                driver_allowance=300.0,
                gst=510.0,
                grand_total=10710.0,
                status=BookingStatus.COMPLETED,
                payment_status=PaymentStatus.PAID
            )
            pending_booking = Booking(
                booking_number="NJB-20260806-REV2",
                customer_id=customer.id,
                vehicle_id=vehicle.id,
                trip_type=TripType.ONE_WAY,
                pickup_location="Pune",
                drop_location="Nashik",
                pickup_date=date.today() + timedelta(days=1),
                pickup_time="08:00 AM",
                passengers=2,
                distance_km=200.0,
                estimated_duration="4 Hours",
                base_fare=4400.0,
                driver_allowance=300.0,
                gst=235.0,
                grand_total=4935.0,
                status=BookingStatus.PENDING,
                payment_status=PaymentStatus.PENDING
            )
            db.add_all([completed_booking, pending_booking])
            await db.commit()
            await db.refresh(completed_booking)
            await db.refresh(pending_booking)

            admin_id = admin.id
            cust_id = customer.id
            comp_id = completed_booking.id
            pend_id = pending_booking.id

        admin_token = create_access_token({"sub": admin_id, "role": "Admin"})
        cust_token = create_access_token({"sub": cust_id, "role": "Customer"})

        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        cust_headers = {"Authorization": f"Bearer {cust_token}"}

        # 2. Customer attempts to review pending booking -> 400 Bad Request
        res_pend_err = await client.post(
            "/api/v1/reviews",
            json={"booking_id": pend_id, "rating": 5, "title": "Great", "review": "Loved the ride!"},
            headers=cust_headers
        )
        assert res_pend_err.status_code == 400

        # 3. Customer submits review for completed booking -> 201 Created
        review_payload = {
            "booking_id": comp_id,
            "rating": 5,
            "title": "Outstanding Goa trip!",
            "review": "The Toyota Fortuner was in pristine condition and ride was ultra smooth."
        }
        res_create = await client.post("/api/v1/reviews", json=review_payload, headers=cust_headers)
        assert res_create.status_code == 201
        r_data = res_create.json()["data"]
        review_id = r_data["id"]
        assert r_data["rating"] == 5
        assert r_data["is_verified_purchase"] is True

        # 4. Customer attempts duplicate review -> 400 Bad Request
        res_dup = await client.post("/api/v1/reviews", json=review_payload, headers=cust_headers)
        assert res_dup.status_code == 400

        # 5. Customer views own reviews (/my) -> 200 OK
        res_my = await client.get("/api/v1/reviews/my", headers=cust_headers)
        assert res_my.status_code == 200
        assert len(res_my.json()["data"]) == 1

        # 6. Admin posts official reply -> 200 OK
        res_reply = await client.post(
            f"/api/v1/reviews/{review_id}/reply",
            json={"admin_reply": "Thank you for riding with NJ Tours! We look forward to serving you again."},
            headers=admin_headers
        )
        assert res_reply.status_code == 200
        assert "Thank you" in res_reply.json()["data"]["admin_reply"]

        # 7. Admin features review -> 200 OK
        res_feat = await client.put(f"/api/v1/reviews/{review_id}/feature?is_featured=true", headers=admin_headers)
        assert res_feat.status_code == 200
        assert res_feat.json()["data"]["is_featured"] is True

        # 8. Public list reviews -> 200 OK
        res_list = await client.get("/api/v1/reviews?is_featured=true")
        assert res_list.status_code == 200
        assert len(res_list.json()["data"]) == 1
