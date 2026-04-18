from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from ..models.product import Product
from ..schemas.product import ProductCreate


async def get_all(db: AsyncSession, category=None, search=None):
    q = select(Product)
    if category and category != "all":
        q = q.where(Product.category == category)
    if search:
        s = f"%{search.lower()}%"
        q = q.where(or_(
            Product.name_uz.ilike(s),
            Product.name_ru.ilike(s),
            Product.author.ilike(s),
        ))
    result = await db.execute(q)
    return result.scalars().all()


async def get_by_id(db: AsyncSession, product_id: int):
    result = await db.execute(select(Product).where(Product.id == product_id))
    return result.scalar_one_or_none()


async def create(db: AsyncSession, data: ProductCreate):
    product = Product(**data.model_dump())
    db.add(product)
    await db.flush()
    await db.refresh(product)
    return product


async def update(db: AsyncSession, product: Product, data: ProductCreate):
    for key, value in data.model_dump().items():
        setattr(product, key, value)
    await db.flush()
    await db.refresh(product)
    return product


async def delete(db: AsyncSession, product: Product):
    await db.delete(product)
    await db.flush()