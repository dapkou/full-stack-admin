import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from src.core.settings import settings

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def debug_db(session):
    row = session.execute(
        text("SELECT DB_NAME() AS db, @@SERVERNAME AS server")
    ).first()

    exists = session.execute(
        text(
            "SELECT CASE WHEN OBJECT_ID('dbo.users', 'U') IS NOT NULL THEN 1 ELSE 0 END"
        )
    ).scalar_one()

    if exists:
        cnt = session.execute(text("SELECT COUNT(*) FROM dbo.users")).scalar_one()
        print("[DB]", row.db, row.server, "users_count=", cnt)
    else:
        print("[DB]", row.db, row.server, "dbo.users not created yet")
