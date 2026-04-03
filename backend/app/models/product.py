from sqlalchemy import Column, Integer, String, Boolean, Numeric
from app.db.base import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    sku = Column(String, unique=True, index=True, nullable=False)
    price = Column(Numeric(precision=10, scale=2), nullable=False)
    stock_quantity = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, default=True)
