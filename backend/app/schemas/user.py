"""
User Pydantic schemas — request/response validation.
"""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, field_validator


# ─── Role ─────────────────────────────────────────────
class UserRole(str, Enum):
    """Foydalanuvchi rollari."""
    ADMIN = "admin"
    REVIEWER = "reviewer"


def normalize_phone(phone: str) -> str:
    """
    Telefon raqamni normallashtiradi — +998 prefiksini avtomatik qo'shadi.

    Misollar:
        "90 1234567"   -> "+998901234567"
        "901234567"    -> "+998901234567"
        "998901234567" -> "+998901234567"
        "+998901234567"-> "+998901234567"
    """
    digits = phone.strip().replace(" ", "").replace("-", "")
    if digits.startswith("+"):
        return digits
    if digits.startswith("998"):
        return f"+{digits}"
    return f"+998{digits}"


# ─── Auth schemas ─────────────────────────────────────
class UserRegister(BaseModel):
    """Ro'yxatdan o'tish."""
    username: str = Field(
        ..., min_length=3, max_length=50,
        examples=["admin"], description="Login uchun nom"
    )
    password: str = Field(..., min_length=1, max_length=128)
    phone_number: str = Field(
        ..., min_length=7, max_length=20,
        examples=["90 1234567"],
        description="Telefon raqam (+998 avtomatik qo'shiladi)"
    )
    role: UserRole = Field(
        default=UserRole.REVIEWER,
        description="Foydalanuvchi roli (standart: reviewer)"
    )

    @field_validator("phone_number")
    @classmethod
    def _normalize_phone(cls, v: str) -> str:
        return normalize_phone(v)


class UserLogin(BaseModel):
    """Tizimga kirish — login (username) orqali."""
    username: str = Field(..., examples=["admin"])
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
    username: str
    role: str
    phone_number: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
