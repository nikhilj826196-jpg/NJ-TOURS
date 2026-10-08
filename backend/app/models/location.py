import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.connection import Base


class LocationLog(Base):
    """
    SQLAlchemy 2.0 LocationLog Model for tracking real-time GPS telemetry from drivers' phones.
    """
    __tablename__ = "location_logs"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
        comment="UUID Primary Key"
    )
    driver_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Driver User ID"
    )
    vehicle_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("vehicles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Vehicle ID"
    )
    booking_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("bookings.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="Associated active Booking ID"
    )

    latitude: Mapped[float] = mapped_column(Float, nullable=False, comment="GPS latitude")
    longitude: Mapped[float] = mapped_column(Float, nullable=False, comment="GPS longitude")
    speed: Mapped[Optional[float]] = mapped_column(Float, nullable=True, comment="Speed in km/h or m/s")
    heading: Mapped[Optional[float]] = mapped_column(Float, nullable=True, comment="Compass heading in degrees (0-360)")
    accuracy: Mapped[Optional[float]] = mapped_column(Float, nullable=True, comment="GPS accuracy radius in meters")
    altitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True, comment="Altitude in meters")
    battery_level: Mapped[Optional[float]] = mapped_column(Float, nullable=True, comment="Driver phone battery percentage")

    gps_timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        comment="Device level GPS timestamp"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    driver = relationship("User", foreign_keys=[driver_id], lazy="selectin")
    vehicle = relationship("Vehicle", foreign_keys=[vehicle_id], lazy="selectin")
    booking = relationship("Booking", foreign_keys=[booking_id], lazy="selectin")

    def __repr__(self) -> str:
        return f"<LocationLog(id={self.id}, driver={self.driver_id}, lat={self.latitude}, lng={self.longitude})>"
