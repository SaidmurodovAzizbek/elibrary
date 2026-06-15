"""
Publisher endpoints — nashriyotlar CRUD.
"""

from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.publisher import PublisherCreate, PublisherUpdate, PublisherRead
from app.crud.publisher import crud_publisher
from app.core.exceptions import NotFoundException
from app.core.security import get_current_admin

router = APIRouter()


@router.get("/", response_model=List[PublisherRead])
async def list_publishers(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Nashriyotlar ro'yxati."""
    return await crud_publisher.get_multi(db, skip, limit)


@router.get("/{publisher_id}", response_model=PublisherRead)
async def get_publisher(publisher_id: int, db: AsyncSession = Depends(get_db)):
    """Bitta nashriyot detallari."""
    pub = await crud_publisher.get(db, publisher_id)
    if not pub:
        raise NotFoundException("Nashriyot topilmadi")
    return pub


@router.post(
    "/", response_model=PublisherRead, status_code=201,
    dependencies=[Depends(get_current_admin)],
)
async def create_publisher(data: PublisherCreate, db: AsyncSession = Depends(get_db)):
    """Yangi nashriyot yaratish (faqat admin)."""
    return await crud_publisher.create(db, data.model_dump())


@router.put(
    "/{publisher_id}", response_model=PublisherRead,
    dependencies=[Depends(get_current_admin)],
)
async def update_publisher(
    publisher_id: int, data: PublisherUpdate, db: AsyncSession = Depends(get_db)
):
    """Nashriyot ma'lumotlarini yangilash (faqat admin)."""
    pub = await crud_publisher.get(db, publisher_id)
    if not pub:
        raise NotFoundException("Nashriyot topilmadi")
    return await crud_publisher.update(db, pub, data.model_dump(exclude_unset=True))


@router.delete(
    "/{publisher_id}", status_code=204,
    dependencies=[Depends(get_current_admin)],
)
async def delete_publisher(publisher_id: int, db: AsyncSession = Depends(get_db)):
    """Nashriyotni o'chirish (faqat admin)."""
    deleted = await crud_publisher.delete(db, publisher_id)
    if not deleted:
        raise NotFoundException("Nashriyot topilmadi")
