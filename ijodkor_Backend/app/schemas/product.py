from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    """Mahsulot yaratish va yangilash uchun."""
    name_uz:  str
    name_ru:  str = ""
    desc_uz:  str = ""
    desc_ru:  str = ""
    price:    float = Field(..., gt=0, description="Narx 0 dan katta bo'lishi kerak")
    stock:    int   = Field(1, ge=0, description="Qoldiq manfiy bo'lmaydi")
    category: str = ""
    author:   str = ""
    class_uz: str = ""
    class_ru: str = ""
    school:   str = ""
    district: str = ""
    phone:    str = ""
    image:    str = ""
    is_new:   bool = True


class ProductResponse(BaseModel):
    """Frontendga qaytariladigan mahsulot ma'lumotlari."""
    id:       int
    name_uz:  str
    name_ru:  str
    desc_uz:  str
    desc_ru:  str
    price:    float
    stock:    int
    category: str
    author:   str
    class_uz: str
    class_ru: str
    school:   str
    district: str
    phone:    str
    image:    str
    is_new:   bool

    class Config:
        from_attributes = True  # SQLAlchemy modeldan o'qiydi