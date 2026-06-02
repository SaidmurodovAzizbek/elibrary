"""
Application configuration — loads settings from .env file.
"""

from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    """Central application settings powered by environment variables."""

    # ─── App ──────────────────────────────────────────
    APP_NAME: str = "eLibrary"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # ─── Database ─────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/elibrary_db"

    # ─── JWT ──────────────────────────────────────────
    SECRET_KEY: str = "change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ─── CORS ─────────────────────────────────────────
    CORS_ORIGINS: str = '["http://localhost:5173","http://localhost:3000"]'

    # ─── Media ────────────────────────────────────────
    MEDIA_DIR: str = "media"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS_ORIGINS JSON string into a Python list."""
        return json.loads(self.CORS_ORIGINS)

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Singleton instance — import this throughout the app
settings = Settings()
