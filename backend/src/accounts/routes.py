from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.core.db import get_db
from src.core.security import create_access_token
from .schemas import RegisterReq, LoginReq, TokenResp, RegisterResp, MeResp
from .service import register_user, authenticate_user
from .auth import get_current_user

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.post("/register", response_model=RegisterResp)
def register(req: RegisterReq, db: Session = Depends(get_db)):
    inserted = register_user(db, req.email, req.password, full_name=req.full_name)
    if not inserted:
        raise HTTPException(status_code=409, detail="Email already exists")
    return {"ok": True}


@router.post("/login", response_model=TokenResp)
def login(req: LoginReq, db: Session = Depends(get_db)):
    user = authenticate_user(db, req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"token": create_access_token(user.id)}


@router.get("/me", response_model=MeResp)
def me(user=Depends(get_current_user)):
    return user
