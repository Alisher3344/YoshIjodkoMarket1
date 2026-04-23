import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, ArrowLeft, AlertCircle, Phone } from "lucide-react";
import useStore from "../store/useStore";
import { formatPhone, isValidPhone } from "../utils/phone";

export default function AuthPage() {
  const navigate = useNavigate();
  const { lang, adminLogin, register } = useStore();

  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [regData, setRegData] = useState({
    name: "",
    full_name: "",
    phone: "+998 ",
    password: "",
  });

  const goAfterAuth = () => {
    const { currentUser } = useStore.getState();
    if (currentUser?.role === "superadmin" || currentUser?.role === "admin") {
      navigate("/admin");
    } else {
      // Oddiy foydalanuvchilar (rol: user) uchun kabinet kerak emas — bosh sahifaga
      navigate("/");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginData.username.trim() || !loginData.password.trim()) {
      setError(
        lang === "uz"
          ? "Username va parolni kiriting"
          : "Введите username и пароль"
      );
      return;
    }

    setLoading(true);
    const ok = await adminLogin(loginData.username.trim(), loginData.password);
    setLoading(false);

    if (ok) {
      goAfterAuth();
    } else {
      setError(
        lang === "uz"
          ? "Username yoki parol noto'g'ri"
          : "Username или пароль неверны"
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!regData.name.trim()) {
      setError(lang === "uz" ? "Ism kiritilishi shart" : "Имя обязательно");
      return;
    }
    if (!isValidPhone(regData.phone)) {
      setError(
        lang === "uz"
          ? "Telefon raqamni to'liq kiriting (+998 XX XXX XX XX)"
          : "Введите полный номер телефона"
      );
      return;
    }
    if (regData.password.length < 6) {
      setError(
        lang === "uz"
          ? "Parol kamida 6 ta belgidan iborat bo'lsin"
          : "Пароль минимум 6 символов"
      );
      return;
    }

    setLoading(true);
    const res = await register({
      name: regData.name.trim(),
      full_name: regData.full_name.trim(),
      phone: regData.phone,
      password: regData.password,
    });
    setLoading(false);

    if (res.ok) {
      goAfterAuth();
    } else {
      setError(res.error || (lang === "uz" ? "Xatolik" : "Ошибка"));
    }
  };

  const tabBtn = (key, labelUz, labelRu) => (
    <button
      type="button"
      onClick={() => {
        setTab(key);
        setError("");
      }}
      className={`flex-1 py-3 text-sm font-bold transition border-b-2 ${
        tab === key
          ? "border-[#1a56db] text-[#1a56db]"
          : "border-transparent text-gray-400 hover:text-gray-600"
      }`}
    >
      {lang === "uz" ? labelUz : labelRu}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <button
          onClick={() => navigate("/")}
          className="m-4 flex items-center gap-1 text-sm text-gray-500 hover:text-[#1a56db] transition"
        >
          <ArrowLeft size={16} /> {lang === "uz" ? "Bosh sahifa" : "Главная"}
        </button>

        <div className="px-8 pb-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🎨</div>
            <h1 className="text-2xl font-black text-gray-900">
              {tab === "login"
                ? lang === "uz"
                  ? "Tizimga kirish"
                  : "Вход в систему"
                : lang === "uz"
                ? "Ro'yxatdan o'tish"
                : "Регистрация"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {tab === "login"
                ? lang === "uz"
                  ? "Username va parol bilan kiring"
                  : "Войдите с username и паролем"
                : lang === "uz"
                ? "Yangi hisob yarating"
                : "Создайте новый аккаунт"}
            </p>
          </div>

          <div className="flex border-b border-gray-100 mb-5">
            {tabBtn("login", "Kirish", "Вход")}
            {tabBtn("register", "Ro'yxatdan o'tish", "Регистрация")}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  placeholder={lang === "uz" ? "Username yoki telefon" : "Username или телефон"}
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#1a56db] transition"
                  required
                  autoFocus
                />
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="password"
                  placeholder={lang === "uz" ? "Parol" : "Пароль"}
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#1a56db] transition"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a56db] hover:bg-[#1341a8] text-white font-black py-3 rounded-xl transition disabled:opacity-50"
              >
                {loading
                  ? lang === "uz"
                    ? "Tekshirilmoqda..."
                    : "Проверка..."
                  : lang === "uz"
                  ? "Kirish"
                  : "Войти"}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                {lang === "uz"
                  ? "Hisobingiz yo'qmi? "
                  : "Нет аккаунта? "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("register");
                    setError("");
                  }}
                  className="text-[#1a56db] font-bold hover:underline"
                >
                  {lang === "uz" ? "Ro'yxatdan o'ting" : "Зарегистрируйтесь"}
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder={lang === "uz" ? "Ism *" : "Имя *"}
                    value={regData.name}
                    onChange={(e) =>
                      setRegData({ ...regData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#1a56db] transition"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder={lang === "uz" ? "Familiya" : "Фамилия"}
                    value={regData.full_name}
                    onChange={(e) =>
                      setRegData({ ...regData, full_name: e.target.value })
                    }
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#1a56db] transition"
                  />
                </div>
              </div>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="+998 __ ___ __ __"
                  value={regData.phone}
                  onChange={(e) =>
                    setRegData({
                      ...regData,
                      phone: formatPhone(e.target.value),
                    })
                  }
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#1a56db] transition font-mono"
                  required
                />
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="password"
                  placeholder={
                    lang === "uz"
                      ? "Parol (kamida 6 belgi)"
                      : "Пароль (мин. 6 символов)"
                  }
                  value={regData.password}
                  onChange={(e) =>
                    setRegData({ ...regData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#1a56db] transition"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a56db] hover:bg-[#1341a8] text-white font-black py-3 rounded-xl transition disabled:opacity-50"
              >
                {loading
                  ? lang === "uz"
                    ? "Yuborilmoqda..."
                    : "Отправка..."
                  : lang === "uz"
                  ? "Ro'yxatdan o'tish"
                  : "Зарегистрироваться"}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                {lang === "uz" ? "Hisobingiz bormi? " : "Уже есть аккаунт? "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("login");
                    setError("");
                  }}
                  className="text-[#1a56db] font-bold hover:underline"
                >
                  {lang === "uz" ? "Kiring" : "Войти"}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
