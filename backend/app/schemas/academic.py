from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field


# Topic Schemas
class TopicOut(BaseModel):
    id: int
    subject_id: int
    code: str
    name: str
    description: Optional[str] = None

    model_config = {"from_attributes": True}


# Subject Schemas
class SubjectOut(BaseModel):
    id: int
    code: str
    name: str
    department: str
    semester: int
    description: Optional[str] = None
    topics: List[TopicOut] = []

    model_config = {"from_attributes": True}


# Question for Students (Safe view without answers)
class QuestionStudentView(BaseModel):
    id: int
    topic_id: int
    question_text: str
    options: List[str]
    points: int = 1

    model_config = {"from_attributes": True}


# Assessment Schemas
class AssessmentListOut(BaseModel):
    id: int
    subject_id: int
    subject_name: str
    subject_code: str
    title: str
    description: Optional[str] = None
    time_limit_minutes: int
    total_questions: int
    passing_percentage: float
    last_score: Optional[float] = None
    attempts_count: int = 0
    college: Optional[str] = None
    created_by_id: Optional[int] = None

    model_config = {"from_attributes": True}


class AssessmentDetailOut(BaseModel):
    id: int
    subject_id: int
    title: str
    description: Optional[str] = None
    time_limit_minutes: int
    total_questions: int
    passing_percentage: float
    college: Optional[str] = None
    created_by_id: Optional[int] = None
    questions: List[QuestionStudentView] = []

    model_config = {"from_attributes": True}


# Assessment Submission
class AnswerSubmit(BaseModel):
    question_id: int
    selected_answer: str


class AssessmentSubmitRequest(BaseModel):
    answers: List[AnswerSubmit]


class QuestionResultOut(BaseModel):
    question_id: int
    question_text: str
    topic_name: str
    selected_answer: Optional[str] = None
    correct_answer: str
    is_correct: bool
    explanation: Optional[str] = None


class AssessmentResultOut(BaseModel):
    attempt_id: int
    assessment_id: int
    assessment_title: str
    score: int
    max_score: int
    percentage: float
    passed: bool
    completed_at: datetime
    results: List[QuestionResultOut] = []


# Topic Performance Schemas
class TopicPerformanceOut(BaseModel):
    id: int
    topic_id: int
    topic_name: str
    topic_code: str
    subject_name: str
    total_questions_attempted: int
    correct_answers: int
    mastery_percentage: float
    is_weak: bool
    status: str  # 'mastered' (>=80), 'moderate' (60-79), 'weak' (<60)

    model_config = {"from_attributes": True}


# Recommendation Schemas
class RecommendationOut(BaseModel):
    id: int
    title: str
    description: str
    action_type: str
    subject_name: Optional[str] = None
    estimated_time: str
    priority: str
    status: str
    topic_id: Optional[int] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# Academic Risk Schemas
class AcademicRiskOut(BaseModel):
    risk_level: str
    risk_score: float
    attendance_percentage: float
    average_assessment_score: float
    weak_topics_count: int
    contributing_factors: List[str] = []
    last_evaluated_at: datetime

    model_config = {"from_attributes": True}


# Teacher Overview Schemas
class TeacherTopWeakTopic(BaseModel):
    topic_name: str
    subject_name: str
    students_struggling_count: int
    average_mastery: float


class TeacherStudentRosterItem(BaseModel):
    student_id: int
    student_code: str
    name: str
    email: str
    risk_level: str
    risk_score: float
    average_score: float
    weak_topics_count: int
    college: Optional[str] = None
    department: Optional[str] = None
    last_active: Optional[datetime] = None


class TeacherClassOverviewOut(BaseModel):
    total_students: int
    class_average: float
    total_assessments_taken: int
    at_risk_count: int
    college: Optional[str] = None
    top_weak_topics: List[TeacherTopWeakTopic] = []
    student_roster: List[TeacherStudentRosterItem] = []


# Teacher Test Creation
class QuestionCreate(BaseModel):
    topic_id: int
    question_text: str
    options: List[str]
    correct_answer: str
    explanation: Optional[str] = None
    points: int = 1


class AssessmentCreate(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = None
    time_limit_minutes: int = 15
    passing_percentage: float = 60.0
    questions: List[QuestionCreate]
