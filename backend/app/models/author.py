"""
Author model — mualliflar jadvali.

Fields:
    - full_name: muallif ismi
    - birth_year: tug'ilgan yili
    - death_year: vafot etgan yili (optional)
    - description: muallif haqida
    - image: muallif rasmi
    - books: yozgan kitoblari (relationship)
"""

from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Author(Base):
    __tablename__ = "authors"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    full_name: Mapped[str] = mapped_column(
        String(255), nullable=False, index=True,
        comment="Muallif to'liq ismi"
    )
    birth_year: Mapped[int | None] = mapped_column(
        Integer, nullable=True,
        comment="Tug'ilgan yili"
    )
    death_year: Mapped[int | None] = mapped_column(
        Integer, nullable=True,
        comment="Vafot etgan yili (agar vafot etgan bo'lsa)"
    )
    description: Mapped[str | None] = mapped_column(
        Text, nullable=True,
        comment="Muallif haqida qisqacha ma'lumot"
    )
    image: Mapped[str | None] = mapped_column(
        String(500), nullable=True,
        comment="Muallif rasmining URL yoki fayl nomi"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    # ─── Relationships ────────────────────────────────
    books = relationship(
        "Book", back_populates="author", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Author(id={self.id}, name={self.full_name})>"
