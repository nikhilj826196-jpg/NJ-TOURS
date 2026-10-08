from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class BookingReportItem(BaseModel):
    """Schema for booking report table row."""
    booking_number: str
    customer_name: str
    customer_phone: str
    pickup_location: str
    drop_location: str
    pickup_date: date
    trip_type: str
    status: str
    payment_status: str
    grand_total: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RevenueReportItem(BaseModel):
    """Schema for revenue report summary line."""
    payment_id: str
    invoice_number: str
    booking_number: str
    customer_name: str
    amount: float
    gst: float
    total: float
    payment_method: str
    status: str
    date: datetime

    model_config = ConfigDict(from_attributes=True)


class DriverReportItem(BaseModel):
    """Schema for driver fleet report item."""
    license_number: str
    driver_name: str
    phone: str
    experience_years: int
    status: str
    assigned_vehicle: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class VehicleReportItem(BaseModel):
    """Schema for vehicle fleet report item."""
    vehicle_number: str
    name: str
    category: str
    seating_capacity: int
    per_km_rate: float
    per_day_rate: float
    is_available: bool

    model_config = ConfigDict(from_attributes=True)


class CustomerReportItem(BaseModel):
    """Schema for customer report item."""
    full_name: str
    email: str
    phone: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PackageReportItem(BaseModel):
    """Schema for tour package report item."""
    name: str
    category: str
    destination: str
    state: str
    duration: str
    price: float
    offer_price: Optional[float] = None
    available_seats: int
    is_featured: bool

    model_config = ConfigDict(from_attributes=True)
