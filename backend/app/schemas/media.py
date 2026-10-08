from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.user import UserResponse


class MediaUpdate(BaseModel):
    """Schema for updating media file relations and metadata."""
    related_vehicle_id: Optional[str] = Field(None, description="Associate with Vehicle UUID")
    related_driver_id: Optional[str] = Field(None, description="Associate with Driver UUID")
    related_package_id: Optional[str] = Field(None, description="Associate with Tour Package UUID")


class MediaResponse(BaseModel):
    """Schema for media file output details."""
    id: str
    original_name: str
    stored_name: str
    file_type: str
    mime_type: str
    file_size: int
    file_extension: str
    folder: str
    file_url: str
    thumbnail_url: Optional[str] = None
    uploaded_by_id: str
    related_vehicle_id: Optional[str] = None
    related_driver_id: Optional[str] = None
    related_package_id: Optional[str] = None

    created_at: datetime
    updated_at: datetime

    uploaded_by: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)
