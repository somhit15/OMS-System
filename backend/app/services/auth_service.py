from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import verify_password
from app.core.security import create_access_token

class AuthService:
    @staticmethod
    def authenticate(db: Session, username: str, password: str) -> Optional[User]:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user

auth_service = AuthService()
