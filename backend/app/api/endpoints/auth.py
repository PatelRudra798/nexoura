import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import (
    User, UserRole, StudentProfile, TeacherProfile, ParentProfile, AuditLog
)
from app.schemas.auth import (
    StudentRegister, TeacherRegister, ParentRegister, LoginRequest, TokenResponse, UserOut
)
from app.api.deps import get_current_active_user

router = APIRouter()


@router.post(
    "/register/student",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new Student Account"
)
def register_student(payload: StudentRegister, db: Session = Depends(get_db)):
    # Check duplicate email globally across the platform
    if db.query(User).filter(User.email == payload.email.lower()).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists."
        )
    
    college_name = (payload.college or "NEXOURA Institute of Technology").strip()

    # Check duplicate student_id within the same college / institution
    existing_student = db.query(StudentProfile).filter(
        StudentProfile.student_id == payload.student_id.upper(),
        StudentProfile.college.ilike(college_name)
    ).first()
    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Student ID '{payload.student_id.upper()}' is already registered in {college_name}."
        )

    # Create User
    new_user = User(
        name=payload.name,
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        role=UserRole.STUDENT,
        is_active=True
    )
    db.add(new_user)
    db.flush()

    # Create Student Profile with College Tenancy
    student_profile = StudentProfile(
        user_id=new_user.id,
        student_id=payload.student_id.upper(),
        college=college_name,
        department=payload.department,
        course=payload.course,
        semester=payload.semester
    )
    db.add(student_profile)

    # Log Audit Event
    audit = AuditLog(user_id=new_user.id, event_type="REGISTER_STUDENT", details=f"Student profile created for {payload.student_id} at {college_name}")
    db.add(audit)

    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(subject=new_user.id, role=new_user.role.value)
    return TokenResponse(access_token=access_token, user=new_user)


@router.post(
    "/register/teacher",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new Teacher Account"
)
def register_teacher(payload: TeacherRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email.lower()).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists."
        )

    college_name = (payload.college or "NEXOURA Institute of Technology").strip()

    # Check duplicate employee_id within the same college / institution
    existing_teacher = db.query(TeacherProfile).filter(
        TeacherProfile.employee_id == payload.employee_id.upper(),
        TeacherProfile.college.ilike(college_name)
    ).first()
    if existing_teacher:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Teacher Employee ID '{payload.employee_id.upper()}' is already registered in {college_name}."
        )

    new_user = User(
        name=payload.name,
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        role=UserRole.TEACHER,
        is_active=True
    )
    db.add(new_user)
    db.flush()

    teacher_profile = TeacherProfile(
        user_id=new_user.id,
        employee_id=payload.employee_id.upper(),
        college=college_name,
        department=payload.department,
        designation=payload.designation or "Assistant Professor"
    )
    db.add(teacher_profile)

    audit = AuditLog(user_id=new_user.id, event_type="REGISTER_TEACHER", details=f"Teacher profile created for {payload.employee_id} at {college_name}")
    db.add(audit)

    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(subject=new_user.id, role=new_user.role.value)
    return TokenResponse(access_token=access_token, user=new_user)


@router.post(
    "/register/parent",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new Parent Account"
)
def register_parent(payload: ParentRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email.lower()).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists."
        )

    college_name = (payload.college or "NEXOURA Institute of Technology").strip()

    new_user = User(
        name=payload.name,
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        role=UserRole.PARENT,
        is_active=True
    )
    db.add(new_user)
    db.flush()

    parent_code = f"PRT-{uuid.uuid4().hex[:6].upper()}"
    parent_profile = ParentProfile(
        user_id=new_user.id,
        parent_id=parent_code,
        college=college_name,
        contact_number=payload.contact_number
    )
    db.add(parent_profile)

    audit = AuditLog(user_id=new_user.id, event_type="REGISTER_PARENT", details=f"Parent profile created with ID {parent_code} at {college_name}")
    db.add(audit)

    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(subject=new_user.id, role=new_user.role.value)
    return TokenResponse(access_token=access_token, user=new_user)


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user and return JWT Access Token"
)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()

    # Generic authentication failure message (prevents account enumeration)
    if not user or not verify_password(payload.password, user.password_hash):
        if user:
            db.add(AuditLog(user_id=user.id, event_type="LOGIN_FAILED", details="Incorrect password attempt"))
            db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account has been deactivated."
        )

    # Update last login timestamp
    user.last_login = datetime.now(timezone.utc)
    db.add(AuditLog(user_id=user.id, event_type="LOGIN_SUCCESS", details="Successful authentication"))
    db.commit()
    db.refresh(user)

    access_token = create_access_token(subject=user.id, role=user.role.value)
    return TokenResponse(access_token=access_token, user=user)


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Logout current authenticated user"
)
def logout(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    db.add(AuditLog(user_id=current_user.id, event_type="LOGOUT", details="User signed out"))
    db.commit()
    return {"message": "Successfully signed out."}


@router.get(
    "/me",
    response_model=UserOut,
    status_code=status.HTTP_200_OK,
    summary="Fetch profile of current authenticated user"
)
def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    return current_user
