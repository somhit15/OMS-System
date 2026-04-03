from sqlalchemy import Column, Integer, String, Boolean, Enum
from app.db.base import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "Admin"
    USER = "User"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default=UserRole.USER)
    is_active = Column(Boolean, default=True)
