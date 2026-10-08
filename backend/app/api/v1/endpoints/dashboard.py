from typing import Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import (
    DashboardOverviewResponse,
    RevenueAnalyticsResponse,
    BookingAnalyticsResponse,
    DriverAnalyticsResponse,
    VehicleAnalyticsResponse,
    CustomerAnalyticsResponse,
    AdminDashboardStatsResponse,
)
from app.schemas.response import APIResponse, success_response
from app.core.permissions import require_admin
from app.models.user import User

router = APIRouter()
admin_router = APIRouter()


@router.get(
    "/overview",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[DashboardOverviewResponse],
    summary="Get Admin Dashboard KPI overview",
    description="Retrieves summary cards for total users, customers, drivers, vehicles, bookings, revenue, and payments. Requires Admin privileges."
)
async def get_overview(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): KPI metrics overview."""
    overview = await DashboardService.get_overview(db=db)
    return success_response(data=overview, message="Dashboard overview fetched successfully")


@router.get(
    "/revenue",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[RevenueAnalyticsResponse],
    summary="Get revenue analytics & GST collections",
    description="Retrieves daily, weekly, monthly, and yearly revenue aggregates with line chart data. Requires Admin privileges."
)
async def get_revenue_analytics(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Financial analytics."""
    revenue = await DashboardService.get_revenue_analytics(db=db)
    return success_response(data=revenue, message="Revenue analytics fetched successfully")


@router.get(
    "/bookings",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[BookingAnalyticsResponse],
    summary="Get booking analytics & popular routes",
    description="Retrieves booking status breakdown, top routes, and status donut chart data. Requires Admin privileges."
)
async def get_booking_analytics(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Reservation analytics."""
    bookings = await DashboardService.get_booking_analytics(db=db)
    return success_response(data=bookings, message="Booking analytics fetched successfully")


@router.get(
    "/drivers",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[DriverAnalyticsResponse],
    summary="Get driver fleet analytics",
    description="Retrieves driver operational status counts and trip completion rates. Requires Admin privileges."
)
async def get_driver_analytics(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Driver analytics."""
    drivers = await DashboardService.get_driver_analytics(db=db)
    return success_response(data=drivers, message="Driver analytics fetched successfully")


@router.get(
    "/vehicles",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[VehicleAnalyticsResponse],
    summary="Get vehicle fleet analytics",
    description="Retrieves vehicle availability and utilization metrics. Requires Admin privileges."
)
async def get_vehicle_analytics(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Vehicle analytics."""
    vehicles = await DashboardService.get_vehicle_analytics(db=db)
    return success_response(data=vehicles, message="Vehicle analytics fetched successfully")


@router.get(
    "/customers",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[CustomerAnalyticsResponse],
    summary="Get customer growth analytics",
    description="Retrieves new vs repeat customer growth charts. Requires Admin privileges."
)
async def get_customer_analytics(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Customer analytics."""
    customers = await DashboardService.get_customer_analytics(db=db)
    return success_response(data=customers, message="Customer analytics fetched successfully")


@admin_router.get(
    "/stats",
    status_code=status.HTTP_200_OK,
    response_model=AdminDashboardStatsResponse,
    summary="Get admin dashboard KPIs statistics",
    description="Retrieves operational stats for total users, drivers, vehicles, bookings, revenue. Requires Admin privileges."
)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): KPI stats overview."""
    return await DashboardService.get_dashboard_stats(db=db)
