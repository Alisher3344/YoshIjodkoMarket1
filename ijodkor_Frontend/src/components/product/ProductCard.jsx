import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Eye, Heart, Copy, Check, X } from "lucide-react";
import useStore from "../../store/useStore";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { t, lang, addToCart } = useStore();
  const [cardOpen, setCardOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const name =
    lang === "uz" ? product.nameUz : product.nameRu || product.nameUz;
  const author =
    lang === "uz" ? product.author : product.authorRu || product.author;
  const school =
    lang === "uz" ? product.school : product.schoolRu || product.school;

  const isDisabled = product.studentType === "disabled";
  const formatPrice = (n) => (n || 0).toLocaleString() + " so'm";
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(product.cardNumber || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="product-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition cursor-pointer group relative"
      >
        {/* Image */}
        <div className="aspect-square bg-gray-50 overflow-hidden relative">
          <img
            src={
              product.image ||
              "https://placehold.co/400x400/e2e8f0/64748b?text=Rasm"
            }
            alt={name}
            className="w-full h-full object-cover product-img transition-transform duration-500"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400";
            }}
          />

          {/* Top-left badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badge === "new" && (
              <span className="bg-green-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                {t("new")}
              </span>
            )}
            {product.badge === "hit" && (
              <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                {t("hit")}
              </span>
            )}
            {product.badge === "sale" && (
              <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                {t("sale")}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Disabled marker — top right */}
          {isDisabled && (
            <div className="absolute top-2 right-2 bg-rose-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
              <Heart size={14} className="fill-white" />
            </div>
          )}

          {/* Quick view */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-white"
          >
            <Eye size={14} className="text-gray-700" />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-1">
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-gray-700">
                {product.rating}
              </span>
              <span className="text-xs text-gray-400">
                ({product.reviews || 0})
              </span>
            </div>
          )}

          {/* Name */}
          <h3 className="font-bold text-sm text-gray-800 line-clamp-2 leading-tight min-h-[2.5rem]">
            {name}
          </h3>

          {/* Author */}
          {author && (
            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
              👤 {author}
              {school && <span className="text-gray-400"> · {school}</span>}
            </div>
          )}

          {/* Price */}
          <div className="flex items-end justify-between mt-2">
            <div>
              <div className="text-base font-black text-[#1a56db] leading-tight">
                {formatPrice(product.price)}
              </div>
              {product.oldPrice && (
                <div className="text-gray-400 text-xs line-through">
                  {formatPrice(product.oldPrice)}
                </div>
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                product.stock === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#1a56db] hover:bg-[#1341a8] text-white shadow-md"
              }`}
            >
              <ShoppingCart size={14} />
            </button>
          </div>

          {/* Imkoniyati cheklangan — maxsus tugma */}
          {isDisabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCardOpen(true);
              }}
              className="w-full mt-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-black py-2 rounded-lg transition flex items-center justify-center gap-1"
            >
              <Heart size={12} className="fill-rose-500" />
              {lang === "uz" ? "Imkoniyati cheklangan" : "Особые потребности"}
            </button>
          )}
        </div>
      </div>

      {/* Card number modal */}
      {cardOpen && (
        <div
          onClick={() => setCardOpen(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-sm w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 relative">
              <button
                onClick={() => setCardOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                <X size={16} />
              </button>
              <div className="text-4xl mb-2">❤️</div>
              <h3 className="font-black text-lg mb-1">
                {lang === "uz"
                  ? "Imkoniyati cheklangan o'quvchi"
                  : "Ученик с особыми потребностями"}
              </h3>
              <p className="text-white/85 text-sm">
                {lang === "uz"
                  ? "To'g'ridan-to'g'ri karta raqamiga yordam yuborishingiz mumkin"
                  : "Вы можете помочь напрямую переводом на карту"}
              </p>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {product.photo ? (
                  <img
                    src={product.photo}
                    alt={author}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-rose-100 flex items-center justify-center text-2xl">
                    👤
                  </div>
                )}
                <div>
                  <div className="font-black text-gray-900">{author}</div>
                  <div className="text-xs text-gray-500">{school}</div>
                </div>
              </div>

              {product.cardNumber ? (
                <>
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 mb-3">
                    <div className="text-xs text-gray-500 font-semibold mb-1">
                      {lang === "uz" ? "Karta raqami" : "Номер карты"}
                    </div>
                    <div className="font-mono text-lg font-black text-gray-900 tracking-wider break-all">
                      {product.cardNumber}
                    </div>
                  </div>

                  <button
                    onClick={handleCopy}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black transition ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-rose-500 hover:bg-rose-600 text-white"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={16} />{" "}
                        {lang === "uz" ? "Nusxalandi!" : "Скопировано!"}
                      </>
                    ) : (
                      <>
                        <Copy size={16} />{" "}
                        {lang === "uz" ? "Nusxalash" : "Копировать"}
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500 text-sm">
                  {lang === "uz"
                    ? "Karta raqami kiritilmagan"
                    : "Номер карты не указан"}
                </div>
              )}

              <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                {lang === "uz"
                  ? "💝 Yordam bolalarning kelajagiga quvonch beradi"
                  : "💝 Помощь приносит радость будущему детей"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
