"""
Author Pydantic schemas.
"""

from datetime import datetime
from pydantic import BaseModel, Field


class AuthorCreate(BaseModel):
    """Yangi muallif yaratish."""
    full_name: str = Field(..., min_length=2, max_length=255)
    birth_year: int | None = Field(None, ge=1000, le=2100, description="Tug'ilgan yili")
    death_year: int | None = Field(None, ge=1000, le=2100, description="Vafot etgan yili")
    description: str | None = None
    image: str | None = None


class AuthorUpdate(BaseModel):
    """Muallifni yangilash."""
    full_name: str | None = None
    birth_year: int | None = None
    death_year: int | None = None
    description: str | None = None
    image: str | None = None


class AuthorRead(BaseModel):
    """Muallif response."""
    id: int
    full_name: str
    birth_year: int | None = None
    death_year: int | None = None
    description: str | None = None
    image: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
