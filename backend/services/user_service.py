from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from core.security import hash_password, verify_password
from models.user import User
from schema.user import UserCreate


class UserService:

    @staticmethod
    def create_user(
        db: Session,
        data: UserCreate
    ):
        existing_user = db.scalar(
            select(User).where(
                or_(
                    User.username == data.username,
                    User.email == data.email
                )
            )
        )

        if existing_user:
            raise ValueError(
                "Username or email already exists."
            )

        user = User(
            username=data.username,
            email=data.email,
            full_name=data.full_name,
            password_hash=hash_password(data.password),
            role=data.role
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def authenticate_user(
        db: Session,
        username: str,
        password: str
    ):
        user = db.scalar(
            select(User).where(
                User.username == username
            )
        )

        if not user:
            return None

        if not user.is_active:
            return None

        if not verify_password(
            password,
            user.password_hash
        ):
            return None

        return user

    @staticmethod
    def get_user_by_id(
        db: Session,
        user_id
    ):
        return db.scalar(
            select(User).where(
                User.id == user_id
            )
        )

    @staticmethod
    def get_users(db: Session):
        return db.scalars(
            select(User)
            .order_by(User.created_at.desc())
        ).all()