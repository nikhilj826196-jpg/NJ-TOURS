from typing import Optional, Dict, Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.media import MediaFile


class MediaRepository:
    """
    Repository layer for isolating Media database operations using SQLAlchemy 2.0 Async Session.
    """

    @staticmethod
    async def get_by_id(db: AsyncSession, media_id: str) -> Optional[MediaFile]:
        """Fetch a single media file record by UUID primary key."""
        stmt = select(MediaFile).where(MediaFile.id == media_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_media(db: AsyncSession, media: MediaFile) -> MediaFile:
        """Persist a new MediaFile record in the database."""
        db.add(media)
        await db.commit()
        await db.refresh(media)
        return media

    @staticmethod
    async def list_media(
        db: AsyncSession,
        folder: Optional[str] = None,
        file_type: Optional[str] = None,
        uploaded_by_id: Optional[str] = None,
        related_vehicle_id: Optional[str] = None,
        related_driver_id: Optional[str] = None,
        related_package_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[MediaFile]:
        """Fetch a paginated list of media files matching filter conditions."""
        stmt = select(MediaFile)
        if folder:
            stmt = stmt.where(MediaFile.folder == folder)
        if file_type:
            stmt = stmt.where(MediaFile.file_type == file_type)
        if uploaded_by_id:
            stmt = stmt.where(MediaFile.uploaded_by_id == uploaded_by_id)
        if related_vehicle_id:
            stmt = stmt.where(MediaFile.related_vehicle_id == related_vehicle_id)
        if related_driver_id:
            stmt = stmt.where(MediaFile.related_driver_id == related_driver_id)
        if related_package_id:
            stmt = stmt.where(MediaFile.related_package_id == related_package_id)

        stmt = stmt.order_by(MediaFile.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def update_media(db: AsyncSession, media: MediaFile, update_data: Dict[str, Any]) -> MediaFile:
        """Update and persist modified attributes of a media record."""
        for key, value in update_data.items():
            if value is not None and hasattr(media, key):
                setattr(media, key, value)
        await db.commit()
        await db.refresh(media)
        return media

    @staticmethod
    async def delete_media(db: AsyncSession, media: MediaFile) -> bool:
        """Delete a media file record from the database."""
        await db.delete(media)
        await db.commit()
        return True
