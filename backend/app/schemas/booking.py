from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator
from app.models.booking import TripType, BookingStatus, PaymentStatus
from app.schemas.user import UserResponse
from app.schemas.vehicle import VehicleResponse


class PriceCalculationRequest(BaseModel):
    """Schema for estimating trip booking fare."""
    vehicle_id: str = Field(..., description="Vehicle UUID to calculate pricing for")
    trip_type: TripType = Field(..., description="Type of trip")
    distance_km: float = Field(..., gt=0, description="Estimated distance in km")
    days: int = Field(default=1, gt=0, description="Trip duration in days")


class PriceCalculationResponse(BaseModel):
    """Schema for pricing estimation result."""
    base_fare: float
    driver_allowance: float
    toll_charges: float
    parking_charges: float
    extra_charges: float
    discount: float
    gst: float
    grand_total: float


class BookingCreate(BaseModel):
    """Schema for creating a new booking reservation."""
    vehicle_id: str = Field(..., description="Selected Vehicle UUID")
    trip_type: TripType = Field(default=TripType.ONE_WAY, description="Trip type")
    pickup_location: str = Field(..., min_length=3, max_length=255, description="Pickup location address")
    drop_location: str = Field(..., min_length=3, max_length=255, description="Drop location address")
    pickup_date: date = Field(..., description="Date of pickup")
    pickup_time: str = Field(..., description="Pickup time (e.g. 09:00 AM)")
    return_date: Optional[date] = Field(None, description="Return date for round trips")
    passengers: int = Field(..., gt=0, lt=100, description="Passenger count")
    distance_km: float = Field(..., gt=0, description="Estimated distance in km")
    estimated_duration: str = Field(default="1 Hour", description="Estimated trip duration")

    @field_validator("pickup_date")
    @classmethod
    def validate_future_pickup_date(cls, v: date) -> date:
        if v < date.today():
            raise ValueError("Pickup date cannot be in the past")
        return v


class BookingAssignDriver(BaseModel):
    """Schema for assigning a driver to a booking."""
    driver_id: str = Field(..., description="Driver User UUID to assign")


class BookingStatusUpdate(BaseModel):
    """Schema for updating booking status."""
    status: BookingStatus = Field(..., description="New booking status")
    payment_status: Optional[PaymentStatus] = Field(None, description="Updated payment status")


class BookingCancelRequest(BaseModel):
    """Schema for requesting a booking cancellation."""
    reason: str = Field(..., min_length=1, max_length=255, description="Cancellation reason")


class BookingUpdate(BaseModel):
    """Schema for updating general booking details."""
    pickup_location: Optional[str] = Field(None, min_length=3, max_length=255)
    drop_location: Optional[str] = Field(None, min_length=3, max_length=255)
    pickup_date: Optional[date] = None
    pickup_time: Optional[str] = None
    return_date: Optional[date] = None
    passengers: Optional[int] = Field(None, gt=0, lt=100)
    distance_km: Optional[float] = Field(None, gt=0)
    status: Optional[BookingStatus] = None
    payment_status: Optional[PaymentStatus] = None
    driver_id: Optional[str] = None
    vehicle_id: Optional[str] = None


class BookingResponse(BaseModel):
    """Schema for complete booking detail response."""
    id: str
    booking_number: str
    customer_id: str
    driver_id: Optional[str] = None
    vehicle_id: str

    trip_type: TripType
    pickup_location: str
    drop_location: str
    pickup_date: date
    pickup_time: str
    return_date: Optional[date] = None
    passengers: int
    distance_km: float
    estimated_duration: str

    base_fare: float
    driver_allowance: float
    toll_charges: float
    parking_charges: float
    extra_charges: float
    discount: float
    gst: float
    grand_total: float

    status: BookingStatus
    payment_status: PaymentStatus

    cancellation_reason: Optional[str] = None
    cancelled_at: Optional[datetime] = None

    created_at: datetime
    updated_at: datetime

    customer: Optional[UserResponse] = None
    driver: Optional[UserResponse] = None
    vehicle: Optional[VehicleResponse] = None

    model_config = ConfigDict(from_attributes=True)
