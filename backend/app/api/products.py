from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.product_service import product_service
from app.schemas.product import ProductResponse, ProductCreate, ProductUpdate
from app.core.dependencies import get_current_user, get_current_active_admin
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
def list_products(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    # Only Admin can see inactive products
    only_active = True
    if current_user.role == "Admin":
        only_active = False
    return product_service.list_products(db, skip=skip, limit=limit, search=search, only_active=only_active)

@router.get("/{id}", response_model=ProductResponse)
def get_product(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return product_service.get_product(db, id)

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_active_admin)
):
    return product_service.create_product(db, product_in)

@router.put("/{id}", response_model=ProductResponse)
def update_product(
    id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_active_admin)
):
    return product_service.update_product(db, id, product_in)

@router.patch("/{id}/deactivate", response_model=ProductResponse)
def deactivate_product(
    id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_active_admin)
):
    return product_service.deactivate_product(db, id)
