import { useEffect } from "react";
import { Edit2, Trash2, UserCheck, UserX, Plus } from "lucide-react";
import useStore from "../store/useStore";

export default function UsersPage() {
  const { lang, users, fetchUsers, deleteUser, toggleUserStatus } = useStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">
          {lang === "uz" ? "Foydalanuvchilar" : "Пользователи"}
        </h2>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">👥</div>
          <p>{lang === "uz" ? "Foydalanuvchilar yo'q" : "Нет пользователей"}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                  <td className="px-4 py-3">
                    <p className="font-semibold text-sm text-gray-900">
                      {u.name}
                    </p>
                    {u.email && (
                      <p className="text-xs text-gray-400">{u.email}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    @{u.username}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        u.role === "superadmin"
                          ? "bg-purple-100 text-purple-700"
                          : u.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : u.role === "moderator"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
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
                        onClick={() => toggleUserStatus(u.id)}
                        className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-500 transition"
                        title={u.active ? "Bloklash" : "Faollashtirish"}
                      >
                        {u.active ? (
                          <UserX size={15} />
                        ) : (
                          <UserCheck size={15} />
                        )}
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                        title="O'chirish"
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
  );
}
