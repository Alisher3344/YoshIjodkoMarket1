from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from .core.config import settings
from .routes import auth, products, orders, custom_orders, users, contact

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    from .core.database import engine
    await engine.dispose()


app = FastAPI(title="YoshIjodko Market API", version="3.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,          prefix="/api/auth",          tags=["auth"])
app.include_router(products.router,      prefix="/api/products",      tags=["products"])
app.include_router(orders.router,        prefix="/api/orders",        tags=["orders"])
app.include_router(custom_orders.router, prefix="/api/custom-orders", tags=["custom-orders"])
app.include_router(users.router,         prefix="/api/users",         tags=["users"])
app.include_router(contact.router, prefix="/api/contact", tags=["contact"])

@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "3.0.0"}


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="YoshIjodko Market API",
        version="3.0.0",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    for path, methods in openapi_schema["paths"].items():
        for method, details in methods.items():
            if path == "/api/auth/login" and method == "post":
                details["security"] = []  # faqat login tokensiz
            else:
                details["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi