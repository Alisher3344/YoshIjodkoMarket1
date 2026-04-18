from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from ..utils.telegram import send_telegram

router = APIRouter()


class ContactMessage(BaseModel):
    name:         str
    phone:        str
    message:      str
    image:        Optional[str] = None
    image_type:   Optional[str] = None


@router.post("/")
async def send_contact(data: ContactMessage):
    text = (
        f"📩 <b>Yangi xabar!</b>\n\n"
        f"👤 <b>Ism:</b> {data.name}\n"
        f"📞 <b>Telefon:</b> {data.phone}\n"
        f"💬 <b>Xabar:</b> {data.message}"
    )
    await send_telegram(text, data.image, data.image_type)
    return {"success": True}