import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useLangStore, useCartStore } from '../store'

export default function CartPage() {
  const { lang, t } = useLangStore()
  const { items, removeItem, updateQty, clearCart } = useCartStore()

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const formatPrice = (p) => p.toLocaleString('uz-UZ')

  const getName = (item) => lang === 'uz' ? item.name_uz : item.name_ru

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-black text-[#4c1d95] mb-3 font-serif">{t('cart_empty')}</h2>
          <p className="text-gray-500 mb-8">{t('cart_empty_sub')}</p>
          <Link to="/products"
            className="inline-flex items-center gap-2 bg-[#ffffff] text-[#4c1d95] font-bold px-7 py-3.5 rounded-2xl hover:bg-[#8b5cf6] transition-all hover:scale-105 shadow-lg shadow-yellow-200">
            {t('cart_continue')} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-[#4c1d95] font-serif">{t('cart_title')}</h1>
          <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors font-semibold">
            {lang === 'uz' ? 'Tozalash' : 'Очистить'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-5 flex gap-4 shadow-sm border border-gray-100">
                <img src={item.image} alt={getName(item)} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-2 leading-snug font-serif">
                    {getName(item)}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{item.author}</p>
                  <div className="flex items-center justify-between mt-3 gap-3">
                    {/* Qty control */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        disabled={item.qty <= 1}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-30 transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        disabled={item.qty >= item.stock}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-30 transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Price */}
                    <div className="text-right">
                      <p className="font-black text-[#4c1d95] text-base">{formatPrice(item.price * item.qty)}</p>
                      <p className="text-xs text-gray-400">{t('sum')}</p>
                    </div>
                    {/* Remove */}
                    <button onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-[#ede9fe] rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-black text-[#4c1d95] text-lg mb-5 font-serif">
                {lang === 'uz' ? 'Buyurtma xulosasi' : 'Итог заказа'}
              </h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{lang === 'uz' ? 'Mahsulotlar' : 'Товары'} ({items.reduce((s, i) => s + i.qty, 0)} ta)</span>
                  <span className="font-semibold">{formatPrice(total)} {t('sum')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{lang === 'uz' ? 'Yetkazib berish' : 'Доставка'}</span>
                  <span className="text-green-600 font-semibold">{lang === 'uz' ? 'Bepul' : 'Бесплатно'}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-black text-[#4c1d95] text-lg">
                  <span>{t('cart_total')}</span>
                  <span className="text-[#ffffff]">{formatPrice(total)} {t('sum')}</span>
                </div>
              </div>

              <Link to="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-[#ffffff] hover:bg-[#8b5cf6] font-black py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-yellow-200 text-base">
                {t('cart_checkout')} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/products"
                className="w-full mt-3 flex items-center justify-center text-gray-500 hover:text-[#ffffff] text-sm font-semibold py-2 transition-colors">
                ← {t('cart_continue')}
              </Link>

              {/* Payment icons */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center mb-3">{lang === 'uz' ? "To'lov usullari" : 'Способы оплаты'}</p>
                <div className="flex gap-2 justify-center">
                  {['Click', 'Payme', 'Uzum'].map(p => (
                    <span key={p} className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
