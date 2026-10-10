from typing import Any, AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# Resolve database URL
db_url = settings.effective_database_url

# Create async engine configurations
engine_kwargs: dict[str, Any] = {"echo": False}

if "sqlite" in db_url:
    from sqlalchemy.pool import StaticPool
    engine_kwargs["connect_args"] = {"check_same_thread": False}
    engine_kwargs["poolclass"] = StaticPool
else:
    connect_args: dict[str, Any] = {}
    if getattr(settings, "MYSQL_SSL", False) or "ssl=true" in db_url.lower():
        connect_args["ssl"] = True
    if connect_args:
        engine_kwargs["connect_args"] = connect_args

    engine_kwargs.update({
        "pool_pre_ping": True,
        "pool_size": 5,
        "max_overflow": 10,
        "pool_recycle": 300,
    })

engine = create_async_engine(
    db_url,
    **engine_kwargs
)

# Create async session factory
SessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False
)

# Declarative base for models
Base = declarative_base()

# DB Dependency for routing
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
