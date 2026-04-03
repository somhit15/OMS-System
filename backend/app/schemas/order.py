from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal
from datetime import datetime
from app.models.order import OrderStatus

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)

class OrderItemResponse(OrderItemBase):
    id: int
    unit_price: Decimal
    line_total: Decimal

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    items: List[OrderItemBase]

class OrderStatusUpdate(BaseModel):
    status: OrderStatus

class OrderResponse(BaseModel):
    id: int
    order_no: str
    user_id: int
    status: OrderStatus
    total_amount: Decimal
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True
