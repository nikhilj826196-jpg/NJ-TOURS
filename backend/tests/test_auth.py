import pytest
import pytest_asyncio
from datetime import timedelta
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.connection import Base, get_db
from app.core.security import create_access_token
from app.models.user import UserRole

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


@pytest_asyncio.fixture(autouse=True)
async def setup_test_db():
    app.dependency_overrides[get_db] = override_get_db
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    app.dependency_overrides.clear()


from collections.abc import AsyncGenerator

async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with TestingSessionLocal() as session:
        yield session


@pytest.mark.asyncio
async def test_register_user_success():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "full_name": "Test User",
            "email": "test@example.com",
            "phone": "9998887777",
            "password": "Password123!",
            "role": "Customer"
        }
        res = await client.post("/api/v1/auth/register", json=payload)
        assert res.status_code == 201
        data = res.json()
        assert data["success"] is True
        assert data["data"]["email"] == "test@example.com"
        assert data["data"]["phone"] == "9998887777"
        assert data["data"]["role"] == "Customer"


@pytest.mark.asyncio
async def test_register_duplicate_email():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload1 = {
            "full_name": "User One",
            "email": "duplicate@example.com",
            "phone": "9111111111",
            "password": "Password123!",
            "role": "Customer"
        }
        await client.post("/api/v1/auth/register", json=payload1)

        payload2 = {
            "full_name": "User Two",
            "email": "duplicate@example.com",
            "phone": "9222222222",
            "password": "Password123!",
            "role": "Customer"
        }
        res = await client.post("/api/v1/auth/register", json=payload2)
        assert res.status_code == 400
        data = res.json()
        assert data["success"] is False
        assert "Email address is already registered" in data["message"]


@pytest.mark.asyncio
async def test_register_duplicate_phone():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload1 = {
            "full_name": "User One",
            "email": "user1@example.com",
            "phone": "9234567890",
            "password": "Password123!",
            "role": "Customer"
        }
        await client.post("/api/v1/auth/register", json=payload1)

        payload2 = {
            "full_name": "User Two",
            "email": "user2@example.com",
            "phone": "9234567890",
            "password": "Password123!",
            "role": "Customer"
        }
        res = await client.post("/api/v1/auth/register", json=payload2)
        assert res.status_code == 400
        data = res.json()
        assert data["success"] is False
        assert "Phone number is already registered" in data["message"]


@pytest.mark.asyncio
async def test_login_user_success():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        reg_payload = {
            "full_name": "Login User",
            "email": "login@example.com",
            "phone": "9555444333",
            "password": "Password123!",
            "role": "Customer"
        }
        await client.post("/api/v1/auth/register", json=reg_payload)

        login_payload = {
            "email": "login@example.com",
            "password": "Password123!"
        }
        res = await client.post("/api/v1/auth/login", json=login_payload)
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert "access_token" in data["data"]
        assert "refresh_token" in data["data"]
        assert data["data"]["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        reg_payload = {
            "full_name": "User",
            "email": "user@example.com",
            "phone": "9000000000",
            "password": "CorrectPassword123!",
            "role": "Customer"
        }
        await client.post("/api/v1/auth/register", json=reg_payload)

        res = await client.post("/api/v1/auth/login", json={
            "email": "user@example.com",
            "password": "WrongPassword"
        })
        assert res.status_code == 401
        data = res.json()
        assert data["success"] is False


@pytest.mark.asyncio
async def test_protected_route_me_success():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        reg_payload = {
            "full_name": "Protected User",
            "email": "me@example.com",
            "phone": "9888777666",
            "password": "Password123!",
            "role": "Customer"
        }
        await client.post("/api/v1/auth/register", json=reg_payload)

        login_res = await client.post("/api/v1/auth/login", json={
            "email": "me@example.com",
            "password": "Password123!"
        })
        token = login_res.json()["data"]["access_token"]

        me_res = await client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert me_res.status_code == 200
        me_data = me_res.json()
        assert me_data["success"] is True
        assert me_data["data"]["email"] == "me@example.com"


@pytest.mark.asyncio
async def test_invalid_token_rejection():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer invalid_malformed_token"}
        )
        assert res.status_code == 401
        data = res.json()
        assert data["success"] is False


@pytest.mark.asyncio
async def test_expired_token_rejection():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        expired_token = create_access_token(
            data={"sub": "test-uuid", "role": "Customer"},
            expires_delta=timedelta(seconds=-10)
        )
        res = await client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {expired_token}"}
        )
        assert res.status_code == 401
        data = res.json()
        assert data["success"] is False
        assert "expired" in data["message"].lower()


@pytest.mark.asyncio
async def test_refresh_token_success():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        reg_payload = {
            "full_name": "Refresh User",
            "email": "refresh@example.com",
            "phone": "9777666555",
            "password": "Password123!",
            "role": "Customer"
        }
        await client.post("/api/v1/auth/register", json=reg_payload)

        login_res = await client.post("/api/v1/auth/login", json={
            "email": "refresh@example.com",
            "password": "Password123!"
        })
        refresh_token = login_res.json()["data"]["refresh_token"]

        ref_res = await client.post("/api/v1/auth/refresh", json={
            "refresh_token": refresh_token
        })
        assert ref_res.status_code == 200
        ref_data = ref_res.json()
        assert ref_data["success"] is True
        assert "access_token" in ref_data["data"]
        assert "refresh_token" in ref_data["data"]


