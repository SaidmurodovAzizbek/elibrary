"""
Book Pydantic schemas.
"""

from datetime import datetime
from pydantic import BaseModel, Field

from app.schemas.author import AuthorRead
from app.schemas.publisher import PublisherRead


class BookCreate(BaseModel):
    """Yangi kitob yaratish."""
    title: str = Field(..., min_length=1, max_length=500)
    description: str | None = None
    published_year: int | None = Field(None, ge=1000, le=2100)
    pages: int | None = Field(None, ge=1)
    sold_count: int = Field(0, ge=0)
    price: float = Field(0.00, ge=0)
    rating: float = Field(0.0, ge=0.0, le=5.0)
    image: str | None = None
    author_id: int
    publisher_id: int | None = None


class BookUpdate(BaseModel):
    """Kitobni yangilash."""
    title: str | None = None
    description: str | None = None
    published_year: int | None = None
    pages: int | None = None
    sold_count: int | None = None
    price: float | None = None
    rating: float | None = Field(None, ge=0.0, le=5.0)
    image: str | None = None
    author_id: int | None = None
    publisher_id: int | None = None


class BookRead(BaseModel):
    """Kitob response (asosiy)."""
    id: int
    title: str
    description: str | None = None
    published_year: int | None = None
    pages: int | None = None
    sold_count: int = 0
    price: float = 0.00
    rating: float = 0.0
    image: str | None = None
    author_id: int
    publisher_id: int | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class BookReadDetailed(BookRead):
    """Kitob response — muallif va nashriyot bilan birga."""
    author: AuthorRead | None = None
    publisher: PublisherRead | None = None
