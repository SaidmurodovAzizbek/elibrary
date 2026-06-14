"""
Auth endpoints — ro'yxatdan o'tish va tizimga kirish.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.user import UserRegister, UserLogin, TokenResponse, TokenRefresh, UserRead
from app.crud.user import crud_user
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token

router = APIRouter()


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    """Yangi foydalanuvchi ro'yxatdan o'tkazish."""
    if await crud_user.get_by_username(db, data.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Bu login allaqachon band",
        )
    if await crud_user.get_by_phone(db, data.phone_number):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Bu telefon raqam allaqachon ro'yxatdan o'tgan",
        )
    payload = data.model_dump()
    payload["role"] = payload["role"].value  # Enum -> str
    user = await crud_user.create_user(db, payload)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    """Tizimga kirish — login (username) orqali JWT token olish."""
    user = await crud_user.get_by_username(db, data.username)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Login yoki parol noto'g'ri",
        )
    claims = {"sub": str(user.id), "role": user.role}
    return TokenResponse(
        access_token=create_access_token(claims),
        refresh_token=create_refresh_token({"sub": str(user.id)}),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(data: TokenRefresh):
    """Refresh token orqali yangi access token olish."""
    payload = decode_token(data.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu refresh token emas",
        )
    return TokenResponse(
        access_token=create_access_token({"sub": payload["sub"]}),
        refresh_token=create_refresh_token({"sub": payload["sub"]}),
    )
