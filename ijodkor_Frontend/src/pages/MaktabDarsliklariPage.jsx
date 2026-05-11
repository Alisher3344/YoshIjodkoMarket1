import { useState } from "react";
import {
  GraduationCap,
  Search,
  Download,
  FileText,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import useStore from "../store/useStore";

export default function MaktabDarsliklariPage() {
  const { lang } = useStore();
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(null);

  // 1-11 sinflar
  const grades = Array.from({ length: 11 }, (_, i) => i + 1);

  // Har bir sinf uchun rang sxemasi
  const gradeColors = {
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

  // Har bir sinf uchun fanlar ro'yxati (taxminiy)
  const subjectsByGrade = {
    1: [
      { uz: "Alifbe", ru: "Алфавит" },
      { uz: "Ona tili", ru: "Родной язык" },
      { uz: "Matematika", ru: "Математика" },
      { uz: "Tabiatshunoslik", ru: "Природоведение" },
      { uz: "Tasviriy san'at", ru: "ИЗО" },
      { uz: "Jismoniy tarbiya", ru: "Физкультура" },
    ],
    2: [
      { uz: "Ona tili", ru: "Родной язык" },
      { uz: "O'qish kitobi", ru: "Чтение" },
      { uz: "Matematika", ru: "Математика" },
      { uz: "Tabiatshunoslik", ru: "Природоведение" },
      { uz: "Tasviriy san'at", ru: "ИЗО" },
      { uz: "Texnologiya", ru: "Технология" },
    ],
    3: [
      { uz: "Ona tili", ru: "Родной язык" },
      { uz: "O'qish kitobi", ru: "Чтение" },
      { uz: "Matematika", ru: "Математика" },
      { uz: "Tabiatshunoslik", ru: "Природоведение" },
      { uz: "Ingliz tili", ru: "Английский язык" },
      { uz: "Texnologiya", ru: "Технология" },
    ],
    4: [
      { uz: "Ona tili", ru: "Родной язык" },
      { uz: "Adabiy o'qish", ru: "Литературное чтение" },
      { uz: "Matematika", ru: "Математика" },
      { uz: "Tabiatshunoslik", ru: "Природоведение" },
      { uz: "Ingliz tili", ru: "Английский язык" },
      { uz: "Tarix hikoyalari", ru: "Рассказы по истории" },
    ],
    5: [
      { uz: "Ona tili", ru: "Родной язык" },
      { uz: "Adabiyot", ru: "Литература" },
      { uz: "Matematika", ru: "Математика" },
      { uz: "Tabiiy geografiya", ru: "География" },
      { uz: "Biologiya", ru: "Биология" },
      { uz: "Tarix", ru: "История" },
      { uz: "Ingliz tili", ru: "Английский язык" },
      { uz: "Informatika", ru: "Информатика" },
    ],
    6: [
      { uz: "Ona tili", ru: "Родной язык" },
      { uz: "Adabiyot", ru: "Литература" },
      { uz: "Matematika", ru: "Математика" },
      { uz: "Geografiya", ru: "География" },
      { uz: "Biologiya", ru: "Биология" },
      { uz: "Tarix", ru: "История" },
      { uz: "Ingliz tili", ru: "Английский язык" },
      { uz: "Informatika", ru: "Информатика" },
    ],
    7: [
      { uz: "Ona tili", ru: "Родной язык" },
      { uz: "Adabiyot", ru: "Литература" },
      { uz: "Algebra", ru: "Алгебра" },
      { uz: "Geometriya", ru: "Геометрия" },
      { uz: "Fizika", ru: "Физика" },
      { uz: "Geografiya", ru: "География" },
      { uz: "Biologiya", ru: "Биология" },
      { uz: "Tarix", ru: "История" },
      { uz: "Ingliz tili", ru: "Английский язык" },
      { uz: "Informatika", ru: "Информатика" },
    ],
    8: [
      { uz: "Ona tili", ru: "Родной язык" },
      { uz: "Adabiyot", ru: "Литература" },
      { uz: "Algebra", ru: "Алгебра" },
      { uz: "Geometriya", ru: "Геометрия" },
      { uz: "Fizika", ru: "Физика" },
      { uz: "Kimyo", ru: "Химия" },
      { uz: "Biologiya", ru: "Биология" },
      { uz: "Tarix", ru: "История" },
      { uz: "Geografiya", ru: "География" },
      { uz: "Ingliz tili", ru: "Английский язык" },
      { uz: "Informatika", ru: "Информатика" },
    ],
    9: [
      { uz: "Ona tili", ru: "Родной язык" },
      { uz: "Adabiyot", ru: "Литература" },
      { uz: "Algebra", ru: "Алгебра" },
      { uz: "Geometriya", ru: "Геометрия" },
      { uz: "Fizika", ru: "Физика" },
      { uz: "Kimyo", ru: "Химия" },
      { uz: "Biologiya", ru: "Биология" },
      { uz: "Tarix", ru: "История" },
      { uz: "Ingliz tili", ru: "Английский язык" },
      { uz: "Iqtisodiyot", ru: "Экономика" },
      { uz: "Informatika", ru: "Информатика" },
    ],
    10: [
      { uz: "Ona tili va adabiyot", ru: "Родной язык и литература" },
      { uz: "Algebra", ru: "Алгебра" },
      { uz: "Geometriya", ru: "Геометрия" },
      { uz: "Fizika", ru: "Физика" },
      { uz: "Kimyo", ru: "Химия" },
      { uz: "Biologiya", ru: "Биология" },
      { uz: "Tarix", ru: "История" },
      { uz: "Ingliz tili", ru: "Английский язык" },
      { uz: "Astronomiya", ru: "Астрономия" },
      { uz: "Informatika", ru: "Информатика" },
    ],
    11: [
      { uz: "Ona tili va adabiyot", ru: "Родной язык и литература" },
      { uz: "Algebra", ru: "Алгебра" },
      { uz: "Geometriya", ru: "Геометрия" },
      { uz: "Fizika", ru: "Физика" },
      { uz: "Kimyo", ru: "Химия" },
      { uz: "Biologiya", ru: "Биология" },
      { uz: "Tarix", ru: "История" },
      { uz: "Ingliz tili", ru: "Английский язык" },
      { uz: "Huquq asoslari", ru: "Основы права" },
      { uz: "Informatika", ru: "Информатика" },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Hero */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-4 sm:p-6 border border-emerald-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <GraduationCap size={20} className="sm:w-[22px] sm:h-[22px]" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 truncate">
              {lang === "uz" ? "Maktab Darsliklari" : "Школьные учебники"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {selectedGrade
                ? lang === "uz"
                  ? `${selectedGrade}-sinf darsliklari`
                  : `Учебники ${selectedGrade} класса`
                : lang === "uz"
                ? "1-11 sinflar uchun barcha darsliklar bir joyda"
                : "Все учебники 1-11 классов в одном месте"}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-3 border border-gray-100 mb-6">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder={
              lang === "uz" ? "Darslik qidiring..." : "Найти учебник..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* GRADE NOT SELECTED — 11 ta sinf kartochkasi */}
      {!selectedGrade && (
        <>
          <h2 className="font-black text-base sm:text-lg text-gray-800 mb-3 sm:mb-4">
            {lang === "uz" ? "Sinfni tanlang" : "Выберите класс"}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {grades.map((g) => {
              const c = gradeColors[g];
              const subjectCount = subjectsByGrade[g]?.length || 0;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`bg-gradient-to-br ${c.bg} ${c.text} rounded-xl sm:rounded-2xl p-3 sm:p-5 text-left hover:scale-[1.04] active:scale-[0.98] transition shadow-sm hover:shadow-lg border border-white/40 group`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${c.solid} text-white flex items-center justify-center mb-2 sm:mb-3 font-black text-base sm:text-lg shadow-md`}
                  >
                    {g}
                  </div>
                  <h3 className="font-black text-sm sm:text-base mb-0.5">
                    {lang === "uz" ? `${g}-sinf` : `${g} кл.`}
                  </h3>
                  <p className="text-[10px] sm:text-xs opacity-70 flex items-center gap-1">
                    <BookOpen size={10} className="sm:w-3 sm:h-3" />
                    {subjectCount}{" "}
                    {lang === "uz" ? "fan" : "предм."}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Info banner */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Download size={18} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-black text-emerald-800 text-sm mb-1">
                  {lang === "uz"
                    ? "Bepul yuklab oling"
                    : "Скачайте бесплатно"}
                </h3>
                <p className="text-emerald-700 text-xs">
                  {lang === "uz"
                    ? "Barcha rasmiy darsliklar bepul yuklab olinadi. Sinfni tanlang va kerakli darslikni toping."
                    : "Все официальные учебники доступны бесплатно. Выберите класс и найдите нужный учебник."}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* GRADE SELECTED — fanlar ro'yxati */}
      {selectedGrade && (
        <>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedGrade(null)}
              className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#1a56db] transition"
            >
              <ArrowLeft size={16} />
              {lang === "uz" ? "Sinflar ro'yxati" : "Список классов"}
            </button>
            <div
              className={`px-4 py-2 rounded-xl ${gradeColors[selectedGrade].solid} text-white font-black text-sm shadow-md`}
            >
              {lang === "uz"
                ? `${selectedGrade}-sinf`
                : `${selectedGrade} класс`}
            </div>
          </div>

          <h2 className="font-black text-lg text-gray-800 mb-4">
            {lang === "uz" ? "Fanlar" : "Предметы"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {(subjectsByGrade[selectedGrade] || [])
              .filter((s) => {
                const q = search.toLowerCase().trim();
                if (!q) return true;
                return (
                  s.uz.toLowerCase().includes(q) ||
                  s.ru.toLowerCase().includes(q)
                );
              })
              .map((subj, i) => {
                const c = gradeColors[selectedGrade];
                return (
                  <button
                    key={i}
                    className={`bg-gradient-to-br ${c.bg} ${c.text} rounded-2xl p-5 text-left hover:scale-[1.02] transition shadow-sm hover:shadow-md border border-white/40`}
                  >
                    <FileText size={24} className="mb-2" />
                    <h3 className="font-black text-sm leading-tight">
                      {lang === "uz" ? subj.uz : subj.ru}
                    </h3>
                    <p className="text-xs opacity-70 mt-1">
                      {lang === "uz"
                        ? `${selectedGrade}-sinf darsligi`
                        : `Учебник ${selectedGrade} кл.`}
                    </p>
                  </button>
                );
              })}
          </div>

          {(subjectsByGrade[selectedGrade] || []).filter((s) => {
            const q = search.toLowerCase().trim();
            if (!q) return true;
            return (
              s.uz.toLowerCase().includes(q) || s.ru.toLowerCase().includes(q)
            );
          }).length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <div className="text-5xl mb-3">📚</div>
              <p className="text-gray-500 text-sm">
                {lang === "uz"
                  ? "Bu qidiruv bo'yicha hech narsa topilmadi"
                  : "По этому запросу ничего не найдено"}
              </p>
            </div>
          )}

          {/* Download banner */}
          <div
            className={`bg-gradient-to-r ${gradeColors[selectedGrade].bg} rounded-2xl p-6 border border-white/40`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center flex-shrink-0">
                <Download
                  size={18}
                  className={gradeColors[selectedGrade].text}
                />
              </div>
              <div>
                <h3
                  className={`font-black text-sm mb-1 ${gradeColors[selectedGrade].text}`}
                >
                  {lang === "uz"
                    ? `${selectedGrade}-sinf darsliklarini yuklab olish`
                    : `Скачать учебники ${selectedGrade} класса`}
                </h3>
                <p
                  className={`text-xs ${gradeColors[selectedGrade].text} opacity-80`}
                >
                  {lang === "uz"
                    ? "Tez orada to'liq PDF versiyalari yuklanadi"
                    : "Скоро будут доступны полные PDF версии"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
