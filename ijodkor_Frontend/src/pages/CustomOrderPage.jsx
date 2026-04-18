import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Upload, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const TYPES_UZ = [
  { key: 'painting', icon: '🎨', label: 'Rasm / Portret' },
  { key: 'clothing', icon: '👗', label: 'Kiyim / Tikilgan' },
  { key: 'handmade', icon: '✂️', label: 'Handmade buym' },
  { key: 'logo',     icon: '🚀', label: 'Logo / Dizayn' },
  { key: 'gift',     icon: '🎁', label: "Sovg'a / Suvenir" },
  { key: 'other',    icon: '📦', label: 'Boshqa' },
];

const TYPES_RU = [
  { key: 'painting', icon: '🎨', label: 'Рисунок / Портрет' },
  { key: 'clothing', icon: '👗', label: 'Одежда / Шитьё' },
  { key: 'handmade', icon: '✂️', label: 'Handmade изделие' },
  { key: 'logo',     icon: '🚀', label: 'Лого / Дизайн' },
  { key: 'gift',     icon: '🎁', label: 'Подарок / Сувенир' },
  { key: 'other',    icon: '📦', label: 'Другое' },
];

const BUDGETS_UZ = [
  '50 000 – 100 000 so\'m',
  '100 000 – 300 000 so\'m',
  '300 000 – 500 000 so\'m',
  '500 000+ so\'m',
];
const BUDGETS_RU = [
  '50 000 – 100 000 сум',
  '100 000 – 300 000 сум',
  '300 000 – 500 000 сум',
  '500 000+ сум',
];

const DEADLINES_UZ = ['3 kun', '1 hafta', '2 hafta', '1 oy'];
const DEADLINES_RU = ['3 дня', '1 неделя', '2 недели', '1 месяц'];

const PAYMENTS_UZ = [
  { key: 'partial', icon: '🟢', label: "30% avval, 70% tayyor bo'lganda" },
  { key: 'full',    icon: '🔵', label: "To'liq oldindan to'lov (-10% chegirma)" },
];
const PAYMENTS_RU = [
  { key: 'partial', icon: '🟢', label: '30% вперёд, 70% после готовности' },
  { key: 'full',    icon: '🔵', label: 'Полная предоплата (-10% скидка)' },
];

