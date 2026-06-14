"""
User model — foydalanuvchilar jadvali.

Fields:
    - username: login uchun nom (unique), masalan: admin
    - role: foydalanuvchi roli — "admin" yoki "reviewer"
    - phone_number: telefon raqam (unique), masalan: +998901234567
    - hashed_password: parol (hash)
    - favorites: sevimli kitoblar (Favorite orqali)
"""

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    username: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False, index=True,
        comment="Login uchun nom, masalan: admin"
    )
    role: Mapped[str] = mapped_column(
        String(20), nullable=False, default="reviewer",
        comment="Foydalanuvchi roli: 'admin' yoki 'reviewer'"
    )
    phone_number: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False, index=True,
        comment="Telefon raqam, masalan: +998901234567"
    )
    hashed_password: Mapped[str] = mapped_column(
        String(255), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # ─── Relationships ────────────────────────────────
    favorites = relationship(
        "Favorite", back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, username={self.username}, role={self.role})>"
