import { X, Copy, Heart, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import useStore from '../../store/useStore';

export default function DonationModal({ product, onClose }) {
  const { lang } = useStore();
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState('50000');

  const author   = lang === 'uz' ? product.author   : product.authorRu;
  const school   = lang === 'uz' ? product.school   : product.schoolRu;
  const district = lang === 'uz' ? product.district : product.districtRu;
  const story    = lang === 'uz' ? product.storyUz  : product.storyRu;

  const copyCard = () => {
    navigator.clipboard.writeText(product.cardNumber.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const amounts = ['20000', '50000', '100000', '200000'];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md fade-in overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-5 relative">
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-full transition">
            <X size={16}/>
          </button>
          <div className="flex items-center gap-1 text-white/80 text-xs font-semibold mb-1">
            <Heart size={12} className="fill-white"/>
            {lang === 'uz' ? 'Mehribonlik ko\'rsating' : 'Проявите доброту'}
          </div>
          <h2 className="text-white font-black text-xl">
            {lang === 'uz' ? `${author}ga ehson` : `Пожертвование ${author}`}
          </h2>
          <p className="text-white/70 text-xs mt-1">{school} • {district}</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Student profile */}
          <div className="flex gap-4 bg-rose-50 rounded-2xl p-4 border border-rose-100">
            {product.photo && (
              <img
                src={product.photo}
                alt={author}
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border-2 border-rose-200"
              />
            )}
            <div>
              <div className="font-black text-gray-900 text-base">{author}</div>
              <div className="text-xs text-gray-500 mt-0.5">{school}, {lang === 'uz' ? `${product.grade}-sinf` : `${product.grade} класс`}</div>
              {story && (
                <p className="text-xs text-gray-600 mt-2 leading-relaxed italic">"{story}"</p>
              )}
            </div>
          </div>

          {/* Amount selector */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">
              {lang === 'uz' ? 'Ehson miqdorini tanlang:' : 'Выберите сумму пожертвования:'}
            </p>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {amounts.map(a => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className={`py-2 rounded-xl text-xs font-bold transition border-2 ${
                    amount === a
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
                  }`}
                >
                  {parseInt(a).toLocaleString()}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-rose-400 transition"
                placeholder="Boshqa miqdor..."
              />
              <span className="text-sm text-gray-500 font-semibold">so'm</span>
            </div>
          </div>

          {/* Card number */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">
              {lang === 'uz' ? 'Karta raqami:' : 'Номер карты:'}
            </p>
            <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3">
              <span className="flex-1 font-black text-lg tracking-widest text-gray-800">
                {product.cardNumber}
              </span>
              <button
                onClick={copyCard}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                  copied ? 'bg-green-500 text-white' : 'bg-[#1a56db] text-white hover:bg-[#1341a8]'
                }`}
              >
                {copied ? <><CheckCircle size={13}/> Nusxalandi</> : <><Copy size={13}/> Nusxalash</>}
              </button>
            </div>
          </div>

          {/* Payment buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`${product.clickUrl}?amount=${amount}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#00AEEF] hover:bg-[#0090c5] text-white font-bold py-3 rounded-xl text-sm text-center transition flex items-center justify-center gap-2"
            >
              <span className="text-lg">💙</span> Click
            </a>
            <a
              href={`${product.paymeUrl}?amount=${amount}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#37AEE2] hover:bg-[#2a95cc] text-white font-bold py-3 rounded-xl text-sm text-center transition flex items-center justify-center gap-2"
            >
              <span className="text-lg">💳</span> Payme
            </a>
          </div>

          <p className="text-center text-xs text-gray-400">
            {lang === 'uz'
              ? '❤️ Sizning ehsoningiz bevosita o\'quvchi kartasiga o\'tadi'
              : '❤️ Ваше пожертвование поступает напрямую на карту ученика'}
          </p>
        </div>
      </div>
    </div>
  );
}
