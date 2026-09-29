from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.models.user import User, UserRole, StudentProfile
from app.models.academic import (
    Subject, Topic, Assessment, Question, AssessmentAttempt, StudentAnswer,
    TopicPerformance, Recommendation, AcademicRiskProfile, RecommendationStatus, RiskLevel
)
from app.schemas.academic import (
    SubjectOut, AssessmentListOut, AssessmentDetailOut, AssessmentSubmitRequest,
    AssessmentResultOut, QuestionResultOut, TopicPerformanceOut, RecommendationOut,
    AcademicRiskOut, TeacherClassOverviewOut, TeacherTopWeakTopic, TeacherStudentRosterItem,
    AssessmentCreate
)
from app.api.deps import get_current_active_user, require_role
from app.services.intelligence import (
    update_student_topic_performance, refresh_recommendations, compute_academic_risk
)

router = APIRouter()


@router.get("/subjects", response_model=List[SubjectOut], summary="List all academic curriculum subjects")
def get_subjects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    subjects = db.query(Subject).all()
    return subjects


@router.get("/tests", response_model=List[AssessmentListOut], summary="List available assessments with student progress")
def get_assessments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Assessment)

    # Scoping tests by college tenancy:
    # 1. Students see their college's tests + global/foundational tests (college is None)
    # 2. Teachers see their college's tests + global tests
    # 3. Admins see all tests across all institutions
    if current_user.role == UserRole.STUDENT and current_user.student_profile and current_user.student_profile.college:
        student_college = current_user.student_profile.college
        query = query.filter(
            or_(
                Assessment.college.ilike(student_college),
                Assessment.college.is_(None)
            )
        )
    elif current_user.role == UserRole.TEACHER and current_user.teacher_profile and current_user.teacher_profile.college:
        teacher_college = current_user.teacher_profile.college
        query = query.filter(
            or_(
                Assessment.college.ilike(teacher_college),
                Assessment.college.is_(None)
            )
        )

    assessments = query.all()
    results = []

    for a in assessments:
        # Find student's previous attempts for this assessment
        latest_attempt = (
            db.query(AssessmentAttempt)
            .filter(
                AssessmentAttempt.student_id == current_user.id,
                AssessmentAttempt.assessment_id == a.id
            )
            .order_by(AssessmentAttempt.completed_at.desc())
            .first()
        )
        attempts_count = (
            db.query(AssessmentAttempt)
            .filter(
                AssessmentAttempt.student_id == current_user.id,
                AssessmentAttempt.assessment_id == a.id
            )
            .count()
        )

        results.append(AssessmentListOut(
            id=a.id,
            subject_id=a.subject_id,
            subject_name=a.subject.name if a.subject else "General",
            subject_code=a.subject.code if a.subject else "GEN",
            title=a.title,
            description=a.description,
            time_limit_minutes=a.time_limit_minutes,
            total_questions=len(a.questions),
            passing_percentage=a.passing_percentage,
            last_score=latest_attempt.percentage if latest_attempt else None,
            attempts_count=attempts_count,
            college=a.college,
            created_by_id=a.created_by_id
        ))

    return results


