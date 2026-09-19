from uuid import UUID
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class ProductCreate(BaseModel):
    sku: str
    name: str
    description: str | None = None
    category_id: UUID
    cost_price: Decimal
    selling_price: Decimal
    reorder_level: int = 0


class ProductUpdate(BaseModel):
    sku: str | None = None
    name: str | None = None
    description: str | None = None
    category_id: UUID | None = None
    cost_price: Decimal | None = None
    selling_price: Decimal | None = None
    reorder_level: int | None = None
    status: str | None = None


class ProductResponse(BaseModel):
    id: UUID
    sku: str
    name: str
    description: str | None
    category_id: UUID
    cost_price: Decimal
    selling_price: Decimal
    reorder_level: int
    status: str
    created_at: datetime
    updated_at: datetime | None

    model_config = ConfigDict(from_attributes=True)