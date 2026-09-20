from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from core.database import get_db

from schema.dashboard import (InventorySummary, RecentActivity, LowStockProduct)

from services.dashboard_service import DashboardService


router = APIRouter( prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary",response_model=InventorySummary)
def get_summary(db: Session = Depends(get_db)):

    return DashboardService.get_summary(db)


@router.get("/recent-activity", response_model=list[RecentActivity])
def get_recent_activity(
    limit: int = Query(
        default=10,
        ge=1,
        le=100
    ),
    db: Session = Depends(get_db)
):

    return DashboardService.get_recent_activity(
        db,
        limit
    )


@router.get("/low-stock", response_model=list[LowStockProduct])
def get_low_stock(
    db: Session = Depends(get_db)
):

    return DashboardService.get_low_stock_products(db)