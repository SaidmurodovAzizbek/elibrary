"""
Author CRUD operations.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models.author import Author


class CRUDAuthor(CRUDBase[Author]):

    async def search_by_name(
        self, db: AsyncSession, query: str, skip: int = 0, limit: int = 20
    ):
        """Ism bo'yicha qidirish (case-insensitive)."""
        result = await db.execute(
            select(Author)
            .where(Author.full_name.ilike(f"%{query}%"))
            .offset(skip).limit(limit)
        )
        return list(result.scalars().all())


crud_author = CRUDAuthor(Author)
