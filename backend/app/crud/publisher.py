"""
Publisher CRUD operations.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models.publisher import Publisher


class CRUDPublisher(CRUDBase[Publisher]):

    async def get_by_name(self, db: AsyncSession, name: str) -> Publisher | None:
        """Nom bo'yicha nashriyot topish."""
        result = await db.execute(
            select(Publisher).where(Publisher.name == name)
        )
        return result.scalar_one_or_none()


crud_publisher = CRUDPublisher(Publisher)
