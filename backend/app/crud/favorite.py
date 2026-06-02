"""
Favorite CRUD operations.
"""

from typing import List

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.crud.base import CRUDBase
from app.models.favorite import Favorite


class CRUDFavorite(CRUDBase[Favorite]):

    async def get_user_favorites(
        self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 20
    ) -> List[Favorite]:
        """Foydalanuvchi sevimli kitoblari."""
        result = await db.execute(
            select(Favorite)
            .options(selectinload(Favorite.book))
            .where(Favorite.user_id == user_id)
            .offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def is_favorited(
        self, db: AsyncSession, user_id: int, book_id: int
    ) -> bool:
        """Kitob allaqachon sevimliga qo'shilganmi?"""
        result = await db.execute(
            select(Favorite).where(
                and_(Favorite.user_id == user_id, Favorite.book_id == book_id)
            )
        )
        return result.scalar_one_or_none() is not None

    async def remove_favorite(
        self, db: AsyncSession, user_id: int, book_id: int
    ) -> bool:
        """Kitobni sevimlilardan o'chirish."""
        result = await db.execute(
            select(Favorite).where(
                and_(Favorite.user_id == user_id, Favorite.book_id == book_id)
            )
        )
        fav = result.scalar_one_or_none()
        if fav:
            await db.delete(fav)
            await db.flush()
            return True
        return False


crud_favorite = CRUDFavorite(Favorite)
