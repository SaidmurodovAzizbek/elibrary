"""
eLibrary Backend — FastAPI Application Entry Point.

Run with:
    uvicorn app.main:app --reload
"""

from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.api.v1.router import api_v1_router


# ─── Lifespan (startup / shutdown) ────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — startup & shutdown events."""
    print(f"[START] {settings.APP_NAME} v{settings.APP_VERSION} starting ...")
    yield
    print(f"[STOP] {settings.APP_NAME} shutting down ...")


# ─── FastAPI Application ──────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="eLibrary - Online kutubxona API",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ─── CORS Middleware ──────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Static / Media files ────────────────────────────
os.makedirs(settings.MEDIA_DIR, exist_ok=True)
app.mount("/media", StaticFiles(directory=settings.MEDIA_DIR), name="media")

# ─── API Routers ──────────────────────────────────────
app.include_router(api_v1_router, prefix="/api/v1")


# ─── Health-check ─────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health_check():
    """Simple health-check endpoint."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }
