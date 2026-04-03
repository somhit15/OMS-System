from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal

class ProductBase(BaseModel):
    name: str
    sku: str
    price: Decimal = Field(..., gt=0)
    stock_quantity: int = Field(..., ge=0)
    is_active: Optional[bool] = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0)
    stock_quantity: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True
