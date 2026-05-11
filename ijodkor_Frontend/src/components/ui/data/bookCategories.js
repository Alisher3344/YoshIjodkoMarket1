// Microsoft Fluent Emoji 3D — CDN base
const FLUENT_3D = "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets";

// Kitoblar uchun ierarxik kategoriyalar
export const BOOK_CATEGORIES = [
  {
    key: "fiction",
    uz: "Badiiy adabiyot",
    ru: "Художественная литература",
    icon: "📖",
    icon3d: `${FLUENT_3D}/Open%20book/3D/open_book_3d.png`,
    subcategories: [
      { key: "novel", uz: "Romanlar", ru: "Романы" },
      { key: "novella", uz: "Qissalar", ru: "Повести" },
      { key: "story", uz: "Hikoyalar", ru: "Рассказы" },
      { key: "poetry", uz: "She'riyat", ru: "Поэзия" },
      { key: "epic", uz: "Dostonlar", ru: "Эпосы" },
      { key: "drama", uz: "Dramalar", ru: "Драмы" },
      { key: "fantasy", uz: "Fantastika", ru: "Фантастика" },
      { key: "detective", uz: "Detektiv", ru: "Детектив" },
      { key: "adventure", uz: "Sarguzasht", ru: "Приключения" },
      { key: "historical", uz: "Tarixiy asarlar", ru: "Исторические произведения" },
      { key: "romance", uz: "Sevgi romanlari", ru: "Любовные романы" },
      { key: "thriller", uz: "Trillerlar", ru: "Триллеры" },
      { key: "children-lit", uz: "Bolalar adabiyoti", ru: "Детская литература" },
    ],
  },
  {
    key: "science",
    uz: "Ilmiy adabiyot",
    ru: "Научная литература",
    icon: "🔬",
    icon3d: `${FLUENT_3D}/Microscope/3D/microscope_3d.png`,
    subcategories: [
      { key: "physics", uz: "Fizika", ru: "Физика" },
      { key: "math", uz: "Matematika", ru: "Математика" },
      { key: "chemistry", uz: "Kimyo", ru: "Химия" },
      { key: "biology", uz: "Biologiya", ru: "Биология" },
      { key: "astronomy", uz: "Astronomiya", ru: "Астрономия" },
      { key: "medicine", uz: "Tibbiyot", ru: "Медицина" },
      { key: "technology", uz: "Texnologiya", ru: "Технологии" },
      { key: "ai", uz: "Sun'iy intellekt", ru: "Искусственный интеллект" },
      { key: "engineering", uz: "Muhandislik", ru: "Инженерия" },
    ],
  },
  {
    key: "education",
    uz: "O'quv adabiyotlari",
    ru: "Учебная литература",
    icon: "📚",
    icon3d: `${FLUENT_3D}/Books/3D/books_3d.png`,
    subcategories: [
      { key: "textbooks", uz: "Darsliklar", ru: "Учебники" },
      { key: "guides", uz: "Qo'llanmalar", ru: "Пособия" },
      { key: "tests", uz: "Test to'plamlari", ru: "Тестовые сборники" },
      { key: "dictionaries", uz: "Lug'atlar", ru: "Словари" },
      { key: "encyclopedias", uz: "Ensiklopediyalar", ru: "Энциклопедии" },
      { key: "essays", uz: "Referatlar", ru: "Рефераты" },
      { key: "coursework", uz: "Kurs ishlari", ru: "Курсовые работы" },
    ],
  },
  {
    key: "business",
    uz: "Biznes va iqtisodiyot",
    ru: "Бизнес и экономика",
    icon: "💼",
    icon3d: `${FLUENT_3D}/Briefcase/3D/briefcase_3d.png`,
    subcategories: [
      { key: "marketing", uz: "Marketing", ru: "Маркетинг" },
      { key: "management", uz: "Menejment", ru: "Менеджмент" },
      { key: "startup", uz: "Startap", ru: "Стартап" },
      { key: "investment", uz: "Investitsiya", ru: "Инвестиции" },
      { key: "trade", uz: "Savdo", ru: "Торговля" },
      { key: "finance", uz: "Moliya", ru: "Финансы" },
      { key: "crypto", uz: "Kriptovalyuta", ru: "Криптовалюта" },
    ],
  },
  {
    key: "psychology",
    uz: "Psixologiya va shaxsiy rivojlanish",
    ru: "Психология и саморазвитие",
    icon: "🧠",
    icon3d: `${FLUENT_3D}/Brain/3D/brain_3d.png`,
    subcategories: [
      { key: "motivation", uz: "Motivatsiya", ru: "Мотивация" },
      { key: "leadership", uz: "Liderlik", ru: "Лидерство" },
      { key: "communication", uz: "Muloqot", ru: "Общение" },
      { key: "family", uz: "Oila psixologiyasi", ru: "Семейная психология" },
      { key: "stress", uz: "Stress boshqaruvi", ru: "Управление стрессом" },
      { key: "success", uz: "Muvaffaqiyat sirlari", ru: "Секреты успеха" },
    ],
  },
  {
    key: "religion",
    uz: "Din va ma'naviyat",
    ru: "Религия и духовность",
    icon: "☪️",
    icon3d: `${FLUENT_3D}/Star%20and%20crescent/3D/star_and_crescent_3d.png`,
    subcategories: [
      { key: "islamic", uz: "Islomiy kitoblar", ru: "Исламские книги" },
      { key: "hadith", uz: "Hadislar", ru: "Хадисы" },
      { key: "tafsir", uz: "Tafsirlar", ru: "Толкования" },
      { key: "fiqh", uz: "Fiqh", ru: "Фикх" },
      { key: "prayers", uz: "Duolar", ru: "Молитвы" },
      { key: "tasawwuf", uz: "Tasavvuf", ru: "Суфизм" },
    ],
  },
  {
    key: "history",
    uz: "Tarix va siyosat",
    ru: "История и политика",
    icon: "🏛️",
    icon3d: `${FLUENT_3D}/Classical%20building/3D/classical_building_3d.png`,
    subcategories: [
      { key: "uzbekistan-history", uz: "O'zbekiston tarixi", ru: "История Узбекистана" },
      { key: "world-history", uz: "Jahon tarixi", ru: "Мировая история" },
      { key: "biography", uz: "Biografiyalar", ru: "Биографии" },
      { key: "politics", uz: "Siyosat", ru: "Политика" },
      { key: "military-history", uz: "Harbiy tarix", ru: "Военная история" },
    ],
  },
  {
    key: "art",
    uz: "San'at va madaniyat",
    ru: "Искусство и культура",
    icon: "🎨",
    icon3d: `${FLUENT_3D}/Artist%20palette/3D/artist_palette_3d.png`,
    subcategories: [
      { key: "music", uz: "Musiqa", ru: "Музыка" },
      { key: "cinema", uz: "Kino", ru: "Кино" },
      { key: "painting", uz: "Rassomlik", ru: "Живопись" },
      { key: "design", uz: "Dizayn", ru: "Дизайн" },
      { key: "photography", uz: "Fotografiya", ru: "Фотография" },
      { key: "architecture", uz: "Arxitektura", ru: "Архитектура" },
    ],
  },
  {
    key: "it",
    uz: "IT va dasturlash",
    ru: "IT и программирование",
    icon: "💻",
    icon3d: `${FLUENT_3D}/Laptop/3D/laptop_3d.png`,
    subcategories: [
      { key: "python", uz: "Python", ru: "Python" },
      { key: "javascript", uz: "JavaScript", ru: "JavaScript" },
      { key: "web", uz: "Web dasturlash", ru: "Web-разработка" },
      { key: "mobile", uz: "Mobil dasturlash", ru: "Мобильная разработка" },
      { key: "cybersecurity", uz: "Kiberxavfsizlik", ru: "Кибербезопасность" },
      { key: "database", uz: "Ma'lumotlar bazasi", ru: "Базы данных" },
    ],
  },
  {
    key: "languages",
    uz: "Til o'rganish",
    ru: "Изучение языков",
    icon: "🌐",
    icon3d: `${FLUENT_3D}/Globe%20with%20meridians/3D/globe_with_meridians_3d.png`,
    subcategories: [
      { key: "english", uz: "Ingliz tili", ru: "Английский язык" },
      { key: "russian", uz: "Rus tili", ru: "Русский язык" },
      { key: "arabic", uz: "Arab tili", ru: "Арабский язык" },
      { key: "german", uz: "Nemis tili", ru: "Немецкий язык" },
      { key: "toefl-ielts", uz: "TOEFL / IELTS", ru: "TOEFL / IELTS" },
      { key: "grammar", uz: "Grammatika", ru: "Грамматика" },
    ],
  },
  {
    key: "children",
    uz: "Bolalar kitoblari",
    ru: "Детские книги",
    icon: "🧸",
    icon3d: `${FLUENT_3D}/Teddy%20bear/3D/teddy_bear_3d.png`,
    subcategories: [
      { key: "fairy-tales", uz: "Ertaklar", ru: "Сказки" },
      { key: "picture-books", uz: "Rasmli kitoblar", ru: "Книги с картинками" },
      { key: "developing", uz: "Rivojlantiruvchi kitoblar", ru: "Развивающие книги" },
      { key: "preschool", uz: "Maktabgacha ta'lim", ru: "Дошкольное образование" },
      { key: "comics", uz: "Komikslar", ru: "Комиксы" },
    ],
  },
  {
    key: "documentary",
    uz: "Hujjatli va ommabop adabiyot",
    ru: "Документальная и научно-популярная литература",
    icon: "📰",
    icon3d: `${FLUENT_3D}/Newspaper/3D/newspaper_3d.png`,
    subcategories: [
      { key: "biography-doc", uz: "Biografiya", ru: "Биография" },
      { key: "memoir", uz: "Memoar", ru: "Мемуары" },
      { key: "publicism", uz: "Publitsistika", ru: "Публицистика" },
      { key: "interviews", uz: "Intervyular", ru: "Интервью" },
      { key: "research", uz: "Tadqiqotlar", ru: "Исследования" },
    ],
  },
  {
    key: "agriculture",
    uz: "Qishloq xo'jaligi va hunarmandchilik",
    ru: "Сельское хозяйство и ремёсла",
    icon: "🌾",
    icon3d: `${FLUENT_3D}/Sheaf%20of%20rice/3D/sheaf_of_rice_3d.png`,
    subcategories: [
      { key: "farming", uz: "Dehqonchilik", ru: "Земледелие" },
      { key: "livestock", uz: "Chorvachilik", ru: "Животноводство" },
      { key: "gardening", uz: "Bog'dorchilik", ru: "Садоводство" },
      { key: "sewing", uz: "Tikuvchilik", ru: "Швейное дело" },
      { key: "woodwork", uz: "Yog'ochsozlik", ru: "Деревообработка" },
    ],
  },
  {
    key: "health",
    uz: "Sog'liq va sport",
    ru: "Здоровье и спорт",
    icon: "💪",
    icon3d: `${FLUENT_3D}/Flexed%20biceps/Default/3D/flexed_biceps_3d_default.png`,
    subcategories: [
      { key: "fitness", uz: "Fitness", ru: "Фитнес" },
      { key: "nutrition", uz: "To'g'ri ovqatlanish", ru: "Правильное питание" },
      { key: "yoga", uz: "Yoga", ru: "Йога" },
      { key: "sports-medicine", uz: "Sport tibbiyoti", ru: "Спортивная медицина" },
      { key: "healthy-lifestyle", uz: "Sog'lom turmush tarzi", ru: "Здоровый образ жизни" },
    ],
  },
];

// Helper'lar
export const findCategory = (key) =>
  BOOK_CATEGORIES.find((c) => c.key === key);

export const findSubcategory = (categoryKey, subKey) => {
  const cat = findCategory(categoryKey);
  return cat?.subcategories?.find((s) => s.key === subKey);
};

export const getCategoryLabel = (key, lang = "uz") => {
  const c = findCategory(key);
  return c ? c[lang] : key;
};

export const getSubcategoryLabel = (categoryKey, subKey, lang = "uz") => {
  const s = findSubcategory(categoryKey, subKey);
  return s ? s[lang] : subKey;
};
