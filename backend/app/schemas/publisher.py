"""
Publisher Pydantic schemas.
"""

from datetime import datetime
from pydantic import BaseModel, Field


class PublisherCreate(BaseModel):
    """Yangi nashriyot yaratish."""
    name: str = Field(..., min_length=2, max_length=255)
    founded_year: int | None = Field(None, ge=1000, le=2100, description="Tashkil etilgan yili")
    image: str | None = None
    description: str | None = None


class PublisherUpdate(BaseModel):
    """Nashriyotni yangilash."""
    name: str | None = None
    founded_year: int | None = None
    image: str | None = None
    description: str | None = None


class PublisherRead(BaseModel):
    """Nashriyot response."""
    id: int
    name: str
    founded_year: int | None = None
    image: str | None = None
    description: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
