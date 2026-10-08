import enum
import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Boolean, DateTime, Enum, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.database.connection import Base


class VehicleCategory(str, enum.Enum):
    """Enumeration of vehicle categories."""
    HATCHBACK = "Hatchback"
    SEDAN = "Sedan"
    SUV = "SUV"
    TEMPO_TRAVELLER = "Tempo Traveller"
    MINI_BUS = "Mini Bus"
    BUS = "Bus"
    LUXURY = "Luxury"


class FuelType(str, enum.Enum):
    """Enumeration of vehicle fuel types."""
    DIESEL = "Diesel"
    PETROL = "Petrol"
    ELECTRIC = "Electric"
    CNG = "CNG"


class Vehicle(Base):
    """
    SQLAlchemy 2.0 Vehicle Model for NJ Tours fleet management.
    Stores vehicle specs, registration number, rates, and availability.
    """
    __tablename__ = "vehicles"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
        comment="UUID Primary Key"
    )
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="Display name of vehicle (e.g. Toyota Innova Crysta)"
    )
    brand: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Brand/Manufacturer (e.g. Toyota, Force, Maruti)"
    )
    model_name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Specific vehicle model"
    )
    vehicle_number: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        index=True,
        nullable=False,
        comment="Registration plate number (e.g. MH 12 AB 1234)"
    )
    category: Mapped[VehicleCategory] = mapped_column(
        Enum(VehicleCategory, values_callable=lambda obj: [e.value for e in obj]),
        default=VehicleCategory.SUV,
        nullable=False,
        index=True,
        comment="Vehicle category type"
    )
    seating_capacity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        comment="Total passenger seating capacity"
    )
    per_km_rate: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        comment="Rental billing rate per kilometer"
    )
    per_day_rate: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        comment="Flat daily rental billing rate"
    )
    fuel_type: Mapped[FuelType] = mapped_column(
        Enum(FuelType, values_callable=lambda obj: [e.value for e in obj]),
        default=FuelType.DIESEL,
        nullable=False,
        comment="Fuel variant"
    )
    is_ac: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        comment="Air conditioning feature flag"
    )
    is_available: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        comment="Availability flag for booking assignment"
    )
    image_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        comment="URL path to vehicle photo image"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        comment="Record creation timestamp"
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
        comment="Record last update timestamp"
    )

    def __repr__(self) -> str:
        return f"<Vehicle(id={self.id}, number={self.vehicle_number}, category={self.category})>"
