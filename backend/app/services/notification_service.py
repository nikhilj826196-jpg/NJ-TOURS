from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification, NotificationChannel, NotificationType, NotificationStatus
from app.models.user import User, UserRole
from app.repositories.notification_repository import NotificationRepository
from app.schemas.notification import NotificationCreate, SendTestNotificationRequest, NotificationResponse


class NotificationService:
    """
    Service layer for multi-channel messaging (Email, SMS, WhatsApp) and template rendering.
    """

    @staticmethod
    def render_template(notif_type: NotificationType, context: Dict[str, Any]) -> Dict[str, str]:
        """
        Renders template subject and body text depending on notification event type.
        """
        user_name = context.get("user_name", "Valued Customer")
        booking_no = context.get("booking_number", "")
        amount = context.get("amount", "0.0")

        if notif_type == NotificationType.WELCOME:
            return {
                "subject": "Welcome to NJ Tours (National Journey)!",
                "title": "Account Created Successfully",
                "message": f"Hello {user_name},\nWelcome to NJ Tours! Your account is active. Explore our vehicles and tour packages today."
            }

        elif notif_type == NotificationType.BOOKING_CREATED:
            return {
                "subject": f"Booking Received - {booking_no}",
                "title": "Reservation Created",
                "message": f"Dear {user_name},\nWe have received your trip booking ({booking_no}). Please complete payment to confirm your vehicle."
            }

        elif notif_type == NotificationType.BOOKING_CONFIRMED:
            return {
                "subject": f"Booking Confirmed! - {booking_no}",
                "title": "Booking Confirmed",
                "message": f"Great news {user_name}!\nYour booking ({booking_no}) has been confirmed. Have a safe journey with NJ Tours."
            }

        elif notif_type == NotificationType.PAYMENT_SUCCESS:
            return {
                "subject": f"Payment Received - INR {amount}",
                "title": "Payment Successful",
                "message": f"Dear {user_name},\nPayment of INR {amount} for booking {booking_no} was successful. Invoice has been generated."
            }

        elif notif_type == NotificationType.REFUND_PROCESSED:
            return {
                "subject": f"Refund Processed - INR {amount}",
                "title": "Refund Complete",
                "message": f"Dear {user_name},\nA refund of INR {amount} for booking {booking_no} has been processed back to your original payment method."
            }

        else:
            return {
                "subject": f"NJ Tours Notification - {notif_type.value}",
                "title": notif_type.value,
                "message": f"Hello {user_name},\nThis is a notification regarding your {notif_type.value} event."
            }

    @staticmethod
    async def dispatch_channel_message(
        channel: NotificationChannel,
        recipient: str,
        subject: Optional[str],
        message: str
    ) -> Dict[str, Any]:
        """
        Dispatches message over specified channel (SMTP Email, Twilio SMS, WhatsApp Cloud API).
        Simulates successful provider responses in development environment.
        """
        if channel == NotificationChannel.EMAIL:
            # SMTP Email Dispatch Handler
            return {"provider": "SMTP", "status": "200 OK", "recipient": recipient, "delivered": True}
        elif channel == NotificationChannel.SMS:
            # Twilio SMS Handler
            return {"provider": "Twilio SMS", "sid": "SM123456789", "recipient": recipient, "delivered": True}
        elif channel == NotificationChannel.WHATSAPP:
            # WhatsApp Cloud API Handler
            return {"provider": "Meta WhatsApp API", "msg_id": "wamid.123456", "recipient": recipient, "delivered": True}
        else:

            return {"provider": "Push Gateway", "status": "sent"}

    @staticmethod
    async def create_and_send_notification(
        db: AsyncSession,
        notif_in: NotificationCreate
    ) -> NotificationResponse:
        """
        Queues and dispatches a notification over chosen channel.
        """
        notification = Notification(
            user_id=notif_in.user_id,
            booking_id=notif_in.booking_id,
            payment_id=notif_in.payment_id,
            channel=notif_in.channel,
            type=notif_in.type,
            subject=notif_in.subject,
            title=notif_in.title,
            message=notif_in.message,
            template_name=notif_in.template_name,
            status=NotificationStatus.PENDING,
            retry_count=0
        )

        saved = await NotificationRepository.create_notification(db, notification)

        # Dispatch message
        provider_resp = await NotificationService.dispatch_channel_message(
            channel=notif_in.channel,
            recipient="user@example.com",
            subject=notif_in.subject,
            message=notif_in.message
        )

        updated = await NotificationRepository.update_notification(
            db,
            saved,
            {
                "status": NotificationStatus.SENT,
                "sent_at": datetime.now(timezone.utc),
                "provider_response": str(provider_resp)
            }
        )

        return NotificationResponse.model_validate(updated)

    @staticmethod
    async def send_test_notification(
        db: AsyncSession,
        req: SendTestNotificationRequest,
        current_user: User
    ) -> NotificationResponse:
        """
        Generates and dispatches a test notification message.
        """
        notif_in = NotificationCreate(
            user_id=current_user.id,
            channel=req.channel,
            type=req.type,
            subject=f"[TEST] {req.title}",
            title=req.title,
            message=req.message
        )

        return await NotificationService.create_and_send_notification(db=db, notif_in=notif_in)

    @staticmethod
    async def get_notification_by_id(
        db: AsyncSession,
        notification_id: str,
        current_user: User
    ) -> NotificationResponse:
        """Retrieves single notification log with ownership check."""
        notif = await NotificationRepository.get_by_id(db, notification_id)
        if not notif:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification log not found")

        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        if user_role == UserRole.CUSTOMER.value and notif.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

        return NotificationResponse.model_validate(notif)

    @staticmethod
    async def mark_as_read(
        db: AsyncSession,
        notification_id: str,
        current_user: User
    ) -> NotificationResponse:
        """Marks a notification log as read."""
        notif = await NotificationRepository.get_by_id(db, notification_id)
        if not notif:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification log not found")

        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        if user_role == UserRole.CUSTOMER.value and notif.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

        updated = await NotificationRepository.update_notification(db, notif, {"is_read": True})
        return NotificationResponse.model_validate(updated)

    @staticmethod
    async def list_notifications(
        db: AsyncSession,
        current_user: User,
        channel: Optional[NotificationChannel] = None,
        status: Optional[NotificationStatus] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[NotificationResponse]:
        """Lists notification logs with RBAC restriction."""
        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        user_id = current_user.id if user_role == UserRole.CUSTOMER.value else None

        notifs = await NotificationRepository.list_notifications(
            db=db,
            user_id=user_id,
            channel=channel,
            status=status,
            skip=skip,
            limit=limit
        )
        return [NotificationResponse.model_validate(n) for n in notifs]
