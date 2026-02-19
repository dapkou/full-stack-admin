from pydantic import BaseModel


class StockItem(BaseModel):
    symbol: str
    price: float
