from typing import Any, Optional
from pydantic import BaseModel


class OrderCreate(BaseModel):
    customer_name:    str
    customer_phone:   str
    customer_address: str   = ""
    city:             str   = ""
    items:            Any   = []
    total:            float = 0
    payment_method:   str   = "cash"
    note:             str   = ""


class OrderStatusUpdate(BaseModel):
    status: str


class CustomOrderCreate(BaseModel):
    customer_name:    str
    customer_phone:   str
    customer_address: str = ""
    order_type:       str = ""
    description:      str = ""
    budget:           str = ""
    deadline:         str = ""
    payment_method:   str = ""


class CustomOrderStatusUpdate(BaseModel):
    status: str