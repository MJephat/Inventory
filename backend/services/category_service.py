from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.category import Category
from schema.category import CategoryCreate, CategoryUpdate


class CategoryService:
    # create category
    @staticmethod
    def create(db: Session, data: CategoryCreate):
        existing = db.scalar(
            select(Category).where(
                Category.name == data.name
            )
        )

        if existing:
            raise ValueError("Category already exists.")

        category = Category(
            name=data.name,
            description=data.description
        )

        db.add(category)
        db.commit()
        db.refresh(category)

        return category

    @staticmethod
    def get_all(db: Session):

        return db.scalars(
            select(Category)
            .order_by(Category.created_at.desc())
        ).all()

# get categories
    @staticmethod
    def get_by_id(db: Session,category_id: UUID):
        category = db.scalar(
            select(Category).where(
                Category.id == category_id
            )
        )

        if not category:
            raise ValueError("Category not found.")

        return category

# update category
    @staticmethod
    def update(db: Session, category_id: UUID, data: CategoryUpdate):
        category = CategoryService.get_by_id(
            db,
            category_id
        )

        if data.name is not None:

            existing = db.scalar(
                select(Category).where(
                    Category.name == data.name,
                    Category.id != category_id
                )
            )

            if existing:
                raise ValueError( "Category name already exists.")

            category.name = data.name

        if data.description is not None:
            category.description = data.description

        db.commit()
        db.refresh(category)

        return category


# delete category
    @staticmethod
    def delete(db: Session, category_id: UUID):

        category = CategoryService.get_by_id(
            db,
            category_id
        )

        db.delete(category)
        db.commit()

        return True