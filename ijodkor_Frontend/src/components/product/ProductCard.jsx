import { ShoppingCart, Star, Heart, MapPin } from 'lucide-react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DonationModal from '../ui/DonationModal';

const BADGE_STYLES = {
  new: 'bg-green-500 text-white',
  hit: 'bg-red-500 text-white',
  sale: 'bg-[#f97316] text-white',
};

export default function ProductCard({ product }) {
  const { t, lang, addToCart } = useStore();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);

  const isDisabled = product.studentType === 'disabled';

  const name     = lang === 'uz' ? product.nameUz   : product.nameRu;
  const author   = lang === 'uz' ? product.author   : product.authorRu;
  const school   = lang === 'uz' ? product.school   : product.schoolRu;
  const region   = lang === 'uz' ? product.region   : product.regionRu;
  const district = lang === 'uz' ? product.district : product.districtRu;

  const formatPrice = (n) => n.toLocaleString() + " so'm";
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleDonate = (e) => {
    e.stopPropagation();
    setDonateOpen(true);
  };

  return (
    <>
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className={`product-card bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border group fade-in ${
          isDisabled ? 'border-rose-200' : 'border-gray-100'
        }`}
      >
        {/* Image */}
        <div className={`relative overflow-hidden bg-gray-50 aspect-square ${isDisabled && product.photo ? 'pb-8' : ''}`}>
          <img
            src={product.image}
            alt={name}
            className="product-img w-full h-full object-cover transition-transform duration-500"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80'; }}
          />

          {/* Badges row */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badge && (
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${BADGE_STYLES[product.badge]}`}>
                {t(product.badge)}
              </span>
            )}
            {/* Student type badge */}
            {isDisabled ? (
                <span className="text-[11px] font-black px-2.5 py-1.5 rounded-full bg-rose-500 text-white flex items-center gap-1">
                ❤️ {lang === 'uz' ? 'Imkoniyati cheklangan' : 'Ограниченные возможности'}
              </span>
            ) : (
              <span className="text-[10px] font-black px-2 py-1 rounded-full bg-emerald-500 text-white flex items-center gap-1">
                🌟 {lang === 'uz' ? "Rag'bat" : 'Поощрение'}
              </span>
            )}
          </div>

          {discount > 0 && (
            <span className="absolute top-2 right-10 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition"
          >
            <Heart size={14} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}/>
          </button>

          {/* Imkoniyati cheklangan o'quvchi rasmi — katta, pastda */}
          {isDisabled && product.photo && (
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-3">
              <div className="relative">
                <img
                  src={product.photo}
                  alt={lang === 'uz' ? product.author : product.authorRu}
                  className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-xl"
                />
                <div className="absolute -bottom-1 -right-1 bg-rose-500 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow">❤️</div>
              </div>
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full">{t('outOfStock')}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`p-3 ${isDisabled ? 'bg-rose-50/40' : ''}`}>
          {/* Viloyat + tuman */}
          {(region || district) && (
            <div className="flex items-center gap-1 text-[10px] text-[#1a56db] font-semibold mb-1">
              <MapPin size={10} className="flex-shrink-0"/>
              <span className="line-clamp-1">{[region, district].filter(Boolean).join(', ')}</span>
            </div>
          )}

          {/* Maktab + sinf */}
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1.5">
            <span>🏫</span>
            <span className="font-medium">{school}</span>
            <span>•</span>
            <span>{t('grade')} {product.grade}</span>
          </div>

          {/* Mahsulot nomi */}
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug mb-1.5 group-hover:text-[#1a56db] transition">
            {name}
          </h3>

          {/* Reyting */}
          <div className="flex items-center gap-1 mb-1.5">
            <Star size={12} className="text-yellow-400 fill-yellow-400"/>
            <span className="text-xs font-bold text-gray-700">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews})</span>
            {product.sold > 0 && <span className="text-xs text-gray-400 ml-auto">📦 {product.sold}</span>}
          </div>

          {/* Muallif */}
          <p className="text-[11px] text-gray-600 mb-2.5 flex items-center gap-1 font-semibold">
            <span>✍️</span><span>{author}</span>
          </p>

          {/* Narx */}
          <div className="mb-3">
            <div className="text-[#1a56db] font-black text-base leading-tight">{formatPrice(product.price)}</div>
            {product.oldPrice && (
              <div className="text-gray-400 text-xs line-through">{formatPrice(product.oldPrice)}</div>
            )}
          </div>

          {/* Asosiy tugma — hammada bir xil pastda */}
          {isDisabled ? (
            <div className="space-y-2">
              <button
                onClick={handleDonate}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl transition bg-rose-500 hover:bg-rose-600 text-white"
              >
                ❤️ {lang === 'uz' ? 'Imkoniyati cheklangan' : 'Ограниченные возможности'}
              </button>
              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className={`w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl transition ${
                  added
                    ? 'bg-green-500 text-white'
                    : product.stock === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#1a56db] hover:bg-[#1341a8] text-white'
                }`}
              >
                {added
                  ? <><span>✓</span> {lang === 'uz' ? "Qo'shildi" : 'Добавлено'}</>
                  : <><ShoppingCart size={14}/> {t('addToCart')}</>
                }
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl transition ${
                added
                  ? 'bg-green-500 text-white'
                  : product.stock === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#1a56db] hover:bg-[#1341a8] text-white'
              }`}
            >
              {added
                ? <><span>✓</span> {lang === 'uz' ? "Qo'shildi" : 'Добавлено'}</>
                : <><ShoppingCart size={14}/> {t('addToCart')}</>
              }
            </button>
          )}
        </div>
      </div>

      {/* Donation modal */}
      {donateOpen && (
        <DonationModal product={product} onClose={() => setDonateOpen(false)}/>
      )}
    </>
  );
}
