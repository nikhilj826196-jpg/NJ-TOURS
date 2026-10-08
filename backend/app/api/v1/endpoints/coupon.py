from typing import Any, List, Optional
from fastapi import APIRouter, Depends, status, Query, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession


from app.database.connection import get_db
from app.services.coupon_service import CouponService
from app.schemas.coupon import (
    CouponCreate,
    CouponUpdate,
    ValidateCouponRequest,
    ValidateCouponResponse,
    ApplyCouponRequest,
    CouponResponse,
)
from app.schemas.booking import BookingResponse
from app.schemas.response import APIResponse, success_response
from app.core.deps import get_current_user
from app.core.permissions import require_admin
from app.models.user import User

router = APIRouter()


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[CouponResponse],
    summary="Create a new promotional coupon",
    description="Creates a new coupon code with discount rates and validity rules. Requires Admin privileges."
)
async def create_coupon(
    coupon_in: CouponCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Create promotional coupon."""
    coupon = await CouponService.create_coupon(db=db, coupon_create=coupon_in)
    return success_response(data=coupon, message="Coupon created successfully")


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[CouponResponse]],
    summary="List coupons",
    description="Lists promotional coupons with optional active status filter."
)
async def list_coupons(
    is_active: Optional[bool] = Query(None, description="Filter active coupons"),
    skip: int = Query(0, ge=0, description="Offset skip count"),
    limit: int = Query(100, ge=1, le=100, description="Max limit"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Public / Customer Endpoint: Lists active coupons."""
    coupons = await CouponService.list_coupons(db=db, is_active=is_active, skip=skip, limit=limit)
    return success_response(data=coupons, message="Coupons retrieved successfully")


@router.get(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[CouponResponse],
    summary="Get coupon details by ID",
    description="Retrieves a single coupon record details."
)
async def get_coupon(
    id: str = Path(..., description="Coupon UUID"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Public / Customer Endpoint: Get coupon details."""
    coupon = await CouponService.get_coupon_by_id(db=db, coupon_id=id)
    return success_response(data=coupon, message="Coupon details retrieved successfully")


@router.put(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[CouponResponse],
    summary="Update coupon parameters",
    description="Updates coupon validity dates, discount rates, or limits. Requires Admin privileges."
)
async def update_coupon(
    id: str = Path(..., description="Coupon UUID"),
    coupon_in: CouponUpdate = Body(...),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Update coupon."""
    coupon = await CouponService.update_coupon(db=db, coupon_id=id, coupon_update=coupon_in)
    return success_response(data=coupon, message="Coupon updated successfully")


@router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Delete a coupon",
    description="Deletes a coupon record. Requires Admin privileges."
)
async def delete_coupon(
    id: str = Path(..., description="Coupon UUID"),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Delete coupon."""
    await CouponService.delete_coupon(db=db, coupon_id=id)
    return success_response(data={}, message="Coupon deleted successfully")


@router.post(
    "/validate",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[ValidateCouponResponse],
    summary="Validate coupon code",
    description="Validates coupon code against booking amount, expiration, and user usage limits."
)
async def validate_coupon(
    req: ValidateCouponRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Protected Endpoint (Customer / User): Validates coupon applicability."""
    validation = await CouponService.validate_coupon(db=db, req=req, current_user=current_user)
    return success_response(data=validation, message="Coupon is valid")


@router.post(
    "/apply",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[BookingResponse],
    summary="Apply coupon to a booking",
    description="Applies coupon discount to booking fare, recalculates GST and grand total, and records user redemption."
)
async def apply_coupon(
    req: ApplyCouponRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Protected Endpoint (Customer / User): Applies coupon to booking."""
    booking = await CouponService.apply_coupon(db=db, req=req, current_user=current_user)
    return success_response(data=booking, message="Coupon applied to booking successfully")
