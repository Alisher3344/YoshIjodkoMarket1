from pydantic import BaseModel


class LoginRequest(BaseModel):
    """Login uchun — username va parol."""
    username: str
    password: str


class TokenResponse(BaseModel):
    """Muvaffaqiyatli loginda token va user qaytariladi."""
    token: str
    user: dict