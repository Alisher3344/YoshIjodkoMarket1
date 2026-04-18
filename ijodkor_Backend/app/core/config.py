from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080

    DATABASE_URL: str
    CLIENT_URL: str = "http://localhost:5173"
    TELEGRAM_TOKEN: str = ""
    TELEGRAM_CHAT_ID: str = ""
    class Config:
        env_file = ".env"


settings = Settings()