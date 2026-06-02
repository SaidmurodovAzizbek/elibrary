"""
User Pydantic schemas — request/response validation.
"""

from datetime import datetime
from pydantic import BaseModel, Field


# ─── Auth schemas ─────────────────────────────────────
class UserRegister(BaseModel):
    """Ro'yxatdan o'tish."""
    phone_number: str = Field(
        ..., min_length=9, max_length=20,
        examples=["+998901234567"],
        description="Telefon raqam"
    )
    password: str = Field(..., min_length=6, max_length=128)


class UserLogin(BaseModel):
    """Tizimga kirish."""
    phone_number: str = Field(..., examples=["+998901234567"])
    password: str


class TokenResponse(BaseModel):
    """JWT token pair response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    """Tokenni yangilash."""
    refresh_token: str


# ─── User response schemas ────────────────────────────
class UserRead(BaseModel):
    """Foydalanuvchi ma'lumotlari."""
    id: int
    phone_number: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
