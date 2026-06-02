"""
Publisher model — nashriyotlar jadvali.

Fields:
    - name: nashriyot nomi
    - founded_year: tashkil etilgan yili
    - image: logo / belgi
    - description: nashriyot haqida
    - books: nashr qilgan kitoblar (relationship)
"""

from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Publisher(Base):
    __tablename__ = "publishers"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    name: Mapped[str] = mapped_column(
        String(255), nullable=False, unique=True, index=True,
        comment="Nashriyot nomi"
    )
    founded_year: Mapped[int | None] = mapped_column(
        Integer, nullable=True,
        comment="Tashkil etilgan yili"
    )
    image: Mapped[str | None] = mapped_column(
        String(500), nullable=True,
        comment="Logo yoki belgi rasmi"
    )
    description: Mapped[str | None] = mapped_column(
        Text, nullable=True,
        comment="Nashriyot haqida ma'lumot"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    # ─── Relationships ────────────────────────────────
    books = relationship(
        "Book", back_populates="publisher", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Publisher(id={self.id}, name={self.name})>"
