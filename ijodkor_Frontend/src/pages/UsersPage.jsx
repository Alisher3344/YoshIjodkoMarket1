import { useState, useEffect } from "react";
import {
  X,
  Check,
  Edit2,
  Trash2,
  Plus,
  UserCheck,
  UserX,
  Search,
  Key,
  Phone,
  School,
  User,
  Heart,
  CreditCard,
} from "lucide-react";
import useStore, { ROLES } from "../store/useStore";

const EMPTY_USER = {
  name: "",
  username: "",
  password: "",
  role: "student",
  phone: "",
  school: "",
  age: "",
  is_disabled: false,
  card_number: "",
};

export default function UsersPage() {
  const {
    lang,
    users,
    fetchUsers,
    addUser,
    editUser,
    deleteUser,
    toggleUserStatus,
    currentUser,
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_USER);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // Parolni alohida o'zgartirish uchun
  const [pwdUser, setPwdUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [pwdError, setPwdError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const openNew = () => {
    setEditId(null);
    setForm(EMPTY_USER);
    setShowForm(true);
    setError("");
  };

  const openEdit = (u) => {
    setEditId(u.id);
    setForm({
      name: u.name || "",
      username: u.username || "",
      password: "", // bo'sh — faqat yangilansa
      role: u.role || "student",
      phone: u.phone || "",
      school: u.school || "",
      age: u.age || "",
      is_disabled: u.is_disabled || false,
      card_number: u.card_number || "",
    });
    setShowForm(true);
    setError("");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_USER);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.username.trim()) {
      setError(
        lang === "uz" ? "Ism va telefon majburiy" : "Имя и телефон обязательны"
      );
      return;
    }

    if (!editId && !form.password.trim()) {
      setError(lang === "uz" ? "Parol majburiy" : "Пароль обязателен");
      return;
    }

    try {
      const data = {
        name: form.name.trim(),
        username: form.username.trim(),
        phone: form.phone || form.username,
        school: form.school || "",
        age: parseInt(form.age) || 0,
        is_disabled: form.is_disabled,
        card_number: form.card_number || "",
        role: form.role,
      };

      // Parol — faqat agar kiritilgan bo'lsa
      if (form.password && form.password.trim()) {
        data.password = form.password;
      }

      if (editId) {
        await editUser(editId, data);
      } else {
        data.password = form.password;
        await addUser(data);
      }
      closeForm();
    } catch (err) {
      setError(err.message || "Xatolik");
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
      await deleteUser(id);
    } catch (err) {
      alert(err.message);
    }
  };

  const openPasswordModal = (user) => {
    setPwdUser(user);
    setNewPassword("");
    setPwdError("");
  };

  const closePasswordModal = () => {
    setPwdUser(null);
    setNewPassword("");
    setPwdError("");
  };

  const handleChangePassword = async () => {
    setPwdError("");
    if (!newPassword.trim() || newPassword.length < 4) {
      setPwdError(
        lang === "uz"
          ? "Parol kamida 4 ta belgi bo'lishi kerak"
          : "Пароль минимум 4 символа"
      );
      return;
    }
    try {
      await editUser(pwdUser.id, {
        name: pwdUser.name,
        username: pwdUser.username,
        phone: pwdUser.phone || "",
        school: pwdUser.school || "",
        age: pwdUser.age || 0,
        is_disabled: pwdUser.is_disabled || false,
        card_number: pwdUser.card_number || "",
        role: pwdUser.role,
        password: newPassword,
      });
      alert(
        lang === "uz"
          ? `✅ Parol muvaffaqiyatli o'zgartirildi!\n\nYangi parol: ${newPassword}`
          : `✅ Пароль успешно изменён!\n\nНовый пароль: ${newPassword}`
      );
      closePasswordModal();
    } catch (err) {
      setPwdError(err.message || "Xatolik");
    }
  };

  // Filtrlash
  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.username || "").toLowerCase().includes(q) ||
      (u.phone || "").toLowerCase().includes(q) ||
      (u.school || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            {lang === "uz" ? "Foydalanuvchilar" : "Пользователи"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {lang === "uz"
              ? `Jami: ${users.length} ta`
              : `Всего: ${users.length}`}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder={lang === "uz" ? "Qidirish..." : "Поиск..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1a56db]"
            />
          </div>

          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white px-4 py-2 rounded-xl font-bold text-sm transition"
          >
            <Plus size={16} />
            {lang === "uz" ? "Yangi user" : "Новый"}
          </button>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                  ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                  {lang === "uz" ? "Ism" : "Имя"}
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                  {lang === "uz" ? "Telefon" : "Телефон"}
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                  {lang === "uz" ? "Maktab" : "Школа"}
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                  {lang === "uz" ? "Rol" : "Роль"}
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                  {lang === "uz" ? "Amallar" : "Действия"}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    {lang === "uz"
                      ? "Foydalanuvchilar topilmadi"
                      : "Пользователи не найдены"}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const isDisabled = u.is_disabled;
                  return (
                    <tr
                      key={u.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">
                        {u.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isDisabled && (
                            <Heart
                              size={12}
                              className="text-rose-500 fill-rose-500"
                            />
                          )}
                          <span className="font-bold text-sm text-gray-900">
                            {u.name}
                          </span>
                        </div>
                        {u.age > 0 && (
                          <div className="text-xs text-gray-400">
                            {u.age} {lang === "uz" ? "yosh" : "лет"}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-700">
                        {u.phone || u.username}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {u.school || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                            u.role === "superadmin"
                              ? "bg-red-100 text-red-700"
                              : u.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : u.role === "moderator"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold transition ${
                            u.active
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {u.active ? (
                            <>
                              <UserCheck size={12} />{" "}
                              {lang === "uz" ? "Faol" : "Актив"}
                            </>
                          ) : (
                            <>
                              <UserX size={12} />{" "}
                              {lang === "uz" ? "Blok" : "Блок"}
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          {/* Parol o'zgartirish */}
                          <button
                            onClick={() => openPasswordModal(u)}
                            title={
                              lang === "uz"
                                ? "Parolni o'zgartirish"
                                : "Изменить пароль"
                            }
                            className="p-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition"
                          >
                            <Key size={14} />
                          </button>
                          {/* Tahrirlash */}
                          <button
                            onClick={() => openEdit(u)}
                            title={lang === "uz" ? "Tahrirlash" : "Изменить"}
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-[#1a56db] rounded-lg transition"
                          >
                            <Edit2 size={14} />
                          </button>
                          {/* O'chirish — o'zingizni o'chira olmaysiz */}
                          {currentUser?.id !== u.id && (
                            <button
                              onClick={() => handleDelete(u.id)}
                              title={lang === "uz" ? "O'chirish" : "Удалить"}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Edit / Create Modal ────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-black text-lg">
                {editId
                  ? lang === "uz"
                    ? "Foydalanuvchini tahrirlash"
                    : "Изменить пользователя"
                  : lang === "uz"
                  ? "Yangi foydalanuvchi"
                  : "Новый пользователь"}
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

              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  Ism *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  {lang === "uz"
                    ? "Telefon / Username *"
                    : "Телефон / Username *"}
                </label>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      username: e.target.value,
                      phone: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db] font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  {lang === "uz" ? "Parol" : "Пароль"}{" "}
                  {editId && (
                    <span className="text-gray-400">
                      (
                      {lang === "uz"
                        ? "o'zgartirilmasa bo'sh qoldiring"
                        : "оставьте пустым если не меняется"}
                      )
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder={editId ? "••••••••" : ""}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    {lang === "uz" ? "Maktab" : "Школа"}
                  </label>
                  <input
                    type="text"
                    value={form.school}
                    onChange={(e) =>
                      setForm({ ...form, school: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    {lang === "uz" ? "Yosh" : "Возраст"}
                  </label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  {lang === "uz" ? "Rol" : "Роль"}
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56db] bg-white"
                >
                  <option value="student">Student (O'quvchi)</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>

              <label className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 cursor-pointer hover:bg-rose-100 transition">
                <input
                  type="checkbox"
                  checked={form.is_disabled}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      is_disabled: e.target.checked,
                      card_number: e.target.checked ? form.card_number : "",
                    })
                  }
                  className="w-5 h-5 accent-rose-500"
                />
                <Heart size={16} className="text-rose-500" />
                <span className="text-sm font-semibold text-rose-700">
                  {lang === "uz"
                    ? "Imkoniyati cheklangan"
                    : "С ограниченными возможностями"}
                </span>
              </label>

              {form.is_disabled && (
                <div>
                  <label className="text-xs font-bold text-rose-600 mb-1 block">
                    {lang === "uz" ? "Karta raqami" : "Номер карты"}
                  </label>
                  <input
                    type="text"
                    value={form.card_number}
                    onChange={(e) =>
                      setForm({ ...form, card_number: e.target.value })
                    }
                    className="w-full border-2 border-rose-200 bg-rose-50 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-500 font-mono"
                  />
                </div>
              )}

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
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white py-3 rounded-xl font-black text-sm transition"
                >
                  <Check size={16} /> {lang === "uz" ? "Saqlash" : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Password Reset Modal ───────────────────────────────── */}
      {pwdUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center">
                  <Key size={22} />
                </div>
                <div>
                  <h3 className="font-black text-lg">
                    {lang === "uz" ? "Parolni o'zgartirish" : "Изменить пароль"}
                  </h3>
                  <p className="text-white/80 text-sm">{pwdUser.name}</p>
                </div>
              </div>
              <div className="text-white/80 text-xs">
                📞 {pwdUser.phone || pwdUser.username}
              </div>
            </div>

            <div className="p-6">
              {pwdError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2 mb-4">
                  {pwdError}
                </div>
              )}

              <label className="text-sm font-bold text-gray-700 mb-2 block">
                {lang === "uz" ? "Yangi parol" : "Новый пароль"}
              </label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={
                  lang === "uz"
                    ? "Yangi parolni kiriting"
                    : "Введите новый пароль"
                }
                className="w-full border-2 border-orange-200 bg-orange-50 rounded-xl px-4 py-3 text-base outline-none focus:border-orange-500 font-mono mb-4"
                autoFocus
              />

              <p className="text-xs text-gray-500 mb-4">
                💡{" "}
                {lang === "uz"
                  ? "Parol o'zgargach, foydalanuvchiga yangi parolni aytishni unutmang"
                  : "После изменения пароля не забудьте сообщить его пользователю"}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={closePasswordModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm transition"
                >
                  {lang === "uz" ? "Bekor" : "Отмена"}
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-black text-sm transition"
                >
                  <Key size={16} />
                  {lang === "uz" ? "Saqlash" : "Изменить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
