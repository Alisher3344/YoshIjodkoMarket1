import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Sparkles,
  Zap,
  Shield,
  Palette,
  MessageCircle,
} from "lucide-react";
import { useLangStore, useProductStore } from "../store";
import { categories } from "../data/products";
import ProductCard from "../components/product/ProductCard";

export default function HomePage() {
  const { t, lang } = useLangStore();
  const { products, fetchProducts, loading } = useProductStore();
  const [visible, setVisible] = useState(false);

  // Sahifa ochilganda backenddan mahsulotlarni yukla
  useEffect(() => {
    setVisible(true);
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);
  console.log(products);

  // is_new=true bo'lgan mahsulotlar (backend field: is_new)
  const newProducts = products.filter((p) => p.is_new).slice(0, 4);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      uz: "Tez yetkazish",
      ru: "Быстрая доставка",
      duz: "1-3 kun ichida",
      dru: "За 1-3 дня",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      uz: "Xavfsiz to'lov",
      ru: "Безопасная оплата",
      duz: "Click, Payme, Uzum",
      dru: "Click, Payme, Uzum",
    },
    {
      icon: <Palette className="w-6 h-6" />,
      uz: "Asl ijod",
      ru: "Ручная работа",
      duz: "Har biri noyob",
      dru: "Каждая — уникальна",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      uz: "24/7 Yordam",
      ru: "Поддержка 24/7",
      duz: "Telegram orqali",
      dru: "Через Telegram",
    },
  ];

  return (
    <div
      className={`transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* ── HERO ── */}
      <section className="min-h-screen hero-pattern flex items-center relative overflow-hidden pt-20">
        <div className="absolute top-16 right-8 w-80 h-80 rounded-full bg-[#ffffff]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-16 left-8 w-64 h-64 rounded-full bg-[#8b5cf6]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#5b21b6]/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-white">
            <div className="flex items-center gap-6 mb-6 -mt-16">
              <img
                src="/logo.png"
                alt="Yosh Ijodkor logo"
                className="w-40 h-40 object-contain shrink-0"
              />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-[1.2] font-serif">
                {lang === "uz" ? (
                  <>
                    {" "}
                    O'quvchilar ijodini
                    <br />
                    <span className="text-white">qo'llab-quvvatlang</span>
                  </>
                ) : (
                  <>
                    {" "}
                    Поддержите творчество
                    <br />
                    <span className="text-white">школьников</span>
                  </>
                )}
              </h1>
            </div>
            <p className="text-white/65 text-lg leading-relaxed mb-10 max-w-lg">
              {t("hero_subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 mb-14">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-[#ffffff] hover:bg-[#8b5cf6] text-[#3b0764] font-black px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-[#ffffff]/30"
              >
                {t("hero_btn_shop")} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-4 rounded-2xl transition-all border border-white/20"
              >
                {t("hero_btn_about")}
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              {[
                {
                  value: products.length + "+",
                  label: t("hero_stats_products"),
                },
                { value: "50+", label: t("hero_stats_students") },
                { value: "200+", label: t("hero_stats_sold") },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-3xl font-black text-[#ffffff] leading-none">
                    {s.value}
                  </p>
                  <p className="text-white/50 text-xs mt-1.5 font-semibold uppercase tracking-wide">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero rasmlari — backenddan */}
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {loading ? (
              <div className="col-span-2 h-52 bg-white/10 rounded-2xl animate-pulse" />
            ) : (
              products.slice(0, 4).map((p, i) => (
                <div
                  key={p.id}
                  className={`rounded-2xl overflow-hidden border-2 border-[#ffffff]/20 shadow-2xl ${
                    i === 0 ? "col-span-2 h-52" : "h-44"
                  }`}
                >
                  <img
                    src={p.image}
                    alt=""
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 60L1440 60L1440 20C1200 60 900 0 720 20C540 40 240 0 0 20L0 60Z"
              fill="#faf9ff"
            />
          </svg>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 bg-[#faf9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-2xl font-black text-[#4c1d95]">
              {t("cat_subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?cat=${cat.id}`}
                className="group flex items-center gap-5 p-5 rounded-3xl bg-white hover:bg-[#4c1d95] border border-[#4c1d95]/8 hover:border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#4c1d95]/25"
              >
                <div
                  className={`w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform duration-300`}
                >
                  {cat.icon}
                </div>
                <div>
                  <p className="text-lg font-black text-[#4c1d95] group-hover:text-white transition-colors leading-snug">
                    {lang === "uz" ? cat.label_uz : cat.label_ru}
                  </p>
                  <span className="inline-block mt-1.5 text-xs font-semibold text-[#4c1d95]/40 group-hover:text-white/60 transition-colors bg-[#4c1d95]/5 group-hover:bg-white/10 px-2.5 py-0.5 rounded-full">
                    {products.filter((p) => p.category === cat.id).length} ta
                    mahsulot
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── YANGI MAHSULOTLAR ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-[#4c1d95] font-black text-xs uppercase tracking-widest mb-3">
                <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
                {lang === "uz" ? "Yangi keldi" : "Новинки"}
              </div>
              <h2 className="text-3xl font-black text-[#4c1d95]">
                {t("prod_title")}
              </h2>
              <p className="text-gray-500 mt-1.5">{t("prod_subtitle")}</p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-black text-[#4c1d95] hover:text-white bg-[#ede9fe] hover:bg-[#7c3aed] px-5 py-2.5 rounded-xl transition-all"
            >
              {t("show_more")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl h-64 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((p, i) => (
                <div
                  key={p.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BARCHA MAHSULOTLAR ── */}
      <section className="py-16 bg-[#faf9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-[#4c1d95] font-black text-xs uppercase tracking-widest mb-3">
                <Star className="w-4 h-4 fill-[#8b5cf6] text-[#8b5cf6]" />
                {lang === "uz" ? "Barcha mahsulotlar" : "Все товары"}
              </div>
              <h2 className="text-3xl font-black text-[#4c1d95]">
                {lang === "uz"
                  ? "Barcha ijodiy ishlar"
                  : "Все творческие работы"}
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-black text-[#4c1d95] hover:text-white bg-white hover:bg-[#7c3aed] px-5 py-2.5 rounded-xl transition-all border border-[#4c1d95]/10"
            >
              {t("show_more")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl h-64 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((p, i) => (
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

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#7c3aed] hover:bg-[#4c1d95] text-white font-black px-10 py-4 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-[#7c3aed]/30"
            >
              {t("show_more")} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-[#4c1d95]">
              {lang === "uz" ? "Nima uchun biz?" : "Почему мы?"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-[#faf9ff] hover:bg-[#4c1d95] rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:shadow-[#4c1d95]/25 hover:-translate-y-1 border border-[#4c1d95]/6"
              >
                <div className="w-14 h-14 bg-[#ede9fe] group-hover:bg-[#ffffff] rounded-2xl flex items-center justify-center text-[#7c3aed] group-hover:text-[#3b0764] mx-auto mb-4 transition-all duration-300 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="font-black text-[#4c1d95] group-hover:text-white mb-2 transition-colors">
                  {lang === "uz" ? f.uz : f.ru}
                </h3>
                <p className="text-gray-500 group-hover:text-white/60 text-sm leading-relaxed transition-colors">
                  {lang === "uz" ? f.duz : f.dru}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
