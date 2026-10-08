from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class ChartSeries(BaseModel):
    """Schema for individual chart data series."""
    name: str = Field(..., description="Dataset label name")
    data: List[float] = Field(..., description="Numerical data points")


class ChartData(BaseModel):
    """Schema for chart-ready JSON structures (Line, Bar, Pie, Donut charts)."""
    labels: List[str] = Field(..., description="X-axis category labels or slice names")
    series: List[ChartSeries] = Field(..., description="List of data series")


class DashboardOverviewResponse(BaseModel):
    """Schema for top-level Admin Dashboard Overview metrics."""
    total_users: int
    total_customers: int
    total_drivers: int
    total_vehicles: int
    total_bookings: int
    completed_trips: int
    cancelled_trips: int
    total_tour_packages: int

    revenue_today: float
    revenue_this_month: float
    revenue_this_year: float
    total_revenue: float = 0.0

    pending_payments: int
    completed_payments: int
    total_refunds: int

    model_config = ConfigDict(from_attributes=True)


class RevenueAnalyticsResponse(BaseModel):
    """Schema for Revenue Analytics & GST Collections."""
    daily_revenue: float
    weekly_revenue: float
    monthly_revenue: float
    yearly_revenue: float
    gst_collected: float
    average_booking_value: float
    revenue_chart: ChartData


class BookingAnalyticsResponse(BaseModel):
    """Schema for Booking Analytics and route popularity."""
    total_bookings: int
    bookings_per_day: int
    bookings_per_month: int
    bookings_by_status: Dict[str, int]
    most_popular_route: str
    most_booked_vehicle: str
    most_booked_package: str
    status_chart: ChartData


class DriverAnalyticsResponse(BaseModel):
    """Schema for Driver Fleet Analytics."""
    total_drivers: int
    available_drivers: int
    busy_drivers: int
    offline_drivers: int
    trips_completed: int
    driver_status_chart: ChartData


class VehicleAnalyticsResponse(BaseModel):
    """Schema for Vehicle Fleet Utilization & Revenue."""
    total_vehicles: int
    available_vehicles: int
    booked_vehicles: int
    most_used_vehicle: str
    revenue_per_vehicle: List[Dict[str, Any]]
    vehicle_utilization_chart: ChartData


class CustomerAnalyticsResponse(BaseModel):
    """Schema for Customer Growth & Retention metrics."""
    total_customers: int
    new_customers_this_month: int
    repeat_customers: int
    customer_growth_chart: ChartData


class AdminDashboardStatsResponse(BaseModel):
    """Schema for custom admin dashboard statistics."""
    total_users: int
    total_drivers: int
    active_drivers: int
    total_vehicles: int
    available_vehicles: int
    total_bookings: int
    weekly_bookings: int
    total_revenue: float
    pending_bookings: int

    model_config = ConfigDict(from_attributes=True)
