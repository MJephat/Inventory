from fastapi import Depends, HTTPException, status

from core.auth import get_current_user


def require_permission(permission_name: str):

    def permission_checker(
        current_user=Depends(get_current_user)
    ):

        user_permissions = set()

        for role in current_user.roles:

            for permission in role.permissions:

                user_permissions.add(
                    permission.name
                )

        if permission_name not in user_permissions:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action."
            )

        return current_user

    return permission_checker