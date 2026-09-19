import uuid

from sqlalchemy import String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from core.database import Base


class Category(Base):

    __tablename__ = "categories"

    id: Mapped[uuid.UUID] = mapped_column( UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column( String(100), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column( Text, nullable=True)
    created_at: Mapped[DateTime] = mapped_column( DateTime(timezone=True),  server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now() )