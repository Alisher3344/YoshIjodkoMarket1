from typing import Any
from pydantic import BaseModel


class OrderCreate(BaseModel):
    """Yangi buyurtma yaratish."""
    customer_name:    str
    customer_phone:   str
    customer_address: str = ""
    items:            Any = []
    total:            float = 0
    payment_method:   str = "cash"


class OrderStatusUpdate(BaseModel):
    """Buyurtma statusini o'zgartirish."""
    status: str


class CustomOrderCreate(BaseModel):
    """Maxsus buyurtma yaratish."""
    customer_name:  str
    customer_phone: str
    description:    str = ""
    budget:         str = ""
    category:       str = ""


class CustomOrderStatusUpdate(BaseModel):
    """Maxsus buyurtma statusini o'zgartirish."""
    status: str