from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.driver import DriverProfile, DriverStatus
from app.models.user import User, UserRole
from app.repositories.driver_repository import DriverRepository
from app.repositories.user_repository import UserRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.driver import DriverCreate, DriverUpdate, DriverResponse


class DriverService:
    """
    Service layer containing business logic for NJ Tours driver profile management.
    """

    @staticmethod
    async def create_driver_profile(db: AsyncSession, driver_create: DriverCreate) -> DriverResponse:
        """
        Creates a driver profile after validating user role, license uniqueness, and vehicle assignment.
        Supports creating the user account in the same transaction if 'user' payload is provided.
        """
        user_id = driver_create.user_id

        if not user_id:
            if not driver_create.user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Either user_id or user details must be provided to create driver profile"
                )

            # Validate existing email and phone
            existing_email = await UserRepository.get_by_email(db, driver_create.user.email)
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Email address '{driver_create.user.email}' is already registered"
                )

            existing_phone = await UserRepository.get_by_phone(db, driver_create.user.phone)
            if existing_phone:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Phone number '{driver_create.user.phone}' is already registered"
                )

            driver_create.user.role = UserRole.DRIVER
            hashed_pwd = hash_password(driver_create.user.password)
            created_user = await UserRepository.create_user(db, driver_create.user, hashed_pwd)
            user_id = created_user.id
        else:
            user = await UserRepository.get_by_id(db, user_id)
            if not user:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found")

            user_role = user.role.value if hasattr(user.role, 'value') else str(user.role)
            if user_role not in [UserRole.DRIVER.value, UserRole.ADMIN.value]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User account must have Driver role to create a driver profile"
                )

        existing_profile = await DriverRepository.get_by_user_id(db, user_id)
        if existing_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Driver profile already exists for this user account"
            )

        existing_license = await DriverRepository.get_by_license(db, driver_create.license_number)
        if existing_license:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"License number '{driver_create.license_number}' is already registered"
            )

        if driver_create.assigned_vehicle_id:
            vehicle = await VehicleRepository.get_by_id(db, driver_create.assigned_vehicle_id)
            if not vehicle:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assigned vehicle not found")

        driver = DriverProfile(
            user_id=user_id,
            license_number=driver_create.license_number,
            license_expiry=driver_create.license_expiry,
            aadhar_number=driver_create.aadhar_number,
            pan_number=driver_create.pan_number,
            address=driver_create.address,
            experience_years=driver_create.experience_years,
            emergency_contact=driver_create.emergency_contact,
            status=DriverStatus.AVAILABLE,
            assigned_vehicle_id=driver_create.assigned_vehicle_id
        )

        saved_driver = await DriverRepository.create_driver(db, driver)
        return DriverResponse.model_validate(saved_driver)

    @staticmethod
    async def get_driver_by_user_id(db: AsyncSession, user_id: str) -> DriverResponse:
        """Retrieves a driver profile using User ID."""
        driver = await DriverRepository.get_by_user_id(db, user_id)
        if not driver:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver profile not found")
        return DriverResponse.model_validate(driver)

    @staticmethod
    async def get_driver_by_id(db: AsyncSession, driver_id: str) -> DriverResponse:
        """Retrieves a driver profile by Driver UUID."""
        driver = await DriverRepository.get_by_id(db, driver_id)
        if not driver:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver profile not found")
        return DriverResponse.model_validate(driver)

    @staticmethod
    async def assign_vehicle(db: AsyncSession, driver_id: str, vehicle_id: Optional[str]) -> DriverResponse:
        """Assigns or unassigns a vehicle for a driver profile."""
        driver = await DriverRepository.get_by_id(db, driver_id)
        if not driver:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver profile not found")

        if vehicle_id:
            vehicle = await VehicleRepository.get_by_id(db, vehicle_id)
            if not vehicle:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

        updated_driver = await DriverRepository.update_driver(db, driver, {"assigned_vehicle_id": vehicle_id})
        return DriverResponse.model_validate(updated_driver)

    @staticmethod
    async def update_driver_status(db: AsyncSession, driver_id: str, new_status: DriverStatus) -> DriverResponse:
        """Updates availability status of a driver."""
        driver = await DriverRepository.get_by_id(db, driver_id)
        if not driver:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver profile not found")

        updated_driver = await DriverRepository.update_driver(db, driver, {"status": new_status})
        return DriverResponse.model_validate(updated_driver)

    @staticmethod
    async def update_driver_profile(
        db: AsyncSession,
        driver_id: str,
        driver_update: DriverUpdate,
        current_user: User
    ) -> DriverResponse:
        """Updates driver profile fields with authorization check."""
        driver = await DriverRepository.get_by_id(db, driver_id)
        if not driver:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver profile not found")

        user_role = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
        if user_role != UserRole.ADMIN.value and driver.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: Cannot update other driver's profile")

        update_dict = driver_update.model_dump(exclude_unset=True)
        updated_driver = await DriverRepository.update_driver(db, driver, update_dict)
        return DriverResponse.model_validate(updated_driver)

    @staticmethod
    async def list_drivers(
        db: AsyncSession,
        status: Optional[DriverStatus] = None,
        assigned_vehicle_id: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[DriverResponse]:
        """Lists driver profiles matching filter parameters."""
        drivers = await DriverRepository.list_drivers(
            db=db,
            status=status,
            assigned_vehicle_id=assigned_vehicle_id,
            search=search,
            skip=skip,
            limit=limit
        )
        return [DriverResponse.model_validate(d) for d in drivers]
