from contextlib import asynccontextmanager
import os
from pathlib import Path

from dotenv import load_dotenv

_DOTENV_PATH = Path(__file__).resolve().parents[1] / ".env"
if _DOTENV_PATH.exists():
    load_dotenv(dotenv_path=_DOTENV_PATH)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.accounts.routes import router as accounts_router
from src.stocks.routes import router as stocks_router
from src.core.base import Base
from src.core.db import SessionLocal, debug_db, engine

import src.accounts.models  # noqa: F401


def _is_dev() -> bool:
    return os.getenv("ENV", "development").lower() in {"dev", "development", "local"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 開發環境自動建表
    if _is_dev():
        Base.metadata.create_all(bind=engine)

    # 啟動時測 DB
    if _is_dev():
        db = SessionLocal()
        try:
            debug_db(db)
        finally:
            db.close()

    yield


app = FastAPI(lifespan=lifespan, redirect_slashes=False)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounts_router, prefix="/api/v1")
app.include_router(stocks_router, prefix="/api/v1")


@app.get("/")
def root():
    return {"status": "ok"}
