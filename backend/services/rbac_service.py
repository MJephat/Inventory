from sqlalchemy import select
from sqlalchemy.orm import Session

from models.role import Role
from models.permission import Permission
from models.user import User
from models.user_role import UserRole


PERMISSIONS = [
    "user.create",
    "user.read",

    "product.create",
    "product.read",
    "product.update",
    "product.delete",

    "inventory.read",
    "inventory.stock_in",
    "inventory.stock_out",
    "inventory.adjust",

    "dashboard.read",
]


class RBACService:

    @staticmethod
    def seed(db: Session):

        # -------------------------
        # Permissions
        # -------------------------

        permissions = {}

        for permission_name in PERMISSIONS:

            permission = db.scalar(
                select(Permission)
                .where(
                    Permission.name == permission_name
                )
            )

            if not permission:
                permission = Permission(
                    name=permission_name
                )

                db.add(permission)
                db.flush()

            permissions[permission_name] = permission

        # -------------------------
        # Roles
        # -------------------------

        admin_role = db.scalar(
            select(Role)
            .where(Role.name == "ADMIN")
        )

        if not admin_role:
            admin_role = Role(
                name="ADMIN",
                description="System administrator"
            )

            db.add(admin_role)
            db.flush()

        user_role = db.scalar(
            select(Role)
            .where(Role.name == "USER")
        )

        if not user_role:
            user_role = Role(
                name="USER",
                description="Standard inventory user"
            )

            db.add(user_role)
            db.flush()

        # -------------------------
        # ADMIN permissions
        # -------------------------

        admin_role.permissions = list(
            permissions.values()
        )

        # -------------------------
        # USER permissions
        # -------------------------

        user_role.permissions = [
            permissions["product.read"],
            permissions["inventory.read"],
            permissions["inventory.stock_in"],
            permissions["inventory.stock_out"],
            permissions["dashboard.read"],
        ]

        db.commit()

    # assign roles
    @staticmethod
    def assign_role(
        db: Session,
        user_id,
        role_name: str
    ):

        user = db.scalar(
            select(User)
            .where(User.id == user_id)
        )

        if not user:
            raise ValueError("User not found.")

        role = db.scalar(
            select(Role)
            .where(Role.name == role_name)
        )

        if not role:
            raise ValueError("Role not found.")

        if role not in user.roles:
            user.roles.append(role)

        db.commit()