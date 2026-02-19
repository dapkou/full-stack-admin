from sqlalchemy.orm import Session

from .repository import get_user_by_email, create_user
from src.core.security import hash_password, verify_password
from .models import User


def register_user(
    db: Session,
    email: str,
    password: str,
    full_name: str | None = None,
) -> User | None:
    if get_user_by_email(db, email):
        return None

    ph = hash_password(password)
    return create_user(db, email, ph, full_name=full_name)


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user
