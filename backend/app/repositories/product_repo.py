from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

class ProductRepo:
    @staticmethod
    def get_by_id(db: Session, product_id: int) -> Optional[Product]:
        return db.query(Product).filter(Product.id == product_id).first()

    @staticmethod
    def get_by_sku(db: Session, sku: str) -> Optional[Product]:
        return db.query(Product).filter(Product.sku == sku).first()

    @staticmethod
    def list(db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None, only_active: bool = False) -> List[Product]:
        query = db.query(Product)
        if only_active:
            query = query.filter(Product.is_active == True)
        if search:
            query = query.filter(
                or_(
                    Product.name.ilike(f"%{search}%"),
                    Product.sku.ilike(f"%{search}%")
                )
            )
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def create(db: Session, product_in: ProductCreate) -> Product:
        db_product = Product(**product_in.model_dump())
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product

    @staticmethod
    def update(db: Session, db_product: Product, product_in: ProductUpdate) -> Product:
        update_data = product_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_product, field, value)
        db.commit()
        db.refresh(db_product)
        return db_product

product_repo = ProductRepo()
