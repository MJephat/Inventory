from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from core.auth import get_current_user
from core.database import get_db
from core.permissions import require_permission
from schema.audit_log import AuditLogListResponse
from services.audit_log_service import AuditLogService


router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])


@router.get("/", response_model=AuditLogListResponse)
def get_audit_logs(
    page: int = Query(1, ge=1),
    limit: int = Query(
        20,
        ge=1,
        le=100
    ),
    action: str | None = None,
    entity_type: str | None = None,
    user_id: UUID | None = None,

    current_user=Depends(
        require_permission("audit.read")
    ),

    db: Session = Depends(get_db)
):
    return AuditLogService.get_logs(
        db=db,
        page=page,
        limit=limit,
        action=action,
        entity_type=entity_type,
        user_id=user_id,
    )