@pytest.mark.asyncio
async def test_role_based_access_control():
    from app.core.deps import get_current_admin
    from app.models.user import User, UserRole
    from fastapi import HTTPException

    admin_user = User(full_name="Admin User", email="admin@test.com", phone="+111", password_hash="x", role=UserRole.ADMIN)
    customer_user = User(full_name="Customer User", email="cust@test.com", phone="+222", password_hash="x", role=UserRole.CUSTOMER)

    # Admin passes get_current_admin
    res_admin = await get_current_admin(current_user=admin_user)
    assert res_admin.email == "admin@test.com"

    # Customer fails get_current_admin with 403 Forbidden
    with pytest.raises(HTTPException) as exc_info:
        await get_current_admin(current_user=customer_user)
    assert exc_info.value.status_code == 403


@pytest.mark.asyncio
async def test_change_password_success():
    from app.services.auth_service import AuthService
    from app.schemas.user import ChangePasswordRequest
    from app.core.security import hash_password, verify_password
    from app.models.user import User

    async with TestingSessionLocal() as session:
        user = User(
            full_name="Password Test",
            email="pwd@test.com",
            phone="9876543299",
            password_hash=hash_password("OldPassword123!"),
            role="Customer"
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)

        req = ChangePasswordRequest(
            old_password="OldPassword123!",
            new_password="NewPassword123!"
        )
        res = await AuthService.change_password(db=session, user=user, password_data=req)
        assert res is True
        assert verify_password("NewPassword123!", user.password_hash) is True


@pytest.mark.asyncio
async def test_login_inactive_user():
    from app.services.auth_service import AuthService
    from app.schemas.user import UserLogin
    from app.core.security import hash_password
    from app.models.user import User
    from fastapi import HTTPException

    async with TestingSessionLocal() as session:
        user = User(
            full_name="Inactive User",
            email="inactive@test.com",
            phone="9876543288",
            password_hash=hash_password("Password123!"),
            is_active=False,
            role="Customer"
        )
        session.add(user)
        await session.commit()

        login_data = UserLogin(email="inactive@test.com", password="Password123!")
        with pytest.raises(HTTPException) as exc_info:
            await AuthService.login_user(db=session, login_data=login_data)
        assert exc_info.value.status_code == 403


@pytest.mark.asyncio
async def test_endpoint_change_password_and_logout():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        reg_payload = {
            "full_name": "API Pwd User",
            "email": "apipwd@example.com",
            "phone": "9666555444",
            "password": "OldPassword123!",
            "role": "Customer"
        }
        await client.post("/api/v1/auth/register", json=reg_payload)

        login_res = await client.post("/api/v1/auth/login", json={
            "email": "apipwd@example.com",
            "password": "OldPassword123!"
        })
        token = login_res.json()["data"]["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Test change-password endpoint
        ch_res = await client.post(
            "/api/v1/auth/change-password",
            json={"old_password": "OldPassword123!", "new_password": "NewPassword123!"},
            headers=headers
        )
        assert ch_res.status_code == 200
        assert ch_res.json()["success"] is True

        # Verify login with new password
        new_login = await client.post("/api/v1/auth/login", json={
            "email": "apipwd@example.com",
            "password": "NewPassword123!"
        })
        assert new_login.status_code == 200

        # Test logout endpoint
        logout_res = await client.post("/api/v1/auth/logout", headers=headers)
        assert logout_res.status_code == 200
        assert logout_res.json()["success"] is True


@pytest.mark.asyncio
async def test_permissions_rbac():
    from app.core.permissions import (
        require_admin,
        require_customer,
        require_driver,
        require_admin_or_driver,
        require_admin_or_customer,
    )
    from app.models.user import User, UserRole
    from fastapi import HTTPException

    admin_user = User(full_name="Admin", email="a@t.com", phone="1", password_hash="x", role=UserRole.ADMIN)
    customer_user = User(full_name="Customer", email="c@t.com", phone="2", password_hash="x", role=UserRole.CUSTOMER)
    driver_user = User(full_name="Driver", email="d@t.com", phone="3", password_hash="x", role=UserRole.DRIVER)

    # 1. require_admin
    assert await require_admin(current_user=admin_user) == admin_user
    with pytest.raises(HTTPException) as exc:
        await require_admin(current_user=customer_user)
    assert exc.value.status_code == 403

    # 2. require_customer
    assert await require_customer(current_user=customer_user) == customer_user
    with pytest.raises(HTTPException) as exc:
        await require_customer(current_user=admin_user)
    assert exc.value.status_code == 403

    # 3. require_driver
    assert await require_driver(current_user=driver_user) == driver_user
    with pytest.raises(HTTPException) as exc:
        await require_driver(current_user=customer_user)
    assert exc.value.status_code == 403

    # 4. require_admin_or_driver
    assert await require_admin_or_driver(current_user=admin_user) == admin_user
    assert await require_admin_or_driver(current_user=driver_user) == driver_user
    with pytest.raises(HTTPException) as exc:
        await require_admin_or_driver(current_user=customer_user)
    assert exc.value.status_code == 403

    # 5. require_admin_or_customer
    assert await require_admin_or_customer(current_user=admin_user) == admin_user
    assert await require_admin_or_customer(current_user=customer_user) == customer_user
    with pytest.raises(HTTPException) as exc:
        await require_admin_or_customer(current_user=driver_user)
    assert exc.value.status_code == 403

