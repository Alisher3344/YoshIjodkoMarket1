from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id           = Column(Integer, primary_key=True, index=True)
    order_id     = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id   = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    name_uz      = Column(String(300), nullable=False)
    name_ru      = Column(String(300), default="")
    price        = Column(Float, nullable=False)
    qty          = Column(Integer, default=1)
    image        = Column(String(500), default="")
    author       = Column(String(200), default="")
    school       = Column(String(200), default="")
    card_number  = Column(String(50),  default="")
    student_type = Column(String(20),  default="normal")

    order   = relationship("Order", back_populates="items")
    product = relationship("Product")


class Order(Base):
    __tablename__ = "orders"

    id               = Column(Integer, primary_key=True, index=True)
    customer_name    = Column(String(200), nullable=False)
    customer_phone   = Column(String(50),  nullable=False)
    customer_address = Column(String(500), default="")
    city             = Column(String(100), default="")
    total            = Column(Float,   default=0)
    status           = Column(String(50),  default="new")
    payment_method   = Column(String(50),  default="cash")
    note             = Column(Text,        default="")
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class CustomOrder(Base):
    __tablename__ = "custom_orders"

    id               = Column(Integer, primary_key=True, index=True)
    customer_name    = Column(String(200), nullable=False)
    customer_phone   = Column(String(50),  nullable=False)
    customer_address = Column(String(500), default="")
    order_type       = Column(String(100), default="")
    description      = Column(Text,        default="")
    budget           = Column(String(100), default="")
    deadline         = Column(String(100), default="")
    payment_method   = Column(String(100), default="")
    status           = Column(String(50),  default="new")
    created_at       = Column(DateTime(timezone=True), server_default=func.now())