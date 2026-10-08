import enum
import uuid
from datetime import datetime, date, timezone
from typing import Optional
from sqlalchemy import String, Boolean, DateTime, Date, Enum, Integer, Float, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.connection import Base


class DiscountType(str, enum.Enum):
    """Enumeration of coupon discount types."""
    PERCENTAGE = "Percentage"
    FIXED = "Fixed"


class Coupon(Base):
    """
    SQLAlchemy 2.0 Coupon Model for promotional discounts and offers.
    """
    __tablename__ = "coupons"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
        comment="UUID Primary Key"
    )
    coupon_code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
        comment="Uppercase unique coupon code (e.g. WELCOME100)"
    )
    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        comment="Promotional offer title"
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Detailed offer description"
    )
    discount_type: Mapped[DiscountType] = mapped_column(
        Enum(DiscountType, values_callable=lambda obj: [e.value for e in obj]),
        default=DiscountType.PERCENTAGE,
        nullable=False
    )
    discount_value: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        comment="Discount percentage value (e.g. 15.0) or fixed flat rate (e.g. 500.0)"
    )
    minimum_booking_amount: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
        comment="Minimum booking total threshold required to apply coupon"
    )
    maximum_discount_amount: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        comment="Maximum discount cap limit in INR for percentage discounts"
    )
    usage_limit: Mapped[int] = mapped_column(
        Integer,
        default=100,
        nullable=False,
        comment="Global maximum number of times coupon can be redeemed"
    )
    used_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        comment="Total times coupon has been redeemed"
    )
    per_user_limit: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
        comment="Maximum redemptions allowed per individual user"
    )
    start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        comment="Offer validity start date"
    )
    end_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        comment="Offer expiration end date"
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True
    )
    applicable_for: Mapped[str] = mapped_column(
        String(50),
        default="ALL",
        nullable=False,
        comment="Scope applicability (ALL, VEHICLE, PACKAGE)"
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

    def __repr__(self) -> str:
        return f"<Coupon(id={self.id}, code={self.coupon_code}, value={self.discount_value})>"


class CouponUsage(Base):
    """
    Tracks individual user redemption history for per_user_limit validation.
    """
    __tablename__ = "coupon_usages"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True
    )
    coupon_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("coupons.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    booking_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("bookings.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    coupon = relationship("Coupon", foreign_keys=[coupon_id], lazy="selectin")
    user = relationship("User", foreign_keys=[user_id], lazy="selectin")
