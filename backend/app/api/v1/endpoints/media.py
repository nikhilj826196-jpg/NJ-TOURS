from typing import Any, List, Optional
from fastapi import APIRouter, Depends, status, Query, Path, UploadFile, File, Form, Body
from sqlalchemy.ext.asyncio import AsyncSession


from app.database.connection import get_db
from app.services.media_service import MediaService
from app.schemas.media import MediaResponse, MediaUpdate
from app.schemas.response import APIResponse, success_response
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[MediaResponse],
    summary="Upload a single file",
    description="Uploads a single image (JPG, PNG, WebP) or document (PDF). Max 10MB for images, 20MB for PDFs."
)
async def upload_file(
    file: UploadFile = File(..., description="Image or PDF document file"),
    folder: str = Form(..., description="Destination subfolder: vehicles, drivers, packages, users, documents, invoices"),
    related_vehicle_id: Optional[str] = Form(None, description="Optional Vehicle UUID association"),
    related_driver_id: Optional[str] = Form(None, description="Optional Driver Profile UUID association"),
    related_package_id: Optional[str] = Form(None, description="Optional Tour Package UUID association"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint: Single file upload handler.
    """
    media = await MediaService.upload_file(
        db=db,
        file=file,
        folder=folder,
        current_user=current_user,
        related_vehicle_id=related_vehicle_id,
        related_driver_id=related_driver_id,
        related_package_id=related_package_id
    )
    return success_response(data=media, message="File uploaded successfully")


@router.post(
    "/upload-multiple",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[List[MediaResponse]],
    summary="Upload multiple files in batch",
    description="Uploads a list of image or PDF document files sequentially."
)
async def upload_multiple_files(
    files: List[UploadFile] = File(..., description="List of image or PDF document files"),
    folder: str = Form(..., description="Destination subfolder: vehicles, drivers, packages, users, documents, invoices"),
    related_vehicle_id: Optional[str] = Form(None, description="Optional Vehicle UUID association"),
    related_driver_id: Optional[str] = Form(None, description="Optional Driver Profile UUID association"),
    related_package_id: Optional[str] = Form(None, description="Optional Tour Package UUID association"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint: Batch file upload handler.
    """
    media_list = await MediaService.upload_multiple_files(
        db=db,
        files=files,
        folder=folder,
        current_user=current_user,
        related_vehicle_id=related_vehicle_id,
        related_driver_id=related_driver_id,
        related_package_id=related_package_id
    )
    return success_response(data=media_list, message="Multiple files uploaded successfully")


@router.get(
    "/list",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[MediaResponse]],
    summary="List uploaded media files",
    description="Retrieves a paginated list of media files with folder, file_type, or entity relation filters."
)
async def list_media(
    folder: Optional[str] = Query(None, description="Filter by subfolder name"),
    file_type: Optional[str] = Query(None, description="Filter by file type (image or document)"),
    related_vehicle_id: Optional[str] = Query(None, description="Filter by vehicle ID"),
    related_driver_id: Optional[str] = Query(None, description="Filter by driver ID"),
    related_package_id: Optional[str] = Query(None, description="Filter by package ID"),
    skip: int = Query(0, ge=0, description="Offset skip count"),
    limit: int = Query(100, ge=1, le=100, description="Max limit"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint: Paginated media list.
    """
    media_list = await MediaService.list_media(
        db=db,
        current_user=current_user,
        folder=folder,
        file_type=file_type,
        related_vehicle_id=related_vehicle_id,
        related_driver_id=related_driver_id,
        related_package_id=related_package_id,
        skip=skip,
        limit=limit
    )
    return success_response(data=media_list, message="Media list retrieved successfully")


@router.get(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[MediaResponse],
    summary="Get media record by ID",
    description="Retrieves metadata details for a single uploaded file."
)
async def get_media(
    id: str = Path(..., description="Media UUID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint: Get media details.
    """
    media = await MediaService.get_media_by_id(db=db, media_id=id)
    return success_response(data=media, message="Media details retrieved successfully")


@router.put(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[MediaResponse],
    summary="Update media record relations",
    description="Updates entity associations (vehicle, driver, or tour package UUIDs) for a media record."
)
async def update_media(
    id: str = Path(..., description="Media UUID"),
    media_in: MediaUpdate = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint: Update media associations.
    """
    media = await MediaService.update_media(
        db=db, media_id=id, media_update=media_in, current_user=current_user
    )
    return success_response(data=media, message="Media updated successfully")


@router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Delete media file",
    description="Deletes media record from database and removes file and thumbnail from storage disk."
)
async def delete_media(
    id: str = Path(..., description="Media UUID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint: Delete media file.
    """
    await MediaService.delete_file(db=db, media_id=id, current_user=current_user)
    return success_response(data={}, message="Media file deleted successfully")
