from datetime import datetime, timezone
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(description="Overall health status of the API")
    message: str = Field(description="Status message")
    database_status: str = Field(description="PostgreSQL connection state")
    database_details: str = Field(description="Detailed connection status")
    environment: str = Field(description="Current runtime environment")
    version: str = Field(description="Platform API version")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Server UTC timestamp")

    model_config = {
        "json_schema_extra": {
            "example": {
                "status": "ok",
                "message": "Smart Education Platform API is running",
                "database_status": "connected",
                "database_details": "PostgreSQL connection active and healthy",
                "environment": "development",
                "version": "1.0.0-phase1",
                "timestamp": "2026-09-22T16:18:00.000000Z"
            }
        }
    }
