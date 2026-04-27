"""
Telegram Mini App + Bot uchun autentifikatsiya endpointlari.

2 ta entry point bor:
  1) POST /api/telegram/bot-auth      — bot serveri (contact ulashilganda) chaqiradi
  2) POST /api/telegram/webapp-auth  — Mini App ichidan initData yuboradi

Ikkalasi ham foydalanuvchini topadi/yaratadi va JWT token qaytaradi.
"""
import secrets
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..core.config import settings
from ..core.database import get_db
from ..core.security import (
    create_access_token,
    get_current_user,
    hash_password,
)
from ..models.user import User
from ..models.student import Student
from ..models.school import School
from ..schemas.telegram import (
    TelegramBotAuth,
    TelegramWebAppAuth,
    TelegramProfileUpdate,
    TelegramStudentRegister,
)
from ..utils.telegram import verify_webapp_init_data
from ..crud import student as student_crud

router = APIRouter()


def user_dict(u: User) -> dict:
    return {
        "id":          u.id,
        "name":        u.name or "",
        "full_name":   u.full_name or "",
        "username":    u.username,
        "phone":       u.phone or "",
        "avatar":      u.avatar or "",
        "role":        u.role,
        "telegram_id": u.telegram_id,
    }


async def _get_or_create_tg_user(
    db: AsyncSession,
    *,
    telegram_id: int,
    phone: str = "",
    first_name: str = "",
    last_name: str = "",
    tg_username: str = None,
) -> User:
    """telegram_id bo'yicha topadi yoki yangi user yaratadi.
    Yangi yaratilsa: random parol, role='user'."""
    # 1) telegram_id bo'yicha
    res = await db.execute(select(User).where(User.telegram_id == telegram_id))
    user = res.scalar_one_or_none()

    if user:
        # Faol ma'lumotlarni yangilash (telefon yangilangan bo'lsa)
        changed = False
        if phone and phone != (user.phone or ""):
            user.phone = phone
            changed = True
        if first_name and not user.name:
            user.name = first_name
            changed = True
        if last_name and not user.full_name:
            user.full_name = last_name
            changed = True
        if changed:
            await db.flush()
            await db.refresh(user)
        return user

    # 2) Telefon bo'yicha (eski user'ni Telegram'ga bog'lash)
    if phone:
        only_digits = "".join(ch for ch in phone if ch.isdigit())
        if only_digits:
            res = await db.execute(
                select(User).where(User.username == only_digits)
            )
            existing = res.scalar_one_or_none()
            if existing and not existing.telegram_id:
                existing.telegram_id = telegram_id
                if first_name and not existing.name:
                    existing.name = first_name
                if last_name and not existing.full_name:
                    existing.full_name = last_name
                await db.flush()
                await db.refresh(existing)
                return existing

    # 3) Yangi yaratish
    base_username = (
        tg_username
        or "".join(ch for ch in (phone or "") if ch.isdigit())
        or f"tg_{telegram_id}"
    )
    # Username uniqueness — agar band bo'lsa, suffix qo'shamiz
    candidate = base_username
    suffix = 0
    while True:
        res = await db.execute(select(User).where(User.username == candidate))
        if not res.scalar_one_or_none():
            break
        suffix += 1
        candidate = f"{base_username}_{suffix}"

    new_user = User(
        name=first_name or candidate,
        full_name=last_name or "",
        username=candidate,
        password=hash_password(secrets.token_urlsafe(16)),
        phone=phone or "",
        role="user",
        active=True,
        telegram_id=telegram_id,
    )
    db.add(new_user)
    await db.flush()
    await db.refresh(new_user)
    return new_user


@router.post("/bot-auth")
async def bot_auth(
    data: TelegramBotAuth,
    x_bot_token: str = Header(default=""),
    db: AsyncSession = Depends(get_db),
):
    """Bot serveri chaqiradi (contact ulashilganda). X-Bot-Token header
    haqiqiy bot tokenidan iborat bo'lishi shart."""
    if not settings.TELEGRAM_BOT_TOKEN:
        raise HTTPException(
            status_code=500, detail="TELEGRAM_BOT_TOKEN sozlanmagan"
        )
    if not x_bot_token or x_bot_token != settings.TELEGRAM_BOT_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid bot token")

    user = await _get_or_create_tg_user(
        db,
        telegram_id=data.telegram_id,
        phone=data.phone,
        first_name=data.first_name or "",
        last_name=data.last_name or "",
        tg_username=data.username,
    )

    token = create_access_token({"sub": str(user.id)})
    return {"token": token, "user": user_dict(user)}


