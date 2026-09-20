from sqlalchemy import select

from core.database import SessionLocal
from models.user import User
from services.rbac_service import RBACService


db = SessionLocal()

try:
    user = db.scalar(
        select(User)
        .where(User.username == "admin")
    )

    RBACService.assign_role(
        db,
        user.id,
        "ADMIN"
    )

    print("Admin role assigned.")

finally:
    db.close()