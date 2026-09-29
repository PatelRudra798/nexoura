import os
import logging
from typing import Generator, Tuple
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool
from app.core.config import settings

logger = logging.getLogger("nexoura.database")

Base = declarative_base()

def _init_engine():
    db_url = settings.DATABASE_URL
    if db_url and db_url.startswith("postgresql"):
        try:
            test_engine = create_engine(
                db_url,
                pool_pre_ping=True,
                echo=False
            )
            with test_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Connected to primary PostgreSQL database.")
            return test_engine
        except Exception as err:
            logger.warning(
                f"PostgreSQL database unreachable ({err}). "
                "Falling back to persistent local SQLite database."
            )
    
    backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    sqlite_path = os.path.join(backend_dir, "smart_edu.db")
    sqlite_url = f"sqlite:///{sqlite_path.replace(os.sep, '/')}"
    return create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False},
        echo=False
    )

engine = _init_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator:
    """Dependency for obtaining database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_database_connection() -> Tuple[bool, str]:
    """
    Verifies connection to database.
    Returns (is_connected: bool, details: str).
    Does not crash the application if DB is currently unreachable or driver missing.
    """
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1")).scalar()
            if result == 1:
                if engine.dialect.name == "postgresql":
                    return True, "PostgreSQL connection active and healthy"
                return True, "Database connection active (Standby SQLite engine active; install psycopg2 for PostgreSQL)"
            return False, "Unexpected ping response from database"
    except Exception as e:
        logger.warning(f"Database connection check failed: {str(e)}")
        return False, f"Database server offline or unreachable: {type(e).__name__}"
