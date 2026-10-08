from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.user import UserResponse
from app.schemas.booking import BookingResponse
from app.schemas.vehicle import VehicleResponse
from app.schemas.tour_package import TourPackageResponse


class ReviewCreate(BaseModel):
    """Schema for submitting a review for a completed booking."""
    booking_id: str = Field(..., description="Completed booking UUID to review")
    rating: int = Field(..., ge=1, le=5, description="Star rating between 1 and 5", examples=[5])
    title: str = Field(..., min_length=3, max_length=150, description="Review headline", examples=["Excellent journey!"])
    review: str = Field(..., min_length=10, description="Detailed review text", examples=["The cab was clean and driver was punctual."])
    images: Optional[List[str]] = Field(None, description="Optional photo URLs")


class ReviewUpdate(BaseModel):
    """Schema for updating a customer's own review."""
    rating: Optional[int] = Field(None, ge=1, le=5)
    title: Optional[str] = Field(None, min_length=3, max_length=150)
    review: Optional[str] = Field(None, min_length=10)
    images: Optional[List[str]] = None


class AdminReplyRequest(BaseModel):
    """Schema for admin official reply."""
    admin_reply: str = Field(..., min_length=2, description="Official response text")


class ReviewVisibilityUpdate(BaseModel):
    """Schema for admin visibility toggle."""
    is_visible: bool = Field(..., description="Visibility status flag")
    is_featured: Optional[bool] = Field(None, description="Featured flag")


class RatingDistribution(BaseModel):
    """Schema for rating aggregate distribution summary."""
    five_star: int = 0
    four_star: int = 0
    three_star: int = 0
    two_star: int = 0
    one_star: int = 0
    average_rating: float = 5.0
    total_reviews: int = 0


class ReviewResponse(BaseModel):
    """Schema for review detail response payload."""
    id: str
    customer_id: str
    booking_id: str
    vehicle_id: Optional[str] = None
    driver_id: Optional[str] = None
    package_id: Optional[str] = None

    rating: int
    title: str
    review: str
    images: Optional[List[str]] = None

    is_verified_purchase: bool
    is_featured: bool
    is_visible: bool

    admin_reply: Optional[str] = None
    helpful_count: int
    reported_count: int

    created_at: datetime
    updated_at: datetime

    customer: Optional[UserResponse] = None
    booking: Optional[BookingResponse] = None
    vehicle: Optional[VehicleResponse] = None
    driver: Optional[UserResponse] = None
    package: Optional[TourPackageResponse] = None

    model_config = ConfigDict(from_attributes=True)
