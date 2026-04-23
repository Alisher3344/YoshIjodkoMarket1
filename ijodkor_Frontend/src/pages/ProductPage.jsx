import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  ArrowLeft,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import useStore from "../store/useStore";
import { api } from "../services/api";
import ProductCard from "../components/product/ProductCard";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, addToCart } = useStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [copied, setCopied] = useState(false);
  const [authorProducts, setAuthorProducts] = useState([]);

  // Mahsulot ma'lumotini yuklash
  useEffect(() => {
    setLoading(true);
    api
      .getProduct(id)
      .then((p) => {
        setProduct(p);
        setLoading(false);
      })
      .catch((err) => {
        console.error("getProduct:", err.message);
        setProduct(null);
        setLoading(false);
      });

    window.scrollTo(0, 0);
  }, [id]);

  // O'quvchining (student) boshqa mahsulotlarini yuklash
  useEffect(() => {
    if (product?.student_id) {
      api
        .getStudentProducts(product.student_id)
        .then((list) => {
          setAuthorProducts(
            (list || []).filter((p) => p.id !== product.id)
          );
        })
        .catch(() => setAuthorProducts([]));
    } else if (product?.author && product?.user_id) {
      api
        .getProductsByUser(product.user_id)
        .then((list) => {
          setAuthorProducts(
            (list || []).filter(
              (p) => p.id !== product.id && p.author === product.author
            )
          );
        })
        .catch(() => setAuthorProducts([]));
    } else {
      setAuthorProducts([]);
    }
  }, [product?.student_id, product?.user_id, product?.author, product?.id]);

  // camelCase ga o'tkazish
  const p = product
    ? {
        ...product,
        nameUz: product.name_uz || product.nameUz,
        nameRu: product.name_ru || product.nameRu,
        descUz: product.desc_uz || product.descUz,
        descRu: product.desc_ru || product.descRu,
        authorRu: product.author_ru || product.authorRu,
        schoolRu: product.school_ru || product.schoolRu,
        districtRu: product.district_ru || product.districtRu,
        regionRu: product.region_ru || product.regionRu,
        studentType: product.student_type || product.studentType,
        cardNumber: product.card_number || product.cardNumber,
        storyUz: product.story_uz || product.storyUz,
        storyRu: product.story_ru || product.storyRu,
        authorAvatar: product.author_avatar || product.authorAvatar,
        illnessInfo: product.illness_info || product.illnessInfo,
        fullName: product.full_name || product.fullName,
        oldPrice: product.old_price || product.oldPrice,
      }
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-[#1a56db] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-xl font-bold mb-2">
          {lang === "uz" ? "Mahsulot topilmadi" : "Товар не найден"}
        </h2>
        <button
          onClick={() => navigate("/catalog")}
          className="mt-4 bg-[#1a56db] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1341a8] transition"
        >
          {lang === "uz" ? "Katalogga qaytish" : "Вернуться в каталог"}
        </button>
      </div>
    );
  }

  const isDisabled = p.studentType === "disabled";
  const name = lang === "uz" ? p.nameUz : p.nameRu || p.nameUz;
  const desc = lang === "uz" ? p.descUz : p.descRu || p.descUz;
  const authorName =
    lang === "uz" ? p.fullName || p.author || "" : p.authorRu || p.author || "";
  const schoolName =
    lang === "uz" ? p.school || "" : p.schoolRu || p.school || "";
  const districtName =
    lang === "uz" ? p.district || "" : p.districtRu || p.district || "";
  const regionName =
    lang === "uz" ? p.region || "" : p.regionRu || p.region || "";
  const story =
    lang === "uz"
      ? p.storyUz || p.illnessInfo || ""
      : p.storyRu || p.illnessInfo || "";

  const formatPrice = (n) => (n || 0).toLocaleString("uz-UZ") + " so'm";

  const handleCopy = () => {
    navigator.clipboard.writeText((p.cardNumber || "").replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(p);
    alert(
      lang === "uz"
        ? `✅ Savatga qo'shildi (${qty} dona)`
        : `✅ Добавлено в корзину (${qty} шт)`
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a56db] mb-5 font-medium"
      >
        <ArrowLeft size={16} /> {lang === "uz" ? "Orqaga" : "Назад"}
      </button>

      {/* Asosiy bo'lim */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Rasm */}
        <div className="bg-white rounded-3xl p-4 border border-gray-100 relative">
          {p.badge && (
            <div className="absolute top-5 left-5 z-10">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  p.badge === "new"
                    ? "bg-green-500 text-white"
                    : p.badge === "hit"
                    ? "bg-orange-500 text-white"
                    : p.badge === "sale"
                    ? "bg-red-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {p.badge}
              </span>
            </div>
          )}
          {isDisabled && (
            <div className="absolute top-5 right-5 z-10 bg-rose-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Heart size={16} className="fill-white" />
            </div>
          )}
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
            {p.image ? (
              <img
                src={p.image}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                📦
              </div>
            )}
          </div>
        </div>

        {/* Ma'lumot */}
        <div>
          {/* Mahsulot nomi + avatar + "Maxsus ehtiyojli" badge */}
          <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900">
                  {name}
                </h1>
                {isDisabled && (
                  <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1 whitespace-nowrap mt-1">
                    ❤️ {lang === "uz" ? "Maxsus ehtiyojli" : "Особый"}
                  </span>
                )}
              </div>
              {authorName && (
                <div className="text-sm text-gray-500 mt-2 flex items-center gap-1.5">
                  <span>✍️</span>
                  <span className="font-semibold">{authorName}</span>
                </div>
              )}
            </div>

            {/* O'quvchi profil rasmi */}
            <div
              className={`w-20 h-20 rounded-2xl overflow-hidden border-4 ${
                isDisabled ? "border-rose-300" : "border-blue-200"
              } bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 shadow-md`}
              title={authorName}
            >
              {p.authorAvatar ? (
                <img
                  src={p.authorAvatar}
                  alt={authorName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-3xl">${
                      isDisabled ? "❤️" : "🎓"
                    }</div>`;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  {isDisabled ? "❤️" : "🎓"}
                </div>
              )}
            </div>
          </div>

          {/* Rating yulduzchalari */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      star <= Math.round(p.rating || 5)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }
                  />
                ))}
              </div>
              <span className="font-bold text-gray-800">{p.rating || 5}</span>
              <span className="text-gray-400 text-sm">
                ({p.reviews || 0} {lang === "uz" ? "sharh" : "отзывов"})
              </span>
            </div>

            {p.sold > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span>🎖️</span>
                  <span className="font-bold">{p.sold}</span>
                  <span>{lang === "uz" ? "sotilgan" : "продано"}</span>
                </div>
              </>
            )}
          </div>

          {/* Narx bloki */}
          <div className="bg-blue-50 rounded-2xl p-5 mb-5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#1a56db]">
                {formatPrice(p.price)}
              </span>
              {p.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(p.oldPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Ma'lumotlar jadvali */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-5">
            {regionName && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">
                  {lang === "uz" ? "Viloyat:" : "Область:"}
                </span>
                <span className="font-bold text-gray-800 text-sm">
                  {regionName}
                </span>
              </div>
            )}
            {districtName && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">
                  {lang === "uz" ? "Tuman:" : "Район:"}
                </span>
                <span className="font-bold text-gray-800 text-sm">
                  {districtName}
                </span>
              </div>
            )}
            {schoolName && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">
                  {lang === "uz" ? "Maktab:" : "Школа:"}
                </span>
                <span className="font-bold text-gray-800 text-sm">
                  {schoolName}
                </span>
              </div>
            )}
            {p.grade && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">
                  {lang === "uz" ? "Sinf:" : "Класс:"}
                </span>
                <span className="font-bold text-gray-800 text-sm">
                  {p.grade}
                </span>
              </div>
            )}
            {authorName && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">
                  {lang === "uz" ? "Muallif:" : "Автор:"}
                </span>
                <span className="font-bold text-gray-800 text-sm">
                  {authorName}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-gray-500 text-sm">
                {lang === "uz" ? "Mavjud:" : "В наличии:"}
              </span>
              <span
                className={`font-bold text-sm ${
                  p.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {p.stock} {lang === "uz" ? "dona" : "шт"}
              </span>
            </div>
          </div>

          {/* Miqdor + Savat */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-2.5 hover:bg-gray-200 transition"
              >
                <Minus size={14} />
              </button>
              <span className="px-4 font-bold min-w-[40px] text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty(Math.min(p.stock, qty + 1))}
                className="p-2.5 hover:bg-gray-200 transition"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white py-3 rounded-xl font-black transition"
            >
              <ShoppingCart size={18} />
              {lang === "uz" ? "Savatga qo'shish" : "В корзину"}
            </button>
          </div>

          {/* Hozir sotib ol */}
          <button
            onClick={() => {
              handleAddToCart();
              navigate("/checkout");
            }}
            className="w-full bg-[#f97316] hover:bg-[#c2570d] text-white py-3.5 rounded-xl font-black transition mb-3"
          >
            {lang === "uz" ? "Hozir sotib ol →" : "Купить сейчас →"}
          </button>

          {/* Ehson qilish (faqat imkoniyati cheklangan uchun) */}
          {isDisabled && p.cardNumber && (
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3.5 rounded-xl font-black transition"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  {lang === "uz" ? "Karta nusxalandi!" : "Карта скопирована!"}
                </>
              ) : (
                <>
                  ❤️{" "}
                  {lang === "uz"
                    ? "Ehson qilish (kartaga pul o'tkazish)"
                    : "Пожертвовать (перевод на карту)"}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-10">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setTab("desc")}
            className={`flex-1 py-3 font-bold text-sm transition ${
              tab === "desc"
                ? "border-b-2 border-[#1a56db] text-[#1a56db]"
                : "text-gray-500"
            }`}
          >
            {lang === "uz" ? "Tavsif" : "Описание"}
          </button>
          {isDisabled && story && (
            <button
              onClick={() => setTab("story")}
              className={`flex-1 py-3 font-bold text-sm transition ${
                tab === "story"
                  ? "border-b-2 border-rose-500 text-rose-500"
                  : "text-gray-500"
              }`}
            >
              ❤️ {lang === "uz" ? "Hikoya" : "История"}
            </button>
          )}
        </div>

        <div className="p-6">
          {tab === "desc" && (
            <div className="text-gray-700 text-sm whitespace-pre-line">
              {desc ||
                (lang === "uz" ? "Tavsif mavjud emas" : "Описание отсутствует")}
            </div>
          )}
          {tab === "story" && (
            <div className="text-gray-700 text-sm whitespace-pre-line">
              {story}
            </div>
          )}
        </div>
      </div>

      {/* Muallif boshqa mahsulotlari */}
      {authorProducts.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-4">
            {lang === "uz"
              ? `👤 ${authorName} ning boshqa mahsulotlari`
              : `👤 Другие товары от ${authorName}`}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {authorProducts.slice(0, 8).map((ap) => {
              const prod = {
                ...ap,
                nameUz: ap.name_uz,
                nameRu: ap.name_ru,
                studentType: ap.student_type,
                cardNumber: ap.card_number,
                authorAvatar: ap.author_avatar,
                fullName: ap.full_name,
                authorRu: ap.author_ru,
                schoolRu: ap.school_ru,
              };
              return <ProductCard key={ap.id} product={prod} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
