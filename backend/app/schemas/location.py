from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class LocationUpdateInput(BaseModel):
    """Schema for driver telemetry updates."""
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude coordinates")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude coordinates")
    booking_id: Optional[str] = Field(None, description="Active Booking UUID if on a trip")
    speed: Optional[float] = Field(None, ge=0.0, description="Current speed in km/h")
    heading: Optional[float] = Field(None, ge=0.0, le=360.0, description="Heading degrees")
    accuracy: Optional[float] = Field(None, ge=0.0, description="GPS accuracy radius in meters")
    altitude: Optional[float] = Field(None, description="Altitude in meters")
    battery_level: Optional[float] = Field(None, ge=0.0, le=100.0, description="Device battery level percentage")
    gps_timestamp: datetime = Field(default_factory=datetime.utcnow, description="Device level GPS timestamp")


class LocationResponse(BaseModel):
    """Schema for individual GPS log entry response."""
    id: str
    driver_id: str
    vehicle_id: str
    booking_id: Optional[str] = None
    latitude: float
    longitude: float
    speed: Optional[float] = None
    heading: Optional[float] = None
    accuracy: Optional[float] = None
    altitude: Optional[float] = None
    battery_level: Optional[float] = None
    gps_timestamp: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CurrentLocationResponse(BaseModel):
    """Schema for current live tracking state of booking."""
    booking_id: str
    latitude: float
    longitude: float
    speed: Optional[float] = None
    heading: Optional[float] = None
    gps_timestamp: datetime

    # Calculated metrics
    eta_minutes: float = Field(..., description="Estimated time of arrival in minutes")
    remaining_distance_km: float = Field(..., description="Remaining distance in km")
    travelled_distance_km: float = Field(..., description="Travelled distance in km")
    average_speed_kmh: float = Field(..., description="Calculated average speed in km/h")


class RouteHistoryResponse(BaseModel):
    """Schema for full trip route playback history."""
    booking_id: str
    route: List[LocationResponse]
