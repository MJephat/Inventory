from sqlalchemy import select, func
from sqlalchemy.orm import Session

from models.product import Product
from models.inventory import Inventory
from models.inventory_transaction import InventoryTransaction


class DashboardService:

    @staticmethod
    def get_summary(db: Session):

        # Total products
        total_products = db.scalar(
            select(func.count(Product.id))
            .where(Product.status == "ACTIVE")
        ) or 0

        # Total stock
        total_stock = db.scalar(
            select(func.coalesce(func.sum(Inventory.quantity), 0))
        ) or 0

        # Low stock
        low_stock_products = db.scalar(
            select(func.count(Product.id))
            .join(
                Inventory,
                Inventory.product_id == Product.id
            )
            .where(
                Product.status == "ACTIVE",
                Inventory.quantity <= Product.reorder_level,
                Inventory.quantity > 0
            )
        ) or 0

        # Out of stock
        out_of_stock_products = db.scalar(
            select(func.count(Product.id))
            .join(
                Inventory,
                Inventory.product_id == Product.id
            )
            .where(
                Product.status == "ACTIVE",
                Inventory.quantity == 0
            )
        ) or 0

        return {
            "total_products": total_products,
            "total_stock": total_stock,
            "low_stock_products": low_stock_products,
            "out_of_stock_products": out_of_stock_products
        }

    @staticmethod
    def get_recent_activity(
        db: Session,
        limit: int = 10
    ):

        query = (
            select(
                InventoryTransaction.id.label(
                    "transaction_id"
                ),
                Product.id.label(
                    "product_id"
                ),
                Product.name.label(
                    "product_name"
                ),
                Product.sku.label(
                    "sku"
                ),
                InventoryTransaction.transaction_type,
                InventoryTransaction.quantity,
                InventoryTransaction.balance_after,
                InventoryTransaction.reference,
                InventoryTransaction.reason,
                InventoryTransaction.created_at
            )
            .join(
                Product,
                Product.id ==
                InventoryTransaction.product_id
            )
            .order_by(
                InventoryTransaction.created_at.desc()
            )
            .limit(limit)
        )

        result = db.execute(query)

        return result.mappings().all()
        

    @staticmethod
    def get_low_stock_products(db: Session):

        query = (
            select(
                Product.id,
                Product.sku,
                Product.name,
                Product.reorder_level,
                Inventory.quantity
            )
            .join(
                Inventory,
                Inventory.product_id == Product.id
            )
            .where(
                Product.status == "ACTIVE",
                Inventory.quantity <= Product.reorder_level
            )
            .order_by(
                Inventory.quantity.asc()
            )
        )

        result = db.execute(query)

        return result.mappings().all()