import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingBag, Plus, Edit2, Trash2,
  LogOut, DollarSign, Clock, X, Save, Store, Users, PenTool,
  Eye, EyeOff, Shield, UserCheck, UserX, Key, RefreshCw, Loader2
} from 'lucide-react'
import { useLangStore, useAuthStore, useProductStore, useOrderStore, useUsersStore, useCustomOrderStore } from '../store'
import { categories } from '../data/products'
import toast from 'react-hot-toast'

const defaultForm = {
  name_uz: '', name_ru: '', desc_uz: '', desc_ru: '',
  price: '', stock: '', category: 'paintings',
  author: '', class_uz: '', class_ru: '', image: '', isNew: false,
  school: '', district: '', phone: ''
}
const defaultUserForm = {
  name: '', username: '', email: '', password: '', role: 'user'
}

export default function AdminDashboardPage() {
  const { lang, t } = useLangStore()
  const { logout, user: currentUser } = useAuthStore()
  const { products, addProduct, updateProduct, deleteProduct, fetchProducts, loading } = useProductStore()
  const { orders, updateStatus, getStats, fetchOrders } = useOrderStore()
  const { users, addUser, updateUser, deleteUser, toggleActive } = useUsersStore()
  const { customOrders, updateCustomStatus, fetchCustomOrders } = useCustomOrderStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
    fetchOrders()
    fetchCustomOrders()
  }, [])

  const [tab, setTab] = useState('dashboard')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [confirmDel, setConfirmDel] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  // User form states
  const [showUserForm, setShowUserForm] = useState(false)
  const [editUserId, setEditUserId] = useState(null)
  const [userForm, setUserForm] = useState(defaultUserForm)
  const [showPwd, setShowPwd] = useState(false)
  const [confirmDelUser, setConfirmDelUser] = useState(null)

  const stats = getStats()
  const fmt = p => p.toLocaleString('uz-UZ')

  const catLabel = (id) => {
    const c = categories.find(c => c.id === id)
    return c ? (lang === 'uz' ? c.label_uz : c.label_ru) : id
  }

  const handleLogout = () => {
    logout(); navigate('/admin')
    toast.success(lang === 'uz' ? 'Chiqildi!' : 'Вышли!')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
      setForm(prev => ({ ...prev, image: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const openAdd = () => { setForm(defaultForm); setEditId(null); setImagePreview(''); setShowForm(true) }
  const openEdit = (p) => {
    setForm({ ...p, price: String(p.price), stock: String(p.stock) })
    setEditId(p.id); setImagePreview(p.image || ''); setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name_uz || !form.price) {
      toast.error(lang === 'uz' ? "Majburiy maydonlarni to'ldiring" : 'Заполните обязательные поля')
      return
    }
    const data = { ...form, price: Number(form.price), stock: Number(form.stock) }
    if (editId) { await updateProduct(editId, data); toast.success('Yangilandi!') }
    else { await addProduct(data); toast.success("Qo'shildi!") }
    setShowForm(false); setEditId(null)
    fetchProducts()
  }

  const handleDelete = async (id) => { await deleteProduct(id); setConfirmDel(null); toast.success("O'chirildi!"); fetchProducts() }

  // User handlers
  const openAddUser = () => { setUserForm(defaultUserForm); setEditUserId(null); setShowUserForm(true) }
  const openEditUser = (u) => {
    setUserForm({ name: u.name, username: u.username, email: u.email || '', password: u.password, role: u.role })
    setEditUserId(u.id); setShowUserForm(true)
  }
  const handleSaveUser = () => {
    if (!userForm.name || !userForm.username || !userForm.password) {
      toast.error(lang === 'uz' ? "Ism, username va parol majburiy" : 'Имя, логин и пароль обязательны')
      return
    }
    if (editUserId) {
      updateUser(editUserId, userForm)
      toast.success(lang === 'uz' ? 'Foydalanuvchi yangilandi!' : 'Пользователь обновлён!')
    } else {
      const res = addUser(userForm)
      if (res.error) { toast.error(res.error); return }
      toast.success(lang === 'uz' ? "Foydalanuvchi qo'shildi!" : 'Пользователь добавлен!')
    }
    setShowUserForm(false); setEditUserId(null)
  }
  const handleDeleteUser = (id) => { deleteUser(id); setConfirmDelUser(null); toast.success("O'chirildi!") }

  const statusColors = { new: 'bg-blue-100 text-blue-700', processing: 'bg-amber-100 text-amber-700', done: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' }
  const statusLabels = { new:{uz:'Yangi',ru:'Новый'}, processing:{uz:'Jarayonda',ru:'В обработке'}, done:{uz:'Bajarildi',ru:'Выполнен'}, cancelled:{uz:'Bekor',ru:'Отменён'} }
  const roleColors = { admin: 'bg-purple-100 text-purple-700', user: 'bg-blue-100 text-blue-700' }

  const tabs = [
    { id:'dashboard', icon:<LayoutDashboard className="w-4 h-4"/>, label: lang==='uz'?'Dashboard':'Дашборд' },
    { id:'products',  icon:<Package className="w-4 h-4"/>, label: lang==='uz'?'Mahsulotlar':'Товары' },
    { id:'orders',    icon:<ShoppingBag className="w-4 h-4"/>, label: lang==='uz'?'Buyurtmalar':'Заказы' },
    ...((!currentUser || currentUser?.role === 'admin' || !currentUser?.role) ? [{ id:'users', icon:<Users className="w-4 h-4"/>, label: lang==='uz'?'Foydalanuvchilar':'Пользователи' }] : []),
    { id:'customorders', icon:<PenTool className="w-4 h-4"/>, label: <span className='flex items-center gap-1.5'>{lang==='uz'?'📝 Maxsus buyurtmalar':'📝 Спец. заказы'}{customOrders.length > 0 && <span className='bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black'>{customOrders.length}</span>}</span> },

  ]



  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4c1d95] flex items-center justify-center shadow-lg">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#4c1d95] font-serif">{t('admin_title')}</h1>
              <p className="text-xs text-gray-400">Yosh Ijodkor</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4" /> {t('admin_logout')}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit">
          {tabs.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === tb.id ? 'bg-[#4c1d95] text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {tb.icon} {tb.label}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {[
                { label: lang==='uz'?'Mahsulotlar':'Товары', value: products.length, icon:<Package className="w-6 h-6"/>, color:'from-violet-400 to-purple-600' },
                { label: lang==='uz'?'Buyurtmalar':'Заказы', value: stats.total, icon:<ShoppingBag className="w-6 h-6"/>, color:'from-blue-400 to-indigo-600' },
                ...( (!currentUser || currentUser?.role === 'admin' || !currentUser?.role) ? [{ label: lang==='uz'?'Foydalanuvchilar':'Пользователи', value: users.length, icon:<Users className="w-6 h-6"/>, color:'from-emerald-400 to-teal-600' }] : []),
                { label: lang==='uz'?'Daromad':'Доход', value: fmt(stats.revenue)+' '+t('sum'), icon:<DollarSign className="w-6 h-6"/>, color:'from-[#4c1d95] to-[#7c3aed]' },
              ].map((s,i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                    {s.icon}
                  </div>
                  <p className="text-2xl font-black text-[#1e1b2e]">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            {/* Recent orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-[#4c1d95] font-serif">{lang==='uz'?"So'nggi buyurtmalar":'Последние заказы'}</h3>
                <button onClick={() => setTab('orders')} className="text-sm text-[#7c3aed] font-semibold">{t('show_more')}</button>
              </div>
              {orders.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>{lang==='uz'?"Buyurtmalar yo'q":'Нет заказов'}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {orders.slice(0,5).map(o => (
                    <div key={o.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{o.name}</p>
                        <p className="text-xs text-gray-400">{o.phone} • {o.id}</p>
                      </div>
                      <p className="text-sm font-black text-[#4c1d95]">{fmt(o.total)} {t('sum')}</p>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[o.status]}`}>
                        {statusLabels[o.status][lang]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">{loading && <Loader2 className="w-4 h-4 inline animate-spin mr-1"/>}{products.length} {lang==='uz'?'ta mahsulot':'товаров'}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => { fetchProducts(); toast.success('Yangilandi!') }}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl transition-all text-sm">
                  <RefreshCw className={`w-4 h-4 ${loading?'animate-spin':''}`}/> {lang==='uz'?'Yangilash':'Обновить'}
                </button>
                <button onClick={openAdd}
                  className="flex items-center gap-2 bg-[#4c1d95] hover:bg-[#5b21b6] text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-[#4c1d95]/20">
                  <Plus className="w-4 h-4" /> {t('admin_add_product')}
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-3.5 font-bold text-gray-600">{lang==='uz'?'Mahsulot':'Товар'}</th>
                      <th className="text-left px-5 py-3.5 font-bold text-gray-600 hidden sm:table-cell">{lang==='uz'?'Toifa':'Категория'}</th>
                      <th className="text-left px-5 py-3.5 font-bold text-gray-600">{lang==='uz'?'Narx':'Цена'}</th>
                      <th className="text-left px-5 py-3.5 font-bold text-gray-600 hidden md:table-cell">{lang==='uz'?'Ombor':'Склад'}</th>
                      <th className="text-right px-5 py-3.5 font-bold text-gray-600">{lang==='uz'?'Amal':'Действие'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-800 line-clamp-1">{lang==='uz'?p.name_uz:p.name_ru}</p>
                              <p className="text-xs text-gray-400">{p.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <span className="px-2.5 py-1 bg-[#ede9fe] rounded-lg text-xs font-semibold text-[#4c1d95]">{catLabel(p.category)}</span>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-[#4c1d95]">{fmt(p.price)} {t('sum')}</td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className={`font-bold ${p.stock===0?'text-red-500':p.stock<=3?'text-amber-500':'text-green-600'}`}>{p.stock}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit2 className="w-4 h-4"/></button>
                            <button onClick={() => setConfirmDel(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4"/></button>
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

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {orders.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                <p>{lang==='uz'?"Buyurtmalar yo'q":'Нет заказов'}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {orders.map(o => (
                  <div key={o.id} className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-black text-[#1e1b2e]">{o.name}</p>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[o.status]}`}>{statusLabels[o.status][lang]}</span>
                        </div>
                        <p className="text-sm text-gray-500">{o.phone} • {o.address}</p>
                        <p className="text-xs text-gray-400 mt-1">{o.id} • {new Date(o.createdAt).toLocaleString('uz-UZ')}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {o.items?.map((item,i) => (
                            <span key={i} className="text-xs bg-[#ede9fe] px-2.5 py-1 rounded-lg text-[#4c1d95] font-semibold">
                              {lang==='uz'?item.name_uz:item.name_ru} ×{item.qty}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-[#4c1d95]">{fmt(o.total)} {t('sum')}</p>
                        <p className="text-xs text-gray-400 mb-2">{o.payment}</p>
                        <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                          className="text-xs font-bold border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-[#4c1d95]">
                          <option value="new">{statusLabels.new[lang]}</option>
                          <option value="processing">{statusLabels.processing[lang]}</option>
                          <option value="done">{statusLabels.done[lang]}</option>
                          <option value="cancelled">{statusLabels.cancelled[lang]}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">{users.length} {lang==='uz'?'ta foydalanuvchi':'пользователей'}</p>
              <button onClick={openAddUser}
                className="flex items-center gap-2 bg-[#4c1d95] hover:bg-[#5b21b6] text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-[#4c1d95]/20">
                <Plus className="w-4 h-4" />
                {lang==='uz'?"Foydalanuvchi qo'shish":'Добавить пользователя'}
              </button>
            </div>

            <div className="grid gap-4">
              {users.map(u => (
                <div key={u.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#7c3aed] flex items-center justify-center text-white font-black text-lg shadow-lg">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-black text-[#1e1b2e]">{u.name}</p>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${roleColors[u.role]}`}>
                          {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                        </span>
                        {!u.active && (
                          <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-red-100 text-red-600">
                            {lang==='uz'?'Bloklangan':'Заблокирован'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Key className="w-3 h-3" />
                        @{u.username}
                        {u.email && <span>• {u.email}</span>}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {lang==='uz'?"Qo'shilgan":'Добавлен'}: {new Date(u.createdAt).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Toggle active */}
                    <button onClick={() => toggleActive(u.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        u.active
                          ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600'
                          : 'bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-700'
                      }`}>
                      {u.active ? <UserCheck className="w-3.5 h-3.5"/> : <UserX className="w-3.5 h-3.5"/>}
                      {u.active
                        ? (lang==='uz'?'Faol':'Активен')
                        : (lang==='uz'?'Bloklangan':'Заблокирован')}
                    </button>
                    <button onClick={() => openEditUser(u)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                      <Edit2 className="w-4 h-4"/>
                    </button>
                    {u.id !== 1 && (
                      <button onClick={() => setConfirmDelUser(u.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

        {/* ── CUSTOM ORDERS ── */}
        {tab === 'customorders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {customOrders.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                <p>{lang==='uz'?"Maxsus buyurtmalar yo'q":'Нет специальных заказов'}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {customOrders.map(o => (
                  <div key={o.id} className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <p className="font-black text-[#1e1b2e]">{o.name || '—'}</p>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[o.status] || 'bg-gray-100 text-gray-600'}`}>
                            {statusLabels[o.status]?.[lang] || o.status}
                          </span>
                          {o.type && <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#ede9fe] text-[#4c1d95]">{o.type}</span>}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-2 max-w-xl">{o.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                          {o.phone && <span>📞 {o.phone}</span>}
                          {o.budget && <span>💰 {['b1','b2','b3','b4'].includes(o.budget) ? {b1:'50–100K',b2:'100–300K',b3:'300–500K',b4:'500K+'}[o.budget] : o.budget} so'm</span>}
                          {o.deadline && <span>📅 {o.deadline}</span>}
                          {o.address && <span>📍 {o.address}</span>}
                          <span>🕐 {new Date(o.createdAt).toLocaleString('uz-UZ')}</span>
                        </div>
                        {o.file && (
                          <div className="mt-3">
                            <img src={o.file} alt="reference" className="h-24 rounded-xl object-cover border border-gray-200"/>
                          </div>
                        )}
                      </div>
                      <div className="shrink-0">
                        <select value={o.status} onChange={e => updateCustomStatus(o.id, e.target.value)}
                          className="text-xs font-bold border-2 border-[#4c1d95]/20 rounded-xl px-3 py-2 outline-none focus:border-[#4c1d95] bg-white">
                          <option value="new">{lang==='uz'?'Yangi':'Новый'}</option>
                          <option value="processing">{lang==='uz'?'Jarayonda':'В работе'}</option>
                          <option value="done">{lang==='uz'?'Bajarildi':'Выполнен'}</option>
                          <option value="cancelled">{lang==='uz'?'Bekor':'Отменён'}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      {/* ── PRODUCT FORM MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 z-10">
              <h2 className="font-black text-[#4c1d95] text-lg font-serif">
                {editId ? t('admin_edit') : t('admin_add_product')}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-500"/>
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {key:'name_uz',label:"Nomi (O'zbek)"},
                {key:'name_ru',label:'Название (Рус)'},
                {key:'author',label:t('admin_product_author')},
                {key:'price',label:t('admin_product_price'),type:'number'},
                {key:'stock',label:t('admin_product_stock'),type:'number'},
                {key:'class_uz',label:"Sinf (O'zbek)"},
                {key:'class_ru',label:'Класс (Рус)'},
                {key:'school', label: lang==='uz'?'Maktab raqami':'Номер школы'},
                {key:'district', label: lang==='uz'?'Tuman / Shahar':'Район / Город'},
                {key:'phone', label: lang==='uz'?'Telefon raqam':'Телефон'},
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-gray-600 mb-1">{f.label}</label>
                  <input type={f.type||'text'} value={form[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#4c1d95] outline-none text-sm transition-colors"/>
                </div>
              ))}

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t('admin_product_category')}</label>
                <select value={form.category} onChange={e => setForm({...form,category:e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#4c1d95] outline-none text-sm">
                  {categories.map(c => <option key={c.id} value={c.id}>{catLabel(c.id)}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="isNew" checked={form.isNew} onChange={e => setForm({...form,isNew:e.target.checked})}
                  className="w-5 h-5 accent-[#4c1d95] rounded"/>
                <label htmlFor="isNew" className="text-sm font-bold text-gray-700">
                  {lang==='uz'?"Yangi mahsulot?":"Новый товар?"}
                </label>
              </div>

              {/* Image upload */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  {lang==='uz'?'Mahsulot rasmi':'Фото товара'}
                </label>
                <div className="flex items-start gap-4">
                  <div className="w-28 h-28 rounded-xl border-2 border-dashed border-[#4c1d95]/20 overflow-hidden flex items-center justify-center bg-[#faf9ff] shrink-0">
                    {(imagePreview||form.image) ? (
                      <img src={imagePreview||form.image} alt="" className="w-full h-full object-cover"/>
                    ) : (
                      <div className="text-center p-2">
                        <div className="text-3xl mb-1">🖼️</div>
                        <p className="text-xs text-gray-400">{lang==='uz'?"Rasm yo'q":'Нет фото'}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="flex items-center justify-center gap-2 cursor-pointer bg-[#4c1d95] hover:bg-[#5b21b6] text-white text-sm font-bold px-4 py-3 rounded-xl transition-colors w-full">
                      <Package className="w-4 h-4"/>
                      {lang==='uz'?'📁 Rasm tanlash':'📁 Выбрать фото'}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
                    </label>
                    <p className="text-xs text-gray-400 text-center">JPG, PNG, WEBP — max 5MB</p>
                    <div>
                      <p className="text-xs text-gray-400 text-center mb-1">{lang==='uz'?'yoki URL kiriting':'или введите URL'}</p>
                      <input type="text" placeholder="https://..."
                        value={form.image.startsWith('data:')?'':form.image}
                        onChange={e => {setForm({...form,image:e.target.value});setImagePreview(e.target.value)}}
                        className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-[#4c1d95] outline-none text-xs transition-colors"/>
                    </div>
                  </div>
                </div>
              </div>

              {[{key:'desc_uz',label:"Tavsif (O'zbek)"},{key:'desc_ru',label:'Описание (Рус)'}].map(f => (
                <div key={f.key} className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">{f.label}</label>
                  <textarea value={form[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})}
                    rows={3} className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#4c1d95] outline-none text-sm resize-none transition-colors"/>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 bg-[#4c1d95] hover:bg-[#5b21b6] text-white font-black py-3 rounded-xl transition-all shadow-lg">
                <Save className="w-4 h-4"/> {t('admin_save')}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors">
                {t('admin_cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── USER FORM MODAL ── */}
      {showUserForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-[#4c1d95] text-lg font-serif flex items-center gap-2">
                <Users className="w-5 h-5"/>
                {editUserId
                  ? (lang==='uz'?'Foydalanuvchini tahrirlash':'Редактировать пользователя')
                  : (lang==='uz'?"Yangi foydalanuvchi":'Новый пользователь')}
              </h2>
              <button onClick={() => setShowUserForm(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-500"/>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{lang==='uz'?"To'liq ism":'Полное имя'}</label>
                <input type="text" value={userForm.name} placeholder={lang==='uz'?"Ism Familiya":'Имя Фамилия'}
                  onChange={e => setUserForm(prev => ({...prev, name: e.target.value}))}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#4c1d95] outline-none text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Username (login)</label>
                <input type="text" value={userForm.username} placeholder="example123"
                  onChange={e => setUserForm(prev => ({...prev, username: e.target.value}))}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#4c1d95] outline-none text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Email</label>
                <input type="email" value={userForm.email} placeholder="email@mail.com"
                  onChange={e => setUserForm(prev => ({...prev, email: e.target.value}))}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#4c1d95] outline-none text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{lang==='uz'?'Parol':'Пароль'}</label>
                <div className="relative">
                  <input type={showPwd?'text':'password'} value={userForm.password}
                    onChange={e => setUserForm(prev => ({...prev, password: e.target.value}))}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 pr-10 rounded-xl border-2 border-gray-200 focus:border-[#4c1d95] outline-none text-sm transition-colors"/>
                  <button onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPwd ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{lang==='uz'?'Rol':'Роль'}</label>
                <div className="flex gap-3">
                  {[{v:'user',icon:'👤',uz:'Foydalanuvchi',ru:'Пользователь'},{v:'admin',icon:'👑',uz:'Admin',ru:'Администратор'}].map(r => (
                    <button key={r.v} onClick={() => setUserForm(prev => ({...prev, role: r.v}))}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                        userForm.role===r.v
                          ? 'border-[#4c1d95] bg-[#ede9fe] text-[#4c1d95]'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>
                      {r.icon} {lang==='uz'?r.uz:r.ru}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={handleSaveUser}
                className="flex-1 flex items-center justify-center gap-2 bg-[#4c1d95] hover:bg-[#5b21b6] text-white font-black py-3.5 rounded-xl transition-all shadow-lg">
                <Save className="w-4 h-4"/>
                {editUserId ? t('admin_save') : (lang==='uz'?"Qo'shish":'Добавить')}
              </button>
              <button onClick={() => setShowUserForm(false)}
                className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl">
                {t('admin_cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE PRODUCT CONFIRM ── */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500"/>
            </div>
            <p className="font-black text-[#1e1b2e] text-lg mb-2 font-serif">{t('confirm_delete')}</p>
            <p className="text-gray-500 text-sm mb-6">{lang==='uz'?"Bu amalni bekor qilib bo'lmaydi.":'Это действие нельзя отменить.'}</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDel)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl">{t('yes')}</button>
              <button onClick={() => setConfirmDel(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl">{t('no')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE USER CONFIRM ── */}
      {confirmDelUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX className="w-7 h-7 text-red-500"/>
            </div>
            <p className="font-black text-[#1e1b2e] text-lg mb-2 font-serif">
              {lang==='uz'?"Foydalanuvchini o'chirish?":'Удалить пользователя?'}
            </p>
            <p className="text-gray-500 text-sm mb-6">{lang==='uz'?"Bu amalni bekor qilib bo'lmaydi.":'Это действие нельзя отменить.'}</p>
            <div className="flex gap-3">
              <button onClick={() => handleDeleteUser(confirmDelUser)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl">{t('yes')}</button>
              <button onClick={() => setConfirmDelUser(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl">{t('no')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
