// Maktab darsliklari uchun sinflar va fanlar ro'yxati

const primary = [
  { key: "ona-tili-savodxonlik", uz: "Ona tili va o'qish savodxonligi", ru: "Родной язык и грамотность" },
  { key: "matematika", uz: "Matematika", ru: "Математика" },
  { key: "tarbiya", uz: "Tarbiya", ru: "Воспитание" },
  { key: "tabiiy-fan", uz: "Tabiiy fan", ru: "Естествознание" },
  { key: "texnologiya", uz: "Texnologiya", ru: "Технология" },
  { key: "tasviriy-sanat", uz: "Tasviriy san'at", ru: "Изобразительное искусство" },
  { key: "musiqa", uz: "Musiqa madaniyati", ru: "Музыкальная культура" },
  { key: "ingliz-tili", uz: "Ingliz tili", ru: "Английский язык" },
];

const grade5 = [
  { key: "ona-tili", uz: "Ona tili", ru: "Родной язык" },
  { key: "adabiyot", uz: "Adabiyot", ru: "Литература" },
  { key: "rus-tili", uz: "Rus tili", ru: "Русский язык" },
  { key: "ingliz-tili", uz: "Ingliz tili", ru: "Английский язык" },
  { key: "matematika", uz: "Matematika", ru: "Математика" },
  { key: "informatika", uz: "Informatika va axborot texnologiyalari", ru: "Информатика и ИТ" },
  { key: "tarix", uz: "Tarix", ru: "История" },
  { key: "tabiiy-fan", uz: "Tabiiy fan", ru: "Естествознание" },
  { key: "tarbiya", uz: "Tarbiya", ru: "Воспитание" },
  { key: "tasviriy-sanat", uz: "Tasviriy san'at", ru: "Изобразительное искусство" },
  { key: "musiqa", uz: "Musiqa madaniyati", ru: "Музыкальная культура" },
  { key: "texnologiya", uz: "Texnologiya", ru: "Технология" },
];

const grade6 = [
  { key: "ona-tili", uz: "Ona tili", ru: "Родной язык" },
  { key: "adabiyot", uz: "Adabiyot", ru: "Литература" },
  { key: "rus-tili", uz: "Rus tili", ru: "Русский язык" },
  { key: "ingliz-tili", uz: "Ingliz tili", ru: "Английский язык" },
  { key: "matematika", uz: "Matematika", ru: "Математика" },
  { key: "informatika", uz: "Informatika va axborot texnologiyalari", ru: "Информатика и ИТ" },
  { key: "tarix", uz: "Tarix", ru: "История" },
  { key: "geografiya", uz: "Geografiya", ru: "География" },
  { key: "biologiya", uz: "Biologiya", ru: "Биология" },
  { key: "tarbiya", uz: "Tarbiya", ru: "Воспитание" },
  { key: "tasviriy-sanat", uz: "Tasviriy san'at", ru: "Изобразительное искусство" },
  { key: "musiqa", uz: "Musiqa madaniyati", ru: "Музыкальная культура" },
  { key: "texnologiya", uz: "Texnologiya", ru: "Технология" },
];

const grade7 = [
  { key: "ona-tili", uz: "Ona tili", ru: "Родной язык" },
  { key: "adabiyot", uz: "Adabiyot", ru: "Литература" },
  { key: "rus-tili", uz: "Rus tili", ru: "Русский язык" },
  { key: "ingliz-tili", uz: "Ingliz tili", ru: "Английский язык" },
  { key: "algebra", uz: "Algebra", ru: "Алгебра" },
  { key: "geometriya", uz: "Geometriya", ru: "Геометрия" },
  { key: "informatika", uz: "Informatika va axborot texnologiyalari", ru: "Информатика и ИТ" },
  { key: "uz-tarix", uz: "O'zbekiston tarixi", ru: "История Узбекистана" },
  { key: "jahon-tarix", uz: "Jahon tarixi", ru: "Мировая история" },
  { key: "geografiya", uz: "Geografiya", ru: "География" },
  { key: "biologiya", uz: "Biologiya", ru: "Биология" },
  { key: "fizika", uz: "Fizika", ru: "Физика" },
  { key: "kimyo", uz: "Kimyo", ru: "Химия" },
  { key: "tarbiya", uz: "Tarbiya", ru: "Воспитание" },
  { key: "texnologiya", uz: "Texnologiya", ru: "Технология" },
];

