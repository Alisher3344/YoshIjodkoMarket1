import httpx
import base64
from ..core.config import settings


async def send_telegram(message: str, image_base64: str = None, image_type: str = None) -> bool:
    if not settings.TELEGRAM_TOKEN or not settings.TELEGRAM_CHAT_ID:
        return False

    token   = settings.TELEGRAM_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID

    try:
        async with httpx.AsyncClient() as client:

            # 1 — Avval rasm + matn caption sifatida yuboriladi
            if image_base64 and image_type:
                img_data = image_base64.split(",")[1] if "," in image_base64 else image_base64
                img_bytes = base64.b64decode(img_data)
                ext = image_type.split("/")[-1] if "/" in image_type else "jpg"

                await client.post(
                    f"https://api.telegram.org/bot{token}/sendPhoto",
                    data={
                        "chat_id":    chat_id,
                        "caption":    message,
                        "parse_mode": "HTML",
                    },
                    files={"photo": (f"image.{ext}", img_bytes, image_type)},
                )

            # 2 — Rasm yo'q bo'lsa — faqat matn
            else:
                await client.post(
                    f"https://api.telegram.org/bot{token}/sendMessage",
                    json={
                        "chat_id":    chat_id,
                        "text":       message,
                        "parse_mode": "HTML",
                    },
                )

        return True
    except Exception as e:
        print(f"Telegram error: {e}")
        return False