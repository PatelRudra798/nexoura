import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_student_registration_and_login():
    import uuid
    uid = uuid.uuid4().hex[:6]
    test_email = f"jane.{uid}@nexoura.edu"
    test_stu_id = f"STU-{uid.upper()}"

    # 1. Register student
    reg_payload = {
        "name": "Jane Student",
        "email": test_email,
        "password": "Password123!",
        "confirm_password": "Password123!",
        "student_id": test_stu_id,
        "department": "Computer Science",
        "course": "B.Tech Computer Engineering",
        "semester": 4
    }
    response = client.post("/api/auth/register/student", json=reg_payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == test_email
    assert data["user"]["role"] == "student"
    assert data["user"]["student_profile"]["student_id"] == test_stu_id

    # 2. Duplicate registration attempt
    dup_response = client.post("/api/auth/register/student", json=reg_payload)
    assert dup_response.status_code == 409

    # 3. Login with correct credentials
    login_payload = {
        "email": test_email,
        "password": "Password123!"
    }
    login_response = client.post("/api/auth/login", json=login_payload)
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # 4. Fetch /api/auth/me using Bearer token
    headers = {"Authorization": f"Bearer {token}"}
    me_response = client.get("/api/auth/me", headers=headers)
    assert me_response.status_code == 200
    assert me_response.json()["email"] == test_email


def test_invalid_login_credentials():
    login_payload = {
        "email": "nonexistent@nexoura.edu",
        "password": "WrongPassword!"
    }
    response = client.post("/api/auth/login", json=login_payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password."
