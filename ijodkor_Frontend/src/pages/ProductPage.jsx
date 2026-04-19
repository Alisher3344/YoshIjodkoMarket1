import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  ArrowLeft,
  Minus,
  Plus,
  Package,
  MapPin,
  School,
  User,
  Copy,
  Check,
  Phone,
} from "lucide-react";
import useStore from "../store/useStore";
import { api } from "../services/api";
import ProductCard from "../components/product/ProductCard";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, addToCart, products, fetchProducts } = useStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [copied, setCopied] = useState(false);
  const [authorProducts, setAuthorProducts] = useState([]);

  // Mahsulot ma'lumotini yuklash
  useEffect(() => {
    setLoading(true);
    api.request
      ? api
          .request("GET", `/products/${id}`)
          .then((p) => {
            setProduct(p);
            setLoading(false);
          })
          .catch(() => setLoading(false))
      : fetch(`http://127.0.0.1:8000/api/products/${id}`)
          .then((r) => r.json())
          .then((p) => {
            setProduct(p);
            setLoading(false);
          })
          .catch(() => setLoading(false));

    window.scrollTo(0, 0);
  }, [id]);

  // Muallif boshqa mahsulotlarini yuklash
  useEffect(() => {
    if (product?.user_id) {
      api.getProductsByUser(product.user_id).then((list) => {
        // Joriy mahsulotni olib tashlash
        setAuthorProducts(list.filter((p) => p.id !== product.id));
      });
    }
  }, [product?.user_id]);

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
          <div className="flex items-center gap-2 mb-2">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="font-bold">{p.rating || 5}</span>
            <span className="text-gray-400">
              ({p.reviews || 0} {lang === "uz" ? "sharh" : "отзывов"})
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
            {name}
          </h1>

          {/* Narx */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-black text-[#1a56db]">
              {formatPrice(p.price)}
            </span>
            {p.oldPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(p.oldPrice)}
              </span>
            )}
          </div>

          {/* Muallif kartasi */}
          <div
            className={`rounded-2xl p-4 mb-5 ${
              isDisabled
                ? "bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200"
                : "bg-blue-50 border border-blue-100"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-16 h-16 rounded-full overflow-hidden border-4 ${
                  isDisabled ? "border-rose-300" : "border-blue-300"
                } bg-white flex-shrink-0`}
              >
                {p.authorAvatar ? (
                  <img
                    src={p.authorAvatar}
                    alt={authorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-100">
                    {isDisabled ? "❤️" : "🎓"}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-gray-800 truncate">
                  {authorName || "-"}
                </div>
                {schoolName && (
                  <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                    <School size={11} /> {schoolName}
                  </div>
                )}
                {p.grade && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    📚 {p.grade}-sinf
                  </div>
                )}
              </div>
            </div>

            {(districtName || regionName) && (
              <div className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                <MapPin size={11} />
                <span>
                  {[districtName, regionName].filter(Boolean).join(", ")}
                </span>
              </div>
            )}

            {/* Imkoniyati cheklangan — karta raqami */}
            {isDisabled && p.cardNumber && (
              <div className="bg-white rounded-xl p-3 mt-3 border-2 border-rose-200">
                <div className="text-xs font-bold text-rose-600 mb-2 uppercase flex items-center gap-1">
                  💳{" "}
                  {lang === "uz" ? "Yordam karta raqami" : "Номер карты помощи"}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 font-mono font-black text-base text-gray-800 tracking-wider">
                    {p.cardNumber}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-[#1a56db] hover:bg-[#1341a8] text-white"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={12} /> ✓
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> {lang === "uz" ? "Nusxa" : "Копия"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-4">
            <Package size={14} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {lang === "uz" ? "Mavjud" : "В наличии"}:{" "}
              <span className="font-bold text-green-600">
                {p.stock} {lang === "uz" ? "dona" : "шт"}
              </span>
            </span>
          </div>

          {/* Miqdor */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-bold text-gray-700">
              {lang === "uz" ? "Miqdor" : "Количество"}:
            </span>
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-2 hover:bg-gray-200 transition"
              >
                <Minus size={14} />
              </button>
              <span className="px-4 font-bold">{qty}</span>
              <button
                onClick={() => setQty(Math.min(p.stock, qty + 1))}
                className="p-2 hover:bg-gray-200 transition"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Tugmalar */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white py-3.5 rounded-xl font-black transition"
            >
              <ShoppingCart size={18} />
              {lang === "uz" ? "Savatga qo'shish" : "В корзину"}
            </button>
            <button
              onClick={() => {
                handleAddToCart();
                navigate("/checkout");
              }}
              className="flex-1 bg-[#f97316] hover:bg-[#c2570d] text-white py-3.5 rounded-xl font-black transition"
            >
              {lang === "uz" ? "Hoziroq olish" : "Купить сейчас"}
            </button>
          </div>
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
