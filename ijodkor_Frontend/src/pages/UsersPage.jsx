import { useState } from 'react';
import { X, Check, Edit2, Trash2, Plus, UserCheck, UserX, Search } from 'lucide-react';
import useStore, { ROLES } from '../store/useStore';

const EMPTY_USER = {
  fullName: '', login: '', password: '', role: 'student',
  region: 'Qashqadaryo viloyati', district: '', school: '', phone: '',
};

export default function UsersPage() {
  const { lang, users, addUser, editUser, deleteUser, toggleUserStatus } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_USER);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "To'liq ism majburiy";
    if (!form.login.trim()) e.login = "Login majburiy";
    if (!editId && !form.password.trim()) e.password = "Parol majburiy";
    if (!editId && users.find(u => u.login === form.login)) e.login = "Bu login band";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editId) {
      editUser(editId, form);
    } else {
      addUser(form);
    }
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_USER);
    setErrors({});
  };

  const handleEdit = (u) => {
    setForm({ ...u, password: '' });
    setEditId(u.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (id === 1) return; // admin o'chirilmasin
    if (window.confirm(lang === 'uz' ? "O'chirishni tasdiqlaysizmi?" : "Подтверждаете удаление?")) {
      deleteUser(id);
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.fullName.toLowerCase().includes(q) || u.login.toLowerCase().includes(q) || (u.school || '').toLowerCase().includes(q);
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const roleInfo = (role) => ROLES[role] || ROLES.student;

  const districts = ['Qarshi tumani', 'Shahrisabz tumani', 'Kitob tumani', 'Muborak tumani', 'Nishon tumani', 'Koson tumani', 'Yakkabog\' tumani', 'Chiroqchi tumani', 'Dehqonobod tumani', 'G\'uzor tumani', 'Kasbi tumani', 'Mirishkor tumani'];

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">
          {lang === 'uz' ? "Foydalanuvchilar" : "Пользователи"}
          <span className="ml-2 bg-gray-100 text-gray-600 text-sm font-bold px-2 py-0.5 rounded-full">{users.length}</span>
        </h1>
        <button
          onClick={() => { setForm(EMPTY_USER); setEditId(null); setErrors({}); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#1a56db] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1341a8] transition"
        >
          <Plus size={16}/>
          {lang === 'uz' ? "Foydalanuvchi qo'shish" : "Добавить пользователя"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48">
          <Search size={15} className="text-gray-400"/>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'uz' ? "Qidirish..." : "Поиск..."}
            className="flex-1 text-sm outline-none bg-transparent"
          />
        </div>
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
        >
          <option value="all">{lang === 'uz' ? "Barcha rollar" : "Все роли"}</option>
          {Object.values(ROLES).map(r => (
            <option key={r.key} value={r.key}>{r.icon} {lang === 'uz' ? r.labelUz : r.labelRu}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-5">
        {Object.values(ROLES).map(r => {
          const count = users.filter(u => u.role === r.key).length;
          return (
            <div key={r.key} className={`${r.color} rounded-xl p-2 text-center cursor-pointer hover:opacity-80 transition`} onClick={() => setFilterRole(r.key === filterRole ? 'all' : r.key)}>
              <div className="text-lg">{r.icon}</div>
              <div className="font-black text-base">{count}</div>
              <div className="text-[9px] font-semibold leading-tight">{lang === 'uz' ? r.labelUz : r.labelRu}</div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">{lang === 'uz' ? "Ism" : "Имя"}</th>
                <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">Login</th>
                <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">{lang === 'uz' ? "Rol" : "Роль"}</th>
                <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">{lang === 'uz' ? "Manzil" : "Адрес"}</th>
                <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">{lang === 'uz' ? "Telefon" : "Телефон"}</th>
                <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs">{lang === 'uz' ? "Holat" : "Статус"}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">{lang === 'uz' ? "Foydalanuvchi topilmadi" : "Пользователи не найдены"}</td></tr>
              ) : filtered.map(u => {
                const role = roleInfo(u.role);
                return (
                  <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{u.fullName}</div>
                      {u.school && <div className="text-xs text-gray-400">{u.school}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{u.login}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${role.color}`}>
                        {role.icon} {lang === 'uz' ? role.labelUz : role.labelRu}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-32">
                      <div className="truncate">{[u.district, u.region].filter(Boolean).join(', ') || '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{u.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {u.status === 'active' ? (lang === 'uz' ? 'Faol' : 'Активен') : (lang === 'uz' ? 'Bloklangan' : 'Заблокирован')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleUserStatus(u.id)} className={`p-1.5 rounded-lg transition ${u.status === 'active' ? 'hover:bg-red-50 text-gray-400 hover:text-red-500' : 'hover:bg-green-50 text-gray-400 hover:text-green-500'}`}>
                          {u.status === 'active' ? <UserX size={14}/> : <UserCheck size={14}/>}
                        </button>
                        <button onClick={() => handleEdit(u)} className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-[#1a56db] rounded-lg transition">
                          <Edit2 size={14}/>
                        </button>
                        {u.id !== 1 && (
                          <button onClick={() => handleDelete(u.id)} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition">
                            <Trash2 size={14}/>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-lg">
                {editId
                  ? (lang === 'uz' ? "Tahrirlash" : "Редактировать")
                  : (lang === 'uz' ? "Yangi foydalanuvchi" : "Новый пользователь")}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18}/>
              </button>
            </div>

            <div className="space-y-3">
              {/* To'liq ism */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{lang === 'uz' ? "To'liq ism *" : "Полное имя *"}</label>
                <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                  className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] ${errors.fullName ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="Ism Familiya Sharif"/>
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              {/* Login + Parol */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Login *</label>
                  <input type="text" value={form.login} onChange={e => setForm({...form, login: e.target.value})}
                    className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] ${errors.login ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="login123"/>
                  {errors.login && <p className="text-red-500 text-xs mt-1">{errors.login}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {lang === 'uz' ? "Parol" : "Пароль"} {!editId && '*'}
                  </label>
                  <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                    className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder={editId ? "O'zgartirish uchun kiriting" : "••••••••"}/>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
              </div>

              {/* Rol */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{lang === 'uz' ? "Rol *" : "Роль *"}</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(ROLES).map(r => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setForm({...form, role: r.key})}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border-2 transition ${
                        form.role === r.key ? `${r.color} border-current` : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span>{r.icon}</span>
                      <span>{lang === 'uz' ? r.labelUz : r.labelRu}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Viloyat */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{lang === 'uz' ? "Viloyat" : "Область"}</label>
                <input type="text" value={form.region} onChange={e => setForm({...form, region: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db]"/>
              </div>

              {/* Tuman */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{lang === 'uz' ? "Tuman" : "Район"}</label>
                <select value={form.district} onChange={e => setForm({...form, district: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white">
                  <option value="">— {lang === 'uz' ? "Tanlang" : "Выберите"}</option>
                  {districts.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              {/* Maktab */}
              {['student', 'school', 'parent'].includes(form.role) && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{lang === 'uz' ? "Maktab" : "Школа"}</label>
                  <input type="text" value={form.school} onChange={e => setForm({...form, school: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                    placeholder={lang === 'uz' ? "23-maktab" : "Школа №23"}/>
                </div>
              )}

              {/* Telefon */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{lang === 'uz' ? "Telefon" : "Телефон"}</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  placeholder="+998 __ ___ __ __"/>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={handleSave}
                className="flex-1 bg-[#1a56db] text-white py-3 rounded-xl font-bold hover:bg-[#1341a8] transition flex items-center justify-center gap-2">
                <Check size={16}/> {lang === 'uz' ? "Saqlash" : "Сохранить"}
              </button>
              <button onClick={() => { setShowForm(false); setErrors({}); }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                {lang === 'uz' ? "Bekor qilish" : "Отмена"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
