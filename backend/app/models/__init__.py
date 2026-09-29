from app.core.database import Base
from app.models.user import User, StudentProfile, TeacherProfile, ParentProfile, ParentStudentLink, AuditLog, UserRole, LinkStatus
from app.models.academic import (
    Subject, Topic, Assessment, Question, AssessmentAttempt, StudentAnswer,
    TopicPerformance, Recommendation, AcademicRiskProfile, RiskLevel, RecommendationStatus
)

__all__ = [
    "Base",
    "User",
    "StudentProfile",
    "TeacherProfile",
    "ParentProfile",
    "ParentStudentLink",
    "AuditLog",
    "UserRole",
    "LinkStatus",
    "Subject",
    "Topic",
    "Assessment",
    "Question",
    "AssessmentAttempt",
    "StudentAnswer",
    "TopicPerformance",
    "Recommendation",
    "AcademicRiskProfile",
    "RiskLevel",
    "RecommendationStatus"
]
