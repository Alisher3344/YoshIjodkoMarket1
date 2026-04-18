// Mahsulotlar backenddan keladi — JSON yo'q
// Faqat kategoriyalar qoldi (statik, o'zgarmaydi)

export const products = []; // Bo'sh — backenddan yuklanadi

export const categories = [
  {
    id: "paintings",
    icon: "🎨",
    label_uz: "Rassomchilik ishlari",
    label_ru: "Изобразительное искусство",
  },
  {
    id: "handcraft",
    icon: "✂️",
    label_uz: "Qo'l mehnati (Handmade)",
    label_ru: "Ручная работа (Handmade)",
  },
  {
    id: "clothing",
    icon: "👗",
    label_uz: "Tikilgan va kiyimlar",
    label_ru: "Шитьё и одежда",
  },
  {
    id: "toys",
    icon: "🧸",
    label_uz: "O'yinchoqlar va bolalar buyumlari",
    label_ru: "Игрушки и детские товары",
  },
  {
    id: "souvenirs",
    icon: "🎁",
    label_uz: "Suvenir va sovg'alar",
    label_ru: "Сувениры и подарки",
  },
  {
    id: "holiday",
    icon: "🎉",
    label_uz: "Bayram va dekor",
    label_ru: "Праздники и декор",
  },
  {
    id: "educational",
    icon: "📚",
    label_uz: "Ta'limiy mahsulotlar",
    label_ru: "Образовательные товары",
  },
  {
    id: "digital",
    icon: "💻",
    label_uz: "Raqamli mahsulotlar",
    label_ru: "Цифровые товары",
  },
  {
    id: "creative",
    icon: "⭐",
    label_uz: "Ijodiy mahsulotlar",
    label_ru: "Творческие товары",
  },
  {
    id: "school",
    icon: "🏫",
    label_uz: "Maktab buyumlari",
    label_ru: "Школьные товары",
  },
  {
    id: "eco",
    icon: "🌿",
    label_uz: "Eko mahsulotlar",
    label_ru: "Эко товары",
  },
  {
    id: "custom",
    icon: "⚡",
    label_uz: "Buyurtma asosida",
    label_ru: "На заказ",
  },
];

export const featuredCategories = [
  {
    key: "paintings",
    emoji: "🎨",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    key: "handcraft",
    emoji: "✂️",
    color: "bg-amber-50 border-amber-200 hover:bg-amber-100",
  },
  {
    key: "clothing",
    emoji: "👗",
    color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
  },
  {
    key: "toys",
    emoji: "🧸",
    color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
  },
  {
    key: "souvenirs",
    emoji: "🎁",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
  {
    key: "holiday",
    emoji: "🎉",
    color: "bg-red-50 border-red-200 hover:bg-red-100",
  },
  {
    key: "educational",
    emoji: "📚",
    color: "bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    key: "digital",
    emoji: "💻",
    color: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100",
  },
  {
    key: "creative",
    emoji: "⭐",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  },
  {
    key: "school",
    emoji: "🏫",
    color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
  },
  {
    key: "eco",
    emoji: "🌿",
    color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
  },
  {
    key: "custom",
    emoji: "⚡",
    color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
  },
];
export const categoryLabels = {
  uz: {
    all: "Barcha",
    paintings: "🎨 Rassomchilik",
    handcraft: "✂️ Qo'l mehnati",
    clothing: "👗 Kiyimlar",
    toys: "🧸 O'yinchoqlar",
    souvenirs: "🎁 Suvenir",
    holiday: "🎉 Bayram",
    educational: "📚 Ta'limiy",
    digital: "💻 Raqamli",
    creative: "⭐ Ijodiy",
    school: "🏫 Maktab",
    eco: "🌿 Eko",
    custom: "⚡ Buyurtma",
  },
  ru: {
    all: "Все",
    paintings: "🎨 Живопись",
    handcraft: "✂️ Ручная работа",
    clothing: "👗 Одежда",
    toys: "🧸 Игрушки",
    souvenirs: "🎁 Сувениры",
    holiday: "🎉 Праздник",
    educational: "📚 Учебные",
    digital: "💻 Цифровые",
    creative: "⭐ Творческие",
    school: "🏫 Школьные",
    eco: "🌿 Эко",
    custom: "⚡ На заказ",
  },
};
