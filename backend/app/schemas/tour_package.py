from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict, field_validator


class TourPackageCreate(BaseModel):
    """Schema for creating a new tour package."""
    name: str = Field(..., min_length=3, max_length=150, description="Package title", examples=["Kashmir Paradise Tour"])
    category: str = Field(default="General", max_length=50, description="Category type", examples=["Hill Station"])
    destination: str = Field(..., min_length=2, max_length=100, description="Primary destination", examples=["Srinagar"])
    state: str = Field(..., min_length=2, max_length=50, description="State name", examples=["Jammu & Kashmir"])
    duration: str = Field(..., description="Duration string", examples=["6 Days / 5 Nights"])
    price: float = Field(..., gt=0, description="Standard price per person in INR", examples=[24999.0])
    offer_price: Optional[float] = Field(None, gt=0, description="Discounted offer price per person in INR", examples=[19999.0])
    description: str = Field(..., min_length=10, description="Full detailed package description")
    highlights: Optional[List[str]] = Field(None, description="List of key tour highlights")
    inclusions: Optional[List[str]] = Field(None, description="Included services list")
    exclusions: Optional[List[str]] = Field(None, description="Excluded items list")
    itinerary: Optional[List[Dict[str, Any]]] = Field(None, description="Day wise schedule")
    pickup_city: str = Field(default="Pune", max_length=100, description="Departure pickup city")
    cover_image: Optional[str] = Field(None, description="Banner image URL")
    images: Optional[List[str]] = Field(None, description="Gallery images URLs")
    max_persons: int = Field(default=20, gt=0, description="Maximum person group capacity")
    min_persons: int = Field(default=1, gt=0, description="Minimum person requirement")
    available_seats: int = Field(default=20, ge=0, description="Available seats left")
    is_featured: bool = Field(default=False, description="Featured package flag")
    is_active: bool = Field(default=True, description="Active status flag")

    @field_validator("offer_price")
    @classmethod
    def validate_offer_price(cls, v: Optional[float], info) -> Optional[float]:
        if v is not None and "price" in info.data and v >= info.data["price"]:
            raise ValueError("Offer price must be strictly lower than regular price")
        return v


class TourPackageUpdate(BaseModel):
    """Schema for updating tour package attributes."""
    name: Optional[str] = Field(None, min_length=3, max_length=150)
    category: Optional[str] = None
    destination: Optional[str] = None
    state: Optional[str] = None
    duration: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    offer_price: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    highlights: Optional[List[str]] = None
    inclusions: Optional[List[str]] = None
    exclusions: Optional[List[str]] = None
    itinerary: Optional[List[Dict[str, Any]]] = None
    pickup_city: Optional[str] = None
    cover_image: Optional[str] = None
    images: Optional[List[str]] = None
    max_persons: Optional[int] = Field(None, gt=0)
    min_persons: Optional[int] = Field(None, gt=0)
    available_seats: Optional[int] = Field(None, ge=0)
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None


class TourPackageResponse(BaseModel):
    """Schema for tour package detail output payload."""
    id: str
    name: str
    slug: str
    category: str
    destination: str
    state: str
    duration: str
    price: float
    offer_price: Optional[float] = None
    description: str
    highlights: Optional[List[str]] = None
    inclusions: Optional[List[str]] = None
    exclusions: Optional[List[str]] = None
    itinerary: Optional[List[Dict[str, Any]]] = None
    pickup_city: str
    cover_image: Optional[str] = None
    images: Optional[List[str]] = None
    max_persons: int
    min_persons: int
    available_seats: int
    rating: float
    reviews_count: int
    is_featured: bool
    is_active: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
