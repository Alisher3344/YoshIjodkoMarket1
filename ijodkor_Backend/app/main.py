from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.routes import auth, products, orders, custom_orders, users, contact


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tayyor")
    yield
    await engine.dispose()


app = FastAPI(
    title="YoshIjodkor Market API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.CLIENT_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,          prefix="/api/auth",          tags=["Auth"])
app.include_router(products.router,      prefix="/api/products",      tags=["Mahsulotlar"])
app.include_router(orders.router,        prefix="/api/orders",        tags=["Buyurtmalar"])
app.include_router(custom_orders.router, prefix="/api/custom-orders", tags=["Maxsus buyurtmalar"])
app.include_router(users.router,         prefix="/api/users",         tags=["Foydalanuvchilar"])
app.include_router(contact.router,       prefix="/api/contact",       tags=["Aloqa"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


@app.get("/")
async def root():
    return {"message": "YoshIjodkor API ishlayapti!", "docs": "/docs"}