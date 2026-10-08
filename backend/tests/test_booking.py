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
from app.models.booking import BookingStatus

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
async def test_booking_full_lifecycle():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Setup seed records (Admin, Customer, Driver, Vehicle)
        async with TestingSessionLocal() as db:
            admin = User(
                full_name="Admin User",
                email="admin.b@test.com",
                phone="9876500001",
                password_hash="hash",
                role=UserRole.ADMIN
            )
            customer = User(
                full_name="Customer User",
                email="customer.b@test.com",
                phone="9876500002",
                password_hash="hash",
                role=UserRole.CUSTOMER
            )
            driver = User(
                full_name="Driver User",
                email="driver.b@test.com",
                phone="9876500003",
                password_hash="hash",
                role=UserRole.DRIVER
            )
            vehicle = Vehicle(
                name="Innova Crysta",
                brand="Toyota",
                model_name="Crysta",
                vehicle_number="MH14AZ9999",
                category=VehicleCategory.SUV,
                seating_capacity=7,
                per_km_rate=20.0,
                per_day_rate=4000.0,
                fuel_type=FuelType.DIESEL,
                is_ac=True,
                is_available=True
            )
            db.add_all([admin, customer, driver, vehicle])
            await db.commit()
            await db.refresh(admin)
            await db.refresh(customer)
            await db.refresh(driver)
            await db.refresh(vehicle)

            admin_id = admin.id
            customer_id = customer.id
            driver_id = driver.id
            vehicle_id = vehicle.id

        admin_token = create_access_token({"sub": admin_id, "role": "Admin"})
        customer_token = create_access_token({"sub": customer_id, "role": "Customer"})
        driver_token = create_access_token({"sub": driver_id, "role": "Driver"})

        customer_headers = {"Authorization": f"Bearer {customer_token}"}
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        driver_headers = {"Authorization": f"Bearer {driver_token}"}

        # 2. Calculate Price Estimate
        calc_payload = {
            "vehicle_id": vehicle_id,
            "trip_type": "One Way",
            "distance_km": 100.0,
            "days": 1
        }
        res_calc = await client.post("/api/v1/bookings/calculate-price", json=calc_payload)
        assert res_calc.status_code == 200
        calc_data = res_calc.json()["data"]
        assert calc_data["grand_total"] > 0

        # 3. Create Booking as Customer
        tomorrow = (date.today() + timedelta(days=1)).isoformat()
        booking_payload = {
            "vehicle_id": vehicle_id,
            "trip_type": "One Way",
            "pickup_location": "Pune Station",
            "drop_location": "Mumbai Airport",
            "pickup_date": tomorrow,
            "pickup_time": "08:00 AM",
            "passengers": 4,
            "distance_km": 150.0,
            "estimated_duration": "3 Hours"
        }
        res_book = await client.post("/api/v1/bookings", json=booking_payload, headers=customer_headers)
        assert res_book.status_code == 201
        book_data = res_book.json()["data"]
        booking_id = book_data["id"]
        assert book_data["status"] == "Pending"
        assert book_data["booking_number"].startswith("NJB-")

        # 4. Admin Assigns Driver
        res_assign = await client.put(
            f"/api/v1/bookings/{booking_id}/assign-driver",
            json={"driver_id": driver_id},
            headers=admin_headers
        )
        assert res_assign.status_code == 200
        assert res_assign.json()["data"]["driver_id"] == driver_id
        assert res_assign.json()["data"]["status"] == "Assigned"

        # 5. Driver Views Assigned Bookings
        res_driver_list = await client.get("/api/v1/bookings", headers=driver_headers)
        assert res_driver_list.status_code == 200
        assert len(res_driver_list.json()["data"]) == 1

        # 6. Driver Updates Status to Completed
        res_status = await client.put(
            f"/api/v1/bookings/{booking_id}/status",
            json={"status": "Completed", "payment_status": "Paid"},
            headers=driver_headers
        )
        assert res_status.status_code == 200
        assert res_status.json()["data"]["status"] == "Completed"
        assert res_status.json()["data"]["payment_status"] == "Paid"

        # 7. Test Admin General Update Endpoint (PUT /bookings/{booking_id})
        # Add a new vehicle to test vehicle assignment update
        async with TestingSessionLocal() as db:
            new_vehicle = Vehicle(
                name="Fortuner",
                brand="Toyota",
                model_name="Fortuner",
                vehicle_number="MH14AZ8888",
                category=VehicleCategory.SUV,
                seating_capacity=7,
                per_km_rate=30.0,
                per_day_rate=6000.0,
                fuel_type=FuelType.DIESEL,
                is_ac=True,
                is_available=True
            )
            db.add(new_vehicle)
            await db.commit()
            await db.refresh(new_vehicle)
            new_vehicle_id = new_vehicle.id

        res_update = await client.put(
            f"/api/v1/bookings/{booking_id}",
            json={
                "vehicle_id": new_vehicle_id,
                "status": "Confirmed",
                "payment_status": "Paid"
            },
            headers=admin_headers
        )
        assert res_update.status_code == 200
        assert res_update.json()["data"]["vehicle_id"] == new_vehicle_id
        assert res_update.json()["data"]["status"] == "Confirmed"
        assert res_update.json()["data"]["payment_status"] == "Paid"

        # 8. Test Non-Admin Rejection on Update Endpoint
        res_update_fail = await client.put(
            f"/api/v1/bookings/{booking_id}",
            json={"status": "Confirmed"},
            headers=customer_headers
        )
        assert res_update_fail.status_code == 403


