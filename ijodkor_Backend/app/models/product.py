from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text
from sqlalchemy.sql import func

from ..core.database import Base


class Product(Base):
    """
    Mahsulotlar jadvali.
    Ikki tilli: _uz va _ru maydonlar.
    image — rasm URL manzili.
    """
    __tablename__ = "products"

    id         = Column(Integer, primary_key=True, index=True)
    name_uz    = Column(String, nullable=False)
    name_ru    = Column(String, default="")
    desc_uz    = Column(Text, default="")
    desc_ru    = Column(Text, default="")
    price      = Column(Float, nullable=False)
    stock      = Column(Integer, default=1)
    category   = Column(String, default="")
    author     = Column(String, default="")
    class_uz   = Column(String, default="")
    class_ru   = Column(String, default="")
    school     = Column(String, default="")
    district   = Column(String, default="")
    phone      = Column(String, default="")
    image      = Column(String, default="")
    is_new     = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())