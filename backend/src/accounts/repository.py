from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from .models import User

def get_user_by_email(db: Session, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    result = db.execute(stmt)
    return result.scalar_one_or_none()

def get_user_by_id(db: Session, user_id: int) -> User | None:
    stmt = select(User).where(User.id == user_id)
    result = db.execute(stmt)
    return result.scalar_one_or_none()


def create_user(
    db: Session, email: str, password_hash: str, full_name: str | None = None
) -> User | None:
    user = User(email=email, password_hash=password_hash, full_name=full_name)
    db.add(user)
    try:
        db.commit()
        db.refresh(user)  # 拿到 id/created_at 等 DB 生成欄位
        return user
    except IntegrityError:
        db.rollback()
        return None
