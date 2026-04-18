import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Check, Eye } from 'lucide-react'
import { useLangStore, useCartStore } from '../../store'

export default function ProductCard({ product }) {
  const { lang, t } = useLangStore()
  const navigate = useNavigate()
  const { items, addItem } = useCartStore()
  const inCart = items.some(i => i.id === product.id)
  const name = lang === 'uz' ? product.name_uz : product.name_ru
  const classLabel = lang === 'uz' ? product.class_uz : product.class_ru
  const fmt = (p) => p.toLocaleString('uz-UZ')

  return (
    <div className="product-card bg-white rounded-2xl overflow-hidden border border-[#4c1d95]/8 hover:border-[#8b5cf6]/30 hover:shadow-xl hover:shadow-[#4c1d95]/10 transition-all duration-300 group">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img src={product.image} alt={name}
          className="product-img w-full h-full object-cover transition-transform duration-500" loading="lazy" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2.5 py-1 text-xs font-black text-white rounded-lg bg-[#7c3aed] shadow-lg">
              Yangi
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2.5 py-1 text-xs font-bold text-white rounded-lg bg-gray-400">
              {t('prod_out')}
            </span>
          )}
        </div>
        <Link to={`/products/${product.id}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-[#4c1d95]/40 backdrop-blur-[2px] transition-all duration-300">
          <span className="flex items-center gap-2 bg-white text-[#4c1d95] text-sm font-black px-5 py-2.5 rounded-full shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="w-4 h-4" /> {t('prod_view')}
          </span>
        </Link>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-[#4c1d95]/40 uppercase tracking-wider">{product.category}</span>
          <span className="text-xs text-gray-400 font-semibold">{classLabel}</span>
        </div>
        <h3 className="font-black text-[#1e1b2e] text-sm mb-1 line-clamp-2 leading-snug font-serif">{name}</h3>
        <p className="text-xs text-gray-400 mb-3 font-semibold">{t('prod_by')} {product.author}</p>

        {product.stock > 0 && product.stock <= 3 && (
          <p className="text-xs text-amber-500 font-black mb-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {product.stock} {t('prod_stock')}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xl font-black text-[#4c1d95] leading-none">{fmt(product.price)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('sum')}</p>
          </div>
          <button
            onClick={() => product.stock > 0 && addItem(product)}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${
              inCart
                ? 'bg-green-100 text-green-700 cursor-default'
                : product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#7c3aed] hover:bg-[#4c1d95] text-white hover:scale-105 active:scale-95 shadow-lg shadow-[#7c3aed]/30'
            }`}>
            {inCart
              ? <><Check className="w-3.5 h-3.5" />{t('prod_in_cart')}</>
              : <><ShoppingCart className="w-3.5 h-3.5" />{t('prod_add_cart')}</>}
          </button>
        </div>

        {/* Custom order button */}
        <button
          onClick={() => navigate(`/custom-order?type=${product.category}`)}
          className="w-full mt-2 py-2 rounded-xl text-xs font-bold text-[#4c1d95]/60 hover:text-[#4c1d95] hover:bg-[#ede9fe] transition-all border border-dashed border-[#4c1d95]/20 hover:border-[#4c1d95]/40">
          {lang === 'uz' ? "🎨 Shunga o'xshash buyurtma berish" : '🎨 Заказать похожее'}
        </button>
      </div>
    </div>
  )
}
