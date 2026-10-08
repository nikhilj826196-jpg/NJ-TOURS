from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.database.connection import get_db
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository

# Password hashing configuration using Bcrypt via Passlib
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for standard Bearer Token auth in Swagger docs
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


def hash_password(password: str) -> str:
    """
    Hashes a plaintext password using Bcrypt.

    Args:
        password: The plain text password to hash.

    Returns:
        The hashed password string.
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plaintext password against a stored Bcrypt hash.

    Args:
        plain_password: The user input password to test.
        hashed_password: The stored Bcrypt hash.

    Returns:
        True if the password matches the hash, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Generates a signed JWT Access Token containing user metadata and expiration claims.

    Args:
        data: Payload metadata (e.g. sub, email, role).
        expires_delta: Optional custom duration for token expiry.

    Returns:
        A signed JWT access token string.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": now,
        "type": "access"
    })
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Generates a signed JWT Refresh Token with standard claims.

    Args:
        data: Payload metadata (e.g. sub).
        expires_delta: Optional custom duration for token expiry.

    Returns:
        A signed JWT refresh token string.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({
        "exp": expire,
        "iat": now,
        "type": "refresh"
    })
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Dict[str, Any]:
    """
    Decodes and validates a JWT token. Handles signature verification and expiration.

    Args:
        token: The raw JWT token string to decode.

    Returns:
        The decoded payload dictionary.

    Raises:
        HTTPException: 401 status code if the signature is invalid, expired, or corrupted.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token signature",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate token credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    FastAPI Dependency to retrieve the current active authenticated user from JWT.

    Args:
        db: Async database session.
        token: The incoming OAuth2 JWT Bearer Token.

    Returns:
        The authenticated User model instance.

    Raises:
        HTTPException: 401 if token is invalid/expired; 403 if user account is deactivated.
    """
    payload = decode_token(token)
    user_id: Optional[str] = payload.get("sub")
    token_type: str = payload.get("type", "access")

    if not user_id or token_type != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )

    return user


async def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    FastAPI Dependency restricting endpoint access to Admin users only.

    Args:
        current_user: The resolved User instance from get_current_user dependency.

    Returns:
        The validated Admin User instance.

    Raises:
        HTTPException: 403 Forbidden if the user's role is not Admin.
    """
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
    if role_val != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Admin access required"
        )
    return current_user


async def get_current_driver(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    FastAPI Dependency restricting endpoint access to Driver users or Admin users.

    Args:
        current_user: The resolved User instance from get_current_user dependency.

    Returns:
        The validated User instance.

    Raises:
        HTTPException: 403 Forbidden if the user's role is neither Driver nor Admin.
    """
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
    if role_val not in [UserRole.DRIVER.value, UserRole.ADMIN.value]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Driver access required"
        )
    return current_user


async def get_current_customer(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    FastAPI Dependency restricting endpoint access to Customer users or Admin users.

    Args:
        current_user: The resolved User instance from get_current_user dependency.

    Returns:
        The validated User instance.

    Raises:
        HTTPException: 403 Forbidden if the user's role is neither Customer nor Admin.
    """
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
    if role_val not in [UserRole.CUSTOMER.value, UserRole.ADMIN.value]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Customer access required"
        )
    return current_user
