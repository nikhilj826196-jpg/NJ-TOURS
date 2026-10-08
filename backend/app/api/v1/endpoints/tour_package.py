from typing import Any, List, Optional
from fastapi import APIRouter, Depends, status, Query, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession


from app.database.connection import get_db
from app.services.tour_package_service import TourPackageService
from app.schemas.tour_package import TourPackageCreate, TourPackageUpdate, TourPackageResponse
from app.schemas.response import APIResponse, success_response
from app.core.permissions import require_admin
from app.models.user import User

router = APIRouter()


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[TourPackageResponse]],
    summary="List and filter tour packages",
    description="Fetches a list of active tour packages. Supports filtering by state, category, duration, price range, and rating."
)
async def list_packages(
    state: Optional[str] = Query(None, description="Filter by state (e.g. Maharashtra, Uttarakhand)"),
    category: Optional[str] = Query(None, description="Filter by category (e.g. Hill Station, Pilgrimage)"),
    duration: Optional[str] = Query(None, description="Filter by duration string"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price bound"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price bound"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum star rating"),
    is_featured: Optional[bool] = Query(None, description="Filter featured packages"),
    search: Optional[str] = Query(None, description="Search query matching title, destination, or state"),
    skip: int = Query(0, ge=0, description="Pagination skip offset"),
    limit: int = Query(100, ge=1, le=100, description="Pagination max limit"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Public Endpoint:
    Returns list of active tour packages.
    """
    packages = await TourPackageService.list_packages(
        db=db,
        state=state,
        category=category,
        duration=duration,
        min_price=min_price,
        max_price=max_price,
        min_rating=min_rating,
        is_featured=is_featured,
        is_active=True,
        search=search,
        skip=skip,
        limit=limit
    )
    return success_response(data=packages, message="Tour packages retrieved successfully")


@router.get(
    "/featured",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[List[TourPackageResponse]],
    summary="Get featured tour packages",
    description="Retrieves top curated featured holiday packages for homepage promotion."
)
async def get_featured_packages(
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Public Endpoint:
    Returns featured tour packages.
    """
    packages = await TourPackageService.list_packages(db=db, is_featured=True, is_active=True)
    return success_response(data=packages, message="Featured packages retrieved successfully")


@router.get(
    "/{identifier}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[TourPackageResponse],
    summary="Get tour package details by slug or ID",
    description="Retrieves complete itinerary, pricing, and details for a specific tour package."
)
async def get_package(
    identifier: str = Path(..., description="Package UUID or unique URL slug"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Public Endpoint:
    Returns details of a single tour package by slug or ID.
    """
    package = await TourPackageService.get_package_by_slug_or_id(db=db, identifier=identifier)
    return success_response(data=package, message="Tour package details retrieved successfully")


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[TourPackageResponse],
    summary="Create a new tour package",
    description="Creates a new holiday package. Requires Admin privileges."
)
async def create_package(
    package_in: TourPackageCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """
    Protected Endpoint (Admin Only):
    Adds a new tour package to the catalog.
    """
    package = await TourPackageService.create_package(db=db, package_create=package_in)
    return success_response(data=package, message="Tour package created successfully")


@router.put(
    "/{package_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[TourPackageResponse],
    summary="Update tour package details",
    description="Updates package itinerary, pricing, or availability. Requires Admin privileges."
)
async def update_package(
    package_id: str = Path(..., description="Package UUID"),
    package_in: TourPackageUpdate = Body(...),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """
    Protected Endpoint (Admin Only):
    Updates an existing tour package.
    """
    package = await TourPackageService.update_package(db=db, package_id=package_id, package_update=package_in)
    return success_response(data=package, message="Tour package updated successfully")


@router.delete(
    "/{package_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Delete a tour package",
    description="Deletes a tour package record from the catalog. Requires Admin privileges."
)
async def delete_package(
    package_id: str = Path(..., description="Package UUID"),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Any:
    """
    Protected Endpoint (Admin Only):
    Deletes a tour package.
    """
    await TourPackageService.delete_package(db=db, package_id=package_id)
    return success_response(data={}, message="Tour package deleted successfully")
