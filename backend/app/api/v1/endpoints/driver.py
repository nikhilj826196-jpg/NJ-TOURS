from typing import Any, List, Optional
from fastapi import APIRouter, Depends, status, Query, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession


from app.database.connection import get_db
from app.services.driver_service import DriverService
from app.services.booking_service import BookingService
from app.schemas.driver import (
    DriverCreate,
    DriverUpdate,
    DriverAssignVehicle,
    DriverStatusUpdate,
    DriverResponse,
)
from app.schemas.booking import BookingResponse
from app.schemas.response import APIResponse, success_response
from app.models.driver import DriverStatus
from app.core.deps import get_current_user
from app.core.permissions import require_admin, require_driver, require_admin_or_driver
from app.models.user import User

router = APIRouter()


@router.get(
    "/me",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[DriverResponse],
    summary="Get authenticated driver's profile",
    description="Retrieves the driver profile associated with the logged-in user account."
)
async def get_my_driver_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin_or_driver)
) -> Any:
    """Protected Endpoint (Driver/Admin): Returns own driver profile."""
    driver = await DriverService.get_driver_by_user_id(db=db, user_id=current_user.id)
    return success_response(data=driver, message="Driver profile fetched successfully")


@router.get(
    "/me/trips",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[BookingResponse]],
    summary="Get driver's assigned trips",
    description="Retrieves upcoming and historical trip assignments for the driver."
)
async def get_my_driver_trips(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin_or_driver)
) -> Any:
    """Protected Endpoint (Driver/Admin): Returns assigned trip history."""
    bookings = await BookingService.list_bookings(db=db, current_user=current_user)
    return success_response(data=bookings, message="Assigned driver trips fetched successfully")


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[DriverResponse]],
    summary="List driver profiles",
    description="Fetches a list of driver profiles. Requires Admin privileges."
)
async def list_drivers(
    status_filter: Optional[DriverStatus] = Query(None, alias="status", description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by license or address"),
    skip: int = Query(0, ge=0, description="Offset skip count"),
    limit: int = Query(100, ge=1, le=100, description="Max limit"),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Returns list of drivers."""
    drivers = await DriverService.list_drivers(
        db=db,
        status=status_filter,
        search=search,
        skip=skip,
        limit=limit
    )
    return success_response(data=drivers, message="Drivers retrieved successfully")


@router.get(
    "/{driver_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[DriverResponse],
    summary="Get driver profile by ID",
    description="Retrieves a specific driver's profile. Requires Admin privileges."
)
async def get_driver(
    driver_id: str = Path(..., description="Driver UUID"),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Returns driver profile details."""
    driver = await DriverService.get_driver_by_id(db=db, driver_id=driver_id)
    return success_response(data=driver, message="Driver details retrieved successfully")


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[DriverResponse],
    summary="Create a new driver profile",
    description="Creates a driver profile linked to a User account. Requires Admin privileges."
)
async def create_driver(
    driver_in: DriverCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Registers a new driver profile."""
    driver = await DriverService.create_driver_profile(db=db, driver_create=driver_in)
    return success_response(data=driver, message="Driver profile created successfully")


@router.put(
    "/{driver_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[DriverResponse],
    summary="Update driver profile details",
    description="Updates driver licensing, contact details, or address."
)
async def update_driver(
    driver_id: str = Path(..., description="Driver UUID"),
    driver_in: DriverUpdate = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Protected Endpoint: Updates driver profile."""
    driver = await DriverService.update_driver_profile(
        db=db,
        driver_id=driver_id,
        driver_update=driver_in,
        current_user=current_user
    )
    return success_response(data=driver, message="Driver profile updated successfully")


@router.put(
    "/{driver_id}/assign-vehicle",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[DriverResponse],
    summary="Assign or reassign vehicle to driver",
    description="Assigns a vehicle UUID to a driver profile. Requires Admin privileges."
)
async def assign_vehicle(
    driver_id: str = Path(..., description="Driver UUID"),
    assign_in: DriverAssignVehicle = Body(...),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Assigns vehicle to driver."""
    driver = await DriverService.assign_vehicle(db=db, driver_id=driver_id, vehicle_id=assign_in.vehicle_id)
    return success_response(data=driver, message="Vehicle assigned to driver successfully")


@router.put(
    "/{driver_id}/status",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[DriverResponse],
    summary="Update driver operational status",
    description="Updates status (Available, Busy, Offline, On Trip)."
)
async def update_driver_status(
    driver_id: str = Path(..., description="Driver UUID"),
    status_in: DriverStatusUpdate = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin_or_driver)
) -> Any:
    """Protected Endpoint (Admin/Driver): Updates driver operational status."""
    driver = await DriverService.update_driver_status(db=db, driver_id=driver_id, new_status=status_in.status)
    return success_response(data=driver, message="Driver status updated successfully")
