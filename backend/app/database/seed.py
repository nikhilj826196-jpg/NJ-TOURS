import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import SessionLocal
from app.repositories.user_repository import UserRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.models.user import UserRole
from app.models.vehicle import VehicleCategory, FuelType
from app.core.security import hash_password
from app.schemas.user import UserCreate
from app.schemas.vehicle import VehicleCreate

async def seed_initial_users(db: AsyncSession):
    """Seed initial default users if they do not exist in MySQL database."""
    default_users = [
        {
            "full_name": "Ramesh Kumar",
            "email": "customer@example.com",
            "phone": "9999999901",
            "password": "Password123!",
            "role": UserRole.CUSTOMER
        },
        {
            "full_name": "Suresh Patil",
            "email": "driver@example.com",
            "phone": "9999999902",
            "password": "Password123!",
            "role": UserRole.DRIVER
        },
        {
            "full_name": "System Admin",
            "email": "admin@example.com",
            "phone": "9999999903",
            "password": "Password123!",
            "role": UserRole.ADMIN
        }
    ]

    for user_data in default_users:
        exists_email = await UserRepository.exists_email(db, user_data["email"])
        exists_phone = await UserRepository.exists_phone(db, user_data["phone"])
        if not exists_email and not exists_phone:
            try:
                hashed_pwd = hash_password(user_data["password"])
                user_create = UserCreate(
                    full_name=user_data["full_name"],
                    email=user_data["email"],
                    phone=user_data["phone"],
                    password=user_data["password"],
                    role=user_data["role"]
                )

                await UserRepository.create_user(db, user_create, hashed_pwd)
                print(f"[Seed] Created initial user: {user_data['email']}")
            except Exception as e:
                print(f"[Seed Warning] Could not seed user {user_data['email']}: {e}")


async def seed_initial_vehicles(db: AsyncSession):
    """Seed default fleet vehicles if none exist in MySQL database."""
    existing_vehicles = await VehicleRepository.list_vehicles(db)
    if len(existing_vehicles) == 0:
        default_vehicles = [
            {
                "name": "Toyota Innova Crysta",
                "brand": "Toyota",
                "model_name": "Innova Crysta VX",
                "vehicle_number": "MH 12 AB 1001",
                "category": VehicleCategory.SUV,
                "seating_capacity": 7,
                "per_km_rate": 18.0,
                "per_day_rate": 3500.0,
                "fuel_type": FuelType.DIESEL,
                "is_ac": True,
                "is_available": True,
                "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80"
            },
            {
                "name": "Maruti Suzuki Swift Dzire",
                "brand": "Maruti Suzuki",
                "model_name": "Dzire ZXi",
                "vehicle_number": "MH 14 CD 2002",
                "category": VehicleCategory.SEDAN,
                "seating_capacity": 4,
                "per_km_rate": 13.0,
                "per_day_rate": 2500.0,
                "fuel_type": FuelType.CNG,
                "is_ac": True,
                "is_available": True,
                "image_url": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=300&q=80"
            },
            {
                "name": "Force Urbania Luxury Traveller",
                "brand": "Force",
                "model_name": "Urbania 3350",
                "vehicle_number": "MH 12 EF 3003",
                "category": VehicleCategory.TEMPO_TRAVELLER,
                "seating_capacity": 17,
                "per_km_rate": 28.0,
                "per_day_rate": 6500.0,
                "fuel_type": FuelType.DIESEL,
                "is_ac": True,
                "is_available": True,
                "image_url": "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=300&q=80"
            },
            {
                "name": "Volvo Multi-Axle Luxury Coach",
                "brand": "Volvo",
                "model_name": "9400 B11R",
                "vehicle_number": "MH 12 GH 4004",
                "category": VehicleCategory.BUS,
                "seating_capacity": 45,
                "per_km_rate": 55.0,
                "per_day_rate": 15000.0,
                "fuel_type": FuelType.DIESEL,
                "is_ac": True,
                "is_available": True,
                "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80"
            }
        ]

        for v_data in default_vehicles:
            try:
                v_create = VehicleCreate(**v_data)
                await VehicleRepository.create_vehicle(db, v_create)
                print(f"[Seed] Created initial vehicle: {v_data['name']}")
            except Exception as e:
                print(f"[Seed Warning] Could not seed vehicle {v_data['name']}: {e}")


async def run_seed():
    async with SessionLocal() as db:
        await seed_initial_users(db)
        await seed_initial_vehicles(db)

if __name__ == "__main__":
    asyncio.run(run_seed())
