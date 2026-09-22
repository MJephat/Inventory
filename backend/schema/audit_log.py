from uuid import UUID
from datetime import datetime

from pydantic import BaseModel


class AuditLogResponse(BaseModel):
    id: UUID
    user_id: UUID | None
    username: str | None

    action: str
    entity_type: str
    entity_id: UUID | None
    description: str | None
    ip_address: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class AuditLogListResponse(BaseModel):
    data: list[AuditLogResponse]
    total: int
    page: int
    limit: int