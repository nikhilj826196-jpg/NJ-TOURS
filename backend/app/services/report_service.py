import csv
import io
from datetime import date, datetime
from typing import Optional, List, Dict, Any
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.models.payment import Payment, PaymentState
from app.models.driver import DriverProfile
from app.models.vehicle import Vehicle
from app.models.user import User, UserRole
from app.models.tour_package import TourPackage
from app.schemas.report import (
    BookingReportItem,
    RevenueReportItem,
    DriverReportItem,
    VehicleReportItem,
    CustomerReportItem,
    PackageReportItem,
)


class ReportService:
    """
    Service layer for generating detailed operational reports and formatting exports in CSV, Excel, and PDF formats.
    """

    @staticmethod
    async def get_booking_report(
        db: AsyncSession,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        status_filter: Optional[BookingStatus] = None
    ) -> List[BookingReportItem]:
        """Queries bookings table with optional date range and status filters."""
        stmt = select(Booking)
        if start_date:
            stmt = stmt.where(Booking.pickup_date >= start_date)
        if end_date:
            stmt = stmt.where(Booking.pickup_date <= end_date)
        if status_filter:
            stmt = stmt.where(Booking.status == status_filter)

        stmt = stmt.order_by(Booking.created_at.desc())
        result = await db.execute(stmt)
        bookings = result.scalars().all()

        report_items = []
        for b in bookings:
            customer_name = b.customer.full_name if b.customer else "Unknown"
            customer_phone = b.customer.phone if b.customer else "N/A"
            report_items.append(
                BookingReportItem(
                    booking_number=b.booking_number,
                    customer_name=customer_name,
                    customer_phone=customer_phone,
                    pickup_location=b.pickup_location,
                    drop_location=b.drop_location,
                    pickup_date=b.pickup_date,
                    trip_type=b.trip_type.value if hasattr(b.trip_type, 'value') else str(b.trip_type),
                    status=b.status.value if hasattr(b.status, 'value') else str(b.status),
                    payment_status=b.payment_status.value if hasattr(b.payment_status, 'value') else str(b.payment_status),
                    grand_total=b.grand_total,
                    created_at=b.created_at
                )
            )
        return report_items

    @staticmethod
    async def get_revenue_report(
        db: AsyncSession,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> List[RevenueReportItem]:
        """Queries payments table for revenue and GST summary rows."""
        stmt = select(Payment).where(Payment.status == PaymentState.CAPTURED)
        if start_date:
            stmt = stmt.where(Payment.created_at >= start_date)
        if end_date:
            stmt = stmt.where(Payment.created_at <= end_date)

        stmt = stmt.order_by(Payment.created_at.desc())
        result = await db.execute(stmt)
        payments = result.scalars().all()

        items = []
        for p in payments:
            c_name = p.customer.full_name if p.customer else "Customer"
            b_no = p.booking.booking_number if p.booking else "N/A"
            items.append(
                RevenueReportItem(
                    payment_id=p.payment_id,
                    invoice_number=p.invoice_number,
                    booking_number=b_no,
                    customer_name=c_name,
                    amount=p.amount,
                    gst=p.gst,
                    total=round(p.amount + p.gst, 2),
                    payment_method=p.payment_method.value if hasattr(p.payment_method, 'value') else str(p.payment_method),
                    status=p.status.value if hasattr(p.status, 'value') else str(p.status),
                    date=p.created_at
                )
            )
        return items

    @staticmethod
    async def get_driver_report(db: AsyncSession) -> List[DriverReportItem]:
        """Queries driver profiles and vehicle assignments."""
        stmt = select(DriverProfile).order_by(DriverProfile.created_at.desc())
        result = await db.execute(stmt)
        drivers = result.scalars().all()

        items = []
        for d in drivers:
            name = d.user.full_name if d.user else "Driver"
            phone = d.user.phone if d.user else "N/A"
            veh = d.assigned_vehicle.vehicle_number if d.assigned_vehicle else "Unassigned"
            items.append(
                DriverReportItem(
                    license_number=d.license_number,
                    driver_name=name,
                    phone=phone,
                    experience_years=d.experience_years,
                    status=d.status.value if hasattr(d.status, 'value') else str(d.status),
                    assigned_vehicle=veh,
                    created_at=d.created_at
                )
            )
        return items

    @staticmethod
    async def get_vehicle_report(db: AsyncSession) -> List[VehicleReportItem]:
        """Queries vehicle fleet repository."""
        stmt = select(Vehicle).order_by(Vehicle.created_at.desc())
        result = await db.execute(stmt)
        vehicles = result.scalars().all()
        return [VehicleReportItem.model_validate(v) for v in vehicles]

    @staticmethod
    async def get_customer_report(db: AsyncSession) -> List[CustomerReportItem]:
        """Queries registered customers."""
        stmt = select(User).where(User.role == UserRole.CUSTOMER).order_by(User.created_at.desc())
        result = await db.execute(stmt)
        users = result.scalars().all()
        return [
            CustomerReportItem(
                full_name=u.full_name,
                email=u.email,
                phone=u.phone,
                role=u.role.value if hasattr(u.role, 'value') else str(u.role),
                is_active=u.is_active,
                created_at=u.created_at
            ) for u in users
        ]

    @staticmethod
    async def get_package_report(db: AsyncSession) -> List[PackageReportItem]:
        """Queries tour package catalog."""
        stmt = select(TourPackage).order_by(TourPackage.created_at.desc())
        result = await db.execute(stmt)
        packages = result.scalars().all()
        return [PackageReportItem.model_validate(p) for p in packages]

    @staticmethod
    def export_to_csv(data_dicts: List[Dict[str, Any]]) -> str:
        """Converts list of dictionary rows into a standard CSV formatted string."""
        if not data_dicts:
            return "No data available\n"

        output = io.StringIO()
        fieldnames = list(data_dicts[0].keys())
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        for row in data_dicts:
            # Convert dates & datetimes to ISO strings
            clean_row = {}
            for k, v in row.items():
                if isinstance(v, (datetime, date)):
                    clean_row[k] = v.isoformat()
                else:
                    clean_row[k] = v
            writer.writerow(clean_row)

        return output.getvalue()

    @staticmethod
    def export_to_pdf_summary(title: str, data_dicts: List[Dict[str, Any]]) -> bytes:
        """Generates a structured PDF-formatted byte stream report summary."""
        content = f"====================================================\n"
        content += f"           NJ TOURS (NATIONAL JOURNEY)             \n"
        content += f"                {title.upper()} SUMMARY REPORT    \n"
        content += f"====================================================\n"
        content += f"Generated On: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        content += f"Total Records: {len(data_dicts)}\n"
        content += f"----------------------------------------------------\n\n"

        if data_dicts:
            headers = list(data_dicts[0].keys())
            content += " | ".join(headers) + "\n"
            content += "-" * 70 + "\n"
            for row in data_dicts:
                vals = [str(row.get(h, '')) for h in headers]
                content += " | ".join(vals) + "\n"

        content += f"\n====================================================\n"
        content += f"End of Report\n"
        return content.encode("utf-8")
