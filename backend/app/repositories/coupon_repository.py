from typing import Optional, Dict, Any, List
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.coupon import Coupon, CouponUsage


class CouponRepository:
    """
    Repository layer for isolating all Coupon database operations using SQLAlchemy 2.0 Async Session.
    """

    @staticmethod
    async def get_by_id(db: AsyncSession, coupon_id: str) -> Optional[Coupon]:
        """Fetch a single coupon by UUID primary key."""
        stmt = select(Coupon).where(Coupon.id == coupon_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_code(db: AsyncSession, coupon_code: str) -> Optional[Coupon]:
        """Fetch a single coupon by uppercase code."""
        stmt = select(Coupon).where(Coupon.coupon_code == coupon_code.strip().upper())
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_coupon(db: AsyncSession, coupon: Coupon) -> Coupon:
        """Persist a new Coupon record in the database."""
        db.add(coupon)
        await db.commit()
        await db.refresh(coupon)
        return coupon

    @staticmethod
    async def list_coupons(
        db: AsyncSession,
        is_active: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Coupon]:
        """Fetch a paginated list of coupons with optional active status filter."""
        stmt = select(Coupon)
        if is_active is not None:
            stmt = stmt.where(Coupon.is_active == is_active)

        stmt = stmt.order_by(Coupon.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def update_coupon(db: AsyncSession, coupon: Coupon, update_data: Dict[str, Any]) -> Coupon:
        """Update and persist modified attributes of a coupon."""
        for key, value in update_data.items():
            if value is not None and hasattr(coupon, key):
                setattr(coupon, key, value)
        await db.commit()
        await db.refresh(coupon)
        return coupon

    @staticmethod
    async def delete_coupon(db: AsyncSession, coupon: Coupon) -> bool:
        """Hard delete a coupon record from the database."""
        await db.delete(coupon)
        await db.commit()
        return True

    @staticmethod
    async def get_user_usage_count(db: AsyncSession, coupon_id: str, user_id: str) -> int:
        """Counts total redemptions of a specific coupon by a user."""
        stmt = select(func.count(CouponUsage.id)).where(
            CouponUsage.coupon_id == coupon_id,
            CouponUsage.user_id == user_id
        )
        result = await db.execute(stmt)
        return result.scalar() or 0

    @staticmethod
    async def record_usage(db: AsyncSession, usage: CouponUsage) -> CouponUsage:
        """Records a user redemption event for a coupon."""
        db.add(usage)
        await db.commit()
        await db.refresh(usage)
        return usage
