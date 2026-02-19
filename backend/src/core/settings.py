import os
from dataclasses import dataclass

from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]  # backend/
load_dotenv(BASE_DIR.parent / ".env")  # full-stack/.env


def _required(name: str) -> str:
    v = os.getenv(name)
    if not v:
        raise RuntimeError(f"Missing environment variable: {name}")
    return v


@dataclass(frozen=True)
class Settings:
    env: str = os.getenv("ENV", "development")

    database_url: str = _required("DATABASE_URL")

    jwt_secret: str = _required("JWT_SECRET")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    jwt_expire_minutes: int = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))


settings = Settings()
