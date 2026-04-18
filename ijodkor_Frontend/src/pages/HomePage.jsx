import { useState, useEffect } from "react";
import {
  ArrowRight,
  Shield,
  Truck,
  CreditCard,
  Award,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import { featuredCategories } from "../components/ui/data/products";
import { categoryLabels } from "../components/ui/data/translations";
import ProductCard from "../components/product/ProductCard";

export default function HomePage() {
  const {
    t,
    lang,
    setSelectedCategory,
    products: apiProducts,
    fetchProducts,
  } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState("new");

  useEffect(() => {
    fetchProducts();
  }, []);

  const allProds = apiProducts || [];
  const cats = categoryLabels[lang];
  const newProds = [...allProds].sort((a, b) => b.id - a.id).slice(0, 8);
  const hitProds = [...allProds]
    .filter((p) => p.badge === "hit" || p.sold > 10)
    .slice(0, 8);
  const displayProds = tab === "new" ? newProds : hitProds;
  const handleCat = (key) => {
    setSelectedCategory(key);
    navigate("/catalog");
  };

  const features = [
    {
      icon: <Truck size={22} />,
      titleUz: "Bepul yetkazib berish",
      titleRu: "Бесплатная доставка",
      descUz: "100 000 so'mdan yuqori buyurtmalarda",
      descRu: "При заказе от 100 000 сум",
    },
    {
      icon: <Shield size={22} />,
      titleUz: "Kafolat beriladi",
      titleRu: "Гарантия качества",
      descUz: "Har bir mahsulot sifatli",
      descRu: "Каждый товар качественный",
    },
    {
      icon: <CreditCard size={22} />,
      titleUz: "Onlayn to'lov",
      titleRu: "Онлайн оплата",
      descUz: "Click, Payme, Uzum",
      descRu: "Click, Payme, Uzum",
    },
    {
      icon: <Award size={22} />,
      titleUz: "O'quvchilar ijodi",
      titleRu: "Творчество учеников",
      descUz: "100% qo'lda yasalgan",
      descRu: "100% ручная работа",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* Main hero — bitta katta motivatsion rasm */}
          <div
            className="lg:col-span-3 relative rounded-2xl overflow-hidden"
            style={{ minHeight: 320 }}
          >
            <img
              src="/hero-banner.png"
              alt="Maxsus ehtiyojli bolalar"
              className="absolute inset-0 w-full h-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b6e]/75 via-[#1a3a9e]/40 to-transparent" />

            <div
              className="relative z-10 p-8 md:p-12 flex flex-col justify-center"
              style={{ minHeight: 320 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#f97316] text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit">
                  <Star size={12} className="fill-white" />
                  {lang === "uz"
                    ? "Maxsus ehtiyojli bolalar ijodi"
                    : "Творчество детей с особыми потребностями"}
                </span>
              </div>

              <h1 className="text-white font-black text-2xl md:text-4xl leading-tight mb-3 max-w-lg">
                {lang === "uz"
                  ? "Har bir bola — iste'dod! Imkoniyat cheklanmaydi!"
                  : "Каждый ребёнок — талант! Возможности безграничны!"}
              </h1>
              <p className="text-white/85 text-sm md:text-base mb-6 max-w-md leading-relaxed">
                {lang === "uz"
                  ? "Maxsus ehtiyojli o'quvchilarimiz yaratgan noyob ijod asarlarini qo'llab-quvvatlang. Har bir xarid — bu bolaning qalbiga quvonch va kelajakka umid beradi."
                  : "Поддержите уникальные творческие работы учеников с особыми потребностями. Каждая покупка — радость ребёнку и надежда на будущее."}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/catalog")}
                  className="bg-[#f97316] hover:bg-[#c2570d] text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition text-sm"
                >
                  {lang === "uz"
                    ? "Ijod asarlarini ko'rish"
                    : "Смотреть работы"}{" "}
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl transition text-sm backdrop-blur-sm border border-white/30"
                >
                  {lang === "uz" ? "Biz haqimizda" : "О нас"}
                </button>
              </div>

              <div className="flex gap-6 mt-7">
                {[
                  { num: "200+", labelUz: "O'quvchi", labelRu: "Учеников" },
                  { num: "15+", labelUz: "Maktab", labelRu: "Школ" },
                  { num: "500+", labelUz: "Ijod asari", labelRu: "Работ" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-white font-black text-xl">{s.num}</div>
                    <div className="text-white/60 text-xs">
                      {lang === "uz" ? s.labelUz : s.labelRu}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side panel — Imkoniyati cheklangan o'quvchilar reytingi */}
          <div className="flex flex-col gap-3">
            {/* Sarlavha */}
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-4 text-white text-center">
              <div className="text-2xl mb-1">🏆</div>
              <div className="font-black text-sm leading-tight">
                {lang === "uz"
                  ? "Imkoniyati cheklangan o'quvchilar reytingi"
                  : "Рейтинг учеников с ограниченными возможностями"}
              </div>
              <div className="text-white/70 text-[10px] mt-1">
                {lang === "uz"
                  ? "O'quv yili reytingi"
                  : "Рейтинг учебного года"}
              </div>
            </div>

            {/* Top 3 */}
            {(() => {
              const disabledProds = allProds.filter(
                (p) => p.studentType === "disabled"
              );
              const authorMap = {};
              disabledProds.forEach((p) => {
                const key = p.author;
                if (!authorMap[key]) {
                  authorMap[key] = {
                    author: p.author,
                    authorRu: p.authorRu || p.author,
                    school: p.school,
                    schoolRu: p.schoolRu || p.school,
                    photo: p.photo,
                    totalSold: 0,
                    totalRevenue: 0,
                    rating: p.rating,
                  };
                }
                authorMap[key].totalSold += p.sold || 0;
                authorMap[key].totalRevenue += (p.sold || 0) * p.price;
              });
              const ranked = Object.values(authorMap)
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .slice(0, 3);
              const medals = ["🥇", "🥈", "🥉"];
              const medalColors = [
                "bg-gradient-to-br from-yellow-400 to-amber-500",
                "bg-gradient-to-br from-gray-300 to-gray-400",
                "bg-gradient-to-br from-amber-600 to-orange-700",
              ];

              if (ranked.length === 0) {
                return (
                  <div className="bg-white rounded-2xl p-4 text-center text-gray-400 text-sm flex-1">
                    {lang === "uz" ? "Hali ma'lumot yo'q" : "Данных пока нет"}
                  </div>
                );
              }

              return ranked.map((s, i) => (
                <div
                  key={i}
                  className={`${medalColors[i]} rounded-2xl p-3 text-white flex items-center gap-3`}
                >
                  {s.photo ? (
                    <img
                      src={s.photo}
                      alt={s.author}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-white/60 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                      👤
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-black text-sm leading-tight truncate">
                      {lang === "uz" ? s.author : s.authorRu}
                    </div>
                    <div className="text-white/75 text-[10px] truncate">
                      {lang === "uz" ? s.school : s.schoolRu}
                    </div>
                    <div className="text-white/90 text-[11px] font-bold mt-0.5">
                      {s.totalRevenue.toLocaleString()} so'm
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="text-2xl">{medals[i]}</div>
                    <div className="bg-white/25 rounded-lg px-2 py-0.5 text-xs font-black">
                      {s.totalSold} {lang === "uz" ? "ta" : "шт"}
                    </div>
                  </div>
                </div>
              ));
            })()}

            {/* Maxsus sovg'a info */}
            <div className="bg-white border-2 border-rose-200 rounded-2xl p-3 text-center">
              <div className="text-xl mb-1">🎁</div>
              <div className="text-xs font-black text-rose-600">
                {lang === "uz" ? "O'quv yili oxirida" : "В конце учебного года"}
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                {lang === "uz"
                  ? "Top 3 o'quvchiga maxsus sovg'a!"
                  : "Топ-3 получат специальный подарок!"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-gray-800">
            {t("categories")}
          </h2>
          <button
            onClick={() => navigate("/catalog")}
            className="text-[#1a56db] text-sm font-semibold flex items-center gap-1 hover:underline"
          >
            {t("viewAll")} <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {featuredCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCat(cat.key)}
              className={`${cat.color} border rounded-2xl p-4 text-center transition-all hover:scale-105 hover:shadow-md`}
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <div className="text-xs font-bold text-gray-700 leading-tight">
                {cats[cat.key]?.replace(/^.{2}/, "").trim()}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Products section */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setTab("new")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                tab === "new"
                  ? "bg-white shadow text-[#1a56db]"
                  : "text-gray-500"
              }`}
            >
              {t("newProducts")}
            </button>
            <button
              onClick={() => setTab("hit")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                tab === "hit"
                  ? "bg-white shadow text-[#1a56db]"
                  : "text-gray-500"
              }`}
            >
              {t("popularProducts")}
            </button>
          </div>
          <button
            onClick={() => navigate("/catalog")}
            className="text-[#1a56db] text-sm font-semibold flex items-center gap-1 hover:underline"
          >
            {t("viewAll")} <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {displayProds.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Bottom promo banner */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="hero-gradient rounded-2xl p-8 md:p-12 text-center text-white">
          <div className="text-5xl mb-4">🏫</div>
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            {lang === "uz" ? "Maktabingizni qo'shing!" : "Добавьте свою школу!"}
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            {lang === "uz"
              ? "O'quvchilaringiz ijodini butun Qashqadaryoga namoyish eting va qo'shimcha daromad oling"
              : "Представьте творчество учеников всей Кашкадарье и получайте дополнительный доход"}
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="bg-white text-[#1a56db] font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            {lang === "uz" ? "Bog'lanish" : "Связаться с нами"}
          </button>
        </div>
      </section>
    </div>
  );
}
