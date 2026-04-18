# Barcha schemalar shu fayldan import qilinadi
# Ishlatish: from app.schemas import ProductCreate, OrderCreate ...

from .auth    import LoginRequest, TokenResponse
from .product import ProductCreate, ProductResponse
from .order   import (
    OrderCreate,
    OrderStatusUpdate,
    CustomOrderCreate,
    CustomOrderStatusUpdate,
)
from .user    import UserCreate, UserUpdate, UserResponse