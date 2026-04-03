from app.db.session import SessionLocal
from app.models.user import User, UserRole
from app.models.product import Product
from app.core.security import get_password_hash
from decimal import Decimal

def seed_db():
    db = SessionLocal()
    try:
        # Create Admin
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                username="admin",
                password_hash=get_password_hash("admin123"),
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(admin)
            print("Admin user created: admin / admin123")

        # Create User
        user = db.query(User).filter(User.username == "user").first()
        if not user:
            user = User(
                username="user",
                password_hash=get_password_hash("user123"),
                role=UserRole.USER,
                is_active=True
            )
            db.add(user)
            print("User created: user / user123")

        # Create some products
        if db.query(Product).count() == 0:
            products = [
                Product(name="Laptop", sku="LAP-001", price=Decimal("999.99"), stock_quantity=10, is_active=True),
                Product(name="Mouse", sku="MOU-001", price=Decimal("25.50"), stock_quantity=50, is_active=True),
                Product(name="Keyboard", sku="KEY-001", price=Decimal("45.00"), stock_quantity=30, is_active=True),
                Product(name="Monitor", sku="MON-001", price=Decimal("150.00"), stock_quantity=15, is_active=True),
            ]
            db.add_all(products)
            print(f"{len(products)} products created")

        db.commit()
    except Exception as e:
        print(f"Error seeding DB: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
