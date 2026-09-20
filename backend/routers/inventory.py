from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from core.database import get_db

from models.inventory import Inventory
from models.inventory_transaction import InventoryTransaction

from schema.inventory import ( StockInRequest, StockOutRequest, StockAdjustmentRequest, InventoryResponse, InventoryTransactionResponse)

from services.inventory_service import InventoryService


router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.post("/stock-in",response_model=InventoryResponse)
def stock_in(
    data: StockInRequest,
    db: Session = Depends(get_db)
):
    try:
        return InventoryService.stock_in(
            db,
            data
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/stock-out", response_model=InventoryResponse)
def stock_out(
    data: StockOutRequest,
    db: Session = Depends(get_db)
):
    try:
        return InventoryService.stock_out(
            db,
            data
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/adjust", response_model=InventoryResponse)
def adjust_stock(
    data: StockAdjustmentRequest,
    db: Session = Depends(get_db)
):

    try:
        return InventoryService.adjust(
            db,
            data
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get("", response_model=list[InventoryResponse])
def get_inventory(
    db: Session = Depends(get_db)
):

    return db.scalars(
        select(Inventory)
    ).all()


@router.get("/{product_id}/history", response_model=list[InventoryTransactionResponse])
def get_inventory_history(
    product_id: UUID,
    db: Session = Depends(get_db)
):

    return db.scalars(
        select(InventoryTransaction)
        .where(
            InventoryTransaction.product_id == product_id
        )
        .order_by(
            InventoryTransaction.created_at.desc()
        )
    ).all()