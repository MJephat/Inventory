from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from models.audit_log import AuditLog
from models.user import User


class AuditLogService:

    # Create
    @staticmethod
    def create(
        db: Session,
        user_id: UUID | None,
        action: str,
        entity_type: str,
        entity_id: UUID | None = None,
        description: str | None = None,
        ip_address: str | None = None,
    ):
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            description=description,
            ip_address=ip_address,
        )

        db.add(audit_log)

        return audit_log

    # Get audit logs
    @staticmethod
    def get_logs(
        db: Session,
        page: int = 1,
        limit: int = 20,
        action: str | None = None,
        entity_type: str | None = None,
        user_id: UUID | None = None,
    ):

        query = (
            select(
                AuditLog,
                User.username,
            )
            .outerjoin(
                User,
                AuditLog.user_id == User.id,
            )
        )

        if action:
            query = query.where(
                AuditLog.action == action
            )

        if entity_type:
            query = query.where(
                AuditLog.entity_type == entity_type
            )

        if user_id:
            query = query.where(
                AuditLog.user_id == user_id
            )

        # Total records
        count_query = select(
            func.count()
        ).select_from(
            query.subquery()
        )

        total = db.scalar(count_query) or 0

        # Pagination
        offset = (page - 1) * limit

        query = (
            query
            .order_by(
                AuditLog.created_at.desc()
            )
            .offset(offset)
            .limit(limit)
        )

        results = db.execute(query).all()

        data = []

        for audit_log, username in results:
            data.append({
                "id": audit_log.id,
                "user_id": audit_log.user_id,
                "username": username,

                "action": audit_log.action,
                "entity_type": audit_log.entity_type,
                "entity_id": audit_log.entity_id,
                "description": audit_log.description,
                "ip_address": audit_log.ip_address,
                "created_at": audit_log.created_at,
            })

        return {
            "data": data,
            "total": total,
            "page": page,
            "limit": limit,
        }