from typing import Optional, Dict, Any, List
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.review import Review


class ReviewRepository:
    """
    Repository layer for isolating all Review database operations using SQLAlchemy 2.0 Async Session.
    """

    @staticmethod
    async def get_by_id(db: AsyncSession, review_id: str) -> Optional[Review]:
        """Fetch a single review by UUID primary key."""
        stmt = select(Review).where(Review.id == review_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_booking_id(db: AsyncSession, booking_id: str) -> Optional[Review]:
        """Fetch a review by unique booking ID."""
        stmt = select(Review).where(Review.booking_id == booking_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_review(db: AsyncSession, review: Review) -> Review:
        """Persist a new Review record in the database."""
        db.add(review)
        await db.commit()
        await db.refresh(review)
        return review

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
    ) -> List[Review]:
        """Fetch a paginated list of reviews with entity and visibility filters."""
        stmt = select(Review)

        if customer_id:
            stmt = stmt.where(Review.customer_id == customer_id)
        if vehicle_id:
            stmt = stmt.where(Review.vehicle_id == vehicle_id)
        if driver_id:
            stmt = stmt.where(Review.driver_id == driver_id)
        if package_id:
            stmt = stmt.where(Review.package_id == package_id)
        if is_featured is not None:
            stmt = stmt.where(Review.is_featured == is_featured)
        if is_visible is not None:
            stmt = stmt.where(Review.is_visible == is_visible)

        stmt = stmt.order_by(Review.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def update_review(db: AsyncSession, review: Review, update_data: Dict[str, Any]) -> Review:
        """Update and persist modified attributes of a review."""
        for key, value in update_data.items():
            if value is not None and hasattr(review, key):
                setattr(review, key, value)
        await db.commit()
        await db.refresh(review)
        return review

    @staticmethod
    async def delete_review(db: AsyncSession, review: Review) -> bool:
        """Hard delete a review record from the database."""
        await db.delete(review)
        await db.commit()
        return True

    @staticmethod
    async def get_average_rating_for_target(
        db: AsyncSession,
        target_column: str,
        target_id: str
    ) -> float:
        """Calculates current average rating for a target vehicle or package."""
        col = getattr(Review, target_column, None)
        if col is None:
            return 5.0
        stmt = select(func.avg(Review.rating)).where(col == target_id, Review.is_visible == True)
        result = await db.execute(stmt)
        avg_val = result.scalar()
        return round(float(avg_val), 1) if avg_val is not None else 5.0
