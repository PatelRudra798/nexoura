from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import settings

from app.core.database import engine
from app.models import Base
from seed_admin import seed_admin
from seed_academic import seed_academic_curriculum

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="NEXOURA — Smart Education & Student Guidance Platform API",
    version="3.0.0-mvp",
    docs_url="/docs",
    redoc_url="/redoc"
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    try:
        seed_admin()
    except Exception as e:
        print(f"Startup admin seed notice: {e}")
    try:
        seed_academic_curriculum()
    except Exception as e:
        print(f"Startup academic seed notice: {e}")

# CORS middleware configuration
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include API Router under /api
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", include_in_schema=False)
def root():
    return {
        "title": settings.PROJECT_NAME,
        "status": "online",
        "documentation": "/docs",
        "health_check": f"{settings.API_V1_STR}/health"
    }
