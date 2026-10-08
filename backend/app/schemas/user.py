import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from app.models.user import UserRole


class UserCreate(BaseModel):
    """Schema for user registration request with strict field validation."""
    full_name: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="Full name of the user (3-100 characters)",
        examples=["John Doe"]
    )
    email: EmailStr = Field(
        ...,
        description="Unique and valid email address (converted to lowercase)",
        examples=["user@example.com"]
    )
    phone: str = Field(
        ...,
        description="Indian mobile number (10 digits starting with 6-9, optional +91 prefix)",
        examples=["9876543210"]
    )
    password: str = Field(
        ...,
        min_length=8,
        max_length=32,
        description="Strong password (8-32 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)",
        examples=["Password123!"]
    )
    role: UserRole = Field(
        default=UserRole.CUSTOMER,
        description="Role assigned to the user (Admin, Customer, Driver)",
        examples=[UserRole.CUSTOMER]
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "full_name": "John Doe",
                "email": "user@example.com",
                "phone": "9876543210",
                "password": "Password123!",
                "role": "Customer"
            }
        }
    )

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        stripped = v.strip()
        if len(stripped) < 3 or len(stripped) > 100:
            raise ValueError("Full name must be between 3 and 100 characters")
        return stripped

    @field_validator("email")
    @classmethod
    def validate_email_lowercase(cls, v: EmailStr) -> str:
        return str(v).strip().lower()

    @field_validator("phone")
    @classmethod
    def validate_indian_phone(cls, v: str) -> str:
        clean = v.strip()
        if clean.startswith("+91"):
            phone_digits = clean[3:].strip()
        elif clean.startswith("+"):
            phone_digits = clean[1:].strip()
        elif clean.startswith("0") and len(clean) == 11:
            phone_digits = clean[1:].strip()
        else:
            phone_digits = clean

        pattern = r"^[6-9]\d{9}$"
        if not re.match(pattern, phone_digits):
            raise ValueError("Phone number must be a valid 10-digit Indian mobile number starting with 6-9 (e.g. 9876543210 or +919876543210)")
        return phone_digits

    @field_validator("password")
    @classmethod
    def validate_password_complexity(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return v


class UserLogin(BaseModel):
    """Schema for user authentication / login request."""
    email: str = Field(
        ...,
        description="Registered user email address or phone number",
        examples=["user@example.com", "9876543210"]
    )
    password: str = Field(
        ...,
        description="Account password",
        examples=["Password123!"]
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "user@example.com",
                "password": "Password123!"
            }
        }
    )

    @field_validator("email")
    @classmethod
    def validate_email_lowercase(cls, v: str) -> str:
        return str(v).strip().lower()


class UpdateProfile(BaseModel):
    """Schema for updating user profile attributes."""
    full_name: Optional[str] = Field(
        None,
        min_length=3,
        max_length=100,
        description="Updated full name (3-100 characters)",
        examples=["Jane Doe"]
    )
    phone: Optional[str] = Field(
        None,
        description="Updated Indian mobile number (10 digits starting with 6-9)",
        examples=["9876543211"]
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "full_name": "Jane Doe",
                "phone": "9876543211"
            }
        }
    )

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        stripped = v.strip()
        if len(stripped) < 3 or len(stripped) > 100:
            raise ValueError("Full name must be between 3 and 100 characters")
        return stripped

    @field_validator("phone")
    @classmethod
    def validate_indian_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        clean = v.strip()
        if clean.startswith("+91"):
            phone_digits = clean[3:].strip()
        elif clean.startswith("+"):
            phone_digits = clean[1:].strip()
        elif clean.startswith("0") and len(clean) == 11:
            phone_digits = clean[1:].strip()
        else:
            phone_digits = clean

        pattern = r"^[6-9]\d{9}$"
        if not re.match(pattern, phone_digits):
            raise ValueError("Phone number must be a valid 10-digit Indian mobile number starting with 6-9")
        return phone_digits


class UserResponse(BaseModel):
    """Schema for user profile responses (excludes password_hash)."""
    id: str = Field(..., description="Unique User UUID")
    full_name: str = Field(..., description="User full name")
    email: EmailStr = Field(..., description="User email address")
    phone: str = Field(..., description="User phone number")
    role: UserRole = Field(..., description="User role in the system")
    is_active: bool = Field(..., description="Account active status")
    is_verified: bool = Field(..., description="Account verification status")
    created_at: datetime = Field(..., description="Account creation timestamp")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "e4d3c2b1-0000-1111-2222-333344445555",
                "full_name": "John Doe",
                "email": "user@example.com",
                "phone": "9876543210",
                "role": "Customer",
                "is_active": True,
                "is_verified": False,
                "created_at": "2026-08-06T12:00:00Z"
            }
        }
    )


class TokenResponse(BaseModel):
    """Schema for JWT authentication token response."""
    access_token: str = Field(..., description="JWT Access Token")
    refresh_token: str = Field(..., description="JWT Refresh Token")
    token_type: str = Field(default="bearer", description="Token authorization type")
    user: Optional[UserResponse] = Field(default=None, description="Authenticated user details")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "refresh_token": "dGhpc2lzYXJlZnJlc2h0b2tlbg...",
                "token_type": "bearer"
            }
        }
    )



class RefreshTokenRequest(BaseModel):
    """Schema for token refresh request."""
    refresh_token: str = Field(..., description="Valid JWT refresh token", examples=["dGhpc2lzYXJlZnJlc2h0b2tlbg..."])

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "refresh_token": "dGhpc2lzYXJlZnJlc2h0b2tlbg..."
            }
        }
    )


class ChangePasswordRequest(BaseModel):
    """Schema for user password change request."""
    old_password: str = Field(..., description="Current plaintext password", examples=["OldPassword123!"])
    new_password: str = Field(
        ...,
        min_length=8,
        max_length=32,
        description="New strong password (8-32 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)",
        examples=["NewPassword123!"]
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "old_password": "OldPassword123!",
                "new_password": "NewPassword123!"
            }
        }
    )

    @field_validator("new_password")
    @classmethod
    def validate_password_complexity(cls, v: str) -> str:
        if len(v) < 8 or len(v) > 32:
            raise ValueError("Password must be between 8 and 32 characters long")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?]", v):
            raise ValueError("Password must contain at least one special character")
        return v