@router.post("/webapp-auth")
async def webapp_auth(
    data: TelegramWebAppAuth,
    db: AsyncSession = Depends(get_db),
):
    """Mini App'dan kelgan initData ni HMAC bilan tekshiradi va token qaytaradi.
    Foydalanuvchi avval bot orqali contact ulashgan bo'lsa, telefon raqami bilan
    keladi (chunki tg_id mavjud). Aks holda yangi user yaratiladi (telefonsiz)."""
    if not settings.TELEGRAM_BOT_TOKEN:
        raise HTTPException(
            status_code=500, detail="TELEGRAM_BOT_TOKEN sozlanmagan"
        )

    parsed = verify_webapp_init_data(data.init_data)
    if not parsed or not parsed.get("user"):
        raise HTTPException(
            status_code=401, detail="Invalid Telegram initData"
        )

    tg_user = parsed["user"]
    telegram_id = int(tg_user.get("id"))
    first_name = tg_user.get("first_name", "") or ""
    last_name = tg_user.get("last_name", "") or ""
    tg_username = tg_user.get("username")

    user = await _get_or_create_tg_user(
        db,
        telegram_id=telegram_id,
        phone="",  # Mini App initData'da phone bo'lmaydi (bot yuboradi)
        first_name=first_name,
        last_name=last_name,
        tg_username=tg_username,
    )

    token = create_access_token({"sub": str(user.id)})
    return {
        "token": token,
        "user": user_dict(user),
        "needs_profile": not bool(user.name and user.phone),
    }


@router.put("/profile")
async def update_profile(
    data: TelegramProfileUpdate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mini App'da foydalanuvchi ism/familiya kiritsa."""
    payload = data.model_dump(exclude_unset=True)
    for k, v in payload.items():
        if v is not None:
            setattr(current_user, k, v)
    await db.flush()
    await db.refresh(current_user)
    return user_dict(current_user)


@router.get("/me")
async def me(current_user=Depends(get_current_user)):
    return user_dict(current_user)


# ─── O'quvchi (Student) — Telegram Mini App ro'yxati ─────────────────────────

def student_dict(s: Student) -> dict:
    return {
        "id":        s.id,
        "name":      s.name or "",
        "full_name": s.full_name or "",
        "grade":     s.grade or "",
        "avatar":    s.avatar or "",
        "school_id": s.school_id,
        "status":    s.status,
        "active":    s.active,
    }


@router.get("/student-me")
async def get_my_student(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mini App ochilganda chaqiriladi.
    Qaytaradi: {status: 'pending'|'approved'|'rejected'|null, student: {...} | null}
    null bo'lsa — foydalanuvchi hali ariza yubormagan, ro'yxatdan o'tish formasi ko'rsatiladi.
    """
    student = await student_crud.get_by_user(db, current_user.id)
    if not student:
        return {"status": None, "student": None}
    return {
        "status":  student.status,
        "student": student_dict(student),
    }


@router.post("/student-register")
async def register_student(
    data: TelegramStudentRegister,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """O'quvchi ariza yuboradi. status='pending' qilinadi.
    Maktab admini tasdiqlaganda 'approved' bo'ladi."""
    if not data.name.strip():
        raise HTTPException(status_code=400, detail="Ism kiritilishi shart")
    if not data.school_id:
        raise HTTPException(status_code=400, detail="Maktabni tanlang")

    # Maktab mavjudligini tekshirish
    res = await db.execute(select(School).where(School.id == data.school_id))
    school = res.scalar_one_or_none()
    if not school:
        raise HTTPException(status_code=404, detail="Maktab topilmadi")

    # Avval ariza yuborganmi?
    existing = await student_crud.get_by_user(db, current_user.id)
    if existing:
        if existing.status == "pending":
            raise HTTPException(
                status_code=409,
                detail="Arizangiz allaqachon yuborilgan, kuting",
            )
        if existing.status == "approved":
            raise HTTPException(
                status_code=409,
                detail="Siz allaqachon ro'yxatdan o'tgansiz",
            )
        if existing.status == "rejected":
            raise HTTPException(
                status_code=409,
                detail="Arizangiz rad etilgan. Maktab ma'muriyati bilan bog'laning.",
            )

    new_student = Student(
        user_id=current_user.id,
        admin_id=None,
        school_id=data.school_id,
        school=school.name,
        name=data.name.strip(),
        full_name=data.full_name.strip(),
        grade=data.grade.strip(),
        avatar=data.avatar or "",
        phone=current_user.phone or "",
        status="pending",
        active=False,  # tasdiqlanguncha sayt'da ko'rinmaydi
    )
    db.add(new_student)
    await db.flush()
    await db.refresh(new_student)
    return {
        "status":  new_student.status,
        "student": student_dict(new_student),
    }
