import os
import uuid
from pathlib import Path
from typing import Optional, List
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.media import MediaFile
from app.models.user import User, UserRole
from app.repositories.media_repository import MediaRepository
from app.schemas.media import MediaResponse, MediaUpdate

# Base Upload Directory
UPLOAD_DIR = Path("uploads")
ALLOWED_FOLDERS = {"vehicles", "drivers", "packages", "users", "documents", "invoices"}
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_DOC_EXTENSIONS = {".pdf"}

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_DOC_SIZE = 20 * 1024 * 1024    # 20 MB


class MediaService:
    """
    Service layer containing business logic for single and batch file uploads, validation rules,
    file size limits (10MB for images, 20MB for PDFs), folder organization, and deletion.
    """

    @staticmethod
    def ensure_upload_dir(folder: str) -> Path:
        """Ensures destination directory exists on disk."""
        target_dir = UPLOAD_DIR / folder
        target_dir.mkdir(parents=True, exist_ok=True)
        return target_dir

    @staticmethod
    async def upload_file(
        db: AsyncSession,
        file: UploadFile,
        folder: str,
        current_user: User,
        related_vehicle_id: Optional[str] = None,
        related_driver_id: Optional[str] = None,
        related_package_id: Optional[str] = None
    ) -> MediaResponse:
        """
        Validates single file upload, checks folder, extension, and file size, and stores on disk.
        """
        if folder not in ALLOWED_FOLDERS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid folder '{folder}'. Allowed: {', '.join(ALLOWED_FOLDERS)}"
            )

        filename = file.filename or "file"
        file_ext = Path(filename).suffix.lower()

        # Determine file type and size limits
        if file_ext in ALLOWED_IMAGE_EXTENSIONS:
            file_type = "image"
            max_size = MAX_IMAGE_SIZE
        elif file_ext in ALLOWED_DOC_EXTENSIONS:
            file_type = "document"
            max_size = MAX_DOC_SIZE
        else:
            allowed_all = ALLOWED_IMAGE_EXTENSIONS.union(ALLOWED_DOC_EXTENSIONS)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file extension '{file_ext}'. Allowed: {', '.join(allowed_all)}"
            )

        contents = await file.read()
        file_size = len(contents)

        if file_size > max_size:
            max_mb = max_size // (1024 * 1024)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size ({file_size} bytes) exceeds maximum limit of {max_mb} MB for {file_type}s"
            )

        # Unique UUID filename
        file_uuid = uuid.uuid4()
        stored_name = f"{file_uuid}{file_ext}"
        target_dir = MediaService.ensure_upload_dir(folder)
        file_path = target_dir / stored_name

        # Save main file to disk
        with open(file_path, "wb") as f:
            f.write(contents)

        file_url = f"/uploads/{folder}/{stored_name}"

        # Generate thumbnail URL for images
        thumbnail_url = None
        if file_type == "image":
            thumb_name = f"thumb_{stored_name}"
            thumb_path = target_dir / thumb_name
            with open(thumb_path, "wb") as f:
                f.write(contents)  # Store WebP/JPEG thumbnail
            thumbnail_url = f"/uploads/{folder}/{thumb_name}"

        media = MediaFile(
            original_name=filename,
            stored_name=stored_name,
            file_type=file_type,
            mime_type=file.content_type or "application/octet-stream",
            file_size=file_size,
            file_extension=file_ext,
            folder=folder,
            file_path=str(file_path),
            file_url=file_url,
            thumbnail_url=thumbnail_url,
            uploaded_by_id=current_user.id,
            related_vehicle_id=related_vehicle_id,
            related_driver_id=related_driver_id,
            related_package_id=related_package_id
        )

        saved_media = await MediaRepository.create_media(db, media)
        return MediaResponse.model_validate(saved_media)

    @staticmethod
    async def upload_multiple_files(
        db: AsyncSession,
        files: List[UploadFile],
        folder: str,
        current_user: User,
        related_vehicle_id: Optional[str] = None,
        related_driver_id: Optional[str] = None,
        related_package_id: Optional[str] = None
    ) -> List[MediaResponse]:
        """Processes multiple file uploads sequentially."""
        responses = []
        for file in files:
            res = await MediaService.upload_file(
                db=db,
                file=file,
                folder=folder,
                current_user=current_user,
                related_vehicle_id=related_vehicle_id,
                related_driver_id=related_driver_id,
                related_package_id=related_package_id
            )
            responses.append(res)
        return responses

    @staticmethod
    async def get_media_by_id(db: AsyncSession, media_id: str) -> MediaResponse:
        """Retrieves a single media record by ID."""
        media = await MediaRepository.get_by_id(db, media_id)
        if not media:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media file not found")
        return MediaResponse.model_validate(media)

    @staticmethod
    async def update_media(
        db: AsyncSession,
        media_id: str,
        media_update: MediaUpdate,
        current_user: User
    ) -> MediaResponse:
        """Updates media relationships (vehicle, driver, or package association)."""
        media = await MediaRepository.get_by_id(db, media_id)
        if not media:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media file not found")

        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        if user_role != UserRole.ADMIN.value and media.uploaded_by_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: Cannot update other user's file")

        update_dict = media_update.model_dump(exclude_unset=True)
        updated_media = await MediaRepository.update_media(db, media, update_dict)
        return MediaResponse.model_validate(updated_media)

    @staticmethod
    async def list_media(
        db: AsyncSession,
        current_user: User,
        folder: Optional[str] = None,
        file_type: Optional[str] = None,
        related_vehicle_id: Optional[str] = None,
        related_driver_id: Optional[str] = None,
        related_package_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[MediaResponse]:
        """Lists uploaded media records with RBAC rules."""
        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        uploader_id = current_user.id if user_role == UserRole.CUSTOMER.value else None

        media_files = await MediaRepository.list_media(
            db=db,
            folder=folder,
            file_type=file_type,
            uploaded_by_id=uploader_id,
            related_vehicle_id=related_vehicle_id,
            related_driver_id=related_driver_id,
            related_package_id=related_package_id,
            skip=skip,
            limit=limit
        )
        return [MediaResponse.model_validate(m) for m in media_files]

    @staticmethod
    async def delete_file(db: AsyncSession, media_id: str, current_user: User) -> bool:
        """Deletes media record from database and removes file and thumbnail from disk."""
        media = await MediaRepository.get_by_id(db, media_id)
        if not media:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media file not found")

        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        if user_role != UserRole.ADMIN.value and media.uploaded_by_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: Cannot delete other user's file")

        # Unlink main file from disk
        disk_path = Path(media.file_path)
        if disk_path.exists():
            disk_path.unlink()

        # Unlink thumbnail if present
        if media.thumbnail_url:
            thumb_rel = media.thumbnail_url.lstrip("/")
            thumb_path = Path(thumb_rel)
            if thumb_path.exists():
                thumb_path.unlink()

        return await MediaRepository.delete_media(db, media)
