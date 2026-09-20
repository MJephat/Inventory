from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.product import Product
from models.inventory import Inventory
from models.inventory_transaction import InventoryTransaction
from core.auth import get_current_user

from schema.inventory import (StockInRequest, StockOutRequest, StockAdjustmentRequest)


class InventoryService:

    @staticmethod
    def stock_in(
        db: Session,
        data: StockInRequest,
        current_user
    ):

        # Check product
        product = db.scalar(
            select(Product).where(
                Product.id == data.product_id
            )
        )

        if not product:
            raise ValueError(
                "Product not found."
            )

        # Get inventory
        inventory = db.scalar(
            select(Inventory)
            .where(
                Inventory.product_id == data.product_id
            )
            .with_for_update()
        )

        # Create inventory record if it doesn't exist
        if not inventory:

            inventory = Inventory(
                product_id=data.product_id,
                quantity=0
            )

            db.add(inventory)
            db.flush()

        # Increase stock
        inventory.quantity += data.quantity

        # Record transaction
        transaction = InventoryTransaction(
            product_id=data.product_id,
            created_by=current_user.id,
            transaction_type="STOCK_IN",
            quantity=data.quantity,
            balance_after=inventory.quantity,
            reference=data.reference,
            reason=data.reason
        )

        db.add(transaction)

        db.commit()

        db.refresh(inventory)

        return inventory


    @staticmethod
    def stock_out(
        db: Session,
        data: StockOutRequest,
        current_user
    ):

        # Check product
        product = db.scalar(
            select(Product).where(
                Product.id == data.product_id
            )
        )

        if not product:
            raise ValueError(
                "Product not found."
            )

        # Get inventory and lock the row
        inventory = db.scalar(
            select(Inventory)
            .where(
                Inventory.product_id == data.product_id
            )
            .with_for_update()
        )

        if not inventory:
            raise ValueError(
                "No inventory record found for this product."
            )

        # Prevent negative stock
        if inventory.quantity < data.quantity:

            raise ValueError(
                f"Insufficient stock. "
                f"Available: {inventory.quantity}, "
                f"Requested: {data.quantity}"
            )

        # Reduce stock
        inventory.quantity -= data.quantity

        # Record transaction
        transaction = InventoryTransaction(
            product_id=data.product_id,
            created_by=current_user.id,
            transaction_type="STOCK_OUT",
            quantity=-data.quantity,
            balance_after=inventory.quantity,
            reference=data.reference,
            reason=data.reason
        )

        db.add(transaction)

        db.commit()

        db.refresh(inventory)

        return inventory


    @staticmethod
    def adjust(
        db: Session,
        data: StockAdjustmentRequest,  
        current_user

    ):

        # Check product
        product = db.scalar(
            select(Product).where(
                Product.id == data.product_id
            )
        )

        if not product:
            raise ValueError(
                "Product not found."
            )

        # Get inventory
        inventory = db.scalar(
            select(Inventory)
            .where(
                Inventory.product_id == data.product_id
            )
            .with_for_update()
        )

        if not inventory:
            raise ValueError(
                "No inventory record found for this product."
            )

        new_quantity = inventory.quantity + data.quantity

        # Don't allow negative stock
        if new_quantity < 0:

            raise ValueError(
                "Adjustment would result in negative stock."
            )

        inventory.quantity = new_quantity

        transaction = InventoryTransaction(
            product_id=data.product_id,
            created_by=current_user.id,
            transaction_type="ADJUSTMENT",
            quantity=data.quantity,
            balance_after=new_quantity,
            reason=data.reason
        )

        db.add(transaction)

        db.commit()

        db.refresh(inventory)

        return inventory