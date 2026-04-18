from typing import Optional
from pydantic import BaseModel


class UserCreate(BaseModel):
    """Yangi user yaratish — parol majburiy."""
    name:     str
    username: str
    password: str
    email:    str = ""
    role:     str = "admin"


class UserUpdate(BaseModel):
    """User yangilash — parol ixtiyoriy."""
    name:     str
    username: str
    email:    str = ""
    role:     str = "admin"
    password: Optional[str] = None  # None bo'lsa parol o'zgarmaydi


class UserResponse(BaseModel):
    """Frontendga qaytariladi — parol yuborilmaydi."""
    id:       int
    name:     str
    username: str
    email:    str
    role:     str
    active:   bool

    class Config:
        from_attributes = True  # SQLAlchemy modeldan o'qiydi