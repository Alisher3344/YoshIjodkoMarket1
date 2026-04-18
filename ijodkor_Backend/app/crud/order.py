from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from ..models.order import Order, OrderItem, CustomOrder
from ..schemas.order import OrderCreate, CustomOrderCreate


async def create_order(db: AsyncSession, data: OrderCreate) -> Order:
    order = Order(
        customer_name    = data.customer_name,
        customer_phone   = data.customer_phone,
        customer_address = data.customer_address,
        city             = data.city,
        total            = data.total,
        payment_method   = data.payment_method,
        note             = data.note,
    )
    db.add(order)
    await db.flush()

    for item in data.items:
        if isinstance(item, dict):
            oi = OrderItem(
                order_id     = order.id,
                product_id   = item.get("product_id"),
                name_uz      = item.get("name_uz", ""),
                name_ru      = item.get("name_ru", ""),
                price        = float(item.get("price", 0)),
                qty          = int(item.get("qty", 1)),
                image        = item.get("image", ""),
                author       = item.get("author", ""),
                school       = item.get("school", ""),
                card_number  = item.get("card_number", ""),
                student_type = item.get("student_type", "normal"),
            )
        else:
            oi = OrderItem(
                order_id     = order.id,
                product_id   = getattr(item, "product_id", None),
                name_uz      = getattr(item, "name_uz", ""),
                name_ru      = getattr(item, "name_ru", ""),
                price        = float(getattr(item, "price", 0)),
                qty          = int(getattr(item, "qty", 1)),
                image        = getattr(item, "image", ""),
                author       = getattr(item, "author", ""),
                school       = getattr(item, "school", ""),
                card_number  = getattr(item, "card_number", ""),
                student_type = getattr(item, "student_type", "normal"),
            )
        db.add(oi)

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


async def create_custom_order(db: AsyncSession, data: CustomOrderCreate) -> CustomOrder:
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