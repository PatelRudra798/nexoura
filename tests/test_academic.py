import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine
from seed_academic import seed_academic_curriculum

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    seed_academic_curriculum()
    yield
    # Note: Keep tables for persistent tests or clean as needed


import uuid

def register_and_login(role="student"):
    uid = uuid.uuid4().hex[:8].lower()
    email = f"{role}.{uid}@nexoura.edu"

    if role == "student":
        reg_payload = {
            "name": f"Test Student {uid}",
            "email": email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "student_id": f"STU-{uid.upper()}",
            "department": "Computer Science",
            "course": "B.Tech",
            "semester": 4
        }
        reg_res = client.post("/api/auth/register/student", json=reg_payload)
        assert reg_res.status_code == 201, reg_res.text
    elif role == "teacher":
        reg_payload = {
            "name": f"Test Teacher {uid}",
            "email": email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "employee_id": f"EMP-{uid.upper()}",
            "department": "Computer Science",
            "designation": "Associate Professor"
        }
        reg_res = client.post("/api/auth/register/teacher", json=reg_payload)
        assert reg_res.status_code == 201, reg_res.text

    login_res = client.post("/api/auth/login", json={"email": email, "password": "Password123!"})
    assert login_res.status_code == 200, login_res.text
    return login_res.json()["access_token"]


def test_academic_subjects_and_tests():
    token = register_and_login(role="student")
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Fetch curriculum subjects
    res = client.get("/api/academic/subjects", headers=headers)
    assert res.status_code == 200
    subjects = res.json()
    assert len(subjects) >= 3
    assert any(s["code"] == "CS301" for s in subjects)

    # 2. Fetch available tests
    res = client.get("/api/academic/tests", headers=headers)
    assert res.status_code == 200
    tests = res.json()
    assert len(tests) >= 2

    # 3. Fetch test questions (verify answers are not leaked)
    test_id = tests[0]["id"]
    res = client.get(f"/api/academic/tests/{test_id}", headers=headers)
    assert res.status_code == 200
    test_detail = res.json()
    assert len(test_detail["questions"]) == 5
    first_q = test_detail["questions"][0]
    assert "correct_answer" not in first_q
    assert "explanation" not in first_q
    assert len(first_q["options"]) == 4


def test_assessment_submission_and_intelligence_pipeline():
    token = register_and_login(role="student")
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Fetch DSA benchmark test
    tests_res = client.get("/api/academic/tests", headers=headers)
    dsa_test = [t for t in tests_res.json() if "DSA" in t["title"]][0]

    detail_res = client.get(f"/api/academic/tests/{dsa_test['id']}", headers=headers)
    questions = detail_res.json()["questions"]

    # 2. Submit answers: Intentionally answer first 2 questions wrong to create a weak topic!
    submit_payload = {
        "answers": [
            {"question_id": questions[0]["id"], "selected_answer": "WRONG_ANSWER"},
            {"question_id": questions[1]["id"], "selected_answer": "WRONG_ANSWER"},
            {"question_id": questions[2]["id"], "selected_answer": "In-order Traversal (Left, Root, Right)"},
            {"question_id": questions[3]["id"], "selected_answer": "2^L"},
            {"question_id": questions[4]["id"], "selected_answer": "WRONG_ANSWER"}
        ]
    }

    submit_res = client.post(
        f"/api/academic/tests/{dsa_test['id']}/submit",
        json=submit_payload,
        headers=headers
    )
    assert submit_res.status_code == 200
    result = submit_res.json()
    assert result["score"] == 2
    assert result["max_score"] == 5
    assert result["percentage"] == 40.0
    assert result["passed"] is False
    assert len(result["results"]) == 5

    # 3. Verify Topic Performance & Weak Topic detection (FR-AI-01, FR-AI-02)
    perf_res = client.get("/api/academic/student/performance", headers=headers)
    assert perf_res.status_code == 200
    performances = perf_res.json()
    assert len(performances) >= 2
    # Check that at least one topic has is_weak == True
    weak_topics = [p for p in performances if p["is_weak"]]
    assert len(weak_topics) >= 1
    assert any("Graph" in w["topic_name"] for w in weak_topics)

    # 4. Verify Recommendation Generation (FR-AI-03, FR-STU-06)
    rec_res = client.get("/api/academic/student/recommendations", headers=headers)
    assert rec_res.status_code == 200
    recommendations = rec_res.json()
    assert len(recommendations) >= 1
    rec_id = recommendations[0]["id"]

    # 5. Complete a recommendation (FR-STU-07)
    comp_res = client.post(f"/api/academic/student/recommendations/{rec_id}/complete", headers=headers)
    assert comp_res.status_code == 200
    assert comp_res.json()["status"] == "completed"

    # 6. Verify Academic Risk Evaluation (FR-AI-04, FR-AI-05)
    risk_res = client.get("/api/academic/student/risk", headers=headers)
    assert risk_res.status_code == 200
    risk = risk_res.json()
    assert risk["risk_level"] in ["MEDIUM", "HIGH"]
    assert len(risk["contributing_factors"]) >= 2


def test_teacher_class_overview_and_rbac():
    student_token = register_and_login(role="student")
    teacher_token = register_and_login(role="teacher")

    # 1. Student should be blocked from teacher overview
    student_headers = {"Authorization": f"Bearer {student_token}"}
    res = client.get("/api/academic/teacher/overview", headers=student_headers)
    assert res.status_code == 403

    # 2. Teacher should have full access to class overview (FR-TEA-01, FR-TEA-05)
    teacher_headers = {"Authorization": f"Bearer {teacher_token}"}
    res = client.get("/api/academic/teacher/overview", headers=teacher_headers)
    assert res.status_code == 200
    overview = res.json()
    assert "total_students" in overview
    assert "class_average" in overview
    assert "top_weak_topics" in overview
    assert "student_roster" in overview
