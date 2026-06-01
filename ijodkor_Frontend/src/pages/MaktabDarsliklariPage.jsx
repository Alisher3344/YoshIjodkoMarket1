import { useState, useEffect } from "react";
import {
  GraduationCap,
  Search,
  Download,
  FileText,
  ArrowLeft,
  BookOpen,
  Play,
  X,
  Eye,
  ChevronRight,
} from "lucide-react";
import useStore from "../store/useStore";
import {
  SCHOOL_SUBJECTS,
  GRADE_COLORS,
  findSubject,
} from "../components/ui/data/schoolSubjects";
import BookPdfViewer from "../components/ui/BookPdfViewer";
import YouTubePlayer from "../components/ui/YouTubePlayer";

const openBookDB = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open("admin_book_db", 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore("books");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const getBookBlob = async (id) => {
  const db = await openBookDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("books", "readonly");
    const req = tx.objectStore("books").get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export default function MaktabDarsliklariPage() {
  const { lang } = useStore();
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [search, setSearch] = useState("");
  const [playing, setPlaying] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [pdfBookData, setPdfBookData] = useState(null); // book obyekti — download uchun

  const [schoolBooks, setSchoolBooks] = useState([]);
  const [schoolVideos, setSchoolVideos] = useState([]);

  useEffect(() => {
    try {
      setSchoolBooks(JSON.parse(localStorage.getItem("school_books") || "[]"));
      setSchoolVideos(JSON.parse(localStorage.getItem("school_videos") || "[]"));
    } catch {}
  }, []);

  const findBook = (g, s) =>
    schoolBooks.find((b) => b.grade === g && b.subject === s);

  const subjectVideos = (g, s) =>
    schoolVideos.filter((v) => v.grade === g && v.subject === s);

  const openPdf = async (book) => {
    setPdfBookData(book);
    if (book.type === "url") {
      setPdfPreview({ url: book.pdfUrl, name: book.pdfName });
      return;
    }
    try {
      const blob = await getBookBlob(book.id);
      if (!blob) {
        alert(lang === "uz" ? "PDF topilmadi" : "PDF не найден");
        return;
      }
      const url = URL.createObjectURL(blob);
      setPdfPreview({ url, name: book.pdfName, _blob: true });
    } catch {
      alert(lang === "uz" ? "Xato" : "Ошибка");
    }
  };

  const downloadPdf = async (book) => {
    if (book.type === "url") {
      window.open(book.pdfUrl, "_blank");
      return;
    }
    try {
      const blob = await getBookBlob(book.id);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = book.pdfName || "kitob.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {}
  };

  const closePdfPreview = () => {
    if (pdfPreview?._blob) URL.revokeObjectURL(pdfPreview.url);
    setPdfPreview(null);
    setPdfBookData(null);
  };

  // Filtrlash videolar uchun
  const filteredVideos =
    selectedGrade && selectedSubject
      ? subjectVideos(selectedGrade, selectedSubject).filter((v) => {
          if (!search.trim()) return true;
          const q = search.toLowerCase();
          return (
            (v.title_uz || "").toLowerCase().includes(q) ||
            (v.title_ru || "").toLowerCase().includes(q)
          );
        })
      : [];

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
              {selectedSubject
                ? lang === "uz"
                  ? `${selectedGrade}-sinf • ${findSubject(selectedGrade, selectedSubject)?.uz || ""}`
                  : `${selectedGrade} класс • ${findSubject(selectedGrade, selectedSubject)?.ru || ""}`
                : selectedGrade
                ? lang === "uz"
                  ? `${selectedGrade}-sinf fanlari`
                  : `Предметы ${selectedGrade} класса`
                : lang === "uz"
                ? "1-11 sinflar uchun barcha darsliklar"
                : "Все учебники 1-11 классов"}
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      {(selectedGrade || selectedSubject) && (
        <div className="flex items-center gap-2 text-sm mb-4 flex-wrap">
          <button
            onClick={() => {
              setSelectedGrade(null);
              setSelectedSubject(null);
              setSearch("");
            }}
            className="font-bold text-gray-500 hover:text-emerald-600"
          >
            {lang === "uz" ? "Sinflar" : "Классы"}
          </button>
          <ChevronRight size={14} className="text-gray-300" />
          <button
            onClick={() => {
              setSelectedSubject(null);
              setSearch("");
            }}
            className={`font-bold ${
              !selectedSubject
                ? "text-emerald-600"
                : "text-gray-500 hover:text-emerald-600"
            }`}
          >
            {lang === "uz"
              ? `${selectedGrade}-sinf`
              : `${selectedGrade} класс`}
          </button>
          {selectedSubject && (
            <>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="font-bold text-emerald-600 truncate">
                {lang === "uz"
                  ? findSubject(selectedGrade, selectedSubject)?.uz
                  : findSubject(selectedGrade, selectedSubject)?.ru}
              </span>
            </>
          )}
        </div>
      )}

      {/* LEVEL 1: Sinflar */}
      {!selectedGrade && (
        <div>
          <h2 className="font-black text-base sm:text-lg text-gray-800 mb-3 sm:mb-4">
            {lang === "uz" ? "Sinfni tanlang" : "Выберите класс"}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
            {Object.keys(SCHOOL_SUBJECTS).map((g) => {
              const grade = parseInt(g);
              const c = GRADE_COLORS[grade];
              const subjectCount = SCHOOL_SUBJECTS[grade].length;
              return (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`bg-gradient-to-br ${c.bg} ${c.text} rounded-xl sm:rounded-2xl p-3 sm:p-5 text-left hover:scale-[1.04] active:scale-[0.98] transition shadow-sm hover:shadow-lg border border-white/40`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${c.solid} text-white flex items-center justify-center mb-2 sm:mb-3 font-black text-base sm:text-lg shadow-md`}
                  >
                    {grade}
                  </div>
                  <h3 className="font-black text-sm sm:text-base mb-0.5">
                    {lang === "uz" ? `${grade}-sinf` : `${grade} кл.`}
                  </h3>
                  <p className="text-[10px] sm:text-xs opacity-70 flex items-center gap-1">
                    <BookOpen size={10} className="sm:w-3 sm:h-3" />
                    {subjectCount} {lang === "uz" ? "fan" : "предм."}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* LEVEL 2: Fanlar */}
      {selectedGrade && !selectedSubject && (
        <div>
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <button
              onClick={() => setSelectedGrade(null)}
              className="p-2 rounded-xl hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg sm:text-xl font-black text-gray-900">
              {lang === "uz" ? "Fanlar" : "Предметы"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(SCHOOL_SUBJECTS[selectedGrade] || []).map((s) => {
              const c = GRADE_COLORS[selectedGrade];
              const book = findBook(selectedGrade, s.key);
              const vcount = subjectVideos(selectedGrade, s.key).length;
              return (
                <button
                  key={s.key}
                  onClick={() => setSelectedSubject(s.key)}
                  className="bg-white hover:shadow-md rounded-2xl p-4 text-left transition flex items-start gap-3 border border-gray-100"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <FileText className={c.text} size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-sm text-gray-800 mb-1 line-clamp-2">
                      {lang === "uz" ? s.uz : s.ru}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {book && (
                        <span className="bg-blue-50 text-[#1a56db] font-bold px-2 py-0.5 rounded">
                          📕 PDF
                        </span>
                      )}
                      <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded">
                        🎬 {vcount}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 mt-3" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* LEVEL 3: Fan sahifasi */}
      {selectedGrade && selectedSubject && (
        <div className="space-y-6">
          {/* PDF kitob */}
          {(() => {
            const book = findBook(selectedGrade, selectedSubject);
            if (!book) {
              return (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                  <BookOpen className="mx-auto text-gray-300 mb-2" size={36} />
                  <p className="text-sm text-gray-500">
                    {lang === "uz"
                      ? "Hozircha PDF kitob yo'q"
                      : "PDF книги пока нет"}
                  </p>
                </div>
              );
            }
            return (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-20 bg-white rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                    <FileText className="text-[#1a56db]" size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base sm:text-lg text-gray-800 mb-1">
                      {lang === "uz" ? "PDF Kitob" : "PDF Книга"}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {lang === "uz"
                        ? findSubject(selectedGrade, selectedSubject)?.uz
                        : findSubject(selectedGrade, selectedSubject)?.ru}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => openPdf(book)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white py-2.5 rounded-xl font-bold text-sm transition"
                  >
                    <Eye size={16} />
                    {lang === "uz" ? "Onlayn ko'rish" : "Открыть онлайн"}
                  </button>
                  <button
                    onClick={() => downloadPdf(book)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#1a56db] border-2 border-[#1a56db] py-2.5 rounded-xl font-bold text-sm transition"
                  >
                    <Download size={16} />
                    {lang === "uz" ? "Yuklab olish" : "Скачать"}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Search */}
          <div className="bg-white rounded-2xl border border-gray-100 p-3">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder={
                  lang === "uz"
                    ? "Video nomi bo'yicha qidirish..."
                    : "Поиск по названию..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-0 bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          {/* Videolar */}
          <div>
            <h3 className="font-black text-base sm:text-lg text-gray-800 mb-3 flex items-center gap-2">
              <Play size={18} className="text-rose-600" fill="currentColor" />
              {lang === "uz" ? "Video Darsliklar" : "Видеоуроки"}{" "}
              <span className="text-sm font-medium text-gray-400">
                ({filteredVideos.length})
              </span>
            </h3>
            {filteredVideos.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <Play
                  className="mx-auto text-gray-300 mb-2"
                  size={36}
                  fill="currentColor"
                />
                <p className="text-sm text-gray-500">
                  {search
                    ? lang === "uz"
                      ? "Topilmadi"
                      : "Не найдено"
                    : lang === "uz"
                    ? "Hozircha video darslik yo'q"
                    : "Видеоуроков пока нет"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredVideos.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setPlaying(v)}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition text-left group"
                  >
                    <div className="aspect-video bg-black relative overflow-hidden">
                      <img
                        src={v.thumbnail}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition" />
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center group-hover:scale-110 transition shadow-xl">
                          <Play
                            size={22}
                            className="text-rose-600 ml-1"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-black text-sm text-gray-800 line-clamp-2">
                        {lang === "uz" ? v.title_uz : v.title_ru || v.title_uz}
                      </h4>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Book-style PDF Viewer */}
      {pdfPreview && (
        <BookPdfViewer
          url={pdfPreview.url}
          name={pdfPreview.name}
          lang={lang}
          onClose={closePdfPreview}
          onDownload={pdfBookData ? () => downloadPdf(pdfBookData) : undefined}
        />
      )}

      {/* Video Player Modal */}
      {playing && (
        <div
          onClick={() => setPlaying(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-black truncate">
                {lang === "uz"
                  ? playing.title_uz
                  : playing.title_ru || playing.title_uz}
              </h3>
              <button
                onClick={() => setPlaying(null)}
                className="text-gray-400"
              >
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <YouTubePlayer videoId={playing.youtubeId} autoplay />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
