"""
Authentication API Router Module
Re-exports authentication routes for top-level api package access.
"""
from app.api.v1.endpoints.auth import router

__all__ = ["router"]
