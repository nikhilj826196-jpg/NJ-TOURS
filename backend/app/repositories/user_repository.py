from typing import Optional, Dict, Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.schemas.user import UserCreate


class UserRepository:
    """
    Repository layer for isolating all User database operations using SQLAlchemy 2.0 Async Session.
    Encapsulates SQL queries and ensures best practices (e.g. no commits in read operations).
    """

    @staticmethod
    async def get_by_id(db: AsyncSession, user_id: str) -> Optional[User]:
        """
        Fetch a single user by primary key (UUID).

        Args:
            db: Async database session.
            user_id: Unique UUID string identifying the user.

        Returns:
            The User instance if found, otherwise None.
        """
        stmt = select(User).where(User.id == user_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> Optional[User]:
        """
        Fetch a single user by email address.

        Args:
            db: Async database session.
            email: Unique email address string.

        Returns:
            The User instance if found, otherwise None.
        """
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_phone(db: AsyncSession, phone: str) -> Optional[User]:
        """
        Fetch a single user by contact phone number.

        Args:
            db: Async database session.
            phone: Unique phone number string.

        Returns:
            The User instance if found, otherwise None.
        """
        stmt = select(User).where(User.phone == phone)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def exists_email(db: AsyncSession, email: str) -> bool:
        """
        Optimized check to verify if a user with the given email exists in the database.

        Args:
            db: Async database session.
            email: Email address to search.

        Returns:
            True if the email exists, False otherwise.
        """
        stmt = select(select(User.id).where(User.email == email).exists())
        result = await db.execute(stmt)
        return bool(result.scalar())

    @staticmethod
    async def exists_phone(db: AsyncSession, phone: str) -> bool:
        """
        Optimized check to verify if a user with the given phone number exists in the database.

        Args:
            db: Async database session.
            phone: Phone number to search.

        Returns:
            True if the phone number exists, False otherwise.
        """
        stmt = select(select(User.id).where(User.phone == phone).exists())
        result = await db.execute(stmt)
        return bool(result.scalar())

    @staticmethod
    async def create_user(db: AsyncSession, user_create: UserCreate, hashed_password: str) -> User:
        """
        Persists a new User record in the database.

        Args:
            db: Async database session.
            user_create: Pydantic registration validation schema.
            hashed_password: Safe bcrypt hashed password string.

        Returns:
            The newly created User model instance.
        """
        user = User(
            full_name=user_create.full_name,
            email=user_create.email,
            phone=user_create.phone,
            password_hash=hashed_password,
            role=user_create.role
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def update_user(db: AsyncSession, user: User, update_data: Dict[str, Any]) -> User:
        """
        Updates and persists modified attributes of an existing User model.

        Args:
            db: Async database session.
            user: Loaded User model instance to be updated.
            update_data: Dictionary of fields to update and their values.

        Returns:
            The updated User model instance.
        """
        for key, value in update_data.items():
            if value is not None and hasattr(user, key):
                setattr(user, key, value)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def delete_user(db: AsyncSession, user: User, soft: bool = True) -> User:
        """
        Deletes a user. Supports soft deletion by disabling account active status flag.

        Args:
            db: Async database session.
            user: Loaded User model instance to delete.
            soft: If True, performs soft deletion (sets is_active=False). If False, performs hard deletion.

        Returns:
            The deleted / modified User model instance.
        """
        if soft:
            user.is_active = False
            db.add(user)
        else:
            await db.delete(user)
        await db.commit()
        if soft:
            await db.refresh(user)
        return user

    @staticmethod
    async def list_users(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[User]:
        """
        Retrieves a paginated list of all users.

        Args:
            db: Async database session.
            skip: Number of records to skip (offset).
            limit: Maximum number of records to return.

        Returns:
            List of User model instances matching pagination bounds.
        """
        stmt = select(User).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())
