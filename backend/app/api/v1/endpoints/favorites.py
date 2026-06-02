"""
Favorite endpoints — sevimli kitoblar.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.favorite import FavoriteCreate, FavoriteRead, FavoriteReadDetailed
from app.crud.favorite import crud_favorite
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[FavoriteReadDetailed])
async def list_favorites(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Joriy foydalanuvchining sevimli kitoblari."""
    return await crud_favorite.get_user_favorites(db, current_user.id)


@router.post("/", response_model=FavoriteRead, status_code=201)
async def add_favorite(
    data: FavoriteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Kitobni sevimliga qo'shish."""
    if await crud_favorite.is_favorited(db, current_user.id, data.book_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Bu kitob allaqachon sevimlilar ro'yxatida",
        )
    return await crud_favorite.create(db, {
        "user_id": current_user.id,
        "book_id": data.book_id,
    })


@router.delete("/{book_id}", status_code=204)
async def remove_favorite(
    book_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Kitobni sevimlilardan o'chirish."""
    removed = await crud_favorite.remove_favorite(db, current_user.id, book_id)
    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bu kitob sevimlilar ro'yxatida topilmadi",
        )
