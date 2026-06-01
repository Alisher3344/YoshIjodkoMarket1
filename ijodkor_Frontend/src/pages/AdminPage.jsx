import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categoryLabels } from "../components/ui/data/translations";
import {
  BOOK_CATEGORIES,
  findCategory as findBookCategory,
  findSubcategory as findBookSubcategory,
} from "../components/ui/data/bookCategories";
import { VIDEO_CATEGORIES as VIDEO_CATS_SHARED } from "../components/ui/data/videoCategories";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart2,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  X,
  Check,
  Users,
  UserCheck,
  Eye,
  EyeOff,
  Search,
  KeyRound,
  School,
  UserPlus,
  Building2,
  GraduationCap,
  Sun,
  Moon,
  BookOpen,
  Video,
  FileText,
  Upload,
  Download,
  Play,
  Film,
  Construction,
} from "lucide-react";
import useStore from "../store/useStore";
import { api } from "../services/api";
import { formatPhone } from "../utils/phone";
import Emoji3d from "../components/ui/Emoji3d";

const COUNTRIES = ["O'zbekiston"];

const EMPTY_FORM = {
  name_uz: "",
  name_ru: "",
  desc_uz: "",
  desc_ru: "",
  price: "",
  old_price: "",
  category: "paintings",
  author: "",
  author_ru: "",
  school: "",
  school_ru: "",
  region: "Qashqadaryo viloyati",
  region_ru: "Кашкадарьинская область",
  district: "",
  district_ru: "",
  grade: "",
  stock: "",
  badge: "",
  image: "",
  student_type: "normal",
  card_number: "",
  story_uz: "",
  story_ru: "",
  photo: "",
};

