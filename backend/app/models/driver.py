import enum
import uuid
from datetime import datetime, date, timezone
from typing import Optional
from sqlalchemy import String, Boolean, DateTime, Date, Enum, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.connection import Base


class DriverStatus(str, enum.Enum):
    """Enumeration of driver operational status."""
    AVAILABLE = "Available"
    BUSY = "Busy"
    OFFLINE = "Offline"
    ON_TRIP = "On Trip"


class DriverProfile(Base):
    """
    SQLAlchemy 2.0 Driver Profile Model for NJ Tours fleet drivers.
    Extends the User model with driver-specific licensing and assignment data.
    """
    __tablename__ = "driver_profiles"

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
        unique=True,
        nullable=False,
        index=True,
        comment="Foreign key referencing users table"
    )
    license_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
        comment="Driver commercial license number"
    )
    license_expiry: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        comment="Expiration date of commercial driving license"
    )
    aadhar_number: Mapped[Optional[str]] = mapped_column(
        String(20),
        unique=True,
        nullable=True,
        comment="Aadhar identification number"
    )
    pan_number: Mapped[Optional[str]] = mapped_column(
        String(20),
        unique=True,
        nullable=True,
        comment="PAN card identification number"
    )
    address: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Residential address"
    )
    experience_years: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        comment="Years of commercial driving experience"
    )
    emergency_contact: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
        comment="Emergency contact phone number"
    )
    status: Mapped[DriverStatus] = mapped_column(
        Enum(DriverStatus, values_callable=lambda obj: [e.value for e in obj]),
        default=DriverStatus.AVAILABLE,
        nullable=False,
        index=True,
        comment="Current driver operational status"
    )
    assigned_vehicle_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("vehicles.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="Currently assigned vehicle ID"
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
    user = relationship("User", foreign_keys=[user_id], lazy="selectin")
    assigned_vehicle = relationship("Vehicle", foreign_keys=[assigned_vehicle_id], lazy="selectin")

    def __repr__(self) -> str:
        return f"<DriverProfile(id={self.id}, license={self.license_number}, status={self.status})>"
