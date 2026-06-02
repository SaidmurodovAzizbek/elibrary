"""
Book endpoints — kitoblar CRUD.
"""

from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.book import BookCreate, BookUpdate, BookRead, BookReadDetailed
from app.crud.book import crud_book
from app.core.exceptions import NotFoundException

router = APIRouter()


@router.get("/", response_model=List[BookReadDetailed])
async def list_books(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Kitoblar ro'yxati (qidirish bilan)."""
    if search:
        return await crud_book.search_by_title(db, search, skip, limit)
    return await crud_book.get_multi_detailed(db, skip, limit)


@router.get("/{book_id}", response_model=BookReadDetailed)
async def get_book(book_id: int, db: AsyncSession = Depends(get_db)):
    """Bitta kitob detallari."""
    book = await crud_book.get_detailed(db, book_id)
    if not book:
        raise NotFoundException("Kitob topilmadi")
    return book


@router.post("/", response_model=BookRead, status_code=201)
async def create_book(data: BookCreate, db: AsyncSession = Depends(get_db)):
    """Yangi kitob yaratish."""
    return await crud_book.create(db, data.model_dump())


@router.put("/{book_id}", response_model=BookRead)
async def update_book(
    book_id: int, data: BookUpdate, db: AsyncSession = Depends(get_db)
):
    """Kitob ma'lumotlarini yangilash."""
    book = await crud_book.get(db, book_id)
    if not book:
        raise NotFoundException("Kitob topilmadi")
    return await crud_book.update(db, book, data.model_dump(exclude_unset=True))


@router.delete("/{book_id}", status_code=204)
async def delete_book(book_id: int, db: AsyncSession = Depends(get_db)):
    """Kitobni o'chirish."""
    deleted = await crud_book.delete(db, book_id)
    if not deleted:
        raise NotFoundException("Kitob topilmadi")
