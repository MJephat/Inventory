from uuid import UUID
from datetime import datetime

from pydantic import BaseModel


class InventorySummary(BaseModel):
    total_products: int
    total_stock: int
    low_stock_products: int
    out_of_stock_products: int


class RecentActivity(BaseModel):
    transaction_id: UUID
    product_id: UUID
    product_name: str
    sku: str
    transaction_type: str
    quantity: int
    balance_after: int
    reference: str | None
    reason: str | None
    created_at: datetime

class LowStockProduct(BaseModel):
    id: UUID
    sku: str
    name: str
    quantity: int
    reorder_level: int