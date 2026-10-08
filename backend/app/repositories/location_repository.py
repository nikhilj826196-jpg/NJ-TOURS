from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.location import LocationLog


class LocationRepository:
    """
    Repository layer for isolating GPS location tracking operations using SQLAlchemy 2.0 Async Session.
    """

    @staticmethod
    async def create_location(db: AsyncSession, location: LocationLog) -> LocationLog:
        """Persist a new location telemetry log in the database."""
        db.add(location)
        await db.commit()
        await db.refresh(location)
        return location

    @staticmethod
    async def get_current_by_booking_id(db: AsyncSession, booking_id: str) -> Optional[LocationLog]:
        """Fetch the most recent GPS coordinates logged for a booking."""
        stmt = select(LocationLog).where(LocationLog.booking_id == booking_id).order_by(LocationLog.gps_timestamp.desc()).limit(1)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_history_by_booking_id(db: AsyncSession, booking_id: str) -> List[LocationLog]:
        """Fetch all GPS breadcrumbs logged for route history/playback of a booking."""
        stmt = select(LocationLog).where(LocationLog.booking_id == booking_id).order_by(LocationLog.gps_timestamp.asc())
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def get_current_by_driver_id(db: AsyncSession, driver_id: str) -> Optional[LocationLog]:
        """Fetch the most recent GPS coordinates logged for a driver."""
        stmt = select(LocationLog).where(LocationLog.driver_id == driver_id).order_by(LocationLog.gps_timestamp.desc()).limit(1)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_current_by_vehicle_id(db: AsyncSession, vehicle_id: str) -> Optional[LocationLog]:
        """Fetch the most recent GPS coordinates logged for a vehicle."""
        stmt = select(LocationLog).where(LocationLog.vehicle_id == vehicle_id).order_by(LocationLog.gps_timestamp.desc()).limit(1)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
