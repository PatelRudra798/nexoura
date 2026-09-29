import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine, Base
from app.models.user import User, UserRole
from app.core.security import hash_password


def seed_admin():
    """
    Controlled admin account bootstrap script.
    Creates default superadmin user without exposing public admin registration route.
    """
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    admin_email = "admin@nexoura.edu"
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    
    if existing_admin:
        print(f"[NEXOURA SEED] Administrator account ({admin_email}) already exists.")
        db.close()
        return

    admin_user = User(
        name="Platform Administrator",
        email=admin_email,
        password_hash=hash_password("Admin@Nexoura2026"),
        role=UserRole.ADMIN,
        is_active=True
    )
    db.add(admin_user)
    db.commit()
    db.close()
    print(f"[NEXOURA SEED] Administrator account successfully created.")
    print(f"               Email: {admin_email}")
    print(f"               Role:  admin")


if __name__ == "__main__":
    seed_admin()
