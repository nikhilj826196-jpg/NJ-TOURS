from typing import Any, List, Optional
from fastapi import APIRouter, Depends, status, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.database.connection import get_db
from app.services.payment_service import PaymentService
from app.schemas.payment import (
    CreateOrderRequest,
    VerifyPaymentRequest,
    RefundPaymentRequest,
    PaymentResponse,
    InvoiceResponse,
)
from app.schemas.response import APIResponse, success_response
from app.models.payment import PaymentState
from app.core.deps import get_current_user
from app.core.permissions import require_admin
from app.models.user import User

router = APIRouter()


@router.post(
    "/create-order",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[PaymentResponse],
    summary="Initiate Razorpay payment order",
    description="Creates a system payment transaction and generates a Razorpay Order ID."
)
async def create_order(
    req: CreateOrderRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint (Customer / Admin):
    Creates a new Razorpay payment order.
    """
    payment = await PaymentService.create_order(db=db, customer=current_user, req=req)
    payment.razorpay_key_id = settings.RAZORPAY_KEY_ID
    return success_response(data=payment, message="Razorpay payment order created successfully")


@router.post(
    "/verify",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[PaymentResponse],
    summary="Verify Razorpay payment signature",
    description="Verifies HMAC SHA256 signature, captures payment, and updates booking status to Paid & Confirmed."
)
async def verify_payment(
    verify_req: VerifyPaymentRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Public / Callback Verification Endpoint:
    Captures payment after HMAC verification.
    """
    payment = await PaymentService.verify_payment(db=db, req=verify_req)
    return success_response(data=payment, message="Payment verified and captured successfully")


@router.post(
    "/refund",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[PaymentResponse],
    summary="Process payment refund",
    description="Processes a full or partial refund for a captured payment. Requires Admin privileges."
)
async def refund_payment(
    refund_req: RefundPaymentRequest,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """
    Protected Endpoint (Admin Only):
    Processes refund transaction.
    """
    payment = await PaymentService.refund_payment(db=db, req=refund_req, current_user=admin_user)
    return success_response(data=payment, message="Refund processed successfully")


@router.get(
    "/history",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[PaymentResponse]],
    summary="List payment history",
    description="Lists payment transactions (Customers see own, Admins see all)."
)
async def list_payments(
    status_filter: Optional[PaymentState] = Query(None, alias="status", description="Filter by status"),
    skip: int = Query(0, ge=0, description="Offset skip count"),
    limit: int = Query(100, ge=1, le=100, description="Max limit"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint:
    Returns list of payment transactions.
    """
    payments = await PaymentService.list_payments(
        db=db,
        current_user=current_user,
        status=status_filter,
        skip=skip,
        limit=limit
    )
    return success_response(data=payments, message="Payment history fetched successfully")


@router.get(
    "/invoice/{payment_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[InvoiceResponse],
    summary="Get GST Tax Invoice details",
    description="Retrieves structured Tax Invoice details for a completed payment."
)
async def get_invoice(
    payment_id: str = Path(..., description="Payment UUID or Payment ID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint:
    Retrieves Tax Invoice details.
    """
    invoice = await PaymentService.get_invoice(db=db, payment_id=payment_id, current_user=current_user)
    return success_response(data=invoice, message="GST Invoice retrieved successfully")


@router.get(
    "/{payment_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[PaymentResponse],
    summary="Get payment details by ID",
    description="Retrieves detailed payment transaction record."
)
async def get_payment(
    payment_id: str = Path(..., description="Payment UUID or Payment ID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint:
    Returns single payment record.
    """
    payment = await PaymentService.get_payment_by_id(db=db, payment_id=payment_id, current_user=current_user)
    return success_response(data=payment, message="Payment details retrieved successfully")


@router.get(
    "/status/{booking_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[PaymentResponse],
    summary="Get payment details by Booking ID",
    description="Retrieves the payment transaction associated with a booking ID."
)
async def get_payment_by_booking_id(
    booking_id: str = Path(..., description="Booking UUID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Endpoint:
    Returns payment status and details by Booking ID.
    """
    payment = await PaymentService.get_payment_by_booking(db=db, booking_id=booking_id, current_user=current_user)
    return success_response(data=payment, message="Payment details for booking retrieved successfully")
