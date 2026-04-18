import { useState } from 'react';
import { CheckCircle, ArrowLeft, X, Copy, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function CheckoutPage() {
  const { t, lang, cart, cartTotal, clearCart, addOrder, removeFromCart } = useStore();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [copiedCard, setCopiedCard] = useState(null);
  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: 'Qarshi', payment: 'click', note: ''
  });
  const [errors, setErrors] = useState({});

  const total = cartTotal();
  const formatPrice = (n) => n.toLocaleString() + " so'm";

  // Imkoniyati cheklangan o'quvchilar mahsulotlari
  const disabledItems = cart.filter(item => item.studentType === 'disabled');
  const normalItems = cart.filter(item => item.studentType !== 'disabled');
  const disabledTotal = disabledItems.reduce((s, i) => s + i.price * i.qty, 0);
  const normalTotal = normalItems.reduce((s, i) => s + i.price * i.qty, 0);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = lang === 'uz' ? "Ism majburiy" : "Имя обязательно";
    if (!form.phone.trim()) e.phone = lang === 'uz' ? "Telefon majburiy" : "Телефон обязателен";
    if (!form.address.trim()) e.address = lang === 'uz' ? "Manzil majburiy" : "Адрес обязателен";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await addOrder({
        ...form, items: cart, total,
        disabledItems: disabledItems.map(i => ({
          productName: lang === 'uz' ? i.nameUz : i.nameRu,
          author: i.author, school: i.school,
          cardNumber: i.cardNumber, amount: i.price * i.qty,
          paymentConfirmed: false,
        })),
        normalTotal, disabledTotal,
      });
      clearCart();
      setSuccess(true);
    } catch (err) {
      alert(lang === 'uz' ? 'Xatolik yuz berdi' : 'Произошла ошибка');
    }
  };

  const copyCard = (card) => {
    navigator.clipboard.writeText(card.replace(/\s/g, ''));
    setCopiedCard(card);
    setTimeout(() => setCopiedCard(null), 2000);
  };

  if (cart.length === 0 && !success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold mb-4">{t('emptyCart')}</h2>
        <button onClick={() => navigate('/catalog')} className="bg-[#1a56db] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1341a8] transition">
          {t('catalog')}
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 fade-in">
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-green-100 text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-500"/>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">{t('orderSuccess')}</h2>
          <p className="text-gray-500">{t('orderSuccessMsg')}</p>
        </div>

        {/* Imkoniyati cheklangan bolalar uchun to'lov yo'riqnomasi */}
        {disabledItems.length > 0 && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 mb-6">
            <h3 className="font-black text-rose-700 text-lg mb-4 flex items-center gap-2">
              ❤️ {lang === 'uz'
                ? "Imkoniyati cheklangan o'quvchilarga to'lov"
                : "Оплата ученикам с ограниченными возможностями"}
            </h3>
            <p className="text-rose-600 text-sm mb-4 leading-relaxed">
              {lang === 'uz'
                ? "Quyidagi o'quvchilarning mahsulotlarini sotib oldingiz. Iltimos, ularning karta raqamlariga to'lovni o'tkazing:"
                : "Вы купили товары следующих учеников. Пожалуйста, переведите оплату на их карты:"}
            </p>

            <div className="space-y-4">
              {disabledItems.map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-rose-200">
                  <div className="flex items-center gap-3 mb-3">
                    {item.photo && <img src={item.photo} alt="" className="w-12 h-12 rounded-xl object-cover border-2 border-rose-200"/>}
                    <div>
                      <div className="font-black text-gray-900">{lang === 'uz' ? item.author : (item.authorRu || item.author)}</div>
                      <div className="text-xs text-gray-500">{item.school} • {lang === 'uz' ? item.district : (item.districtRu || item.district)}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{lang === 'uz' ? item.nameUz : item.nameRu} × {item.qty}</div>
                    </div>
                  </div>

                  {/* To'lov miqdori */}
                  <div className="bg-rose-50 rounded-xl p-3 mb-3 flex justify-between items-center">
                    <span className="text-sm text-rose-700 font-semibold">
                      {lang === 'uz' ? "O'tkazish kerak:" : "Сумма перевода:"}
                    </span>
                    <span className="font-black text-rose-700 text-lg">{formatPrice(item.price * item.qty)}</span>
                  </div>

                  {/* Karta raqami */}
                  {item.cardNumber && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1 font-semibold">{lang === 'uz' ? "Karta raqami:" : "Номер карты:"}</p>
                      <div className="flex items-center gap-2 bg-gray-50 border rounded-xl px-4 py-2.5">
                        <span className="flex-1 font-black tracking-widest text-gray-800">{item.cardNumber}</span>
                        <button
                          onClick={() => copyCard(item.cardNumber)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                            copiedCard === item.cardNumber ? 'bg-green-500 text-white' : 'bg-[#1a56db] text-white hover:bg-[#1341a8]'
                          }`}
                        >
                          {copiedCard === item.cardNumber ? '✓ Nusxalandi' : <><Copy size={12}/> Nusxa</>}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Click/Payme tugmalari */}
                  <div className="grid grid-cols-3 gap-2">
                    <a href={`https://my.click.uz/services/pay?amount=${item.price * item.qty}`} target="_blank" rel="noreferrer"
                      className="bg-[#00AEEF] text-white text-xs font-bold py-2 rounded-xl text-center hover:opacity-90 transition">
                      💙 Click
                    </a>
                    <a href={`https://checkout.paycom.uz?amount=${item.price * item.qty}`} target="_blank" rel="noreferrer"
                      className="bg-[#37AEE2] text-white text-xs font-bold py-2 rounded-xl text-center hover:opacity-90 transition">
                      💳 Payme
                    </a>
                    <a href={`https://uzumbank.uz?amount=${item.price * item.qty}`} target="_blank" rel="noreferrer"
                      className="bg-purple-600 text-white text-xs font-bold py-2 rounded-xl text-center hover:opacity-90 transition">
                      🟣 Uzum
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
              <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5"/>
              <p className="text-xs text-amber-700 leading-relaxed">
                {lang === 'uz'
                  ? "To'lovni amalga oshirgandan so'ng, skrinshot olib +998 98 777 07 27 raqamiga yuboring. Bu hisobotimiz uchun zarur."
                  : "После оплаты сделайте скриншот и отправьте на +998 98 777 07 27. Это необходимо для нашей отчётности."}
              </p>
            </div>
          </div>
        )}

        <button onClick={() => navigate('/')} className="w-full bg-[#1a56db] text-white py-3.5 rounded-xl font-bold hover:bg-[#1341a8] transition">
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  const paymentMethods = [
    { key: 'click',      label: 'Click',       icon: '💙' },
    { key: 'payme',      label: 'Payme',       icon: '💳' },
    { key: 'uzumbank',   label: 'Uzum Bank',   icon: '🟣' },
    { key: 'cash',       label: lang === 'uz' ? 'Naqd' : 'Наличные', icon: '💵' },
    { key: 'banktransfer', label: lang === 'uz' ? "Bank o'tkazma" : 'Банк. перевод', icon: '🏦' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a56db] mb-6 transition font-medium">
        <ArrowLeft size={16}/> {lang === 'uz' ? 'Orqaga' : 'Назад'}
      </button>

      <h1 className="text-2xl font-black text-gray-900 mb-6">{t('checkoutTitle')}</h1>

      {/* Imkoniyati cheklangan mahsulotlar haqida ogohlantirish */}
      {disabledItems.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 mb-6 flex gap-3">
          <AlertCircle size={20} className="text-rose-500 flex-shrink-0 mt-0.5"/>
          <div>
            <p className="font-bold text-rose-700 text-sm">
              {lang === 'uz'
                ? "Savatingizda imkoniyati cheklangan o'quvchilar mahsulotlari bor!"
                : "В вашей корзине есть товары учеников с ограниченными возможностями!"}
            </p>
            <p className="text-rose-600 text-xs mt-1">
              {lang === 'uz'
                ? `Buyurtma tasdiqlangandan so'ng, ${formatPrice(disabledTotal)} summani bevosita o'quvchilarning kartasiga o'tkazishingiz so'raladi.`
                : `После подтверждения заказа вас попросят перевести ${formatPrice(disabledTotal)} напрямую на карты учеников.`}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider border-b pb-3">
              {lang === 'uz' ? "Shaxsiy ma'lumotlar" : "Личные данные"}
            </h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('fullName')} *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db] transition ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                placeholder={lang === 'uz' ? "Ismingizni kiriting" : "Введите ваше имя"}/>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('phone')} *</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db] transition ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="+998 __ ___ __ __"/>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('city')}</label>
                <select value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db] bg-white">
                  {['Qarshi', 'Shahrisabz', 'Kitob', 'Muborak', 'Nishon', 'Koson', 'Toshkent', 'Samarqand', 'Buxoro'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('address')} *</label>
                <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db] transition ${errors.address ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder={lang === 'uz' ? "Ko'cha, uy raqami" : "Улица, номер дома"}/>
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* To'lov usuli */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider border-b pb-3 mb-4">
              {t('paymentMethod')}
            </h2>
            {normalItems.length > 0 ? (
              <>
                <p className="text-xs text-gray-500 mb-3">
                  {lang === 'uz'
                    ? `Oddiy mahsulotlar uchun to'lov usulini tanlang (${formatPrice(normalTotal)}):`
                    : `Выберите способ оплаты для обычных товаров (${formatPrice(normalTotal)}):`}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {paymentMethods.map(method => (
                    <label key={method.key}
                      className={`flex items-center gap-2 border-2 rounded-xl p-3 cursor-pointer transition ${
                        form.payment === method.key ? 'border-[#1a56db] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <input type="radio" name="payment" value={method.key} checked={form.payment === method.key}
                        onChange={() => setForm({...form, payment: method.key})} className="accent-[#1a56db]"/>
                      <span className="text-base">{method.icon}</span>
                      <span className="text-sm font-semibold text-gray-700">{method.label}</span>
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-rose-50 rounded-xl p-3 text-sm text-rose-700 font-medium">
                ❤️ {lang === 'uz'
                  ? "Barcha mahsulotlar imkoniyati cheklangan o'quvchilarniki. To'lov bevosita ularning kartasiga o'tkaziladi."
                  : "Все товары принадлежат ученикам с ограниченными возможностями. Оплата переводится напрямую на их карты."}
              </div>
            )}
          </div>

          {/* Izoh */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('orderNote')}</label>
            <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db] transition resize-none"
              placeholder={lang === 'uz' ? "Qo'shimcha ma'lumot..." : "Дополнительная информация..."}/>
          </div>

          <button type="submit" className="w-full bg-[#f97316] hover:bg-[#c2570d] text-white py-4 rounded-xl font-black text-base transition">
            {t('placeOrder')} ✓
          </button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20">
            <h2 className="font-bold text-gray-800 mb-4 pb-3 border-b">
              {lang === 'uz' ? "Buyurtma tarkibi" : "Состав заказа"}
            </h2>
            <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className={`flex gap-3 group rounded-xl p-2 ${item.studentType === 'disabled' ? 'bg-rose-50' : ''}`}>
                  <div className="relative flex-shrink-0">
                    <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover"/>
                    {item.studentType === 'disabled' && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">❤</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 line-clamp-1">
                      {lang === 'uz' ? item.nameUz : item.nameRu}
                    </p>
                    {item.studentType === 'disabled' && (
                      <p className="text-[10px] text-rose-500 font-semibold">{lang === 'uz' ? item.author : (item.authorRu || item.author)}</p>
                    )}
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-400">x{item.qty}</span>
                      <span className="text-xs font-bold text-[#1a56db]">{(item.price * item.qty).toLocaleString()} so'm</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}
                    className="w-5 h-5 rounded-full bg-red-100 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 self-center flex-shrink-0 text-xs">
                    <X size={11}/>
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2">
              {normalItems.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{lang === 'uz' ? "Oddiy mahsulotlar" : "Обычные товары"}:</span>
                  <span className="font-semibold">{formatPrice(normalTotal)}</span>
                </div>
              )}
              {disabledItems.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-rose-500 font-medium">❤️ {lang === 'uz' ? "Imkoniyati cheklangan" : "С огр. возможностями"}:</span>
                  <span className="font-semibold text-rose-600">{formatPrice(disabledTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{lang === 'uz' ? "Yetkazib berish" : "Доставка"}:</span>
                <span className="font-semibold text-green-600">{lang === 'uz' ? "Bepul" : "Бесплатно"}</span>
              </div>
              <div className="flex justify-between font-black text-base border-t pt-2">
                <span>{t('total')}:</span>
                <span className="text-[#1a56db]">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
