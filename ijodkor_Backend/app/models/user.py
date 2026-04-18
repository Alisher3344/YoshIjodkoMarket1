from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.sql import func
from ..core.database import Base


class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(200), nullable=False)
    username   = Column(String(100), unique=True, index=True, nullable=False)
    password   = Column(String(200), nullable=False)
    email      = Column(String(200), default="")
    role       = Column(String(50),  default="admin")
    active     = Column(Boolean,     default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())