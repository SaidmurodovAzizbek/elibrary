"""
Book model — kitoblar jadvali.

Fields:
    - title: kitob nomi
    - author: muallif (FK → authors)
    - published_year: nashr qilingan yili
    - publisher: nashriyot (FK → publishers)
    - description: kitob haqida
    - pages: betlar soni
    - sold_count: sotilgan soni
    - price: narxi
    - rating: reyting (0.0 — 5.0)
    - image: kitob muqovasi
"""

from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    title: Mapped[str] = mapped_column(
        String(500), nullable=False, index=True,
        comment="Kitob nomi"
    )
    description: Mapped[str | None] = mapped_column(
        Text, nullable=True,
        comment="Kitob haqida qisqacha ma'lumot"
    )
    published_year: Mapped[int | None] = mapped_column(
        Integer, nullable=True,
        comment="Nashr qilingan yili"
    )
    pages: Mapped[int | None] = mapped_column(
        Integer, nullable=True,
        comment="Betlar soni"
    )
    sold_count: Mapped[int] = mapped_column(
        Integer, default=0,
        comment="Sotilgan nusxalar soni"
    )
    price: Mapped[float] = mapped_column(
        Numeric(10, 2), default=0.00,
        comment="Kitob narxi (so'mda)"
    )
    rating: Mapped[float] = mapped_column(
        Float, default=0.0,
        comment="Reyting (0.0 — 5.0)"
    )
    image: Mapped[str | None] = mapped_column(
        String(500), nullable=True,
        comment="Kitob muqovasi rasmi URL yoki fayl nomi"
    )

    # ─── Foreign Keys ─────────────────────────────────
    author_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("authors.id", ondelete="CASCADE"), nullable=False,
        comment="Muallif ID"
    )
    publisher_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("publishers.id", ondelete="SET NULL"), nullable=True,
        comment="Nashriyot ID"
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
    author = relationship("Author", back_populates="books")
    publisher = relationship("Publisher", back_populates="books")
    favorited_by = relationship(
        "Favorite", back_populates="book", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Book(id={self.id}, title={self.title})>"
