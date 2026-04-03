from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.order_repo import order_repo
from app.repositories.product_repo import product_repo
from app.schemas.order import OrderCreate, OrderStatusUpdate
from app.models.order import Order, OrderStatus
from app.models.product import Product
from app.models.user import User
from fastapi import HTTPException, status
from decimal import Decimal

class OrderService:
    @staticmethod
    def create_order(db: Session, user: User, order_in: OrderCreate) -> Order:
        if not order_in.items:
            raise HTTPException(status_code=400, detail="Order must have at least one item")

        total_amount = Decimal("0.00")
        order_items_data = []

        # Start transaction context if needed, but Session itself is transactional
        try:
            for item in order_in.items:
                # Lock the product row for update to handle concurrency
                product = db.query(Product).filter(Product.id == item.product_id).with_for_update().first()
                if not product:
                    raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
                
                if not product.is_active:
                    raise HTTPException(status_code=400, detail=f"Product {product.name} is not active")

                if product.stock_quantity < item.quantity:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=f"Insufficient stock for product {product.name}"
                    )

                line_total = product.price * item.quantity
                total_amount += line_total
                
                # Prepare data for items
                order_items_data.append({
                    "product_id": product.id,
                    "quantity": item.quantity,
                    "unit_price": product.price,
                    "line_total": line_total,
                    "product": product # reference to decrement stock later
                })

            # Create Order
            db_order = order_repo.create(db, user.id, total_amount)

            # Create OrderItems and reduce stock
            for item_data in order_items_data:
                order_repo.create_item(
                    db, 
                    db_order.id, 
                    item_data["product_id"], 
                    item_data["quantity"], 
                    item_data["unit_price"]
                )
                # Reduce stock
                item_data["product"].stock_quantity -= item_data["quantity"]

            db.commit()
            db.refresh(db_order)
            return db_order
        except Exception as e:
            db.rollback()
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    def list_orders(db: Session, user: User, skip: int = 0, limit: int = 100) -> List[Order]:
        if user.role == "Admin":
            return order_repo.list(db, skip=skip, limit=limit)
        return order_repo.list(db, user_id=user.id, skip=skip, limit=limit)

    @staticmethod
    def get_order(db: Session, user: User, order_id: int) -> Order:
        order = order_repo.get_by_id(db, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if user.role != "Admin" and order.user_id != user.id:
            raise HTTPException(status_code=403, detail="Not enough privileges")
        
        return order

    @staticmethod
    def update_status(db: Session, order_id: int, status_in: OrderStatusUpdate) -> Order:
        db_order = order_repo.get_by_id(db, order_id)
        if not db_order:
            raise HTTPException(status_code=404, detail="Order not found")

        # Validate transitions: Created -> Processing -> Completed
        current_status = db_order.status
        new_status = status_in.status

        allowed_transitions = {
            OrderStatus.CREATED: [OrderStatus.PROCESSING],
            OrderStatus.PROCESSING: [OrderStatus.COMPLETED],
            OrderStatus.COMPLETED: []
        }

        if new_status not in allowed_transitions.get(current_status, []):
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid status transition from {current_status} to {new_status}"
            )

        return order_repo.update_status(db, db_order, new_status)

order_service = OrderService()
