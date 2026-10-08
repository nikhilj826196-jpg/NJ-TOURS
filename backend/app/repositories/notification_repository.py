from typing import Optional, Dict, Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification, NotificationChannel, NotificationStatus


class NotificationRepository:
    """
    Repository layer for isolating all Notification database operations using SQLAlchemy 2.0 Async Session.
    """

    @staticmethod
    async def get_by_id(db: AsyncSession, notification_id: str) -> Optional[Notification]:
        """Fetch a single notification log by UUID primary key."""
        stmt = select(Notification).where(Notification.id == notification_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_notification(db: AsyncSession, notification: Notification) -> Notification:
        """Persist a new Notification record in the database."""
        db.add(notification)
        await db.commit()
        await db.refresh(notification)
        return notification

    @staticmethod
    async def list_notifications(
        db: AsyncSession,
        user_id: Optional[str] = None,
        channel: Optional[NotificationChannel] = None,
        status: Optional[NotificationStatus] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Notification]:
        """Fetch a paginated list of notifications with optional user_id, channel, and status filters."""
        stmt = select(Notification)
        if user_id:
            stmt = stmt.where(Notification.user_id == user_id)
        if channel:
            stmt = stmt.where(Notification.channel == channel)
        if status:
            stmt = stmt.where(Notification.status == status)

        stmt = stmt.order_by(Notification.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def update_notification(
        db: AsyncSession,
        notification: Notification,
        update_data: Dict[str, Any]
    ) -> Notification:
        """Update and persist modified attributes of a notification log."""
        for key, value in update_data.items():
            if value is not None and hasattr(notification, key):
                setattr(notification, key, value)
        await db.commit()
        await db.refresh(notification)
        return notification
