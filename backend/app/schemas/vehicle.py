from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.models.vehicle import VehicleCategory, FuelType


class VehicleCreate(BaseModel):
    """Schema for creating a new vehicle record in the fleet."""
    name: str = Field(..., min_length=2, max_length=100, description="Display name", examples=["Toyota Innova Crysta"])
    brand: str = Field(..., min_length=2, max_length=50, description="Manufacturer brand", examples=["Toyota"])
    model_name: str = Field(..., min_length=1, max_length=50, description="Vehicle model", examples=["Innova Crysta VX"])
    vehicle_number: str = Field(..., min_length=5, max_length=20, description="Registration plate number", examples=["MH12AB1234"])
    category: VehicleCategory = Field(default=VehicleCategory.SUV, description="Category of vehicle")
    seating_capacity: int = Field(..., gt=0, lt=100, description="Passenger seating count", examples=[7])
    per_km_rate: float = Field(..., gt=0, description="Rental rate per km in INR", examples=[18.5])
    per_day_rate: float = Field(..., gt=0, description="Daily flat rental rate in INR", examples=[3500.0])
    fuel_type: FuelType = Field(default=FuelType.DIESEL, description="Fuel variant")
    is_ac: bool = Field(default=True, description="AC feature availability")
    is_available: bool = Field(default=True, description="Vehicle availability for booking")
    image_url: Optional[str] = Field(None, description="URL of vehicle photo")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Toyota Innova Crysta",
                "brand": "Toyota",
                "model_name": "Innova Crysta VX",
                "vehicle_number": "MH12AB1234",
                "category": "SUV",
                "seating_capacity": 7,
                "per_km_rate": 18.5,
                "per_day_rate": 3500.0,
                "fuel_type": "Diesel",
                "is_ac": True,
                "is_available": True,
                "image_url": "https://example.com/innova.jpg"
            }
        }
    )


class VehicleUpdate(BaseModel):
    """Schema for updating vehicle specifications and pricing rates."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    brand: Optional[str] = Field(None, min_length=2, max_length=50)
    model_name: Optional[str] = Field(None, min_length=1, max_length=50)
    vehicle_number: Optional[str] = Field(None, min_length=5, max_length=20)
    category: Optional[VehicleCategory] = None
    seating_capacity: Optional[int] = Field(None, gt=0, lt=100)
    per_km_rate: Optional[float] = Field(None, gt=0)
    per_day_rate: Optional[float] = Field(None, gt=0)
    fuel_type: Optional[FuelType] = None
    is_ac: Optional[bool] = None
    is_available: Optional[bool] = None
    image_url: Optional[str] = None


class VehicleResponse(BaseModel):
    """Schema for vehicle details output payload."""
    id: str
    name: str
    brand: str
    model_name: str
    vehicle_number: str
    category: VehicleCategory
    seating_capacity: int
    per_km_rate: float
    per_day_rate: float
    fuel_type: FuelType
    is_ac: bool
    is_available: bool
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
