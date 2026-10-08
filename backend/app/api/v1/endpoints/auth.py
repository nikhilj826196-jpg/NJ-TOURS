from typing import Any
from fastapi import APIRouter, Depends, status, Body
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.services.auth_service import AuthService
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    RefreshTokenRequest,
    ChangePasswordRequest,
)
from app.schemas.response import APIResponse, success_response
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[UserResponse],
    summary="Register a new system user",
    description="Registers a new user (Customer, Driver, or Admin) with unique email and phone validation.",
    responses={
        201: {"description": "User registered successfully"},
        400: {"description": "Email or Phone address already registered"},
        422: {"description": "Validation error in request payload"}
    }
)
async def register(
    user_in: UserCreate = Body(..., examples=[{
        "full_name": "Rahul Sharma",
        "email": "rahul.sharma@example.com",
        "phone": "9876543210",
        "password": "Password123!",
        "role": "Customer"
    }]),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    User Registration Endpoint:
    - **full_name**: Required full name (3-100 characters)
    - **email**: Must be valid and unique
    - **phone**: Must be a valid 10-digit Indian mobile number starting with 6-9
    - **password**: 8-32 characters with uppercase, lowercase, digit, and special char
    - **role**: Admin, Customer, or Driver (Default: Customer)
    """
    user = await AuthService.register_user(db=db, user_create=user_in)
    return success_response(data=user, message="User registered successfully")


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[TokenResponse],
    summary="Authenticate user & obtain JWT tokens",
    description="Authenticates user credentials using email & password.",
    responses={
        200: {"description": "Authentication successful"},
        401: {"description": "Invalid email or password credentials"},
        403: {"description": "User account is deactivated"}
    }
)
async def login(
    login_data: UserLogin = Body(..., examples=[{
        "email": "rahul.sharma@example.com",
        "password": "Password123!"
    }]),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    User Login Endpoint:
    Accepts JSON body payload (`email` and `password`).
    Returns JWT access_token, refresh_token, and user profile.
    """
    token_resp = await AuthService.login_user(db=db, login_data=login_data)
    return success_response(data=token_resp, message="Login successful")


@router.post(
    "/refresh",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[TokenResponse],
    summary="Refresh JWT access token",
    description="Exchanges a valid refresh token for a new access & refresh token pair.",
    responses={
        200: {"description": "Tokens refreshed successfully"},
        401: {"description": "Invalid or expired refresh token"}
    }
)
async def refresh_token(
    refresh_in: RefreshTokenRequest = Body(..., examples=[{
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }]),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Token Refresh Endpoint:
    Supply a valid `refresh_token` to receive fresh access and refresh tokens.
    """
    tokens = await AuthService.refresh_access_token(db=db, refresh_token=refresh_in.refresh_token)
    return success_response(data=tokens, message="Access token refreshed successfully")


@router.get(
    "/me",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[UserResponse],
    summary="Get current user profile",
    description="Retrieves profile information for the currently authenticated user.",
    responses={
        200: {"description": "Current user profile fetched successfully"},
        401: {"description": "Unauthorized / Token missing or invalid"}
    }
)
async def get_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Protected Profile Endpoint:
    Requires valid `Authorization: Bearer <access_token>` header.
    """
    user_resp = await AuthService.get_current_user_profile(current_user)
    return success_response(data=user_resp, message="Profile fetched successfully")


@router.post(
    "/change-password",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Change authenticated user password",
    description="Changes password after verifying current old password.",
    responses={
        200: {"description": "Password changed successfully"},
        400: {"description": "Incorrect old password or invalid new password format"},
        401: {"description": "Unauthorized / Bearer token missing or invalid"}
    }
)
async def change_password(
    pass_in: ChangePasswordRequest = Body(..., examples=[{
        "old_password": "OldPassword123!",
        "new_password": "NewPassword123!"
    }]),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Change Password Endpoint:
    Requires valid Bearer Token. Validates old password before applying new password.
    """
    await AuthService.change_password(db=db, user=current_user, password_data=pass_in)
    return success_response(data={}, message="Password changed successfully")


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Logout user session",
    description="Logs out the current user session.",
    responses={
        200: {"description": "Logged out successfully"},
        401: {"description": "Unauthorized"}
    }
)
async def logout(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Logout Placeholder Endpoint:
    Confirms client token clearance. (Token blacklisting will be integrated in future phases).
    """
    return success_response(data={}, message="Successfully logged out")
