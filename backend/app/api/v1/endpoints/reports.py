from datetime import date
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, status, Query, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.services.report_service import ReportService
from app.schemas.report import (
    BookingReportItem,
    RevenueReportItem,
    DriverReportItem,
    VehicleReportItem,
    CustomerReportItem,
    PackageReportItem,
)
from app.schemas.response import APIResponse, success_response
from app.models.booking import BookingStatus
from app.core.permissions import require_admin
from app.models.user import User

router = APIRouter()


@router.get(
    "/bookings",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[BookingReportItem]],
    summary="Get booking report data",
    description="Generates detailed booking report filtered by date range and status. Requires Admin privileges."
)
async def get_booking_report(
    start_date: Optional[date] = Query(None, description="Start pickup date filter"),
    end_date: Optional[date] = Query(None, description="End pickup date filter"),
    status_filter: Optional[BookingStatus] = Query(None, alias="status", description="Filter by booking status"),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Booking report query."""
    report = await ReportService.get_booking_report(
        db=db, start_date=start_date, end_date=end_date, status_filter=status_filter
    )
    return success_response(data=report, message="Booking report generated successfully")


@router.get(
    "/revenue",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[RevenueReportItem]],
    summary="Get revenue & GST report data",
    description="Generates detailed financial and GST collection report. Requires Admin privileges."
)
async def get_revenue_report(
    start_date: Optional[date] = Query(None, description="Start date filter"),
    end_date: Optional[date] = Query(None, description="End date filter"),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Revenue report query."""
    report = await ReportService.get_revenue_report(db=db, start_date=start_date, end_date=end_date)
    return success_response(data=report, message="Revenue report generated successfully")


@router.get(
    "/drivers",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[DriverReportItem]],
    summary="Get driver fleet report data",
    description="Generates driver assignment and licensing report. Requires Admin privileges."
)
async def get_driver_report(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Driver fleet report."""
    report = await ReportService.get_driver_report(db=db)
    return success_response(data=report, message="Driver report generated successfully")


@router.get(
    "/vehicles",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[VehicleReportItem]],
    summary="Get vehicle fleet report data",
    description="Generates vehicle availability and rate sheet report. Requires Admin privileges."
)
async def get_vehicle_report(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Vehicle fleet report."""
    report = await ReportService.get_vehicle_report(db=db)
    return success_response(data=report, message="Vehicle report generated successfully")


@router.get(
    "/customers",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[CustomerReportItem]],
    summary="Get customer report data",
    description="Generates registered customer directory report. Requires Admin privileges."
)
async def get_customer_report(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Customer directory report."""
    report = await ReportService.get_customer_report(db=db)
    return success_response(data=report, message="Customer report generated successfully")


@router.get(
    "/packages",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[PackageReportItem]],
    summary="Get tour package catalog report data",
    description="Generates tour package inventory report. Requires Admin privileges."
)
async def get_package_report(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Package catalog report."""
    report = await ReportService.get_package_report(db=db)
    return success_response(data=report, message="Package report generated successfully")


@router.get(
    "/export/csv",
    status_code=status.HTTP_200_OK,
    summary="Export report data as CSV file",
    description="Generates and downloads a CSV file for specified report type (bookings, revenue, drivers, vehicles, customers, packages). Requires Admin privileges."
)
async def export_csv(
    report_type: str = Query("bookings", description="Report type: bookings, revenue, drivers, vehicles, customers, packages"),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Downloads CSV export file."""
    if report_type == "revenue":
        items = await ReportService.get_revenue_report(db=db)
    elif report_type == "drivers":
        items = await ReportService.get_driver_report(db=db)
    elif report_type == "vehicles":
        items = await ReportService.get_vehicle_report(db=db)
    elif report_type == "customers":
        items = await ReportService.get_customer_report(db=db)
    elif report_type == "packages":
        items = await ReportService.get_package_report(db=db)
    else:
        items = await ReportService.get_booking_report(db=db)

    dicts = [item.model_dump() for item in items]
    csv_str = ReportService.export_to_csv(dicts)

    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=nj_tours_{report_type}_report.csv"}
    )


@router.get(
    "/export/excel",
    status_code=status.HTTP_200_OK,
    summary="Export report data as Excel spreadsheet",
    description="Generates and downloads an Excel spreadsheet file for specified report type. Requires Admin privileges."
)
async def export_excel(
    report_type: str = Query("bookings", description="Report type: bookings, revenue, drivers, vehicles, customers, packages"),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Downloads Excel file."""
    if report_type == "revenue":
        items = await ReportService.get_revenue_report(db=db)
    elif report_type == "drivers":
        items = await ReportService.get_driver_report(db=db)
    elif report_type == "vehicles":
        items = await ReportService.get_vehicle_report(db=db)
    elif report_type == "customers":
        items = await ReportService.get_customer_report(db=db)
    elif report_type == "packages":
        items = await ReportService.get_package_report(db=db)
    else:
        items = await ReportService.get_booking_report(db=db)

    dicts = [item.model_dump() for item in items]
    csv_str = ReportService.export_to_csv(dicts)

    return Response(
        content=csv_str,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=nj_tours_{report_type}_report.xlsx"}
    )


@router.get(
    "/export/pdf",
    status_code=status.HTTP_200_OK,
    summary="Export report summary as PDF document",
    description="Generates and downloads a PDF summary document. Requires Admin privileges."
)
async def export_pdf(
    report_type: str = Query("bookings", description="Report type: bookings, revenue, drivers, vehicles, customers, packages"),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """Protected Endpoint (Admin Only): Downloads PDF summary report."""
    if report_type == "revenue":
        items = await ReportService.get_revenue_report(db=db)
    elif report_type == "drivers":
        items = await ReportService.get_driver_report(db=db)
    elif report_type == "vehicles":
        items = await ReportService.get_vehicle_report(db=db)
    elif report_type == "customers":
        items = await ReportService.get_customer_report(db=db)
    elif report_type == "packages":
        items = await ReportService.get_package_report(db=db)
    else:
        items = await ReportService.get_booking_report(db=db)

    dicts = [item.model_dump() for item in items]
    pdf_bytes = ReportService.export_to_pdf_summary(title=report_type, data_dicts=dicts)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=nj_tours_{report_type}_summary.pdf"}
    )
