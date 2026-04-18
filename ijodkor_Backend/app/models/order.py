from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..core.database import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id         = Column(Integer, primary_key=True, index=True)
    order_id   = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    name_uz    = Column(String(300), nullable=False)
    name_ru    = Column(String(300), default="")
    price      = Column(Float, nullable=False)
    qty        = Column(Integer, nullable=False, default=1)

    order   = relationship("Order", back_populates="items")
    product = relationship("Product")


class Order(Base):
    __tablename__ = "orders"

    id               = Column(Integer, primary_key=True, index=True)
    customer_name    = Column(String(200), nullable=False)
    customer_phone   = Column(String(50), nullable=False)
    customer_address = Column(String(500), default="")
    total            = Column(Float, default=0)
    status           = Column(String(50), default="new")
    payment_method   = Column(String(50), default="cash")
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class CustomOrder(Base):
    __tablename__ = "custom_orders"

    id             = Column(Integer, primary_key=True, index=True)
    customer_name  = Column(String(200), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    description    = Column(Text, default="")
    budget         = Column(String(100), default="")
    category       = Column(String(100), default="")
    status         = Column(String(50), default="new")
    created_at     = Column(DateTime(timezone=True), server_default=func.now())