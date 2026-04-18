import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useLangStore, useProductStore } from '../../store'

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const { lang, t } = useLangStore()
  const { search } = useProductStore()
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const results = query.length > 1 ? search(query) : []

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen) return null

  const handleSelect = (id) => {
    navigate(`/products/${id}`)
    onClose()
  }

  const formatPrice = (p) => p.toLocaleString('uz-UZ')

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="flex-1 text-base outline-none text-gray-800 placeholder-gray-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          )}
          <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 text-sm font-medium">
            {t('back')}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {results.map(product => (
              <li key={product.id}>
                <button
                  onClick={() => handleSelect(product.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {lang === 'uz' ? product.name_uz : product.name_ru}
                    </p>
                    <p className="text-xs text-gray-500">{product.author} • {lang === 'uz' ? product.class_uz : product.class_ru}</p>
                  </div>
                  <span className="text-sm font-bold text-[#4c1d95] shrink-0">
                    {formatPrice(product.price)} {t('sum')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : query.length > 1 ? (
          <div className="py-12 text-center text-gray-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{t('no_products')}</p>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400 text-sm">
            {t('nav_search')}
          </div>
        )}
      </div>
    </div>
  )
}
