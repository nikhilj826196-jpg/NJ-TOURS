import asyncio
import sys
from app.database.connection import engine, Base

async def test_conn():
    try:
        async with engine.begin() as conn:
            print("Successfully connected to database!")
            await conn.run_sync(Base.metadata.create_all)
            print("Successfully created/verified tables!")
    except Exception as e:
        print(f"Connection error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(test_conn())
