import base64
import httpx
from ..core.config import settings


async def send_telegram(
    message: str,
    image_base64: str = None,
    image_type: str = None
) -> bool:
    if not settings.TELEGRAM_TOKEN or not settings.TELEGRAM_CHAT_ID:
        return False

    token   = settings.TELEGRAM_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            if image_base64 and image_type:
                raw  = image_base64.split(",")[1] if "," in image_base64 else image_base64
                data = base64.b64decode(raw)
                ext  = image_type.split("/")[-1] if "/" in image_type else "jpg"
                await client.post(
                    f"https://api.telegram.org/bot{token}/sendPhoto",
                    data={"chat_id": chat_id, "caption": message, "parse_mode": "HTML"},
                    files={"photo": (f"img.{ext}", data, image_type)},
                )
            else:
                await client.post(
                    f"https://api.telegram.org/bot{token}/sendMessage",
                    json={"chat_id": chat_id, "text": message, "parse_mode": "HTML"},
                )
        return True
    except Exception as e:
        print(f"[Telegram xato]: {e}")
        return False