from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from ..models.order import Order, OrderItem, CustomOrder
from ..schemas.order import OrderCreate, CustomOrderCreate


async def create_order(db: AsyncSession, data: OrderCreate):
    order = Order(
        customer_name=data.customer_name,
        customer_phone=data.customer_phone,
        customer_address=data.customer_address,
        total=data.total,
        payment_method=data.payment_method,
    )
    db.add(order)
    await db.flush()

    for item in data.items:
        # item dict yoki object bo'lishi mumkin
        if isinstance(item, dict):
            product_id = item.get("product_id")
            name_uz    = item.get("name_uz", "")
            name_ru    = item.get("name_ru", "")
            price      = item.get("price", 0)
            qty        = item.get("qty", 1)
        else:
            product_id = item.product_id
            name_uz    = item.name_uz
            name_ru    = item.name_ru
            price      = item.price
            qty        = item.qty

        order_item = OrderItem(
            order_id   = order.id,
            product_id = product_id,
            name_uz    = name_uz,
            name_ru    = name_ru,
            price      = price,
            qty        = qty,
        )
        db.add(order_item)

    await db.flush()
    await db.refresh(order)
    return order


async def get_all_orders(db: AsyncSession):
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
    )
    return result.scalars().all()


async def get_order_by_id(db: AsyncSession, order_id: int):
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order_id)
    )
    return result.scalar_one_or_none()


async def update_order_status(db: AsyncSession, order: Order, status: str):
    order.status = status
    await db.flush()


async def create_custom_order(db: AsyncSession, data: CustomOrderCreate):
    order = CustomOrder(**data.model_dump())
    db.add(order)
    await db.flush()
    await db.refresh(order)
    return order


async def get_all_custom_orders(db: AsyncSession):
    result = await db.execute(
        select(CustomOrder).order_by(CustomOrder.created_at.desc())
    )
    return result.scalars().all()


async def get_custom_order_by_id(db: AsyncSession, order_id: int):
    result = await db.execute(
        select(CustomOrder).where(CustomOrder.id == order_id)
    )
    return result.scalar_one_or_none()


async def update_custom_order_status(db: AsyncSession, order: CustomOrder, status: str):
    order.status = status
    await db.flush()