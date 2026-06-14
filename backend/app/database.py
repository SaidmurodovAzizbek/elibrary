"""
Async SQLAlchemy database engine & session factory.
"""

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


# ─── Engine ───────────────────────────────────────────
# Postgres (Neon) uchun maxsus sozlamalar:
#   • ssl="require"          — Neon faqat SSL ulanishni qabul qiladi
#   • statement_cache_size=0 — Neon pooler (PgBouncer transaction mode) bilan
#                              prepared statement xatolarini oldini oladi
_connect_args: dict = {}
_engine_kwargs: dict = {"echo": settings.DEBUG, "future": True}

if settings.DATABASE_URL.startswith("postgresql"):
    _connect_args = {
        "ssl": "require",
        "statement_cache_size": 0,
    }
    _engine_kwargs["pool_pre_ping"] = True  # uzilgan ulanishlarni avtomatik tiklaydi

engine = create_async_engine(
    settings.DATABASE_URL,
    connect_args=_connect_args,
    **_engine_kwargs,
)

# ─── Session factory ─────────────────────────────────
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# ─── Base model ──────────────────────────────────────
class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""
    pass


# ─── Dependency ──────────────────────────────────────
async def get_db() -> AsyncSession:
    """
    FastAPI dependency that yields an async database session.
    Automatically commits on success, rolls back on error.
    """
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
