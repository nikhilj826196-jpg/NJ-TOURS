import enum
import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, DateTime, Enum, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.connection import Base


class PaymentState(str, enum.Enum):
    """Enumeration of payment status states."""
    PENDING = "Pending"
    CREATED = "Created"
    AUTHORIZED = "Authorized"
    CAPTURED = "Captured"
    FAILED = "Failed"
    REFUNDED = "Refunded"


class PaymentMethod(str, enum.Enum):
    """Enumeration of supported payment methods."""
    UPI = "UPI"
    CARD = "Card"
    NET_BANKING = "Net Banking"
    WALLET = "Wallet"
    EMI = "EMI"


class Payment(Base):
    """
    SQLAlchemy 2.0 Payment Model for NJ Tours transactions and Razorpay integration.
    """
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
        comment="UUID Primary Key"
    )
    payment_id: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        index=True,
        nullable=False,
        comment="System Payment Reference (e.g. PAY-20260806-1234)"
    )
    razorpay_order_id: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
        comment="Razorpay Order ID (order_XXXXX)"
    )
    razorpay_payment_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        unique=True,
        nullable=True,
        comment="Razorpay Payment ID (pay_XXXXX)"
    )
    razorpay_signature: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Razorpay HMAC SHA256 Signature"
    )

    # Foreign Keys
    booking_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("bookings.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="Associated Booking ID"
    )
    customer_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Customer User ID"
    )

    # Amounts & Currency
    amount: Mapped[float] = mapped_column(Float, nullable=False, comment="Transaction amount in INR")
    currency: Mapped[str] = mapped_column(String(10), default="INR", nullable=False)
    payment_method: Mapped[PaymentMethod] = mapped_column(
        Enum(PaymentMethod, values_callable=lambda obj: [e.value for e in obj]),
        default=PaymentMethod.UPI,
        nullable=False
    )
    status: Mapped[PaymentState] = mapped_column(
        Enum(PaymentState, values_callable=lambda obj: [e.value for e in obj]),
        default=PaymentState.CREATED,
        nullable=False,
        index=True
    )

    refund_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    transaction_fee: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    gst: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    invoice_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
        comment="Tax Invoice Number (e.g. INV-20260806-9812)"
    )
    receipt_number: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Receipt reference number"
    )
    failure_reason: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Reason if payment failed"
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
    booking = relationship("Booking", foreign_keys=[booking_id], lazy="selectin")

    def __repr__(self) -> str:
        return f"<Payment(id={self.id}, rzp_order={self.razorpay_order_id}, status={self.status})>"
