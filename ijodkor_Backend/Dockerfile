# YoshIjodkor — FastAPI backend
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY bot ./bot
COPY create_admin.py ./

EXPOSE 8000

# Jadvallar va seed'lar app.main lifespan'ida avtomatik bajariladi (create_all +
# MIGRATION_SQL + regions seed + default admin), shuning uchun alembic shart emas.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--forwarded-allow-ips=*"]
