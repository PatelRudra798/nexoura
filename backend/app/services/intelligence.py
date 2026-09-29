import logging
from datetime import datetime, timezone
from typing import List, Tuple
from sqlalchemy.orm import Session

from app.models.academic import (
    Topic, TopicPerformance, Recommendation, AcademicRiskProfile,
    AssessmentAttempt, StudentAnswer, RiskLevel, RecommendationStatus
)
from app.models.user import User

logger = logging.getLogger("nexoura.intelligence")

# R&D Plan Configurable Constants
WEAK_TOPIC_THRESHOLD = 60.0  # Mastery below 60% considered weak
MASTERY_THRESHOLD = 80.0    # Mastery at or above 80% considered strong/optimal


def update_student_topic_performance(
    student_id: int,
    db: Session
) -> List[TopicPerformance]:
    """
    R&D Plan §4: Calculates topic-level performance across all student attempts.
    Uses topic-weighted performance and flags weak topics.
    """
    # Fetch all answers submitted by this student
    all_answers = (
        db.query(StudentAnswer)
        .join(AssessmentAttempt, StudentAnswer.attempt_id == AssessmentAttempt.id)
        .filter(AssessmentAttempt.student_id == student_id)
        .all()
    )

    if not all_answers:
        return []

    # Group answers by topic
    topic_data = {}
    for ans in all_answers:
        if ans.topic_id not in topic_data:
            topic_data[ans.topic_id] = {"total": 0, "correct": 0}
        topic_data[ans.topic_id]["total"] += 1
        if ans.is_correct:
            topic_data[ans.topic_id]["correct"] += 1

    updated_performances = []
    for topic_id, stats in topic_data.items():
        total = stats["total"]
        correct = stats["correct"]
        mastery = round((correct / total) * 100, 1) if total > 0 else 0.0
        is_weak = mastery < WEAK_TOPIC_THRESHOLD

        perf = (
            db.query(TopicPerformance)
            .filter(
                TopicPerformance.student_id == student_id,
                TopicPerformance.topic_id == topic_id
            )
            .first()
        )

        if not perf:
            perf = TopicPerformance(
                student_id=student_id,
                topic_id=topic_id,
                total_questions_attempted=total,
                correct_answers=correct,
                mastery_percentage=mastery,
                is_weak=is_weak,
                last_attempted_at=datetime.now(timezone.utc)
            )
            db.add(perf)
        else:
            perf.total_questions_attempted = total
            perf.correct_answers = correct
            perf.mastery_percentage = mastery
            perf.is_weak = is_weak
            perf.last_attempted_at = datetime.now(timezone.utc)

        updated_performances.append(perf)

    db.commit()
    return updated_performances


def refresh_recommendations(
    student_id: int,
    db: Session
) -> List[Recommendation]:
    """
    R&D Plan §5 & FR-AI-03: Rule-based recommendation baseline.
    Generates actionable guidance linked directly to identified weak topics.
    """
    weak_performances = (
        db.query(TopicPerformance)
        .filter(
            TopicPerformance.student_id == student_id,
            TopicPerformance.is_weak == True
        )
        .all()
    )

    existing_active_recs = (
        db.query(Recommendation)
        .filter(
            Recommendation.student_id == student_id,
            Recommendation.status == RecommendationStatus.PENDING
        )
        .all()
    )
    existing_topic_ids = {r.topic_id for r in existing_active_recs if r.topic_id}

    for perf in weak_performances:
        if perf.topic_id in existing_topic_ids:
            continue

        topic = db.query(Topic).filter(Topic.id == perf.topic_id).first()
        if not topic:
            continue

        subject_name = topic.subject.name if topic.subject else "General Curriculum"
        priority = "high" if perf.mastery_percentage < 40.0 else "medium"

        # Construct specific actionable tasks
        title = f"Revise & Practice: {topic.name}"
        description = (
            f"Current mastery in {topic.name} is {perf.mastery_percentage}%. "
            f"Review fundamental principles and attempt targeted practice questions to solidify understanding."
        )

        rec = Recommendation(
            student_id=student_id,
            topic_id=topic.id,
            title=title,
            description=description,
            action_type="practice",
            subject_name=subject_name,
            estimated_time="15-20 mins",
            priority=priority,
            status=RecommendationStatus.PENDING
        )
        db.add(rec)

    # If no weak topics exist, offer an enrichment recommendation
    if not weak_performances and not existing_active_recs:
        db.add(Recommendation(
            student_id=student_id,
            topic_id=None,
            title="Sustain Optimal Mastery: Advanced Exploration",
            description="All evaluated topics are currently performing above the 60% threshold. Challenge yourself with complex application problems.",
            action_type="enrichment",
            subject_name="Computer Science Core",
            estimated_time="25 mins",
            priority="low",
            status=RecommendationStatus.PENDING
        ))

    db.commit()

    return (
        db.query(Recommendation)
        .filter(
            Recommendation.student_id == student_id,
            Recommendation.status == RecommendationStatus.PENDING
        )
        .order_by(Recommendation.created_at.desc())
        .all()
    )


