import re
from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.tour_package import TourPackage
from app.repositories.tour_package_repository import TourPackageRepository
from app.schemas.tour_package import TourPackageCreate, TourPackageUpdate, TourPackageResponse


class TourPackageService:
    """
    Service layer containing business logic for NJ Tours tour packages and itinerary management.
    """

    @staticmethod
    def generate_slug(name: str) -> str:
        """Converts package title string into a clean URL slug."""
        clean = name.lower().strip()
        clean = re.sub(r"[^\w\s-]", "", clean)
        return re.sub(r"[\s_-]+", "-", clean)

    @staticmethod
    async def create_package(db: AsyncSession, package_create: TourPackageCreate) -> TourPackageResponse:
        """
        Creates a new tour package after generating and validating unique URL slug.
        """
        slug = TourPackageService.generate_slug(package_create.name)
        existing = await TourPackageRepository.get_by_slug(db, slug)
        if existing:
            # Append suffix if slug collision
            slug = f"{slug}-{TourPackageService.generate_slug(package_create.destination)}"
            existing_again = await TourPackageRepository.get_by_slug(db, slug)
            if existing_again:
                import random
                slug = f"{slug}-{random.randint(100, 999)}"

        if package_create.offer_price and package_create.offer_price >= package_create.price:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Offer price must be strictly lower than standard price"
            )

        package = TourPackage(
            name=package_create.name,
            slug=slug,
            category=package_create.category,
            destination=package_create.destination,
            state=package_create.state,
            duration=package_create.duration,
            price=package_create.price,
            offer_price=package_create.offer_price,
            description=package_create.description,
            highlights=package_create.highlights,
            inclusions=package_create.inclusions,
            exclusions=package_create.exclusions,
            itinerary=package_create.itinerary,
            pickup_city=package_create.pickup_city,
            cover_image=package_create.cover_image,
            images=package_create.images,
            max_persons=package_create.max_persons,
            min_persons=package_create.min_persons,
            available_seats=package_create.available_seats,
            is_featured=package_create.is_featured,
            is_active=package_create.is_active
        )

        saved_package = await TourPackageRepository.create_package(db, package)
        return TourPackageResponse.model_validate(saved_package)

    @staticmethod
    async def get_package_by_slug_or_id(db: AsyncSession, identifier: str) -> TourPackageResponse:
        """Retrieves a package by either UUID or unique URL slug."""
        package = await TourPackageRepository.get_by_slug(db, identifier)
        if not package:
            package = await TourPackageRepository.get_by_id(db, identifier)

        if not package:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tour package not found"
            )
        return TourPackageResponse.model_validate(package)

    @staticmethod
    async def list_packages(
        db: AsyncSession,
        state: Optional[str] = None,
        category: Optional[str] = None,
        duration: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        min_rating: Optional[float] = None,
        is_featured: Optional[bool] = None,
        is_active: Optional[bool] = True,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[TourPackageResponse]:
        """Lists packages matching filter parameters."""
        packages = await TourPackageRepository.list_packages(
            db=db,
            state=state,
            category=category,
            duration=duration,
            min_price=min_price,
            max_price=max_price,
            min_rating=min_rating,
            is_featured=is_featured,
            is_active=is_active,
            search=search,
            skip=skip,
            limit=limit
        )
        return [TourPackageResponse.model_validate(p) for p in packages]

    @staticmethod
    async def update_package(
        db: AsyncSession,
        package_id: str,
        package_update: TourPackageUpdate
    ) -> TourPackageResponse:
        """Updates an existing tour package."""
        package = await TourPackageRepository.get_by_id(db, package_id)
        if not package:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tour package not found")

        update_dict = package_update.model_dump(exclude_unset=True)

        if "name" in update_dict:
            new_slug = TourPackageService.generate_slug(update_dict["name"])
            if new_slug != package.slug:
                existing = await TourPackageRepository.get_by_slug(db, new_slug)
                if existing and existing.id != package.id:
                    new_slug = f"{new_slug}-{package.id[:4]}"
                update_dict["slug"] = new_slug

        updated_package = await TourPackageRepository.update_package(db, package, update_dict)
        return TourPackageResponse.model_validate(updated_package)

    @staticmethod
    async def delete_package(db: AsyncSession, package_id: str) -> bool:
        """Deletes a tour package from the database."""
        package = await TourPackageRepository.get_by_id(db, package_id)
        if not package:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tour package not found")

        return await TourPackageRepository.delete_package(db, package)
