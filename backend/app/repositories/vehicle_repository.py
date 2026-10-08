from typing import Optional, Dict, Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.vehicle import Vehicle, VehicleCategory
from app.schemas.vehicle import VehicleCreate


class VehicleRepository:
    """
    Repository layer for isolating all Vehicle database operations using SQLAlchemy 2.0 Async Session.
    """

    @staticmethod
    async def get_by_id(db: AsyncSession, vehicle_id: str) -> Optional[Vehicle]:
        """Fetch a vehicle by UUID primary key."""
        stmt = select(Vehicle).where(Vehicle.id == vehicle_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_number(db: AsyncSession, vehicle_number: str) -> Optional[Vehicle]:
        """Fetch a vehicle by unique registration plate number."""
        stmt = select(Vehicle).where(Vehicle.vehicle_number == vehicle_number)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_vehicle(db: AsyncSession, vehicle_create: VehicleCreate) -> Vehicle:
        """Create and persist a new vehicle record."""
        vehicle = Vehicle(
            name=vehicle_create.name,
            brand=vehicle_create.brand,
            model_name=vehicle_create.model_name,
            vehicle_number=vehicle_create.vehicle_number,
            category=vehicle_create.category,
            seating_capacity=vehicle_create.seating_capacity,
            per_km_rate=vehicle_create.per_km_rate,
            per_day_rate=vehicle_create.per_day_rate,
            fuel_type=vehicle_create.fuel_type,
            is_ac=vehicle_create.is_ac,
            is_available=vehicle_create.is_available,
            image_url=vehicle_create.image_url
        )
        db.add(vehicle)
        await db.commit()
        await db.refresh(vehicle)
        return vehicle

    @staticmethod
    async def list_vehicles(
        db: AsyncSession,
        category: Optional[VehicleCategory] = None,
        is_available: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Vehicle]:
        """Fetch a paginated list of vehicles with optional category and availability filters."""
        stmt = select(Vehicle)
        if category:
            stmt = stmt.where(Vehicle.category == category)
        if is_available is not None:
            stmt = stmt.where(Vehicle.is_available == is_available)
        stmt = stmt.offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def update_vehicle(db: AsyncSession, vehicle: Vehicle, update_data: Dict[str, Any]) -> Vehicle:
        """Update and persist modified fields of a vehicle."""
        for key, value in update_data.items():
            if value is not None and hasattr(vehicle, key):
                setattr(vehicle, key, value)
        await db.commit()
        await db.refresh(vehicle)
        return vehicle

    @staticmethod
    async def delete_vehicle(db: AsyncSession, vehicle: Vehicle) -> bool:
        """Hard delete a vehicle record from the database."""
        await db.delete(vehicle)
        await db.commit()
        return True
