from core.database import SessionLocal
from services.rbac_service import RBACService


def main():
    db = SessionLocal()

    try:
        RBACService.seed(db)
        print("RBAC seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    main()