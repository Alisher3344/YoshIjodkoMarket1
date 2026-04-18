import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { t, lang, cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useStore();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  const total = cartTotal();

  const formatPrice = (n) => n.toLocaleString() + " so'm";

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)}/>

      {/* Drawer */}
      <div className="relative bg-white w-full max-w-md h-full flex flex-col slide-cart shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-[#1a56db] text-white">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingBag size={20}/>
            {t('cartTitle')}
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{cart.reduce((s,i)=>s+i.qty,0)}</span>
          </h2>
          <button onClick={() => setCartOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition">
            <X size={20}/>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-bold text-gray-700 text-lg">{t('emptyCart')}</p>
              <p className="text-gray-400 text-sm mt-1">{t('emptyCartSub')}</p>
              <button
                onClick={() => { setCartOpen(false); navigate('/catalog'); }}
                className="mt-6 bg-[#1a56db] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#1341a8] transition"
              >
                {t('catalog')}
              </button>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
              <img
                src={item.image}
                alt={lang === 'uz' ? item.nameUz : item.nameRu}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm line-clamp-2 text-gray-800">
                  {lang === 'uz' ? item.nameUz : item.nameRu}
                </h4>
                <p className="text-[#1a56db] font-bold text-sm mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 bg-white rounded-lg border">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="p-1.5 hover:bg-gray-100 rounded-l-lg transition"
                    >
                      <Minus size={14}/>
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="p-1.5 hover:bg-gray-100 rounded-r-lg transition"
                    >
                      <Plus size={14}/>
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 transition p-1"
                  >
                    <X size={16}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4 space-y-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-700">{t('total')}:</span>
              <span className="font-black text-xl text-[#1a56db]">{formatPrice(total)}</span>
            </div>
            <button
              onClick={() => { setCartOpen(false); navigate('/checkout'); }}
              className="w-full bg-[#f97316] hover:bg-[#c2570d] text-white py-3.5 rounded-xl font-bold text-base transition"
            >
              {t('checkout')} →
            </button>
            <button
              onClick={() => setCartOpen(false)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-xl font-semibold text-sm transition"
            >
              {t('continueShopping')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
