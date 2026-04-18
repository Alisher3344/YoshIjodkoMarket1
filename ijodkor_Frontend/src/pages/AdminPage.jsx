import { useState, useEffect } from "react";
import { categoryLabels } from "../components/ui/data/translations";
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
  Eye,
  EyeOff,
} from "lucide-react";
import useStore from "../store/useStore";

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
  } = useStore();

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginErr, setLoginErr] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [userForm, setUserForm] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    role: "admin",
  });

  useEffect(() => {
    if (adminLoggedIn) {
      fetchProducts();
      fetchOrders();
      fetchCustomOrders();
      fetchUsers();
    }
  }, [adminLoggedIn]);

  // ── Login ────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await adminLogin(loginForm.username, loginForm.password);
    if (!ok) {
      setLoginErr(true);
      setTimeout(() => setLoginErr(false), 2000);
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
        username: "",
        password: "",
        email: "",
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm border border-gray-100">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔐</div>
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
      label: lang === "uz" ? "Foydalanuvchilar" : "Пользователи",
    },
  ];

  // ── Dashboard ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-sm border-r border-gray-100 flex flex-col fixed h-full z-10">
        <div className="p-5 border-b">
          <div className="font-black text-lg text-[#1a56db]">🎨 Admin</div>
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

        <div className="p-3 border-t">
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
                <div className="text-5xl mb-4">📦</div>
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
                <div className="text-5xl mb-4">🛒</div>
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
                <div className="text-5xl mb-4">🎨</div>
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

        {/* ── FOYDALANUVCHILAR ── */}
        {tab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black text-gray-900">
                {lang === "uz" ? "Foydalanuvchilar" : "Пользователи"}
              </h1>
              <button
                onClick={() => {
                  setUserForm({
                    name: "",
                    username: "",
                    password: "",
                    email: "",
                    role: "admin",
                  });
                  setEditUserId(null);
                  setShowUserForm(true);
                }}
                className="flex items-center gap-2 bg-[#1a56db] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1341a8] transition"
              >
                <Plus size={18} /> {lang === "uz" ? "Qo'shish" : "Добавить"}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {users.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <div className="text-5xl mb-4">👥</div>
                  <p>
                    {lang === "uz"
                      ? "Foydalanuvchilar yo'q"
                      : "Нет пользователей"}
                  </p>
                </div>
              ) : (
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
                    {users.map((u) => (
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
                                  username: u.username,
                                  email: u.email || "",
                                  role: u.role,
                                  password: "",
                                });
                                setEditUserId(u.id);
                                setShowUserForm(true);
                              }}
                              className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-500 transition"
                            >
                              {u.active ? (
                                <EyeOff size={15} />
                              ) : (
                                <Eye size={15} />
                              )}
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
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
              )}
            </div>
          </div>
        )}
      </main>

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
                    ? "Foydalanuvchini tahrirlash"
                    : "Редактировать пользователя"
                  : lang === "uz"
                  ? "Yangi foydalanuvchi"
                  : "Новый пользователь"}
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
                { key: "username", label: "Username *", type: "text" },
                { key: "email", label: "Email", type: "email" },
                {
                  key: "password",
                  label:
                    lang === "uz"
                      ? "Parol (o'zgartirish uchun)"
                      : "Пароль (для изменения)",
                  type: "password",
                },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={userForm[field.key] || ""}
                    onChange={(e) =>
                      setUserForm({ ...userForm, [field.key]: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Rol
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1a56db] bg-white"
                >
                  <option value="viewer">viewer</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                  <option value="superadmin">superadmin</option>
                </select>
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
