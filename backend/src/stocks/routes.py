from fastapi import APIRouter, Depends

from src.accounts.auth import get_current_user
from .schemas import StockItem
from .service import get_stocks

router = APIRouter(prefix="/stocks", tags=["stocks"])


@router.get("", response_model=list[StockItem])
def list_stocks(_user=Depends(get_current_user)):
    return get_stocks()
