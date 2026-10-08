from typing import Any, List, Optional
from fastapi import APIRouter, Depends, status, Query, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.services.review_service import ReviewService
from app.schemas.review import (
    ReviewCreate,
    ReviewUpdate,
    AdminReplyRequest,
    ReviewVisibilityUpdate,
    ReviewResponse,
)
from app.schemas.response import APIResponse, success_response
from app.core.deps import get_current_user
from app.core.permissions import require_admin
from app.models.user import User

router = APIRouter()


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[ReviewResponse],
    summary="Submit a review for a completed booking",
    description="Submits rating (1-5), review title, and comments for a verified completed trip reservation."
)
async def create_review(
    review_in: ReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Protected Endpoint (Customer / User): Submit completed trip review."""
    review = await ReviewService.create_review(db=db, review_create=review_in, current_user=current_user)
    return success_response(data=review, message="Review submitted successfully")


@router.get(
    "/my",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[ReviewResponse]],
    summary="Get customer's own submitted reviews",
    description="Retrieves a list of reviews submitted by the authenticated customer."
)
async def get_my_reviews(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Protected Endpoint (Customer): My reviews history."""
    reviews = await ReviewService.list_reviews(db=db, customer_id=current_user.id, is_visible=None)
    return success_response(data=reviews, message="My reviews fetched successfully")


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[ReviewResponse]],
    summary="List all public reviews",
    description="Fetches a list of public testimonials and customer reviews."
)
async def list_reviews(
    is_featured: Optional[bool] = Query(None, description="Filter featured reviews"),
    skip: int = Query(0, ge=0, description="Offset skip count"),
    limit: int = Query(100, ge=1, le=100, description="Max limit"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Public Endpoint: Lists visible reviews."""
    reviews = await ReviewService.list_reviews(
        db=db, is_featured=is_featured, is_visible=True, skip=skip, limit=limit
    )
    return success_response(data=reviews, message="Reviews retrieved successfully")


@router.get(
    "/vehicle/{vehicle_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[ReviewResponse]],
    summary="Get reviews for a specific vehicle",
    description="Retrieves reviews and ratings linked to a vehicle."
)
async def get_vehicle_reviews(
    vehicle_id: str = Path(..., description="Vehicle UUID"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Public Endpoint: Vehicle reviews."""
    reviews = await ReviewService.list_reviews(db=db, vehicle_id=vehicle_id, is_visible=True)
    return success_response(data=reviews, message="Vehicle reviews retrieved successfully")


@router.get(
    "/driver/{driver_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[ReviewResponse]],
    summary="Get reviews for a specific driver",
    description="Retrieves reviews and ratings linked to a driver."
)
async def get_driver_reviews(
    driver_id: str = Path(..., description="Driver User UUID"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Public Endpoint: Driver reviews."""
    reviews = await ReviewService.list_reviews(db=db, driver_id=driver_id, is_visible=True)
    return success_response(data=reviews, message="Driver reviews retrieved successfully")


@router.get(
    "/package/{package_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[ReviewResponse]],
    summary="Get reviews for a specific tour package",
    description="Retrieves reviews and ratings linked to a holiday package."
)
async def get_package_reviews(
    package_id: str = Path(..., description="Tour Package UUID"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Public Endpoint: Package reviews."""
    reviews = await ReviewService.list_reviews(db=db, package_id=package_id, is_visible=True)
    return success_response(data=reviews, message="Package reviews retrieved successfully")


@router.get(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[ReviewResponse],
    summary="Get review details by ID",
    description="Retrieves details for a single review record."
)
async def get_review(
    id: str = Path(..., description="Review UUID"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Public Endpoint: Get review details."""
    review = await ReviewService.get_review_by_id(db=db, review_id=id)
    return success_response(data=review, message="Review details retrieved successfully")


@router.put(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[ReviewResponse],
    summary="Update review details",
    description="Updates customer's own review comment or rating."
)
async def update_review(
    id: str = Path(..., description="Review UUID"),
    review_in: ReviewUpdate = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Protected Endpoint: Update review."""
    review = await ReviewService.update_review(
        db=db, review_id=id, review_update=review_in, current_user=current_user
    )
    return success_response(data=review, message="Review updated successfully")


@router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Delete a review",
    description="Deletes customer's own review or admin deletion."
)
async def delete_review(
    id: str = Path(..., description="Review UUID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Protected Endpoint: Delete review."""
    await ReviewService.delete_review(db=db, review_id=id, current_user=current_user)
    return success_response(data={}, message="Review deleted successfully")


@router.put(
    "/{id}/feature",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[ReviewResponse],
    summary="Feature or unfeature review",
    description="Toggles featured status for testimonial promotion. Requires Admin privileges."
)
async def feature_review(
    id: str = Path(..., description="Review UUID"),
    is_featured: bool = Query(True, description="Featured flag"),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Feature review."""
    review = await ReviewService.update_visibility(db=db, review_id=id, is_visible=True, is_featured=is_featured)
    return success_response(data=review, message="Review featured status updated successfully")


@router.put(
    "/{id}/visibility",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[ReviewResponse],
    summary="Hide or show review",
    description="Toggles review public visibility. Requires Admin privileges."
)
async def update_visibility(
    id: str = Path(..., description="Review UUID"),
    vis_in: ReviewVisibilityUpdate = Body(...),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Hide/unhide review."""
    review = await ReviewService.update_visibility(
        db=db, review_id=id, is_visible=vis_in.is_visible, is_featured=vis_in.is_featured
    )
    return success_response(data=review, message="Review visibility updated successfully")


@router.post(
    "/{id}/reply",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[ReviewResponse],
    summary="Add official admin reply to review",
    description="Posts official company response to customer review. Requires Admin privileges."
)
async def add_admin_reply(
    id: str = Path(..., description="Review UUID"),
    reply_in: AdminReplyRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Post official admin reply."""
    review = await ReviewService.add_admin_reply(db=db, review_id=id, reply_text=reply_in.admin_reply)
    return success_response(data=review, message="Admin reply added successfully")
