import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import useStore from "../../store/useStore";

export default function CartDrawer() {
  const {
    t,
    lang,
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQty,
    cartTotal,
  } = useStore();

  const total = cartTotal();
  const formatPrice = (n) => n.toLocaleString("uz-UZ") + " so'm";

  if (!cartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-black text-lg flex items-center gap-2">
            <ShoppingCart size={20} className="text-[#1a56db]" />
            {t("cartTitle")}
            {cart.length > 0 && (
              <span className="bg-[#1a56db] text-white text-xs font-black px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 font-medium">{t("emptyCart")}</p>
              <p className="text-gray-400 text-sm mt-1">{t("emptyCartSub")}</p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-6 bg-[#1a56db] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#1341a8] transition text-sm"
              >
                {t("catalog")}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-gray-50 rounded-2xl p-3"
              >
                <img
                  src={item.image || "https://via.placeholder.com/80"}
                  alt={lang === "uz" ? item.name_uz : item.name_ru}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {lang === "uz"
                      ? item.name_uz
                      : item.name_ru || item.name_uz}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.author}</p>
                  <p className="text-sm font-black text-[#1a56db] mt-1">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between gap-2">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-red-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-6 h-6 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold w-5 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-6 h-6 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t px-5 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">{t("total")}:</span>
              <span className="font-black text-xl text-gray-900">
                {formatPrice(total)}
              </span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setCartOpen(false)}
              className="block w-full bg-[#1a56db] hover:bg-[#1341a8] text-white py-3.5 rounded-xl font-black text-center transition"
            >
              {t("checkout")} →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
