from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from schema.category import (CategoryCreate,CategoryUpdate,CategoryResponse)
from services.category_service import CategoryService


router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("", response_model=CategoryResponse,status_code=201)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db)
):
    try:
        return CategoryService.create(db, data)

    except ValueError as e:
        raise HTTPException(
            status_code=409,
            detail=str(e)
        )


@router.get("", response_model=list[CategoryResponse])
def get_categories(
    db: Session = Depends(get_db)
):

    return CategoryService.get_all(db)


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: UUID,
    db: Session = Depends(get_db)
):

    try:
        return CategoryService.get_by_id(
            db,
            category_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: UUID,
    data: CategoryUpdate,
    db: Session = Depends(get_db)
):

    try:
        return CategoryService.update(
            db,
            category_id,
            data
        )

    except ValueError as e:

        status_code = (
            409
            if "already exists" in str(e)
            else 404
        )

        raise HTTPException(
            status_code=status_code,
            detail=str(e)
        )


@router.delete("/{category_id}")
def delete_category(
    category_id: UUID,
    db: Session = Depends(get_db)
):

    try:
        CategoryService.delete(
            db,
            category_id
        )

        return {
            "success": True,
            "message": "Category deleted successfully."
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )