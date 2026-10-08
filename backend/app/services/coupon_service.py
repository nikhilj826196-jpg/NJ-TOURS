from datetime import date, datetime
from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.coupon import Coupon, CouponUsage, DiscountType
from app.models.user import User, UserRole
from app.models.booking import BookingStatus, PaymentStatus
from app.repositories.coupon_repository import CouponRepository
from app.repositories.booking_repository import BookingRepository
from app.schemas.coupon import (
    CouponCreate,
    CouponUpdate,
    ValidateCouponRequest,
    ValidateCouponResponse,
    ApplyCouponRequest,
    CouponResponse,
)
from app.schemas.booking import BookingResponse


class CouponService:
    """
    Service layer containing business logic for coupon creation, validation rules,
    discount calculation, user limit enforcement, and booking fare recalculations.
    """

    @staticmethod
    async def create_coupon(db: AsyncSession, coupon_create: CouponCreate) -> CouponResponse:
        """
        Creates a new promotional coupon after verifying code uniqueness.
        """
        existing = await CouponRepository.get_by_code(db, coupon_create.coupon_code)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Coupon code '{coupon_create.coupon_code}' already exists"
            )

        coupon = Coupon(
            coupon_code=coupon_create.coupon_code,
            title=coupon_create.title,
            description=coupon_create.description,
            discount_type=coupon_create.discount_type,
            discount_value=coupon_create.discount_value,
            minimum_booking_amount=coupon_create.minimum_booking_amount,
            maximum_discount_amount=coupon_create.maximum_discount_amount,
            usage_limit=coupon_create.usage_limit,
            per_user_limit=coupon_create.per_user_limit,
            start_date=coupon_create.start_date,
            end_date=coupon_create.end_date,
            is_active=coupon_create.is_active,
            applicable_for=coupon_create.applicable_for
        )

        saved_coupon = await CouponRepository.create_coupon(db, coupon)
        return CouponResponse.model_validate(saved_coupon)

    @staticmethod
    async def validate_coupon(
        db: AsyncSession,
        req: ValidateCouponRequest,
        current_user: User
    ) -> ValidateCouponResponse:
        """
        Validates coupon active status, expiration dates, minimum booking threshold,
        global usage limit, and per-user usage limit.
        """
        coupon = await CouponRepository.get_by_code(db, req.coupon_code)
        if not coupon:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Invalid coupon code '{req.coupon_code.upper()}'"
            )

        if not coupon.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Coupon code '{coupon.coupon_code}' is currently inactive"
            )

        today = date.today()
        if today < coupon.start_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Coupon code '{coupon.coupon_code}' is not valid until {coupon.start_date}"
            )

        if today > coupon.end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Coupon code '{coupon.coupon_code}' expired on {coupon.end_date}"
            )

        if req.booking_amount < coupon.minimum_booking_amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Booking amount (INR {req.booking_amount}) is below minimum threshold of INR {coupon.minimum_booking_amount}"
            )

        if coupon.used_count >= coupon.usage_limit:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Coupon code '{coupon.coupon_code}' global redemption limit has been reached"
            )

        user_usage = await CouponRepository.get_user_usage_count(db, coupon.id, current_user.id)
        if user_usage >= coupon.per_user_limit:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"You have already reached the maximum redemption limit ({coupon.per_user_limit}) for this coupon"
            )

        # Discount Calculation
        if coupon.discount_type == DiscountType.PERCENTAGE:
            calc_discount = (req.booking_amount * coupon.discount_value) / 100.0
            if coupon.maximum_discount_amount and calc_discount > coupon.maximum_discount_amount:
                calc_discount = coupon.maximum_discount_amount
        else:
            calc_discount = min(req.booking_amount, coupon.discount_value)

        calc_discount = round(calc_discount, 2)
        final_amount = round(max(0.0, req.booking_amount - calc_discount), 2)

        return ValidateCouponResponse(
            is_valid=True,
            coupon_code=coupon.coupon_code,
            discount_type=coupon.discount_type,
            discount_value=coupon.discount_value,
            calculated_discount=calc_discount,
            final_amount=final_amount,
            message="Coupon applied successfully"
        )

    @staticmethod
    async def apply_coupon(
        db: AsyncSession,
        req: ApplyCouponRequest,
        current_user: User
    ) -> BookingResponse:
        """
        Validates and applies coupon code to a booking, recalculates GST and grand total,
        and increments coupon usage counters.
        """
        booking = await BookingRepository.get_by_id(db, req.booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        if user_role == UserRole.CUSTOMER.value and booking.customer_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

        if booking.discount > 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A coupon has already been applied to this booking")

        # Validate Coupon
        subtotal = booking.base_fare + booking.driver_allowance + booking.toll_charges + booking.parking_charges + booking.extra_charges
        val_req = ValidateCouponRequest(coupon_code=req.coupon_code, booking_amount=subtotal)
        val_res = await CouponService.validate_coupon(db=db, req=val_req, current_user=current_user)

        coupon = await CouponRepository.get_by_code(db, req.coupon_code)
        if not coupon:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coupon not found")


        # Recalculate Fare with Discount & 5% GST
        discount_amt = val_res.calculated_discount
        discounted_subtotal = max(0.0, subtotal - discount_amt)
        gst = round(discounted_subtotal * 0.05, 2)
        grand_total = round(discounted_subtotal + gst, 2)

        # Update Booking
        updated_booking = await BookingRepository.update_booking(
            db,
            booking,
            {
                "discount": discount_amt,
                "gst": gst,
                "grand_total": grand_total
            }
        )

        # Increment Coupon used_count & record usage
        await CouponRepository.update_coupon(db, coupon, {"used_count": coupon.used_count + 1})
        usage = CouponUsage(coupon_id=coupon.id, user_id=current_user.id, booking_id=booking.id)
        await CouponRepository.record_usage(db, usage)

        return BookingResponse.model_validate(updated_booking)

    @staticmethod
    async def get_coupon_by_id(db: AsyncSession, coupon_id: str) -> CouponResponse:
        """Retrieves a single coupon by ID."""
        coupon = await CouponRepository.get_by_id(db, coupon_id)
        if not coupon:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coupon not found")
        return CouponResponse.model_validate(coupon)

    @staticmethod
    async def update_coupon(
        db: AsyncSession,
        coupon_id: str,
        coupon_update: CouponUpdate
    ) -> CouponResponse:
        """Updates an existing coupon parameters."""
        coupon = await CouponRepository.get_by_id(db, coupon_id)
        if not coupon:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coupon not found")

        update_dict = coupon_update.model_dump(exclude_unset=True)
        updated_coupon = await CouponRepository.update_coupon(db, coupon, update_dict)
        return CouponResponse.model_validate(updated_coupon)

    @staticmethod
    async def delete_coupon(db: AsyncSession, coupon_id: str) -> bool:
        """Deletes a coupon record."""
        coupon = await CouponRepository.get_by_id(db, coupon_id)
        if not coupon:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coupon not found")

        return await CouponRepository.delete_coupon(db, coupon)

    @staticmethod
    async def list_coupons(
        db: AsyncSession,
        is_active: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[CouponResponse]:
        """Lists coupons with optional active status filter."""
        coupons = await CouponRepository.list_coupons(db=db, is_active=is_active, skip=skip, limit=limit)
        return [CouponResponse.model_validate(c) for c in coupons]
