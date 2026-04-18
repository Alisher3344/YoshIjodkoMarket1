# 🎨 Yoshijodkor.uz — Maktab O'quvchilari Ijod Do'koni

## Loyiha haqida
Yoshijodkor.uz — maktab o'quvchilari tomonidan yaratilgan san'at asarlari, qo'l mehnati buyumlari va boshqa ijod mahsulotlarini sotish uchun onlayn platforma.

## Texnologiyalar
- **Frontend:** React 19 + Vite 6
- **CSS:** Tailwind CSS v4
- **State Management:** Zustand
- **Routing:** React Router DOM v7
- **Icons:** Lucide React
- **PWA:** Service Worker + Web Manifest

## Loyihani ishga tushirish

```bash
# 1. Dependencieslarni o'rnatish
npm install

# 2. Development serverini ishga tushirish
npm run dev

# 3. Production build
npm run build

# 4. Preview
npm run preview
```

## Sahifalar
| URL | Sahifa |
|-----|--------|
| `/` | Bosh sahifa |
| `/catalog` | Mahsulotlar katalogi |
| `/product/:id` | Mahsulot tafsiloti |
| `/checkout` | Buyurtma berish |
| `/about` | Biz haqimizda |
| `/contact` | Aloqa |
| `/admin` | Admin panel |

## Admin Panel
- URL: `/admin`
- **Demo parol:** `admin123`
- Mahsulot qo'shish/tahrirlash/o'chirish
- Buyurtmalarni boshqarish
- Statistika

## Funksiyalar
- ✅ O'zbek va Rus tillari
- ✅ Mahsulotlar katalogi + filtrlar
- ✅ Savat (localStorage saqlash)
- ✅ Buyurtma berish (Click, Payme, Uzum, Naqd)
- ✅ Admin panel
- ✅ PWA (telefonga o'rnatish imkoniyati)
- ✅ Mobil moslashuvchan dizayn
- ✅ Mahsulot tafsiloti sahifasi
- ✅ Qidirish funksiyasi

## Mobil dastur sifatida o'rnatish (PWA)
1. Saytni Chrome/Safari brauzeri orqali oching
2. "Bosh ekranga qo'shish" tugmasini bosing
3. Dastur telefonda alohida ilovaga o'xshab ishlaydi

## Tuzilma
```
src/
├── components/
│   ├── layout/       # Header, Footer
│   ├── ui/           # CartDrawer
│   └── product/      # ProductCard
├── pages/            # Barcha sahifalar
├── store/            # Zustand state
└── data/             # Ma'lumotlar, tarjimalar
```
