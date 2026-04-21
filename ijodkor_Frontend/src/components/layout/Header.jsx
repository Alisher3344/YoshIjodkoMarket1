import { useState, useEffect, useRef } from "react";
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
  Home,
  Grid3x3,
  Info,
  MessageCircle,
  Zap,
} from "lucide-react";
import useStore from "../../store/useStore";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchMobile, setSearchMobile] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cats = categoryLabels[lang];

  const catRef = useRef(null);
  const userRef = useRef(null);

  // Click outside close
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target))
        setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target))
        setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sahifa o'zgarganda menuni yopish
  useEffect(() => {
    setMenuOpen(false);
    setCatOpen(false);
    setUserOpen(false);
    setSearchMobile(false);
  }, [location.pathname]);

  // Menyu ochilganda scroll o'chirilsin
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/catalog");
    setSearchMobile(false);
  };

  const handleCatSelect = (cat) => {
    setSelectedCategory(cat);
    setCatOpen(false);
    setMenuOpen(false);
    navigate("/catalog");
  };

  const handleUserClick = () => {
    if (!adminLoggedIn) {
      navigate("/auth");
    } else {
      setUserOpen(!userOpen);
    }
  };

  const handleCartClick = () => {
    if (!adminLoggedIn) {
      navigate("/auth");
    } else {
      setCartOpen(true);
    }
  };

  const isAdmin =
    currentUser?.role === "admin" || currentUser?.role === "superadmin";
  const currentPath = location.pathname;

  const navLinks = [
    { label: t("home"), path: "/", icon: Home },
    { label: t("catalog"), path: "/catalog", icon: Grid3x3 },
    { label: t("about"), path: "/about", icon: Info },
    { label: t("contact"), path: "/contact", icon: MessageCircle },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          {/* ══════════════════════ TOP ROW ══════════════════════ */}
          <div className="flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3">
            {/* Logo — har xil ekranlarda har xil ko'rinish */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              className="flex items-center gap-2 flex-shrink-0"
            >
              {/* Katta ekranda 2 ta logo */}
              <TransparentImg
                src="/logo-smart.png"
                alt="SMART"
                className="hidden lg:block h-9 xl:h-10 object-contain"
              />
              <div className="hidden lg:block w-px h-8 bg-gray-200" />
              <TransparentImg
                src="/logo-maktab.png"
                alt="Yoshijodkor"
                className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 object-contain"
              />
              <div className="hidden xl:block">
                <div className="text-gray-700 text-[10px] leading-snug max-w-52 font-semibold">
                  {lang === "uz"
                    ? "Qashqadaryo viloyati maktabgacha va maktab ta'limi boshqarmasi bilan hamkorlikda"
                    : "В сотрудничестве с управлением образования Кашкадарьинской области"}
                </div>
              </div>
            </a>

            {/* Categories button (faqat desktop) */}
            <div
              ref={catRef}
              className="relative hidden lg:block flex-shrink-0"
            >
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-2 bg-[#1a56db] text-white px-3 xl:px-4 py-2.5 rounded-lg font-semibold text-xs xl:text-sm hover:bg-[#1341a8] transition whitespace-nowrap"
              >
                <Menu size={16} />
                <span>{t("allCategories")}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    catOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 min-w-52 z-50 overflow-hidden max-h-[70vh] overflow-y-auto">
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

            {/* Search — desktop */}
            <form onSubmit={handleSearch} className="flex-1 hidden md:block">
              <div className="flex bg-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:border-[#1a56db] focus-within:border-[#1a56db] transition">
                <input
                  type="text"
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none min-w-0"
                />
                <button
                  type="submit"
                  className="bg-[#f97316] hover:bg-[#c2570d] text-white px-4 sm:px-5 py-2.5 transition font-semibold text-sm flex-shrink-0"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Search ikonasi — mobile */}
            <button
              onClick={() => setSearchMobile(!searchMobile)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <Search size={17} className="text-gray-600" />
            </button>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Til — desktop */}
              <div className="hidden sm:flex bg-gray-100 rounded-lg overflow-hidden text-xs font-bold">
                <button
                  onClick={() => setLang("uz")}
                  className={`px-2.5 sm:px-3 py-2 transition ${
                    lang === "uz"
                      ? "bg-[#1a56db] text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  UZ
                </button>
                <button
                  onClick={() => setLang("ru")}
                  className={`px-2.5 sm:px-3 py-2 transition ${
                    lang === "ru"
                      ? "bg-[#1a56db] text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  РУ
                </button>
              </div>

              {/* User tugma — desktop */}
              <div ref={userRef} className="relative hidden md:block">
                <button
                  onClick={handleUserClick}
                  className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-lg transition text-sm font-medium ${
                    adminLoggedIn
                      ? "bg-blue-50 text-[#1a56db] hover:bg-blue-100"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <User size={15} />
                  <span className="hidden xl:block max-w-[100px] truncate">
                    {adminLoggedIn
                      ? currentUser?.name?.split(" ")[0] || "Profil"
                      : t("login")}
                  </span>
                </button>

                {adminLoggedIn && userOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 min-w-[220px] z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="font-bold text-sm text-gray-800 truncate">
                        {currentUser?.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
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

              {/* Dark mode */}
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

              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="flex items-center gap-2 bg-[#f97316] hover:bg-[#c2570d] text-white px-2.5 sm:px-3 py-2 rounded-lg transition relative"
              >
                <ShoppingCart size={17} />
                <span className="hidden lg:block text-sm font-semibold">
                  {t("cart")}
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-bold bounce-badge ring-2 ring-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition"
              >
                {menuOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </div>
          </div>

          {/* ══════════════════════ MOBILE SEARCH ══════════════════════ */}
          {searchMobile && (
            <form
              onSubmit={handleSearch}
              className="md:hidden pb-3 animate-slideDown"
            >
              <div className="flex bg-gray-100 rounded-xl overflow-hidden border border-[#1a56db]">
                <input
                  type="text"
                  autoFocus
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none"
                />
                <button type="submit" className="bg-[#f97316] text-white px-4">
                  <Search size={16} />
                </button>
              </div>
            </form>
          )}

          {/* ══════════════════════ DESKTOP NAV ══════════════════════ */}
          <nav className="hidden lg:flex items-center gap-1 pb-2 border-t border-gray-100 pt-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition ${
                    active
                      ? "bg-blue-50 text-[#1a56db]"
                      : "text-gray-600 hover:text-[#1a56db] hover:bg-blue-50"
                  }`}
                >
                  <Icon size={14} />
                  {link.label}
                </button>
              );
            })}

            <button
              onClick={() => {
                setSelectedCategory("custom");
                navigate("/catalog");
              }}
              className="ml-auto flex items-center gap-1.5 bg-gradient-to-r from-[#f97316] to-[#ef4444] hover:from-[#c2570d] hover:to-[#dc2626] text-white text-sm font-bold px-5 py-1.5 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <Zap size={14} className="fill-white" />
              {lang === "uz" ? "Buyurtma berish" : "Заказать"}
            </button>
          </nav>
        </div>
      </header>

      {/* ══════════════════════ MOBILE SLIDE MENU ══════════════════════ */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Slide menu */}
          <div className="lg:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#1a56db] to-[#1341a8] text-white p-5 relative">
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                <X size={18} />
              </button>

              {adminLoggedIn ? (
                <div>
                  <div className="w-14 h-14 rounded-full bg-white/25 flex items-center justify-center border-2 border-white/40 mb-3 overflow-hidden">
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={22} />
                    )}
                  </div>
                  <div className="font-black text-lg truncate">
                    {currentUser?.name || "User"}
                  </div>
                  <div className="text-white/70 text-xs truncate">
                    {currentUser?.phone || currentUser?.username}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-black text-xl mb-1">
                    {lang === "uz" ? "Xush kelibsiz!" : "Добро пожаловать!"}
                  </div>
                  <p className="text-white/80 text-sm">
                    {lang === "uz"
                      ? "Kirish yoki ro'yxatdan o'ting"
                      : "Войдите или зарегистрируйтесь"}
                  </p>
                  <button
                    onClick={() => navigate("/auth")}
                    className="mt-3 bg-white text-[#1a56db] font-bold px-4 py-2 rounded-lg text-sm shadow-md hover:bg-gray-100 transition"
                  >
                    {lang === "uz" ? "Kirish" : "Войти"}
                  </button>
                </div>
              )}
            </div>

            {/* Til toggle — mobile */}
            <div className="sm:hidden p-4 border-b border-gray-100">
              <div className="flex bg-gray-100 rounded-lg overflow-hidden text-sm font-bold">
                <button
                  onClick={() => setLang("uz")}
                  className={`flex-1 py-2.5 transition ${
                    lang === "uz" ? "bg-[#1a56db] text-white" : "text-gray-600"
                  }`}
                >
                  🇺🇿 O'zbek
                </button>
                <button
                  onClick={() => setLang("ru")}
                  className={`flex-1 py-2.5 transition ${
                    lang === "ru" ? "bg-[#1a56db] text-white" : "text-gray-600"
                  }`}
                >
                  🇷🇺 Русский
                </button>
              </div>
            </div>

            {/* Nav Links */}
            <div className="p-3">
              <div className="text-xs font-bold text-gray-400 uppercase px-3 mb-2">
                {lang === "uz" ? "Menyu" : "Меню"}
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition ${
                      active
                        ? "bg-blue-50 text-[#1a56db]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={active ? "text-[#1a56db]" : "text-gray-400"}
                    />
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Categories */}
            <div className="p-3 border-t border-gray-100">
              <div className="text-xs font-bold text-gray-400 uppercase px-3 mb-2">
                {lang === "uz" ? "Kategoriyalar" : "Категории"}
              </div>
              <div className="max-h-[40vh] overflow-y-auto">
                {Object.entries(cats).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleCatSelect(key)}
                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#1a56db] rounded-xl transition"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Account actions */}
            {adminLoggedIn && (
              <div className="p-3 border-t border-gray-100 mt-auto">
                <button
                  onClick={() => {
                    navigate(isAdmin ? "/admin" : "/cabinet");
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-[#1a56db] bg-blue-50 hover:bg-blue-100 transition mb-2"
                >
                  {isAdmin ? (
                    <>⚙️ {lang === "uz" ? "Admin panel" : "Админ панель"}</>
                  ) : (
                    <>🎓 {lang === "uz" ? "Mening kabinetim" : "Мой кабинет"}</>
                  )}
                </button>
                <button
                  onClick={() => {
                    adminLogout();
                    setMenuOpen(false);
                    navigate("/");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition"
                >
                  <LogOut size={16} /> {lang === "uz" ? "Chiqish" : "Выйти"}
                </button>
              </div>
            )}

            {/* Custom order CTA */}
            <div className="p-3 pt-0">
              <button
                onClick={() => {
                  setSelectedCategory("custom");
                  navigate("/catalog");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#f97316] to-[#ef4444] text-white font-black px-4 py-3 rounded-xl shadow-lg"
              >
                <Zap size={16} className="fill-white" />
                {lang === "uz" ? "Buyurtma berish" : "Заказать"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Animatsiyalar uchun CSS */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
      `}</style>
    </>
  );
}
