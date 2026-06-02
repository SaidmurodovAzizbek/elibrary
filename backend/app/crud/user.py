"""
User CRUD operations.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models.user import User
from app.core.security import hash_password


class CRUDUser(CRUDBase[User]):

    async def get_by_phone(self, db: AsyncSession, phone_number: str) -> User | None:
        """Telefon raqam bo'yicha foydalanuvchi topish."""
        result = await db.execute(
            select(User).where(User.phone_number == phone_number)
        )
        return result.scalar_one_or_none()

    async def create_user(self, db: AsyncSession, user_data: dict) -> User:
        """Yangi foydalanuvchi yaratish (parolni hash qiladi)."""
        user_data["hashed_password"] = hash_password(user_data.pop("password"))
        return await self.create(db, user_data)


crud_user = CRUDUser(User)
