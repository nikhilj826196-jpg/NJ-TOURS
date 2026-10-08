from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.models.notification import NotificationChannel, NotificationType, NotificationStatus
from app.schemas.user import UserResponse


class NotificationCreate(BaseModel):
    """Schema for queueing a new notification dispatch."""
    user_id: str = Field(..., description="Target user UUID")
    booking_id: Optional[str] = Field(default=None, description="Associated Booking UUID")
    payment_id: Optional[str] = Field(default=None, description="Associated Payment UUID")
    channel: NotificationChannel = Field(default=NotificationChannel.EMAIL, description="Delivery channel")
    type: NotificationType = Field(..., description="Notification type")
    subject: Optional[str] = Field(default=None, description="Email subject line")
    title: str = Field(..., min_length=3, max_length=150, description="Short title")
    message: str = Field(..., min_length=5, description="Full notification message text")
    template_name: Optional[str] = Field(default=None, description="HTML or SMS template identifier")



class SendTestNotificationRequest(BaseModel):
    """Schema for testing email/SMS/WhatsApp dispatcher."""
    recipient: str = Field(..., description="Recipient email address or phone number")
    channel: NotificationChannel = Field(default=NotificationChannel.EMAIL)
    type: NotificationType = Field(default=NotificationType.WELCOME)
    title: str = Field(default="Test Notification Title")
    message: str = Field(default="This is a test notification from NJ Tours platform.")


class NotificationResponse(BaseModel):
    """Schema for notification response payload."""
    id: str
    user_id: str
    booking_id: Optional[str] = None
    payment_id: Optional[str] = None
    channel: NotificationChannel
    type: NotificationType
    subject: Optional[str] = None
    title: str
    message: str
    template_name: Optional[str] = None
    status: NotificationStatus
    provider_response: Optional[str] = None
    retry_count: int
    is_read: bool
    created_at: datetime
    sent_at: Optional[datetime] = None

    user: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)
