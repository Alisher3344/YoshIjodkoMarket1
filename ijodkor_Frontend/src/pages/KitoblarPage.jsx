import { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Download,
  FileText,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  SlidersHorizontal,
  X,
  Eye,
} from "lucide-react";
import useStore from "../store/useStore";
import {
  BOOK_CATEGORIES,
  findCategory as findBookCategory,
  findSubcategory as findBookSubcategory,
} from "../components/ui/data/bookCategories";
import BookPdfViewer from "../components/ui/BookPdfViewer";
import Emoji3d from "../components/ui/Emoji3d";

export default function KitoblarPage() {
  const { lang } = useStore();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [books, setBooks] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [previewBook, setPreviewBook] = useState(null);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("admin_books") || "[]");
      setBooks(data);
    } catch {
      setBooks([]);
    }
  }, []);

  const openBookOnline = async (b) => {
    setPreviewBook(b);
    // Eski format (base64 dataURL) — to'g'ridan-to'g'ri
    if (b.pdfData) {
      setPdfPreview({ url: b.pdfData, name: b.pdfName });
      return;
    }
    // IndexedDB'dan o'qish
    try {
      const req = indexedDB.open("admin_book_db", 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore("books");
      };
      req.onsuccess = () => {
        const tx = req.result.transaction("books", "readonly");
        const getReq = tx.objectStore("books").get(b.id);
        getReq.onsuccess = () => {
          const blob = getReq.result;
          if (!blob) {
            alert(lang === "uz" ? "PDF topilmadi" : "PDF не найден");
            setPreviewBook(null);
            return;
          }
          const url = URL.createObjectURL(blob);
          setPdfPreview({ url, name: b.pdfName, _blob: true });
        };
        getReq.onerror = () => {
          alert(lang === "uz" ? "Xato" : "Ошибка");
          setPreviewBook(null);
        };
      };
    } catch {
      alert(lang === "uz" ? "Xato" : "Ошибка");
      setPreviewBook(null);
    }
  };

  const closePdfPreview = () => {
    if (pdfPreview?._blob) URL.revokeObjectURL(pdfPreview.url);
    setPdfPreview(null);
    setPreviewBook(null);
  };

  const downloadBook = async (b) => {
    try {
      // IndexedDB'dan o'qish
      const req = indexedDB.open("admin_book_db", 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore("books");
      };
      req.onsuccess = async () => {
        const tx = req.result.transaction("books", "readonly");
        const getReq = tx.objectStore("books").get(b.id);
        getReq.onsuccess = async () => {
          let blob = getReq.result;
          // Fallback: eski kitoblar (base64) uchun
          if (!blob && b.pdfData) {
            const res = await fetch(b.pdfData);
            blob = await res.blob();
          }
          if (!blob) {
            alert(lang === "uz" ? "PDF topilmadi" : "PDF не найден");
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = b.pdfName || "kitob.pdf";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        };
      };
    } catch (e) {
      alert(lang === "uz" ? "Xato" : "Ошибка");
    }
  };

  const filtered = books.filter((b) => {
    if (selectedCat && b.category !== selectedCat) return false;
    if (selectedSub && b.subcategory !== selectedSub) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (b.title_uz || "").toLowerCase().includes(q) ||
        (b.title_ru || "").toLowerCase().includes(q) ||
        (b.author || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Hero */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-4 sm:p-6 border border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <BookOpen size={20} className="sm:w-[22px] sm:h-[22px]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 truncate">
              {lang === "uz" ? "Kitoblar" : "Книги"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {lang === "uz"
                ? `${books.length} ta kitob, ${BOOK_CATEGORIES.length} ta bo'lim`
                : `${books.length} книг, ${BOOK_CATEGORIES.length} разделов`}
            </p>
          </div>
        </div>
      </div>

      {/* Search + Mobile filter toggle */}
      <div className="flex gap-2 mb-4 sm:mb-6">
        <div className="flex-1 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder={
                lang === "uz" ? "Kitob qidiring..." : "Найти книгу..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-0 bg-transparent outline-none text-sm"
            />
          </div>
        </div>
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex-shrink-0"
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">
            {lang === "uz" ? "Bo'limlar" : "Разделы"}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 lg:gap-6">
        {/* Mobile sidebar overlay */}
        {mobileFilterOpen && (
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`space-y-1 bg-white rounded-2xl p-3 border border-gray-100 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:sticky lg:top-[200px] ${
            mobileFilterOpen
              ? "fixed inset-y-0 left-0 w-[85%] max-w-sm z-50 overflow-y-auto rounded-r-2xl rounded-l-none animate-slideRight"
              : "hidden lg:block"
          }`}
        >
          {/* Mobile close button */}
          {mobileFilterOpen && (
            <div className="lg:hidden flex items-center justify-between p-2 mb-2 border-b border-gray-100">
              <h3 className="font-black text-base">
                {lang === "uz" ? "Bo'limlar" : "Разделы"}
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setSelectedCat(null);
              setSelectedSub(null);
              setMobileFilterOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition ${
              !selectedCat
                ? "bg-amber-50 text-amber-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {lang === "uz" ? "Barcha kitoblar" : "Все книги"} ({books.length})
          </button>

          {BOOK_CATEGORIES.map((cat) => {
            const isOpen = selectedCat === cat.key;
            const catCount = books.filter((b) => b.category === cat.key).length;
            return (
              <div key={cat.key}>
                <button
                  onClick={() => {
                    if (selectedCat === cat.key) {
                      setSelectedCat(null);
                      setSelectedSub(null);
                    } else {
                      setSelectedCat(cat.key);
                      setSelectedSub(null);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${
                    isOpen
                      ? "bg-amber-100 text-amber-800"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <img
                    src={cat.icon3d}
                    alt=""
                    className="w-6 h-6 object-contain flex-shrink-0"
                    loading="lazy"
                  />
                  <span className="flex-1 truncate">
                    {lang === "uz" ? cat.uz : cat.ru}
                  </span>
                  <span className="text-xs text-gray-400">{catCount}</span>
                  {isOpen ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>

                {isOpen && (
                  <div className="ml-3 mt-1 mb-2 border-l-2 border-amber-200 pl-2 space-y-0.5">
                    {cat.subcategories.map((sub) => {
                      const subCount = books.filter(
                        (b) =>
                          b.category === cat.key && b.subcategory === sub.key
                      ).length;
                      return (
                        <button
                          key={sub.key}
                          onClick={() => {
                            setSelectedSub(sub.key);
                            setMobileFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center justify-between ${
                            selectedSub === sub.key
                              ? "bg-amber-50 text-amber-700 font-bold"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span className="truncate">
                            {lang === "uz" ? sub.uz : sub.ru}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            {subCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* Main — kitoblar */}
        <main>
          {/* Breadcrumb */}
          {(selectedCat || selectedSub) && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <button
                onClick={() => {
                  setSelectedCat(null);
                  setSelectedSub(null);
                }}
                className="text-xs font-bold text-gray-500 hover:text-amber-700 flex items-center gap-1"
              >
                <ArrowLeft size={12} />
                {lang === "uz" ? "Barchasi" : "Все"}
              </button>
              {selectedCat && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-xs font-bold text-amber-700">
                    {lang === "uz"
                      ? findBookCategory(selectedCat)?.uz
                      : findBookCategory(selectedCat)?.ru}
                  </span>
                </>
              )}
              {selectedSub && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-xs font-bold text-amber-700">
                    {lang === "uz"
                      ? findBookSubcategory(selectedCat, selectedSub)?.uz
                      : findBookSubcategory(selectedCat, selectedSub)?.ru}
                  </span>
                </>
              )}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <BookOpen size={36} className="text-amber-600" />
              </div>
              <h3 className="font-black text-xl text-gray-800 mb-2">
                {books.length === 0
                  ? lang === "uz"
                    ? "Hozircha kitoblar yo'q"
                    : "Книг пока нет"
                  : lang === "uz"
                  ? "Topilmadi"
                  : "Не найдено"}
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {books.length === 0
                  ? lang === "uz"
                    ? "Tez orada bu yerda kitoblar paydo bo'ladi"
                    : "Скоро здесь появятся книги"
                  : lang === "uz"
                  ? "Boshqa qidiruvni sinab ko'ring"
                  : "Попробуйте другой запрос"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
              {filtered.map((b) => {
                const cat = findBookCategory(b.category);
                const sub = findBookSubcategory(b.category, b.subcategory);
                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-2 sm:p-4 hover:shadow-lg transition group"
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg sm:rounded-xl mb-2 sm:mb-3 overflow-hidden group-hover:scale-[1.02] transition relative">
                      {b.cover ? (
                        <img
                          src={b.cover}
                          alt={b.title_uz}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-4 sm:p-6">
                          {cat?.icon3d ? (
                            <img
                              src={cat.icon3d}
                              alt=""
                              className="w-full h-full object-contain drop-shadow-lg"
                              loading="lazy"
                            />
                          ) : (
                            <Emoji3d e={cat?.icon || "📕"} size={56} />
                          )}
                        </div>
                      )}
                    </div>
                    <h3 className="font-black text-xs sm:text-sm text-gray-800 mb-1 line-clamp-2">
                      {lang === "uz" ? b.title_uz : b.title_ru || b.title_uz}
                    </h3>
                    {b.author && (
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-2 truncate">
                        {b.author}
                      </p>
                    )}
                    {sub && (
                      <span className="inline-block bg-amber-50 text-amber-700 text-[9px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-md mb-2 sm:mb-3 max-w-full truncate">
                        {lang === "uz" ? sub.uz : sub.ru}
                      </span>
                    )}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openBookOnline(b)}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 bg-amber-500 hover:bg-amber-600 text-white py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition"
                      >
                        <Eye size={11} className="sm:w-[13px] sm:h-[13px]" />
                        <span className="hidden sm:inline">
                          {lang === "uz" ? "Onlayn" : "Онлайн"}
                        </span>
                        <span className="sm:hidden">
                          {lang === "uz" ? "Ochish" : "Открыть"}
                        </span>
                      </button>
                      <button
                        onClick={() => downloadBook(b)}
                        className="flex items-center justify-center bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition"
                        title={lang === "uz" ? "Yuklab olish" : "Скачать"}
                      >
                        <Download
                          size={11}
                          className="sm:w-[13px] sm:h-[13px]"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Book-style PDF Viewer */}
      {pdfPreview && (
        <BookPdfViewer
          url={pdfPreview.url}
          name={pdfPreview.name}
          lang={lang}
          onClose={closePdfPreview}
          onDownload={previewBook ? () => downloadBook(previewBook) : undefined}
        />
      )}
    </div>
  );
}
