from typing import Optional, Dict, Any, List
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.booking import Booking, BookingStatus, PaymentStatus


class BookingRepository:
    """
    Repository layer for isolating all Booking database operations using SQLAlchemy 2.0 Async Session.
    """

    @staticmethod
    async def get_by_id(db: AsyncSession, booking_id: str) -> Optional[Booking]:
        """Fetch a single booking by UUID primary key."""
        stmt = select(Booking).where(Booking.id == booking_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_number(db: AsyncSession, booking_number: str) -> Optional[Booking]:
        """Fetch a single booking by unique human readable booking number."""
        stmt = select(Booking).where(Booking.booking_number == booking_number)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_booking(db: AsyncSession, booking: Booking) -> Booking:
        """Persist a new Booking instance in the database."""
        db.add(booking)
        await db.commit()
        await db.refresh(booking)
        return booking

    @staticmethod
    async def list_bookings(
        db: AsyncSession,
        customer_id: Optional[str] = None,
        driver_id: Optional[str] = None,
        vehicle_id: Optional[str] = None,
        status: Optional[BookingStatus] = None,
        payment_status: Optional[PaymentStatus] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Booking]:
        """
        Fetch a paginated list of bookings with flexible filtering and search capabilities.
        """
        stmt = select(Booking)

        if customer_id:
            stmt = stmt.where(Booking.customer_id == customer_id)
        if driver_id:
            stmt = stmt.where(Booking.driver_id == driver_id)
        if vehicle_id:
            stmt = stmt.where(Booking.vehicle_id == vehicle_id)
        if status:
            stmt = stmt.where(Booking.status == status)
        if payment_status:
            stmt = stmt.where(Booking.payment_status == payment_status)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                or_(
                    Booking.booking_number.ilike(search_pattern),
                    Booking.pickup_location.ilike(search_pattern),
                    Booking.drop_location.ilike(search_pattern)
                )
            )

        stmt = stmt.order_by(Booking.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def update_booking(db: AsyncSession, booking: Booking, update_data: Dict[str, Any]) -> Booking:
        """Update and persist modified attributes of an existing booking."""
        for key, value in update_data.items():
            if value is not None and hasattr(booking, key):
                setattr(booking, key, value)
        await db.commit()
        await db.refresh(booking)
        return booking

    @staticmethod
    async def delete_booking(db: AsyncSession, booking: Booking) -> bool:
        """Hard delete a booking record from the database."""
        await db.delete(booking)
        await db.commit()
        return True
