# YoshIjodkor — server deploy (ssmart infratuzilmasi)

Sayt `ssmart` Docker stack'i ichida, `yoshijodkor.uz` (alias: `ijodkor.ssmart.uz`)
domenida ishlaydi. Publik trafik: Cloudflare Tunnel → `ssmart-nginx` → konteynerlar.

## Konteynerlar

| Servis            | Nima                                    |
|-------------------|-----------------------------------------|
| `ijodkor-postgres`| PostgreSQL 16 (`yoshijodkor` bazasi)    |
| `ijodkor-api`     | FastAPI (`ijodkor_Backend/Dockerfile`)  |
| `ijodkor`         | React SPA (`ijodkor_Frontend/Dockerfile`)|
| `ijodkor-miniapp` | Telegram Mini App (`Telegram_app/Dockerfile`) |
| `ijodkor-bot`     | aiogram bot (`Dockerfile.bot`, `--profile ijodkor-bot`) |

Servis ta'riflari `/opt/app/docker-compose.yml` da, sirlar `/opt/app/.env` da
(`IJODKOR_*` prefiksi), nginx bloki `/opt/app/nginx/conf.d/ssmart.conf` da.

## Marshrutlar

```
/          -> ijodkor:80          (SPA, HashRouter)
/api/      -> ijodkor-api:8000    (prefiks kesilmaydi — backend ham /api/ da)
/miniapp/  -> ijodkor-miniapp:80  (rewrite bilan prefiks kesiladi)
```

## Deploy

```bash
cd /opt/app
docker compose build ijodkor-api ijodkor ijodkor-miniapp
docker compose up -d ijodkor-api ijodkor ijodkor-miniapp
```

`nginx -s reload` SHART EMAS: `ssmart.conf` o'zgaruvchili `proxy_pass` ishlatadi,
nginx konteyner nomini har so'rovda qayta yechadi (faqat nginx konfini
o'zgartirganda reload kerak).

## Muhim eslatmalar

- **Frontend API'ni nisbiy `/api` bilan chaqiradi** (build arg `VITE_API_URL=/api`).
  Domen o'zgarsa qayta build SHART EMAS.
- `index.html` keshlanmaydi (`Cache-Control: no-cache`), assetlar esa 30 kun
  keshlanadi — deploydan keyin eski hash'ga ishora qilib qolish muammosi yo'q.
- Backend har startda jadvallarni yaratadi, `MIGRATION_SQL` ni qo'llaydi,
  hududlarni seed qiladi va `admin`/`admin123` superadmin yaratadi
  (`app/main.py` lifespan) — **parolni ishga tushgach o'zgartiring**.
- Mini App uchun BotFather'da WebApp URL: `https://yoshijodkor.uz/miniapp/`.

## Tekshirish

```bash
curl -sk -H "Host: yoshijodkor.uz" https://127.0.0.1/            # SPA
curl -sk -H "Host: yoshijodkor.uz" https://127.0.0.1/api/regions/ # API
curl -sk -H "Host: yoshijodkor.uz" https://127.0.0.1/miniapp/     # Mini App
```
