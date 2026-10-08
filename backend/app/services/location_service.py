from datetime import datetime, timezone
from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.location import LocationLog
from app.models.user import User, UserRole
from app.models.booking import BookingStatus
from app.repositories.location_repository import LocationRepository
from app.repositories.booking_repository import BookingRepository
from app.repositories.driver_repository import DriverRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.location import (
    LocationUpdateInput,
    LocationResponse,
    CurrentLocationResponse,
    RouteHistoryResponse,
)
from app.websocket.location_socket import manager


class LocationService:
    """
    Service layer containing business rules for validating assigned driver GPS updates,
    active trip coordinates validation, and real-time WebSocket broadcast integration.
    """

    @staticmethod
    async def update_location(
        db: AsyncSession,
        driver_user: User,
        data: LocationUpdateInput
    ) -> LocationResponse:
        """
        Validates driver permissions, logs GPS telemetry, and broadcasts updates over WebSockets.
        """
        # Validate driver profile
        driver_profile = await DriverRepository.get_by_user_id(db, driver_user.id)
        if not driver_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User does not have an active driver profile"
            )

        if not driver_profile.assigned_vehicle_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Driver must have an assigned vehicle to update coordinates"
            )

        vehicle_id = driver_profile.assigned_vehicle_id

        # Validate active trip if booking_id is provided
        if data.booking_id:
            booking = await BookingRepository.get_by_id(db, data.booking_id)
            if not booking:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

            # Check assigned driver
            if booking.driver_id != driver_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Forbidden: You are not the assigned driver for this booking"
                )

            # Check active trip status (Assigned, Confirmed, or Started)
            booking_status = booking.status.value if hasattr(booking.status, 'value') else str(booking.status)
            if booking_status in [BookingStatus.COMPLETED.value, BookingStatus.CANCELLED.value]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot update location for a completed or cancelled booking. Status: {booking_status}"
                )

        location = LocationLog(
            driver_id=driver_user.id,
            vehicle_id=vehicle_id,
            booking_id=data.booking_id,
            latitude=data.latitude,
            longitude=data.longitude,
            speed=data.speed,
            heading=data.heading,
            accuracy=data.accuracy,
            altitude=data.altitude,
            battery_level=data.battery_level,
            gps_timestamp=data.gps_timestamp
        )

        saved = await LocationRepository.create_location(db, location)

        # Broadcast payload
        payload = {
            "driver_id": saved.driver_id,
            "vehicle_id": saved.vehicle_id,
            "booking_id": saved.booking_id,
            "latitude": saved.latitude,
            "longitude": saved.longitude,
            "speed": saved.speed,
            "heading": saved.heading,
            "gps_timestamp": saved.gps_timestamp.isoformat()
        }

        # Broadcast update in background
        if saved.booking_id:
            await manager.broadcast_to_booking(saved.booking_id, payload)
        await manager.broadcast_to_admins(payload)

        return LocationResponse.model_validate(saved)

    @staticmethod
    async def get_current_location(
        db: AsyncSession,
        booking_id: str,
        current_user: User
    ) -> CurrentLocationResponse:
        """
        Retrieves live telemetry and metrics for an active booking.
        """
        booking = await BookingRepository.get_by_id(db, booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

        # Ownership validation
        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        if user_role == UserRole.CUSTOMER.value and booking.customer_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

        current_log = await LocationRepository.get_current_by_booking_id(db, booking_id)
        if not current_log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No GPS telemetry logs found for this booking"
            )

        # Simulated distance and ETA calculations based on booking target distance
        travelled = min(booking.distance_km, 15.0)  # Simulated progression
        remaining = max(0.0, booking.distance_km - travelled)
        eta = round(remaining * 2.0, 1)  # Assuming avg speed 30km/h

        return CurrentLocationResponse(
            booking_id=booking_id,
            latitude=current_log.latitude,
            longitude=current_log.longitude,
            speed=current_log.speed,
            heading=current_log.heading,
            gps_timestamp=current_log.gps_timestamp,
            eta_minutes=eta,
            remaining_distance_km=remaining,
            travelled_distance_km=travelled,
            average_speed_kmh=30.0
        )

    @staticmethod
    async def get_route_history(
        db: AsyncSession,
        booking_id: str,
        current_user: User
    ) -> RouteHistoryResponse:
        """
        Retrieves route breadcrumbs list for map playbacks.
        """
        booking = await BookingRepository.get_by_id(db, booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        if user_role == UserRole.CUSTOMER.value and booking.customer_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

        logs = await LocationRepository.get_history_by_booking_id(db, booking_id)
        route_list = [LocationResponse.model_validate(log) for log in logs]

        return RouteHistoryResponse(booking_id=booking_id, route=route_list)

    @staticmethod
    async def get_current_by_driver(db: AsyncSession, driver_id: str) -> LocationResponse:
        """Fetches current location by Driver user ID (Admin only)."""
        log = await LocationRepository.get_current_by_driver_id(db, driver_id)
        if not log:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No location log found for driver")
        return LocationResponse.model_validate(log)

    @staticmethod
    async def get_current_by_vehicle(db: AsyncSession, vehicle_id: str) -> LocationResponse:
        """Fetches current location by Vehicle ID (Admin only)."""
        log = await LocationRepository.get_current_by_vehicle_id(db, vehicle_id)
        if not log:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No location log found for vehicle")
        return LocationResponse.model_validate(log)
