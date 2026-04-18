from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db
from ..core.security import create_access_token, get_current_user
from ..crud import user as user_crud
from ..schemas.auth import LoginRequest

router = APIRouter()


@router.post("/login")
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await user_crud.check_login(db, data.username, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Login yoki parol noto'g'ri")
    if not user.active:
        raise HTTPException(status_code=403, detail="Hisob bloklangan")
    token = create_access_token({"sub": str(user.id)})
    return {
        "token": token,
        "user": {
            "id":       user.id,
            "name":     user.name,
            "username": user.username,
            "role":     user.role,
        },
    }


@router.get("/me")
async def me(current_user=Depends(get_current_user)):
    return {
        "id":       current_user.id,
        "name":     current_user.name,
        "username": current_user.username,
        "role":     current_user.role,
    }