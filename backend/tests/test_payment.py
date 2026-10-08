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
    from app.core.config import settings
    settings.RAZORPAY_KEY_ID = "rzp_test_key"
    settings.RAZORPAY_KEY_SECRET = "rzp_test_secret"
    app.dependency_overrides[get_db] = override_get_db
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_payment_order_verification_and_refund_lifecycle():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Setup seed records (Admin, Customer, Vehicle, Booking)
        async with TestingSessionLocal() as db:
            admin = User(
                full_name="Admin Pay",
                email="admin.pay@test.com",
                phone="9876588881",
                password_hash="hash",
                role=UserRole.ADMIN
            )
            customer = User(
                full_name="Customer Pay",
                email="customer.pay@test.com",
                phone="9876588882",
                password_hash="hash",
                role=UserRole.CUSTOMER
            )
            vehicle = Vehicle(
                name="Honda City",
                brand="Honda",
                model_name="City VX",
                vehicle_number="MH12PAY001",
                category=VehicleCategory.SEDAN,
                seating_capacity=4,
                per_km_rate=14.0,
                per_day_rate=2500.0,
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
                booking_number="NJB-20260806-PAY1",
                customer_id=customer.id,
                vehicle_id=vehicle.id,
                trip_type=TripType.ONE_WAY,
                pickup_location="Pune",
                drop_location="Mumbai",
                pickup_date=date.today() + timedelta(days=2),
                pickup_time="10:00 AM",
                passengers=2,
                distance_km=150.0,
                estimated_duration="3 Hours",
                base_fare=2100.0,
                driver_allowance=300.0,
                gst=120.0,
                grand_total=2520.0,
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
        customer_token = create_access_token({"sub": customer_id, "role": "Customer"})

        cust_headers = {"Authorization": f"Bearer {customer_token}"}
        admin_headers = {"Authorization": f"Bearer {admin_token}"}

        # 2. Create Razorpay Order
        order_payload = {
            "booking_id": booking_id,
            "amount": 2520.0,
            "payment_method": "UPI"
        }
        res_order = await client.post("/api/v1/payments/create-order", json=order_payload, headers=cust_headers)
        assert res_order.status_code == 201
        pay_data = res_order.json()["data"]
        payment_uuid = pay_data["id"]
        rzp_order_id = pay_data["razorpay_order_id"]
        assert rzp_order_id.startswith("order_")
        assert pay_data["status"] == "Created"

        # 3. Verify Razorpay Payment (Simulated Callback Signature)
        verify_payload = {
            "razorpay_order_id": rzp_order_id,
            "razorpay_payment_id": "pay_test_998877",
            "razorpay_signature": "test_sig_hash_998877"
        }
        res_verify = await client.post("/api/v1/payments/verify", json=verify_payload)
        assert res_verify.status_code == 200
        verify_data = res_verify.json()["data"]
        assert verify_data["status"] == "Captured"
        assert verify_data["razorpay_payment_id"] == "pay_test_998877"

        # 4. Customer views invoice
        res_inv = await client.get(f"/api/v1/payments/invoice/{payment_uuid}", headers=cust_headers)
        assert res_inv.status_code == 200
        inv_data = res_inv.json()["data"]
        assert inv_data["amount"] == 2520.0
        assert inv_data["invoice_number"].startswith("INV-")

        # 5. Customer views payment history
        res_hist = await client.get("/api/v1/payments/history", headers=cust_headers)
        assert res_hist.status_code == 200
        assert len(res_hist.json()["data"]) == 1

        # 6. Admin processes Refund
        refund_payload = {
            "payment_id": payment_uuid,
            "amount": 2520.0,
            "reason": "Customer cancellation request"
        }
        res_refund = await client.post("/api/v1/payments/refund", json=refund_payload, headers=admin_headers)
        assert res_refund.status_code == 200
        refund_data = res_refund.json()["data"]
        assert refund_data["status"] == "Refunded"
        assert refund_data["refund_amount"] == 2520.0


@pytest.mark.asyncio
async def test_payment_security_and_duplicate_prevention():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        async with TestingSessionLocal() as db:
            cust_a = User(
                full_name="Customer Alpha",
                email="alpha@test.com",
                phone="9876577771",
                password_hash="hash",
                role=UserRole.CUSTOMER
            )
            cust_b = User(
                full_name="Customer Beta",
                email="beta@test.com",
                phone="9876577772",
                password_hash="hash",
                role=UserRole.CUSTOMER
            )
            vehicle = Vehicle(
                name="Honda City",
                brand="Honda",
                model_name="City",
                vehicle_number="MH12PAY002",
                category=VehicleCategory.SEDAN,
                seating_capacity=4,
                per_km_rate=14.0,
                per_day_rate=2500.0,
                fuel_type=FuelType.PETROL,
                is_ac=True,
                is_available=True
            )
            db.add_all([cust_a, cust_b, vehicle])
            await db.commit()
            await db.refresh(cust_a)
            await db.refresh(cust_b)
            await db.refresh(vehicle)

            booking = Booking(
                booking_number="NJB-20260806-PAY2",
                customer_id=cust_a.id,
                vehicle_id=vehicle.id,
                trip_type=TripType.ONE_WAY,
                pickup_location="Pune",
                drop_location="Mumbai",
                pickup_date=date.today() + timedelta(days=2),
                pickup_time="10:00 AM",
                passengers=2,
                distance_km=150.0,
                estimated_duration="3 Hours",
                base_fare=2100.0,
                driver_allowance=300.0,
                toll_charges=0.0,
                parking_charges=0.0,
                extra_charges=0.0,
                discount=0.0,
                gst=120.0,
                grand_total=2520.0,
                status=BookingStatus.CONFIRMED,
                payment_status=PaymentStatus.PENDING
            )
            db.add(booking)
            await db.commit()
            await db.refresh(booking)
            booking_id = booking.id

        cust_a_token = create_access_token({"sub": cust_a.id, "role": "Customer"})
        cust_b_token = create_access_token({"sub": cust_b.id, "role": "Customer"})
        cust_a_headers = {"Authorization": f"Bearer {cust_a_token}"}
        cust_b_headers = {"Authorization": f"Bearer {cust_b_token}"}

        # 1. Customer B tries to pay for Customer A's booking (Security Violation Check)
        order_payload = {"booking_id": booking_id, "amount": 2520.0, "payment_method": "UPI"}
        res_sec = await client.post("/api/v1/payments/create-order", json=order_payload, headers=cust_b_headers)
        assert res_sec.status_code == 403

        # 2. Customer A creates order and verifies payment
        res_order = await client.post("/api/v1/payments/create-order", json=order_payload, headers=cust_a_headers)
        assert res_order.status_code == 201
        rzp_order_id = res_order.json()["data"]["razorpay_order_id"]

        verify_payload = {
            "razorpay_order_id": rzp_order_id,
            "razorpay_payment_id": "pay_test_777",
            "razorpay_signature": "test_sig_777"
        }
        res_verify = await client.post("/api/v1/payments/verify", json=verify_payload)
        assert res_verify.status_code == 200

        # 3. Duplicate payment attempt on already paid booking (Duplicate Prevention Check)
        res_dup = await client.post("/api/v1/payments/create-order", json=order_payload, headers=cust_a_headers)
        assert res_dup.status_code == 400



