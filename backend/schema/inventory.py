from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict

class CategoryResponse(BaseModel):
    id: UUID
    name: str

    class Config:
        from_attributes = True


class ProductInventoryResponse(BaseModel):
    id: UUID
    sku: str
    name: str
    reorder_level: int
    category: CategoryResponse

    class Config:
        from_attributes = True

class StockInRequest(BaseModel):
    product_id: UUID
    quantity: int = Field(gt=0)
    reference: str | None = None
    reason: str | None = None


class StockOutRequest(BaseModel):
    product_id: UUID
    quantity: int = Field(gt=0)
    reference: str | None = None
    reason: str | None = None


class StockAdjustmentRequest(BaseModel):
    product_id: UUID
    quantity: int
    reason: str


class InventoryResponse(BaseModel):
    id: UUID
    product_id: UUID
    quantity: int
    updated_at: datetime
    product: ProductInventoryResponse

    model_config = ConfigDict(from_attributes=True)

class TransactionUserResponse(BaseModel):
    id: UUID
    username: str
    full_name: str

    model_config = ConfigDict(from_attributes=True)

class InventoryTransactionResponse(BaseModel):
    id: UUID
    product_id: UUID
    created_by: UUID | None
    transaction_type: str
    quantity: int
    balance_after: int
    reference: str | None
    reason: str | None
    created_at: datetime
    user: TransactionUserResponse | None

    model_config = ConfigDict(from_attributes=True)