from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..core.database import get_db
from ..core.security import check_role, get_current_user
from ..crud import product as product_crud
from ..models.product import Product
from ..schemas.product import ProductCreate

router = APIRouter()


@router.get("/")
async def get_products(
    category: Optional[str] = Query(None),
    search:   Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Hamma mahsulotlar — ochiq"""
    return await product_crud.get_all(db, category=category, search=search)


@router.get("/my")
async def get_my_products(
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """O'z kabinetdagi mahsulotlar — login kerak"""
    result = await db.execute(
        select(Product).where(Product.user_id == current_user.id).order_by(Product.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{product_id}")
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    product = await product_crud.get_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
    return product


@router.post("/")
async def create_product(
    data: ProductCreate,
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Yangi mahsulot qo'shish — har qanday ro'yxatdan o'tgan user"""
    d = data.model_dump()

    # Agar user imkoniyati cheklangan bo'lsa — avtomatik tegishli maydonlar
    if current_user.is_disabled:
        d["student_type"] = "disabled"
        if current_user.card_number and not d.get("card_number"):
            d["card_number"] = current_user.card_number

    # Muallif ismi va maktab — avtomatik
    if not d.get("author"):
        d["author"] = current_user.full_name or current_user.name
    if not d.get("school"):
        d["school"] = current_user.school or ""

    # Avtor profil rasmi va kasallik haqida
    if current_user.avatar and not d.get("photo"):
        d["photo"] = current_user.avatar
    if current_user.illness_info and not d.get("story_uz"):
        d["story_uz"] = current_user.illness_info

    # user_id biriktirish
    product = Product(**d, user_id=current_user.id)
    db.add(product)
    await db.flush()
    await db.refresh(product)
    return product


@router.put("/{product_id}")
async def update_product(
    product_id: int,
    data: ProductCreate,
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mahsulotni tahrirlash — faqat egasi yoki admin"""
    product = await product_crud.get_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")

    is_admin = current_user.role in ("admin", "superadmin")
    if product.user_id != current_user.id and not is_admin:
        raise HTTPException(status_code=403, detail="Siz bu mahsulotning egasi emassiz")

    return await product_crud.update(db, product, data)


@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mahsulotni o'chirish — faqat egasi yoki admin"""
    product = await product_crud.get_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")

    is_admin = current_user.role in ("admin", "superadmin")
    if product.user_id != current_user.id and not is_admin:
        raise HTTPException(status_code=403, detail="Siz bu mahsulotning egasi emassiz")

    await product_crud.delete(db, product)
    return {"success": True}