const grade8 = grade7;

const grade9 = [
  ...grade7,
  { key: "chizmachilik", uz: "Chizmachilik", ru: "Черчение" },
];

const grade10 = [
  { key: "ona-tili", uz: "Ona tili", ru: "Родной язык" },
  { key: "adabiyot", uz: "Adabiyot", ru: "Литература" },
  { key: "rus-tili", uz: "Rus tili", ru: "Русский язык" },
  { key: "ingliz-tili", uz: "Ingliz tili", ru: "Английский язык" },
  { key: "algebra", uz: "Algebra", ru: "Алгебра" },
  { key: "geometriya", uz: "Geometriya", ru: "Геометрия" },
  { key: "informatika", uz: "Informatika va axborot texnologiyalari", ru: "Информатика и ИТ" },
  { key: "uz-tarix", uz: "O'zbekiston tarixi", ru: "История Узбекистана" },
  { key: "jahon-tarix", uz: "Jahon tarixi", ru: "Мировая история" },
  { key: "geografiya", uz: "Geografiya", ru: "География" },
  { key: "biologiya", uz: "Biologiya", ru: "Биология" },
  { key: "fizika", uz: "Fizika", ru: "Физика" },
  { key: "kimyo", uz: "Kimyo", ru: "Химия" },
  { key: "tarbiya", uz: "Tarbiya", ru: "Воспитание" },
  { key: "chqbt", uz: "Chaqiruvga qadar boshlang'ich tayyorgarlik (CHQBT)", ru: "Начальная допризывная подготовка" },
];

export const SCHOOL_SUBJECTS = {
  1: primary,
  2: primary,
  3: primary,
  4: primary,
  5: grade5,
  6: grade6,
  7: grade7,
  8: grade8,
  9: grade9,
  10: grade10,
  11: grade10,
};

// Sinf rang sxemasi
export const GRADE_COLORS = {
  1: { bg: "from-pink-100 to-rose-200", text: "text-rose-700", solid: "bg-rose-500" },
  2: { bg: "from-orange-100 to-amber-200", text: "text-orange-700", solid: "bg-orange-500" },
  3: { bg: "from-yellow-100 to-amber-200", text: "text-yellow-700", solid: "bg-yellow-500" },
  4: { bg: "from-lime-100 to-green-200", text: "text-lime-700", solid: "bg-lime-500" },
  5: { bg: "from-green-100 to-emerald-200", text: "text-green-700", solid: "bg-green-500" },
  6: { bg: "from-emerald-100 to-teal-200", text: "text-emerald-700", solid: "bg-emerald-500" },
  7: { bg: "from-teal-100 to-cyan-200", text: "text-teal-700", solid: "bg-teal-500" },
  8: { bg: "from-cyan-100 to-sky-200", text: "text-cyan-700", solid: "bg-cyan-500" },
  9: { bg: "from-sky-100 to-blue-200", text: "text-sky-700", solid: "bg-sky-500" },
  10: { bg: "from-blue-100 to-indigo-200", text: "text-blue-700", solid: "bg-blue-500" },
  11: { bg: "from-indigo-100 to-purple-200", text: "text-indigo-700", solid: "bg-indigo-500" },
};

export const findSubject = (grade, subjectKey) =>
  (SCHOOL_SUBJECTS[grade] || []).find((s) => s.key === subjectKey);
