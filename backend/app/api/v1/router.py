"""
API v1 — barcha endpoint-larni birlashtiruvchi router.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, books, authors, publishers, favorites

api_v1_router = APIRouter()

api_v1_router.include_router(auth.router,       prefix="/auth",       tags=["Auth"])
api_v1_router.include_router(books.router,      prefix="/books",      tags=["Kitoblar"])
api_v1_router.include_router(authors.router,    prefix="/authors",    tags=["Mualliflar"])
api_v1_router.include_router(publishers.router, prefix="/publishers", tags=["Nashriyotlar"])
api_v1_router.include_router(favorites.router,  prefix="/favorites",  tags=["Sevimlilar"])
