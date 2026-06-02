"""
Book CRUD operations.
"""

from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.crud.base import CRUDBase
from app.models.book import Book


class CRUDBook(CRUDBase[Book]):

    async def get_detailed(self, db: AsyncSession, id: int) -> Book | None:
        """Kitob — muallif va nashriyot bilan birga."""
        result = await db.execute(
            select(Book)
            .options(selectinload(Book.author), selectinload(Book.publisher))
            .where(Book.id == id)
        )
        return result.scalar_one_or_none()

    async def get_multi_detailed(
        self, db: AsyncSession, skip: int = 0, limit: int = 20
    ) -> List[Book]:
        """Kitoblar ro'yxati — muallif va nashriyot bilan."""
        result = await db.execute(
            select(Book)
            .options(selectinload(Book.author), selectinload(Book.publisher))
            .offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def search_by_title(
        self, db: AsyncSession, query: str, skip: int = 0, limit: int = 20
    ) -> List[Book]:
        """Nom bo'yicha qidirish."""
        result = await db.execute(
            select(Book)
            .options(selectinload(Book.author), selectinload(Book.publisher))
            .where(Book.title.ilike(f"%{query}%"))
            .offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def get_by_author(
        self, db: AsyncSession, author_id: int, skip: int = 0, limit: int = 20
    ) -> List[Book]:
        """Muallif bo'yicha kitoblar."""
        result = await db.execute(
            select(Book)
            .options(selectinload(Book.author), selectinload(Book.publisher))
            .where(Book.author_id == author_id)
            .offset(skip).limit(limit)
        )
        return list(result.scalars().all())


crud_book = CRUDBook(Book)
