import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ShoppingCart,
  Check,
  ArrowLeft,
  Tag,
  User,
  Package,
  Share2,
  MapPin,
  Phone,
  School,
} from "lucide-react";
import { useLangStore, useProductStore, useCartStore } from "../store";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLangStore();
  const { products, fetchProducts } = useProductStore();
  const { items, addItem } = useCartStore();

  // Sahifa to'g'ridan ochilsa mahsulotlar yo'q bo'lishi mumkin — yuklaymiz
  useEffect(() => {
    window.scrollTo(0, 0);
    if (products.length === 0) {
      fetchProducts();
    }
  }, [id]);

  const product = products.find((p) => p.id === Number(id));
  const inCart = items.some((i) => i.id === product?.id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-6xl mb-4">⏳</p>
          <p className="text-gray-500 mb-4">
            {lang === "uz" ? "Yuklanmoqda..." : "Загрузка..."}
          </p>
          <Link to="/products" className="text-purple-600 font-bold">
            {t("back")}
          </Link>
        </div>
      </div>
    );
  }

  const name = lang === "uz" ? product.name_uz : product.name_ru;
  const desc = lang === "uz" ? product.desc_uz : product.desc_ru;
  const classLabel = lang === "uz" ? product.class_uz : product.class_ru;
  const formatPrice = (p) => p.toLocaleString("uz-UZ");

  const handleAddCart = () => {
    addItem(product);
    toast.success(
      lang === "uz" ? "Savatga qo'shildi!" : "Добавлено в корзину!",
      {
        icon: "🛒",
        style: {
          borderRadius: "12px",
          fontFamily: "Nunito, sans-serif",
          fontWeight: "600",
        },
      }
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(
        lang === "uz" ? "Havola nusxalandi!" : "Ссылка скопирована!"
      );
    }
  };

  // Shu kategoriyadan boshqa mahsulotlar
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Orqaga */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-purple-600 text-sm font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t("back")}
        </button>

        <div className="grid lg:grid-cols-2 gap-10 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
          {/* Rasm */}
          <div className="relative rounded-2xl overflow-hidden aspect-square">
            <img
              src={product.image}
              alt={name}
              className="w-full h-full object-cover"
            />
            {/* Backend: is_new field */}
            {product.is_new && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-[#ffffff] to-[#8b5cf6] text-white text-sm font-bold px-3 py-1 rounded-lg">
                Yangi
              </span>
            )}
          </div>

          {/* Ma'lumotlar */}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-purple-500 uppercase tracking-wider mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl font-black text-[#4c1d95] mb-4 leading-tight font-serif">
              {name}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                <User className="w-4 h-4 text-[#4c1d95]" />
                <div>
                  <p className="text-xs text-gray-400">
                    {t("prod_by").replace(":", "")}
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {product.author}
                  </p>
                </div>
              </div>
              {classLabel && (
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                  <Tag className="w-4 h-4 text-[#4c1d95]" />
                  <div>
                    <p className="text-xs text-gray-400">
                      {lang === "uz" ? "Sinf" : "Класс"}
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      {classLabel}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                <Package className="w-4 h-4 text-[#4c1d95]" />
                <div>
                  <p className="text-xs text-gray-400">
                    {lang === "uz" ? "Omborda" : "В наличии"}
                  </p>
                  <p
                    className={`text-sm font-bold ${
                      product.stock > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} dona`
                      : t("prod_out")}
                  </p>
                </div>
              </div>
              {product.school && (
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                  <School className="w-4 h-4 text-[#4c1d95]" />
                  <div>
                    <p className="text-xs text-gray-400">
                      {lang === "uz" ? "Maktab" : "Школа"}
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      {product.school}
                    </p>
                  </div>
                </div>
              )}
              {product.district && (
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                  <MapPin className="w-4 h-4 text-[#4c1d95]" />
                  <div>
                    <p className="text-xs text-gray-400">
                      {lang === "uz" ? "Tuman / Shahar" : "Район / Город"}
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      {product.district}
                    </p>
                  </div>
                </div>
              )}
              {product.phone && (
                <div className="flex items-center gap-2 bg-[#ede9fe] px-4 py-2 rounded-xl">
                  <Phone className="w-4 h-4 text-[#4c1d95]" />
                  <div>
                    <p className="text-xs text-[#4c1d95]/60">
                      {lang === "uz" ? "Bog'lanish" : "Контакт"}
                    </p>
                    <a
                      href={`tel:${product.phone}`}
                      className="text-sm font-bold text-[#4c1d95] hover:underline"
                    >
                      {product.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Tavsif */}
            {desc && (
              <div className="mb-6">
                <h3 className="font-black text-[#4c1d95] mb-2">
                  {t("prod_description")}
                </h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            )}

            {/* Narx */}
            <div className="mb-6 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
              <p className="text-sm text-gray-500 mb-1">{t("prod_price")}</p>
              <p className="text-4xl font-black text-[#4c1d95]">
                {formatPrice(product.price)}{" "}
                <span className="text-lg text-gray-400">{t("sum")}</span>
              </p>
            </div>

            {/* Tugmalar */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => !inCart && handleAddCart()}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-black transition-all ${
                  inCart
                    ? "bg-green-100 text-green-700"
                    : product.stock === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#ffffff] text-[#4c1d95] hover:bg-[#8b5cf6] hover:scale-[1.02] shadow-lg shadow-yellow-200"
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="w-5 h-5" /> {t("prod_in_cart")}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> {t("prod_add_cart")}
                  </>
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-4 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {inCart && (
              <Link
                to="/cart"
                className="mt-3 text-center text-purple-600 font-bold text-sm hover:underline"
              >
                {lang === "uz" ? "Savatga o'tish →" : "Перейти в корзину →"}
              </Link>
            )}
          </div>
        </div>

        {/* O'xshash mahsulotlar */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black text-[#4c1d95] mb-6 font-serif">
              {lang === "uz" ? "Shunga o'xshash mahsulotlar" : "Похожие товары"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <div key={p.id} className="animate-fadeInUp">
                  <Link
                    to={`/products/${p.id}`}
                    className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group"
                  >
                    <div className="overflow-hidden aspect-[4/3]">
                      <img
                        src={p.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-sm text-gray-800 line-clamp-2 font-serif">
                        {lang === "uz" ? p.name_uz : p.name_ru}
                      </p>
                      <p className="text-purple-600 font-black mt-2">
                        {formatPrice(p.price)} {t("sum")}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
