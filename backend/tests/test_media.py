import io
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
async def test_media_full_lifecycle_and_batch_uploads():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Setup seed users (Admin & Customer)
        async with TestingSessionLocal() as db:
            admin = User(
                full_name="Admin Media",
                email="admin.m2@test.com",
                phone="9876533331",
                password_hash="hash",
                role=UserRole.ADMIN
            )
            customer = User(
                full_name="Customer Media",
                email="cust.m2@test.com",
                phone="9876533332",
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

        # 2. Upload Single Image -> 201 Created
        file_bytes = b"fake image byte content"
        img_file = {"file": ("innova.webp", io.BytesIO(file_bytes), "image/webp")}
        res_img = await client.post(
            "/api/v1/media/upload",
            data={"folder": "vehicles"},
            files=img_file,
            headers=admin_headers
        )
        assert res_img.status_code == 201
        data_img = res_img.json()["data"]
        media_id = data_img["id"]
        assert data_img["file_type"] == "image"
        assert data_img["thumbnail_url"] is not None

        # 3. Upload Single PDF Document -> 201 Created
        pdf_bytes = b"%PDF-1.4 fake pdf binary data"
        doc_file = {"file": ("license.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
        res_pdf = await client.post(
            "/api/v1/media/upload",
            data={"folder": "drivers"},
            files=doc_file,
            headers=admin_headers
        )
        assert res_pdf.status_code == 201
        assert res_pdf.json()["data"]["file_type"] == "document"

        # 4. Upload Multiple Files -> 201 Created
        files_batch = [
            ("files", ("photo1.png", io.BytesIO(file_bytes), "image/png")),
            ("files", ("photo2.jpg", io.BytesIO(file_bytes), "image/jpeg"))
        ]
        res_batch = await client.post(
            "/api/v1/media/upload-multiple",
            data={"folder": "packages"},
            files=files_batch,
            headers=admin_headers
        )
        assert res_batch.status_code == 201
        assert len(res_batch.json()["data"]) == 2

        # 5. List Media Files -> 200 OK
        res_list = await client.get("/api/v1/media/list?folder=vehicles", headers=admin_headers)
        assert res_list.status_code == 200
        assert len(res_list.json()["data"]) == 1

        # 6. Update Media Metadata / Relation -> 200 OK
        res_update = await client.put(
            f"/api/v1/media/{media_id}",
            json={"related_vehicle_id": "test-vehicle-uuid-1234"},
            headers=admin_headers
        )
        assert res_update.status_code == 200
        assert res_update.json()["data"]["related_vehicle_id"] == "test-vehicle-uuid-1234"

        # 7. Attempt upload invalid extension -> 400 Bad Request
        bad_file = {"file": ("virus.exe", io.BytesIO(file_bytes), "application/octet-stream")}
        res_bad = await client.post(
            "/api/v1/media/upload",
            data={"folder": "users"},
            files=bad_file,
            headers=admin_headers
        )
        assert res_bad.status_code == 400

        # 8. Delete Media File -> 200 OK
        res_del = await client.delete(f"/api/v1/media/{media_id}", headers=admin_headers)
        assert res_del.status_code == 200

        # Verify 404 after deletion
        res_404 = await client.get(f"/api/v1/media/{media_id}", headers=admin_headers)
        assert res_404.status_code == 404
