from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..core.database import get_db
from ..core.security import get_current_user, require_admin
from ..crud import student as student_crud
from ..schemas.student import StudentCreate, StudentUpdate
from ..models.product import Product
from ..models.student import Student

router = APIRouter()


def _can_manage(student: Student, user) -> bool:
    """Foydalanuvchi shu o'quvchini boshqara oladimi?
    - SuperAdmin har doim ha
    - O'quvchini yaratgan admin (admin_id mos kelsa) — ha
    - Bir maktabga biriktirilgan boshqa adminlar ham — ha (school_id mos kelsa)
    """
    if user.role == "superadmin":
        return True
    if student.admin_id == user.id:
        return True
    if (
        student.school_id is not None
        and user.school_id is not None
        and student.school_id == user.school_id
    ):
        return True
    return False


@router.get("/")
async def list_students(db: AsyncSession = Depends(get_db)):
    return await student_crud.get_all(db)


@router.get("/{student_id}")
async def get_student(student_id: int, db: AsyncSession = Depends(get_db)):
    student = await student_crud.get_by_id(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="O'quvchi topilmadi")
    return student


@router.get("/{student_id}/products")
async def student_products(student_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).where(Product.student_id == student_id).order_by(Product.id.desc())
    )
    return result.scalars().all()


@router.get("/my/list")
async def my_students(
    current_user=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Agar admin maktabga biriktirilgan bo'lsa — shu maktabning hamma o'quvchilarini qaytaradi.
    Aks holda — faqat o'zi yaratgan o'quvchilarini (eski adminlar uchun)."""
    if current_user.school_id:
        return await student_crud.get_by_school(db, current_user.school_id)
    return await student_crud.get_by_admin(db, current_user.id)


@router.post("/")
async def create_student(
    data: StudentCreate,
    current_user=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """O'quvchi yaratilganda avtomatik shu adminning maktabiga bog'lanadi."""
    return await student_crud.create(
        db,
        admin_id=current_user.id,
        data=data,
        school_id=current_user.school_id,
    )


@router.put("/{student_id}")
async def update_student(
    student_id: int,
    data: StudentUpdate,
    current_user=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    student = await student_crud.get_by_id(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="O'quvchi topilmadi")

    if not _can_manage(student, current_user):
        raise HTTPException(
            status_code=403,
            detail="Faqat o'z maktabingizning o'quvchilarini tahrirlashingiz mumkin",
        )

    return await student_crud.update(db, student, data)


@router.delete("/{student_id}")
async def delete_student(
    student_id: int,
    current_user=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    student = await student_crud.get_by_id(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="O'quvchi topilmadi")

    if not _can_manage(student, current_user):
        raise HTTPException(
            status_code=403,
            detail="Faqat o'z maktabingizning o'quvchilarini o'chirishingiz mumkin",
        )

    await student_crud.delete(db, student)
    return {"success": True}


@router.patch("/{student_id}/toggle")
async def toggle_student(
    student_id: int,
    current_user=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    student = await student_crud.get_by_id(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="O'quvchi topilmadi")

    if not _can_manage(student, current_user):
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")

    updated = await student_crud.toggle_active(db, student)
    return {"success": True, "active": updated.active}
