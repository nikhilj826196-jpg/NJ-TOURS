from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.review import Review
from app.models.booking import BookingStatus
from app.models.user import User, UserRole
from app.repositories.review_repository import ReviewRepository
from app.repositories.booking_repository import BookingRepository
from app.repositories.tour_package_repository import TourPackageRepository
from app.schemas.review import (
    ReviewCreate,
    ReviewUpdate,
    AdminReplyRequest,
    ReviewVisibilityUpdate,
    ReviewResponse,
    RatingDistribution,
)


class ReviewService:
    """
    Service layer containing business logic for review submissions, rating scale validation,
    completed booking checks, admin responses, and average rating updates.
    """

    @staticmethod
    async def create_review(
        db: AsyncSession,
        review_create: ReviewCreate,
        current_user: User
    ) -> ReviewResponse:
        """
        Submits a new review after validating booking completion and single review limit.
        """
        booking = await BookingRepository.get_by_id(db, review_create.booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

        # Booking ownership check
        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        if user_role == UserRole.CUSTOMER.value and booking.customer_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: You can only review your own bookings")

        # Completed booking check
        booking_status_str = booking.status.value if hasattr(booking.status, 'value') else str(booking.status)
        if booking_status_str != BookingStatus.COMPLETED.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only completed trips can be reviewed. Current booking status is '{booking_status_str}'"
            )

        # Duplicate review check
        existing_review = await ReviewRepository.get_by_booking_id(db, review_create.booking_id)
        if existing_review:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A review has already been submitted for this booking"
            )

        review = Review(
            customer_id=current_user.id,
            booking_id=booking.id,
            vehicle_id=booking.vehicle_id,
            driver_id=booking.driver_id,
            package_id=None,  # Optional package relation
            rating=review_create.rating,
            title=review_create.title,
            review=review_create.review,
            images=review_create.images,
            is_verified_purchase=True,
            is_featured=False,
            is_visible=True
        )

        saved_review = await ReviewRepository.create_review(db, review)

        # Update average rating on Tour Package if applicable
        if saved_review.package_id:
            avg_rating = await ReviewRepository.get_average_rating_for_target(db, "package_id", saved_review.package_id)
            pkg = await TourPackageRepository.get_by_id(db, saved_review.package_id)
            if pkg:
                await TourPackageRepository.update_package(
                    db, pkg, {"rating": avg_rating, "reviews_count": pkg.reviews_count + 1}
                )

        return ReviewResponse.model_validate(saved_review)

    @staticmethod
    async def get_review_by_id(db: AsyncSession, review_id: str) -> ReviewResponse:
        """Retrieves single review details."""
        review = await ReviewRepository.get_by_id(db, review_id)
        if not review:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
        return ReviewResponse.model_validate(review)

    @staticmethod
    async def update_review(
        db: AsyncSession,
        review_id: str,
        review_update: ReviewUpdate,
        current_user: User
    ) -> ReviewResponse:
        """Updates customer's own review comment or rating."""
        review = await ReviewRepository.get_by_id(db, review_id)
        if not review:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        if user_role != UserRole.ADMIN.value and review.customer_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: Cannot update other user's review")

        update_dict = review_update.model_dump(exclude_unset=True)
        updated_review = await ReviewRepository.update_review(db, review, update_dict)
        return ReviewResponse.model_validate(updated_review)

    @staticmethod
    async def delete_review(db: AsyncSession, review_id: str, current_user: User) -> bool:
        """Deletes customer review."""
        review = await ReviewRepository.get_by_id(db, review_id)
        if not review:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        if user_role != UserRole.ADMIN.value and review.customer_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: Cannot delete other user's review")

        return await ReviewRepository.delete_review(db, review)

    @staticmethod
    async def add_admin_reply(db: AsyncSession, review_id: str, reply_text: str) -> ReviewResponse:
        """Adds official admin reply to a customer review."""
        review = await ReviewRepository.get_by_id(db, review_id)
        if not review:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

        updated_review = await ReviewRepository.update_review(db, review, {"admin_reply": reply_text})
        return ReviewResponse.model_validate(updated_review)

    @staticmethod
    async def update_visibility(
        db: AsyncSession,
        review_id: str,
        is_visible: bool,
        is_featured: Optional[bool]
    ) -> ReviewResponse:
        """Updates admin visibility or featured status for a review."""
        review = await ReviewRepository.get_by_id(db, review_id)
        if not review:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

        update_dict = {"is_visible": is_visible}
        if is_featured is not None:
            update_dict["is_featured"] = is_featured

        updated_review = await ReviewRepository.update_review(db, review, update_dict)
        return ReviewResponse.model_validate(updated_review)

    @staticmethod
    async def list_reviews(
        db: AsyncSession,
        customer_id: Optional[str] = None,
        vehicle_id: Optional[str] = None,
        driver_id: Optional[str] = None,
        package_id: Optional[str] = None,
        is_featured: Optional[bool] = None,
        is_visible: Optional[bool] = True,
        skip: int = 0,
        limit: int = 100
    ) -> List[ReviewResponse]:
        """Lists reviews matching filters."""
        reviews = await ReviewRepository.list_reviews(
            db=db,
            customer_id=customer_id,
            vehicle_id=vehicle_id,
            driver_id=driver_id,
            package_id=package_id,
            is_featured=is_featured,
            is_visible=is_visible,
            skip=skip,
            limit=limit
        )
        return [ReviewResponse.model_validate(r) for r in reviews]
