from fastapi import APIRouter
from app.api.endpoints import health, auth, users, academic

api_router = APIRouter()
api_router.include_router(health.router, tags=["System Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Registration"])
api_router.include_router(users.router, tags=["Role Protected Resources"])
api_router.include_router(academic.router, prefix="/academic", tags=["Academic & Learning Intelligence"])