@router.get("/tests/{assessment_id}", response_model=AssessmentDetailOut, summary="Get assessment questions for taking test")
def get_assessment_detail(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    return AssessmentDetailOut(
        id=assessment.id,
        subject_id=assessment.subject_id,
        title=assessment.title,
        description=assessment.description,
        time_limit_minutes=assessment.time_limit_minutes,
        total_questions=len(assessment.questions),
        passing_percentage=assessment.passing_percentage,
        college=assessment.college,
        created_by_id=assessment.created_by_id,
        questions=assessment.questions
    )


@router.post("/tests/{assessment_id}/submit", response_model=AssessmentResultOut, summary="Submit test answers, auto-grade, and update learning intelligence")
def submit_assessment(
    assessment_id: int,
    payload: AssessmentSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )

    # Build question lookup
    questions_map = {q.id: q for q in assessment.questions}
    submitted_answers_map = {ans.question_id: ans.selected_answer for ans in payload.answers}

    total_score = 0
    max_score = sum(q.points for q in assessment.questions)
    question_results = []
    student_answers_to_record = []

    # Create AssessmentAttempt
    attempt = AssessmentAttempt(
        student_id=current_user.id,
        assessment_id=assessment.id,
        score=0,
        max_score=max_score,
        percentage=0.0,
        passed=False,
        completed_at=datetime.now(timezone.utc)
    )
    db.add(attempt)
    db.flush()

    for q in assessment.questions:
        selected = submitted_answers_map.get(q.id)
        is_correct = bool(selected and selected.strip().lower() == q.correct_answer.strip().lower())

        if is_correct:
            total_score += q.points

        ans_record = StudentAnswer(
            attempt_id=attempt.id,
            question_id=q.id,
            topic_id=q.topic_id,
            selected_answer=selected,
            is_correct=is_correct
        )
        student_answers_to_record.append(ans_record)
        db.add(ans_record)

        topic_name = q.topic.name if q.topic else "General"
        question_results.append(QuestionResultOut(
            question_id=q.id,
            question_text=q.question_text,
            topic_name=topic_name,
            selected_answer=selected,
            correct_answer=q.correct_answer,
            is_correct=is_correct,
            explanation=q.explanation
        ))

    # Calculate final score and pass/fail
    percentage = round((total_score / max_score) * 100, 1) if max_score > 0 else 0.0
    passed = percentage >= assessment.passing_percentage

    attempt.score = total_score
    attempt.percentage = percentage
    attempt.passed = passed
    db.commit()

    # Trigger Learning Intelligence pipeline:
    # 1. Update topic-level performance
    update_student_topic_performance(current_user.id, db)
    # 2. Refresh personalized recommendations based on weak areas
    refresh_recommendations(current_user.id, db)
    # 3. Compute explainable academic risk
    compute_academic_risk(current_user.id, db)

    return AssessmentResultOut(
        attempt_id=attempt.id,
        assessment_id=assessment.id,
        assessment_title=assessment.title,
        score=total_score,
        max_score=max_score,
        percentage=percentage,
        passed=passed,
        completed_at=attempt.completed_at,
        results=question_results
    )


@router.get("/student/performance", response_model=List[TopicPerformanceOut], summary="Get topic-level performance matrix")
def get_student_topic_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    performances = (
        db.query(TopicPerformance)
        .filter(TopicPerformance.student_id == current_user.id)
        .all()
    )

    out = []
    for p in performances:
        if p.mastery_percentage >= 80.0:
            status_label = "mastered"
        elif p.mastery_percentage >= 60.0:
            status_label = "moderate"
        else:
            status_label = "weak"

        out.append(TopicPerformanceOut(
            id=p.id,
            topic_id=p.topic_id,
            topic_name=p.topic.name if p.topic else "Topic",
            topic_code=p.topic.code if p.topic else "TOPIC",
            subject_name=p.topic.subject.name if (p.topic and p.topic.subject) else "Curriculum",
            total_questions_attempted=p.total_questions_attempted,
            correct_answers=p.correct_answers,
            mastery_percentage=p.mastery_percentage,
            is_weak=p.is_weak,
            status=status_label
        ))

    return out


@router.get("/student/recommendations", response_model=List[RecommendationOut], summary="Get targeted learning recommendations")
def get_student_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Ensure recommendations are up to date
    recs = refresh_recommendations(current_user.id, db)
    return recs


@router.post("/student/recommendations/{recommendation_id}/complete", response_model=RecommendationOut, summary="Mark recommendation completed")
def complete_recommendation(
    recommendation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    rec = (
        db.query(Recommendation)
        .filter(
            Recommendation.id == recommendation_id,
            Recommendation.student_id == current_user.id
        )
        .first()
    )
    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recommendation not found")

    rec.status = RecommendationStatus.COMPLETED
    rec.completed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(rec)
    return rec


@router.get("/student/risk", response_model=AcademicRiskOut, summary="Get explainable academic risk profile")
def get_student_risk(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    profile = compute_academic_risk(current_user.id, db)
    return profile


@router.get("/teacher/overview", response_model=TeacherClassOverviewOut, summary="Get institutional class overview for educators")
def get_teacher_class_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.TEACHER, UserRole.ADMIN]))
):
    teacher_college = None
    if current_user.role == UserRole.TEACHER and current_user.teacher_profile:
        teacher_college = current_user.teacher_profile.college

    # Filter students by college tenancy (Teachers see only their own college's students)
    student_query = db.query(User).filter(User.role == UserRole.STUDENT)
    if teacher_college:
        student_query = student_query.filter(User.student_profile.has(StudentProfile.college.ilike(teacher_college)))

    students = student_query.all()
    total_students = len(students)
    student_ids = [s.id for s in students]

    # Class average and total attempts scoped to the institution's students
    if student_ids:
        attempts = db.query(AssessmentAttempt).filter(AssessmentAttempt.student_id.in_(student_ids)).all()
    else:
        attempts = []
    total_attempts = len(attempts)
    class_average = round(sum(a.percentage for a in attempts) / total_attempts, 1) if total_attempts > 0 else 0.0

    # At-risk students count and student roster
    at_risk_count = 0
    student_roster = []

    for s in students:
        risk = compute_academic_risk(s.id, db)
        if risk.risk_level in [RiskLevel.MEDIUM, RiskLevel.HIGH]:
            at_risk_count += 1

        student_code = s.student_profile.student_id if s.student_profile else f"STU-{s.id}"
        college_name = s.student_profile.college if s.student_profile else teacher_college
        dept_name = s.student_profile.department if s.student_profile else None

        student_roster.append(TeacherStudentRosterItem(
            student_id=s.id,
            student_code=student_code,
            name=s.name,
            email=s.email,
            risk_level=risk.risk_level.value,
            risk_score=risk.risk_score,
            average_score=risk.average_assessment_score,
            weak_topics_count=risk.weak_topics_count,
            college=college_name,
            department=dept_name,
            last_active=s.last_login
        ))

    # Calculate top weak topics across this institution's students
    if student_ids:
        all_weak_perfs = (
            db.query(TopicPerformance)
            .filter(TopicPerformance.is_weak == True, TopicPerformance.student_id.in_(student_ids))
            .all()
        )
    else:
        all_weak_perfs = []

    topic_weak_map = {}
    for wp in all_weak_perfs:
        if wp.topic_id not in topic_weak_map:
            topic = db.query(Topic).filter(Topic.id == wp.topic_id).first()
            topic_name = topic.name if topic else f"Topic {wp.topic_id}"
            subject_name = topic.subject.name if (topic and topic.subject) else "Curriculum"
            topic_weak_map[wp.topic_id] = {
                "name": topic_name,
                "subject": subject_name,
                "count": 0,
                "masteries": []
            }
        topic_weak_map[wp.topic_id]["count"] += 1
        topic_weak_map[wp.topic_id]["masteries"].append(wp.mastery_percentage)

    top_weak_topics = []
    for data in sorted(topic_weak_map.values(), key=lambda x: x["count"], reverse=True)[:5]:
        avg_m = round(sum(data["masteries"]) / len(data["masteries"]), 1) if data["masteries"] else 0.0
        top_weak_topics.append(TeacherTopWeakTopic(
            topic_name=data["name"],
            subject_name=data["subject"],
            students_struggling_count=data["count"],
            average_mastery=avg_m
        ))

    return TeacherClassOverviewOut(
        total_students=total_students,
        class_average=class_average,
        total_assessments_taken=total_attempts,
        at_risk_count=at_risk_count,
        college=teacher_college or "All Institutions",
        top_weak_topics=top_weak_topics,
        student_roster=student_roster
    )


@router.post("/teacher/tests", status_code=status.HTTP_201_CREATED, summary="Create a new assessment with topic-mapped MCQs")
def create_assessment(
    payload: AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.TEACHER, UserRole.ADMIN]))
):
    subject = db.query(Subject).filter(Subject.id == payload.subject_id).first()
    if not subject:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found")

    teacher_college = None
    if current_user.teacher_profile:
        teacher_college = current_user.teacher_profile.college

    assessment = Assessment(
        subject_id=payload.subject_id,
        title=payload.title,
        description=payload.description,
        time_limit_minutes=payload.time_limit_minutes,
        passing_percentage=payload.passing_percentage,
        college=teacher_college,
        created_by_id=current_user.id
    )
    db.add(assessment)
    db.flush()

    for q_data in payload.questions:
        q = Question(
            assessment_id=assessment.id,
            topic_id=q_data.topic_id,
            question_text=q_data.question_text,
            options=q_data.options,
            correct_answer=q_data.correct_answer,
            explanation=q_data.explanation,
            points=q_data.points
        )
        db.add(q)

    db.commit()
    db.refresh(assessment)
    return {"message": "Assessment created successfully", "assessment_id": assessment.id}
