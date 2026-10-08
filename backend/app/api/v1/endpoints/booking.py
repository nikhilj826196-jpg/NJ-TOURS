from typing import Any, List, Optional
from fastapi import APIRouter, Depends, status, Query, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.services.booking_service import BookingService
from app.schemas.booking import (
    BookingCreate,
    BookingUpdate,
    BookingAssignDriver,
    BookingStatusUpdate,
    BookingCancelRequest,
    BookingResponse,
    PriceCalculationRequest,
    PriceCalculationResponse,
)
from app.schemas.response import APIResponse, success_response
from app.models.booking import BookingStatus
from app.core.deps import get_current_user
from app.core.permissions import require_admin
from app.models.user import User

router = APIRouter()


@router.post(
    "/calculate-price",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[PriceCalculationResponse],
    summary="Calculate trip fare estimate",
    description="Calculates base fare, driver allowance, GST, and total trip cost based on distance and rates."
)
async def calculate_price(
    calc_in: PriceCalculationRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Public Pricing Calculation Endpoint.
    """
    pricing = await BookingService.calculate_price(db=db, req=calc_in)
    return success_response(data=pricing, message="Price calculated successfully")


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[BookingResponse],
    summary="Create a new trip booking",
    description="Creates a trip reservation for the authenticated customer."
)
async def create_booking(
    booking_in: BookingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint (Authenticated User):
    Validates passenger count, vehicle availability, and computes trip fare.
    """
    booking = await BookingService.create_booking(db=db, customer=current_user, booking_create=booking_in)
    return success_response(data=booking, message="Booking created successfully")


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[BookingResponse]],
    summary="List bookings",
    description="Lists bookings with role-based filtering (Customers see own, Drivers see assigned, Admins see all)."
)
async def list_bookings(
    status_filter: Optional[BookingStatus] = Query(None, alias="status", description="Filter by booking status"),
    search: Optional[str] = Query(None, description="Search by booking number, pickup, or drop location"),
    skip: int = Query(0, ge=0, description="Offset skip count"),
    limit: int = Query(100, ge=1, le=100, description="Max limit"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint:
    Returns list of bookings based on RBAC permissions.
    """
    bookings = await BookingService.list_bookings(
        db=db,
        current_user=current_user,
        status=status_filter,
        search=search,
        skip=skip,
        limit=limit
    )
    return success_response(data=bookings, message="Bookings fetched successfully")


@router.get(
    "/my-bookings",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[BookingResponse]],
    summary="Get user's personal booking history",
    description="Retrieves upcoming and historical trip reservations for the logged in user."
)
async def get_my_bookings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint (Customer / Driver):
    Fetches personal booking history.
    """
    bookings = await BookingService.list_bookings(db=db, current_user=current_user)
    return success_response(data=bookings, message="My bookings fetched successfully")


@router.get(
    "/{booking_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[BookingResponse],
    summary="Get booking details by ID",
    description="Retrieves complete information for a single booking."
)
async def get_booking(
    booking_id: str = Path(..., description="Booking UUID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint:
    Returns single booking details with ownership check.
    """
    booking = await BookingService.get_booking_by_id(db=db, booking_id=booking_id, current_user=current_user)
    return success_response(data=booking, message="Booking details retrieved successfully")


@router.put(
    "/{booking_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[BookingResponse],
    summary="Update general booking details",
    description="Updates general booking details including driver and vehicle assignments. Requires Admin privileges."
)
async def update_booking(
    booking_id: str = Path(..., description="Booking UUID"),
    booking_in: BookingUpdate = Body(...),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """
    Protected Endpoint (Admin Only):
    Updates booking attributes (driver, vehicle, status, payment_status, etc.)
    """
    booking = await BookingService.admin_update_booking(db=db, booking_id=booking_id, booking_update=booking_in)
    return success_response(data=booking, message="Booking updated successfully")


@router.put(
    "/{booking_id}/assign-driver",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[BookingResponse],
    summary="Assign driver to a booking",
    description="Assigns a driver to an existing booking reservation. Requires Admin privileges."
)
async def assign_driver(
    booking_id: str = Path(..., description="Booking UUID"),
    assign_in: BookingAssignDriver = Body(...),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """
    Protected Endpoint (Admin Only):
    Assigns a driver user to a booking.
    """
    booking = await BookingService.assign_driver(db=db, booking_id=booking_id, driver_id=assign_in.driver_id)
    return success_response(data=booking, message="Driver assigned to booking successfully")


@router.put(
    "/{booking_id}/status",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[BookingResponse],
    summary="Update booking or payment status",
    description="Updates booking status (Pending, Confirmed, Assigned, Started, Completed, Cancelled)."
)
async def update_booking_status(
    booking_id: str = Path(..., description="Booking UUID"),
    status_in: BookingStatusUpdate = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint:
    Updates status transition for a booking.
    """
    booking = await BookingService.update_booking_status(
        db=db,
        booking_id=booking_id,
        new_status=status_in.status,
        payment_status=status_in.payment_status,
        current_user=current_user
    )
    return success_response(data=booking, message="Booking status updated successfully")


@router.post(
    "/{booking_id}/cancel",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[BookingResponse],
    summary="Cancel booking",
    description="Allows a customer to cancel their own pending/confirmed trip booking."
)
async def cancel_booking(
    booking_id: str = Path(..., description="Booking UUID"),
    cancel_in: BookingCancelRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint (Customer / Admin):
    Cancels the booking reservation and stores cancellation reasoning metadata.
    """
    booking = await BookingService.cancel_booking(
        db=db,
        booking_id=booking_id,
        reason=cancel_in.reason,
        current_user=current_user
    )
    return success_response(data=booking, message="Booking cancelled successfully")
