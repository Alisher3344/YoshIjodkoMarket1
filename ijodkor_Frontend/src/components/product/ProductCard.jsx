import { ShoppingCart, Heart, Star, MapPin, School } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useStore from "../../store/useStore";

export default function ProductCard({ product }) {
  const { lang, addToCart } = useStore();
  const navigate = useNavigate();
  const [showDonation, setShowDonation] = useState(false);

  const isDisabled =
    product.studentType === "disabled" || product.student_type === "disabled";
  const authorAvatar =
    product.authorAvatar || product.author_avatar || product.photo || "";
  const authorName =
    lang === "uz"
      ? product.fullName || product.full_name || product.author || ""
      : product.authorRu || product.author_ru || product.author || "";
  const authorSchool =
    lang === "uz"
      ? product.school || ""
      : product.schoolRu || product.school || "";
  const authorGrade = product.grade || "";
  const authorDistrict =
    lang === "uz"
      ? product.district || ""
      : product.districtRu || product.district || "";
  const authorRegion =
    lang === "uz"
      ? product.region || ""
      : product.regionRu || product.region || "";
  const illnessInfo = product.illnessInfo || product.illness_info || "";

  const name =
    lang === "uz"
      ? product.nameUz || product.name_uz
      : product.nameRu || product.name_ru || product.nameUz || product.name_uz;

  const formatPrice = (n) => (n || 0).toLocaleString("uz-UZ") + " so'm";

  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <>
      <div className="product-card bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all group relative flex flex-col">
        <div
          onClick={() => navigate(`/product/${product.id}`)}
          className="aspect-square bg-gray-100 relative cursor-pointer rounded-t-2xl"
        >
          <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
            {product.image ? (
              <img
                src={product.image}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/400x400/e2e8f0/64748b?text=Rasm";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                📦
              </div>
            )}
          </div>

          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.badge === "new" && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[11px] font-black uppercase shadow-md">
                {lang === "uz" ? "YANGI" : "НОВЫЙ"}
              </span>
            )}
            {product.badge === "sale" && (
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[11px] font-black uppercase shadow-md">
                {lang === "uz" ? "CHEGIRMA" : "СКИДКА"}
              </span>
            )}
            {product.badge === "hit" && (
              <span className="bg-orange-400 text-white px-3 py-1 rounded-full text-[11px] font-black uppercase shadow-md flex items-center gap-1">
                🏆 {lang === "uz" ? "Rag'bat" : "ХИТ"}
              </span>
            )}
            {isDisabled && (
              <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-3 py-1 rounded-full text-[11px] font-black shadow-md flex items-center gap-1">
                ❤️ {lang === "uz" ? "Imkoniyati cheklangan" : "Особый"}
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
            {hasDiscount && (
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-black shadow-md">
                -{discountPercent}%
              </span>
            )}
            <button
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:bg-rose-50 transition"
            >
              <Heart size={15} className="text-gray-400 hover:text-rose-500" />
            </button>
          </div>

          {isDisabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDonation(true);
              }}
              className="absolute left-1/2 -bottom-10 -translate-x-1/2 z-30"
              title={lang === "uz" ? "Batafsil" : "Подробнее"}
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-rose-100 to-pink-100 hover:scale-110 transition-transform">
                {authorAvatar ? (
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML =
                        '<div class="w-full h-full flex items-center justify-center text-3xl">❤️</div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    ❤️
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 right-0 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md z-40">
                <Heart size={10} className="fill-white" />
              </div>
            </button>
          )}
        </div>

        <div
          className={`p-3 flex flex-col flex-1 ${
            isDisabled ? "pt-12" : "pt-3"
          }`}
        >
          {(authorRegion || authorDistrict) && (
            <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <MapPin size={10} className="text-[#1a56db] flex-shrink-0" />
              <span className="truncate">
                {[authorRegion, authorDistrict].filter(Boolean).join(", ")}
              </span>
            </div>
          )}

          {(authorSchool || authorGrade) && (
            <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
              <School size={10} className="flex-shrink-0" />
              <span className="truncate">
                {authorSchool}
                {authorGrade &&
                  ` · ${
                    lang === "uz"
                      ? `Sinf ${authorGrade}`
                      : `Класс ${authorGrade}`
                  }`}
              </span>
            </div>
          )}

          <h3
            onClick={() => navigate(`/product/${product.id}`)}
            className="font-black text-sm text-gray-900 line-clamp-2 mb-2 min-h-[40px] cursor-pointer hover:text-[#1a56db] transition"
          >
            {name}
          </h3>

          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-gray-700">
                {product.rating || 5}
              </span>
              <span className="text-[10px] text-gray-400">
                ({product.reviews || 0})
              </span>
            </div>
            {product.sold > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                🎖️ <span className="font-bold">{product.sold}</span>
              </div>
            )}
          </div>

          {authorName && (
            <div className="text-xs text-gray-600 mb-2 line-clamp-1">
              ✍️ <span className="font-semibold">{authorName}</span>
            </div>
          )}

          <div className="flex items-baseline gap-2 mb-3 mt-auto">
            <span className="text-[#1a56db] font-black text-base">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {isDisabled && (
              <button
                onClick={() => setShowDonation(true)}
                className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-2.5 rounded-xl text-sm font-black shadow-md hover:shadow-lg transition"
              >
                ❤️ {lang === "uz" ? "Imkoniyati cheklangan" : "Особый"}
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white py-2.5 rounded-xl text-sm font-bold transition"
            >
              <ShoppingCart size={14} />
              {lang === "uz" ? "Savatga qo'shish" : "В корзину"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal — FAQAT kasallik haqida ma'lumot */}
      {showDonation && (
        <div
          onClick={() => setShowDonation(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 text-center relative">
              <button
                onClick={() => setShowDonation(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition text-xl font-bold"
              >
                ×
              </button>
              <div className="w-28 h-28 rounded-full bg-white/25 mx-auto mb-3 overflow-hidden border-4 border-white/50 shadow-xl">
                {authorAvatar ? (
                  <img
                    src={authorAvatar}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    ❤️
                  </div>
                )}
              </div>
              <h3 className="font-black text-2xl mb-1">{authorName}</h3>
              {authorSchool && (
                <div className="text-white/85 text-sm">🏫 {authorSchool}</div>
              )}
              {authorGrade && (
                <div className="text-white/80 text-xs mt-1">
                  📚 {authorGrade}-sinf
                </div>
              )}
            </div>

            <div className="p-6">
              {/* Kasallik haqida ma'lumot */}
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-3">
                  <Heart size={14} className="fill-rose-500 text-rose-500" />
                  {lang === "uz" ? "Kasallik haqida ma'lumot" : "О заболевании"}
                </div>
                {illnessInfo ? (
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {illnessInfo}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    {lang === "uz"
                      ? "Kasallik haqida ma'lumot yo'q"
                      : "Нет информации о заболевании"}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowDonation(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm transition"
                >
                  {lang === "uz" ? "Yopish" : "Закрыть"}
                </button>
                <button
                  onClick={() => {
                    setShowDonation(false);
                    navigate(`/product/${product.id}`);
                  }}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 rounded-xl font-black text-sm transition"
                >
                  {lang === "uz" ? "To'liq ma'lumot" : "Подробнее"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
