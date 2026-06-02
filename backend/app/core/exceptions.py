"""
Custom HTTP exceptions used across the application.
"""

from fastapi import HTTPException, status


class NotFoundException(HTTPException):
    """404 — Resource not found."""
    def __init__(self, detail: str = "Ma'lumot topilmadi"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class BadRequestException(HTTPException):
    """400 — Invalid request data."""
    def __init__(self, detail: str = "Noto'g'ri so'rov"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class UnauthorizedException(HTTPException):
    """401 — Authentication required."""
    def __init__(self, detail: str = "Avtorizatsiya talab qilinadi"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class ForbiddenException(HTTPException):
    """403 — Insufficient permissions."""
    def __init__(self, detail: str = "Ruxsat yo'q"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class ConflictException(HTTPException):
    """409 — Resource already exists."""
    def __init__(self, detail: str = "Bu ma'lumot allaqachon mavjud"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)
