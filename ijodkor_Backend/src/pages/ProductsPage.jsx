import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { useLangStore, useProductStore } from "../store";
import { categories } from "../data/products";
import ProductCard from "../components/product/ProductCard";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang, t } = useLangStore();
  const { products, fetchProducts, loading } = useProductStore();

  const initialCat = searchParams.get("cat") || "all";
  const [activeCat, setActiveCat] = useState(initialCat);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQ, setSearchQ] = useState("");

  // Sahifa ochilganda backenddan yukla
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setActiveCat(cat);
  }, [searchParams]);

  const getCatLabel = (id) => {
    if (id === "all") return lang === "uz" ? "Barchasi" : "Все";
    const cat = categories.find((c) => c.id === id);
    return cat ? (lang === "uz" ? cat.label_uz : cat.label_ru) : id;
  };

  const filtered = useMemo(() => {
    let list =
      activeCat === "all"
        ? [...products]
        : products.filter((p) => p.category === activeCat);
    if (searchQ) {
      const q = searchQ.toLowerCase();
      list = list.filter(
        (p) =>
          p.name_uz?.toLowerCase().includes(q) ||
          p.name_ru?.toLowerCase().includes(q) ||
          p.author?.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "price_asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price_desc":
        return [...list].sort((a, b) => b.price - a.price);
      // Backend created_at field ishlatadi
      case "newest":
        return [...list].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      default:
        return list;
    }
  }, [products, activeCat, sortBy, searchQ, lang]);

  const handleCat = (id) => {
    setActiveCat(id);
    if (id === "all") searchParams.delete("cat");
    else setSearchParams({ cat: id });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-[#4c1d95] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-black mb-1 font-serif">
            {t("nav_products")}
          </h1>
          <p className="text-white/60">
            {filtered.length} {lang === "uz" ? "ta mahsulot" : "товаров"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder={t("search_placeholder")}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-purple-400 text-sm"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none text-sm font-semibold text-gray-700"
          >
            <option value="newest">
              {lang === "uz" ? "Yangilari" : "Новые"}
            </option>
            <option value="price_asc">
              {lang === "uz" ? "Arzon avval" : "Сначала дешевле"}
            </option>
            <option value="price_desc">
              {lang === "uz" ? "Qimmat avval" : "Сначала дороже"}
            </option>
          </select>
        </div>

        {/* Category tabs — 'all' faqat bir marta */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "all", label_uz: "Barchasi", label_ru: "Все" },
            ...categories,
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCat(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeCat === cat.id
                  ? "bg-[#4c1d95] text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {lang === "uz" ? cat.label_uz : cat.label_ru}
              {cat.id !== "all" && (
                <span
                  className={`ml-1.5 text-xs ${
                    activeCat === cat.id ? "text-white/70" : "text-gray-400"
                  }`}
                >
                  ({products.filter((p) => p.category === cat.id).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl h-64 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Mahsulotlar grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        {/* Bo'sh holat */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-semibold">{t("no_products")}</p>
            {searchQ && (
              <button
                onClick={() => setSearchQ("")}
                className="mt-4 flex items-center gap-2 mx-auto text-purple-600 font-semibold"
              >
                <X className="w-4 h-4" />{" "}
                {lang === "uz" ? "Filterni tozalash" : "Очистить фильтр"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
