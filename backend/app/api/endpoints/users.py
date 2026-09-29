from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User, UserRole, ParentStudentLink, LinkStatus
from app.schemas.auth import UserOut, StudentProfileOut, TeacherProfileOut, ParentProfileOut, ParentStudentLinkOut
from app.api.deps import require_role, get_current_active_user

router = APIRouter()


@router.get(
    "/students/me",
    response_model=UserOut,
    summary="Student Protected Profile API",
    description="Returns current student profile details. Protected for STUDENT role."
)
def get_student_me(current_user: User = Depends(require_role([UserRole.STUDENT]))):
    return current_user


@router.get(
    "/teachers/me",
    response_model=UserOut,
    summary="Teacher Protected Profile API",
    description="Returns current teacher profile details. Protected for TEACHER role."
)
def get_teacher_me(current_user: User = Depends(require_role([UserRole.TEACHER]))):
    return current_user


@router.get(
    "/parents/me",
    response_model=UserOut,
    summary="Parent Protected Profile API",
    description="Returns current parent profile details. Protected for PARENT role."
)
def get_parent_me(current_user: User = Depends(require_role([UserRole.PARENT]))):
    return current_user


from datetime import datetime, timezone
from pydantic import BaseModel, Field
from app.models.user import StudentProfile
from app.models.academic import AssessmentAttempt, TopicPerformance
from app.services.intelligence import compute_academic_risk


class LinkStudentRequest(BaseModel):
    student_id: str = Field(..., min_length=2, max_length=50)


@router.get(
    "/parents/my-student",
    summary="Get Verified Linked Student Details",
    description="Returns academic intelligence and profile for ONLY the parent's verified linked student."
)
def get_parent_linked_student(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.PARENT]))
):
    if not current_user.parent_profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parent profile not found")

    link = (
        db.query(ParentStudentLink)
        .filter(ParentStudentLink.parent_id == current_user.parent_profile.id)
        .order_by(ParentStudentLink.created_at.desc())
        .first()
    )
    if not link:
        return {
            "linked": False,
            "status": "unlinked",
            "message": "No student is currently linked to your guardian account. Please enter your student's ID below to link."
        }

    student_profile = link.student
    if not student_profile:
        return {"linked": False, "status": "unlinked", "message": "Linked student profile could not be located."}

    student_user = student_profile.user
    if not student_user:
        return {"linked": False, "status": "unlinked", "message": "Linked student user record missing."}

    if link.status != LinkStatus.VERIFIED:
        return {
            "linked": False,
            "status": link.status.value,
            "student_id": student_profile.student_id,
            "student_name": student_user.name,
            "message": f"Link request for Student ID {student_profile.student_id} is currently {link.status.value}."
        }

    # Fetch real performance and compute academic risk for ONLY this student
    risk = compute_academic_risk(student_user.id, db)
    attempts = (
        db.query(AssessmentAttempt)
        .filter(AssessmentAttempt.student_id == student_user.id)
        .order_by(AssessmentAttempt.completed_at.desc())
        .all()
    )
    weak_topics = (
        db.query(TopicPerformance)
        .filter(TopicPerformance.student_id == student_user.id, TopicPerformance.is_weak == True)
        .all()
    )

    recent_attempts_data = [
        {
            "id": a.id,
            "assessment_id": a.assessment_id,
            "assessment_title": a.assessment.title if a.assessment else "Assessment",
            "score": a.score,
            "max_score": a.max_score,
            "percentage": a.percentage,
            "passed": a.passed,
            "completed_at": a.completed_at
        }
        for a in attempts[:5]
    ]

    weak_topics_data = [
        {
            "topic_name": wp.topic.name if wp.topic else f"Topic {wp.topic_id}",
            "mastery_percentage": wp.mastery_percentage
        }
        for wp in weak_topics
    ]

    return {
        "linked": True,
        "status": link.status.value,
        "student": {
            "id": student_user.id,
            "name": student_user.name,
            "email": student_user.email,
            "student_id": student_profile.student_id,
            "college": student_profile.college,
            "department": student_profile.department,
            "course": student_profile.course,
            "semester": student_profile.semester,
            "academic_year": student_profile.academic_year,
            "risk_level": risk.risk_level.value,
            "risk_score": risk.risk_score,
            "average_score": risk.average_assessment_score,
            "attendance_percentage": risk.attendance_percentage,
            "weak_topics_count": risk.weak_topics_count,
            "risk_reasons": risk.contributing_factors or [],
            "assessments_taken": len(attempts),
            "recent_attempts": recent_attempts_data,
            "weak_topics": weak_topics_data
        }
    }


@router.post(
    "/parents/link-student",
    summary="Link Student ID to Guardian Account",
    description="Matches the provided Student ID and links it to the parent profile."
)
def link_student_to_parent(
    payload: LinkStudentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.PARENT]))
):
    if not current_user.parent_profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parent profile not found")

    code = payload.student_id.strip().upper()
    student = db.query(StudentProfile).filter(StudentProfile.student_id == code).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No student found with Student ID '{code}'. Please verify the ID."
        )

    # Check if already linked
    existing = db.query(ParentStudentLink).filter(
        ParentStudentLink.parent_id == current_user.parent_profile.id,
        ParentStudentLink.student_id == student.id
    ).first()

    if existing:
        existing.status = LinkStatus.VERIFIED
        existing.verified_at = datetime.now(timezone.utc)
    else:
        new_link = ParentStudentLink(
            parent_id=current_user.parent_profile.id,
            student_id=student.id,
            status=LinkStatus.VERIFIED,
            verified_at=datetime.now(timezone.utc)
        )
        db.add(new_link)

    db.commit()
    return {
        "success": True,
        "message": f"Successfully matched and linked Student ID '{code}' ({student.user.name if student.user else 'Student'}).",
        "student_id": code
    }


@router.get(
    "/admin/me",
    response_model=UserOut,
    summary="Admin Protected Profile API",
    description="Returns current administrator profile. Protected for ADMIN role."
)
def get_admin_me(current_user: User = Depends(require_role([UserRole.ADMIN]))):
    return current_user


@router.get(
    "/admin/users",
    response_model=List[UserOut],
    summary="Admin User Management List API",
    description="Returns all registered users across institution. Protected for ADMIN role."
)
def list_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN]))
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users