def compute_academic_risk(
    student_id: int,
    db: Session
) -> AcademicRiskProfile:
    """
    R&D Plan §3 & FR-AI-04/05: Explainable academic risk indicator.
    Combines assessment performance, weak topic density, and attendance.
    Generates human-readable contributing factors.
    """
    # 1. Assessment attempts
    attempts = (
        db.query(AssessmentAttempt)
        .filter(AssessmentAttempt.student_id == student_id)
        .all()
    )

    if attempts:
        avg_score = round(sum(a.percentage for a in attempts) / len(attempts), 1)
    else:
        avg_score = 75.0  # Default initial baseline

    # 2. Weak topics count
    weak_count = (
        db.query(TopicPerformance)
        .filter(
            TopicPerformance.student_id == student_id,
            TopicPerformance.is_weak == True
        )
        .count()
    )

    # 3. Existing risk profile or default
    risk_profile = (
        db.query(AcademicRiskProfile)
        .filter(AcademicRiskProfile.student_id == student_id)
        .first()
    )

    attendance = risk_profile.attendance_percentage if risk_profile else 88.0

    # Risk scoring calculation (0 to 100)
    # Higher score = higher risk
    risk_score = 10.0
    contributing_factors = []

    # Assessment score factor
    if avg_score < 50.0:
        risk_score += 45.0
        contributing_factors.append(f"Critical assessment average ({avg_score}%) falls below pass threshold.")
    elif avg_score < 65.0:
        risk_score += 25.0
        contributing_factors.append(f"Moderate assessment performance ({avg_score}%) indicates potential exam vulnerability.")
    else:
        contributing_factors.append(f"Satisfactory assessment average ({avg_score}%).")

    # Weak topic density factor
    if weak_count >= 3:
        risk_score += 35.0
        contributing_factors.append(f"High concentration of learning friction: {weak_count} topics flagged as weak (<60% mastery).")
    elif weak_count >= 1:
        risk_score += 15.0
        contributing_factors.append(f"{weak_count} topic(s) currently require targeted remedial practice.")
    else:
        contributing_factors.append("No active weak learning topics detected.")

    # Attendance factor
    if attendance < 75.0:
        risk_score += 25.0
        contributing_factors.append(f"Institutional attendance warning: Attendance at {attendance}% is below 75% requirement.")
    else:
        contributing_factors.append(f"Attendance is within healthy academic standards ({attendance}%).")

    # Cap score
    risk_score = min(100.0, max(0.0, risk_score))

    # Risk classification
    if risk_score >= 60.0:
        risk_level = RiskLevel.HIGH
    elif risk_score >= 35.0:
        risk_level = RiskLevel.MEDIUM
    else:
        risk_level = RiskLevel.LOW

    if not risk_profile:
        risk_profile = AcademicRiskProfile(
            student_id=student_id,
            risk_level=risk_level,
            risk_score=risk_score,
            attendance_percentage=attendance,
            average_assessment_score=avg_score,
            weak_topics_count=weak_count,
            contributing_factors=contributing_factors,
            last_evaluated_at=datetime.now(timezone.utc)
        )
        db.add(risk_profile)
    else:
        risk_profile.risk_level = risk_level
        risk_profile.risk_score = risk_score
        risk_profile.attendance_percentage = attendance
        risk_profile.average_assessment_score = avg_score
        risk_profile.weak_topics_count = weak_count
        risk_profile.contributing_factors = contributing_factors
        risk_profile.last_evaluated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(risk_profile)
    return risk_profile