@pytest.mark.asyncio
async def test_booking_cancellation_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Setup seed records (Customer A, Customer B, Admin, Vehicle)
        async with TestingSessionLocal() as db:
            cust_a = User(
                full_name="Customer A",
                email="cust_a@test.com",
                phone="9876500010",
                password_hash="hash",
                role=UserRole.CUSTOMER
            )
            cust_b = User(
                full_name="Customer B",
                email="cust_b@test.com",
                phone="9876500011",
                password_hash="hash",
                role=UserRole.CUSTOMER
            )
            vehicle = Vehicle(
                name="Innova Crysta",
                brand="Toyota",
                model_name="Crysta",
                vehicle_number="MH14AZ9991",
                category=VehicleCategory.SUV,
                seating_capacity=7,
                per_km_rate=20.0,
                per_day_rate=4000.0,
                fuel_type=FuelType.DIESEL,
                is_ac=True,
                is_available=True
            )
            db.add_all([cust_a, cust_b, vehicle])
            await db.commit()
            await db.refresh(cust_a)
            await db.refresh(cust_b)
            await db.refresh(vehicle)
            cust_a_id = cust_a.id
            cust_b_id = cust_b.id
            vehicle_id = vehicle.id

        cust_a_token = create_access_token({"sub": cust_a_id, "role": "Customer"})
        cust_b_token = create_access_token({"sub": cust_b_id, "role": "Customer"})

        cust_a_headers = {"Authorization": f"Bearer {cust_a_token}"}
        cust_b_headers = {"Authorization": f"Bearer {cust_b_token}"}

        # 1. Create a booking for Customer A
        tomorrow = (date.today() + timedelta(days=1)).isoformat()
        booking_payload = {
            "vehicle_id": vehicle_id,
            "trip_type": "One Way",
            "pickup_location": "Pune Station",
            "drop_location": "Mumbai Airport",
            "pickup_date": tomorrow,
            "pickup_time": "08:00 AM",
            "passengers": 4,
            "distance_km": 150.0,
            "estimated_duration": "3 Hours"
        }
        res_book = await client.post("/api/v1/bookings", json=booking_payload, headers=cust_a_headers)
        assert res_book.status_code == 201
        booking_id = res_book.json()["data"]["id"]
        assert res_book.json()["data"]["status"] == "Pending"

        # 2. Test Customer B tries to cancel Customer A's booking (Security check)
        res_cancel_b = await client.post(
            f"/api/v1/bookings/{booking_id}/cancel",
            json={"reason": "Malicious attempt"},
            headers=cust_b_headers
        )
        assert res_cancel_b.status_code == 403

        # 3. Test Customer A cancels their own booking
        res_cancel_a = await client.post(
            f"/api/v1/bookings/{booking_id}/cancel",
            json={"reason": "Found another vehicle"},
            headers=cust_a_headers
        )
        assert res_cancel_a.status_code == 200
        cancel_data = res_cancel_a.json()["data"]
        assert cancel_data["status"] == "Cancelled"
        assert cancel_data["cancellation_reason"] == "Found another vehicle"
        assert cancel_data["cancelled_at"] is not None

        # 4. Test Customer A tries to cancel the same booking twice
        res_cancel_twice = await client.post(
            f"/api/v1/bookings/{booking_id}/cancel",
            json={"reason": "Cancel again"},
            headers=cust_a_headers
        )
        assert res_cancel_twice.status_code == 400

        # 5. Test cancelling a completed booking is rejected
        res_book_2 = await client.post("/api/v1/bookings", json=booking_payload, headers=cust_a_headers)
        assert res_book_2.status_code == 201
        booking_id_2 = res_book_2.json()["data"]["id"]

        # Directly update booking status to Completed in DB for testing
        async with TestingSessionLocal() as db:
            from app.models.booking import Booking, BookingStatus
            from sqlalchemy import update
            await db.execute(
                update(Booking)
                .where(Booking.id == booking_id_2)
                .values(status=BookingStatus.COMPLETED)
            )
            await db.commit()

        # Try to cancel the completed booking
        res_cancel_completed = await client.post(
            f"/api/v1/bookings/{booking_id_2}/cancel",
            json={"reason": "Cancel completed"},
            headers=cust_a_headers
        )
        assert res_cancel_completed.status_code == 400

        # 6. Test 404 for non-existent booking
        res_cancel_404 = await client.post(
            "/api/v1/bookings/00000000-0000-0000-0000-000000000000/cancel",
            json={"reason": "Non-existent"},
            headers=cust_a_headers
        )
        assert res_cancel_404.status_code == 404

