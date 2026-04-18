from typing import Optional
from pydantic import BaseModel


class UserCreate(BaseModel):
    name:     str
    username: str
    password: str
    email:    str = ""
    role:     str = "admin"


class UserUpdate(BaseModel):
    name:     str
    username: str
    email:    str = ""
    role:     str = "admin"
    password: Optional[str] = None


class UserResponse(BaseModel):
    id:       int
    name:     str
    username: str
    email:    str
    role:     str
    active:   bool

    class Config:
        from_attributes = True