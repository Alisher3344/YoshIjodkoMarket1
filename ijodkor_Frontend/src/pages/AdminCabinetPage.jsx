import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  Video,
  LogOut,
  Plus,
  Trash2,
  Download,
  Play,
  FileText,
  Upload,
  X,
  Search,
  Film,
  Edit2,
  Check,
  Eye,
} from "lucide-react";
import useStore from "../store/useStore";
import {
  BOOK_CATEGORIES,
  findCategory as findBookCategory,
  findSubcategory as findBookSubcategory,
} from "../components/ui/data/bookCategories";

const VIDEO_CATEGORIES = [
  { key: "math", uz: "Matematika", ru: "Математика" },
  { key: "physics", uz: "Fizika", ru: "Физика" },
  { key: "chemistry", uz: "Kimyo", ru: "Химия" },
  { key: "biology", uz: "Biologiya", ru: "Биология" },
  { key: "english", uz: "Ingliz tili", ru: "Английский" },
  { key: "informatics", uz: "Informatika", ru: "Информатика" },
  { key: "other", uz: "Boshqa", ru: "Другие" },
];

// IndexedDB helpers
const openDB = (name) =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(name, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(name === "admin_book_db" ? "books" : "videos");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const saveBlob = async (dbName, store, id, blob) => {
  const db = await openDB(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const getBlob = async (dbName, store, id) => {
  const db = await openDB(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

const deleteBlob = async (dbName, store, id) => {
  const db = await openDB(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function AdminCabinetPage() {
  const navigate = useNavigate();
  const {
    lang,
    adminLoggedIn,
    currentUser,
    adminLogout,
    orders,
    fetchOrders,
    updateOrderStatus,
  } = useStore();

  const [tab, setTab] = useState("orders");

  // Rol tekshiruvi
  useEffect(() => {
    if (!adminLoggedIn) {
      navigate("/auth");
      return;
    }
    if (currentUser?.role === "superadmin") {
      navigate("/admin");
      return;
    }
    if (currentUser?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchOrders();
  }, [adminLoggedIn]);

  // ── BOOKS ────────────────────────────────────────────────────────────────
  const [books, setBooks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_books") || "[]");
    } catch {
      return [];
    }
  });
  const [bookForm, setBookForm] = useState({
    title_uz: "",
    title_ru: "",
    author: "",
    category: BOOK_CATEGORIES[0].key,
    subcategory: BOOK_CATEGORIES[0].subcategories[0].key,
    pdfName: "",
    pdfSize: 0,
    cover: "",
  });
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [bookCatFilter, setBookCatFilter] = useState("all");
  const [bookUploading, setBookUploading] = useState(false);

  const saveBooks = (next) => {
    setBooks(next);
    localStorage.setItem("admin_books", JSON.stringify(next));
  };

  const resetBookForm = () => {
    setBookForm({
      title_uz: "",
      title_ru: "",
      author: "",
      category: BOOK_CATEGORIES[0].key,
      subcategory: BOOK_CATEGORIES[0].subcategories[0].key,
      pdfName: "",
      pdfSize: 0,
      cover: "",
    });
    setEditingBookId(null);
  };

  const handlePdfUpload = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert(lang === "uz" ? "Faqat PDF" : "Только PDF");
      return;
    }
    setBookForm((f) => ({
      ...f,
      pdfName: file.name,
      pdfSize: file.size,
      _file: file,
    }));
  };

  const handleCoverUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setBookForm((f) => ({ ...f, cover: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleBookCategoryChange = (catKey) => {
    const cat = findBookCategory(catKey);
    setBookForm((f) => ({
      ...f,
      category: catKey,
      subcategory: cat?.subcategories?.[0]?.key || "",
    }));
  };

  const submitBook = async () => {
    if (!bookForm.title_uz) {
      alert(lang === "uz" ? "Nom kerak" : "Нужно название");
      return;
    }
    setBookUploading(true);
    try {
      if (editingBookId) {
        // Update
        const updated = books.map((b) =>
          b.id === editingBookId
            ? {
                ...b,
                title_uz: bookForm.title_uz,
                title_ru: bookForm.title_ru,
                author: bookForm.author,
                category: bookForm.category,
                subcategory: bookForm.subcategory,
                cover: bookForm.cover,
                ...(bookForm._file && {
                  pdfName: bookForm.pdfName,
                  pdfSize: bookForm.pdfSize,
                }),
              }
            : b
        );
        if (bookForm._file) {
          await saveBlob("admin_book_db", "books", editingBookId, bookForm._file);
        }
        saveBooks(updated);
      } else {
        if (!bookForm._file) {
          alert(lang === "uz" ? "PDF fayl kerak" : "Нужен PDF");
          setBookUploading(false);
          return;
        }
        const id = Date.now();
        await saveBlob("admin_book_db", "books", id, bookForm._file);
        const newBook = {
          id,
          title_uz: bookForm.title_uz,
          title_ru: bookForm.title_ru,
          author: bookForm.author,
          category: bookForm.category,
          subcategory: bookForm.subcategory,
          pdfName: bookForm.pdfName,
          pdfSize: bookForm.pdfSize,
          cover: bookForm.cover,
          createdAt: new Date().toISOString(),
        };
        saveBooks([newBook, ...books]);
      }
      resetBookForm();
      setShowBookForm(false);
    } catch (e) {
      alert(lang === "uz" ? "Xato: " + e.message : "Ошибка: " + e.message);
    } finally {
      setBookUploading(false);
    }
  };

  const editBook = (b) => {
    setBookForm({
      title_uz: b.title_uz || "",
      title_ru: b.title_ru || "",
      author: b.author || "",
      category: b.category,
      subcategory: b.subcategory,
      pdfName: b.pdfName,
      pdfSize: b.pdfSize,
      cover: b.cover || "",
    });
    setEditingBookId(b.id);
    setShowBookForm(true);
  };

  const deleteBook = async (id) => {
    if (!confirm(lang === "uz" ? "O'chirilsinmi?" : "Удалить?")) return;
    try {
      await deleteBlob("admin_book_db", "books", id);
    } catch {}
    saveBooks(books.filter((b) => b.id !== id));
  };

  const downloadBook = async (b) => {
    try {
      const blob = await getBlob("admin_book_db", "books", b.id);
      if (!blob) {
        alert(lang === "uz" ? "PDF topilmadi" : "PDF не найден");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = b.pdfName || "kitob.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      alert(lang === "uz" ? "Xato" : "Ошибка");
    }
  };

  // ── VIDEOS ───────────────────────────────────────────────────────────────
  const [videos, setVideos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_videos") || "[]");
    } catch {
      return [];
    }
  });
  const [videoForm, setVideoForm] = useState({
    title_uz: "",
    title_ru: "",
    teacher: "",
    category: "math",
    duration: "",
    videoUrl: "",
    youtubeId: "",
    fileName: "",
    fileSize: 0,
  });
  const [videoSourceType, setVideoSourceType] = useState("youtube");
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [videoCatFilter, setVideoCatFilter] = useState("all");
  const [videoUploading, setVideoUploading] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);

  const saveVideos = (next) => {
    setVideos(next);
    localStorage.setItem("admin_videos", JSON.stringify(next));
  };

  const resetVideoForm = () => {
    setVideoForm({
      title_uz: "",
      title_ru: "",
      teacher: "",
      category: "math",
      duration: "",
      videoUrl: "",
      youtubeId: "",
      fileName: "",
      fileSize: 0,
    });
    setEditingVideoId(null);
  };

  const extractYouTubeId = (input) => {
    if (!input) return null;
    const s = input.trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
    let m = s.match(/[?&]v=([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    m = s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    m = s.match(/\/embed\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    m = s.match(/\/shorts\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    const srcMatch = s.match(/src=["']([^"']+)["']/);
    if (srcMatch) return extractYouTubeId(srcMatch[1]);
    return null;
  };

  const handleVideoUrlChange = (value) => {
    const id = extractYouTubeId(value);
    setVideoForm((f) => ({ ...f, videoUrl: value, youtubeId: id || "" }));
  };

  const handleVideoFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) return;
    setVideoForm((f) => ({
      ...f,
      fileName: file.name,
      fileSize: file.size,
      _file: file,
    }));
  };

  const submitVideo = async () => {
    if (!videoForm.title_uz) {
      alert(lang === "uz" ? "Nom kerak" : "Нужно название");
      return;
    }
    if (videoSourceType === "youtube") {
      if (!videoForm.youtubeId) {
        alert(lang === "uz" ? "To'g'ri YouTube link" : "Некорректная ссылка");
        return;
      }
      const meta = {
        id: editingVideoId || Date.now(),
        type: "youtube",
        title_uz: videoForm.title_uz,
        title_ru: videoForm.title_ru,
        teacher: videoForm.teacher,
        category: videoForm.category,
        duration: videoForm.duration,
        youtubeId: videoForm.youtubeId,
        thumbnail: `https://img.youtube.com/vi/${videoForm.youtubeId}/hqdefault.jpg`,
        createdAt: new Date().toISOString(),
      };
      if (editingVideoId) {
        saveVideos(videos.map((v) => (v.id === editingVideoId ? meta : v)));
      } else {
        saveVideos([meta, ...videos]);
      }
      resetVideoForm();
      setShowVideoForm(false);
      return;
    }
    if (!videoForm._file && !editingVideoId) {
      alert(lang === "uz" ? "Video fayl kerak" : "Нужен видео файл");
      return;
    }
    setVideoUploading(true);
    try {
      const id = editingVideoId || Date.now();
      if (videoForm._file) {
        await saveBlob("admin_video_db", "videos", id, videoForm._file);
      }
      const meta = {
        id,
        type: "file",
        title_uz: videoForm.title_uz,
        title_ru: videoForm.title_ru,
        teacher: videoForm.teacher,
        category: videoForm.category,
        duration: videoForm.duration,
        fileName: videoForm.fileName,
        fileSize: videoForm.fileSize,
        createdAt: new Date().toISOString(),
      };
      if (editingVideoId) {
        saveVideos(videos.map((v) => (v.id === editingVideoId ? meta : v)));
      } else {
        saveVideos([meta, ...videos]);
      }
      resetVideoForm();
      setShowVideoForm(false);
    } catch (e) {
      alert(lang === "uz" ? "Xato" : "Ошибка");
    } finally {
      setVideoUploading(false);
    }
  };

  const editVideo = (v) => {
    setVideoForm({
      title_uz: v.title_uz || "",
      title_ru: v.title_ru || "",
      teacher: v.teacher || "",
      category: v.category,
      duration: v.duration || "",
      videoUrl: v.youtubeId
        ? `https://www.youtube.com/watch?v=${v.youtubeId}`
        : "",
      youtubeId: v.youtubeId || "",
      fileName: v.fileName || "",
      fileSize: v.fileSize || 0,
    });
    setVideoSourceType(v.type === "youtube" ? "youtube" : "file");
    setEditingVideoId(v.id);
    setShowVideoForm(true);
  };

  const deleteVideo = async (id) => {
    if (!confirm(lang === "uz" ? "O'chirilsinmi?" : "Удалить?")) return;
    const v = videos.find((x) => x.id === id);
    if (v?.type !== "youtube") {
      try {
        await deleteBlob("admin_video_db", "videos", id);
      } catch {}
    }
    saveVideos(videos.filter((x) => x.id !== id));
  };

  const playVideo = async (v) => {
    if (v.type === "youtube") {
      setPlayingVideo(v);
      return;
    }
    try {
      const blob = await getBlob("admin_video_db", "videos", v.id);
      if (!blob) {
        alert(lang === "uz" ? "Video topilmadi" : "Видео не найдено");
        return;
      }
      const url = URL.createObjectURL(blob);
      setPlayingVideo({ ...v, _blobUrl: url });
    } catch {
      alert(lang === "uz" ? "Xato" : "Ошибка");
    }
  };

  const handleLogout = () => {
    if (confirm(lang === "uz" ? "Chiqilsinmi?" : "Выйти?")) {
      adminLogout();
      navigate("/");
    }
  };

  const navItems = [
    {
      key: "orders",
      icon: <ShoppingBag size={18} />,
      label: lang === "uz" ? "Buyurtmalar" : "Заказы",
      badge: orders.filter((o) => o.status === "new").length,
    },
    {
      key: "books",
      icon: <BookOpen size={18} />,
      label: lang === "uz" ? "Kitoblar" : "Книги",
    },
    {
      key: "videos",
      icon: <Video size={18} />,
      label: lang === "uz" ? "Video Darsliklar" : "Видеоуроки",
    },
  ];

  if (!adminLoggedIn || currentUser?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-sm border-r border-gray-100 flex flex-col fixed h-full z-10">
        <div className="p-5 border-b">
          <div className="font-black text-lg text-[#1a56db] flex items-center gap-2">
            <LayoutDashboard size={20} />
            Admin
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {currentUser?.name || "Admin"}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                tab === item.key
                  ? "bg-[#1a56db] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge > 0 && (
                <span
                  className={`text-xs font-black w-5 h-5 rounded-full flex items-center justify-center ${
                    tab === item.key
                      ? "bg-white text-[#1a56db]"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            {lang === "uz" ? "Chiqish" : "Выйти"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 p-6">
        {/* ── BUYURTMALAR ── */}
        {tab === "orders" && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 mb-6">
              <ShoppingBag className="text-[#1a56db]" size={26} />
              {lang === "uz" ? "Buyurtmalar" : "Заказы"}
              <span className="text-sm font-medium text-gray-400">
                ({orders.length})
              </span>
            </h1>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <ShoppingBag className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 text-sm">
                  {lang === "uz" ? "Buyurtmalar yo'q" : "Заказов нет"}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                        №
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                        {lang === "uz" ? "Mijoz" : "Клиент"}
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                        {lang === "uz" ? "Telefon" : "Телефон"}
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                        {lang === "uz" ? "Summa" : "Сумма"}
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                        {lang === "uz" ? "Holat" : "Статус"}
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-bold">
                          #{o.id}
                        </td>
                        <td className="px-4 py-3 text-sm">{o.full_name || o.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {o.phone}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold">
                          {(o.total || 0).toLocaleString()} so'm
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status}
                            onChange={(e) =>
                              updateOrderStatus(o.id, e.target.value)
                            }
                            className={`text-xs font-bold px-2 py-1 rounded-md border-0 cursor-pointer ${
                              o.status === "new"
                                ? "bg-blue-100 text-blue-700"
                                : o.status === "confirmed"
                                ? "bg-amber-100 text-amber-700"
                                : o.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <option value="new">
                              {lang === "uz" ? "Yangi" : "Новый"}
                            </option>
                            <option value="confirmed">
                              {lang === "uz" ? "Tasdiqlangan" : "Подтверждён"}
                            </option>
                            <option value="delivered">
                              {lang === "uz" ? "Yetkazilgan" : "Доставлен"}
                            </option>
                            <option value="cancelled">
                              {lang === "uz" ? "Bekor" : "Отменён"}
                            </option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── KITOBLAR ── */}
        {tab === "books" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <BookOpen className="text-[#1a56db]" size={26} />
                {lang === "uz" ? "Kitoblar" : "Книги"}
                <span className="text-sm font-medium text-gray-400">
                  ({books.length})
                </span>
              </h1>
              <button
                onClick={() => {
                  resetBookForm();
                  setShowBookForm(true);
                }}
                className="flex items-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition"
              >
                <Plus size={16} />
                {lang === "uz" ? "Kitob qo'shish" : "Добавить книгу"}
              </button>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                onClick={() => setBookCatFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  bookCatFilter === "all"
                    ? "bg-[#1a56db] text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {lang === "uz" ? "Barchasi" : "Все"} ({books.length})
              </button>
              {BOOK_CATEGORIES.map((c) => {
                const count = books.filter((b) => b.category === c.key).length;
                if (count === 0) return null;
                return (
                  <button
                    key={c.key}
                    onClick={() => setBookCatFilter(c.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      bookCatFilter === c.key
                        ? "bg-[#1a56db] text-white"
                        : "bg-white text-gray-600 border border-gray-200"
                    }`}
                  >
                    <img src={c.icon3d} alt="" className="w-4 h-4" />
                    {lang === "uz" ? c.uz : c.ru} ({count})
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            {books.filter(
              (b) => bookCatFilter === "all" || b.category === bookCatFilter
            ).length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <BookOpen className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 text-sm">
                  {lang === "uz" ? "Kitoblar yo'q" : "Книг нет"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books
                  .filter(
                    (b) =>
                      bookCatFilter === "all" || b.category === bookCatFilter
                  )
                  .map((b) => {
                    const cat = findBookCategory(b.category);
                    const sub = findBookSubcategory(b.category, b.subcategory);
                    return (
                      <div
                        key={b.id}
                        className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-14 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {b.cover ? (
                              <img
                                src={b.cover}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={cat?.icon3d}
                                alt=""
                                className="w-9 h-9 object-contain"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-black text-sm text-gray-800 line-clamp-2">
                              {lang === "uz" ? b.title_uz : b.title_ru || b.title_uz}
                            </h3>
                            {b.author && (
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {b.author}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
                          {sub && (
                            <span className="bg-blue-50 text-[#1a56db] font-bold px-2 py-1 rounded-md">
                              {lang === "uz" ? sub.uz : sub.ru}
                            </span>
                          )}
                          <span className="text-gray-400 ml-auto">
                            {formatFileSize(b.pdfSize)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => downloadBook(b)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-[#1a56db] py-2 rounded-lg text-xs font-bold transition"
                          >
                            <Download size={13} /> PDF
                          </button>
                          <button
                            onClick={() => editBook(b)}
                            className="flex items-center justify-center bg-amber-50 hover:bg-amber-100 text-amber-600 px-3 py-2 rounded-lg text-xs font-bold transition"
                            title={lang === "uz" ? "Tahrirlash" : "Изменить"}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => deleteBook(b.id)}
                            className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-bold transition"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ── VIDEOS ── */}
        {tab === "videos" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Video className="text-rose-600" size={26} />
                {lang === "uz" ? "Video Darsliklar" : "Видеоуроки"}
                <span className="text-sm font-medium text-gray-400">
                  ({videos.length})
                </span>
              </h1>
              <button
                onClick={() => {
                  resetVideoForm();
                  setShowVideoForm(true);
                }}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition"
              >
                <Plus size={16} />
                {lang === "uz" ? "Video qo'shish" : "Добавить видео"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              <button
                onClick={() => setVideoCatFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  videoCatFilter === "all"
                    ? "bg-rose-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {lang === "uz" ? "Barchasi" : "Все"} ({videos.length})
              </button>
              {VIDEO_CATEGORIES.map((c) => {
                const count = videos.filter((v) => v.category === c.key).length;
                if (count === 0) return null;
                return (
                  <button
                    key={c.key}
                    onClick={() => setVideoCatFilter(c.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      videoCatFilter === c.key
                        ? "bg-rose-600 text-white"
                        : "bg-white text-gray-600 border border-gray-200"
                    }`}
                  >
                    {lang === "uz" ? c.uz : c.ru} ({count})
                  </button>
                );
              })}
            </div>

            {videos.filter(
              (v) => videoCatFilter === "all" || v.category === videoCatFilter
            ).length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <Film className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 text-sm">
                  {lang === "uz" ? "Videolar yo'q" : "Видео нет"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos
                  .filter(
                    (v) =>
                      videoCatFilter === "all" || v.category === videoCatFilter
                  )
                  .map((v) => {
                    const cat = VIDEO_CATEGORIES.find(
                      (c) => c.key === v.category
                    );
                    return (
                      <div
                        key={v.id}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition"
                      >
                        <button
                          onClick={() => playVideo(v)}
                          className="w-full aspect-video bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center group relative overflow-hidden"
                        >
                          {v.type === "youtube" && v.thumbnail && (
                            <img
                              src={v.thumbnail}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30" />
                          <div className="relative w-14 h-14 rounded-full bg-white/95 flex items-center justify-center group-hover:scale-110 transition shadow-lg">
                            <Play size={22} className="text-rose-600 ml-1" fill="currentColor" />
                          </div>
                          {v.type === "youtube" && (
                            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
                              YouTube
                            </span>
                          )}
                          {v.duration && (
                            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded">
                              {v.duration}
                            </span>
                          )}
                        </button>
                        <div className="p-3">
                          <h3 className="font-black text-sm text-gray-800 line-clamp-2 mb-1">
                            {lang === "uz" ? v.title_uz : v.title_ru || v.title_uz}
                          </h3>
                          {v.teacher && (
                            <p className="text-xs text-gray-500 mb-2">{v.teacher}</p>
                          )}
                          <div className="flex items-center gap-2 mb-3 text-xs">
                            <span className="bg-rose-50 text-rose-700 font-bold px-2 py-1 rounded-md">
                              {lang === "uz" ? cat?.uz : cat?.ru}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => playVideo(v)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 py-2 rounded-lg text-xs font-bold transition"
                            >
                              <Play size={13} />
                              {lang === "uz" ? "Ko'rish" : "Смотреть"}
                            </button>
                            <button
                              onClick={() => editVideo(v)}
                              className="flex items-center justify-center bg-amber-50 hover:bg-amber-100 text-amber-600 px-3 py-2 rounded-lg text-xs font-bold transition"
                              title={lang === "uz" ? "Tahrirlash" : "Изменить"}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => deleteVideo(v.id)}
                              className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-bold transition"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── KITOB FORMA ── */}
      {showBookForm && (
        <div
          onClick={() => !bookUploading && setShowBookForm(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h2 className="font-black text-lg text-gray-900">
                {editingBookId
                  ? lang === "uz"
                    ? "Kitobni tahrirlash"
                    : "Изменить книгу"
                  : lang === "uz"
                  ? "Yangi kitob"
                  : "Новая книга"}
              </h2>
              <button
                onClick={() => !bookUploading && setShowBookForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <input
                type="text"
                placeholder={lang === "uz" ? "Nomi (UZ) *" : "Название (UZ) *"}
                value={bookForm.title_uz}
                onChange={(e) =>
                  setBookForm({ ...bookForm, title_uz: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
              />
              <input
                type="text"
                placeholder={lang === "uz" ? "Nomi (RU)" : "Название (RU)"}
                value={bookForm.title_ru}
                onChange={(e) =>
                  setBookForm({ ...bookForm, title_ru: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
              />
              <input
                type="text"
                placeholder={lang === "uz" ? "Muallif" : "Автор"}
                value={bookForm.author}
                onChange={(e) =>
                  setBookForm({ ...bookForm, author: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
              />

              <select
                value={bookForm.category}
                onChange={(e) => handleBookCategoryChange(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white"
              >
                {BOOK_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.icon} {lang === "uz" ? c.uz : c.ru}
                  </option>
                ))}
              </select>

              <select
                value={bookForm.subcategory}
                onChange={(e) =>
                  setBookForm({ ...bookForm, subcategory: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white"
              >
                {(findBookCategory(bookForm.category)?.subcategories || []).map(
                  (s) => (
                    <option key={s.key} value={s.key}>
                      {lang === "uz" ? s.uz : s.ru}
                    </option>
                  )
                )}
              </select>

              {/* Muqova */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {lang === "uz" ? "Muqova" : "Обложка"}
                </label>
                {bookForm.cover && (
                  <div className="relative mb-2">
                    <img
                      src={bookForm.cover}
                      alt=""
                      className="w-full h-40 object-contain bg-gray-50 rounded-xl border border-gray-200"
                    />
                    <button
                      onClick={() => setBookForm({ ...bookForm, cover: "" })}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                <label className="block cursor-pointer mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-200 hover:border-[#1a56db] rounded-xl p-3 text-center text-xs text-gray-600">
                    <Upload className="mx-auto text-gray-400 mb-1" size={18} />
                    {lang === "uz" ? "Fayl tanlash" : "Выбрать файл"}
                  </div>
                </label>
                <input
                  type="url"
                  placeholder="URL: https://..."
                  value={bookForm.cover?.startsWith("http") ? bookForm.cover : ""}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, cover: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>

              {/* PDF */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {lang === "uz" ? "PDF fayl" : "PDF файл"}{" "}
                  {!editingBookId && "*"}
                </label>
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handlePdfUpload(e.target.files?.[0])}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-200 hover:border-[#1a56db] rounded-xl p-5 text-center">
                    {bookForm.pdfName ? (
                      <div>
                        <FileText
                          className="mx-auto text-[#1a56db] mb-2"
                          size={26}
                        />
                        <div className="text-sm font-bold truncate">
                          {bookForm.pdfName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(bookForm.pdfSize)}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload
                          className="mx-auto text-gray-400 mb-2"
                          size={26}
                        />
                        <div className="text-sm text-gray-600">
                          {lang === "uz" ? "PDF tanlang" : "Выбрать PDF"}
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowBookForm(false)}
                  disabled={bookUploading}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm transition"
                >
                  {lang === "uz" ? "Bekor" : "Отмена"}
                </button>
                <button
                  onClick={submitBook}
                  disabled={bookUploading}
                  className="flex-1 bg-[#1a56db] hover:bg-[#1341a8] text-white py-2.5 rounded-xl font-bold text-sm transition disabled:opacity-50"
                >
                  {bookUploading
                    ? lang === "uz"
                      ? "Saqlanmoqda..."
                      : "Сохранение..."
                    : lang === "uz"
                    ? "Saqlash"
                    : "Сохранить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VIDEO FORMA ── */}
      {showVideoForm && (
        <div
          onClick={() => !videoUploading && setShowVideoForm(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h2 className="font-black text-lg text-gray-900">
                {editingVideoId
                  ? lang === "uz"
                    ? "Videoni tahrirlash"
                    : "Изменить видео"
                  : lang === "uz"
                  ? "Yangi video"
                  : "Новое видео"}
              </h2>
              <button
                onClick={() => !videoUploading && setShowVideoForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <input
                type="text"
                placeholder={lang === "uz" ? "Nomi (UZ) *" : "Название (UZ) *"}
                value={videoForm.title_uz}
                onChange={(e) =>
                  setVideoForm({ ...videoForm, title_uz: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-600"
              />
              <input
                type="text"
                placeholder={lang === "uz" ? "Nomi (RU)" : "Название (RU)"}
                value={videoForm.title_ru}
                onChange={(e) =>
                  setVideoForm({ ...videoForm, title_ru: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-600"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={lang === "uz" ? "O'qituvchi" : "Преподаватель"}
                  value={videoForm.teacher}
                  onChange={(e) =>
                    setVideoForm({ ...videoForm, teacher: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-600"
                />
                <input
                  type="text"
                  placeholder="12:30"
                  value={videoForm.duration}
                  onChange={(e) =>
                    setVideoForm({ ...videoForm, duration: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-600"
                />
              </div>

              <select
                value={videoForm.category}
                onChange={(e) =>
                  setVideoForm({ ...videoForm, category: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white"
              >
                {VIDEO_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {lang === "uz" ? c.uz : c.ru}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setVideoSourceType("youtube")}
                  className={`py-2 rounded-lg text-sm font-bold transition ${
                    videoSourceType === "youtube"
                      ? "bg-white text-rose-600 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  YouTube
                </button>
                <button
                  type="button"
                  onClick={() => setVideoSourceType("file")}
                  className={`py-2 rounded-lg text-sm font-bold transition ${
                    videoSourceType === "file"
                      ? "bg-white text-rose-600 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  {lang === "uz" ? "Fayl" : "Файл"}
                </button>
              </div>

              {videoSourceType === "youtube" ? (
                <div>
                  <textarea
                    rows={3}
                    placeholder="YouTube link, embed yoki ID"
                    value={videoForm.videoUrl}
                    onChange={(e) => handleVideoUrlChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-600 font-mono resize-none"
                  />
                  {videoForm.youtubeId && (
                    <div className="mt-2 aspect-video bg-black rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoForm.youtubeId}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoFile(e.target.files?.[0])}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-200 hover:border-rose-600 rounded-xl p-5 text-center">
                    {videoForm.fileName ? (
                      <div>
                        <Film className="mx-auto text-rose-600 mb-2" size={26} />
                        <div className="text-sm font-bold truncate">
                          {videoForm.fileName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(videoForm.fileSize)}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload className="mx-auto text-gray-400 mb-2" size={26} />
                        <div className="text-sm text-gray-600">
                          {lang === "uz" ? "Video tanlash" : "Выбрать видео"}
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowVideoForm(false)}
                  disabled={videoUploading}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm"
                >
                  {lang === "uz" ? "Bekor" : "Отмена"}
                </button>
                <button
                  onClick={submitVideo}
                  disabled={videoUploading}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  {videoUploading
                    ? lang === "uz"
                      ? "Yuklanmoqda..."
                      : "Загрузка..."
                    : lang === "uz"
                    ? "Saqlash"
                    : "Сохранить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VIDEO PLAYER ── */}
      {playingVideo && (
        <div
          onClick={() => {
            if (playingVideo._blobUrl) URL.revokeObjectURL(playingVideo._blobUrl);
            setPlayingVideo(null);
          }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-black truncate">
                {lang === "uz"
                  ? playingVideo.title_uz
                  : playingVideo.title_ru || playingVideo.title_uz}
              </h3>
              <button
                onClick={() => {
                  if (playingVideo._blobUrl)
                    URL.revokeObjectURL(playingVideo._blobUrl);
                  setPlayingVideo(null);
                }}
                className="text-gray-400"
              >
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video bg-black">
              {playingVideo.type === "youtube" ? (
                <iframe
                  src={`https://www.youtube.com/embed/${playingVideo.youtubeId}?autoplay=1`}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <video
                  src={playingVideo._blobUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
