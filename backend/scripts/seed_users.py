"""
Boshlang'ich foydalanuvchilarni (admin + reviewer) yaratuvchi skript.

Ishga tushirish (backend papkasidan):
    .venv/Scripts/python.exe -m scripts.seed_users

Idempotent — mavjud loginlarni qayta yaratmaydi.
"""

import asyncio

from app.database import async_session
from app.crud.user import crud_user
from app.schemas.user import normalize_phone

# (username, role, password, raw_phone)
SEED_USERS = [
    ("admin", "admin", "1", "90 1234567"),
    ("review", "reviewer", "1", "91 1234567"),
]


async def seed() -> None:
    async with async_session() as db:
        for username, role, password, raw_phone in SEED_USERS:
            if await crud_user.get_by_username(db, username):
                print(f"[skip] '{username}' allaqachon mavjud")
                continue
            user = await crud_user.create_user(db, {
                "username": username,
                "role": role,
                "password": password,
                "phone_number": normalize_phone(raw_phone),
            })
            await db.commit()
            print(f"[ok]   '{user.username}' yaratildi "
                  f"(role={user.role}, phone={user.phone_number})")


if __name__ == "__main__":
    asyncio.run(seed())
