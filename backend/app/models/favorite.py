"""
Favorite model — foydalanuvchi sevimli kitoblari (User ↔ Book oraliq jadval).

Bir foydalanuvchi bitta kitobni faqat bir marta sevimliga qo'sha oladi (unique constraint).
"""

from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Favorite(Base):
    __tablename__ = "favorites"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    book_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    # ─── Relationships ────────────────────────────────
    user = relationship("User", back_populates="favorites")
    book = relationship("Book", back_populates="favorited_by")

    # ─── Bir kitobni ikki marta sevimliga qo'shish mumkin emas ─
    __table_args__ = (
        UniqueConstraint("user_id", "book_id", name="uq_user_book_favorite"),
    )

    def __repr__(self) -> str:
        return f"<Favorite(user={self.user_id}, book={self.book_id})>"
