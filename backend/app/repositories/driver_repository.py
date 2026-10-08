from typing import Optional, Dict, Any, List
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.driver import DriverProfile, DriverStatus


class DriverRepository:
    """
    Repository layer for isolating all Driver database operations using SQLAlchemy 2.0 Async Session.
    """

    @staticmethod
    async def get_by_id(db: AsyncSession, driver_id: str) -> Optional[DriverProfile]:
        """Fetch a driver profile by UUID primary key."""
        stmt = select(DriverProfile).where(DriverProfile.id == driver_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_user_id(db: AsyncSession, user_id: str) -> Optional[DriverProfile]:
        """Fetch a driver profile by User foreign key ID."""
        stmt = select(DriverProfile).where(DriverProfile.user_id == user_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_license(db: AsyncSession, license_number: str) -> Optional[DriverProfile]:
        """Fetch a driver profile by unique commercial driving license number."""
        stmt = select(DriverProfile).where(DriverProfile.license_number == license_number)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_driver(db: AsyncSession, driver: DriverProfile) -> DriverProfile:
        """Persist a new DriverProfile instance in the database."""
        db.add(driver)
        await db.commit()
        await db.refresh(driver)
        return driver

    @staticmethod
    async def list_drivers(
        db: AsyncSession,
        status: Optional[DriverStatus] = None,
        assigned_vehicle_id: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[DriverProfile]:
        """Fetch a paginated list of drivers with flexible filters and search query matching."""
        stmt = select(DriverProfile)
        if status:
            stmt = stmt.where(DriverProfile.status == status)
        if assigned_vehicle_id:
            stmt = stmt.where(DriverProfile.assigned_vehicle_id == assigned_vehicle_id)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                or_(
                    DriverProfile.license_number.ilike(search_pattern),
                    DriverProfile.address.ilike(search_pattern)
                )
            )
        stmt = stmt.offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def update_driver(db: AsyncSession, driver: DriverProfile, update_data: Dict[str, Any]) -> DriverProfile:
        """Update and persist modified attributes of an existing driver profile."""
        for key, value in update_data.items():
            if value is not None and hasattr(driver, key):
                setattr(driver, key, value)
        await db.commit()
        await db.refresh(driver)
        return driver

    @staticmethod
    async def delete_driver(db: AsyncSession, driver: DriverProfile) -> bool:
        """Hard delete a driver profile from the database."""
        await db.delete(driver)
        await db.commit()
        return True
