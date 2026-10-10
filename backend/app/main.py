import sys
from contextlib import asynccontextmanager
from pathlib import Path

# Ensure backend root directory is in sys.path for direct script execution
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from prometheus_fastapi_instrumentator import Instrumentator

from app.api.v1.router import api_router
from app.core.config import settings
from app.database.connection import Base, engine
# Import models to ensure they are registered with Base metadata
import app.models  # noqa: F401
from app.websocket.location_socket import manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Creates database tables automatically on startup if DB connection is active.
    """
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            # Safe schema updates for existing database tables
            from sqlalchemy import text
            try:
                await conn.execute(text("ALTER TABLE bookings ADD COLUMN cancellation_reason VARCHAR(255) NULL"))
            except Exception:
                pass
            try:
                await conn.execute(text("ALTER TABLE bookings ADD COLUMN cancelled_at DATETIME NULL"))
            except Exception:
                pass
            try:
                await conn.execute(text("ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL"))
            except Exception:
                pass
            try:
                await conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_expires DATETIME NULL"))
            except Exception:
                pass
        print("[Database] Successfully connected and synchronized metadata tables.")

        # Seed default users and vehicles if DB connected
        try:
            from app.database.connection import SessionLocal
            from app.database.seed import seed_initial_users, seed_initial_vehicles
            async with SessionLocal() as db_session:
                await seed_initial_users(db_session)
                await seed_initial_vehicles(db_session)
        except Exception as seed_err:
            print(f"[Seed Notice] {seed_err}")
    except Exception as e:
        print(f"[Database Warning] Could not connect to database on startup ({e}). If using MySQL, please start MySQL service or run 'docker-compose up db'.")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="NJ Tours (National Journey) Backend API - Auth, Bookings, & Fleet Management",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Instrument FastAPI with Prometheus
Instrumentator().instrument(app).expose(app)

# CORS Middleware Configuration
configured_origins = []
if hasattr(settings, "CORS_ORIGINS") and settings.CORS_ORIGINS:
    configured_origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]

default_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
]

effective_origins = list(set(default_origins + configured_origins))
allow_credentials = True

if len(configured_origins) == 1 and configured_origins[0] == "*":
    effective_origins = ["*"]
    allow_credentials = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=effective_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Step 8 - Standardized Global Exception Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail if isinstance(exc.detail, str) else "HTTP Exception",
            "errors": exc.detail if not isinstance(exc.detail, str) else []
        },
        headers=exc.headers
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    formatted_errors = []
    for err in exc.errors():
        loc = " -> ".join([str(x) for x in err.get("loc", [])])
        formatted_errors.append({
            "field": loc,
            "message": err.get("msg")
        })
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "Validation Error",
            "errors": formatted_errors
        }
    )


# Create uploads directory if not exists (safe on serverless/read-only runtimes)
try:
    Path("uploads").mkdir(parents=True, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
except Exception as e:
    print(f"[Uploads Notice] Local uploads directory mounting skipped or read-only: {e}")

# Include API V1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.websocket("/ws/location/driver/{driver_id}")
async def ws_location_driver(websocket: WebSocket, driver_id: str):
    await manager.connect_driver(driver_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            await manager.broadcast_to_admins(data)
    except WebSocketDisconnect:
        manager.disconnect_driver(driver_id, websocket)


@app.websocket("/ws/location/customer/{booking_id}")
async def ws_location_customer(websocket: WebSocket, booking_id: str):
    await manager.connect_customer(booking_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_customer(booking_id, websocket)


@app.websocket("/ws/location/admin")
async def ws_location_admin(websocket: WebSocket):
    await manager.connect_admin(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_admin(websocket)


@app.get("/health", tags=["health"])
@app.get("/api/health", tags=["health"])
async def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

