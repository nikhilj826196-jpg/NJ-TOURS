from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.vehicle import Vehicle, VehicleCategory
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse


class VehicleService:
    """
    Service layer containing business logic for NJ Tours fleet management.
    """

    @staticmethod
    async def create_vehicle(db: AsyncSession, vehicle_create: VehicleCreate) -> VehicleResponse:
        """
        Creates a new vehicle after checking registration number uniqueness.
        """
        existing = await VehicleRepository.get_by_number(db, vehicle_create.vehicle_number)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Vehicle number '{vehicle_create.vehicle_number}' is already registered in fleet"
            )

        vehicle = await VehicleRepository.create_vehicle(db, vehicle_create)
        return VehicleResponse.model_validate(vehicle)

    @staticmethod
    async def get_vehicle_by_id(db: AsyncSession, vehicle_id: str) -> VehicleResponse:
        """
        Retrieves a vehicle by UUID.
        """
        vehicle = await VehicleRepository.get_by_id(db, vehicle_id)
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found"
            )
        return VehicleResponse.model_validate(vehicle)

    @staticmethod
    async def list_vehicles(
        db: AsyncSession,
        category: Optional[VehicleCategory] = None,
        is_available: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[VehicleResponse]:
        """
        Retrieves a list of vehicles matching filter criteria.
        """
        vehicles = await VehicleRepository.list_vehicles(
            db=db,
            category=category,
            is_available=is_available,
            skip=skip,
            limit=limit
        )
        return [VehicleResponse.model_validate(v) for v in vehicles]

    @staticmethod
    async def update_vehicle(
        db: AsyncSession,
        vehicle_id: str,
        vehicle_update: VehicleUpdate
    ) -> VehicleResponse:
        """
        Updates an existing vehicle record.
        """
        vehicle = await VehicleRepository.get_by_id(db, vehicle_id)
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found"
            )

        # Check vehicle number uniqueness if updating vehicle number
        if vehicle_update.vehicle_number and vehicle_update.vehicle_number != vehicle.vehicle_number:
            existing = await VehicleRepository.get_by_number(db, vehicle_update.vehicle_number)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Vehicle number '{vehicle_update.vehicle_number}' is already registered"
                )

        update_dict = vehicle_update.model_dump(exclude_unset=True)
        updated_vehicle = await VehicleRepository.update_vehicle(db, vehicle, update_dict)
        return VehicleResponse.model_validate(updated_vehicle)

    @staticmethod
    async def delete_vehicle(db: AsyncSession, vehicle_id: str) -> bool:
        """
        Deletes a vehicle from the fleet.
        """
        vehicle = await VehicleRepository.get_by_id(db, vehicle_id)
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found"
            )

        return await VehicleRepository.delete_vehicle(db, vehicle)
