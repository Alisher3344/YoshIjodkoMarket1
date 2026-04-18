from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..core.security import check_role
from ..crud import product as product_crud
from ..schemas.product import ProductCreate

router = APIRouter()


@router.get("/")
async def get_products(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    return await product_crud.get_all(db, category=category, search=search)


@router.get("/{product_id}")
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    product = await product_crud.get_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
    return product


@router.post("/", dependencies=[Depends(check_role("admin"))])
async def create_product(data: ProductCreate, db: AsyncSession = Depends(get_db)):
    return await product_crud.create(db, data)


@router.put("/{product_id}", dependencies=[Depends(check_role("admin"))])
async def update_product(product_id: int, data: ProductCreate, db: AsyncSession = Depends(get_db)):
    product = await product_crud.get_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
    return await product_crud.update(db, product, data)


@router.delete("/{product_id}", dependencies=[Depends(check_role("admin"))])
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    product = await product_crud.get_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
    await product_crud.delete(db, product)
    return {"success": True}