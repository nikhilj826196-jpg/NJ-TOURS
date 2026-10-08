import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Boolean, DateTime, Float, Integer, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.connection import Base


class TourPackage(Base):
    """
    SQLAlchemy 2.0 Tour Package Model for NJ Tours holiday and itinerary management.
    """
    __tablename__ = "tour_packages"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
        comment="UUID Primary Key"
    )
    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        comment="Package title name (e.g. Chardham Yatra 10 Days)"
    )
    slug: Mapped[str] = mapped_column(
        String(180),
        unique=True,
        index=True,
        nullable=False,
        comment="URL friendly slug identifier"
    )
    category: Mapped[str] = mapped_column(
        String(50),
        index=True,
        nullable=False,
        default="General",
        comment="Category (Pilgrimage, Hill Station, Heritage, Beach, Wildlife)"
    )
    destination: Mapped[str] = mapped_column(
        String(100),
        index=True,
        nullable=False,
        comment="Primary destination city/area"
    )
    state: Mapped[str] = mapped_column(
        String(50),
        index=True,
        nullable=False,
        comment="State (e.g. Uttarakhand, Himachal Pradesh, Maharashtra)"
    )
    duration: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Duration string (e.g. 5 Days / 4 Nights)"
    )
    price: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        comment="Regular package price per person in INR"
    )
    offer_price: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        comment="Discounted offer price per person in INR"
    )
    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Full detailed description of tour package"
    )
    highlights: Mapped[Optional[List[str]]] = mapped_column(
        JSON,
        nullable=True,
        comment="JSON list of key tour highlights"
    )
    inclusions: Mapped[Optional[List[str]]] = mapped_column(
        JSON,
        nullable=True,
        comment="JSON list of what is included (Hotels, Meals, Cab)"
    )
    exclusions: Mapped[Optional[List[str]]] = mapped_column(
        JSON,
        nullable=True,
        comment="JSON list of what is excluded (Flight, Personal Expenses)"
    )
    itinerary: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(
        JSON,
        nullable=True,
        comment="JSON list of day-wise itinerary schedule"
    )
    pickup_city: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="Pune",
        comment="Departure pickup city"
    )
    cover_image: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        comment="Main banner photo image URL"
    )
    images: Mapped[Optional[List[str]]] = mapped_column(
        JSON,
        nullable=True,
        comment="Gallery image URLs"
    )
    max_persons: Mapped[int] = mapped_column(
        Integer,
        default=20,
        nullable=False
    )
    min_persons: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False
    )
    available_seats: Mapped[int] = mapped_column(
        Integer,
        default=20,
        nullable=False
    )
    rating: Mapped[float] = mapped_column(
        Float,
        default=5.0,
        nullable=False
    )
    reviews_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True
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
        return f"<TourPackage(id={self.id}, name={self.name}, price={self.price})>"
