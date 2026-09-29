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


def register_user(role, email, password="Password123!"):
    if role == "student":
        payload = {
            "name": f"Test {role.capitalize()}",
            "email": email,
            "password": password,
            "confirm_password": password,
            "student_id": f"STU-{email[:5]}",
            "department": "Computer Science",
            "course": "B.Tech",
            "semester": 1
        }
        res = client.post("/api/auth/register/student", json=payload)
    elif role == "teacher":
        payload = {
            "name": f"Test {role.capitalize()}",
            "email": email,
            "password": password,
            "confirm_password": password,
            "employee_id": f"EMP-{email[:5]}",
            "department": "Computer Science"
        }
        res = client.post("/api/auth/register/teacher", json=payload)
    elif role == "parent":
        payload = {
            "name": f"Test {role.capitalize()}",
            "email": email,
            "password": password,
            "confirm_password": password
        }
        res = client.post("/api/auth/register/parent", json=payload)
    
    return res.json()["access_token"]


def test_rbac_permissions():
    student_token = register_user("student", "student.rbac@nexoura.edu")
    teacher_token = register_user("teacher", "teacher.rbac@nexoura.edu")

    student_headers = {"Authorization": f"Bearer {student_token}"}
    teacher_headers = {"Authorization": f"Bearer {teacher_token}"}

    # 1. Student -> Student API (Allowed)
    res_student = client.get("/api/students/me", headers=student_headers)
    assert res_student.status_code == 200

    # 2. Student -> Admin API (Forbidden)
    res_student_admin = client.get("/api/admin/users", headers=student_headers)
    assert res_student_admin.status_code == 403

    # 3. Teacher -> Teacher API (Allowed)
    res_teacher = client.get("/api/teachers/me", headers=teacher_headers)
    assert res_teacher.status_code == 200

    # 4. Teacher -> Student Private API (Forbidden)
    res_teacher_student = client.get("/api/students/me", headers=teacher_headers)
    assert res_teacher_student.status_code == 403
