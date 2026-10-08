import enum
import uuid
from datetime import datetime, date, timezone
from typing import Optional
from sqlalchemy import String, Boolean, DateTime, Date, Enum, Integer, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.connection import Base


class TripType(str, enum.Enum):
    """Enumeration of trip types."""
    ONE_WAY = "One Way"
    ROUND_TRIP = "Round Trip"
    LOCAL = "Local"
    AIRPORT = "Airport"


class BookingStatus(str, enum.Enum):
    """Enumeration of booking status values."""
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    ASSIGNED = "Assigned"
    STARTED = "Started"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"


class PaymentStatus(str, enum.Enum):
    """Enumeration of payment status values."""
    PENDING = "Pending"
    PAID = "Paid"
    REFUNDED = "Refunded"


class Booking(Base):
    """
    SQLAlchemy 2.0 Booking Model for NJ Tours reservation management.
    """
    __tablename__ = "bookings"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
        comment="UUID Primary Key"
    )
    booking_number: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        index=True,
        nullable=False,
        comment="Unique Human Readable Booking Code (e.g. NJB-20260806-1234)"
    )

    # Foreign Keys
    customer_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Customer User ID"
    )
    driver_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="Assigned Driver User ID"
    )
    vehicle_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("vehicles.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
        comment="Assigned Vehicle ID"
    )

    # Trip Details
    trip_type: Mapped[TripType] = mapped_column(
        Enum(TripType, values_callable=lambda obj: [e.value for e in obj]),
        default=TripType.ONE_WAY,
        nullable=False,
        comment="Type of trip (One Way, Round Trip, Local, Airport)"
    )
    pickup_location: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Pickup address or location"
    )
    drop_location: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Drop address or location"
    )
    pickup_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        comment="Date of pickup"
    )
    pickup_time: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        comment="Time of pickup (e.g. 09:00 AM)"
    )
    return_date: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True,
        comment="Return date for Round Trip bookings"
    )
    passengers: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
        comment="Number of passengers"
    )
    distance_km: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
        comment="Estimated trip distance in kilometers"
    )
    estimated_duration: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="1 Hour",
        comment="Estimated trip duration"
    )

    # Pricing Breakdown
    base_fare: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    driver_allowance: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    toll_charges: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    parking_charges: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    extra_charges: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    discount: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    gst: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    grand_total: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)

    # Status
    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus, values_callable=lambda obj: [e.value for e in obj]),
        default=BookingStatus.PENDING,
        nullable=False,
        index=True
    )
    payment_status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, values_callable=lambda obj: [e.value for e in obj]),
        default=PaymentStatus.PENDING,
        nullable=False,
        index=True
    )

    cancellation_reason: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Reason for booking cancellation"
    )
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        comment="Timestamp of cancellation"
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    customer = relationship("User", foreign_keys=[customer_id], lazy="selectin")
    driver = relationship("User", foreign_keys=[driver_id], lazy="selectin")
    vehicle = relationship("Vehicle", foreign_keys=[vehicle_id], lazy="selectin")

    def __repr__(self) -> str:
        return f"<Booking(id={self.id}, number={self.booking_number}, status={self.status})>"
