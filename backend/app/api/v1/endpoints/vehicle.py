from typing import Any, List, Optional
from fastapi import APIRouter, Depends, status, Query, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession


from app.database.connection import get_db
from app.services.vehicle_service import VehicleService
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse
from app.schemas.response import APIResponse, success_response
from app.models.vehicle import VehicleCategory
from app.core.permissions import require_admin
from app.models.user import User

router = APIRouter()


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[VehicleResponse]],
    summary="List all fleet vehicles",
    description="Fetches a list of vehicles in the NJ Tours fleet with optional category and availability filters."
)
async def list_vehicles(
    category: Optional[VehicleCategory] = Query(None, description="Filter by vehicle category"),
    is_available: Optional[bool] = Query(None, description="Filter by availability status"),
    skip: int = Query(0, ge=0, description="Offset pagination skip count"),
    limit: int = Query(100, ge=1, le=100, description="Max record limit"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Public Endpoint:
    Returns list of vehicles available for booking.
    """
    vehicles = await VehicleService.list_vehicles(
        db=db,
        category=category,
        is_available=is_available,
        skip=skip,
        limit=limit
    )
    return success_response(data=vehicles, message="Vehicles retrieved successfully")


@router.get(
    "/{vehicle_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[VehicleResponse],
    summary="Get vehicle details by ID",
    description="Retrieves specs and rates for a specific vehicle."
)
async def get_vehicle(
    vehicle_id: str = Path(..., description="Vehicle UUID"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Public Endpoint:
    Returns details of a single vehicle.
    """
    vehicle = await VehicleService.get_vehicle_by_id(db=db, vehicle_id=vehicle_id)
    return success_response(data=vehicle, message="Vehicle details retrieved successfully")


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[VehicleResponse],
    summary="Add a new vehicle to the fleet",
    description="Creates a new vehicle record. Requires Admin privileges."
)
async def create_vehicle(
    vehicle_in: VehicleCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """
    Protected Endpoint (Admin Only):
    Adds a new vehicle to the NJ Tours fleet.
    """
    vehicle = await VehicleService.create_vehicle(db=db, vehicle_create=vehicle_in)
    return success_response(data=vehicle, message="Vehicle added to fleet successfully")


@router.put(
    "/{vehicle_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[VehicleResponse],
    summary="Update vehicle details",
    description="Updates vehicle specifications, rates, or availability. Requires Admin privileges."
)
async def update_vehicle(
    vehicle_id: str = Path(..., description="Vehicle UUID"),
    vehicle_in: VehicleUpdate = Body(...),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """
    Protected Endpoint (Admin Only):
    Updates an existing vehicle record.
    """
    vehicle = await VehicleService.update_vehicle(db=db, vehicle_id=vehicle_id, vehicle_update=vehicle_in)
    return success_response(data=vehicle, message="Vehicle updated successfully")


@router.delete(
    "/{vehicle_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Delete a vehicle from the fleet",
    description="Removes a vehicle record from the database. Requires Admin privileges."
)
async def delete_vehicle(
    vehicle_id: str = Path(..., description="Vehicle UUID"),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """
    Protected Endpoint (Admin Only):
    Deletes a vehicle record.
    """
    await VehicleService.delete_vehicle(db=db, vehicle_id=vehicle_id)
    return success_response(data={}, message="Vehicle deleted successfully")
