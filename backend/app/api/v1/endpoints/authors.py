"""
Author endpoints — mualliflar CRUD.
"""

from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.author import AuthorCreate, AuthorUpdate, AuthorRead
from app.crud.author import crud_author
from app.core.exceptions import NotFoundException
from app.core.security import get_current_admin

router = APIRouter()


@router.get("/", response_model=List[AuthorRead])
async def list_authors(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Mualliflar ro'yxati."""
    if search:
        return await crud_author.search_by_name(db, search, skip, limit)
    return await crud_author.get_multi(db, skip, limit)


@router.get("/{author_id}", response_model=AuthorRead)
async def get_author(author_id: int, db: AsyncSession = Depends(get_db)):
    """Bitta muallif detallari."""
    author = await crud_author.get(db, author_id)
    if not author:
        raise NotFoundException("Muallif topilmadi")
    return author


@router.post(
    "/", response_model=AuthorRead, status_code=201,
    dependencies=[Depends(get_current_admin)],
)
async def create_author(data: AuthorCreate, db: AsyncSession = Depends(get_db)):
    """Yangi muallif yaratish (faqat admin)."""
    return await crud_author.create(db, data.model_dump())


@router.put(
    "/{author_id}", response_model=AuthorRead,
    dependencies=[Depends(get_current_admin)],
)
async def update_author(
    author_id: int, data: AuthorUpdate, db: AsyncSession = Depends(get_db)
):
    """Muallif ma'lumotlarini yangilash (faqat admin)."""
    author = await crud_author.get(db, author_id)
    if not author:
        raise NotFoundException("Muallif topilmadi")
    return await crud_author.update(db, author, data.model_dump(exclude_unset=True))


@router.delete(
    "/{author_id}", status_code=204,
    dependencies=[Depends(get_current_admin)],
)
async def delete_author(author_id: int, db: AsyncSession = Depends(get_db)):
    """Muallifni o'chirish (faqat admin)."""
    deleted = await crud_author.delete(db, author_id)
    if not deleted:
        raise NotFoundException("Muallif topilmadi")
