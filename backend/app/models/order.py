from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.base import Base
import enum

class OrderStatus(str, enum.Enum):
    CREATED = "Created"
    PROCESSING = "Processing"
    COMPLETED = "Completed"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, nullable=False, default=OrderStatus.CREATED)
    total_amount = Column(Numeric(precision=10, scale=2), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(precision=10, scale=2), nullable=False)
    line_total = Column(Numeric(precision=10, scale=2), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")
