import { useState } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import useStore from "../../store/useStore";
import { useNavigate } from "react-router-dom";
import { categoryLabels } from "../ui/data/translations";
import TransparentImg from "../ui/TransparentImg";

export default function Header() {
  const {
    t,
    lang,
    setLang,
    cart,
    setCartOpen,
    menuOpen,
    setMenuOpen,
    setSelectedCategory,
    setSearchQuery,
    searchQuery,
    adminLoggedIn,
    currentUser,
    adminLogout,
    darkMode,
    toggleDarkMode,
  } = useStore();
  const navigate = useNavigate();
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const cats = categoryLabels[lang];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/catalog");
  };

  const handleCatSelect = (cat) => {
    setSelectedCategory(cat);
    setCatOpen(false);
    navigate("/catalog");
  };

  const handleUserClick = () => {
    if (!adminLoggedIn) {
      navigate("/auth");
    } else {
      setUserOpen(!userOpen);
    }
  };

  const isAdmin =
    currentUser?.role === "admin" || currentUser?.role === "superadmin";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 py-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <TransparentImg
              src="/logo-smart.png"
              alt="SMART"
              className="hidden sm:block h-10 object-contain"
            />
            <div className="hidden sm:block w-px h-8 bg-gray-200" />
            <TransparentImg
              src="/logo-maktab.png"
              alt="Yoshijodkor"
              className="w-12 h-12 object-contain"
            />
            <div className="hidden sm:block">
              <div className="text-gray-700 text-[11px] leading-snug max-w-52 font-semibold">
                {lang === "uz"
                  ? "Qashqadaryo viloyati maktabgacha va maktab ta'limi boshqarmasi bilan hamkorlikda"
                  : "В сотрудничестве с управлением дошкольного и школьного образования Кашкадарьинской области"}
              </div>
            </div>
          </a>

          <div className="relative hidden md:block flex-shrink-0">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-2 bg-[#1a56db] text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#1341a8] transition whitespace-nowrap"
            >
              <Menu size={16} />
              {t("allCategories")}
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  catOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 min-w-52 z-50 overflow-hidden">
                {Object.entries(cats).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleCatSelect(key)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-[#1a56db] transition flex items-center gap-2 font-medium"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSearch} className="flex-1">
            <div className="flex bg-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:border-[#1a56db] transition">
              <input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none"
              />
              <button
                type="submit"
                className="bg-[#f97316] hover:bg-[#c2570d] text-white px-5 py-2.5 transition font-semibold text-sm"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg overflow-hidden text-xs font-bold">
              <button
                onClick={() => setLang("uz")}
                className={`px-3 py-2 transition ${
                  lang === "uz"
                    ? "bg-[#1a56db] text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                UZ
              </button>
              <button
                onClick={() => setLang("ru")}
                className={`px-3 py-2 transition ${
                  lang === "ru"
                    ? "bg-[#1a56db] text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                РУ
              </button>
            </div>

            <div className="relative hidden md:block">
              <button
                onClick={handleUserClick}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition text-sm font-medium ${
                  adminLoggedIn
                    ? "bg-blue-50 text-[#1a56db] hover:bg-blue-100"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <User size={15} />
                <span className="hidden lg:block">
                  {adminLoggedIn
                    ? currentUser?.name?.split(" ")[0] || "Profil"
                    : t("login")}
                </span>
              </button>

              {adminLoggedIn && userOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 min-w-48 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="font-bold text-sm text-gray-800">
                      {currentUser?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentUser?.phone || currentUser?.username}
                    </div>
                  </div>
                  {isAdmin ? (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setUserOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-[#1a56db] transition font-medium flex items-center gap-2"
                    >
                      ⚙️ {lang === "uz" ? "Admin panel" : "Админ панель"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        navigate("/cabinet");
                        setUserOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-[#1a56db] transition font-medium flex items-center gap-2"
                    >
                      🎓 {lang === "uz" ? "Mening kabinetim" : "Мой кабинет"}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      adminLogout();
                      setUserOpen(false);
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 transition font-medium flex items-center gap-2 border-t border-gray-100"
                  >
                    <LogOut size={14} /> {lang === "uz" ? "Chiqish" : "Выйти"}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              title={
                darkMode
                  ? lang === "uz"
                    ? "Kun rejimi"
                    : "Дневной режим"
                  : lang === "uz"
                  ? "Tun rejimi"
                  : "Ночной режим"
              }
            >
              {darkMode ? (
                <Sun size={17} className="text-yellow-400" />
              ) : (
                <Moon size={17} className="text-gray-600" />
              )}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 bg-[#f97316] hover:bg-[#c2570d] text-white px-3 py-2 rounded-lg transition relative"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:block text-sm font-semibold">
                {t("cart")}
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold bounce-badge">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden bg-gray-100 p-2 rounded-lg"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 pb-2 border-t border-gray-100 pt-2">
          {[
            { label: t("home"), path: "/" },
            { label: t("catalog"), path: "/catalog" },
            { label: t("about"), path: "/about" },
            { label: t("contact"), path: "/contact" },
          ].map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="text-sm font-medium text-gray-600 hover:text-[#1a56db] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={() => {
              setSelectedCategory("custom");
              navigate("/catalog");
            }}
            className="ml-auto flex items-center gap-1.5 bg-gradient-to-r from-[#f97316] to-[#ef4444] hover:from-[#c2570d] hover:to-[#dc2626] text-white text-sm font-bold px-5 py-1.5 rounded-full shadow-md hover:shadow-lg transition-all animate-pulse"
          >
            ⚡ {lang === "uz" ? "Buyurtma berish" : "Заказать"}
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-2">
          {Object.entries(cats).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                handleCatSelect(key);
                setMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#1a56db] rounded-lg transition"
            >
              {label}
            </button>
          ))}
          <hr />
          {adminLoggedIn ? (
            <>
              <button
                onClick={() => {
                  navigate(isAdmin ? "/admin" : "/cabinet");
                  setMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm text-[#1a56db] font-semibold"
              >
                {isAdmin
                  ? lang === "uz"
                    ? "Admin panel"
                    : "Админ панель"
                  : lang === "uz"
                  ? "Mening kabinetim"
                  : "Мой кабинет"}
              </button>
              <button
                onClick={() => {
                  adminLogout();
                  setMenuOpen(false);
                  navigate("/");
                }}
                className="text-left px-3 py-2 text-sm text-red-600 font-semibold"
              >
                {lang === "uz" ? "Chiqish" : "Выйти"}
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                navigate("/auth");
                setMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm text-[#1a56db] font-semibold"
            >
              {lang === "uz"
                ? "Kirish / Ro'yxatdan o'tish"
                : "Войти / Регистрация"}
            </button>
          )}
        </div>
      )}
    </header>
  );
}
