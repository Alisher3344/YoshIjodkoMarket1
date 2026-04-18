import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Lock,
  School,
  Calendar,
  CreditCard,
  Heart,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import useStore from "../store/useStore";

export default function AuthPage() {
  const navigate = useNavigate();
  const { lang, adminLogin, register } = useStore();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login form
  const [loginData, setLoginData] = useState({ phone: "", password: "" });

  // Register form
  const [regData, setRegData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    school: "",
    age: "",
    is_disabled: false,
    card_number: "",
  });

  // ── LOGIN ─────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginData.phone.trim() || !loginData.password.trim()) {
      setError(
        lang === "uz"
          ? "Telefon va parolni kiriting"
          : "Введите телефон и пароль"
      );
      return;
    }

    setLoading(true);
    const ok = await adminLogin(loginData.phone.trim(), loginData.password);
    setLoading(false);

    if (ok) {
      const { currentUser } = useStore.getState();
      if (currentUser?.role === "admin" || currentUser?.role === "superadmin") {
        navigate("/admin");
      } else {
        navigate("/cabinet");
      }
    } else {
      setError(
        lang === "uz"
          ? "Telefon raqam yoki parol noto'g'ri. Ro'yxatdan o'tmagan bo'lsangiz avval ro'yxatdan o'ting."
          : "Телефон или пароль неверны. Если не зарегистрированы — сначала зарегистрируйтесь."
      );
    }
  };

  // ── REGISTER ──────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validatsiya
    if (!regData.name.trim()) {
      setError(lang === "uz" ? "Ismingizni kiriting" : "Введите имя");
      return;
    }
    if (!regData.phone.trim()) {
      setError(
        lang === "uz" ? "Telefon raqamni kiriting" : "Введите номер телефона"
      );
      return;
    }
    if (regData.password.length < 4) {
      setError(
        lang === "uz"
          ? "Parol kamida 4 ta belgidan iborat bo'lsin"
          : "Пароль минимум 4 символа"
      );
      return;
    }
    if (regData.password !== regData.confirmPassword) {
      setError(lang === "uz" ? "Parollar mos kelmadi" : "Пароли не совпадают");
      return;
    }
    if (regData.is_disabled && !regData.card_number.trim()) {
      setError(
        lang === "uz" ? "Karta raqamini kiriting" : "Введите номер карты"
      );
      return;
    }

    setLoading(true);
    const res = await register({
      name: regData.name.trim(),
      phone: regData.phone.trim(),
      password: regData.password,
      school: regData.school.trim(),
      age: parseInt(regData.age) || 0,
      is_disabled: regData.is_disabled,
      card_number: regData.card_number.trim(),
    });
    setLoading(false);

    if (res.success) {
      setSuccess(
        lang === "uz"
          ? "✅ Muvaffaqiyatli! Kabinetga yo'naltirilmoqda..."
          : "✅ Успешно! Перенаправляем в кабинет..."
      );
      setTimeout(() => navigate("/cabinet"), 1000);
    } else {
      // Telefon band bo'lsa — aniq xabar
      const msg = res.error || "";
      if (
        msg.toLowerCase().includes("allaqachon") ||
        msg.toLowerCase().includes("already") ||
        msg.toLowerCase().includes("band")
      ) {
        setError(
          lang === "uz"
            ? `❌ Kechirasiz, bu telefon raqam (${regData.phone}) allaqachon ro'yxatdan o'tgan. "Kirish" tabida telefon va parolingiz bilan kiring.`
            : `❌ Извините, этот номер (${regData.phone}) уже зарегистрирован. Войдите через вкладку "Войти".`
        );
      } else {
        setError(
          msg || (lang === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка")
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Back */}
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
              {mode === "login"
                ? lang === "uz"
                  ? "Kabinetga kirish"
                  : "Войти в кабинет"
                : lang === "uz"
                ? "Ro'yxatdan o'tish"
                : "Регистрация"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {mode === "login"
                ? lang === "uz"
                  ? "Telefon raqam va parol bilan kiring"
                  : "Войдите с телефоном и паролем"
                : lang === "uz"
                ? "Birinchi marta \u2014 ro'yxatdan o'ting"
                : "Первый раз — зарегистрируйтесь"}
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                mode === "login"
                  ? "bg-white shadow text-[#1a56db]"
                  : "text-gray-500"
              }`}
            >
              {lang === "uz" ? "Kirish" : "Войти"}
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                mode === "register"
                  ? "bg-white shadow text-[#1a56db]"
                  : "text-gray-500"
              }`}
            >
              {lang === "uz" ? "Ro'yxatdan o'tish" : "Регистрация"}
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
              <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="tel"
                  placeholder={
                    lang === "uz"
                      ? "Telefon raqam (+998...)"
                      : "Телефон (+998...)"
                  }
                  value={loginData.phone}
                  onChange={(e) =>
                    setLoginData({ ...loginData, phone: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#1a56db] transition"
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
                  ? "Kabinetga kirish"
                  : "Войти в кабинет"}
              </button>

              <p className="text-center text-sm text-gray-500 mt-3">
                {lang === "uz" ? "Akkauntingiz yo'qmi?" : "Нет аккаунта?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError("");
                  }}
                  className="text-[#1a56db] font-bold hover:underline"
                >
                  {lang === "uz" ? "Ro'yxatdan o'ting" : "Зарегистрируйтесь"}
                </button>
              </p>
            </form>
          )}

          {/* REGISTER */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  placeholder={lang === "uz" ? "Ism familiya" : "Имя и фамилия"}
                  value={regData.name}
                  onChange={(e) =>
                    setRegData({ ...regData, name: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#1a56db] transition"
                  required
                />
              </div>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={regData.phone}
                  onChange={(e) =>
                    setRegData({ ...regData, phone: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#1a56db] transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="password"
                    placeholder={lang === "uz" ? "Parol" : "Пароль"}
                    value={regData.password}
                    onChange={(e) =>
                      setRegData({ ...regData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#1a56db] transition"
                    minLength={4}
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
                      lang === "uz" ? "Parolni takrorlang" : "Повторите пароль"
                    }
                    value={regData.confirmPassword}
                    onChange={(e) =>
                      setRegData({
                        ...regData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#1a56db] transition"
                    minLength={4}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <School
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  placeholder={lang === "uz" ? "Maktab nomi" : "Название школы"}
                  value={regData.school}
                  onChange={(e) =>
                    setRegData({ ...regData, school: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#1a56db] transition"
                />
              </div>

              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="number"
                  placeholder={lang === "uz" ? "Yosh" : "Возраст"}
                  value={regData.age}
                  onChange={(e) =>
                    setRegData({ ...regData, age: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#1a56db] transition"
                  min={1}
                  max={100}
                />
              </div>

              {/* Imkoniyati cheklangan checkbox */}
              <label className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 cursor-pointer hover:bg-rose-100 transition">
                <input
                  type="checkbox"
                  checked={regData.is_disabled}
                  onChange={(e) =>
                    setRegData({
                      ...regData,
                      is_disabled: e.target.checked,
                      card_number: e.target.checked ? regData.card_number : "",
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

              {/* Karta raqam — faqat imkoniyati cheklangan bo'lsa */}
              {regData.is_disabled && (
                <div className="relative">
                  <CreditCard
                    size={18}
                    className="absolute left-3 top-3 text-rose-400"
                  />
                  <input
                    type="text"
                    placeholder={
                      lang === "uz"
                        ? "Karta raqami (16 raqam)"
                        : "Номер карты (16 цифр)"
                    }
                    value={regData.card_number}
                    onChange={(e) =>
                      setRegData({ ...regData, card_number: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-rose-200 bg-rose-50 rounded-xl outline-none focus:border-rose-500 transition"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a56db] hover:bg-[#1341a8] text-white font-black py-3 rounded-xl transition disabled:opacity-50 mt-4"
              >
                {loading
                  ? lang === "uz"
                    ? "Yaratilmoqda..."
                    : "Создаётся..."
                  : lang === "uz"
                  ? "Ro'yxatdan o'tish"
                  : "Зарегистрироваться"}
              </button>

              <p className="text-center text-sm text-gray-500 mt-3">
                {lang === "uz"
                  ? "Allaqachon akkauntingiz bormi?"
                  : "Уже есть аккаунт?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className="text-[#1a56db] font-bold hover:underline"
                >
                  {lang === "uz" ? "Kirish" : "Войти"}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
