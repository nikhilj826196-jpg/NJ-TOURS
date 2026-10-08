from typing import Generic, TypeVar, Optional, Any, List
from pydantic import BaseModel, Field

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standardized API JSON Response envelope."""
    success: bool = Field(True, description="Indicates if request was successful")
    message: str = Field(..., description="Response status message")
    data: Optional[T] = Field(None, description="Response payload data")
    errors: Optional[List[Any]] = Field(default_factory=list, description="List of error details if applicable")


def success_response(data: Any = None, message: str = "Operation completed successfully") -> dict:
    """Helper function to create structured success JSON response."""
    return {
        "success": True,
        "message": message,
        "data": data,
        "errors": []
    }


def error_response(message: str = "An error occurred", errors: Optional[List[Any]] = None) -> dict:
    """Helper function to create structured error JSON response."""
    return {
        "success": False,
        "message": message,
        "errors": errors if errors is not None else []
    }
