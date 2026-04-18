import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, BarChart2, Plus, Edit2, Trash2, LogOut, X, Check, Users } from 'lucide-react';
import useStore from '../store/useStore';
import { products as seedProducts } from '../data/products';
import { categoryLabels } from '../data/translations';
import UsersPage from './UsersPage';

const EMPTY_FORM = {
  nameUz: '', nameRu: '', descUz: '', descRu: '',
  price: '', oldPrice: '', category: 'paintings',
  author: '', authorRu: '', school: '', schoolRu: '',
  region: 'Qashqadaryo viloyati', regionRu: 'Кашкадарьинская область',
  district: '', districtRu: '',
  grade: '', stock: '', badge: '', image: '',
  studentType: 'normal',
  cardNumber: '', storyUz: '', storyRu: '',
};

export default function AdminPage() {
  const { t, lang, adminLoggedIn, adminLogin, adminLogout, changeAdminPassword,
          customProducts, products: apiProducts, fetchProducts, addProduct, editProduct, deleteProduct,
          orders, fetchOrders, updateOrderStatus,
          users, fetchUsers } = useStore();

  useEffect(() => {
    if (adminLoggedIn) {
      fetchProducts();
      fetchOrders();
      fetchUsers();
    }
  }, [adminLoggedIn]);
  const [pass, setPass] = useState('');
  const [passErr, setPassErr] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassChange, setShowPassChange] = useState(false);
  const [passForm, setPassForm] = useState({ old: '', new1: '', new2: '' });
  const [passChangeMsg, setPassChangeMsg] = useState('');

  const allProducts = apiProducts && apiProducts.length > 0 ? apiProducts : [...(customProducts || [])];
  const cats = categoryLabels[lang];

  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await adminLogin(pass);
    if (!ok) {
      setPassErr(true);
      setTimeout(() => setPassErr(false), 2000);
    }
  };

  const handleSave = async () => {
    if (!form.nameUz || !form.price) return;
    if (form.studentType === 'disabled' && !form.photo) {
      alert(lang === 'uz'
        ? "⚠️ Imkoniyati cheklangan o'quvchi rasmi majburiy!"
        : "⚠️ Фото ученика с ограниченными возможностями обязательно!");
      return;
    }
    const data = {
      ...form,
      authorRu: form.authorRu || form.author,
      schoolRu: form.schoolRu || form.school,
      districtRu: form.districtRu || form.district,
      regionRu: form.regionRu || form.region,
      price: parseInt(form.price),
      oldPrice: form.oldPrice ? parseInt(form.oldPrice) : null,
      stock: parseInt(form.stock) || 0,
      rating: 5.0, reviews: 0, sold: 0,
    };
    try {
      if (editId) {
        await editProduct(editId, data);
      } else {
        await addProduct(data);
      }
      await fetchProducts();
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      alert(lang === 'uz' ? 'Xatolik: ' + err.message : 'Ошибка: ' + err.message);
    }
  };

  const handleEdit = (p) => {
    setForm({ ...EMPTY_FORM, ...p, price: String(p.price), oldPrice: String(p.oldPrice || ''), stock: String(p.stock) });
    setEditId(p.id);
    setShowForm(true);
  };

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);

  if (!adminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm border border-gray-100">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔐</div>
            <h1 className="text-2xl font-black text-gray-900">{t('adminLogin')}</h1>
            <p className="text-gray-400 text-sm mt-1">Yoshijodkor.uz</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('password')}</label>
              <input
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-[#1a56db] transition text-sm ${passErr ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                placeholder="••••••••"
                autoFocus
              />
              {passErr && <p className="text-red-500 text-xs mt-1">{lang === 'uz' ? "Parol noto'g'ri" : "Неверный пароль"}</p>}
            </div>
            <button type="submit" className="w-full bg-[#1a56db] hover:bg-[#1341a8] text-white py-3 rounded-xl font-bold transition">
              {t('login')}
            </button>

          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { key: 'dashboard',  icon: <LayoutDashboard size={18}/>, label: t('dashboard') },
    { key: 'products',   icon: <Package size={18}/>,         label: t('products') },
    { key: 'orders',     icon: <ShoppingBag size={18}/>,     label: t('orders') },
    { key: 'users',      icon: <Users size={18}/>,           label: lang === 'uz' ? "Foydalanuvchilar" : "Пользователи" },
    { key: 'statistics', icon: <BarChart2 size={18}/>,       label: t('statistics') },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1a56db] rounded-lg flex items-center justify-center text-white text-sm">🎨</div>
            <div>
              <div className="font-black text-sm text-[#1a56db]">Admin Panel</div>
              <div className="text-[10px] text-gray-400">Yoshijodkor.uz</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                tab === item.key ? 'bg-[#1a56db] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t space-y-1">
          <button
            onClick={() => setShowPassChange(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition font-medium"
          >
            🔑 {lang === 'uz' ? "Parol o'zgartirish" : "Сменить пароль"}
          </button>
          <button
            onClick={adminLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition font-medium"
          >
            <LogOut size={16}/>
            {lang === 'uz' ? "Chiqish" : "Выйти"}
          </button>
        </div>

        {/* Parol o'zgartirish modal */}
        {showPassChange && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl fade-in">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-lg">
                  🔑 {lang === 'uz' ? "Parol o'zgartirish" : "Смена пароля"}
                </h2>
                <button onClick={() => { setShowPassChange(false); setPassForm({ old: '', new1: '', new2: '' }); setPassChangeMsg(''); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"><X size={18}/></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {lang === 'uz' ? "Joriy parol" : "Текущий пароль"}
                  </label>
                  <input type="password" value={passForm.old} onChange={e => setPassForm({...passForm, old: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                    placeholder="••••••••"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {lang === 'uz' ? "Yangi parol" : "Новый пароль"}
                  </label>
                  <input type="password" value={passForm.new1} onChange={e => setPassForm({...passForm, new1: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                    placeholder="••••••••"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {lang === 'uz' ? "Yangi parolni tasdiqlang" : "Подтвердите новый пароль"}
                  </label>
                  <input type="password" value={passForm.new2} onChange={e => setPassForm({...passForm, new2: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a56db]"
                    placeholder="••••••••"/>
                </div>
                {passChangeMsg && (
                  <p className={`text-xs font-semibold px-3 py-2 rounded-lg ${passChangeMsg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {passChangeMsg}
                  </p>
                )}
                <button
                  onClick={() => {
                    if (!passForm.old || !passForm.new1 || !passForm.new2) {
                      setPassChangeMsg(lang === 'uz' ? '❌ Barcha maydonlarni to\'ldiring' : '❌ Заполните все поля'); return;
                    }
                    if (passForm.new1 !== passForm.new2) {
                      setPassChangeMsg(lang === 'uz' ? '❌ Yangi parollar mos kelmadi' : '❌ Пароли не совпадают'); return;
                    }
                    if (passForm.new1.length < 4) {
                      setPassChangeMsg(lang === 'uz' ? '❌ Parol kamida 4 ta belgi bo\'lsin' : '❌ Пароль должен быть не менее 4 символов'); return;
                    }
                    const ok = changeAdminPassword(passForm.old, passForm.new1);
                    if (ok) {
                      setPassChangeMsg(lang === 'uz' ? '✅ Parol muvaffaqiyatli o\'zgartirildi!' : '✅ Пароль успешно изменён!');
                      setPassForm({ old: '', new1: '', new2: '' });
                      setTimeout(() => { setShowPassChange(false); setPassChangeMsg(''); }, 2000);
                    } else {
                      setPassChangeMsg(lang === 'uz' ? '❌ Joriy parol noto\'g\'ri' : '❌ Неверный текущий пароль');
                    }
                  }}
                  className="w-full bg-[#1a56db] text-white py-3 rounded-xl font-bold hover:bg-[#1341a8] transition"
                >
                  {lang === 'uz' ? "O'zgartirish" : "Изменить"}
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Mobile nav */}
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex gap-2 overflow-x-auto">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                tab === item.key ? 'bg-[#1a56db] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <button onClick={adminLogout} className="ml-auto flex items-center gap-1 text-red-500 text-xs font-bold px-2">
            <LogOut size={14}/> {lang === 'uz' ? "Chiq" : "Выйти"}
          </button>
        </div>

        <div className="p-6">
          {/* Dashboard */}
          {tab === 'dashboard' && (
            <div className="fade-in">
              <h1 className="text-2xl font-black text-gray-900 mb-6">{t('dashboard')}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: t('totalProducts'), value: allProducts.length, icon: '📦', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                  { label: t('totalOrders'), value: orders.length, icon: '🛒', color: 'bg-purple-50 text-purple-700 border-purple-100' },
                  { label: t('totalSales'), value: totalRevenue.toLocaleString() + " so'm", icon: '💰', color: 'bg-green-50 text-green-700 border-green-100' },
                  { label: lang === 'uz' ? "Kutilmoqda" : "В ожидании", value: orders.filter(o=>o.status==='pending').length, icon: '⏳', color: 'bg-orange-50 text-orange-700 border-orange-100' },
                ].map((stat, i) => (
                  <div key={i} className={`bg-white rounded-2xl p-5 border shadow-sm`}>
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-xl font-black text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500 font-medium mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <h2 className="text-lg font-black text-gray-800 mb-4">{t('recentOrders')}</h2>
              {orders.slice(0, 5).length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  {lang === 'uz' ? "Hali buyurtmalar yo'q" : "Заказов пока нет"}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">ID</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">{lang === 'uz' ? "Mijoz" : "Клиент"}</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">{t('total')}</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">{t('status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-400 text-xs">#{String(order.id).slice(-6)}</td>
                          <td className="px-4 py-3 font-semibold">{order.name}</td>
                          <td className="px-4 py-3 text-[#1a56db] font-bold">{(order.total || 0).toLocaleString()} so'm</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                              {t(order.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Products */}
          {tab === 'products' && (
            <div className="fade-in">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-black text-gray-900">{t('products')}</h1>
                <button
                  onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); }}
                  className="flex items-center gap-2 bg-[#1a56db] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1341a8] transition"
                >
                  <Plus size={16}/>
                  {t('addProduct')}
                </button>
              </div>

              {/* Product form modal */}
              {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl fade-in">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="font-black text-lg">{editId ? t('editProduct') : t('addProduct')}</h2>
                      <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X size={18}/>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">

                      {/* Asosiy maydonlar */}
                      {[
                        { key: 'nameUz', label: "Nomi (O'zbek)", required: true },
                        { key: 'nameRu', label: "Nomi (Rus)" },
                        { key: 'price', label: "Narxi (so'm)", required: true, type: 'number' },
                        { key: 'author', label: "Ism familiya" },
                        { key: 'school', label: "Maktab" },
                        { key: 'district', label: "Tuman" },
                        { key: 'grade', label: "Sinf" },
                        { key: 'stock', label: "Omborda (dona)", type: 'number' },
                      ].map(field => (
                        <div key={field.key}>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">{field.label}{field.required && ' *'}</label>
                          <input
                            type={field.type || 'text'}
                            value={form[field.key]}
                            onChange={e => setForm({...form, [field.key]: e.target.value})}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] transition"
                          />
                        </div>
                      ))}

                      {/* Toifa + Badge */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">{t('category')}</label>
                        <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white">
                          {Object.entries(cats).filter(([k]) => k !== 'all').map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Badge</label>
                        <select value={form.badge} onChange={e => setForm({...form, badge: e.target.value})}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white">
                          <option value="">—</option>
                          <option value="new">{t('new')}</option>
                          <option value="hit">{t('hit')}</option>
                          <option value="sale">{t('sale')}</option>
                        </select>
                      </div>

                      {/* Rasm fayl yuklash */}
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Mahsulot rasmi *</label>
                        <div className="flex items-center gap-3">
                          {form.image && (
                            <img src={form.image} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"/>
                          )}
                          <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-[#1a56db] rounded-xl py-4 cursor-pointer transition bg-gray-50 hover:bg-blue-50">
                            <span className="text-2xl">📁</span>
                            <div className="text-sm text-gray-600">
                              <span className="font-semibold text-[#1a56db]">Fayl tanlash</span>
                              <span className="text-gray-400 text-xs block">JPG, PNG, WEBP</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) => setForm({...form, image: ev.target.result});
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* O'quvchi turi toggle */}
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-2">O'quvchi turi</label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setForm({...form, studentType: 'normal'})}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition flex items-center justify-center gap-2 ${
                              form.studentType === 'normal'
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                            }`}
                          >
                            🌟 {lang === 'uz' ? "Sog'lom o'quvchi" : "Здоровый ученик"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setForm({...form, studentType: 'disabled'})}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition flex items-center justify-center gap-2 ${
                              form.studentType === 'disabled'
                                ? 'bg-rose-500 text-white border-rose-500'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
                            }`}
                          >
                            ❤️ {lang === 'uz' ? "Imkoniyati cheklangan" : "Ограниченные возможности"}
                          </button>
                        </div>
                      </div>

                      {/* Imkoniyati cheklangan uchun qo'shimcha maydonlar */}
                      {form.studentType === 'disabled' && (
                        <>
                          {/* O'quvchi rasmi — MAJBURIY */}
                          <div className="col-span-2">
                            <label className="block text-xs font-semibold text-rose-600 mb-1">
                              O'quvchi rasmi * <span className="text-rose-400 font-normal">(majburiy)</span>
                            </label>
                            <div className="flex items-center gap-3">
                              {form.photo && (
                                <img src={form.photo} alt="" className="w-16 h-16 rounded-xl object-cover border-2 border-rose-300 flex-shrink-0"/>
                              )}
                              <label className={`flex-1 flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-4 cursor-pointer transition ${
                                form.photo ? 'border-rose-300 bg-rose-50' : 'border-rose-400 bg-rose-50 hover:bg-rose-100 animate-pulse'
                              }`}>
                                <span className="text-2xl">🧒</span>
                                <div className="text-sm">
                                  <span className="font-semibold text-rose-600">
                                    {form.photo ? "Rasmni almashtirish" : "O'quvchi rasmini yuklang"}
                                  </span>
                                  <span className="text-rose-400 text-xs block">JPG, PNG, WEBP</span>
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (ev) => setForm({...form, photo: ev.target.result});
                                    reader.readAsDataURL(file);
                                  }}
                                />
                              </label>
                            </div>
                            {!form.photo && (
                              <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                                ⚠️ O'quvchi rasmi kiritilmasa saqlash mumkin emas
                              </p>
                            )}
                          </div>

                          <div className="col-span-2">
                            <label className="block text-xs font-semibold text-rose-600 mb-1">Karta raqami</label>
                            <input
                              type="text"
                              value={form.cardNumber}
                              onChange={e => setForm({...form, cardNumber: e.target.value})}
                              placeholder="8600 0000 0000 0000"
                              className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-rose-400 transition font-mono tracking-widest"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-semibold text-rose-600 mb-1">O'quvchi haqida hikoya (uz)</label>
                            <textarea
                              value={form.storyUz}
                              onChange={e => setForm({...form, storyUz: e.target.value})}
                              rows={2}
                              placeholder="O'quvchining qisqacha hayot hikoyasi..."
                              className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-rose-400 resize-none"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-semibold text-rose-600 mb-1">Hikoya (ru)</label>
                            <textarea
                              value={form.storyRu}
                              onChange={e => setForm({...form, storyRu: e.target.value})}
                              rows={2}
                              placeholder="Краткая история об ученике..."
                              className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-rose-400 resize-none"
                            />
                          </div>
                        </>
                      )}

                      {/* Tavsif */}
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">{t('description')} (uz)</label>
                        <textarea value={form.descUz} onChange={e => setForm({...form, descUz: e.target.value})} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] resize-none"/>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">{t('description')} (ru)</label>
                        <textarea value={form.descRu} onChange={e => setForm({...form, descRu: e.target.value})} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] resize-none"/>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button onClick={handleSave} className="flex-1 bg-[#1a56db] text-white py-3 rounded-xl font-bold hover:bg-[#1341a8] transition flex items-center justify-center gap-2">
                        <Check size={16}/> {t('save')}
                      </button>
                      <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">{lang==='uz'?"Rasm":"Фото"}</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">{t('productName')}</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">{t('category')}</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">{t('price')}</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">{t('stock')}</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProducts.map(p => (
                        <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover"/>
                          </td>
                          <td className="px-4 py-3 font-semibold max-w-40">
                            <div className="line-clamp-1">{lang === 'uz' ? p.nameUz : p.nameRu}</div>
                            <div className="text-xs text-gray-400">{lang === 'uz' ? p.author : p.authorRu}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                              {cats[p.category]}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-[#1a56db]">{p.price.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {customProducts.find(cp => cp.id === p.id) && (
                                <>
                                  <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition">
                                    <Edit2 size={14}/>
                                  </button>
                                  <button onClick={() => deleteProduct(p.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition">
                                    <Trash2 size={14}/>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders */}
          {tab === 'orders' && (
            <div className="fade-in">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-black text-gray-900">{t('orders')}</h1>
                {/* Hisobot statistikasi */}
                <div className="flex gap-3">
                  <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-2 text-center">
                    <div className="text-rose-600 font-black text-base">
                      {orders.reduce((s, o) => s + (o.disabledTotal || 0), 0).toLocaleString()} so'm
                    </div>
                    <div className="text-rose-400 text-xs">{lang === 'uz' ? "Imkoniyati cheklanganlarga" : "Детям с огр. возможностями"}</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-center">
                    <div className="text-[#1a56db] font-black text-base">
                      {orders.reduce((s, o) => s + (o.normalTotal || 0), 0).toLocaleString()} so'm
                    </div>
                    <div className="text-blue-400 text-xs">{lang === 'uz' ? "Oddiy mahsulotlar" : "Обычные товары"}</div>
                  </div>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <div className="text-5xl mb-3">📭</div>
                  {lang === 'uz' ? "Hali buyurtmalar yo'q" : "Заказов пока нет"}
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                      <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                        <div>
                          <div className="font-black text-gray-900">#{String(order.id).slice(-6)} — {order.name}</div>
                          <div className="text-sm text-gray-500">{order.phone} • {order.city}, {order.address}</div>
                          <div className="text-xs text-gray-400 mt-1">{new Date(order.date).toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-[#1a56db] text-lg">{(order.total || 0).toLocaleString()} so'm</div>
                          <div className="flex gap-2 mt-2 flex-wrap justify-end">
                            {['pending', 'confirmed', 'delivered'].map(s => (
                              <button key={s} onClick={() => updateOrderStatus(order.id, s)}
                                className={`text-xs px-2 py-1 rounded-full font-bold transition ${order.status === s ? statusColors[s] : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                                {t(s)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* To'lov taqsimoti */}
                      {(order.disabledTotal > 0 || order.normalTotal > 0) && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {order.normalTotal > 0 && (
                            <div className="bg-blue-50 rounded-xl p-2.5 text-center">
                              <div className="text-xs text-blue-500 font-medium">{lang === 'uz' ? "Oddiy to'lov" : "Обычная оплата"}</div>
                              <div className="font-black text-[#1a56db] text-sm">{(order.normalTotal || 0).toLocaleString()} so'm</div>
                              <div className="text-xs text-blue-400 capitalize">{order.payment}</div>
                            </div>
                          )}
                          {order.disabledTotal > 0 && (
                            <div className="bg-rose-50 rounded-xl p-2.5 text-center">
                              <div className="text-xs text-rose-500 font-medium">❤️ {lang === 'uz' ? "Kartaga o'tkazma" : "Перевод на карту"}</div>
                              <div className="font-black text-rose-600 text-sm">{(order.disabledTotal || 0).toLocaleString()} so'm</div>
                              <div className="text-xs text-rose-400">{lang === 'uz' ? "Bevosita kartaga" : "Напрямую на карту"}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Imkoniyati cheklangan o'quvchilar to'lovi */}
                      {order.disabledItems && order.disabledItems.length > 0 && (
                        <div className="bg-rose-50 rounded-xl p-3 mb-3 border border-rose-100">
                          <p className="text-xs font-black text-rose-600 mb-2">
                            ❤️ {lang === 'uz' ? "Karta orqali to'lovlar:" : "Платежи через карту:"}
                          </p>
                          {order.disabledItems.map((di, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 mb-1 last:mb-0">
                              <div>
                                <div className="text-xs font-bold text-gray-800">{di.author} — {di.school}</div>
                                <div className="text-xs text-gray-500">{di.productName}</div>
                                {di.cardNumber && <div className="text-xs font-mono text-gray-600 mt-0.5">{di.cardNumber}</div>}
                              </div>
                              <div className="text-right">
                                <div className="font-black text-rose-600 text-sm">{(di.amount || 0).toLocaleString()} so'm</div>
                                <button
                                  onClick={() => {
                                    const updated = orders.map(o => o.id === order.id ? {
                                      ...o, disabledItems: o.disabledItems.map((d, i) => i === idx ? {...d, paymentConfirmed: !d.paymentConfirmed} : d)
                                    } : o);
                                    localStorage.setItem('orders', JSON.stringify(updated));
                                    useStore.setState({ orders: updated });
                                  }}
                                  className={`text-xs font-bold px-2 py-1 rounded-full mt-1 transition ${
                                    di.paymentConfirmed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600'
                                  }`}
                                >
                                  {di.paymentConfirmed
                                    ? (lang === 'uz' ? '✓ Tasdiqlandi' : '✓ Подтверждено')
                                    : (lang === 'uz' ? 'Tasdiqlanmagan' : 'Не подтверждено')}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Mahsulotlar */}
                      <div className="flex gap-2 flex-wrap border-t pt-3">
                        {(order.items || []).map(item => (
                          <div key={item.id} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${item.studentType === 'disabled' ? 'bg-rose-50 border border-rose-100' : 'bg-gray-50'}`}>
                            <img src={item.image} alt="" className="w-7 h-7 rounded object-cover"/>
                            <span className="text-xs font-medium">{lang === 'uz' ? item.nameUz : item.nameRu} x{item.qty}</span>
                            {item.studentType === 'disabled' && <span className="text-xs">❤️</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Users */}
          {tab === 'users' && <UsersPage />}

          {/* Statistics */}
          {tab === 'statistics' && (
            <div className="fade-in">
              <h1 className="text-2xl font-black text-gray-900 mb-6">{t('statistics')}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-bold mb-4 text-gray-700">{lang === 'uz' ? "Toifalar bo'yicha" : "По категориям"}</h3>
                  {Object.entries(categoryLabels[lang]).filter(([k])=>k!=='all').map(([key, label]) => {
                    const count = allProducts.filter(p => p.category === key).length;
                    const pct = Math.round(count / allProducts.length * 100);
                    return (
                      <div key={key} className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-600">{label}</span>
                          <span className="font-bold text-gray-800">{count} ({pct}%)</span>
                        </div>
                        <div className="bg-gray-100 rounded-full h-2">
                          <div className="bg-[#1a56db] h-2 rounded-full transition-all" style={{width: `${pct}%`}}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-bold mb-4 text-gray-700">{lang === 'uz' ? "Buyurtmalar holati" : "Статус заказов"}</h3>
                  {['pending', 'confirmed', 'delivered'].map(s => {
                    const count = orders.filter(o => o.status === s).length;
                    const pct = orders.length ? Math.round(count / orders.length * 100) : 0;
                    const colors = { pending: 'bg-yellow-400', confirmed: 'bg-blue-500', delivered: 'bg-green-500' };
                    return (
                      <div key={s} className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-600">{t(s)}</span>
                          <span className="font-bold text-gray-800">{count} ({pct}%)</span>
                        </div>
                        <div className="bg-gray-100 rounded-full h-2">
                          <div className={`${colors[s]} h-2 rounded-full`} style={{width: `${pct}%`}}/>
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-500">{lang === 'uz' ? "Umumiy daromad" : "Общий доход"}</div>
                    <div className="text-2xl font-black text-[#1a56db]">{totalRevenue.toLocaleString()} so'm</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
