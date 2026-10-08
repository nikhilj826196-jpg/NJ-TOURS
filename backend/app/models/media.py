import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.connection import Base


class MediaFile(Base):
    """
    SQLAlchemy 2.0 Media Model for file uploads, image processing, and document management.
    """
    __tablename__ = "media_files"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
        comment="UUID Primary Key"
    )
    original_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Original uploaded filename"
    )
    stored_name: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
        comment="UUID generated filename stored on disk"
    )
    file_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="image",
        comment="Classification (image or document)"
    )
    mime_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="MIME type (image/jpeg, image/png, application/pdf)"
    )
    file_size: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        comment="File size in bytes"
    )
    file_extension: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        comment="File extension (.jpg, .png, .pdf)"
    )
    folder: Mapped[str] = mapped_column(
        String(50),
        index=True,
        nullable=False,
        comment="Folder category (vehicles, drivers, packages, users, documents, invoices)"
    )
    file_path: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        comment="Relative path on filesystem"
    )
    file_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        comment="Public web access URL"
    )
    thumbnail_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        comment="Thumbnail image access URL"
    )

    uploaded_by_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="User ID who uploaded the file"
    )

    # Optional Entity Relations
    related_vehicle_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("vehicles.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    related_driver_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("driver_profiles.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    related_package_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("tour_packages.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    uploaded_by = relationship("User", foreign_keys=[uploaded_by_id], lazy="selectin")
    vehicle = relationship("Vehicle", foreign_keys=[related_vehicle_id], lazy="selectin")
    driver = relationship("DriverProfile", foreign_keys=[related_driver_id], lazy="selectin")
    package = relationship("TourPackage", foreign_keys=[related_package_id], lazy="selectin")

    def __repr__(self) -> str:
        return f"<MediaFile(id={self.id}, folder={self.folder}, file_url={self.file_url})>"
