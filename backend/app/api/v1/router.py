"""
API V1 Main Router
Consolidates all v1 endpoint routers.
"""
import sys
from pathlib import Path

# Ensure backend root directory is in sys.path for direct script execution
sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, vehicle, booking, driver, tour_package, payment, notification, dashboard, reports, media, coupon, review, location
)

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(vehicle.router, prefix="/vehicles", tags=["Vehicles"])
api_router.include_router(booking.router, prefix="/bookings", tags=["Bookings"])
api_router.include_router(driver.router, prefix="/drivers", tags=["Drivers"])
api_router.include_router(tour_package.router, prefix="/tour-packages", tags=["Tour Packages"])
api_router.include_router(payment.router, prefix="/payments", tags=["Payments"])
api_router.include_router(notification.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Admin Dashboard"])
api_router.include_router(dashboard.admin_router, prefix="/admin/dashboard", tags=["Admin Dashboard Stats"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports & Exports"])
api_router.include_router(media.router, prefix="/media", tags=["Media Uploads"])
api_router.include_router(coupon.router, prefix="/coupons", tags=["Coupons & Offers"])
api_router.include_router(review.router, prefix="/reviews", tags=["Reviews & Ratings"])
api_router.include_router(location.router, prefix="/location", tags=["GPS Tracking & Telemetry"])
