import uuid
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, Boolean, DateTime, Integer, Text, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.connection import Base


class Review(Base):
    """
    SQLAlchemy 2.0 Review Model for customer feedback, ratings, and testimonials.
    """
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
        comment="UUID Primary Key"
    )
    customer_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Customer User ID"
    )
    booking_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("bookings.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
        comment="Associated completed booking ID (1 review per booking)"
    )
    vehicle_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("vehicles.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    driver_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    package_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("tour_packages.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    rating: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        comment="Rating scale 1 to 5"
    )
    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        comment="Review headline title"
    )
    review: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Detailed customer review comment"
    )
    images: Mapped[Optional[List[str]]] = mapped_column(
        JSON,
        nullable=True,
        comment="JSON list of uploaded review photo URLs"
    )

    is_verified_purchase: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True
    )
    is_visible: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True
    )

    admin_reply: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Official admin response text"
    )
    helpful_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    reported_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
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
    vehicle = relationship("Vehicle", foreign_keys=[vehicle_id], lazy="selectin")
    driver = relationship("User", foreign_keys=[driver_id], lazy="selectin")
    package = relationship("TourPackage", foreign_keys=[package_id], lazy="selectin")

    def __repr__(self) -> str:
        return f"<Review(id={self.id}, rating={self.rating}, title={self.title})>"
