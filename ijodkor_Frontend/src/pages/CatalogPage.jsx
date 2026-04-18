import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  Star,
  Plus,
  Minus,
  Share2,
  Heart,
  CheckCircle,
} from "lucide-react";
import useStore from "../store/useStore";
import ProductCard from "../components/product/ProductCard";
import DonationModal from "../components/ui/DonationModal";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang, addToCart, products, fetchProducts } = useStore();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState("desc");
  const [donateOpen, setDonateOpen] = useState(false);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, []);

  const product = products.find((p) => p.id === parseInt(id) || p.id === id);
  const isDisabled = product?.studentType === "disabled";

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-bold mb-4">
          {lang === "uz" ? "Mahsulot topilmadi" : "Товар не найден"}
        </h2>
        <button
          onClick={() => navigate("/catalog")}
          className="bg-[#1a56db] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1341a8] transition"
        >
          {t("catalog")}
        </button>
      </div>
    );
  }

  const name =
    lang === "uz" ? product.nameUz : product.nameRu || product.nameUz;
  const desc =
    lang === "uz" ? product.descUz : product.descRu || product.descUz;
  const author =
    lang === "uz" ? product.author : product.authorRu || product.author;
  const school =
    lang === "uz" ? product.school : product.schoolRu || product.school;
  const district =
    lang === "uz" ? product.district : product.districtRu || product.district;
  const region =
    lang === "uz" ? product.region : product.regionRu || product.region;
  const formatPrice = (n) => n.toLocaleString() + " so'm";
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a56db] mb-6 transition font-medium"
      >
        <ArrowLeft size={16} />
        {lang === "uz" ? "Orqaga" : "Назад"}
      </button>

      {/* Main */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Image */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl overflow-hidden aspect-square shadow-sm border border-gray-100 relative">
            <img
              src={product.image}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80";
              }}
            />
            {product.badge && (
              <span
                className={`absolute top-4 left-4 text-xs font-black uppercase px-3 py-1.5 rounded-full ${
                  product.badge === "new"
                    ? "bg-green-500"
                    : product.badge === "hit"
                    ? "bg-red-500"
                    : "bg-orange-500"
                } text-white`}
              >
                {t(product.badge)}
              </span>
            )}
            {discount > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              {name}
            </h1>
            {isDisabled ? (
              <span className="bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1">
                ❤️ {lang === "uz" ? "Maxsus ehtiyojli" : "Особые потребности"}
              </span>
            ) : (
              <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1">
                🌟 {lang === "uz" ? "Rag'bat" : "Поощрение"}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(product.rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200 fill-gray-200"
                  }
                />
              ))}
            </div>
            <span className="font-bold text-gray-700">{product.rating}</span>
            <span className="text-gray-400 text-sm">
              ({product.reviews} {lang === "uz" ? "sharh" : "отзывов"})
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-400 text-sm">
              📦 {product.sold || 0} {lang === "uz" ? "sotilgan" : "продано"}
            </span>
          </div>

          {/* Price */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#1a56db]">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            {discount > 0 && (
              <p className="text-green-600 text-sm font-semibold mt-1 flex items-center gap-1">
                <CheckCircle size={14} />
                {lang === "uz"
                  ? `${formatPrice(product.oldPrice - product.price)} tejaysiz!`
                  : `Вы экономите ${formatPrice(
                      product.oldPrice - product.price
                    )}!`}
              </p>
            )}
          </div>

          {/* Author info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {region && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">
                  {lang === "uz" ? "Viloyat" : "Область"}:
                </span>
                <span className="font-bold text-gray-800">{region}</span>
              </div>
            )}
            {district && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">
                  {lang === "uz" ? "Tuman" : "Район"}:
                </span>
                <span className="font-bold text-gray-800">{district}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">{t("school")}:</span>
              <span className="font-bold text-gray-800">{school}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">{t("grade")}:</span>
              <span className="font-bold text-gray-800">{product.grade}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">{t("author")}:</span>
              <span className="font-bold text-gray-800">{author}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">{t("inStock")}:</span>
              <span
                className={`font-bold ${
                  product.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} ${t("pieces")}`
                  : t("outOfStock")}
              </span>
            </div>
          </div>

          {/* Qty + Add to cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="text-gray-600 hover:text-[#1a56db] transition"
                >
                  <Minus size={18} />
                </button>
                <span className="w-8 text-center font-bold text-lg">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="text-gray-600 hover:text-[#1a56db] transition"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base transition ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-[#1a56db] hover:bg-[#1341a8] text-white"
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle size={18} />{" "}
                    {lang === "uz"
                      ? "Savatga qo'shildi!"
                      : "Добавлено в корзину!"}
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> {t("addToCart")}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Hozir sotib ol */}
          <button
            onClick={() => {
              if (product.stock > 0) {
                handleAdd();
                navigate("/checkout");
              }
            }}
            disabled={product.stock === 0}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition ${
              product.stock === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#f97316] hover:bg-[#c2570d] text-white"
            }`}
          >
            {t("buyNow")} →
          </button>

          {/* Nogiron o'quvchi uchun ehson tugmasi */}
          {isDisabled && (
            <button
              onClick={() => setDonateOpen(true)}
              className="w-full py-3.5 rounded-xl font-bold text-base bg-rose-500 hover:bg-rose-600 text-white transition flex items-center justify-center gap-2"
            >
              ❤️{" "}
              {lang === "uz"
                ? "Ehson qilish (kartaga pul o'tkazish)"
                : "Пожертвовать (перевод на карту)"}
            </button>
          )}

          <div className="flex gap-3">
            <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm transition">
              <Heart size={16} />
              {lang === "uz" ? "Sevimlilar" : "Избранное"}
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-[#1a56db] text-sm transition">
              <Share2 size={16} />
              {lang === "uz" ? "Ulashish" : "Поделиться"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex gap-4 border-b border-gray-100 mb-5">
          {[
            { key: "desc", label: t("description") },
            { key: "reviews", label: `${t("reviews")} (${product.reviews})` },
          ].map((tab_) => (
            <button
              key={tab_.key}
              onClick={() => setTab(tab_.key)}
              className={`pb-3 font-bold text-sm transition border-b-2 -mb-px ${
                tab === tab_.key
                  ? "text-[#1a56db] border-[#1a56db]"
                  : "text-gray-400 border-transparent"
              }`}
            >
              {tab_.label}
            </button>
          ))}
        </div>

        {tab === "desc" ? (
          <div>
            <p className="text-gray-700 leading-relaxed">{desc}</p>
            {/* Nogiron o'quvchi hikoyasi */}
            {isDisabled &&
              (lang === "uz" ? product.storyUz : product.storyRu) && (
                <div className="mt-4 bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-4">
                  {product.photo && (
                    <img
                      src={product.photo}
                      alt={name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border-2 border-rose-200"
                    />
                  )}
                  <div>
                    <p className="text-xs font-black text-rose-600 mb-1 flex items-center gap-1">
                      ❤️ {lang === "uz" ? "O'quvchi haqida" : "Об ученике"}
                    </p>
                    <p className="text-sm text-gray-700 italic leading-relaxed">
                      "{lang === "uz" ? product.storyUz : product.storyRu}"
                    </p>
                  </div>
                </div>
              )}
          </div>
        ) : (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex gap-3 pb-4 border-b border-gray-100 last:border-0"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {["👩", "👨", "🧑"][i]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">
                      {["Dilnoza K.", "Ahmad T.", "Sabohat M."][i]}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={11}
                          className="text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {
                      [
                        lang === "uz"
                          ? "Juda chiroyli ish! Farzandim juda xursand bo'ldi."
                          : "Очень красивая работа! Мой ребёнок очень обрадовался.",
                        lang === "uz"
                          ? "Sifat a'lo, tezda yetkazib berishdi. Tavsiya qilaman!"
                          : "Качество отличное, доставили быстро. Рекомендую!",
                        lang === "uz"
                          ? "Noyob sovg'a, hammaga maqul keldi."
                          : "Уникальный подарок, всем понравился.",
                      ][i]
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-black text-gray-800 mb-5">
            {t("related")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Donation modal */}
      {donateOpen && (
        <DonationModal product={product} onClose={() => setDonateOpen(false)} />
      )}
    </div>
  );
}
