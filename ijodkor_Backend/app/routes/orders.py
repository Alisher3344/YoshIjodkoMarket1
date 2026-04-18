from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..core.security import check_role
from ..crud import order as order_crud
from ..schemas.order import OrderCreate, OrderStatusUpdate

router = APIRouter()


@router.post("/")
async def create_order(data: OrderCreate, db: AsyncSession = Depends(get_db)):
    return await order_crud.create_order(db, data)


@router.get("/", dependencies=[Depends(check_role("moderator"))])
async def get_orders(db: AsyncSession = Depends(get_db)):
    return await order_crud.get_all_orders(db)


@router.put("/{order_id}/status", dependencies=[Depends(check_role("moderator"))])
async def update_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
):
    order = await order_crud.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Buyurtma topilmadi")
    await order_crud.update_order_status(db, order, data.status)
    return {"success": True}