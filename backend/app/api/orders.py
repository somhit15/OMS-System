from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.order_service import order_service
from app.schemas.order import OrderResponse, OrderCreate, OrderStatusUpdate
from app.core.dependencies import get_current_user, get_current_active_admin
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return order_service.create_order(db, current_user, order_in)

@router.get("/", response_model=List[OrderResponse])
def list_orders(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    return order_service.list_orders(db, current_user, skip=skip, limit=limit)

@router.get("/{id}", response_model=OrderResponse)
def get_order(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return order_service.get_order(db, current_user, id)

@router.patch("/{id}/status", response_model=OrderResponse)
def update_order_status(
    id: int,
    status_in: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_active_admin)
):
    return order_service.update_status(db, id, status_in)
