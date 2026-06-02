"""
Models package — imports all models so Alembic can discover them.
"""

from app.models.user import User
from app.models.author import Author
from app.models.publisher import Publisher
from app.models.book import Book
from app.models.favorite import Favorite

__all__ = ["User", "Author", "Publisher", "Book", "Favorite"]
