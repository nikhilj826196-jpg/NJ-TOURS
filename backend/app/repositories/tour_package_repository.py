from typing import Optional, Dict, Any, List
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.tour_package import TourPackage


class TourPackageRepository:
    """
    Repository layer for isolating all TourPackage database operations using SQLAlchemy 2.0 Async Session.
    """

    @staticmethod
    async def get_by_id(db: AsyncSession, package_id: str) -> Optional[TourPackage]:
        """Fetch a tour package by UUID primary key."""
        stmt = select(TourPackage).where(TourPackage.id == package_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_slug(db: AsyncSession, slug: str) -> Optional[TourPackage]:
        """Fetch a tour package by unique URL slug."""
        stmt = select(TourPackage).where(TourPackage.slug == slug)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_package(db: AsyncSession, package: TourPackage) -> TourPackage:
        """Persist a new TourPackage in the database."""
        db.add(package)
        await db.commit()
        await db.refresh(package)
        return package

    @staticmethod
    async def list_packages(
        db: AsyncSession,
        state: Optional[str] = None,
        category: Optional[str] = None,
        duration: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        min_rating: Optional[float] = None,
        is_featured: Optional[bool] = None,
        is_active: Optional[bool] = True,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[TourPackage]:
        """
        Fetch a paginated list of tour packages matching state, category, price range, and featured filters.
        """
        stmt = select(TourPackage)
        if state:
            stmt = stmt.where(TourPackage.state.ilike(f"%{state}%"))
        if category:
            stmt = stmt.where(TourPackage.category.ilike(f"%{category}%"))
        if duration:
            stmt = stmt.where(TourPackage.duration.ilike(f"%{duration}%"))
        if min_price is not None:
            stmt = stmt.where(TourPackage.price >= min_price)
        if max_price is not None:
            stmt = stmt.where(TourPackage.price <= max_price)
        if min_rating is not None:
            stmt = stmt.where(TourPackage.rating >= min_rating)
        if is_featured is not None:
            stmt = stmt.where(TourPackage.is_featured == is_featured)
        if is_active is not None:
            stmt = stmt.where(TourPackage.is_active == is_active)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                or_(
                    TourPackage.name.ilike(search_pattern),
                    TourPackage.destination.ilike(search_pattern),
                    TourPackage.state.ilike(search_pattern)
                )
            )

        stmt = stmt.order_by(TourPackage.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def update_package(db: AsyncSession, package: TourPackage, update_data: Dict[str, Any]) -> TourPackage:
        """Update and persist modified attributes of a tour package."""
        for key, value in update_data.items():
            if value is not None and hasattr(package, key):
                setattr(package, key, value)
        await db.commit()
        await db.refresh(package)
        return package

    @staticmethod
    async def delete_package(db: AsyncSession, package: TourPackage) -> bool:
        """Hard delete a tour package from the database."""
        await db.delete(package)
        await db.commit()
        return True
