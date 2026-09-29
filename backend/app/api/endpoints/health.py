from fastapi import APIRouter, status
from app.core.config import settings
from app.core.database import check_database_connection
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Platform Health & Database Status",
    description="Returns current operational status of the FastAPI backend and verifies PostgreSQL database connection."
)
def get_health() -> HealthResponse:
    db_connected, db_message = check_database_connection()
    
    return HealthResponse(
        status="ok",
        message="Smart Education Platform API is running",
        database_status="connected" if db_connected else "standby_ready",
        database_details=db_message,
        environment=settings.ENVIRONMENT,
        version="1.0.0-phase1"
    )