export default function CustomOrderPage() {
  const { lang, addOrder } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    desc: '', type: '', image: null,
    budget: '', deadline: '', payment: '',
    name: '', phone: '', address: '',
  });

  const types    = lang === 'uz' ? TYPES_UZ    : TYPES_RU;
  const budgets  = lang === 'uz' ? BUDGETS_UZ  : BUDGETS_RU;
  const deadlines= lang === 'uz' ? DEADLINES_UZ: DEADLINES_RU;
  const payments = lang === 'uz' ? PAYMENTS_UZ : PAYMENTS_RU;

  const typLabel = types.find(t => t.key === form.type)?.label || '—';

  const steps = [
    { num: 1, label: lang === 'uz' ? 'Tavsif'      : 'Описание' },
    { num: 2, label: lang === 'uz' ? 'Byudjet'     : 'Бюджет'   },
    { num: 3, label: lang === 'uz' ? "Ma'lumotlar" : 'Данные'   },
  ];

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;
    addOrder({
      name: form.name,
      phone: form.phone,
      address: form.address,
      total: 0,
      items: [{ nameUz: `Maxsus buyurtma: ${typLabel}`, nameRu: `Спецзаказ: ${typLabel}`, qty: 1, price: 0, image: '' }],
      orderType: 'custom',
      customDetails: form,
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center fade-in">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500"/>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">
            {lang === 'uz' ? "Buyurtma yuborildi!" : "Заказ отправлен!"}
          </h2>
          <p className="text-gray-500 mb-8">
            {lang === 'uz'
              ? "Tez orada siz bilan bog'lanamiz. Rahmat!"
              : "Мы свяжемся с вами в ближайшее время. Спасибо!"}
          </p>
          <button onClick={() => navigate('/')} className="w-full bg-[#1a56db] text-white py-3.5 rounded-xl font-bold hover:bg-[#1341a8] transition">
            {lang === 'uz' ? "Bosh sahifaga qaytish" : "На главную"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🎨</div>
        <h1 className="text-2xl font-black text-gray-900">
          {lang === 'uz' ? "Maxsus buyurtma berish" : "Специальный заказ"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {lang === 'uz'
            ? "O'z xohishingizga mos buyurtma bering — ijodkor o'quvchilar bajaradi"
            : "Оформите заказ по вашему желанию — выполнят творческие ученики"}
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                step > s.num
                  ? 'bg-green-500 text-white'
                  : step === s.num
                    ? 'bg-[#1a56db] text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-400'
              }`}>
                {step > s.num ? <Check size={16}/> : s.num}
              </div>
              <span className={`text-xs mt-1 font-semibold ${step === s.num ? 'text-[#1a56db]' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-2 mb-4 transition-all ${step > s.num ? 'bg-green-400' : 'bg-gray-200'}`}/>
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 fade-in">

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-black text-gray-800 text-lg">
              {lang === 'uz' ? "Nima kerak?" : "Что нужно?"}
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                {lang === 'uz' ? "Imkon qadar batafsil yozing" : "Опишите как можно подробнее"}
              </label>
              <textarea
                rows={4}
                value={form.desc}
                onChange={e => setForm({...form, desc: e.target.value})}
                placeholder={lang === 'uz' ? "Masalan: A4 formatda mening portretimni chizing, fonida tog' manzarasi bo'lsin..." : "Например: Нарисуйте мой портрет формата A4, на фоне горный пейзаж..."}
                className="w-full border-2 border-gray-200 focus:border-[#1a56db] rounded-2xl px-4 py-3 text-sm outline-none resize-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                {lang === 'uz' ? "Turi qaysi?" : "Какой тип?"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {types.map(t => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setForm({...form, type: t.key})}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 text-xs font-bold transition ${
                      form.type === t.key
                        ? 'border-[#1a56db] bg-blue-50 text-[#1a56db]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                {lang === 'uz' ? "Namuna yoki rasm yuklash" : "Загрузить пример или фото"}{" "}
                <span className="text-gray-400 font-normal text-xs">({lang === 'uz' ? "ixtiyoriy" : "по желанию"})</span>
              </label>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-[#1a56db] rounded-2xl py-6 cursor-pointer transition bg-gray-50 hover:bg-blue-50">
                {form.image ? (
                  <img src={form.image} alt="preview" className="h-24 object-contain rounded-xl"/>
                ) : (
                  <>
                    <Upload size={28} className="text-gray-400"/>
                    <div className="text-sm text-center">
                      <span className="font-semibold text-[#1a56db]">{lang === 'uz' ? "Fayl tanlash" : "Выбрать файл"}</span>
                      <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, PDF — max 10MB</p>
                    </div>
                  </>
                )}
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => setForm({...form, image: ev.target.result});
                  reader.readAsDataURL(file);
                }}/>
              </label>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-black text-gray-800 text-lg">{lang === 'uz' ? "Byudjet" : "Бюджет"}</h2>

            <div className="grid grid-cols-2 gap-3">
              {budgets.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setForm({...form, budget: b})}
                  className={`py-4 px-3 rounded-2xl border-2 text-sm font-bold transition text-center ${
                    form.budget === b
                      ? 'border-[#1a56db] bg-blue-50 text-[#1a56db]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                {lang === 'uz' ? "Muddat — qachon kerak?" : "Срок — когда нужно?"}
              </label>
              <div className="flex gap-2 flex-wrap">
                {deadlines.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setForm({...form, deadline: d})}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition ${
                      form.deadline === d
                        ? 'border-[#1a56db] bg-[#1a56db] text-white'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                {lang === 'uz' ? "To'lov usuli" : "Способ оплаты"}
              </label>
              <div className="space-y-2">
                {payments.map(p => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setForm({...form, payment: p.key})}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-sm font-semibold transition text-left ${
                      form.payment === p.key
                        ? 'border-[#1a56db] bg-blue-50 text-[#1a56db]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span className="text-xl">{p.icon}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-black text-gray-800 text-lg">
              {lang === 'uz' ? "Aloqa ma'lumotlari" : "Контактные данные"}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {lang === 'uz' ? "Ism Familiya *" : "Имя Фамилия *"}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border-2 border-gray-200 focus:border-[#1a56db] rounded-xl px-4 py-3 text-sm outline-none transition"
                  placeholder={lang === 'uz' ? "Ismi Sharif" : "Имя Фамилия"}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {lang === 'uz' ? "Telefon *" : "Телефон *"}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full border-2 border-gray-200 focus:border-[#1a56db] rounded-xl px-4 py-3 text-sm outline-none transition"
                  placeholder="+998 __ ___ __ __"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {lang === 'uz' ? "Manzil (ixtiyoriy)" : "Адрес (по желанию)"}
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm({...form, address: e.target.value})}
                  className="w-full border-2 border-gray-200 focus:border-[#1a56db] rounded-xl px-4 py-3 text-sm outline-none transition"
                  placeholder={lang === 'uz' ? "Shahar, ko'cha, uy" : "Город, улица, дом"}
                />
              </div>
            </div>

            {/* Buyurtma xulosasi */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <h3 className="font-black text-gray-800 text-sm mb-3">
                {lang === 'uz' ? "Buyurtma xulosasi" : "Итог заказа"}
              </h3>
              <div className="space-y-1.5 text-sm">
                {[
                  { label: lang === 'uz' ? 'Turi' : 'Тип', value: typLabel },
                  { label: lang === 'uz' ? 'Byudjet' : 'Бюджет', value: form.budget || '—' },
                  { label: lang === 'uz' ? 'Muddat' : 'Срок', value: form.deadline || '—' },
                  { label: lang === 'uz' ? "To'lov" : 'Оплата', value: payments.find(p => p.key === form.payment)?.label || '—' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-500">{row.label}:</span>
                    <span className="font-bold text-gray-800 text-right max-w-44">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-3 rounded-xl transition"
            >
              <ArrowLeft size={16}/>
              {lang === 'uz' ? "Orqaga" : "Назад"}
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1a56db] hover:bg-[#1341a8] text-white font-bold py-3 rounded-xl transition"
            >
              {lang === 'uz' ? "Keyingisi" : "Далее"}
              <ArrowRight size={16}/>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!form.name || !form.phone}
              className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition ${
                !form.name || !form.phone
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#f97316] hover:bg-[#c2570d] text-white'
              }`}
            >
              <Check size={16}/>
              {lang === 'uz' ? "Buyurtma yuborish" : "Отправить заказ"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
