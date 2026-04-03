from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from decimal import Decimal
import uuid

class OrderRepo:
    @staticmethod
    def create(db: Session, user_id: int, total_amount: Decimal) -> Order:
        order_no = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        db_order = Order(
            order_no=order_no,
            user_id=user_id,
            total_amount=total_amount,
            status=OrderStatus.CREATED
        )
        db.add(db_order)
        db.flush() # To get the ID
        return db_order

    @staticmethod
    def create_item(db: Session, order_id: int, product_id: int, quantity: int, unit_price: Decimal) -> OrderItem:
        line_total = Decimal(quantity) * unit_price
        db_item = OrderItem(
            order_id=order_id,
            product_id=product_id,
            quantity=quantity,
            unit_price=unit_price,
            line_total=line_total
        )
        db.add(db_item)
        return db_item

    @staticmethod
    def get_by_id(db: Session, order_id: int) -> Optional[Order]:
        return db.query(Order).filter(Order.id == order_id).first()

    @staticmethod
    def list(db: Session, user_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[Order]:
        query = db.query(Order)
        if user_id:
            query = query.filter(Order.user_id == user_id)
        return query.order_by(desc(Order.created_at)).offset(skip).limit(limit).all()

    @staticmethod
    def update_status(db: Session, db_order: Order, status: OrderStatus) -> Order:
        db_order.status = status
        db.commit()
        db.refresh(db_order)
        return db_order

order_repo = OrderRepo()
