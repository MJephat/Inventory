import uuid

from sqlalchemy import (String, Text, Numeric, ForeignKey, DateTime)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from core.database import Base

class Product(Base):

    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4 )
    sku: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column( String(150), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    category_id: Mapped[uuid.UUID] = mapped_column( UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False)
    cost_price: Mapped[float] = mapped_column( Numeric(12, 2), nullable=False)
    selling_price: Mapped[float] = mapped_column( Numeric(12, 2), nullable=False)
    reorder_level: Mapped[int] = mapped_column( nullable=False, default=0)
    status: Mapped[str] = mapped_column( String(20), nullable=False, default="ACTIVE")
    created_at: Mapped[DateTime] = mapped_column( DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column( DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    category = relationship( "Category", backref="products")

    # sku = stock keep unit