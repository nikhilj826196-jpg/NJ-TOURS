import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.connection import Base, get_db
from app.core.security import create_access_token
from app.models.user import User, UserRole

# In-memory SQLite DB for testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = async_sessionmaker(
    bind=test_engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


from collections.abc import AsyncGenerator

async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with TestingSessionLocal() as session:
        yield session


@pytest_asyncio.fixture(autouse=True)
async def setup_test_db():
    app.dependency_overrides[get_db] = override_get_db
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_tour_package_crud_and_filtering():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Setup seed users (Admin & Customer)
        async with TestingSessionLocal() as db:
            admin = User(
                full_name="Admin Tour",
                email="admin.tp@test.com",
                phone="9876599991",
                password_hash="hash",
                role=UserRole.ADMIN
            )
            customer = User(
                full_name="Cust Tour",
                email="cust.tp@test.com",
                phone="9876599992",
                password_hash="hash",
                role=UserRole.CUSTOMER
            )
            db.add_all([admin, customer])
            await db.commit()
            await db.refresh(admin)
            await db.refresh(customer)
            admin_id = admin.id
            cust_id = customer.id

        admin_token = create_access_token({"sub": admin_id, "role": "Admin"})
        cust_token = create_access_token({"sub": cust_id, "role": "Customer"})

        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        cust_headers = {"Authorization": f"Bearer {cust_token}"}

        pkg_payload = {
            "name": "Kashmir Paradise Tour",
            "category": "Hill Station",
            "destination": "Srinagar",
            "state": "Jammu & Kashmir",
            "duration": "6 Days / 5 Nights",
            "price": 24999.0,
            "offer_price": 19999.0,
            "description": "Explore Dal Lake, Gulmarg, Pahalgam and Sonamarg with luxury stay.",
            "highlights": ["Shikara Ride", "Gondola Ride in Gulmarg"],
            "inclusions": ["Hotels", "Breakfast & Dinner", "Cab Transfer"],
            "exclusions": ["Flight Tickets", "Personal Expenses"],
            "pickup_city": "Srinagar",
            "is_featured": True,
            "is_active": True
        }

        # 2. Customer attempt to create package -> 403 Forbidden
        res_forbidden = await client.post("/api/v1/tour-packages", json=pkg_payload, headers=cust_headers)
        assert res_forbidden.status_code == 403

        # 3. Admin creates package -> 201 Created
        res_create = await client.post("/api/v1/tour-packages", json=pkg_payload, headers=admin_headers)
        assert res_create.status_code == 201
        data = res_create.json()["data"]
        package_id = data["id"]
        slug = data["slug"]
        assert data["name"] == "Kashmir Paradise Tour"
        assert slug == "kashmir-paradise-tour"

        # 4. Public list & filter packages -> 200 OK
        res_list = await client.get("/api/v1/tour-packages?state=Jammu&is_featured=true")
        assert res_list.status_code == 200
        assert len(res_list.json()["data"]) == 1

        # 5. Public get featured packages -> 200 OK
        res_featured = await client.get("/api/v1/tour-packages/featured")
        assert res_featured.status_code == 200
        assert len(res_featured.json()["data"]) == 1

        # 6. Public get package by slug -> 200 OK
        res_slug = await client.get(f"/api/v1/tour-packages/{slug}")
        assert res_slug.status_code == 200
        assert res_slug.json()["data"]["id"] == package_id

        # 7. Admin updates package -> 200 OK
        res_update = await client.put(
            f"/api/v1/tour-packages/{package_id}",
            json={"offer_price": 18999.0, "is_featured": False},
            headers=admin_headers
        )
        assert res_update.status_code == 200
        assert res_update.json()["data"]["offer_price"] == 18999.0

        # 8. Admin deletes package -> 200 OK
        res_del = await client.delete(f"/api/v1/tour-packages/{package_id}", headers=admin_headers)
        assert res_del.status_code == 200

        # Verify get 404 after deletion
        res_404 = await client.get(f"/api/v1/tour-packages/{package_id}")
        assert res_404.status_code == 404
