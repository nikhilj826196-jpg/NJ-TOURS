import random
import string
from datetime import datetime, date, timezone
from typing import Optional, List, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.booking import Booking, BookingStatus, PaymentStatus, TripType
from app.models.user import User, UserRole
from app.models.vehicle import Vehicle
from app.repositories.booking_repository import BookingRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.repositories.user_repository import UserRepository
from app.schemas.booking import (
    BookingCreate,
    BookingUpdate,
    BookingResponse,
    PriceCalculationRequest,
    PriceCalculationResponse,
)


class BookingService:
    """
    Service layer containing business logic for NJ Tours trip reservations and pricing calculations.
    """

    @staticmethod
    def generate_booking_number() -> str:
        """Generates a unique human readable booking code (e.g. NJB-20260806-9821)."""
        date_str = datetime.now().strftime("%Y%m%d")
        random_suffix = "".join(random.choices(string.digits, k=4))
        return f"NJB-{date_str}-{random_suffix}"

    @staticmethod
    async def calculate_price(db: AsyncSession, req: PriceCalculationRequest) -> PriceCalculationResponse:
        """
        Calculates trip fare breakdown based on distance, rates, and duration.
        """
        vehicle = await VehicleRepository.get_by_id(db, req.vehicle_id)
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found for pricing calculation"
            )

        # Base fare calculation
        km_fare = req.distance_km * vehicle.per_km_rate
        day_fare = req.days * vehicle.per_day_rate
        base_fare = max(km_fare, day_fare)

        driver_allowance = 300.0 * req.days
        toll_charges = 0.0
        parking_charges = 0.0
        extra_charges = 0.0
        discount = 0.0

        subtotal = base_fare + driver_allowance + toll_charges + parking_charges + extra_charges - discount
        gst = round(subtotal * 0.05, 2)  # 5% GST for transport
        grand_total = round(subtotal + gst, 2)

        return PriceCalculationResponse(
            base_fare=round(base_fare, 2),
            driver_allowance=round(driver_allowance, 2),
            toll_charges=toll_charges,
            parking_charges=parking_charges,
            extra_charges=extra_charges,
            discount=discount,
            gst=gst,
            grand_total=grand_total
        )

    @staticmethod
    async def create_booking(db: AsyncSession, customer: User, booking_create: BookingCreate) -> BookingResponse:
        """
        Validates vehicle availability, passenger limit, and creates a new booking.
        """
        vehicle = await VehicleRepository.get_by_id(db, booking_create.vehicle_id)
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found"
            )

        if not vehicle.is_available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Vehicle '{vehicle.name}' is currently unavailable for booking"
            )

        if booking_create.passengers > vehicle.seating_capacity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Passenger count ({booking_create.passengers}) exceeds vehicle seating capacity ({vehicle.seating_capacity})"
            )

        # Calculate pricing
        calc_req = PriceCalculationRequest(
            vehicle_id=vehicle.id,
            trip_type=booking_create.trip_type,
            distance_km=booking_create.distance_km,
            days=1
        )
        pricing = await BookingService.calculate_price(db, calc_req)

        # Unique booking number generation
        booking_number = BookingService.generate_booking_number()

        booking = Booking(
            booking_number=booking_number,
            customer_id=customer.id,
            vehicle_id=vehicle.id,
            trip_type=booking_create.trip_type,
            pickup_location=booking_create.pickup_location,
            drop_location=booking_create.drop_location,
            pickup_date=booking_create.pickup_date,
            pickup_time=booking_create.pickup_time,
            return_date=booking_create.return_date,
            passengers=booking_create.passengers,
            distance_km=booking_create.distance_km,
            estimated_duration=booking_create.estimated_duration,
            base_fare=pricing.base_fare,
            driver_allowance=pricing.driver_allowance,
            toll_charges=pricing.toll_charges,
            parking_charges=pricing.parking_charges,
            extra_charges=pricing.extra_charges,
            discount=pricing.discount,
            gst=pricing.gst,
            grand_total=pricing.grand_total,
            status=BookingStatus.PENDING,
            payment_status=PaymentStatus.PENDING
        )

        saved_booking = await BookingRepository.create_booking(db, booking)
        return BookingResponse.model_validate(saved_booking)

    @staticmethod
    async def get_booking_by_id(db: AsyncSession, booking_id: str, current_user: User) -> BookingResponse:
        """
        Retrieves booking by ID with ownership/RBAC validation.
        """
        booking = await BookingRepository.get_by_id(db, booking_id)
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )

        # RBAC Check: Customers can only view their own bookings; Drivers can only view assigned bookings
        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        if user_role == UserRole.CUSTOMER.value and booking.customer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden: You can only view your own bookings"
            )
        if user_role == UserRole.DRIVER.value and booking.driver_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden: You can only view assigned driver bookings"
            )

        return BookingResponse.model_validate(booking)

    @staticmethod
    async def assign_driver(db: AsyncSession, booking_id: str, driver_id: str) -> BookingResponse:
        """
        Assigns a driver to an existing booking (Admin functionality).
        """
        booking = await BookingRepository.get_by_id(db, booking_id)
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )

        driver = await UserRepository.get_by_id(db, driver_id)
        if not driver:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Driver user not found"
            )

        driver_role = driver.role.value if hasattr(driver.role, 'value') else str(driver.role)
        if driver_role not in [UserRole.DRIVER.value, UserRole.ADMIN.value]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assigned user must have Driver or Admin role"
            )

        if not driver.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assigned driver account is inactive"
            )

        updated_booking = await BookingRepository.update_booking(
            db, booking, {"driver_id": driver.id, "status": BookingStatus.ASSIGNED}
        )
        return BookingResponse.model_validate(updated_booking)

    @staticmethod
    async def update_booking_status(
        db: AsyncSession,
        booking_id: str,
        new_status: BookingStatus,
        payment_status: Optional[PaymentStatus],
        current_user: User
    ) -> BookingResponse:
        """
        Updates booking status with proper permission and transition rules.
        """
        booking = await BookingRepository.get_by_id(db, booking_id)
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )

        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)

        # Customers can only cancel their own pending/confirmed bookings
        if user_role == UserRole.CUSTOMER.value:
            if booking.customer_id != current_user.id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
            if new_status != BookingStatus.CANCELLED:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Customers can only cancel bookings")

        update_dict: dict[str, Any] = {"status": new_status}
        if payment_status:
            update_dict["payment_status"] = payment_status

        updated_booking = await BookingRepository.update_booking(db, booking, update_dict)
        return BookingResponse.model_validate(updated_booking)

    @staticmethod
    async def list_bookings(
        db: AsyncSession,
        current_user: User,
        status: Optional[BookingStatus] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[BookingResponse]:
        """
        Lists bookings tailored to current user role permissions (Customer, Driver, Admin).
        """
        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)

        customer_id = None
        driver_id = None

        if user_role == UserRole.CUSTOMER.value:
            customer_id = current_user.id
        elif user_role == UserRole.DRIVER.value:
            driver_id = current_user.id

        bookings = await BookingRepository.list_bookings(
            db=db,
            customer_id=customer_id,
            driver_id=driver_id,
            status=status,
            search=search,
            skip=skip,
            limit=limit
        )
        return [BookingResponse.model_validate(b) for b in bookings]

    @staticmethod
    async def admin_update_booking(
        db: AsyncSession,
        booking_id: str,
        booking_update: BookingUpdate
    ) -> BookingResponse:
        """
        Updates booking parameters including driver and vehicle assignment (Admin Only).
        """
        booking = await BookingRepository.get_by_id(db, booking_id)
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )

        update_dict = booking_update.model_dump(exclude_unset=True)

        # Validate driver if being assigned
        if "driver_id" in update_dict and update_dict["driver_id"]:
            driver = await UserRepository.get_by_id(db, update_dict["driver_id"])
            if not driver:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Driver user not found"
                )
            driver_role = driver.role.value if hasattr(driver.role, 'value') else str(driver.role)
            if driver_role not in [UserRole.DRIVER.value, UserRole.ADMIN.value]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Assigned user must be a Driver"
                )
            if not driver.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Assigned driver account is inactive"
                )

        # Validate vehicle if being assigned
        if "vehicle_id" in update_dict and update_dict["vehicle_id"]:
            vehicle = await VehicleRepository.get_by_id(db, update_dict["vehicle_id"])
            if not vehicle:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Vehicle not found"
                )
            if not vehicle.is_available:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Vehicle '{vehicle.name}' is currently unavailable"
                )

        updated_booking = await BookingRepository.update_booking(db, booking, update_dict)
        return BookingResponse.model_validate(updated_booking)

    @staticmethod
    async def cancel_booking(
        db: AsyncSession,
        booking_id: str,
        reason: str,
        current_user: User
    ) -> BookingResponse:
        """
        Cancels a booking, verifying ownership/permissions and booking status.
        """
        booking = await BookingRepository.get_by_id(db, booking_id)
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )

        # RBAC and Ownership Check: Customers can only cancel their own bookings; Admins can cancel any
        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        if user_role == UserRole.CUSTOMER.value:
            if booking.customer_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Forbidden: You are not authorized to cancel this booking"
                )
        elif user_role != UserRole.ADMIN.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden: You are not authorized to cancel this booking"
            )

        # Validate current status: only Pending or Confirmed bookings can be cancelled
        if booking.status not in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Booking cannot be cancelled because of its current status: '{booking.status.value}'"
            )

        # Perform status update
        update_data = {
            "status": BookingStatus.CANCELLED,
            "cancellation_reason": reason,
            "cancelled_at": datetime.now(timezone.utc)
        }
        updated_booking = await BookingRepository.update_booking(db, booking, update_data)
        return BookingResponse.model_validate(updated_booking)
