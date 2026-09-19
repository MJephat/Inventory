from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.product import Product
from models.category import Category
from schema.product import ProductCreate, ProductUpdate


class ProductService:

# Create
    @staticmethod
    def create(db: Session, data: ProductCreate):
        # Check SKU
        existing = db.scalar(
            select(Product).where(
                Product.sku == data.sku
            )
        )

        if existing:
            raise ValueError("Product SKU already exists.")

        # Check category
        category = db.scalar(
            select(Category).where(
                Category.id == data.category_id
            )
        )

        if not category:
            raise ValueError(
                "Category not found."
            )

        product = Product(
            sku=data.sku,
            name=data.name,
            description=data.description,
            category_id=data.category_id,
            cost_price=data.cost_price,
            selling_price=data.selling_price,
            reorder_level=data.reorder_level,
            status="ACTIVE"
        )

        db.add(product)
        db.commit()
        db.refresh(product)

        return product

# Get all
    @staticmethod
    def get_all(db: Session):

        return db.scalars(
            select(Product)
            .order_by(Product.created_at.desc())
        ).all()

    @staticmethod
    def get_by_id(db: Session, product_id: UUID):

        product = db.scalar(
            select(Product).where(
                Product.id == product_id
            )
        )

        if not product:
            raise ValueError(
                "Product not found."
            )

        return product

# Update
    @staticmethod
    def update(
        db: Session,
        product_id: UUID,
        data: ProductUpdate
    ):

        product = ProductService.get_by_id(
            db,
            product_id
        )

        # SKU
        if data.sku is not None:

            existing = db.scalar(
                select(Product).where(
                    Product.sku == data.sku,
                    Product.id != product_id
                )
            )

            if existing:
                raise ValueError(
                    "Product SKU already exists."
                )

            product.sku = data.sku

        # Category
        if data.category_id is not None:

            category = db.scalar(
                select(Category).where(
                    Category.id == data.category_id
                )
            )

            if not category:
                raise ValueError(
                    "Category not found."
                )

            product.category_id = data.category_id

        if data.name is not None:
            product.name = data.name

        if data.description is not None:
            product.description = data.description

        if data.cost_price is not None:
            product.cost_price = data.cost_price

        if data.selling_price is not None:
            product.selling_price = data.selling_price

        if data.reorder_level is not None:
            product.reorder_level = data.reorder_level

        if data.status is not None:
            product.status = data.status

        db.commit()
        db.refresh(product)

        return product

# delete
    @staticmethod
    def delete(
        db: Session,
        product_id: UUID
    ):

        product = ProductService.get_by_id(
            db,
            product_id
        )

        db.delete(product)
        db.commit()

        return True