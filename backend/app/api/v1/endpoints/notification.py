from typing import Any, List, Optional
from fastapi import APIRouter, Depends, status, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.services.notification_service import NotificationService
from app.schemas.notification import (
    NotificationCreate,
    SendTestNotificationRequest,
    NotificationResponse,
)
from app.schemas.response import APIResponse, success_response
from app.models.notification import NotificationChannel, NotificationStatus
from app.core.deps import get_current_user
from app.core.permissions import require_admin
from app.models.user import User

router = APIRouter()


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[NotificationResponse]],
    summary="List notifications",
    description="Retrieves a paginated list of notification logs (Customers see own, Admins see all)."
)
async def list_notifications(
    channel: Optional[NotificationChannel] = Query(None, description="Filter by channel (Email, SMS, WhatsApp)"),
    status_filter: Optional[NotificationStatus] = Query(None, alias="status", description="Filter by status"),
    skip: int = Query(0, ge=0, description="Offset skip count"),
    limit: int = Query(100, ge=1, le=100, description="Max limit"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint:
    Returns list of notification logs.
    """
    notifications = await NotificationService.list_notifications(
        db=db,
        current_user=current_user,
        channel=channel,
        status=status_filter,
        skip=skip,
        limit=limit
    )
    return success_response(data=notifications, message="Notifications fetched successfully")


@router.get(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[NotificationResponse],
    summary="Get notification details by ID",
    description="Retrieves single notification log."
)
async def get_notification(
    id: str = Path(..., description="Notification UUID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint:
    Returns notification details with ownership check.
    """
    notification = await NotificationService.get_notification_by_id(
        db=db, notification_id=id, current_user=current_user
    )
    return success_response(data=notification, message="Notification details retrieved successfully")


@router.put(
    "/{id}/read",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[NotificationResponse],
    summary="Mark notification as read",
    description="Updates is_read flag to True for the specified notification."
)
async def mark_as_read(
    id: str = Path(..., description="Notification UUID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint:
    Marks notification as read.
    """
    notification = await NotificationService.mark_as_read(
        db=db, notification_id=id, current_user=current_user
    )
    return success_response(data=notification, message="Notification marked as read successfully")


@router.post(
    "/send-test",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[NotificationResponse],
    summary="Send a test notification",
    description="Sends a test notification over Email, SMS, or WhatsApp. Requires Admin privileges."
)
async def send_test_notification(
    req: SendTestNotificationRequest,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """
    Protected Endpoint (Admin Only):
    Dispatches a test notification message.
    """
    notification = await NotificationService.send_test_notification(
        db=db, req=req, current_user=admin_user
    )
    return success_response(data=notification, message="Test notification sent successfully")
