from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from src.core.db import get_db
from src.core.security import decode_token, TokenError
from src.accounts.repository import get_user_by_id

bearer = HTTPBearer(auto_error=False)


def get_current_user(
    cred: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
):
    if not cred or cred.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        user_id = decode_token(cred.credentials)
    except TokenError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return user
