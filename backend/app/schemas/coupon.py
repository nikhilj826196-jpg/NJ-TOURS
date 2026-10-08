from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator
from app.models.coupon import DiscountType


class CouponCreate(BaseModel):
    """Schema for creating a new promotional coupon."""
    coupon_code: str = Field(..., min_length=3, max_length=50, description="Uppercase unique code", examples=["WELCOME100"])
    title: str = Field(..., min_length=3, max_length=150, description="Promotional title", examples=["New User Discount"])
    description: Optional[str] = Field(None, description="Detailed terms and conditions")
    discount_type: DiscountType = Field(default=DiscountType.PERCENTAGE, description="Discount mode")
    discount_value: float = Field(..., gt=0, description="Percentage (e.g. 10.0) or flat value (e.g. 500.0)", examples=[15.0])
    minimum_booking_amount: float = Field(default=0.0, ge=0, description="Minimum booking amount required", examples=[1000.0])
    maximum_discount_amount: Optional[float] = Field(None, gt=0, description="Max discount cap in INR", examples=[500.0])
    usage_limit: int = Field(default=100, gt=0, description="Total global redemptions allowed")
    per_user_limit: int = Field(default=1, gt=0, description="Redemptions allowed per customer")
    start_date: date = Field(..., description="Validity start date")
    end_date: date = Field(..., description="Validity end date")
    is_active: bool = Field(default=True, description="Active status flag")
    applicable_for: str = Field(default="ALL", description="Applicable scope (ALL, VEHICLE, PACKAGE)")

    @field_validator("coupon_code")
    @classmethod
    def uppercase_code(cls, v: str) -> str:
        return v.strip().upper()

    @field_validator("end_date")
    @classmethod
    def validate_end_date(cls, v: date, info) -> date:
        if "start_date" in info.data and v < info.data["start_date"]:
            raise ValueError("End date cannot be prior to start date")
        return v


class CouponUpdate(BaseModel):
    """Schema for updating coupon parameters."""
    title: Optional[str] = Field(None, min_length=3, max_length=150)
    description: Optional[str] = None
    discount_type: Optional[DiscountType] = None
    discount_value: Optional[float] = Field(None, gt=0)
    minimum_booking_amount: Optional[float] = Field(None, ge=0)
    maximum_discount_amount: Optional[float] = Field(None, gt=0)
    usage_limit: Optional[int] = Field(None, gt=0)
    per_user_limit: Optional[int] = Field(None, gt=0)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: Optional[bool] = None
    applicable_for: Optional[str] = None


class ValidateCouponRequest(BaseModel):
    """Schema for validating coupon code applicability."""
    coupon_code: str = Field(..., description="Coupon code to validate")
    booking_amount: float = Field(..., gt=0, description="Current total fare before discount")


class ValidateCouponResponse(BaseModel):
    """Schema for coupon validation calculation result."""
    is_valid: bool
    coupon_code: str
    discount_type: DiscountType
    discount_value: float
    calculated_discount: float
    final_amount: float
    message: str


class ApplyCouponRequest(BaseModel):
    """Schema for applying coupon code to a booking reservation."""
    booking_id: str = Field(..., description="Booking UUID to apply coupon to")
    coupon_code: str = Field(..., description="Coupon code to redeem")


class CouponResponse(BaseModel):
    """Schema for coupon detail output payload."""
    id: str
    coupon_code: str
    title: str
    description: Optional[str] = None
    discount_type: DiscountType
    discount_value: float
    minimum_booking_amount: float
    maximum_discount_amount: Optional[float] = None
    usage_limit: int
    used_count: int
    per_user_limit: int
    start_date: date
    end_date: date
    is_active: bool
    applicable_for: str

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
