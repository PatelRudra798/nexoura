from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, model_validator
from app.models.user import UserRole, LinkStatus


# Base Register Request
class BaseRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    confirm_password: str = Field(..., min_length=6, max_length=100)

    @model_validator(mode="after")
    def passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match.")
        return self


# Student Registration
class StudentRegister(BaseRegister):
    student_id: str = Field(..., min_length=2, max_length=50)
    college: Optional[str] = Field(default="NEXOURA Institute of Technology", max_length=150)
    department: str = Field(..., min_length=2, max_length=100)
    course: str = Field(..., min_length=2, max_length=100)
    semester: int = Field(default=1, ge=1, le=12)


# Teacher Registration
class TeacherRegister(BaseRegister):
    employee_id: str = Field(..., min_length=2, max_length=50)
    college: Optional[str] = Field(default="NEXOURA Institute of Technology", max_length=150)
    department: str = Field(..., min_length=2, max_length=100)
    designation: Optional[str] = "Assistant Professor"


# Parent Registration
class ParentRegister(BaseRegister):
    college: Optional[str] = Field(default="NEXOURA Institute of Technology", max_length=150)
    contact_number: Optional[str] = Field(default=None, max_length=30)


# Login Request
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Profile Schemas
class StudentProfileOut(BaseModel):
    id: int
    student_id: str
    college: str = "NEXOURA Institute of Technology"
    department: str
    course: str
    semester: int
    academic_year: str

    model_config = {"from_attributes": True}


class TeacherProfileOut(BaseModel):
    id: int
    employee_id: str
    college: str = "NEXOURA Institute of Technology"
    department: str
    designation: str

    model_config = {"from_attributes": True}


class ParentProfileOut(BaseModel):
    id: int
    parent_id: str
    college: str = "NEXOURA Institute of Technology"
    contact_number: Optional[str] = None

    model_config = {"from_attributes": True}


# User Schemas
class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    student_profile: Optional[StudentProfileOut] = None
    teacher_profile: Optional[TeacherProfileOut] = None
    parent_profile: Optional[ParentProfileOut] = None

    model_config = {"from_attributes": True}


# Token Response Schema
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# Parent-Student Link Schema
class ParentStudentLinkOut(BaseModel):
    id: int
    parent_id: int
    student_id: int
    status: LinkStatus
    created_at: datetime
    student: Optional[StudentProfileOut] = None

    model_config = {"from_attributes": True}
