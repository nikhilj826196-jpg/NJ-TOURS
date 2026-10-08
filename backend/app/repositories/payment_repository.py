from typing import Optional, Dict, Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.payment import Payment, PaymentState


class PaymentRepository:
    """
    Repository layer for isolating all Payment database operations using SQLAlchemy 2.0 Async Session.
    """

    @staticmethod
    async def get_by_id(db: AsyncSession, payment_id: str) -> Optional[Payment]:
        """Fetch a payment record by UUID primary key or system payment_id."""
        stmt = select(Payment).where((Payment.id == payment_id) | (Payment.payment_id == payment_id))
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_razorpay_order_id(db: AsyncSession, razorpay_order_id: str) -> Optional[Payment]:
        """Fetch a payment record by Razorpay order ID."""
        stmt = select(Payment).where(Payment.razorpay_order_id == razorpay_order_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_booking_id(db: AsyncSession, booking_id: str) -> Optional[Payment]:
        """Fetch a payment record by associated booking ID."""
        stmt = select(Payment).where(Payment.booking_id == booking_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_payment(db: AsyncSession, payment: Payment) -> Payment:
        """Persist a new Payment record in the database."""
        db.add(payment)
        await db.commit()
        await db.refresh(payment)
        return payment

    @staticmethod
    async def list_payments(
        db: AsyncSession,
        customer_id: Optional[str] = None,
        status: Optional[PaymentState] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Payment]:
        """Fetch a paginated list of payment records with optional customer and status filters."""
        stmt = select(Payment)
        if customer_id:
            stmt = stmt.where(Payment.customer_id == customer_id)
        if status:
            stmt = stmt.where(Payment.status == status)
        stmt = stmt.order_by(Payment.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def update_payment(db: AsyncSession, payment: Payment, update_data: Dict[str, Any]) -> Payment:
        """Update and persist modified attributes of a payment record."""
        for key, value in update_data.items():
            if value is not None and hasattr(payment, key):
                setattr(payment, key, value)
        await db.commit()
        await db.refresh(payment)
        return payment
