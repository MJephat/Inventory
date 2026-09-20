from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.auth import get_current_user
from core.database import get_db
from schema.user import UserCreate, UserResponse
from services.user_service import UserService


router = APIRouter( prefix="/users", tags=["Users"])


@router.post("", response_model=UserResponse, status_code=201)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db)
):
    try:
        return UserService.create_user(
            db,
            data
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get("",response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return UserService.get_users(db)


@router.get("/me", response_model=UserResponse)
def get_current_user_details(
    current_user=Depends(get_current_user)
):
    return current_user