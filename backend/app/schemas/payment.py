from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.models.payment import PaymentState, PaymentMethod
from app.schemas.user import UserResponse
from app.schemas.booking import BookingResponse


class CreateOrderRequest(BaseModel):
    """Schema for initiating a Razorpay Payment Order."""
    booking_id: str = Field(..., description="Booking UUID to pay for")
    amount: float = Field(..., gt=0, description="Amount in INR")
    payment_method: PaymentMethod = Field(default=PaymentMethod.UPI, description="Preferred payment method")


class VerifyPaymentRequest(BaseModel):
    """Schema for verifying Razorpay payment signature."""
    razorpay_order_id: str = Field(..., description="Razorpay order ID")
    razorpay_payment_id: Optional[str] = Field(None, description="Razorpay payment ID")
    razorpay_signature: Optional[str] = Field(None, description="Razorpay HMAC SHA256 signature")
    payment_method: Optional[PaymentMethod] = Field(None, description="Payment method used")


class RefundPaymentRequest(BaseModel):
    """Schema for processing a full or partial refund."""
    payment_id: str = Field(..., description="System Payment UUID")
    amount: Optional[float] = Field(None, gt=0, description="Amount to refund (None for full refund)")
    reason: Optional[str] = Field(None, max_length=255, description="Reason for refund")


class PaymentResponse(BaseModel):
    """Schema for payment detail output payload."""
    id: str
    payment_id: str
    razorpay_order_id: str
    razorpay_payment_id: Optional[str] = None
    razorpay_key_id: Optional[str] = None
    booking_id: Optional[str] = None
    customer_id: str

    amount: float
    currency: str
    payment_method: PaymentMethod
    status: PaymentState

    refund_amount: float
    transaction_fee: float
    gst: float

    invoice_number: str
    receipt_number: str
    failure_reason: Optional[str] = None

    created_at: datetime
    updated_at: datetime

    customer: Optional[UserResponse] = None
    booking: Optional[BookingResponse] = None

    model_config = ConfigDict(from_attributes=True)


class InvoiceResponse(BaseModel):
    """Schema for tax invoice output details."""
    invoice_number: str
    receipt_number: str
    booking_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    amount: float
    gst: float
    grand_total: float
    payment_method: PaymentMethod
    payment_status: PaymentState
    invoice_date: datetime
    pdf_url: str
