from typing import Any, List
from fastapi import APIRouter, Depends, status, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.services.location_service import LocationService
from app.schemas.location import (
    LocationUpdateInput,
    LocationResponse,
    CurrentLocationResponse,
    RouteHistoryResponse,
)
from app.schemas.response import APIResponse, success_response
from app.core.deps import get_current_user
from app.core.permissions import require_admin, require_driver, require_admin_or_driver
from app.models.user import User

router = APIRouter()


@router.post(
    "/update",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[LocationResponse],
    summary="Update driver GPS telemetry coordinates",
    description="Logs real-time latitude, longitude, speed, and battery metrics. Restricted to active Driver role."
)
async def update_location(
    data: LocationUpdateInput,
    db: AsyncSession = Depends(get_db),
    driver_user: User = Depends(require_admin_or_driver)
) -> Any:
    """Protected Endpoint (Driver/Admin): Log GPS coordinates update."""
    location = await LocationService.update_location(db=db, driver_user=driver_user, data=data)
    return success_response(data=location, message="Location updated successfully")


@router.get(
    "/current/{booking_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[CurrentLocationResponse],
    summary="Get live booking location and ETA metrics",
    description="Retrieves coordinates, estimated arrival time, and distance remaining for an active trip."
)
async def get_current_location(
    booking_id: str = Path(..., description="Booking UUID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Protected Endpoint: Get current booking GPS state."""
    current_loc = await LocationService.get_current_location(db=db, booking_id=booking_id, current_user=current_user)
    return success_response(data=current_loc, message="Current location fetched successfully")


@router.get(
    "/history/{booking_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[RouteHistoryResponse],
    summary="Get trip route breadcrumbs history",
    description="Retrieves a list of coordinates logged during a trip for route playback."
)
async def get_route_history(
    booking_id: str = Path(..., description="Booking UUID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Protected Endpoint: Get route playback log."""
    history = await LocationService.get_route_history(db=db, booking_id=booking_id, current_user=current_user)
    return success_response(data=history, message="Route history fetched successfully")


@router.get(
    "/driver/{driver_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[LocationResponse],
    summary="Get driver's current live location",
    description="Retrieves the most recent coordinates logged for a driver. Requires Admin privileges."
)
async def get_driver_location(
    driver_id: str = Path(..., description="Driver User UUID"),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Fetch driver current coordinates."""
    location = await LocationService.get_current_by_driver(db=db, driver_id=driver_id)
    return success_response(data=location, message="Driver location fetched successfully")


@router.get(
    "/vehicle/{vehicle_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[LocationResponse],
    summary="Get vehicle's current live location",
    description="Retrieves the most recent coordinates logged for a vehicle. Requires Admin privileges."
)
async def get_vehicle_location(
    vehicle_id: str = Path(..., description="Vehicle UUID"),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Fetch vehicle current coordinates."""
    location = await LocationService.get_current_by_vehicle(db=db, vehicle_id=vehicle_id)
    return success_response(data=location, message="Vehicle location fetched successfully")
