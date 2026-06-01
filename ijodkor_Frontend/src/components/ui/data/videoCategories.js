// Video darsliklar uchun fanlar ro'yxati
export const VIDEO_CATEGORIES = [
  {
    key: "math",
    uz: "Matematika",
    ru: "Математика",
    icon: "📐",
    color: {
      bg: "from-blue-100 to-indigo-200",
      text: "text-blue-700",
      solid: "bg-blue-500",
    },
  },
  {
    key: "physics",
    uz: "Fizika",
    ru: "Физика",
    icon: "⚛️",
    color: {
      bg: "from-purple-100 to-violet-200",
      text: "text-purple-700",
      solid: "bg-purple-500",
    },
  },
  {
    key: "chemistry",
    uz: "Kimyo",
    ru: "Химия",
    icon: "🧪",
    color: {
      bg: "from-green-100 to-emerald-200",
      text: "text-green-700",
      solid: "bg-green-500",
    },
  },
  {
    key: "biology",
    uz: "Biologiya",
    ru: "Биология",
    icon: "🌱",
    color: {
      bg: "from-lime-100 to-green-200",
      text: "text-lime-700",
      solid: "bg-lime-500",
    },
  },
  {
    key: "uzbek",
    uz: "Ona tili va adabiyot",
    ru: "Родной язык и литература",
    icon: "📖",
    color: {
      bg: "from-yellow-100 to-amber-200",
      text: "text-amber-700",
      solid: "bg-amber-500",
    },
  },
  {
    key: "russian",
    uz: "Rus tili",
    ru: "Русский язык",
    icon: "🇷🇺",
    color: {
      bg: "from-red-100 to-rose-200",
      text: "text-red-700",
      solid: "bg-red-500",
    },
  },
  {
    key: "english",
    uz: "Ingliz tili",
    ru: "Английский язык",
    icon: "🇬🇧",
    color: {
      bg: "from-sky-100 to-blue-200",
      text: "text-sky-700",
      solid: "bg-sky-500",
    },
  },
  {
    key: "history",
    uz: "Tarix",
    ru: "История",
    icon: "🏛️",
    color: {
      bg: "from-orange-100 to-amber-200",
      text: "text-orange-700",
      solid: "bg-orange-500",
    },
  },
  {
    key: "informatics",
    uz: "Informatika",
    ru: "Информатика",
    icon: "💻",
    color: {
      bg: "from-cyan-100 to-sky-200",
      text: "text-cyan-700",
      solid: "bg-cyan-500",
    },
  },
  {
    key: "other",
    uz: "Boshqa fanlar",
    ru: "Другие предметы",
    icon: "📚",
    color: {
      bg: "from-pink-100 to-rose-200",
      text: "text-pink-700",
      solid: "bg-pink-500",
    },
  },
];

export const findVideoCategory = (key) =>
  VIDEO_CATEGORIES.find((c) => c.key === key);
