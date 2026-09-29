# NEXOURA System Architecture — Phase 2: Authentication & RBAC

## Overview

NEXOURA is built on a decoupled, modular 3-tier architecture with strict Role-Based Access Control (RBAC) separating student guidance, educator oversight, guardian progress monitoring, and institutional administration.

```
React (Vite + Tailwind CSS + AuthContext)
          │
          │ HTTP Request with Authorization: Bearer <JWT>
          ▼
FastAPI Backend (Security Dependencies & RBAC Guards)
          │
          │ SQLAlchemy 2.0 ORM Models
          ▼
PostgreSQL Database (User, Profiles, Links, Audit Log)
```

---

## Security Architecture

### 1. Authentication Flow
```text
User Submits Credentials (Email + Password)
          │
          ▼
POST /api/auth/login
          │
          ▼
Verify Bcrypt Password Hash against Database
          │
          ▼
Generate Signed JWT Token (Subject: user_id, Role: role)
          │
          ▼
Return Access Token & User Payload
          │
          ▼
Client Stores Token & Redirects to Role Dashboard
```

### 2. Role-Based Access Control (RBAC) Matrix

- **Student Role (`student`)**:
  - Frontend: `/student/dashboard`
  - Backend API: `/api/students/me`, `/api/auth/me`
- **Teacher Role (`teacher`)**:
  - Frontend: `/teacher/dashboard`
  - Backend API: `/api/teachers/me`, `/api/auth/me`
- **Parent Role (`parent`)**:
  - Frontend: `/parent/dashboard`
  - Backend API: `/api/parents/me`, `/api/auth/me`
- **Administrator Role (`admin`)**:
  - Frontend: `/admin/dashboard`
  - Backend API: `/api/admin/me`, `/api/admin/users`, `/api/auth/me`
