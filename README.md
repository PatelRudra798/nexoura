# NEXOURA — Smart Education & Student Guidance Platform

**College PBL Project — Phase 2: Authentication, User Roles & Access Control**

NEXOURA is an intelligent, university-grade platform engineered to assess student academic performance, identify learning friction points, guide continuous skill progression, enforce role-based institutional access control, and navigate long-term career trajectories.

---

## 1. Project Objective

Phase 2 introduces a complete, production-ready authentication and Role-Based Access Control (RBAC) system for four primary institutional roles:
1. **Student** (`/student/dashboard`)
2. **Teacher** (`/teacher/dashboard`)
3. **Parent** (`/parent/dashboard`)
4. **Administrator** (`/admin/dashboard`)

Security parameters include bcrypt password hashing, JWT bearer token verification, role-specific profile models (`StudentProfile`, `TeacherProfile`, `ParentProfile`, `ParentStudentLink`), and automated pytest security test coverage.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v3 (NEXOURA Academic Palette)
- **Routing:** React Router DOM v6
- **Context & Security:** `AuthContext` with persistent JWT token validation
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **ORM & Models:** SQLAlchemy 2.0 (User, StudentProfile, TeacherProfile, ParentProfile, ParentStudentLink, AuditLog)
- **Security & Hashing:** Direct `bcrypt` password hashing & `pyjwt` signed tokens
- **Validation:** Pydantic & Pydantic Settings
- **Server:** Uvicorn

### Database
- **Engine:** PostgreSQL (with standby fallback for local development)

### Development & DevOps
- **CLI Bootstrapping:** `seed_admin.py` for controlled superadmin creation
- **Testing:** Pytest for authentication & RBAC integration testing
- **Containerization:** Docker & Docker Compose

---

## 3. Directory Structure

```
smart-education-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                   # Reusable UI Primitives (Button, Badge, Timeline, RecommendationCard)
│   │   │   ├── Navbar.jsx            # NEXOURA Header with User Menu & Live API Monitor
│   │   │   ├── UserMenu.jsx          # Reusable User Profile & Logout Dropdown
│   │   │   └── ProtectedRoute.jsx    # Auth & Role-Based Route Guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth Provider for JWT & Session State
│   │   ├── pages/
│   │   │   ├── Home.jsx              # NEXOURA Platform Overview
│   │   │   ├── Login.jsx             # NEXOURA Institutional Sign In Page
│   │   │   ├── Register.jsx          # Role Registration (Student, Teacher, Parent)
│   │   │   └── dashboards/
│   │   │       ├── StudentDashboard.jsx  # Student Workspace (/student/dashboard)
│   │   │       ├── TeacherDashboard.jsx  # Teacher Workspace (/teacher/dashboard)
│   │   │       ├── ParentDashboard.jsx   # Parent Workspace (/parent/dashboard)
│   │   │       └── AdminDashboard.jsx    # Admin Workspace (/admin/dashboard)
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx        # Responsive Academic Layout Shell
│   │   ├── services/
│   │   │   └── api.js                # Centralized Axios/Fetch API Client
│   │   ├── App.jsx                   # React Router & Role Guard Routes
│   │   └── main.jsx                  # Application Entrypoint
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py               # Security Dependencies & RBAC Checks
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py           # Registration & JWT Authentication API
│   │   │   │   ├── users.py          # Protected Role Endpoints
│   │   │   │   └── health.py         # GET /api/health Endpoint
│   │   │   └── router.py             # APIRouter Aggregator
│   │   ├── core/
│   │   │   ├── config.py             # Pydantic Settings & JWT Config
│   │   │   ├── security.py           # Bcrypt Hashing & JWT Token Encoding/Decoding
│   │   │   └── database.py           # SQLAlchemy Engine & DB Health Check
│   │   ├── models/
│   │   │   ├── base.py
│   │   │   └── user.py               # User, Student, Teacher, Parent, Link & Audit Models
│   │   ├── schemas/
│   │   │   ├── auth.py               # Auth & Registration Pydantic Schemas
│   │   │   └── health.py             # Health Response Schema
│   │   └── main.py                   # FastAPI Application Entrypoint
│   ├── seed_admin.py                 # Controlled Admin Seeding Script
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
├── docs/
│   └── architecture.md               # NEXOURA System Architecture Document
├── database/
│   ├── init.sql                      # PostgreSQL Schema & Seed Script
│   └── README.md                     # Database Instructions
├── tests/
│   ├── test_auth.py                  # Auth Unit & Integration Tests
│   ├── test_rbac.py                  # Role-Based Access Control Tests
│   └── test_health.py                # Health Check Tests
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
└── README.md
```

---

## 4. Running the NEXOURA Platform

### Prerequisites
- Python 3.10+
- Node.js 18+ (with npm)
- PostgreSQL (optional for local development)

---

### Step 1: Seed Superadmin Account
Run the controlled admin seeding script:
```bash
python backend/seed_admin.py
```
- **Default Admin Email:** `admin@nexoura.edu`
- **Default Admin Password:** `Admin@Nexoura2026`

---

### Step 2: Start Backend API Server
```bash
# In backend/ directory
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- **API Swagger Documentation:** `http://localhost:8000/docs`
- **API Health Check:** `http://localhost:8000/api/health`

---

### Step 3: Start Frontend Dev Server
```bash
# In frontend/ directory
npm install
npm run dev
```
- **Platform URL:** `http://localhost:5173`

---

### Step 4: Run Automated Tests
```bash
# Run full Pytest suite from repository root
python -m pytest
```

---

## 5. Security & RBAC Matrix

| Role | Permitted Routes & APIs | Registration Method |
|---|---|---|
| **Student** | `/student/dashboard`, `/api/students/me`, `/api/auth/me` | Public Registration (`/register`) |
| **Teacher** | `/teacher/dashboard`, `/api/teachers/me`, `/api/auth/me` | Public Registration (`/register`) |
| **Parent** | `/parent/dashboard`, `/api/parents/me`, `/api/auth/me` | Public Registration (`/register`) |
| **Administrator** | `/admin/dashboard`, `/api/admin/me`, `/api/admin/users`, `/api/auth/me` | CLI Seed Script Only (`seed_admin.py`) |
