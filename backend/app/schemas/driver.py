from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator
from app.models.driver import DriverStatus
from app.schemas.user import UserResponse, UserCreate
from app.schemas.vehicle import VehicleResponse


class DriverCreate(BaseModel):
    """Schema for creating a driver profile."""
    user_id: Optional[str] = Field(None, description="User UUID with Driver role")
    user: Optional[UserCreate] = Field(None, description="Optional user registration details")
    license_number: str = Field(..., min_length=5, max_length=50, description="Commercial driving license number", examples=["MH1220201234567"])
    license_expiry: date = Field(..., description="Driving license expiration date")
    aadhar_number: Optional[str] = Field(None, description="12-digit Aadhar number", examples=["123456789012"])
    pan_number: Optional[str] = Field(None, description="10-digit PAN number", examples=["ABCDE1234F"])
    address: Optional[str] = Field(None, max_length=255, description="Driver address")
    experience_years: int = Field(default=0, ge=0, le=50, description="Years of driving experience")
    emergency_contact: Optional[str] = Field(None, description="Emergency contact phone number")
    assigned_vehicle_id: Optional[str] = Field(None, description="Initially assigned Vehicle UUID")

    @field_validator("license_expiry")
    @classmethod
    def validate_future_expiry(cls, v: date) -> date:
        if v < date.today():
            raise ValueError("Driving license has already expired")
        return v


class DriverUpdate(BaseModel):
    """Schema for updating driver profile attributes."""
    license_number: Optional[str] = Field(None, min_length=5, max_length=50)
    license_expiry: Optional[date] = None
    aadhar_number: Optional[str] = None
    pan_number: Optional[str] = None
    address: Optional[str] = Field(None, max_length=255)
    experience_years: Optional[int] = Field(None, ge=0, le=50)
    emergency_contact: Optional[str] = None
    status: Optional[DriverStatus] = None
    assigned_vehicle_id: Optional[str] = None


class DriverAssignVehicle(BaseModel):
    """Schema for assigning or reassigning a vehicle to a driver."""
    vehicle_id: Optional[str] = Field(..., description="Vehicle UUID to assign (or None to unassign)")


class DriverStatusUpdate(BaseModel):
    """Schema for updating driver availability status."""
    status: DriverStatus = Field(..., description="New driver status (Available, Busy, Offline, On Trip)")


class DriverResponse(BaseModel):
    """Schema for driver profile response payload."""
    id: str
    user_id: str
    license_number: str
    license_expiry: date
    aadhar_number: Optional[str] = None
    pan_number: Optional[str] = None
    address: Optional[str] = None
    experience_years: int
    emergency_contact: Optional[str] = None
    status: DriverStatus
    assigned_vehicle_id: Optional[str] = None

    created_at: datetime
    updated_at: datetime

    user: Optional[UserResponse] = None
    assigned_vehicle: Optional[VehicleResponse] = None

    model_config = ConfigDict(from_attributes=True)
