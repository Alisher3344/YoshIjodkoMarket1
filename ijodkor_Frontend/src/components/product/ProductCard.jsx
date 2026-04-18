import { ShoppingCart, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import useStore from "../../store/useStore";

export default function ProductCard({ product }) {
  const { t, lang, addToCart } = useStore();

  const name =
    lang === "uz" ? product.name_uz : product.name_ru || product.name_uz;
  const author =
    lang === "uz" ? product.author : product.author_ru || product.author;
  const school =
    lang === "uz" ? product.school : product.school_ru || product.school;
  const formatPrice = (n) => n?.toLocaleString("uz-UZ") + " so'm";

  const isDisabled = product.student_type === "disabled";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group overflow-hidden">
      {/* Rasm */}
      <Link
        to={`/product/${product.id}`}
        className="block relative overflow-hidden"
      >
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.image || "https://via.placeholder.com/300"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300";
            }}
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge === "new" && (
            <span className="bg-[#1a56db] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {t("new")}
            </span>
          )}
          {product.badge === "hit" && (
            <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {t("hit")}
            </span>
          )}
          {product.badge === "sale" && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {t("sale")}
            </span>
          )}
          {isDisabled && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              ❤️
            </span>
          )}
        </div>

        {/* Stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-black px-3 py-1 rounded-full">
              {t("outOfStock")}
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-[#1a56db] transition mb-1">
            {name}
          </h3>
        </Link>

        <p className="text-xs text-gray-500 truncate">{author}</p>
        {school && <p className="text-xs text-gray-400 truncate">{school}</p>}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-1.5">
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-500 font-medium">
              {product.rating}
            </span>
            {product.reviews > 0 && (
              <span className="text-xs text-gray-400">({product.reviews})</span>
            )}
          </div>
        )}

        {/* Narx va tugma */}
        <div className="flex items-center justify-between mt-3 gap-2">
          <div>
            <p className="font-black text-gray-900 text-sm">
              {formatPrice(product.price)}
            </p>
            {product.old_price && (
              <p className="text-xs text-gray-400 line-through">
                {formatPrice(product.old_price)}
              </p>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 bg-[#1a56db] hover:bg-[#1341a8] disabled:bg-gray-300 text-white text-xs font-bold px-3 py-2 rounded-xl transition"
          >
            <ShoppingCart size={13} />
            {t("addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
}
