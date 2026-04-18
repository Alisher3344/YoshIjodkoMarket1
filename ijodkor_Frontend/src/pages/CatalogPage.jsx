import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import useStore from '../store/useStore';
import { products as seedProducts } from '../data/products';
import { categoryLabels } from '../data/translations';
import ProductCard from '../components/product/ProductCard';

export default function CatalogPage() {
  const { t, lang, selectedCategory, setSelectedCategory, sortBy, setSortBy, searchQuery, products: apiProducts, fetchProducts } = useStore();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const cats = categoryLabels[lang];
  const allProds = apiProducts && apiProducts.length > 0 ? apiProducts : seedProducts;

  const filtered = useMemo(() => {
    let list = [...allProds];

    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.nameUz.toLowerCase().includes(q) ||
        p.nameRu.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q)
      );
    }

    if (priceFrom) list = list.filter(p => p.price >= parseInt(priceFrom));
    if (priceTo) list = list.filter(p => p.price <= parseInt(priceTo));

    switch (sortBy) {
      case 'priceLow': list.sort((a, b) => a.price - b.price); break;
      case 'priceHigh': list.sort((a, b) => b.price - a.price); break;
      case 'popular': list.sort((a, b) => (b.sold || 0) - (a.sold || 0)); break;
      default: list.sort((a, b) => b.id - a.id);
    }

    return list;
  }, [allProds, selectedCategory, searchQuery, priceFrom, priceTo, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceFrom('');
    setPriceTo('');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className={`md:w-56 flex-shrink-0 ${filtersOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-800">{t('filters')}</h3>
              <button onClick={resetFilters} className="text-xs text-[#1a56db] hover:underline font-semibold">{t('reset')}</button>
            </div>

            {/* Categories */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t('categories')}</h4>
              <div className="space-y-1">
                {Object.entries(cats).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition font-medium flex items-center justify-between ${
                      selectedCategory === key
                        ? 'bg-[#1a56db] text-white'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <span>{label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {key === 'all' ? allProds.length : allProds.filter(p => p.category === key).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t('price')}</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={t('priceFrom')}
                  value={priceFrom}
                  onChange={e => setPriceFrom(e.target.value)}
                  className="w-1/2 border border-gray-200 rounded-lg px-2 py-2 text-xs outline-none focus:border-[#1a56db]"
                />
                <input
                  type="number"
                  placeholder={t('priceTo')}
                  value={priceTo}
                  onChange={e => setPriceTo(e.target.value)}
                  className="w-1/2 border border-gray-200 rounded-lg px-2 py-2 text-xs outline-none focus:border-[#1a56db]"
                />
              </div>
            </div>

            {/* Badges */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Status</h4>
              {['new', 'hit', 'sale'].map(badge => (
                <label key={badge} className="flex items-center gap-2 py-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded accent-[#1a56db]"/>
                  <span className="text-sm text-gray-600 capitalize">{t(badge)}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="md:hidden flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-2 rounded-xl text-sm font-medium"
              >
                <SlidersHorizontal size={15}/>
                {t('filters')}
              </button>
              <span className="text-sm text-gray-500 font-medium">
                {filtered.length} {lang === 'uz' ? 'mahsulot' : 'товаров'}
              </span>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:block">{t('sortBy')}:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-[#1a56db] font-medium"
              >
                <option value="newest">{t('newest')}</option>
                <option value="priceLow">{t('priceLow')}</option>
                <option value="priceHigh">{t('priceHigh')}</option>
                <option value="popular">{t('popular')}</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {(selectedCategory !== 'all' || priceFrom || priceTo) && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {selectedCategory !== 'all' && (
                <span className="bg-blue-50 text-[#1a56db] border border-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                  {cats[selectedCategory]}
                  <button onClick={() => setSelectedCategory('all')}><X size={12}/></button>
                </span>
              )}
              {(priceFrom || priceTo) && (
                <span className="bg-orange-50 text-orange-600 border border-orange-200 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                  {priceFrom || '0'} — {priceTo || '∞'} so'm
                  <button onClick={() => { setPriceFrom(''); setPriceTo(''); }}><X size={12}/></button>
                </span>
              )}
            </div>
          )}

          {/* Products grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="font-bold text-gray-600 text-lg">{t('noResults')}</p>
              <button onClick={resetFilters} className="mt-4 text-[#1a56db] font-semibold hover:underline">{t('reset')}</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 fade-in">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
