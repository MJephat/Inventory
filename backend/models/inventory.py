import uuid

from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from core.database import Base


class Inventory(Base):

    __tablename__ = "inventory"

    id: Mapped[uuid.UUID] = mapped_column( UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id: Mapped[uuid.UUID] = mapped_column( UUID(as_uuid=True), ForeignKey("products.id"), unique=True, nullable=False)
    quantity: Mapped[int] = mapped_column( nullable=False, default=0)
    updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    product = relationship("Product", backref="inventory")