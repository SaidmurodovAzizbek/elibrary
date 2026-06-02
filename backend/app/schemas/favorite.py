"""
Favorite Pydantic schemas.
"""

from datetime import datetime
from pydantic import BaseModel

from app.schemas.book import BookRead


class FavoriteCreate(BaseModel):
    """Kitobni sevimliga qo'shish."""
    book_id: int


class FavoriteRead(BaseModel):
    """Sevimli response."""
    id: int
    user_id: int
    book_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class FavoriteReadDetailed(FavoriteRead):
    """Sevimli — kitob detallari bilan."""
    book: BookRead | None = None
