import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, Heart } from "lucide-react";
import useStore from "../store/useStore";
import { categoryLabels } from "../components/ui/data/translations";
import ProductCard from "../components/product/ProductCard";

export default function CatalogPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    lang,
    products,
    productsLoading,
    fetchProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  } = useStore();

  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [onlyDisabled, setOnlyDisabled] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const cats = categoryLabels[lang];

  useEffect(() => {
    fetchProducts();
  }, []);

  // URL dan kategoriya olish
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Filter
  let filtered = Array.isArray(products) ? [...products] : [];

  // Kategoriya
  if (selectedCategory && selectedCategory !== "all") {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }

  // Qidiruv
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter((p) => {
      const n1 = (p.nameUz || p.name_uz || "").toLowerCase();
      const n2 = (p.nameRu || p.name_ru || "").toLowerCase();
      const a = (p.author || "").toLowerCase();
      const s = (p.school || "").toLowerCase();
      return n1.includes(q) || n2.includes(q) || a.includes(q) || s.includes(q);
    });
  }

  // Narx
  filtered = filtered.filter((p) => {
    const price = p.price || 0;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  // Faqat imkoniyati cheklanganlar
  if (onlyDisabled) {
    filtered = filtered.filter(
      (p) => (p.studentType || p.student_type) === "disabled"
    );
  }

  // Sort
  if (sortBy === "cheap")
    filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  if (sortBy === "expensive")
    filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
  if (sortBy === "rating")
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sortBy === "popular")
    filtered.sort((a, b) => (b.sold || 0) - (a.sold || 0));

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setPriceRange([0, 10000000]);
    setOnlyDisabled(false);
    setSortBy("newest");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    searchQuery ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000000 ||
    onlyDisabled;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
          {lang === "uz" ? "Mahsulotlar katalogi" : "Каталог товаров"}
        </h1>
        <p className="text-sm text-gray-500">
          {lang === "uz"
            ? `Jami: ${filtered.length} ta mahsulot`
            : `Всего: ${filtered.length} товаров`}
        </p>
      </div>

      {/* Mobile filter toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden flex items-center gap-2 bg-[#1a56db] text-white px-4 py-2.5 rounded-xl font-bold text-sm mb-4"
      >
        <SlidersHorizontal size={16} />
        {lang === "uz" ? "Filtrlar" : "Фильтры"}
        {hasActiveFilters && (
          <span className="bg-white text-[#1a56db] text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
            !
          </span>
        )}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* ── Sidebar filtrlari ──────────────────────────────────────── */}
        <aside
          className={`space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}
        >
          {/* Kategoriyalar */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h3 className="font-black text-sm text-gray-800 mb-3">
              {lang === "uz" ? "Kategoriyalar" : "Категории"}
            </h3>
            <div className="space-y-1">
              {Object.entries(cats).map(([key, label]) => {
                const count =
                  key === "all"
                    ? products.length
                    : products.filter((p) => p.category === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition ${
                      selectedCategory === key
                        ? "bg-blue-50 text-[#1a56db] font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="truncate">{label}</span>
                    <span className="text-xs text-gray-400 ml-2">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Narx */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h3 className="font-black text-sm text-gray-800 mb-3">
              {lang === "uz" ? "Narx diapazoni" : "Цена"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder={lang === "uz" ? "Dan" : "От"}
                value={priceRange[0] || ""}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#1a56db]"
              />
              <input
                type="number"
                placeholder={lang === "uz" ? "Gacha" : "До"}
                value={priceRange[1] === 10000000 ? "" : priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    parseInt(e.target.value) || 10000000,
                  ])
                }
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#1a56db]"
              />
            </div>
          </div>

          {/* Faqat imkoniyati cheklanganlar */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 border-2 border-rose-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyDisabled}
                onChange={(e) => setOnlyDisabled(e.target.checked)}
                className="w-5 h-5 accent-rose-500"
              />
              <div>
                <div className="font-bold text-sm text-rose-700 flex items-center gap-1">
                  <Heart size={12} className="fill-rose-500" />
                  {lang === "uz"
                    ? "Imkoniyati cheklanganlar"
                    : "С огр. возможностями"}
                </div>
                <div className="text-xs text-rose-500 mt-0.5">
                  {lang === "uz" ? "Ularga yordam bering" : "Помощь им"}
                </div>
              </div>
            </label>
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <X size={14} />
              {lang === "uz" ? "Filtrlarni tozalash" : "Сбросить фильтры"}
            </button>
          )}
        </aside>

        {/* ── Mahsulotlar ────────────────────────────────────────────── */}
        <main>
          {/* Top bar — search + sort */}
          <div className="bg-white rounded-2xl p-3 border border-gray-100 mb-4 flex items-center gap-2 flex-wrap">
            <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder={lang === "uz" ? "Qidirish..." : "Поиск..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none font-medium cursor-pointer"
            >
              <option value="newest">
                {lang === "uz" ? "Yangilar" : "Новые"}
              </option>
              <option value="cheap">
                {lang === "uz" ? "Arzon" : "Дешёвые"}
              </option>
              <option value="expensive">
                {lang === "uz" ? "Qimmat" : "Дорогие"}
              </option>
              <option value="rating">
                {lang === "uz" ? "Reyting" : "Рейтинг"}
              </option>
              <option value="popular">
                {lang === "uz" ? "Mashhur" : "Популярные"}
              </option>
            </select>
          </div>

          {/* Content */}
          {productsLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin h-12 w-12 border-4 border-[#1a56db] border-t-transparent rounded-full"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <div className="text-6xl mb-3">🥺</div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {lang === "uz" ? "Mahsulot topilmadi" : "Товары не найдены"}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {lang === "uz"
                  ? "Filtrlarni o'zgartirib ko'ring yoki qidiruv so'zini almashtiring"
                  : "Попробуйте изменить фильтры или поисковый запрос"}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="bg-[#1a56db] hover:bg-[#1341a8] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition"
                >
                  {lang === "uz" ? "Filtrlarni tozalash" : "Сбросить фильтры"}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
