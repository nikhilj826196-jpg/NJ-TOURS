from fastapi import Depends, HTTPException, status
from app.core.deps import get_current_user
from app.models.user import User, UserRole


async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    FastAPI dependency that restricts route access to users with the Admin role.

    Args:
        current_user: Resolved authenticated User instance from get_current_user.

    Returns:
        The validated Admin User model.

    Raises:
        HTTPException: 403 Forbidden error if the user role is not Admin.
    """
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
    if role_val != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Admin access required"
        )
    return current_user


async def require_customer(current_user: User = Depends(get_current_user)) -> User:
    """
    FastAPI dependency that restricts route access to users with the Customer role.

    Args:
        current_user: Resolved authenticated User instance from get_current_user.

    Returns:
        The validated Customer User model.

    Raises:
        HTTPException: 403 Forbidden error if the user role is not Customer.
    """
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
    if role_val != UserRole.CUSTOMER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Customer access required"
        )
    return current_user


async def require_driver(current_user: User = Depends(get_current_user)) -> User:
    """
    FastAPI dependency that restricts route access to users with the Driver role.

    Args:
        current_user: Resolved authenticated User instance from get_current_user.

    Returns:
        The validated Driver User model.

    Raises:
        HTTPException: 403 Forbidden error if the user role is not Driver.
    """
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
    if role_val != UserRole.DRIVER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Driver access required"
        )
    return current_user


async def require_admin_or_driver(current_user: User = Depends(get_current_user)) -> User:
    """
    FastAPI dependency that restricts route access to Admin or Driver users.

    Args:
        current_user: Resolved authenticated User instance from get_current_user.

    Returns:
        The validated User model.

    Raises:
        HTTPException: 403 Forbidden error if the user role is neither Admin nor Driver.
    """
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
    if role_val not in [UserRole.ADMIN.value, UserRole.DRIVER.value]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Admin or Driver access required"
        )
    return current_user


async def require_admin_or_customer(current_user: User = Depends(get_current_user)) -> User:
    """
    FastAPI dependency that restricts route access to Admin or Customer users.

    Args:
        current_user: Resolved authenticated User instance from get_current_user.

    Returns:
        The validated User model.

    Raises:
        HTTPException: 403 Forbidden error if the user role is neither Admin nor Customer.
    """
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
    if role_val not in [UserRole.ADMIN.value, UserRole.CUSTOMER.value]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Admin or Customer access required"
        )
    return current_user