export default function AdminPage() {
  const navigate = useNavigate();
  const {
    t,
    lang,
    adminLoggedIn,
    adminLogin,
    adminLogout,
    products,
    fetchProducts,
    addProduct,
    editProduct,
    deleteProduct,
    productsLoading,
    orders,
    fetchOrders,
    updateOrderStatus,
    customOrders,
    fetchCustomOrders,
    users,
    fetchUsers,
    addUser,
    editUser,
    deleteUser,
    toggleUserStatus,
    schools,
    fetchSchools,
    addSchool,
    editSchool,
    removeSchool,
    assignAdminToSchool,
    detachAdminFromSchool,
    allStudentsGrouped,
    fetchAllStudentsGrouped,
    superadminDeleteStudent,
    darkMode,
    toggleDarkMode,
    regions,
    fetchRegions,
  } = useStore();

  // Region helperlari (DB'dan)
  const REGION_NAMES = (regions || []).map((r) => r.name);
  const getCities = (regionName) => {
    const r = (regions || []).find((x) => x.name === regionName);
    return (r?.cities || []).map((c) => c.name);
  };
  const getDistricts = (regionName) => {
    const r = (regions || []).find((x) => x.name === regionName);
    return (r?.districts || []).map((d) => d.name);
  };

  const [allStudentsSearch, setAllStudentsSearch] = useState("");
  const [allStudentsRegion, setAllStudentsRegion] = useState("");
  const [allStudentsCity, setAllStudentsCity] = useState("");
  const [allStudentsDistrict, setAllStudentsDistrict] = useState("");

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginErr, setLoginErr] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [tab, setTab] = useState("dashboard");

  useEffect(() => {
    if (
      tab === "all-students" &&
      adminLoggedIn &&
      useStore.getState().currentUser?.role === "superadmin"
    ) {
      fetchAllStudentsGrouped();
    }
  }, [tab, adminLoggedIn]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [pwdResetUser, setPwdResetUser] = useState(null);
  const [pwdValue, setPwdValue] = useState("");
  const [pwdShow, setPwdShow] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdUsername, setPwdUsername] = useState("");

  // ── Kitoblar (PDF) — localStorage'da saqlanadi ──────────────────────────
  // BOOK_CATEGORIES — components/ui/data/bookCategories.js'dan import qilingan

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
  const [bookCatFilter, setBookCatFilter] = useState("all");
  const [bookSubcatFilter, setBookSubcatFilter] = useState("all");
  const [bookUploading, setBookUploading] = useState(false);

  // PDF'lar uchun IndexedDB
  const openBookDB = () =>
    new Promise((resolve, reject) => {
      const req = indexedDB.open("admin_book_db", 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore("books");
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

  const saveBookBlob = async (id, blob) => {
    const db = await openBookDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("books", "readwrite");
      tx.objectStore("books").put(blob, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  };

  const getBookBlob = async (id) => {
    const db = await openBookDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("books", "readonly");
      const req = tx.objectStore("books").get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  const deleteBookBlob = async (id) => {
    const db = await openBookDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("books", "readwrite");
      tx.objectStore("books").delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  };

  const saveBooks = (next) => {
    setBooks(next);
    try {
      localStorage.setItem("admin_books", JSON.stringify(next));
    } catch (e) {
      alert(
        lang === "uz"
          ? "Metadata saqlash xatoligi"
          : "Ошибка сохранения метаданных"
      );
    }
  };

  const handleBookCategoryChange = (catKey) => {
    const cat = findBookCategory(catKey);
    setBookForm((f) => ({
      ...f,
      category: catKey,
      subcategory: cat?.subcategories?.[0]?.key || "",
    }));
  };

  const handlePdfUpload = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert(lang === "uz" ? "Faqat PDF fayl" : "Только PDF файл");
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
    if (!file.type.startsWith("image/")) {
      alert(lang === "uz" ? "Faqat rasm fayl" : "Только изображение");
      return;
    }
    // Rasmlarni base64'da localStorage'da saqlaymiz (odatda <500KB)
    const reader = new FileReader();
    reader.onload = () => {
      setBookForm((f) => ({ ...f, cover: reader.result }));
    };
    reader.readAsDataURL(file);
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
  };

  const submitBook = async () => {
    if (!bookForm.title_uz || !bookForm._file) {
      alert(
        lang === "uz"
          ? "Nom va PDF fayl kerak"
          : "Нужно название и PDF файл"
      );
      return;
    }
    setBookUploading(true);
    try {
      const id = Date.now();
      // PDF blobni IndexedDB'ga saqlash
      await saveBookBlob(id, bookForm._file);
      const newBook = {
        id,
        title_uz: bookForm.title_uz,
        title_ru: bookForm.title_ru,
        author: bookForm.author,
        category: bookForm.category,
        subcategory: bookForm.subcategory,
        pdfName: bookForm.pdfName,
        pdfSize: bookForm.pdfSize,
        cover: bookForm.cover || "",
        createdAt: new Date().toISOString(),
      };
      saveBooks([newBook, ...books]);
      resetBookForm();
      setShowBookForm(false);
    } catch (e) {
      alert(
        lang === "uz"
          ? "Saqlashda xato: " + (e?.message || "")
          : "Ошибка сохранения: " + (e?.message || "")
      );
    } finally {
      setBookUploading(false);
    }
  };

  const deleteBook = async (id) => {
    if (!confirm(lang === "uz" ? "O'chirilsinmi?" : "Удалить?")) return;
    try {
      await deleteBookBlob(id);
    } catch {}
    saveBooks(books.filter((b) => b.id !== id));
  };

  const downloadBook = async (b) => {
    try {
      let blob = await getBookBlob(b.id);
      // Eski kitoblar uchun (base64 saqlanganlar) — fallback
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
    } catch (e) {
      alert(lang === "uz" ? "Yuklab olishda xato" : "Ошибка скачивания");
    }
  };

  // ── Video Darsliklar — localStorage + IndexedDB (katta fayllar uchun) ──
  const VIDEO_CATEGORIES = VIDEO_CATS_SHARED;

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
  const [videoSourceType, setVideoSourceType] = useState("youtube"); // "youtube" | "file"

  // YouTube link/embed/ID dan video ID ajratish
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
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [videoCatFilter, setVideoCatFilter] = useState("all");
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);

  // IndexedDB — videolar uchun (localStorage GB limitsiz emas)
  const openVideoDB = () =>
    new Promise((resolve, reject) => {
      const req = indexedDB.open("admin_video_db", 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore("videos");
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

  const saveVideoBlob = async (id, blob) => {
    const db = await openVideoDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("videos", "readwrite");
      tx.objectStore("videos").put(blob, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  };

  const getVideoBlob = async (id) => {
    const db = await openVideoDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("videos", "readonly");
      const req = tx.objectStore("videos").get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  const deleteVideoBlob = async (id) => {
    const db = await openVideoDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("videos", "readwrite");
      tx.objectStore("videos").delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  };

  const saveVideos = (next) => {
    setVideos(next);
    localStorage.setItem("admin_videos", JSON.stringify(next));
  };

  const handleVideoUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      alert(lang === "uz" ? "Faqat video fayl" : "Только видео файл");
      return;
    }
    setVideoForm((f) => ({
      ...f,
      fileName: file.name,
      fileSize: file.size,
      _file: file,
    }));
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
  };

  const submitVideo = async () => {
    if (!videoForm.title_uz) {
      alert(lang === "uz" ? "Nom kerak" : "Нужно название");
      return;
    }

    // YouTube manbaa
    if (videoSourceType === "youtube") {
      if (!videoForm.youtubeId) {
        alert(
          lang === "uz"
            ? "To'g'ri YouTube link/embed kiriting"
            : "Введите корректную YouTube ссылку/embed"
        );
        return;
      }
      const meta = {
        id: Date.now(),
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
      saveVideos([meta, ...videos]);
      resetVideoForm();
      setShowVideoForm(false);
      return;
    }

    // Fayl manbaa
    if (!videoForm._file) {
      alert(lang === "uz" ? "Video fayl kerak" : "Нужен видео файл");
      return;
    }
    setVideoUploading(true);
    setVideoUploadProgress(0);
    try {
      const id = Date.now();
      const file = videoForm._file;
      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setVideoUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      reader.onload = async () => {
        const blob = new Blob([reader.result], { type: file.type });
        await saveVideoBlob(id, blob);
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
          fileType: file.type,
          createdAt: new Date().toISOString(),
        };
        saveVideos([meta, ...videos]);
        resetVideoForm();
        setShowVideoForm(false);
        setVideoUploading(false);
        setVideoUploadProgress(0);
      };
      reader.readAsArrayBuffer(file);
    } catch (e) {
      setVideoUploading(false);
      alert(lang === "uz" ? "Yuklashda xato" : "Ошибка загрузки");
    }
  };

  const deleteVideo = async (id) => {
    if (!confirm(lang === "uz" ? "O'chirilsinmi?" : "Удалить?")) return;
    const v = videos.find((x) => x.id === id);
    if (v?.type !== "youtube") {
      try {
        await deleteVideoBlob(id);
      } catch {}
    }
    saveVideos(videos.filter((x) => x.id !== id));
  };

  const [playingVideo, setPlayingVideo] = useState(null);

  const playVideo = async (v) => {
    if (v.type === "youtube") {
      setPlayingVideo(v);
      return;
    }
    try {
      const blob = await getVideoBlob(v.id);
      if (!blob) {
        alert(lang === "uz" ? "Video topilmadi" : "Видео не найдено");
        return;
      }
      const url = URL.createObjectURL(blob);
      setPlayingVideo({ ...v, _blobUrl: url });
    } catch (e) {
      alert(lang === "uz" ? "Xato" : "Ошибка");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // School form (faqat asosiy fieldlar)
  const EMPTY_SCHOOL = {
    name: "",
    name_ru: "",
    country: "O'zbekiston",
    region: "Qashqadaryo viloyati",
    city: "",
    district: "",
    phone: "",
  };
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [editSchoolId, setEditSchoolId] = useState(null);
  const [schoolForm, setSchoolForm] = useState(EMPTY_SCHOOL);
  const [schoolSearch, setSchoolSearch] = useState("");

  // Maktablar ro'yxatini hududiy filtr bilan filtrlash
  const [filterRegion, setFilterRegion] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");

  // Maktab batafsil sahifa (inline, AdminPage ichida)
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [schoolAdmins, setSchoolAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);

  // Yangi admin biriktirish formasi
  const [assignForm, setAssignForm] = useState({
    name: "",
    full_name: "",
    phone: "+998 ",
    username: "",
    password: "",
  });
  const [assignLoading, setAssignLoading] = useState(false);

  // Yangi yaratilgan adminlarning plaintext parollari (faqat sessiyada)
  // {[admin_id]: "qog'ozga yozish uchun parol"}
  const [adminPasswords, setAdminPasswords] = useState({});

  const selectedSchool =
    selectedSchoolId != null
      ? schools.find((s) => s.id === selectedSchoolId)
      : null;

  const loadSchoolAdmins = async (schoolId) => {
    setAdminsLoading(true);
    try {
      const list = await api.getSchoolAdmins(schoolId);
      setSchoolAdmins(list);
    } catch (err) {
      console.error("getSchoolAdmins:", err.message);
      setSchoolAdmins([]);
    } finally {
      setAdminsLoading(false);
    }
  };
  const [userForm, setUserForm] = useState({
    name: "",
    full_name: "",
    username: "",
    password: "",
    phone: "",
    school: "",
    role: "admin",
  });

  // ── Rol tekshiruvi + ma'lumotlarni yuklash ───────────────────────────────
  useEffect(() => {
    if (adminLoggedIn) {
      const currentUser = useStore.getState().currentUser;
      // Oddiy admin → admin kabineti
      if (currentUser?.role === "admin") {
        navigate("/admin-cabinet");
        return;
      }
      // SuperAdmin uchun — ma'lumotlarni yuklash
      if (currentUser?.role === "superadmin") {
        fetchSchools();
        fetchProducts();
        fetchOrders();
        fetchCustomOrders();
        fetchUsers();
        fetchAllStudentsGrouped();
        fetchRegions();
      }
    }
  }, [adminLoggedIn]);

  // ── Login ────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await adminLogin(loginForm.username, loginForm.password);
    if (!ok) {
      setLoginErr(true);
      setTimeout(() => setLoginErr(false), 2000);
      return;
    }

    // Rol tekshiruvi
    const currentUser = useStore.getState().currentUser;
    if (currentUser?.role === "admin") {
      navigate("/admin-cabinet");
    } else if (currentUser?.role === "superadmin") {
      // Shu sahifada qolamiz
    } else {
      alert(
        lang === "uz"
          ? "Bu sahifa faqat SuperAdmin uchun!"
          : "Эта страница только для SuperAdmin!"
      );
      adminLogout();
    }
  };

  // ── Mahsulot saqlash ─────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name_uz || !form.price) return;
    const data = {
      ...form,
      price: parseFloat(form.price),
      old_price: form.old_price ? parseFloat(form.old_price) : null,
      stock: parseInt(form.stock) || 0,
    };
    try {
      if (editId) {
        await editProduct(editId, data);
      } else {
        await addProduct(data);
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      alert(
        lang === "uz" ? "Xatolik: " + err.message : "Ошибка: " + err.message
      );
    }
  };

  const handleEdit = (p) => {
    setForm({
      ...EMPTY_FORM,
      ...p,
      price: String(p.price || ""),
      old_price: String(p.old_price || ""),
      stock: String(p.stock || ""),
    });
    setEditId(p.id);
    setShowForm(true);
  };

  // ── Foydalanuvchi saqlash ────────────────────────────────────────────────
  const handleUserSave = async () => {
    if (!userForm.name || !userForm.username) return;
    try {
      if (editUserId) {
        await editUser(editUserId, userForm);
      } else {
        await addUser(userForm);
      }
      setShowUserForm(false);
      setEditUserId(null);
      setUserForm({
        name: "",
        full_name: "",
        username: "",
        password: "",
        phone: "",
        school: "",
        role: "admin",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const totalRevenue = orders
    .filter((o) => o.status === "done")
    .reduce((s, o) => s + (o.total || 0), 0);
  const cats = categoryLabels[lang];

  const statusColors = {
    new: "bg-blue-100 text-blue-700",
    confirmed: "bg-yellow-100 text-yellow-700",
    shipping: "bg-orange-100 text-orange-700",
    done: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusLabels = {
    uz: {
      new: "Yangi",
      confirmed: "Tasdiqlangan",
      shipping: "Yo'lda",
      done: "Yetkazilgan",
      cancelled: "Bekor",
    },
    ru: {
      new: "Новый",
      confirmed: "Подтверждён",
      shipping: "В пути",
      done: "Доставлен",
      cancelled: "Отменён",
    },
  };

  const formatPrice = (n) => (n || 0).toLocaleString("uz-UZ") + " so'm";

  // ── Login sahifasi ───────────────────────────────────────────────────────
  if (!adminLoggedIn) {
    return (
      <div className="admin-shell min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm border border-gray-100">
          <div className="text-center mb-8">
            <Emoji3d e="🔐" size={56} className="mb-3 mx-auto" />
            <h1 className="text-2xl font-black text-gray-900">
              {t("adminLogin")}
            </h1>
            <p className="text-gray-400 text-sm mt-1">Yoshijodkor.uz</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {lang === "uz" ? "Foydalanuvchi nomi" : "Имя пользователя"}
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, username: e.target.value })
                }
                className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-[#1a56db] transition text-sm ${
                  loginErr ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
                placeholder="admin"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-[#1a56db] transition text-sm pr-10 ${
                    loginErr ? "border-red-400 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {loginErr && (
                <p className="text-red-500 text-xs mt-1">
                  {lang === "uz"
                    ? "Login yoki parol noto'g'ri"
                    : "Неверный логин или пароль"}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-[#1a56db] hover:bg-[#1341a8] text-white py-3 rounded-xl font-bold transition"
            >
              {t("login")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      key: "dashboard",
      icon: <LayoutDashboard size={18} />,
      label: t("dashboard"),
    },
    { key: "products", icon: <Package size={18} />, label: t("products") },
    { key: "orders", icon: <ShoppingBag size={18} />, label: t("orders") },
    {
      key: "custom",
      icon: <BarChart2 size={18} />,
      label: lang === "uz" ? "Maxsus buyurtmalar" : "Спецзаказы",
    },
    {
      key: "users",
      icon: <Users size={18} />,
      label: lang === "uz" ? "Adminlar" : "Админы",
    },
    {
      key: "schools",
      icon: <School size={18} />,
      label: lang === "uz" ? "Maktablar" : "Школы",
    },
    {
      key: "all-students",
      icon: <GraduationCap size={18} />,
      label: lang === "uz" ? "O'quvchilar" : "Ученики",
    },
    {
      key: "customers",
      icon: <UserCheck size={18} />,
      label: lang === "uz" ? "Mijozlar" : "Клиенты",
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
    {
      key: "school-books",
      icon: <GraduationCap size={18} />,
      label: lang === "uz" ? "Maktab Darsliklari" : "Школьные учебники",
    },
  ];

  // categories - local definition (agar kerak bo'lsa, translations'dan olasiz)
  const categories = [
    { id: "paintings", icon: "🎨", label_uz: "Rasmlar", label_ru: "Картины" },
    {
      id: "crafts",
      icon: "🪡",
      label_uz: "Hunarmandchilik",
      label_ru: "Ремёсла",
    },
    { id: "books", icon: "📚", label_uz: "Kitoblar", label_ru: "Книги" },
    { id: "other", icon: "🎁", label_uz: "Boshqa", label_ru: "Другое" },
  ];

  // ── Dashboard ────────────────────────────────────────────────────────────
  return (
    <div className="admin-shell min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-sm border-r border-gray-100 flex flex-col fixed h-full z-10">
        <div className="p-5 border-b">
          <div className="font-black text-lg text-[#1a56db] flex items-center gap-2">
            <Emoji3d e="🎨" size={22} /> Admin
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Yoshijodkor.uz</div>
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
              {item.label}
              {item.key === "orders" &&
                orders.filter((o) => o.status === "new").length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {orders.filter((o) => o.status === "new").length}
                  </span>
                )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
            title={lang === "uz" ? "Mavzuni almashtirish" : "Сменить тему"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>
              {darkMode
                ? lang === "uz"
                  ? "Yorug' rejim"
                  : "Светлая"
                : lang === "uz"
                ? "Tungi rejim"
                : "Тёмная"}
            </span>
          </button>
          <button
            onClick={adminLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            {lang === "uz" ? "Chiqish" : "Выйти"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 p-6">
        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-6">
              {t("dashboard")}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: t("totalProducts"),
                  value: products.length,
                  color: "bg-blue-50 text-blue-700",
                  icon: "📦",
                },
                {
                  label: t("totalOrders"),
                  value: orders.length,
                  color: "bg-green-50 text-green-700",
                  icon: "🛒",
                },
                {
                  label: lang === "uz" ? "Yangi buyurtmalar" : "Новые заказы",
                  value: orders.filter((o) => o.status === "new").length,
                  color: "bg-yellow-50 text-yellow-700",
                  icon: "🆕",
                },
                {
                  label: t("totalSales"),
                  value: formatPrice(totalRevenue),
                  color: "bg-purple-50 text-purple-700",
                  icon: "💰",
                },
              ].map((stat, i) => (
                <div key={i} className={`${stat.color} rounded-2xl p-5`}>
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="text-sm font-medium opacity-70 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* So'nggi buyurtmalar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-black text-gray-900 mb-4">
                {t("recentOrders")}
              </h2>
              {orders.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  {lang === "uz" ? "Buyurtmalar yo'q" : "Нет заказов"}
                </p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="font-semibold text-sm text-gray-900">
                          #{order.id} — {order.customer_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customer_phone}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">
                          {formatPrice(order.total)}
                        </p>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            statusColors[order.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {statusLabels[lang]?.[order.status] || order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MAHSULOTLAR ── */}
        {tab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black text-gray-900">
                {t("products")}
              </h1>
              <button
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setEditId(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 bg-[#1a56db] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1341a8] transition"
              >
                <Plus size={18} /> {t("addProduct")}
              </button>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-24 animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Emoji3d e="📦" size={56} className="mb-4 mx-auto" />
                <p>{lang === "uz" ? "Mahsulotlar yo'q" : "Нет товаров"}</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                        {lang === "uz" ? "Mahsulot" : "Товар"}
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">
                        {t("category")}
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                        {t("price")}
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">
                        {t("stock")}
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image || "https://via.placeholder.com/40"}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                                {lang === "uz"
                                  ? p.name_uz
                                  : p.name_ru || p.name_uz}
                              </p>
                              <p className="text-xs text-gray-400">
                                {p.author}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">
                            {cats?.[p.category] || p.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-sm">
                            {formatPrice(p.price)}
                          </p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span
                            className={`text-xs font-bold ${
                              p.stock > 0 ? "text-green-600" : "text-red-500"
                            }`}
                          >
                            {p.stock} {t("pieces")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleEdit(p)}
                              className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── BUYURTMALAR ── */}
        {tab === "orders" && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-6">
              {t("orders")}
            </h1>
            {orders.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Emoji3d e="🛒" size={56} className="mb-4 mx-auto" />
                <p>{lang === "uz" ? "Buyurtmalar yo'q" : "Нет заказов"}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-black text-gray-900">
                          #{order.id} — {order.customer_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customer_phone} • {order.customer_address}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.payment_method}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-lg">
                          {formatPrice(order.total)}
                        </p>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            statusColors[order.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {statusLabels[lang]?.[order.status] || order.status}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-1">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {lang === "uz"
                                ? item.name_uz
                                : item.name_ru || item.name_uz}{" "}
                              × {item.qty}
                            </span>
                            <span className="font-semibold">
                              {formatPrice(item.price * item.qty)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Status o'zgartirish */}
                    <div className="flex gap-2 flex-wrap">
                      {Object.keys(statusLabels.uz).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateOrderStatus(order.id, st)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                            order.status === st
                              ? `${statusColors[st]} ring-2 ring-offset-1 ring-current`
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {statusLabels[lang]?.[st]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MAXSUS BUYURTMALAR ── */}
        {tab === "custom" && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-6">
              {lang === "uz" ? "Maxsus buyurtmalar" : "Специальные заказы"}
            </h1>
            {customOrders.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Emoji3d e="🎨" size={56} className="mb-4 mx-auto" />
                <p>
                  {lang === "uz"
                    ? "Maxsus buyurtmalar yo'q"
                    : "Нет специальных заказов"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {customOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-black text-gray-900">
                          #{order.id} — {order.customer_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customer_phone}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          statusColors[order.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {statusLabels[lang]?.[order.status] || order.status}
                      </span>
                    </div>
                    {order.description && (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 mb-3">
                        {order.description}
                      </p>
                    )}
                    <div className="flex gap-3 text-xs text-gray-500">
                      {order.budget && <span>💰 {order.budget}</span>}
                      {order.deadline && <span>⏰ {order.deadline}</span>}
                      {order.order_type && <span>📦 {order.order_type}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ADMINLAR ── */}
        {tab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black text-gray-900">
                {lang === "uz" ? "Adminlar" : "Админы"}
              </h1>
              <button
                onClick={() => {
                  setUserForm({
                    name: "",
                    full_name: "",
                    username: "",
                    password: "",
                    phone: "",
                    school: "",
                    role: "admin",
                  });
                  setEditUserId(null);
                  setShowUserForm(true);
                }}
                className="flex items-center gap-2 bg-[#1a56db] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1341a8] transition"
              >
                <Plus size={18} /> {lang === "uz" ? "Admin qo'shish" : "Добавить админа"}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {(() => {
                const adminList = users.filter(
                  (u) => u.role === "admin" || u.role === "superadmin"
                );
                if (adminList.length === 0) {
                  return (
                    <div className="text-center py-20 text-gray-400">
                      <Emoji3d e="👤" size={56} className="mb-4 mx-auto" />
                      <p>
                        {lang === "uz"
                          ? "Adminlar yo'q"
                          : "Нет админов"}
                      </p>
                    </div>
                  );
                }
                return (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                        Ism
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                        Username
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                        Rol
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                        Holat
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminList.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-semibold text-sm">
                          {u.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          @{u.username}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-bold">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${
                              u.active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {u.active
                              ? lang === "uz"
                                ? "Faol"
                                : "Активен"
                              : lang === "uz"
                              ? "Bloklangan"
                              : "Заблокирован"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => {
                                setUserForm({
                                  name: u.name,
                                  full_name: u.full_name || "",
                                  username: u.username,
                                  phone: u.phone || "",
                                  school: u.school || "",
                                  role: u.role,
                                  password: "",
                                });
                                setEditUserId(u.id);
                                setShowUserForm(true);
                              }}
                              className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition"
                              title={lang === "uz" ? "Tahrirlash" : "Изменить"}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => {
                                setPwdResetUser(u);
                                setPwdUsername(u.username);
                                setPwdValue("");
                              }}
                              className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition"
                              title={
                                lang === "uz"
                                  ? "Login/Parol almashtirish"
                                  : "Сменить логин/пароль"
                              }
                            >
                              <KeyRound size={15} />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-500 transition"
                              title={
                                u.active
                                  ? lang === "uz"
                                    ? "Bloklash"
                                    : "Блокировать"
                                  : lang === "uz"
                                  ? "Faollashtirish"
                                  : "Активировать"
                              }
                            >
                              {u.active ? (
                                <EyeOff size={15} />
                              ) : (
                                <Eye size={15} />
                              )}
                            </button>
                            {u.role !== "superadmin" && (
                              <button
                                onClick={() => deleteUser(u.id)}
                                className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                                title={lang === "uz" ? "O'chirish" : "Удалить"}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                );
              })()}
            </div>
          </div>
        )}

        {tab === "all-students" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  {lang === "uz"
                    ? "Barcha o'quvchilar"
                    : "Все ученики"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {lang === "uz"
                    ? `Maktablar bo'yicha guruhlangan: ${allStudentsGrouped.reduce(
                        (sum, g) => sum + (g.students?.length || 0),
                        0
                      )} ta o'quvchi`
                    : `Сгруппировано по школам: ${allStudentsGrouped.reduce(
                        (sum, g) => sum + (g.students?.length || 0),
                        0
                      )} учеников`}
                </p>
              </div>
              <button
                onClick={fetchAllStudentsGrouped}
                className="text-sm text-gray-500 hover:text-[#1a56db]"
              >
                🔄 {lang === "uz" ? "Yangilash" : "Обновить"}
              </button>
            </div>

            {/* Qidiruv + Hududiy filtr */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-5 space-y-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={allStudentsSearch}
                  onChange={(e) => setAllStudentsSearch(e.target.value)}
                  placeholder={
                    lang === "uz"
                      ? "Ism, familiya, username yoki maktab..."
                      : "Поиск..."
                  }
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1a56db] bg-white"
                />
                {allStudentsSearch && (
                  <button
                    onClick={() => setAllStudentsSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <select
                  value={allStudentsRegion}
                  onChange={(e) => {
                    setAllStudentsRegion(e.target.value);
                    setAllStudentsCity("");
                    setAllStudentsDistrict("");
                  }}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white"
                >
                  <option value="">
                    {lang === "uz" ? "Barcha viloyatlar" : "Все области"}
                  </option>
                  {REGION_NAMES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                <select
                  value={allStudentsCity}
                  onChange={(e) => setAllStudentsCity(e.target.value)}
                  disabled={!allStudentsRegion}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">
                    {lang === "uz" ? "Barcha shaharlar" : "Все города"}
                  </option>
                  {getCities(allStudentsRegion).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  value={allStudentsDistrict}
                  onChange={(e) => setAllStudentsDistrict(e.target.value)}
                  disabled={!allStudentsRegion}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">
                    {lang === "uz" ? "Barcha tumanlar" : "Все районы"}
                  </option>
                  {getDistricts(allStudentsRegion).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {(allStudentsRegion ||
                allStudentsCity ||
                allStudentsDistrict) && (
                <button
                  onClick={() => {
                    setAllStudentsRegion("");
                    setAllStudentsCity("");
                    setAllStudentsDistrict("");
                  }}
                  className="text-xs text-[#1a56db] hover:underline"
                >
                  ✕{" "}
                  {lang === "uz" ? "Filtrni tozalash" : "Сбросить фильтр"}
                </button>
              )}
            </div>

            {(() => {
              const q = allStudentsSearch.toLowerCase().trim();
              const filterStudent = (s) =>
                !q ||
                (s.name || "").toLowerCase().includes(q) ||
                (s.full_name || "").toLowerCase().includes(q) ||
                (s.telegram_username || "").toLowerCase().includes(q) ||
                (s.phone || "").toLowerCase().includes(q) ||
                (s.grade || "").toLowerCase().includes(q);
              // Avval hududiy filtr — maktab darajasida
              const regionFiltered = allStudentsGrouped.filter((g) => {
                if (allStudentsRegion && (g.region || "") !== allStudentsRegion)
                  return false;
                if (allStudentsCity && (g.city || "") !== allStudentsCity)
                  return false;
                if (
                  allStudentsDistrict &&
                  (g.district || "") !== allStudentsDistrict
                )
                  return false;
                return true;
              });

              const allGroups = regionFiltered.map((g) => {
                // Maktab nomi mos kelsa — shu maktabning hamma o'quvchilarini ko'rsatamiz
                const schoolMatches =
                  q && (g.school_name || "").toLowerCase().includes(q);
                return {
                  ...g,
                  students: schoolMatches
                    ? g.students || []
                    : (g.students || []).filter(filterStudent),
                };
              });

              // Qidiruvsiz — barcha maktablar (bo'sh bo'lsa ham)
              // Qidiruv bilan — faqat mos kelgan o'quvchili maktablar
              const groups = q
                ? allGroups.filter((g) => g.students.length > 0)
                : allGroups;

              if (groups.length === 0) {
                return (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-20 text-gray-400">
                    <Emoji3d e="🎓" size={56} className="mb-4 mx-auto" />
                    <p className="font-semibold">
                      {q
                        ? lang === "uz"
                          ? `"${allStudentsSearch}" bo'yicha topilmadi`
                          : `Не найдено по "${allStudentsSearch}"`
                        : lang === "uz"
                        ? "Maktablar va o'quvchilar yo'q"
                        : "Нет школ и учеников"}
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {groups.map((g) => (
                    <div
                      key={g.school_id ?? "no-school"}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-[#1a56db] to-blue-600 text-white px-6 py-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <School size={18} />
                            <h2 className="font-black text-lg">
                              {g.school_name}
                            </h2>
                          </div>
                          {(g.region || g.city || g.district) && (
                            <p className="text-xs text-blue-100 mt-0.5">
                              📍{" "}
                              {[g.region, g.city, g.district]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                        </div>
                        <span className="bg-white/20 text-white text-xs font-black rounded-full px-3 py-1">
                          {g.students.length}{" "}
                          {lang === "uz" ? "o'quvchi" : "учеников"}
                        </span>
                      </div>

                      {g.students.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">
                          {lang === "uz"
                            ? "O'quvchilar yo'q"
                            : "Нет учеников"}
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {g.students.map((s) => (
                            <div
                              key={s.id}
                              className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition"
                            >
                              {s.avatar ? (
                                <img
                                  src={s.avatar}
                                  alt=""
                                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center font-black flex-shrink-0">
                                  {s.name?.[0]?.toUpperCase() || "?"}
                                </div>
                              )}

                              <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-2">
                                <div>
                                  <div className="font-bold text-gray-900 truncate flex items-center gap-1.5">
                                    {s.name}
                                    {s.source === "telegram" ? (
                                      <span
                                        title={
                                          lang === "uz"
                                            ? "Telegram orqali"
                                            : "Через Telegram"
                                        }
                                        className="text-[10px] bg-sky-100 text-sky-700 rounded px-1.5 py-0.5 font-bold"
                                      >
                                        TG
                                      </span>
                                    ) : (
                                      <span
                                        title={
                                          lang === "uz"
                                            ? "Admin yaratgan"
                                            : "Создан админом"
                                        }
                                        className="text-[10px] bg-purple-100 text-purple-700 rounded px-1.5 py-0.5 font-bold"
                                      >
                                        ADMIN
                                      </span>
                                    )}
                                    {s.status === "pending" && (
                                      <span className="text-[10px] bg-amber-100 text-amber-700 rounded px-1.5 py-0.5 font-bold">
                                        ⏳
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {lang === "uz" ? "Ism" : "Имя"}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-bold text-gray-700 truncate">
                                    {s.full_name || "—"}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {lang === "uz" ? "Familiya" : "Фамилия"}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-mono text-sm text-blue-600 truncate">
                                    {s.telegram_username
                                      ? `@${s.telegram_username}`
                                      : s.phone || "—"}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {s.telegram_username
                                      ? "Telegram"
                                      : lang === "uz"
                                      ? "Telefon"
                                      : "Телефон"}
                                    {s.grade && (
                                      <span className="ml-2 bg-blue-100 text-blue-700 rounded px-1.5 py-0.5 text-[10px] font-bold">
                                        {s.grade}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={async () => {
                                  if (
                                    !confirm(
                                      lang === "uz"
                                        ? `${s.name} ${s.full_name} ni bazadan butunlay o'chirasizmi?\n\nBu qaytarib bo'lmaydigan amal!`
                                        : `Удалить ${s.name} ${s.full_name} из базы?\n\nЭто необратимо!`
                                    )
                                  )
                                    return;
                                  try {
                                    await superadminDeleteStudent(s.id);
                                  } catch (err) {
                                    alert(err.message);
                                  }
                                }}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 border border-red-200 transition flex-shrink-0"
                                title={
                                  lang === "uz"
                                    ? "O'quvchini bazadan o'chirish"
                                    : "Удалить из базы"
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {tab === "customers" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h1 className="text-2xl font-black text-gray-900">
                {lang === "uz" ? "Mijozlar" : "Клиенты"}
              </h1>
              <div className="text-sm text-gray-500">
                {lang === "uz" ? "Jami" : "Всего"}:{" "}
                <span className="font-bold text-[#1a56db]">
                  {users.filter((u) => u.role === "user").length}
                </span>
              </div>
            </div>

            {/* Qidiruv */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder={
                    lang === "uz"
                      ? "Ism yoki telefon raqam bo'yicha qidirish..."
                      : "Поиск по имени или телефону..."
                  }
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1a56db]"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {(() => {
                const q = customerSearch.trim().toLowerCase();
                const qDigits = q.replace(/\D/g, "");
                const customers = users
                  .filter((u) => u.role === "user")
                  .filter((u) => {
                    if (!q) return true;
                    const name = (u.name || "").toLowerCase();
                    const fullName = (u.full_name || "").toLowerCase();
                    const phoneDigits = (u.phone || u.username || "").replace(
                      /\D/g,
                      ""
                    );
                    const matchesName =
                      name.includes(q) || fullName.includes(q);
                    const matchesPhone =
                      qDigits.length > 0 && phoneDigits.includes(qDigits);
                    return matchesName || matchesPhone;
                  });

                if (customers.length === 0) {
                  return (
                    <div className="text-center py-20 text-gray-400">
                      <Emoji3d e="👤" size={56} className="mb-4 mx-auto" />
                      <p>
                        {q
                          ? lang === "uz"
                            ? "Hech narsa topilmadi"
                            : "Ничего не найдено"
                          : lang === "uz"
                          ? "Mijozlar yo'q"
                          : "Нет клиентов"}
                      </p>
                    </div>
                  );
                }

                return (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                          {lang === "uz" ? "Ism" : "Имя"}
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                          {lang === "uz" ? "Telefon" : "Телефон"}
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                          {lang === "uz" ? "Holat" : "Статус"}
                        </th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {customers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-sm text-gray-900">
                              {[u.name, u.full_name].filter(Boolean).join(" ") ||
                                "-"}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                            {u.phone || `+${u.username}`}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full ${
                                u.active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {u.active
                                ? lang === "uz"
                                  ? "Faol"
                                  : "Активен"
                                : lang === "uz"
                                ? "Bloklangan"
                                : "Заблокирован"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setPwdResetUser(u);
                                  setPwdValue("");
                                  setPwdShow(false);
                                }}
                                className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-500 transition"
                                title={
                                  lang === "uz"
                                    ? "Parolni o'zgartirish"
                                    : "Изменить пароль"
                                }
                              >
                                <KeyRound size={15} />
                              </button>
                              <button
                                onClick={() => toggleUserStatus(u.id)}
                                className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-500 transition"
                                title={
                                  u.active
                                    ? lang === "uz"
                                      ? "Bloklash"
                                      : "Заблокировать"
                                    : lang === "uz"
                                    ? "Aktivlashtirish"
                                    : "Активировать"
                                }
                              >
                                {u.active ? (
                                  <EyeOff size={15} />
                                ) : (
                                  <Eye size={15} />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      lang === "uz"
                                        ? "Bu mijozni o'chirishga ishonchingiz komilmi?"
                                        : "Удалить этого клиента?"
                                    )
                                  ) {
                                    deleteUser(u.id);
                                  }
                                }}
                                className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </div>
        )}

        {tab === "schools" && selectedSchool && (
          <div>
            {/* Orqaga + sarlavha */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <button
                onClick={() => {
                  setSelectedSchoolId(null);
                  setSchoolAdmins([]);
                }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1a56db] transition font-medium"
              >
                ← {lang === "uz" ? "Maktablar ro'yxati" : "К списку школ"}
              </button>
              <span className="text-gray-300">/</span>
              <h1 className="text-xl md:text-2xl font-black text-gray-900">
                🏫 {selectedSchool.name}
              </h1>
            </div>

            {/* Maktab ma'lumotlari */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase mb-0.5">
                    {lang === "uz" ? "Viloyat" : "Область"}
                  </div>
                  <div className="font-semibold text-gray-800">
                    {selectedSchool.region || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase mb-0.5">
                    {lang === "uz" ? "Tuman" : "Район"}
                  </div>
                  <div className="font-semibold text-gray-800">
                    {selectedSchool.district || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase mb-0.5">
                    {lang === "uz" ? "Telefon" : "Телефон"}
                  </div>
                  <div className="font-semibold text-gray-800 font-mono">
                    {selectedSchool.phone || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase mb-0.5">
                    {lang === "uz" ? "Maktab ID" : "ID школы"}
                  </div>
                  <div className="font-semibold text-gray-800">#{selectedSchool.id}</div>
                </div>
              </div>
            </div>

            {/* Biriktirilgan adminlar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-gray-900">
                  {lang === "uz"
                    ? `Biriktirilgan adminlar (${schoolAdmins.length})`
                    : `Привязанные админы (${schoolAdmins.length})`}
                </h2>
              </div>

              {adminsLoading ? (
                <div className="text-center py-6 text-sm text-gray-400">
                  {lang === "uz" ? "Yuklanmoqda..." : "Загрузка..."}
                </div>
              ) : schoolAdmins.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-400">
                  {lang === "uz"
                    ? "Hali admin biriktirilmagan"
                    : "Админы пока не привязаны"}
                </div>
              ) : (
                <div className="space-y-3">
                  {schoolAdmins.map((a) => (
                    <div
                      key={a.id}
                      className="border border-gray-100 rounded-xl p-4 bg-gray-50/50"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <div className="text-[11px] font-bold text-gray-400 uppercase mb-0.5">
                            {lang === "uz" ? "Ism" : "Имя"}
                          </div>
                          <div className="font-semibold text-gray-800">
                            {a.name || "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-400 uppercase mb-0.5">
                            {lang === "uz" ? "Familiya" : "Фамилия"}
                          </div>
                          <div className="font-semibold text-gray-800">
                            {a.full_name || "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-400 uppercase mb-0.5">
                            {lang === "uz" ? "Telefon" : "Телефон"}
                          </div>
                          <div className="font-semibold text-gray-800 font-mono">
                            {a.phone || "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-400 uppercase mb-0.5">
                            Username
                          </div>
                          <div className="font-semibold text-gray-800 font-mono">
                            {a.username || "-"}
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <div className="text-[11px] font-bold text-gray-400 uppercase mb-0.5">
                            {lang === "uz" ? "Parol" : "Пароль"}
                          </div>
                          {adminPasswords[a.id] ? (
                            <div className="flex items-center gap-2">
                              <div className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm flex-1 break-all">
                                {adminPasswords[a.id]}
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(adminPasswords[a.id]);
                                }}
                                className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-[#1a56db] hover:bg-blue-100 font-bold"
                                title={lang === "uz" ? "Nusxa olish" : "Копировать"}
                              >
                                📋
                              </button>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 italic">
                              {lang === "uz"
                                ? "Parol shifrlangan. Yangi parol o'rnatish uchun pastdagi tugmadan foydalaning."
                                : "Пароль зашифрован. Используйте кнопку ниже для сброса."}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => {
                            setPwdResetUser(a);
                            setPwdValue("");
                            setPwdUsername("");
                            setPwdShow(false);
                          }}
                          className="flex-1 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold transition flex items-center justify-center gap-1"
                        >
                          <KeyRound size={13} />{" "}
                          {lang === "uz"
                            ? "Username/parolni tahrirlash"
                            : "Логин/пароль"}
                        </button>
                        <button
                          onClick={async () => {
                            if (
                              window.confirm(
                                lang === "uz"
                                  ? "Bu adminni maktabdan ajratasizmi?"
                                  : "Отвязать админа?"
                              )
                            ) {
                              try {
                                await detachAdminFromSchool(selectedSchool.id, a.id);
                                await loadSchoolAdmins(selectedSchool.id);
                              } catch (err) {
                                alert(err.message);
                              }
                            }
                          }}
                          className="py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold transition flex items-center justify-center"
                          title={lang === "uz" ? "Ajratish" : "Отвязать"}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Yangi admin biriktirish */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <UserPlus size={18} />
                </div>
                <h2 className="font-black text-gray-900">
                  {lang === "uz" ? "Yangi admin biriktirish" : "Привязать нового админа"}
                </h2>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      {lang === "uz" ? "Ism *" : "Имя *"}
                    </label>
                    <input
                      type="text"
                      value={assignForm.name}
                      onChange={(e) =>
                        setAssignForm({ ...assignForm, name: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      {lang === "uz" ? "Familiya" : "Фамилия"}
                    </label>
                    <input
                      type="text"
                      value={assignForm.full_name}
                      onChange={(e) =>
                        setAssignForm({ ...assignForm, full_name: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    {lang === "uz" ? "Telefon *" : "Телефон *"}
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={assignForm.phone}
                    onChange={(e) =>
                      setAssignForm({
                        ...assignForm,
                        phone: formatPhone(e.target.value),
                      })
                    }
                    placeholder="+998 __ ___ __ __"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db] font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      {lang === "uz" ? "Username * (kirish uchun)" : "Username * (для входа)"}
                    </label>
                    <input
                      type="text"
                      value={assignForm.username}
                      onChange={(e) =>
                        setAssignForm({
                          ...assignForm,
                          username: e.target.value.trim(),
                        })
                      }
                      placeholder={lang === "uz" ? "alisher_admin" : "ivan_admin"}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      {lang === "uz" ? "Parol *" : "Пароль *"}
                    </label>
                    <input
                      type="text"
                      value={assignForm.password}
                      onChange={(e) =>
                        setAssignForm({ ...assignForm, password: e.target.value })
                      }
                      placeholder={lang === "uz" ? "Kamida 6 belgi" : "Мин. 6 символов"}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                    />
                  </div>
                </div>

                <button
                  disabled={assignLoading}
                  onClick={async () => {
                    const phoneDigits = (assignForm.phone || "").replace(/\D/g, "");
                    if (!assignForm.name.trim()) {
                      alert(lang === "uz" ? "Ism shart" : "Имя обязательно");
                      return;
                    }
                    if (phoneDigits.length !== 12) {
                      alert(
                        lang === "uz"
                          ? "Telefon to'liq emas (+998 XX XXX XX XX)"
                          : "Неполный телефон"
                      );
                      return;
                    }
                    if (!assignForm.username.trim()) {
                      alert(
                        lang === "uz"
                          ? "Username kiritilishi shart"
                          : "Username обязателен"
                      );
                      return;
                    }
                    if (assignForm.password.length < 6) {
                      alert(
                        lang === "uz" ? "Parol kamida 6 belgi" : "Пароль мин. 6"
                      );
                      return;
                    }
                    setAssignLoading(true);
                    const plaintextPwd = assignForm.password;
                    try {
                      const created = await api.assignAdminToSchool(
                        selectedSchool.id,
                        {
                          name: assignForm.name.trim(),
                          full_name: assignForm.full_name.trim(),
                          phone: assignForm.phone,
                          username: assignForm.username.trim(),
                          password: plaintextPwd,
                        }
                      );
                      // Plaintext parolni state'da saqlash (faqat sessiyada)
                      if (created?.id) {
                        setAdminPasswords((p) => ({
                          ...p,
                          [created.id]: plaintextPwd,
                        }));
                      }
                      await fetchSchools();
                      await loadSchoolAdmins(selectedSchool.id);
                      setAssignForm({
                        name: "",
                        full_name: "",
                        phone: "+998 ",
                        username: "",
                        password: "",
                      });
                    } catch (err) {
                      alert(err.message);
                    } finally {
                      setAssignLoading(false);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#1a56db] hover:bg-[#1341a8] disabled:bg-gray-300 text-white font-bold transition text-sm flex items-center justify-center gap-2"
                >
                  <UserPlus size={16} />
                  {assignLoading
                    ? lang === "uz"
                      ? "Biriktirilmoqda..."
                      : "Сохранение..."
                    : lang === "uz"
                    ? "Adminni biriktirish"
                    : "Привязать админа"}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "schools" && !selectedSchool && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h1 className="text-2xl font-black text-gray-900">
                {lang === "uz" ? "Maktablar" : "Школы"}
              </h1>
              <button
                onClick={() => {
                  setSchoolForm(EMPTY_SCHOOL);
                  setEditSchoolId(null);
                  setShowSchoolForm(true);
                }}
                className="flex items-center gap-2 bg-[#1a56db] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1341a8] transition"
              >
                <Plus size={18} />
                {lang === "uz" ? "Maktab qo'shish" : "Добавить школу"}
              </button>
            </div>

            {/* Qidiruv + Hududiy filtr */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-4 space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  placeholder={
                    lang === "uz"
                      ? "Maktab nomi yoki manzil..."
                      : "Название школы или адрес..."
                  }
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1a56db]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <select
                  value={filterRegion}
                  onChange={(e) => {
                    setFilterRegion(e.target.value);
                    setFilterCity("");
                    setFilterDistrict("");
                  }}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white"
                >
                  <option value="">
                    {lang === "uz" ? "Barcha viloyatlar" : "Все области"}
                  </option>
                  {REGION_NAMES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  disabled={!filterRegion}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">
                    {lang === "uz" ? "Barcha shaharlar" : "Все города"}
                  </option>
                  {getCities(filterRegion).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  disabled={!filterRegion}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">
                    {lang === "uz" ? "Barcha tumanlar" : "Все районы"}
                  </option>
                  {getDistricts(filterRegion).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {(filterRegion || filterCity || filterDistrict) && (
                <button
                  onClick={() => {
                    setFilterRegion("");
                    setFilterCity("");
                    setFilterDistrict("");
                  }}
                  className="text-xs text-[#1a56db] hover:underline"
                >
                  ✕ {lang === "uz" ? "Filtrni tozalash" : "Сбросить фильтр"}
                </button>
              )}
            </div>

            {/* Maktablar grid */}
            {(() => {
              const q = schoolSearch.trim().toLowerCase();
              const list = schools.filter((s) => {
                if (filterRegion && (s.region || "") !== filterRegion) return false;
                if (filterCity && (s.city || "") !== filterCity) return false;
                if (filterDistrict && (s.district || "") !== filterDistrict)
                  return false;
                if (!q) return true;
                return (
                  (s.name || "").toLowerCase().includes(q) ||
                  (s.district || "").toLowerCase().includes(q) ||
                  (s.city || "").toLowerCase().includes(q) ||
                  (s.region || "").toLowerCase().includes(q)
                );
              });

              if (list.length === 0) {
                return (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20 text-gray-400">
                    <Emoji3d e="🏫" size={56} className="mb-4 mx-auto" />
                    <p>
                      {q
                        ? lang === "uz"
                          ? "Hech narsa topilmadi"
                          : "Ничего не найдено"
                        : lang === "uz"
                        ? "Maktablar yo'q. \"Maktab qo'shish\" tugmasini bosing"
                        : "Школ нет. Нажмите \"Добавить школу\""}
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {list.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelectedSchoolId(s.id);
                        loadSchoolAdmins(s.id);
                      }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-blue-200 transition flex flex-col cursor-pointer"
                    >
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden relative">
                        <Building2 size={56} className="text-blue-400" />
                        {s.admin_count > 0 && (
                          <span className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold text-gray-700 px-2 py-1 rounded-full">
                            👤 {s.admin_count}
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-black text-gray-900 mb-1 line-clamp-2">
                          {s.name}
                        </h3>
                        {(s.district || s.region) && (
                          <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                            📍 {[s.region, s.district].filter(Boolean).join(", ")}
                          </p>
                        )}
                        {s.phone && (
                          <p className="text-xs text-gray-500 mb-3 font-mono">
                            📞 {s.phone}
                          </p>
                        )}

                        <div className="mt-auto flex gap-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSchoolForm({
                                name: s.name,
                                name_ru: s.name_ru || "",
                                country: s.country || "O'zbekiston",
                                region: s.region || "Qashqadaryo viloyati",
                                city: s.city || "",
                                district: s.district || "",
                                phone: s.phone || "",
                              });
                              setEditSchoolId(s.id);
                              setShowSchoolForm(true);
                            }}
                            className="flex-1 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold transition flex items-center justify-center gap-1"
                          >
                            <Edit2 size={13} />{" "}
                            {lang === "uz" ? "Tahrirlash" : "Изменить"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  lang === "uz"
                                    ? `"${s.name}" maktabini o'chirishga ishonchingiz komilmi?`
                                    : `Удалить школу "${s.name}"?`
                                )
                              ) {
                                removeSchool(s.id);
                              }
                            }}
                            className="py-2 px-3 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 text-xs font-bold transition flex items-center justify-center"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ════════════════════════ KITOBLAR (PDF) ════════════════════════ */}
        {tab === "books" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <BookOpen className="text-[#1a56db]" size={26} />
                  {lang === "uz" ? "Kitoblar" : "Книги"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {lang === "uz"
                    ? `Jami: ${books.length} ta kitob`
                    : `Всего: ${books.length} книг`}
                </p>
              </div>
              <button
                onClick={() => setShowBookForm(true)}
                className="flex items-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition"
              >
                <Plus size={16} />
                {lang === "uz" ? "Kitob qo'shish" : "Добавить книгу"}
              </button>
            </div>

            {/* Kategoriya filter — birinchi qator */}
            <div className="mb-4">
              <div className="text-xs font-bold text-gray-500 mb-2 uppercase">
                {lang === "uz" ? "Asosiy bo'lim" : "Раздел"}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setBookCatFilter("all");
                    setBookSubcatFilter("all");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    bookCatFilter === "all"
                      ? "bg-[#1a56db] text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#1a56db]"
                  }`}
                >
                  {lang === "uz" ? "Barchasi" : "Все"} ({books.length})
                </button>
                {BOOK_CATEGORIES.map((c) => {
                  const count = books.filter(
                    (b) => b.category === c.key
                  ).length;
                  return (
                    <button
                      key={c.key}
                      onClick={() => {
                        setBookCatFilter(c.key);
                        setBookSubcatFilter("all");
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        bookCatFilter === c.key
                          ? "bg-[#1a56db] text-white"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-[#1a56db]"
                      }`}
                    >
                      <img
                        src={c.icon3d}
                        alt=""
                        className="w-5 h-5 object-contain"
                        loading="lazy"
                      />
                      {lang === "uz" ? c.uz : c.ru} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subkategoriya filter — ikkinchi qator (faqat kategoriya tanlanganda) */}
            {bookCatFilter !== "all" && (
              <div className="mb-5 pl-3 border-l-4 border-[#1a56db]/30">
                <div className="text-xs font-bold text-gray-500 mb-2 uppercase">
                  {lang === "uz" ? "Kichik bo'lim" : "Подраздел"}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setBookSubcatFilter("all")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                      bookSubcatFilter === "all"
                        ? "bg-blue-50 text-[#1a56db] border border-[#1a56db]"
                        : "bg-white text-gray-500 border border-gray-200 hover:border-[#1a56db]"
                    }`}
                  >
                    {lang === "uz" ? "Barchasi" : "Все"}
                  </button>
                  {(findBookCategory(bookCatFilter)?.subcategories || []).map(
                    (s) => {
                      const count = books.filter(
                        (b) =>
                          b.category === bookCatFilter &&
                          b.subcategory === s.key
                      ).length;
                      return (
                        <button
                          key={s.key}
                          onClick={() => setBookSubcatFilter(s.key)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                            bookSubcatFilter === s.key
                              ? "bg-blue-50 text-[#1a56db] border border-[#1a56db]"
                              : "bg-white text-gray-500 border border-gray-200 hover:border-[#1a56db]"
                          }`}
                        >
                          {lang === "uz" ? s.uz : s.ru} ({count})
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Kitoblar ro'yxati */}
            {books.filter(
              (b) =>
                (bookCatFilter === "all" || b.category === bookCatFilter) &&
                (bookSubcatFilter === "all" || b.subcategory === bookSubcatFilter)
            ).length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <BookOpen className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 text-sm">
                  {lang === "uz"
                    ? "Hozircha kitoblar yo'q"
                    : "Книг пока нет"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books
                  .filter(
                    (b) =>
                      (bookCatFilter === "all" ||
                        b.category === bookCatFilter) &&
                      (bookSubcatFilter === "all" ||
                        b.subcategory === bookSubcatFilter)
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
                            ) : cat?.icon3d ? (
                              <img
                                src={cat.icon3d}
                                alt=""
                                className="w-9 h-9 object-contain drop-shadow"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-xl">
                                {cat?.icon || "📕"}
                              </span>
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
                          {cat && (
                            <span className="bg-amber-50 text-amber-700 font-bold px-2 py-1 rounded-md">
                              {lang === "uz" ? cat.uz : cat.ru}
                            </span>
                          )}
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
                            onClick={() => deleteBook(b.id)}
                            className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-bold transition"
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

        {/* ════════════════════════ VIDEO DARSLIKLAR ════════════════════════ */}
        {tab === "videos" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <Video className="text-rose-600" size={26} />
                  {lang === "uz" ? "Video Darsliklar" : "Видеоуроки"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {lang === "uz"
                    ? `Jami: ${videos.length} ta video • Hajm chegarasi yo'q`
                    : `Всего: ${videos.length} видео • Без ограничений размера`}
                </p>
              </div>
              <button
                onClick={() => setShowVideoForm(true)}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition"
              >
                <Plus size={16} />
                {lang === "uz" ? "Video qo'shish" : "Добавить видео"}
              </button>
            </div>

            {/* Kategoriya filter */}
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                onClick={() => setVideoCatFilter("all")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                  videoCatFilter === "all"
                    ? "bg-rose-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-rose-600"
                }`}
              >
                {lang === "uz" ? "Barchasi" : "Все"} ({videos.length})
              </button>
              {VIDEO_CATEGORIES.map((c) => {
                const count = videos.filter((v) => v.category === c.key).length;
                return (
                  <button
                    key={c.key}
                    onClick={() => setVideoCatFilter(c.key)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                      videoCatFilter === c.key
                        ? "bg-rose-600 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-rose-600"
                    }`}
                  >
                    {lang === "uz" ? c.uz : c.ru} ({count})
                  </button>
                );
              })}
            </div>

            {/* Videolar ro'yxati */}
            {videos.filter(
              (v) => videoCatFilter === "all" || v.category === videoCatFilter
            ).length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <Film className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 text-sm">
                  {lang === "uz"
                    ? "Hozircha videolar yo'q"
                    : "Видео пока нет"}
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
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
                          <div className="relative w-14 h-14 rounded-full bg-white/95 flex items-center justify-center group-hover:scale-110 transition shadow-lg">
                            <Play
                              className="text-rose-600 ml-1"
                              size={22}
                              fill="currentColor"
                            />
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
                            <p className="text-xs text-gray-500 mb-2">
                              {v.teacher}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mb-3 text-xs">
                            <span className="bg-rose-50 text-rose-700 font-bold px-2 py-1 rounded-md">
                              {lang === "uz" ? cat?.uz : cat?.ru}
                            </span>
                            {v.type !== "youtube" && (
                              <span className="text-gray-400">
                                {formatFileSize(v.fileSize)}
                              </span>
                            )}
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
                              onClick={() => deleteVideo(v.id)}
                              className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-bold transition"
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

        {/* ════════════════════════ MAKTAB DARSLIKLARI (Coming Soon) ════════════════════════ */}
        {tab === "school-books" && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 mb-6">
              <GraduationCap className="text-emerald-600" size={26} />
              {lang === "uz" ? "Maktab Darsliklari" : "Школьные учебники"}
            </h1>

            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center">
                <Construction className="text-emerald-600" size={36} />
              </div>
              <h2 className="font-black text-xl text-gray-800 mb-2">
                {lang === "uz" ? "Tez orada" : "Скоро"}
              </h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {lang === "uz"
                  ? "Bu bo'lim ishlab chiqilmoqda. Yaqin orada 1-11 sinflar uchun rasmiy darsliklarni yuklash imkoniyati qo'shiladi."
                  : "Этот раздел в разработке. Скоро будет добавлена возможность загрузки официальных учебников для 1-11 классов."}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ── KITOB QO'SHISH FORMASI (Modal) ── */}
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
              <h2 className="font-black text-lg text-gray-900 flex items-center gap-2">
                <BookOpen className="text-[#1a56db]" size={20} />
                {lang === "uz" ? "Yangi kitob" : "Новая книга"}
              </h2>
              <button
                onClick={() => !bookUploading && setShowBookForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {lang === "uz" ? "Nomi (UZ)" : "Название (UZ)"} *
                </label>
                <input
                  type="text"
                  value={bookForm.title_uz}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, title_uz: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                  placeholder={
                    lang === "uz" ? "Kitob nomi..." : "Название книги..."
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {lang === "uz" ? "Nomi (RU)" : "Название (RU)"}
                </label>
                <input
                  type="text"
                  value={bookForm.title_ru}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, title_ru: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                  placeholder="Название..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {lang === "uz" ? "Muallif" : "Автор"}
                </label>
                <input
                  type="text"
                  value={bookForm.author}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, author: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                  placeholder={lang === "uz" ? "Muallif ismi" : "Имя автора"}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {lang === "uz" ? "Asosiy bo'lim" : "Раздел"} *
                </label>
                <select
                  value={bookForm.category}
                  onChange={(e) => handleBookCategoryChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db] bg-white"
                >
                  {BOOK_CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.icon} {lang === "uz" ? c.uz : c.ru}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {lang === "uz" ? "Kichik bo'lim" : "Подраздел"} *
                </label>
                <select
                  value={bookForm.subcategory}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, subcategory: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db] bg-white"
                >
                  {(findBookCategory(bookForm.category)?.subcategories || []).map(
                    (s) => (
                      <option key={s.key} value={s.key}>
                        {lang === "uz" ? s.uz : s.ru}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {lang === "uz" ? "Muqova rasmi" : "Обложка"}{" "}
                  <span className="text-gray-400 font-normal">
                    ({lang === "uz" ? "ixtiyoriy" : "необязательно"})
                  </span>
                </label>

                {/* Preview */}
                {bookForm.cover && (
                  <div className="relative group mb-2">
                    <img
                      src={bookForm.cover}
                      alt="Cover preview"
                      className="w-full h-48 object-contain bg-gray-50 rounded-xl border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setBookForm({ ...bookForm, cover: "" })}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Fayl yuklash */}
                <label className="block cursor-pointer mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-200 hover:border-[#1a56db] rounded-xl p-4 text-center transition">
                    <Upload className="mx-auto text-gray-400 mb-1" size={22} />
                    <div className="text-xs text-gray-600 font-medium">
                      {bookForm.cover
                        ? lang === "uz"
                          ? "Boshqa rasm tanlash"
                          : "Выбрать другое"
                        : lang === "uz"
                        ? "Fayl tanlash (JPG, PNG, WebP)"
                        : "Выбрать файл (JPG, PNG, WebP)"}
                    </div>
                  </div>
                </label>

                {/* URL */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold pointer-events-none">
                    URL
                  </div>
                  <input
                    type="url"
                    placeholder="https://example.com/cover.jpg"
                    value={
                      bookForm.cover?.startsWith("http") ? bookForm.cover : ""
                    }
                    onChange={(e) =>
                      setBookForm({ ...bookForm, cover: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl pl-12 pr-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {lang === "uz" ? "PDF fayl" : "PDF файл"} *
                </label>
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handlePdfUpload(e.target.files?.[0])}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-200 hover:border-[#1a56db] rounded-xl p-6 text-center transition">
                    {bookForm.pdfName ? (
                      <div>
                        <FileText
                          className="mx-auto text-[#1a56db] mb-2"
                          size={32}
                        />
                        <div className="text-sm font-bold text-gray-800 truncate">
                          {bookForm.pdfName}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatFileSize(bookForm.pdfSize)}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload
                          className="mx-auto text-gray-400 mb-2"
                          size={32}
                        />
                        <div className="text-sm text-gray-600 font-medium">
                          {lang === "uz"
                            ? "PDF fayl tanlang (hajm chegarasi yo'q)"
                            : "Выберите PDF файл (без ограничений)"}
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
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm transition disabled:opacity-50"
                >
                  {lang === "uz" ? "Bekor" : "Отмена"}
                </button>
                <button
                  onClick={submitBook}
                  disabled={bookUploading || !bookForm.pdfName}
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

      {/* ── VIDEO QO'SHISH FORMASI (Modal) ── */}
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
              <h2 className="font-black text-lg text-gray-900 flex items-center gap-2">
                <Video className="text-rose-600" size={20} />
                {lang === "uz" ? "Yangi video" : "Новое видео"}
              </h2>
              <button
                onClick={() => !videoUploading && setShowVideoForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {lang === "uz" ? "Nomi (UZ)" : "Название (UZ)"} *
                </label>
                <input
                  type="text"
                  value={videoForm.title_uz}
                  onChange={(e) =>
                    setVideoForm({ ...videoForm, title_uz: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-600"
                  placeholder={
                    lang === "uz" ? "Video nomi..." : "Название видео..."
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {lang === "uz" ? "Nomi (RU)" : "Название (RU)"}
                </label>
                <input
                  type="text"
                  value={videoForm.title_ru}
                  onChange={(e) =>
                    setVideoForm({ ...videoForm, title_ru: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-600"
                  placeholder="Название..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    {lang === "uz" ? "O'qituvchi" : "Преподаватель"}
                  </label>
                  <input
                    type="text"
                    value={videoForm.teacher}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, teacher: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-600"
                    placeholder={lang === "uz" ? "Ism" : "Имя"}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    {lang === "uz" ? "Davomiyligi" : "Длит."}
                  </label>
                  <input
                    type="text"
                    value={videoForm.duration}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, duration: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-600"
                    placeholder="12:30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {lang === "uz" ? "Fan" : "Предмет"} *
                </label>
                <select
                  value={videoForm.category}
                  onChange={(e) =>
                    setVideoForm({ ...videoForm, category: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-600 bg-white"
                >
                  {VIDEO_CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {lang === "uz" ? c.uz : c.ru}
                    </option>
                  ))}
                </select>
              </div>

              {/* Manbaa tanlash */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {lang === "uz" ? "Video manbai" : "Источник видео"} *
                </label>
                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setVideoSourceType("youtube")}
                    className={`py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${
                      videoSourceType === "youtube"
                        ? "bg-white text-rose-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Video size={15} />
                    YouTube
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoSourceType("file")}
                    className={`py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${
                      videoSourceType === "file"
                        ? "bg-white text-rose-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Upload size={15} />
                    {lang === "uz" ? "Fayl" : "Файл"}
                  </button>
                </div>
              </div>

              {/* YouTube link/embed */}
              {videoSourceType === "youtube" && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    {lang === "uz"
                      ? "YouTube link yoki embed kod"
                      : "YouTube ссылка или embed код"}{" "}
                    *
                  </label>
                  <textarea
                    value={videoForm.videoUrl}
                    onChange={(e) => handleVideoUrlChange(e.target.value)}
                    rows={3}
                    placeholder={
                      lang === "uz"
                        ? "https://www.youtube.com/watch?v=...\nyoki <iframe src='...'></iframe> embed kodini joylashtiring"
                        : "https://www.youtube.com/watch?v=...\nили вставьте <iframe> embed код"
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-600 resize-none font-mono"
                  />

                  {/* Preview */}
                  {videoForm.youtubeId && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                      <div className="aspect-video bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoForm.youtubeId}`}
                          title="Preview"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                      <div className="bg-green-50 px-3 py-2 text-xs text-green-700 font-bold flex items-center gap-1">
                        <Check size={13} />
                        {lang === "uz"
                          ? `Aniqlandi: ${videoForm.youtubeId}`
                          : `Найдено: ${videoForm.youtubeId}`}
                      </div>
                    </div>
                  )}
                  {videoForm.videoUrl && !videoForm.youtubeId && (
                    <p className="mt-2 text-xs text-red-600 font-bold">
                      {lang === "uz"
                        ? "❌ Video ID topilmadi. To'g'ri YouTube link yoki embed kod kiriting."
                        : "❌ Video ID не найден. Введите правильную ссылку или embed."}
                    </p>
                  )}
                </div>
              )}

              {/* Fayl yuklash */}
              {videoSourceType === "file" && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    {lang === "uz" ? "Video fayl" : "Видео файл"} *
                  </label>
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleVideoUpload(e.target.files?.[0])}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-200 hover:border-rose-600 rounded-xl p-6 text-center transition">
                      {videoForm.fileName ? (
                        <div>
                          <Film
                            className="mx-auto text-rose-600 mb-2"
                            size={32}
                          />
                          <div className="text-sm font-bold text-gray-800 truncate">
                            {videoForm.fileName}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatFileSize(videoForm.fileSize)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Upload
                            className="mx-auto text-gray-400 mb-2"
                            size={32}
                          />
                          <div className="text-sm text-gray-600 font-medium">
                            {lang === "uz"
                              ? "Video fayl tanlang (hajm chegarasi yo'q)"
                              : "Выберите видео файл (без ограничений)"}
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              )}

              {videoUploading && (
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{lang === "uz" ? "Yuklanmoqda" : "Загрузка"}</span>
                    <span className="font-bold">{videoUploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-rose-600 h-full transition-all"
                      style={{ width: `${videoUploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowVideoForm(false)}
                  disabled={videoUploading}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm transition disabled:opacity-50"
                >
                  {lang === "uz" ? "Bekor" : "Отмена"}
                </button>
                <button
                  onClick={submitVideo}
                  disabled={
                    videoUploading ||
                    (videoSourceType === "youtube" && !videoForm.youtubeId) ||
                    (videoSourceType === "file" && !videoForm.fileName)
                  }
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold text-sm transition disabled:opacity-50"
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

      {/* ── VIDEO PLAYER (Modal) ── */}
      {playingVideo && (
        <div
          onClick={() => {
            if (playingVideo._blobUrl) URL.revokeObjectURL(playingVideo._blobUrl);
            setPlayingVideo(null);
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-800 truncate">
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
                className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-3"
              >
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video bg-black">
              {playingVideo.type === "youtube" ? (
                <iframe
                  src={`https://www.youtube.com/embed/${playingVideo.youtubeId}?autoplay=1`}
                  title={playingVideo.title_uz}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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

      {/* ── MAKTAB FORMASI (Modal) ── */}
      {showSchoolForm && (
        <div
          onClick={() => setShowSchoolForm(false)}
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1a56db] flex items-center justify-center">
                  <Building2 size={18} />
                </div>
                <h2 className="font-black text-lg">
                  {editSchoolId
                    ? lang === "uz"
                      ? "Maktabni tahrirlash"
                      : "Редактировать школу"
                    : lang === "uz"
                    ? "Yangi maktab"
                    : "Новая школа"}
                </h2>
              </div>
              <button
                onClick={() => setShowSchoolForm(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Nom */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  {lang === "uz" ? "Maktab nomi *" : "Название школы *"}
                </label>
                <input
                  type="text"
                  value={schoolForm.name}
                  onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                  placeholder={lang === "uz" ? "28-umumiy o'rta ta'lim maktabi" : "Школа №28"}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                />
              </div>

              {/* Hududiy ierarxiya: Respublika → Viloyat → Shahar → Tuman */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    {lang === "uz" ? "Respublika" : "Страна"}
                  </label>
                  <select
                    value={schoolForm.country}
                    onChange={(e) =>
                      setSchoolForm({ ...schoolForm, country: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db] bg-white"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    {lang === "uz" ? "Viloyat *" : "Область *"}
                  </label>
                  <select
                    value={schoolForm.region}
                    onChange={(e) =>
                      setSchoolForm({
                        ...schoolForm,
                        region: e.target.value,
                        city: "",
                        district: "",
                      })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db] bg-white"
                  >
                    <option value="">— Tanlang —</option>
                    {REGION_NAMES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    {lang === "uz" ? "Shahar" : "Город"}
                  </label>
                  <select
                    value={schoolForm.city}
                    onChange={(e) =>
                      setSchoolForm({ ...schoolForm, city: e.target.value })
                    }
                    disabled={!schoolForm.region}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db] bg-white disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">— Yo'q —</option>
                    {getCities(schoolForm.region).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    {lang === "uz" ? "Tuman" : "Район"}
                  </label>
                  <select
                    value={schoolForm.district}
                    onChange={(e) =>
                      setSchoolForm({
                        ...schoolForm,
                        district: e.target.value,
                      })
                    }
                    disabled={!schoolForm.region}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db] bg-white disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">— Yo'q —</option>
                    {getDistricts(schoolForm.region).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  {lang === "uz" ? "Telefon" : "Телефон"}
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={schoolForm.phone}
                  onChange={(e) =>
                    setSchoolForm({ ...schoolForm, phone: formatPhone(e.target.value) })
                  }
                  placeholder="+998 __ ___ __ __"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db] font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setShowSchoolForm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition text-sm"
              >
                {lang === "uz" ? "Bekor" : "Отмена"}
              </button>
              <button
                onClick={async () => {
                  if (!schoolForm.name.trim()) {
                    alert(lang === "uz" ? "Maktab nomi shart" : "Название обязательно");
                    return;
                  }
                  try {
                    if (editSchoolId) {
                      await editSchool(editSchoolId, schoolForm);
                    } else {
                      await addSchool(schoolForm);
                    }
                    setShowSchoolForm(false);
                    setEditSchoolId(null);
                    setSchoolForm(EMPTY_SCHOOL);
                  } catch (err) {
                    alert(err.message);
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-[#1a56db] hover:bg-[#1341a8] text-white font-bold transition text-sm"
              >
                {lang === "uz" ? "Saqlash" : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PAROLNI O'ZGARTIRISH (Modal) ── */}
      {pwdResetUser && (
        <div
          onClick={() => !pwdLoading && setPwdResetUser(null)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <KeyRound size={18} />
                </div>
                <h2 className="font-black text-lg">
                  {lang === "uz"
                    ? "Username va parolni tahrirlash"
                    : "Изменить логин и пароль"}
                </h2>
              </div>
              <button
                onClick={() => !pwdLoading && setPwdResetUser(null)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-3 text-sm">
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">
                  {lang === "uz" ? "Mijoz" : "Клиент"}
                </div>
                <div className="font-semibold text-gray-800">
                  {[pwdResetUser.name, pwdResetUser.full_name]
                    .filter(Boolean)
                    .join(" ") || "-"}
                </div>
                <div className="text-xs text-gray-500 font-mono mt-0.5">
                  {pwdResetUser.phone || `+${pwdResetUser.username}`}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={pwdUsername}
                  onChange={(e) => setPwdUsername(e.target.value)}
                  placeholder={
                    lang === "uz"
                      ? "Bo'sh qoldiring — o'zgarmaydi"
                      : "Оставьте пустым — не изменится"
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1a56db] font-mono"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  {lang === "uz"
                    ? `Hozirgi: ${pwdResetUser.username || "-"}`
                    : `Текущий: ${pwdResetUser.username || "-"}`}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {lang === "uz" ? "Yangi parol" : "Новый пароль"}
                </label>
                <div className="relative">
                  <input
                    type={pwdShow ? "text" : "password"}
                    value={pwdValue}
                    onChange={(e) => setPwdValue(e.target.value)}
                    placeholder={
                      lang === "uz"
                        ? "Bo'sh qoldiring — o'zgarmaydi"
                        : "Оставьте пустым — не изменится"
                    }
                    className="w-full pr-10 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1a56db]"
                  />
                  <button
                    type="button"
                    onClick={() => setPwdShow((v) => !v)}
                    className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-gray-600"
                  >
                    {pwdShow ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  {lang === "uz"
                    ? "Kamida 6 ta belgi. Adminga yangi parolni xabar bering."
                    : "Минимум 6 символов. Сообщите админу пароль."}
                </p>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t">
              <button
                disabled={pwdLoading}
                onClick={() => setPwdResetUser(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition text-sm disabled:opacity-50"
              >
                {lang === "uz" ? "Bekor" : "Отмена"}
              </button>
              <button
                disabled={
                  pwdLoading ||
                  ((!pwdValue || pwdValue.length < 6) &&
                    !pwdUsername.trim())
                }
                onClick={async () => {
                  // Hech bo'lmaganda biri to'ldirilgan bo'lishi kerak
                  const usernameChanged =
                    pwdUsername.trim() &&
                    pwdUsername.trim() !== pwdResetUser.username;
                  const passwordChanged =
                    pwdValue && pwdValue.length >= 6;

                  if (!usernameChanged && !passwordChanged) {
                    alert(
                      lang === "uz"
                        ? "Username yoki parolni o'zgartiring"
                        : "Измените username или пароль"
                    );
                    return;
                  }

                  setPwdLoading(true);
                  try {
                    const payload = {};
                    if (usernameChanged) payload.username = pwdUsername.trim();
                    if (passwordChanged) payload.password = pwdValue;

                    if (selectedSchoolId) {
                      // School admin uchun yangi endpoint (parolni to'g'ri hash qiladi)
                      await api.updateSchoolAdmin(
                        selectedSchoolId,
                        pwdResetUser.id,
                        payload
                      );
                    } else {
                      // Boshqa userlar uchun fallback
                      await editUser(pwdResetUser.id, payload);
                    }

                    if (passwordChanged) {
                      setAdminPasswords((p) => ({
                        ...p,
                        [pwdResetUser.id]: pwdValue,
                      }));
                    }

                    if (selectedSchoolId) {
                      await loadSchoolAdmins(selectedSchoolId);
                    }
                    setPwdResetUser(null);
                    setPwdValue("");
                    setPwdUsername("");
                    alert(
                      lang === "uz"
                        ? "✅ Saqlandi"
                        : "✅ Сохранено"
                    );
                  } catch (err) {
                    alert(err.message || "Xatolik");
                  } finally {
                    setPwdLoading(false);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#1a56db] hover:bg-[#1341a8] disabled:bg-gray-300 text-white font-bold transition text-sm"
              >
                {pwdLoading
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
      )}

      {/* ── MAHSULOT FORMASI (Modal) ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-black text-lg">
                {editId
                  ? lang === "uz"
                    ? "Mahsulotni tahrirlash"
                    : "Редактировать товар"
                  : t("addProduct")}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "name_uz", label: "Nomi (O'zbek) *", required: true },
                  { key: "name_ru", label: "Nomi (Rus)" },
                  { key: "desc_uz", label: "Tavsif (O'zbek)" },
                  { key: "desc_ru", label: "Tavsif (Rus)" },
                  {
                    key: "price",
                    label: "Narxi *",
                    type: "number",
                    required: true,
                  },
                  { key: "old_price", label: "Eski narx" },
                  { key: "stock", label: "Omborda", type: "number" },
                  { key: "image", label: "Rasm URL" },
                  { key: "author", label: "Muallif (O'zbek) *" },
                  { key: "author_ru", label: "Muallif (Rus)" },
                  { key: "school", label: "Maktab (O'zbek)" },
                  { key: "school_ru", label: "Maktab (Rus)" },
                  { key: "grade", label: "Sinf" },
                  { key: "district", label: "Tuman (O'zbek)" },
                  { key: "district_ru", label: "Tuman (Rus)" },
                  { key: "region", label: "Viloyat (O'zbek)" },
                  { key: "region_ru", label: "Viloyat (Rus)" },
                  { key: "phone", label: "Telefon" },
                ].map((field) => (
                  <div
                    key={field.key}
                    className={field.key.includes("desc") ? "col-span-2" : ""}
                  >
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      {field.label}
                    </label>
                    {field.key.includes("desc") ? (
                      <textarea
                        value={form[field.key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [field.key]: e.target.value })
                        }
                        rows={2}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] resize-none"
                      />
                    ) : (
                      <input
                        type={field.type || "text"}
                        value={form[field.key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [field.key]: e.target.value })
                        }
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Kategoriya */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {t("category")}
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {lang === "uz" ? c.label_uz : c.label_ru}
                    </option>
                  ))}
                </select>
              </div>

              {/* Badge */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Badge
                </label>
                <select
                  value={form.badge || ""}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white"
                >
                  <option value="">— Yo'q —</option>
                  <option value="new">🆕 Yangi</option>
                  <option value="hit">🔥 Hit</option>
                  <option value="sale">💥 Sale</option>
                </select>
              </div>

              {/* O'quvchi turi */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  {lang === "uz" ? "O'quvchi turi" : "Тип ученика"}
                </label>
                <div className="flex gap-3">
                  {["normal", "disabled"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, student_type: type })}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition ${
                        form.student_type === type
                          ? type === "disabled"
                            ? "border-rose-500 bg-rose-50 text-rose-600"
                            : "border-[#1a56db] bg-blue-50 text-[#1a56db]"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {type === "normal"
                        ? lang === "uz"
                          ? "👤 Oddiy"
                          : "👤 Обычный"
                        : lang === "uz"
                        ? "❤️ Imkoniyati cheklangan"
                        : "❤️ С ограниченными возможностями"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Disabled o'quvchi uchun qo'shimcha maydonlar */}
              {form.student_type === "disabled" && (
                <div className="bg-rose-50 rounded-2xl p-4 space-y-3">
                  <p className="text-xs font-bold text-rose-600 uppercase">
                    Imkoniyati cheklangan o'quvchi ma'lumotlari
                  </p>
                  {[
                    { key: "card_number", label: "Karta raqami" },
                    { key: "photo", label: "O'quvchi rasmi URL" },
                    { key: "story_uz", label: "Hikoya (O'zbek)" },
                    { key: "story_ru", label: "Hikoya (Rus)" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={form[field.key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [field.key]: e.target.value })
                        }
                        className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-rose-400 bg-white"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition text-sm"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-[#1a56db] hover:bg-[#1341a8] text-white font-bold transition text-sm flex items-center justify-center gap-2"
              >
                <Check size={16} /> {t("save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOYDALANUVCHI FORMASI (Modal) ── */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-black text-lg">
                {editUserId
                  ? lang === "uz"
                    ? "Adminni tahrirlash"
                    : "Редактировать админа"
                  : lang === "uz"
                  ? "Yangi admin"
                  : "Новый админ"}
              </h2>
              <button
                onClick={() => setShowUserForm(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                {
                  key: "name",
                  label: lang === "uz" ? "Ism *" : "Имя *",
                  type: "text",
                },
                {
                  key: "full_name",
                  label: lang === "uz" ? "Familiya" : "Фамилия",
                  type: "text",
                },
                {
                  key: "phone",
                  label: lang === "uz" ? "Telefon raqam" : "Номер телефона",
                  type: "tel",
                },
                {
                  key: "username",
                  label: "Username *",
                  type: "text",
                },
                {
                  key: "password",
                  label: editUserId
                    ? lang === "uz"
                      ? "Parol (o'zgartirish uchun)"
                      : "Пароль (для изменения)"
                    : lang === "uz"
                    ? "Parol *"
                    : "Пароль *",
                  type: "text",
                },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    inputMode={field.key === "phone" ? "numeric" : undefined}
                    value={userForm[field.key] || ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const value =
                        field.key === "phone" ? formatPhone(raw) : raw;
                      setUserForm({
                        ...userForm,
                        [field.key]: value,
                      });
                    }}
                    className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db] ${
                      field.key === "phone" ? "font-mono" : ""
                    }`}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  {lang === "uz" ? "Rol *" : "Роль *"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUserForm({ ...userForm, role: "admin" })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition border-2 ${
                      userForm.role === "admin"
                        ? "bg-blue-50 border-[#1a56db] text-[#1a56db]"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <Users size={16} />
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setUserForm({ ...userForm, role: "superadmin" })
                    }
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition border-2 ${
                      userForm.role === "superadmin"
                        ? "bg-purple-50 border-purple-600 text-purple-700"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <KeyRound size={16} />
                    Super Admin
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                  {userForm.role === "superadmin"
                    ? lang === "uz"
                      ? "✓ To'liq huquqlar: maktablar, o'quvchilar, mahsulotlar, adminlar"
                      : "✓ Полные права: школы, ученики, товары, админы"
                    : lang === "uz"
                    ? "✓ Cheklangan: faqat buyurtmalar, kitoblar va video darsliklar"
                    : "✓ Ограниченный: только заказы, книги и видеоуроки"}
                </p>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setShowUserForm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition text-sm"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleUserSave}
                className="flex-1 py-3 rounded-xl bg-[#1a56db] hover:bg-[#1341a8] text-white font-bold transition text-sm flex items-center justify-center gap-2"
              >
                <Check size={16} /> {t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
