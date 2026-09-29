import enum
from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Enum, ForeignKey, Date, Text
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    PARENT = "parent"
    ADMIN = "admin"


class LinkStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    teacher_profile = relationship("TeacherProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    parent_profile = relationship("ParentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    student_id = Column(String(50), index=True, nullable=False)
    college = Column(String(150), default="NEXOURA Institute of Technology", nullable=False)
    department = Column(String(100), nullable=False)
    course = Column(String(100), nullable=False)
    semester = Column(Integer, default=1, nullable=False)
    academic_year = Column(String(20), default="2025-2026", nullable=False)
    date_of_joining = Column(Date, nullable=True)

    # Relationship back to User
    user = relationship("User", back_populates="student_profile")
    parent_links = relationship("ParentStudentLink", back_populates="student", cascade="all, delete-orphan")


class TeacherProfile(Base):
    __tablename__ = "teacher_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    employee_id = Column(String(50), index=True, nullable=False)
    college = Column(String(150), default="NEXOURA Institute of Technology", nullable=False)
    department = Column(String(100), nullable=False)
    designation = Column(String(100), default="Assistant Professor", nullable=False)

    # Relationship back to User
    user = relationship("User", back_populates="teacher_profile")


class ParentProfile(Base):
    __tablename__ = "parent_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    parent_id = Column(String(50), index=True, nullable=False)
    college = Column(String(150), default="NEXOURA Institute of Technology", nullable=False)
    contact_number = Column(String(30), nullable=True)

    # Relationship back to User
    user = relationship("User", back_populates="parent_profile")
    student_links = relationship("ParentStudentLink", back_populates="parent", cascade="all, delete-orphan")


class ParentStudentLink(Base):
    __tablename__ = "parent_student_links"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("parent_profiles.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(LinkStatus), default=LinkStatus.PENDING, nullable=False)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    parent = relationship("ParentProfile", back_populates="student_links")
    student = relationship("StudentProfile", back_populates="parent_links")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    event_type = Column(String(50), nullable=False)  # LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, etc.
    details = Column(String(255), nullable=True)
    ip_address = Column(String(45), nullable=True)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
