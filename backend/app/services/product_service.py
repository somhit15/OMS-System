from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.product_repo import product_repo
from app.schemas.product import ProductCreate, ProductUpdate
from app.models.product import Product
from fastapi import HTTPException, status

class ProductService:
    @staticmethod
    def get_product(db: Session, product_id: int) -> Product:
        product = product_repo.get_by_id(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    @staticmethod
    def list_products(db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None, only_active: bool = False) -> List[Product]:
        return product_repo.list(db, skip=skip, limit=limit, search=search, only_active=only_active)

    @staticmethod
    def create_product(db: Session, product_in: ProductCreate) -> Product:
        existing_product = product_repo.get_by_sku(db, product_in.sku)
        if existing_product:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Product with SKU {product_in.sku} already exists"
            )
        return product_repo.create(db, product_in)

    @staticmethod
    def update_product(db: Session, product_id: int, product_in: ProductUpdate) -> Product:
        db_product = ProductService.get_product(db, product_id)
        if product_in.sku and product_in.sku != db_product.sku:
            existing_product = product_repo.get_by_sku(db, product_in.sku)
            if existing_product:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Product with SKU {product_in.sku} already exists"
                )
        return product_repo.update(db, db_product, product_in)

    @staticmethod
    def deactivate_product(db: Session, product_id: int) -> Product:
        db_product = ProductService.get_product(db, product_id)
        return product_repo.update(db, db_product, ProductUpdate(is_active=False))

product_service = ProductService()
