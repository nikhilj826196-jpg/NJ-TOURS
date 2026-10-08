import enum
import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Boolean, DateTime, Enum, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.connection import Base


class NotificationChannel(str, enum.Enum):
    """Enumeration of notification delivery channels."""
    EMAIL = "Email"
    SMS = "SMS"
    WHATSAPP = "WhatsApp"
    PUSH = "Push"


class NotificationType(str, enum.Enum):
    """Enumeration of notification types."""
    BOOKING_CREATED = "Booking Created"
    BOOKING_CONFIRMED = "Booking Confirmed"
    BOOKING_CANCELLED = "Booking Cancelled"
    PAYMENT_SUCCESS = "Payment Success"
    PAYMENT_FAILED = "Payment Failed"
    REFUND_PROCESSED = "Refund Processed"
    DRIVER_ASSIGNED = "Driver Assigned"
    TRIP_STARTED = "Trip Started"
    TRIP_COMPLETED = "Trip Completed"
    WELCOME = "Welcome Email"
    PASSWORD_RESET = "Password Reset"


class NotificationStatus(str, enum.Enum):
    """Enumeration of notification delivery status."""
    PENDING = "Pending"
    SENT = "Sent"
    DELIVERED = "Delivered"
    FAILED = "Failed"


class Notification(Base):
    """
    SQLAlchemy 2.0 Notification Model for tracking Email, SMS, and WhatsApp messaging logs.
    """
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
        comment="UUID Primary Key"
    )
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Target User ID"
    )
    booking_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("bookings.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="Associated Booking ID"
    )
    payment_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("payments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="Associated Payment ID"
    )
    channel: Mapped[NotificationChannel] = mapped_column(
        Enum(NotificationChannel, values_callable=lambda obj: [e.value for e in obj]),
        default=NotificationChannel.EMAIL,
        nullable=False,
        index=True
    )
    type: Mapped[NotificationType] = mapped_column(
        Enum(NotificationType, values_callable=lambda obj: [e.value for e in obj]),
        default=NotificationType.BOOKING_CREATED,
        nullable=False,
        index=True
    )

    subject: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    template_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    status: Mapped[NotificationStatus] = mapped_column(
        Enum(NotificationStatus, values_callable=lambda obj: [e.value for e in obj]),
        default=NotificationStatus.PENDING,
        nullable=False,
        index=True
    )
    provider_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    retry_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    sent_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    # Relationships
    user = relationship("User", foreign_keys=[user_id], lazy="selectin")
    booking = relationship("Booking", foreign_keys=[booking_id], lazy="selectin")
    payment = relationship("Payment", foreign_keys=[payment_id], lazy="selectin")

    def __repr__(self) -> str:
        return f"<Notification(id={self.id}, channel={self.channel}, type={self.type}, status={self.status})>"
