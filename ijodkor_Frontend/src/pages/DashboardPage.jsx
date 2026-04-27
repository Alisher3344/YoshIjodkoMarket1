import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Users,
  Package,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  X,
  Check,
  ArrowLeft,
  Camera,
  Heart,
  ImageIcon,
  Home,
  UserPlus,
  XCircle,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import useStore from "../store/useStore";
import { formatPhone } from "../utils/phone";

const EMPTY_STUDENT = {
  name: "",
  grade: "",
  phone: "",
  avatar: "",
  is_disabled: false,
  card_number: "",
  illness_info: "",
};

const EMPTY_PRODUCT = {
  name_uz: "",
  name_ru: "",
  desc_uz: "",
  desc_ru: "",
  price: "",
  old_price: "",
  category: "paintings",
  stock: 1,
  image: "",
  badge: "",
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    lang,
    adminLoggedIn,
    adminLogout,
    currentUser,
    updateProfile,
    myStudents,
    fetchMyStudents,
    addStudent,
    editStudent,
    removeStudent,
    selectedStudent,
    setSelectedStudent,
    studentProducts,
    fetchStudentProducts,
    addProductForStudent,
    editProductForStudent,
    deleteProductForStudent,
    pendingStudents,
    fetchPendingStudents,
    approveStudent,
    rejectStudent,
    pendingProducts,
    fetchPendingProducts,
    approveProduct,
    rejectProduct,
    darkMode,
    toggleDarkMode,
  } = useStore();

  const [tab, setTab] = useState("profile");
  const [studentSearch, setStudentSearch] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");

  const filterStudent = (s, query) => {
    if (!query) return true;
    const q = query.toLowerCase().trim();
    return (
      (s.name || "").toLowerCase().includes(q) ||
      (s.full_name || "").toLowerCase().includes(q) ||
      (s.grade || "").toLowerCase().includes(q) ||
      (s.phone || "").toLowerCase().includes(q)
    );
  };

  const filteredMyStudents = myStudents.filter((s) =>
    filterStudent(s, studentSearch)
  );
  const filteredPendingStudents = pendingStudents.filter((s) =>
    filterStudent(s, pendingSearch)
  );

  const studentPendingProducts = selectedStudent
    ? pendingProducts.filter((p) => p.student_id === selectedStudent.id)
    : [];

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: "",
    full_name: "",
    phone: "",
    school: "",
    avatar: "",
  });
  const [profileMsg, setProfileMsg] = useState("");

  // Student form
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);
  const [studentForm, setStudentForm] = useState(EMPTY_STUDENT);

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);

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

    setProfileForm({
      name: currentUser.name || "",
      full_name: currentUser.full_name || "",
      phone: currentUser.phone || "",
      school: currentUser.school || "",
      avatar: currentUser.avatar || "",
    });

    fetchMyStudents();
    fetchPendingStudents();
    fetchPendingProducts();
  }, [adminLoggedIn]);

  const handleImageUpload = (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert(
        lang === "uz"
          ? "Rasm 2MB dan kichik bo'lsin"
          : "Изображение должно быть меньше 2MB"
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => callback(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    const res = await updateProfile(profileForm);
    if (res.success) {
      setProfileMsg(lang === "uz" ? "✅ Saqlandi!" : "✅ Сохранено!");
      setTimeout(() => setProfileMsg(""), 2000);
    } else {
      setProfileMsg("❌ " + (res.error || "Xatolik"));
    }
  };

  const openNewStudent = () => {
    setStudentForm(EMPTY_STUDENT);
    setEditStudentId(null);
    setShowStudentForm(true);
  };

  const openEditStudent = (s) => {
    setStudentForm({
      name: s.name || "",
      grade: s.grade || "",
      phone: s.phone || "",
      avatar: s.avatar || "",
      is_disabled: s.is_disabled || false,
      card_number: s.card_number || "",
      illness_info: s.illness_info || "",
    });
    setEditStudentId(s.id);
    setShowStudentForm(true);
  };

  const handleStudentSave = async (e) => {
    e.preventDefault();
    if (!studentForm.name.trim()) {
      alert(lang === "uz" ? "Ism kiritilishi shart" : "Имя обязательно");
      return;
    }
    try {
      if (editStudentId) {
        await editStudent(editStudentId, studentForm);
      } else {
        await addStudent(studentForm);
      }
      setShowStudentForm(false);
      setEditStudentId(null);
      setStudentForm(EMPTY_STUDENT);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStudentDelete = async (id) => {
    if (
      !confirm(
        lang === "uz" ? "O'quvchini o'chirmoqchimisiz?" : "Удалить ученика?"
      )
    )
      return;
    try {
      await removeStudent(id);
    } catch (err) {
      alert(err.message);
    }
  };

  const openNewProduct = () => {
    setProductForm(EMPTY_PRODUCT);
    setEditProductId(null);
    setShowProductForm(true);
  };

  const openEditProduct = (p) => {
    setProductForm({
      name_uz: p.name_uz || p.nameUz || "",
      name_ru: p.name_ru || p.nameRu || "",
      desc_uz: p.desc_uz || p.descUz || "",
      desc_ru: p.desc_ru || p.descRu || "",
      price: String(p.price || ""),
      old_price: String(p.old_price || p.oldPrice || ""),
      category: p.category || "paintings",
      stock: p.stock || 1,
      image: p.image || "",
      badge: p.badge || "",
    });
    setEditProductId(p.id);
    setShowProductForm(true);
  };

  const handleProductSave = async (e) => {
    e.preventDefault();
    if (!productForm.name_uz.trim() || !productForm.price) {
      alert(
        lang === "uz"
          ? "Nom va narx kiritilishi shart"
          : "Название и цена обязательны"
      );
      return;
    }
    const data = {
      ...productForm,
      nameUz: productForm.name_uz,
      nameRu: productForm.name_ru || productForm.name_uz,
      descUz: productForm.desc_uz,
      descRu: productForm.desc_ru,
      price: parseFloat(productForm.price) || 0,
      oldPrice: productForm.old_price
        ? parseFloat(productForm.old_price)
        : null,
      stock: parseInt(productForm.stock) || 1,
      // O'quvchi ma'lumotlari — faqat o'quvchining shaxsiy ma'lumotlari yuboriladi.
      // Maktab / Tuman / Viloyat — backend admin'ning maktabidan avtomatik to'ldiradi.
      author: selectedStudent?.name || "",
      authorRu: selectedStudent?.name || "",
      grade: selectedStudent?.grade || "",
      phone: selectedStudent?.phone || "",
      studentType: selectedStudent?.is_disabled ? "disabled" : "normal",
      cardNumber: selectedStudent?.card_number || "",
      illnessInfo: selectedStudent?.illness_info || "",
      storyUz: selectedStudent?.illness_info || "",
      photo: selectedStudent?.avatar || "",
    };
    try {
      if (editProductId) {
        await editProductForStudent(editProductId, selectedStudent.id, data);
      } else {
        await addProductForStudent(selectedStudent.id, data);
      }
      setShowProductForm(false);
      setEditProductId(null);
      setProductForm(EMPTY_PRODUCT);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleProductDelete = async (productId) => {
    if (!confirm(lang === "uz" ? "Mahsulotni o'chirasizmi?" : "Удалить товар?"))
      return;
    try {
      await deleteProductForStudent(productId, selectedStudent.id);
    } catch (err) {
      alert(err.message);
    }
  };

  const openStudentProducts = async (student) => {
    setSelectedStudent(student);
    await fetchStudentProducts(student.id);
    setTab("products");
  };

  const formatPrice = (n) => (n || 0).toLocaleString("uz-UZ") + " so'm";

  if (!adminLoggedIn || currentUser?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-100 flex flex-col fixed h-full z-10">
        <div className="p-5 border-b">
          <div className="flex items-center gap-3">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt=""
                className="w-10 h-10 rounded-full object-cover border-2 border-[#1a56db]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#1a56db] text-white flex items-center justify-center font-black">
                {currentUser.name?.[0]?.toUpperCase() || "A"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-black text-sm text-gray-900 truncate">
                {currentUser.name}
              </div>
              <div className="text-xs text-gray-400">Admin kabinet</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-[#1a56db] transition"
          >
            <Home size={18} />
            {lang === "uz" ? "Bosh sahifa" : "Главная"}
          </button>
          <button
            onClick={() => {
              setTab("profile");
              setSelectedStudent(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              tab === "profile"
                ? "bg-[#1a56db] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <User size={18} />
            {lang === "uz" ? "Mening profilim" : "Мой профиль"}
          </button>

          <button
            onClick={() => {
              setTab("students");
              setSelectedStudent(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              tab === "students"
                ? "bg-[#1a56db] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Users size={18} />
            {lang === "uz" ? "O'quvchilarim" : "Мои ученики"}
            {myStudents.length > 0 && (
              <span className="ml-auto text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">
                {myStudents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setTab("pending");
              setSelectedStudent(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              tab === "pending"
                ? "bg-[#1a56db] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <UserPlus size={18} />
            {lang === "uz" ? "Yangi o'quvchilar" : "Новые ученики"}
            {pendingStudents.length > 0 && (
              <span className="ml-auto text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 font-black">
                {pendingStudents.length}
              </span>
            )}
          </button>

          {selectedStudent && (
            <button
              onClick={() => setTab("products")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                tab === "products"
                  ? "bg-[#1a56db] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Package size={18} />
              <span className="truncate flex-1 text-left">
                {selectedStudent.name}
              </span>
            </button>
          )}
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
            onClick={() => {
              adminLogout();
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            {lang === "uz" ? "Chiqish" : "Выйти"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-6">
        {/* Top bar — Bosh sahifaga qaytish */}
        <div className="sticky top-0 z-20 -mx-6 -mt-6 mb-6 px-6 py-3 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a56db] text-white text-sm font-bold shadow-sm hover:bg-[#1341a8] transition"
          >
            <Home size={16} />
            {lang === "uz" ? "Bosh sahifa" : "Главная"}
          </button>
          <span className="text-xs font-semibold text-gray-400">
            {lang === "uz" ? "Admin kabinet" : "Кабинет админа"}
          </span>
        </div>

        {/* PROFILE */}
        {tab === "profile" && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-black text-gray-900 mb-6">
              {lang === "uz" ? "Mening profilim" : "Мой профиль"}
            </h1>

            <form
              onSubmit={handleProfileSave}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  {profileForm.avatar ? (
                    <img
                      src={profileForm.avatar}
                      alt=""
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#1a56db]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <User size={36} />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-[#1a56db] text-white p-2 rounded-full cursor-pointer hover:bg-[#1341a8] transition">
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, (base64) =>
                          setProfileForm({ ...profileForm, avatar: base64 })
                        )
                      }
                    />
                  </label>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{profileForm.name}</p>
                  <p className="text-sm text-gray-400">
                    {lang === "uz"
                      ? "Rasm yuklash uchun kamera belgisini bosing"
                      : "Нажмите на камеру чтобы загрузить фото"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  {lang === "uz" ? "Ism *" : "Имя *"}
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  {lang === "uz" ? "Familiya" : "Фамилия"}
                </label>
                <input
                  type="text"
                  value={profileForm.full_name}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      full_name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  {lang === "uz" ? "Telefon raqam" : "Номер телефона"}
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      phone: formatPhone(e.target.value),
                    })
                  }
                  placeholder="+998 __ ___ __ __"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a56db] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  {lang === "uz" ? "Qaysi maktabdan" : "Школа"}
                </label>
                <input
                  type="text"
                  value={profileForm.school}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, school: e.target.value })
                  }
                  placeholder={
                    lang === "uz"
                      ? "Masalan: 5-son umumta'lim maktabi"
                      : "Например: Школа № 5"
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                />
              </div>

              {profileMsg && (
                <div
                  className={`text-sm font-semibold text-center rounded-xl py-2 ${
                    profileMsg.startsWith("✅")
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {profileMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#1a56db] hover:bg-[#1341a8] text-white font-black py-3 rounded-xl transition"
              >
                {lang === "uz" ? "Saqlash" : "Сохранить"}
              </button>
            </form>
          </div>
        )}

        {/* STUDENTS */}
        {tab === "students" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  {lang === "uz" ? "Mening o'quvchilarim" : "Мои ученики"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {lang === "uz"
                    ? `Jami: ${myStudents.length} ta o'quvchi`
                    : `Всего: ${myStudents.length}`}
                </p>
              </div>
              <button
                onClick={openNewStudent}
                className="flex items-center gap-2 bg-[#1a56db] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1341a8] transition"
              >
                <Plus size={18} />
                {lang === "uz" ? "Yangi o'quvchi" : "Новый ученик"}
              </button>
            </div>

            {/* Qidiruv */}
            {myStudents.length > 0 && (
              <div className="relative mb-5">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder={
                    lang === "uz"
                      ? "Ism, familiya, sinf yoki telefon bo'yicha qidirish..."
                      : "Поиск по имени, классу, телефону..."
                  }
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1a56db] bg-white"
                />
                {studentSearch && (
                  <button
                    onClick={() => setStudentSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            {myStudents.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">🎓</div>
                <p className="font-semibold">
                  {lang === "uz"
                    ? "Hozircha o'quvchilar yo'q"
                    : "Пока нет учеников"}
                </p>
              </div>
            ) : filteredMyStudents.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-semibold">
                  {lang === "uz"
                    ? `"${studentSearch}" bo'yicha hech narsa topilmadi`
                    : `Ничего не найдено по "${studentSearch}"`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMyStudents.map((s) => {
                  const pendingCount = pendingProducts.filter(
                    (p) => p.student_id === s.id
                  ).length;
                  return (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition relative"
                  >
                    {pendingCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-black rounded-full px-2.5 py-1 shadow-lg flex items-center gap-1 z-10">
                        ⏳ {pendingCount}{" "}
                        {lang === "uz" ? "yangi" : "новых"}
                      </div>
                    )}
                    <div className="flex items-start gap-3 mb-4">
                      {s.avatar ? (
                        <img
                          src={s.avatar}
                          alt=""
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center font-black text-xl">
                          {s.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-gray-900 truncate">
                          {s.name}
                        </h3>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {s.grade && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg font-bold">
                              {s.grade}-sinf
                            </span>
                          )}
                          {s.is_disabled && (
                            <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-lg font-bold">
                              ❤️
                            </span>
                          )}
                        </div>
                        {s.phone && (
                          <p className="text-xs text-gray-500 mt-1">
                            📞 {s.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openStudentProducts(s)}
                        className="flex-1 flex items-center justify-center gap-1 bg-[#1a56db] hover:bg-[#1341a8] text-white py-2 rounded-lg font-bold text-xs transition"
                      >
                        <Package size={14} />
                        {lang === "uz" ? "Mahsulotlar" : "Товары"}
                      </button>
                      <button
                        onClick={() => openEditStudent(s)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 border border-gray-200 transition"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleStudentDelete(s.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 border border-gray-200 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PENDING STUDENTS — Telegram orqali ariza yuborganlar */}
        {tab === "pending" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  {lang === "uz" ? "Yangi o'quvchilar" : "Новые ученики"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {lang === "uz"
                    ? `Telegram orqali ariza yuborgan: ${pendingStudents.length} ta`
                    : `Заявок через Telegram: ${pendingStudents.length}`}
                </p>
              </div>
              <button
                onClick={fetchPendingStudents}
                className="text-sm text-gray-500 hover:text-[#1a56db] transition"
              >
                🔄 {lang === "uz" ? "Yangilash" : "Обновить"}
              </button>
            </div>

            {/* Qidiruv */}
            {pendingStudents.length > 0 && (
              <div className="relative mb-5">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={pendingSearch}
                  onChange={(e) => setPendingSearch(e.target.value)}
                  placeholder={
                    lang === "uz"
                      ? "Ism, familiya, sinf yoki telefon bo'yicha qidirish..."
                      : "Поиск по имени, классу, телефону..."
                  }
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1a56db] bg-white"
                />
                {pendingSearch && (
                  <button
                    onClick={() => setPendingSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            {pendingStudents.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">📭</div>
                <p className="font-semibold">
                  {lang === "uz"
                    ? "Yangi arizalar yo'q"
                    : "Нет новых заявок"}
                </p>
              </div>
            ) : filteredPendingStudents.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-semibold">
                  {lang === "uz"
                    ? `"${pendingSearch}" bo'yicha hech narsa topilmadi`
                    : `Ничего не найдено по "${pendingSearch}"`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPendingStudents.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl shadow-sm border-2 border-amber-200 p-5"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      {s.avatar ? (
                        <img
                          src={s.avatar}
                          alt=""
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black text-xl">
                          {s.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-gray-900 truncate">
                          {s.name} {s.full_name}
                        </h3>
                        {s.grade && (
                          <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg font-bold mt-1">
                            🎓 {s.grade}-sinf
                          </span>
                        )}
                        {s.phone && (
                          <p className="text-xs text-gray-500 mt-1">
                            📞 {s.phone}
                          </p>
                        )}
                        <span className="inline-block text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg font-bold mt-2">
                          ⏳ {lang === "uz" ? "Tasdiq kutmoqda" : "Ожидает"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          if (
                            !confirm(
                              lang === "uz"
                                ? `${s.name} ni tasdiqlaysizmi?`
                                : `Подтвердить ${s.name}?`
                            )
                          )
                            return;
                          try {
                            await approveStudent(s.id);
                          } catch (err) {
                            alert(err.message);
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-xs transition"
                      >
                        <Check size={14} />
                        {lang === "uz" ? "Tasdiqlash" : "Одобрить"}
                      </button>
                      <button
                        onClick={async () => {
                          if (
                            !confirm(
                              lang === "uz"
                                ? `${s.name} arizasini rad etasizmi?`
                                : `Отклонить заявку ${s.name}?`
                            )
                          )
                            return;
                          try {
                            await rejectStudent(s.id);
                          } catch (err) {
                            alert(err.message);
                          }
                        }}
                        className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 px-3 rounded-lg font-bold text-xs transition"
                      >
                        <XCircle size={14} />
                        {lang === "uz" ? "Rad etish" : "Отклонить"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS */}
        {tab === "products" && selectedStudent && (
          <div>
            <button
              onClick={() => {
                setTab("students");
                setSelectedStudent(null);
              }}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1a56db] mb-4 transition"
            >
              <ArrowLeft size={16} />{" "}
              {lang === "uz" ? "O'quvchilarga qaytish" : "К ученикам"}
            </button>

            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {selectedStudent.avatar ? (
                  <img
                    src={selectedStudent.avatar}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center font-black text-lg">
                    {selectedStudent.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-black text-gray-900">
                    {selectedStudent.name}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {lang === "uz"
                      ? `${studentProducts.length} ta mahsulot`
                      : `${studentProducts.length} товаров`}
                  </p>
                </div>
              </div>

              <button
                onClick={openNewProduct}
                className="flex items-center gap-2 bg-[#1a56db] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1341a8] transition"
              >
                <Plus size={18} />
                {lang === "uz" ? "Mahsulot qo'shish" : "Добавить товар"}
              </button>
            </div>

            {/* Telegram orqali yuklangan, hali tasdiqlanmagan mahsulotlar */}
            {studentPendingProducts.length > 0 && (
              <div className="mb-6 bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">⏳</span>
                  <div>
                    <h3 className="font-black text-amber-900">
                      {lang === "uz"
                        ? `Telegram'dan yuklangan — ${studentPendingProducts.length} ta tasdiq kutmoqda`
                        : `Из Telegram — ожидают ${studentPendingProducts.length}`}
                    </h3>
                    <p className="text-xs text-amber-700">
                      {lang === "uz"
                        ? "O'quvchining o'zi yuklagan mahsulotlari. Ko'rib chiqing va tasdiqlang."
                        : "Товары, загруженные учеником. Просмотрите и одобрите."}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {studentPendingProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-xl p-3 flex gap-3 border border-amber-200"
                    >
                      {p.image ? (
                        <img
                          src={p.image}
                          alt=""
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <ImageIcon size={24} className="text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm text-gray-900 line-clamp-1">
                          {p.name_uz}
                        </div>
                        <div className="text-xs text-[#1a56db] font-bold mt-0.5">
                          {formatPrice(p.price)} · {p.stock} dona
                        </div>
                        {p.category && (
                          <div className="text-[10px] bg-gray-100 text-gray-600 rounded inline-block px-1.5 py-0.5 mt-1">
                            {p.category}
                          </div>
                        )}
                        <div className="flex gap-1.5 mt-2">
                          <button
                            onClick={async () => {
                              if (
                                !confirm(
                                  lang === "uz"
                                    ? "Tasdiqlaysizmi?"
                                    : "Одобрить?"
                                )
                              )
                                return;
                              try {
                                await approveProduct(p.id);
                              } catch (err) {
                                alert(err.message);
                              }
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded font-bold text-[11px] flex items-center justify-center gap-1"
                          >
                            <Check size={12} />
                            {lang === "uz" ? "Tasdiqlash" : "Одобрить"}
                          </button>
                          <button
                            onClick={async () => {
                              if (
                                !confirm(
                                  lang === "uz"
                                    ? "Rad etasizmi?"
                                    : "Отклонить?"
                                )
                              )
                                return;
                              try {
                                await rejectProduct(p.id);
                              } catch (err) {
                                alert(err.message);
                              }
                            }}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2 py-1 rounded font-bold text-[11px] flex items-center justify-center gap-1"
                          >
                            <XCircle size={12} />
                            {lang === "uz" ? "Rad" : "Откл"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {studentProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">🎨</div>
                <p className="font-semibold">
                  {lang === "uz"
                    ? "Bu o'quvchining mahsuloti yo'q"
                    : "У ученика нет товаров"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt=""
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-300">
                        <ImageIcon size={48} />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-black text-gray-900 line-clamp-1">
                        {lang === "uz"
                          ? p.nameUz || p.name_uz
                          : p.nameRu || p.name_ru || p.nameUz}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {lang === "uz"
                          ? p.descUz || p.desc_uz
                          : p.descRu || p.desc_ru}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="font-black text-[#1a56db]">
                          {formatPrice(p.price)}
                        </p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditProduct(p)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleProductDelete(p.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {lang === "uz" ? "Soni" : "Количество"}: {p.stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* STUDENT FORM MODAL */}
      {showStudentForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-black text-lg">
                {editStudentId
                  ? lang === "uz"
                    ? "O'quvchini tahrirlash"
                    : "Редактировать ученика"
                  : lang === "uz"
                  ? "Yangi o'quvchi"
                  : "Новый ученик"}
              </h2>
              <button
                onClick={() => setShowStudentForm(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleStudentSave}
              className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
            >
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  {studentForm.avatar ? (
                    <img
                      src={studentForm.avatar}
                      alt=""
                      className="w-20 h-20 rounded-full object-cover border-4 border-[#1a56db]"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <User size={28} />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-[#1a56db] text-white p-1.5 rounded-full cursor-pointer hover:bg-[#1341a8] transition">
                    <Camera size={12} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, (base64) =>
                          setStudentForm({ ...studentForm, avatar: base64 })
                        )
                      }
                    />
                  </label>
                </div>
                <div className="text-sm text-gray-500">
                  {lang === "uz"
                    ? "O'quvchi rasmini yuklang"
                    : "Загрузите фото"}
                </div>
              </div>

              {/* Ism-familiya */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  {lang === "uz" ? "Ism-familiya *" : "Имя-фамилия *"}
                </label>
                <input
                  type="text"
                  required
                  value={studentForm.name}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, name: e.target.value })
                  }
                  placeholder={
                    lang === "uz"
                      ? "Masalan: Aliyev Sardor"
                      : "Например: Алиев Сардор"
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                />
              </div>

              {/* Sinf + Telefon */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    {lang === "uz" ? "Nechinchi sinf" : "Класс"}
                  </label>
                  <input
                    type="text"
                    value={studentForm.grade}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, grade: e.target.value })
                    }
                    placeholder="7"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    {lang === "uz" ? "Telefon" : "Телефон"}
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={studentForm.phone}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        phone: formatPhone(e.target.value),
                      })
                    }
                    placeholder="+998 __ ___ __ __"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db] font-mono"
                  />
                </div>
              </div>

              {/* Imkoniyati cheklangan checkbox */}
              <label className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 cursor-pointer hover:bg-rose-100 transition">
                <input
                  type="checkbox"
                  checked={studentForm.is_disabled}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      is_disabled: e.target.checked,
                      card_number: e.target.checked
                        ? studentForm.card_number
                        : "",
                    })
                  }
                  className="w-5 h-5 accent-rose-500"
                />
                <Heart size={16} className="text-rose-500" />
                <span className="text-sm font-semibold text-rose-700">
                  {lang === "uz"
                    ? "Imkoniyati cheklangan o'quvchi"
                    : "С ограниченными возможностями"}
                </span>
              </label>

              {studentForm.is_disabled && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-rose-600 mb-1">
                      {lang === "uz" ? "Karta raqami" : "Номер карты"}
                    </label>
                    <input
                      type="text"
                      value={studentForm.card_number}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          card_number: e.target.value,
                        })
                      }
                      className="w-full border-2 border-rose-200 bg-rose-50 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-500 font-mono"
                      placeholder="8600 1234 5678 9012"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rose-600 mb-1">
                      ❤️{" "}
                      {lang === "uz"
                        ? "Kasallik haqida ma'lumot"
                        : "Информация о заболевании"}
                    </label>
                    <textarea
                      value={studentForm.illness_info}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          illness_info: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full border-2 border-rose-200 bg-rose-50 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-500 resize-y"
                      placeholder={
                        lang === "uz"
                          ? "Masalan: O'quvchi tug'ma yurak nuqsoni bilan tug'ilgan. Operatsiya uchun yordam kerak..."
                          : "Например: Ученик родился с врождённым пороком сердца. Нужна помощь на операцию..."
                      }
                    />
                    <p className="text-[11px] text-rose-500 mt-1">
                      {lang === "uz"
                        ? "Bu matn mahsulot kartochkasidagi profilni bosganda chiqadi"
                        : "Этот текст появится при нажатии на профиль в карточке товара"}
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowStudentForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm transition"
                >
                  {lang === "uz" ? "Bekor" : "Отмена"}
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white py-3 rounded-xl font-black text-sm transition"
                >
                  <Check size={16} /> {lang === "uz" ? "Saqlash" : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT FORM MODAL */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-black text-lg">
                {editProductId
                  ? lang === "uz"
                    ? "Mahsulotni tahrirlash"
                    : "Редактировать товар"
                  : lang === "uz"
                  ? "Yangi mahsulot"
                  : "Новый товар"}
                <span className="text-sm text-gray-400 font-normal ml-2">
                  — {selectedStudent?.name}
                </span>
              </h2>
              <button
                onClick={() => setShowProductForm(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleProductSave}
              className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
            >
              {/* Rasm */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">
                  {lang === "uz" ? "Mahsulot rasmi *" : "Фото товара *"}
                </label>
                <div className="flex items-center gap-4">
                  {productForm.image ? (
                    <img
                      src={productForm.image}
                      alt=""
                      className="w-28 h-28 rounded-xl object-cover border"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  <label className="flex-1 cursor-pointer bg-[#1a56db] hover:bg-[#1341a8] text-white py-3 rounded-xl font-bold text-sm text-center transition">
                    <Camera size={16} className="inline mr-2" />
                    {lang === "uz" ? "Rasm yuklash" : "Загрузить фото"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, (base64) =>
                          setProductForm({ ...productForm, image: base64 })
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Mahsulot nomi */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  {lang === "uz" ? "Mahsulot nomi *" : "Название *"}
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name_uz}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name_uz: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                />
              </div>

              {/* Tavsif */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  {lang === "uz" ? "Tavsif" : "Описание"}
                </label>
                <textarea
                  value={productForm.desc_uz}
                  onChange={(e) =>
                    setProductForm({ ...productForm, desc_uz: e.target.value })
                  }
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db] resize-none"
                />
              </div>

              {/* Narx + Soni */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    {lang === "uz" ? "Narx *" : "Цена *"}
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    placeholder="50000"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    {lang === "uz" ? "Soni *" : "Количество *"}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
              </div>

              {/* Mahsulot turi */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  {lang === "uz" ? "Mahsulot turi" : "Тип товара"}
                </label>
                <select
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      category: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white"
                >
                  <option value="paintings">🎨 {lang === "uz" ? "Rassomchilik ishlari" : "Художественные работы"}</option>
                  <option value="handcraft">✂️ {lang === "uz" ? "Qo'l mehnati (Handmade)" : "Ручная работа"}</option>
                  <option value="clothing">👗 {lang === "uz" ? "Tikilgan va kiyimlar" : "Шитьё и одежда"}</option>
                  <option value="toys">🧸 {lang === "uz" ? "O'yinchoqlar va bolalar buyumlari" : "Игрушки и детские товары"}</option>
                  <option value="souvenirs">🎁 {lang === "uz" ? "Suvenir va sovg'alar" : "Сувениры и подарки"}</option>
                  <option value="holiday">🎉 {lang === "uz" ? "Bayram va dekor" : "Праздник и декор"}</option>
                  <option value="educational">📚 {lang === "uz" ? "Ta'limiy va foydali mahsulotlar" : "Учебные и полезные"}</option>
                  <option value="digital">💻 {lang === "uz" ? "Raqamli mahsulotlar" : "Цифровые продукты"}</option>
                  <option value="creative">⭐ {lang === "uz" ? "Ijodiy xizmatlar" : "Творческие услуги"}</option>
                  <option value="school">🏫 {lang === "uz" ? "Maktab loyihalari" : "Школьные проекты"}</option>
                  <option value="eco">🌿 {lang === "uz" ? "Eko va tabiiy mahsulotlar" : "Эко и натуральные"}</option>
                  <option value="other">📦 {lang === "uz" ? "Boshqa" : "Другое"}</option>
                </select>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 text-sm">
                <p className="font-bold text-blue-900 mb-1">
                  ℹ️ {lang === "uz" ? "Diqqat" : "Внимание"}
                </p>
                <p className="text-blue-700 text-xs">
                  {lang === "uz"
                    ? `Bu mahsulot "${selectedStudent?.name}" nomidan qo'shiladi.`
                    : `Товар добавляется от имени "${selectedStudent?.name}".`}
                </p>
              </div>

              <div className="flex gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm transition"
                >
                  {lang === "uz" ? "Bekor" : "Отмена"}
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white py-3 rounded-xl font-black text-sm transition"
                >
                  <Check size={16} /> {lang === "uz" ? "Saqlash" : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
