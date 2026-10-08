from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    ChangePasswordRequest,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)


class AuthService:
    """
    Service layer containing pure business logic for Authentication,
    User Registration, Token Management, and Password Operations.
    Does NOT contain SQL queries directly (delegates all DB interactions to UserRepository).
    """

    @staticmethod
    async def register_user(db: AsyncSession, user_create: UserCreate) -> UserResponse:
        """
        Registers a new system user after enforcing email and phone uniqueness.

        Args:
            db: Async database session.
            user_create: Validated Pydantic user registration schema.

        Returns:
            UserResponse containing public profile information (excluding password hash).

        Raises:
            HTTPException 400: If email address or phone number is already registered.
        """
        # Business Rule 1: Email Uniqueness Check
        if await UserRepository.exists_email(db, user_create.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address is already registered"
            )

        # Business Rule 2: Phone Uniqueness Check
        if await UserRepository.exists_phone(db, user_create.phone):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number is already registered"
            )

        # Business Rule 3: Hash Password securely
        hashed_pwd = hash_password(user_create.password)

        # Business Rule 4: Delegate Persistence to Repository
        user = await UserRepository.create_user(db, user_create, hashed_pwd)
        return UserResponse.model_validate(user)

    @staticmethod
    async def login_user(db: AsyncSession, login_data: UserLogin) -> TokenResponse:
        """
        Authenticates a user via email and password credentials.

        Args:
            db: Async database session.
            login_data: Validated login request containing email and password.

        Returns:
            TokenResponse containing access_token, refresh_token, and authenticated user profile.

        Raises:
            HTTPException 401: If email or password is invalid.
            HTTPException 403: If user account is deactivated.
        """
        user = await UserRepository.get_by_email(db, login_data.email)
        if not user:
            user = await UserRepository.get_by_phone(db, login_data.email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated. Contact administrator."
            )

        # Generate JWT Claims
        role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
        token_payload = {
            "sub": user.id,
            "email": user.email,
            "role": role_str,
        }

        access_token = create_access_token(data=token_payload)
        refresh_token = create_refresh_token(data=token_payload)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )

    @staticmethod
    async def refresh_access_token(db: AsyncSession, refresh_token: str) -> TokenResponse:
        """
        Exchanges a valid refresh token for a fresh Access and Refresh Token pair.

        Args:
            db: Async database session.
            refresh_token: Signed JWT refresh token string.

        Returns:
            TokenResponse containing new access and refresh tokens.

        Raises:
            HTTPException 401: If refresh token is invalid, expired, or user is inactive.
        """
        payload = decode_token(refresh_token)
        token_type = payload.get("type")
        if token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type for refresh",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = await UserRepository.get_by_id(db, user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User inactive or no longer exists",
                headers={"WWW-Authenticate": "Bearer"},
            )

        role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
        token_payload = {
            "sub": user.id,
            "email": user.email,
            "role": role_str,
        }

        new_access_token = create_access_token(data=token_payload)
        new_refresh_token = create_refresh_token(data=token_payload)

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )

    @staticmethod
    async def get_current_user_profile(user: User) -> UserResponse:
        """
        Converts an authenticated User entity into a safe UserResponse schema.

        Args:
            user: Authenticated User model instance.

        Returns:
            Validated UserResponse.
        """
        return UserResponse.model_validate(user)

    @staticmethod
    async def change_password(db: AsyncSession, user: User, password_data: ChangePasswordRequest) -> bool:
        """
        Changes the password for an authenticated user after verifying their old password.

        Args:
            db: Async database session.
            user: Currently authenticated User instance.
            password_data: Schema containing old_password and new_password.

        Returns:
            True upon successful password update.

        Raises:
            HTTPException 400: If the provided old password does not match.
        """
        if not verify_password(password_data.old_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect old password"
            )

        new_hashed_pwd = hash_password(password_data.new_password)
        await UserRepository.update_user(db, user, {"password_hash": new_hashed_pwd})
        return True
