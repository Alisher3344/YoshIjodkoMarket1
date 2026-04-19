import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Heart,
  CreditCard,
  Package,
  X,
  Check,
  User,
  Camera,
  Save,
  School,
  Calendar,
  Upload,
} from "lucide-react";
import useStore from "../store/useStore";
import { categoryLabels } from "../components/ui/data/translations";

const EMPTY_FORM = {
  nameUz: "",
  nameRu: "",
  descUz: "",
  descRu: "",
  price: "",
  category: "paintings",
  stock: "1",
  badge: "new",
  image: "",
  grade: "",
  district: "",
  region: "Qashqadaryo viloyati",
};

// File → Base64 convertor
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CabinetPage() {
  const navigate = useNavigate();
  const {
    lang,
    adminLoggedIn,
    currentUser,
    adminLogout,
    updateProfile,
    myProducts,
    fetchMyProducts,
    addProduct,
    editProduct,
    deleteProduct,
  } = useStore();

  const [tab, setTab] = useState("products"); // 'products' | 'profile'

  // Mahsulot formasi
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const imageInputRef = useRef(null);

  // Profil formasi
  const [profile, setProfile] = useState({
    name: "",
    full_name: "",
    school: "",
    age: "",
    card_number: "",
    illness_info: "",
    avatar: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const avatarInputRef = useRef(null);

  useEffect(() => {
    if (!adminLoggedIn) {
      navigate("/auth");
      return;
    }
    fetchMyProducts();

    // Sotilgan mahsulotlarni yuklash va tabrik
    (async () => {
      const soldItems = (await api.getMySales) ? await api.getMySales() : [];
      if (soldItems && soldItems.length > 0) {
        const lastCount = parseInt(
          localStorage.getItem("lastSalesCount") || "0"
        );
        if (soldItems.length > lastCount) {
          const newSalesCount = soldItems.length - lastCount;
          setTimeout(() => {
            alert(
              lang === "uz"
                ? `🎉 Tabriklaymiz! ${newSalesCount} ta mahsulotingiz sotildi!\n\nMijoz bilan bog'lanib kelishing.`
                : `🎉 Поздравляем! Продано ${newSalesCount} ваших товаров!`
            );
            localStorage.setItem("lastSalesCount", String(soldItems.length));
          }, 1000);
        }
      }
    })();
  }, [adminLoggedIn]);
  useEffect(() => {
    if (currentUser) {
      setProfile({
        name: currentUser.name || "",
        full_name: currentUser.full_name || "",
        school: currentUser.school || "",
        age: currentUser.age || "",
        card_number: currentUser.card_number || "",
        illness_info: currentUser.illness_info || "",
        avatar: currentUser.avatar || "",
      });
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const cats = categoryLabels[lang];

  // ── Profil ──────────────────────────────────────────────────────────
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert(
        lang === "uz"
          ? "Rasm 2MB dan katta bo'lmasin"
          : "Размер изображения не более 2MB"
      );
      return;
    }
    const base64 = await fileToBase64(file);
    setProfile({ ...profile, avatar: base64 });
  };

  const handleSaveProfile = async () => {
    setProfileMsg("");
    setProfileSaving(true);
    const res = await updateProfile({
      name: profile.name,
      full_name: profile.full_name,
      school: profile.school,
      age: parseInt(profile.age) || 0,
      card_number: profile.card_number,
      illness_info: profile.illness_info,
      avatar: profile.avatar,
    });
    setProfileSaving(false);
    if (res.success) {
      setProfileMsg(
        lang === "uz" ? "✅ Profil saqlandi!" : "✅ Профиль сохранён!"
      );
      setTimeout(() => setProfileMsg(""), 3000);
    } else {
      setProfileMsg("❌ " + (res.error || "Xatolik"));
    }
  };

  // ── Mahsulot ────────────────────────────────────────────────────────
  const openNew = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setError("");
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      nameUz: p.nameUz || "",
      nameRu: p.nameRu || "",
      descUz: p.descUz || "",
      descRu: p.descRu || "",
      price: p.price || "",
      category: p.category || "paintings",
      stock: p.stock || "1",
      badge: p.badge || "new",
      image: p.image || "",
      grade: p.grade || "",
      district: p.district || "",
      region: p.region || "Qashqadaryo viloyati",
    });
    setShowForm(true);
    setError("");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(
        lang === "uz"
          ? "Rasm 5MB dan katta bo'lmasin"
          : "Размер изображения не более 5MB"
      );
      return;
    }
    const base64 = await fileToBase64(file);
    setForm({ ...form, image: base64 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nameUz.trim() || !form.price) {
      setError(
        lang === "uz" ? "Nom va narx majburiy" : "Название и цена обязательны"
      );
      return;
    }
    if (!form.image) {
      setError(lang === "uz" ? "Rasm yuklang" : "Загрузите изображение");
      return;
    }

    setSaving(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock) || 0,
      };
      if (editId) {
        await editProduct(editId, data);
      } else {
        await addProduct(data);
      }
      closeForm();
    } catch (err) {
      setError(err.message || "Xatolik");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        lang === "uz" ? "Rostdan o'chirmoqchimisiz?" : "Действительно удалить?"
      )
    )
      return;
    try {
      await deleteProduct(id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="text-[#1a56db] font-bold text-sm hover:underline"
            >
              ← {lang === "uz" ? "Bosh sahifa" : "Главная"}
            </button>
            <span className="text-gray-300">|</span>
            <h1 className="font-black text-lg text-gray-900">
              {lang === "uz" ? "Mening kabinetim" : "Мой кабинет"}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-xl transition font-semibold text-sm"
          >
            <LogOut size={15} /> {lang === "uz" ? "Chiqish" : "Выйти"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* User info card */}
        <div
          className={`rounded-2xl p-5 mb-6 ${
            currentUser.is_disabled
              ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white"
              : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/25 flex items-center justify-center overflow-hidden border-4 border-white/40 flex-shrink-0">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">
                  {currentUser.is_disabled ? "❤️" : "🎓"}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-black text-xl truncate">
                {currentUser.full_name || currentUser.name}
              </div>
              <div className="text-white/80 text-sm">{currentUser.phone}</div>
              {currentUser.school && (
                <div className="text-white/85 text-sm mt-1 truncate">
                  🏫 {currentUser.school}
                </div>
              )}
              <div className="flex gap-2 mt-2 flex-wrap">
                {currentUser.age > 0 && (
                  <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
                    🎂 {currentUser.age} {lang === "uz" ? "yosh" : "лет"}
                  </span>
                )}
                {currentUser.is_disabled && (
                  <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs flex items-center gap-1">
                    <Heart size={10} />{" "}
                    {lang === "uz" ? "Imkoniyati cheklangan" : "Особые"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white p-1 rounded-xl mb-6 border border-gray-100 w-fit">
          <button
            onClick={() => setTab("products")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition ${
              tab === "products"
                ? "bg-[#1a56db] text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Package size={15} />
            {lang === "uz" ? "Mahsulotlarim" : "Мои товары"}
          </button>
          <button
            onClick={() => setTab("profile")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition ${
              tab === "profile"
                ? "bg-[#1a56db] text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <User size={15} />
            {lang === "uz" ? "Profil" : "Профиль"}
          </button>
        </div>

        {/* ── PRODUCTS TAB ─────────────────────────────────────── */}
        {tab === "products" && (
          <>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Package size={20} className="text-[#1a56db]" />
                <h2 className="font-black text-lg text-gray-800">
                  {lang === "uz" ? "Mening mahsulotlarim" : "Мои товары"}
                </h2>
                <span className="bg-blue-100 text-[#1a56db] text-xs font-black px-2 py-0.5 rounded-full">
                  {myProducts.length}
                </span>
              </div>
              <button
                onClick={openNew}
                className="flex items-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition"
              >
                <Plus size={16} />
                {lang === "uz" ? "Mahsulot qo'shish" : "Добавить товар"}
              </button>
            </div>

            {myProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <div className="text-6xl mb-3">📦</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {lang === "uz"
                    ? "Mahsulotlaringiz hali yo'q"
                    : "У вас пока нет товаров"}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {lang === "uz"
                    ? "Yuqoridagi tugmani bosib birinchi mahsulotingizni qo'shing"
                    : "Нажмите кнопку выше, чтобы добавить первый товар"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProducts.map((p) => (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition relative">
                    <div className="aspect-square bg-gray-100 relative">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.nameUz}
                          className={`w-full h-full object-cover ${
                            p.stock === 0 ? "grayscale opacity-60" : ""
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          📦
                        </div>
                      )}
                      {/* SOTILDI yorlig'i */}
                      {p.stock === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-500 text-white font-black text-xl px-6 py-2 rounded-xl shadow-2xl transform -rotate-12 border-4 border-white">
                            ✓ {lang === "uz" ? "SOTILDI" : "ПРОДАНО"}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm text-gray-800 line-clamp-1">
                        {p.nameUz}
                      </h3>
                      <div className="text-[#1a56db] font-black text-base mt-1">
                        {p.price.toLocaleString()} so'm
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {cats[p.category] || p.category} ·{" "}
                        {p.stock > 0 ? (
                          `${p.stock} ${lang === "uz" ? "dona" : "шт"}`
                        ) : (
                          <span className="text-green-600 font-bold">
                            {lang === "uz" ? "💰 Sotildi!" : "💰 Продано!"}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => openEdit(p)}
                          className="flex-1 flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-[#1a56db] py-2 rounded-lg text-xs font-bold transition"
                        >
                          <Edit2 size={12} />{" "}
                          {lang === "uz" ? "Tahrir" : "Изменить"}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── PROFILE TAB ──────────────────────────────────────── */}
        {tab === "profile" && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 max-w-2xl">
            <h2 className="font-black text-xl text-gray-900 mb-5">
              {lang === "uz" ? "Profil ma'lumotlari" : "Данные профиля"}
            </h2>

            {profileMsg && (
              <div
                className={`text-sm rounded-xl px-4 py-2 mb-4 ${
                  profileMsg.startsWith("✅")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {profileMsg}
              </div>
            )}

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0 border-2 border-gray-200">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}
              </div>
              <div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="flex items-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white px-4 py-2 rounded-xl text-sm font-bold transition"
                >
                  <Camera size={15} />
                  {lang === "uz" ? "Rasm yuklash" : "Загрузить фото"}
                </button>
                {profile.avatar && (
                  <button
                    onClick={() => setProfile({ ...profile, avatar: "" })}
                    className="ml-2 text-red-500 text-xs hover:underline"
                  >
                    {lang === "uz" ? "O'chirish" : "Удалить"}
                  </button>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {lang === "uz" ? "Maksimal 2MB" : "Максимум 2MB"}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  {lang === "uz" ? "Ism *" : "Имя *"}
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  {lang === "uz"
                    ? "Familiya / Otasining ismi"
                    : "Фамилия / Отчество"}
                </label>
                <input
                  type="text"
                  placeholder={
                    lang === "uz" ? "To'liq ism familiya" : "Полное имя"
                  }
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">
                    <School size={12} className="inline mr-1" />
                    {lang === "uz" ? "Maktab" : "Школа"}
                  </label>
                  <input
                    type="text"
                    value={profile.school}
                    onChange={(e) =>
                      setProfile({ ...profile, school: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">
                    <Calendar size={12} className="inline mr-1" />
                    {lang === "uz" ? "Yosh" : "Возраст"}
                  </label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) =>
                      setProfile({ ...profile, age: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                    min={1}
                    max={100}
                  />
                </div>
              </div>

              {currentUser.is_disabled && (
                <>
                  <div>
                    <label className="text-xs font-bold text-rose-600 mb-1 block">
                      <CreditCard size={12} className="inline mr-1" />
                      {lang === "uz" ? "Karta raqami" : "Номер карты"}
                    </label>
                    <input
                      type="text"
                      value={profile.card_number}
                      onChange={(e) =>
                        setProfile({ ...profile, card_number: e.target.value })
                      }
                      className="w-full border-2 border-rose-200 bg-rose-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-rose-600 mb-1 block">
                      <Heart size={12} className="inline mr-1" />
                      {lang === "uz"
                        ? "Kasallik haqida ma'lumot"
                        : "Информация о заболевании"}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={
                        lang === "uz"
                          ? "Qanaqa kasallik, qanday yordam kerak va h.k."
                          : "Какое заболевание, какая помощь нужна и т.д."
                      }
                      value={profile.illness_info}
                      onChange={(e) =>
                        setProfile({ ...profile, illness_info: e.target.value })
                      }
                      className="w-full border-2 border-rose-200 bg-rose-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-500"
                    />
                  </div>
                </>
              )}

              <button
                onClick={handleSaveProfile}
                disabled={profileSaving}
                className="w-full flex items-center justify-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white py-3 rounded-xl font-black text-sm transition disabled:opacity-50 mt-4"
              >
                <Save size={15} />
                {profileSaving
                  ? lang === "uz"
                    ? "Saqlanyapti..."
                    : "Сохранение..."
                  : lang === "uz"
                  ? "Saqlash"
                  : "Сохранить"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Product Form Modal ─────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-black text-lg">
                {editId
                  ? lang === "uz"
                    ? "Mahsulotni tahrirlash"
                    : "Изменить товар"
                  : lang === "uz"
                  ? "Yangi mahsulot qo'shish"
                  : "Добавить новый товар"}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2">
                  {error}
                </div>
              )}

              {/* Image upload */}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  {lang === "uz" ? "Mahsulot rasmi *" : "Изображение товара *"}
                </label>
                <div className="flex items-start gap-3">
                  <div className="w-32 h-32 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300 flex-shrink-0">
                    {form.image ? (
                      <img
                        src={form.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload size={30} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="flex items-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white px-4 py-2 rounded-lg text-sm font-bold transition"
                    >
                      <Upload size={14} />
                      {form.image
                        ? lang === "uz"
                          ? "O'zgartirish"
                          : "Изменить"
                        : lang === "uz"
                        ? "Rasm tanlash"
                        : "Выбрать файл"}
                    </button>
                    {form.image && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: "" })}
                        className="ml-2 text-red-500 text-xs hover:underline"
                      >
                        {lang === "uz" ? "O'chirish" : "Удалить"}
                      </button>
                    )}
                    <div className="text-xs text-gray-400 mt-2">
                      {lang === "uz"
                        ? "JPG, PNG. Maksimal 5MB"
                        : "JPG, PNG. Максимум 5MB"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Nom (UZ) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nameUz}
                    onChange={(e) =>
                      setForm({ ...form, nameUz: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Nom (RU)
                  </label>
                  <input
                    type="text"
                    value={form.nameRu}
                    onChange={(e) =>
                      setForm({ ...form, nameRu: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Tavsif (UZ)
                  </label>
                  <textarea
                    rows={2}
                    value={form.descUz}
                    onChange={(e) =>
                      setForm({ ...form, descUz: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Tavsif (RU)
                  </label>
                  <textarea
                    rows={2}
                    value={form.descRu}
                    onChange={(e) =>
                      setForm({ ...form, descRu: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Narx (so'm) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Soni
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Kategoriya
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white"
                  >
                    {Object.entries(cats)
                      .filter(([k]) => k !== "all")
                      .map(([k, label]) => (
                        <option key={k} value={k}>
                          {label}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Badge
                  </label>
                  <select
                    value={form.badge}
                    onChange={(e) =>
                      setForm({ ...form, badge: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white"
                  >
                    <option value="">—</option>
                    <option value="new">NEW</option>
                    <option value="hit">HIT</option>
                    <option value="sale">SALE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Sinf
                  </label>
                  <input
                    type="text"
                    value={form.grade}
                    onChange={(e) =>
                      setForm({ ...form, grade: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Tuman
                  </label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) =>
                      setForm({ ...form, district: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    Viloyat
                  </label>
                  <input
                    type="text"
                    value={form.region}
                    onChange={(e) =>
                      setForm({ ...form, region: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm transition"
                >
                  {lang === "uz" ? "Bekor" : "Отмена"}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white py-3 rounded-xl font-black text-sm transition disabled:opacity-50"
                >
                  {saving ? (
                    "..."
                  ) : (
                    <>
                      <Check size={16} />{" "}
                      {lang === "uz" ? "Saqlash" : "Сохранить"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
