from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.sql import func

from ..core.database import Base


role = Column(String(50), default="admin")
role = Column(String(50), default="viewer")
class User(Base):
    """
    Foydalanuvchilar jadvali.
    role: "admin" — hozircha faqat admin bor.
    active: False bo'lsa login bloklangan.
    """
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String, nullable=False)
    username   = Column(String, unique=True, index=True, nullable=False)
    password   = Column(String, nullable=False)      # bcrypt hash saqlanadi
    email      = Column(String, default="")
    role       = Column(String, default="admin")
    active     = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())