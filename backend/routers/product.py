from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from schema.product import ( ProductCreate, ProductUpdate, ProductResponse)
from services.product_service import ProductService


router = APIRouter(prefix="/products", tags=["Products"])


@router.post("", response_model=ProductResponse, status_code=201)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db)
):

    try:
        return ProductService.create(
            db,
            data
        )

    except ValueError as e:
        message = str(e)
        status_code = (
            409
            if "already exists" in message
            else 404
        )

        raise HTTPException(
            status_code=status_code,
            detail=message
        )


@router.get("", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):

    return ProductService.get_all(db)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: UUID, db: Session = Depends(get_db)):

    try:
        return ProductService.get_by_id(
            db,
            product_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: UUID,
    data: ProductUpdate,
    db: Session = Depends(get_db)
):

    try:

        return ProductService.update(
            db,
            product_id,
            data
        )

    except ValueError as e:

        message = str(e)

        status_code = (
            409
            if "already exists" in message
            else 404
        )

        raise HTTPException(
            status_code=status_code,
            detail=message
        )


@router.delete("/{product_id}")
def delete_product(product_id: UUID, db: Session = Depends(get_db)):

    try:
        ProductService.delete(
            db,
            product_id
        )

        return {
            "success": True,
            "message": "Product deleted successfully."
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )