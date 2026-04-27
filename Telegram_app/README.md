# YoshIjodkor — Telegram Mini App

Bu papkada Telegram Mini App frontend'i (Vite + React + Telegram WebApp SDK).

## Lokal ishga tushirish

```bash
cd Telegram_app
npm install
npm run dev
```

Default: `http://localhost:5174` (host=0.0.0.0).

> Mini App'ni **brauzer**da ochsangiz token bo'lmagani uchun "Welcome" sahifasi
> chiqadi. Telegram orqali sinash uchun pastdagi **HTTPS tunnel** bo'limini
> o'qing.

## Production build

```bash
npm run build
```

`dist/` papkasi tayyor — uni **HTTPS** hosting'ga (Vercel/Netlify/aHost subdomain) yuklang.

Telegram Mini App URL'i **HTTPS** bo'lishi shart.

## Telegram'da Mini App'ni ulash

1. `@BotFather` → `/mybots` → bot tanlash → **Bot Settings** → **Menu Button**
2. URL: `https://miniapp.yoshijodkor.uz` (yoki sizning hosting URL'ingiz)
3. Caption: `🎨 Sayt`

## Lokal sinash uchun HTTPS tunnel (ngrok)

```bash
ngrok http 5174
```

Olingan `https://xxx.ngrok-free.app` ni BotFather'da Mini App URL sifatida sozlang.
Bot orqali `/start` bosib, "🚀 Mini App" tugmasini bosing.
