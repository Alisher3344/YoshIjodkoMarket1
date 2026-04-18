import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Upload,
  X,
  Palette,
  PenTool,
  Clock,
  MapPin,
  Phone,
  DollarSign,
  FileImage,
  Send,
  Star,
} from "lucide-react";
import { useLangStore } from "../store";
import toast from "react-hot-toast";

const STEPS = [1, 2, 3];

export default function CustomOrderPage() {
  const { lang, t } = useLangStore();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    description: "",
    type: "",
    budget: "",
    deadline: "",
    address: "",
    phone: "",
    name: "",
    payment: "partial",
    file: null,
    fileType: "",
  });

  const uz = (uz, ru) => (lang === "uz" ? uz : ru);

  const types = [
    {
      id: "painting",
      icon: "🎨",
      uz: "Rasm / Portret",
      ru: "Рисунок / Портрет",
    },
    { id: "clothes", icon: "👗", uz: "Kiyim / Tikilgan", ru: "Одежда / Шитьё" },
    { id: "handmade", icon: "✂️", uz: "Handmade buym", ru: "Handmade изделие" },
    { id: "logo", icon: "🚀", uz: "Logo / Dizayn", ru: "Логотип / Дизайн" },
    {
      id: "souvenir",
      icon: "🎁",
      uz: "Sovg'a / Suvenir",
      ru: "Подарок / Сувенир",
    },
    { id: "other", icon: "📦", uz: "Boshqa", ru: "Другое" },
  ];

  const budgets = [
    { id: "b1", label: "50 000 – 100 000", sub: uz("so'm", "сум") },
    { id: "b2", label: "100 000 – 300 000", sub: uz("so'm", "сум") },
    { id: "b3", label: "300 000 – 500 000", sub: uz("so'm", "сум") },
    { id: "b4", label: "500 000+", sub: uz("so'm", "сум") },
  ];

  const payments = [
    {
      id: "partial",
      icon: "🟢",
      uz: "30% avval, 70% tayyor bo'lganda",
      ru: "30% сейчас, 70% после готовности",
    },
    {
      id: "full",
      icon: "🔵",
      uz: "To'liq oldindan to'lov (-10% chegirma)",
      ru: "Полная предоплата (-10% скидка)",
    },
  ];

  const deadlineOptions = [
    { id: "3d", uz: "3 kun", ru: "3 дня" },
    { id: "1w", uz: "1 hafta", ru: "1 неделя" },
    { id: "2w", uz: "2 hafta", ru: "2 недели" },
    { id: "1m", uz: "1 oy", ru: "1 месяц" },
  ];

  const budgetLabels = {
    b1: "50 000 – 100 000",
    b2: "100 000 – 300 000",
    b3: "300 000 – 500 000",
    b4: "500 000+",
  };
  const typeLabels = {
    painting: "Rasm/Portret",
    clothes: "Kiyim",
    handmade: "Handmade",
    logo: "Logo/Dizayn",
    souvenir: "Sovg'a",
    other: "Boshqa",
  };
  const deadlineLabels = {
    "3d": "3 kun",
    "1w": "1 hafta",
    "2w": "2 hafta",
    "1m": "1 oy",
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error(uz("Fayl 10MB dan katta!", "Файл больше 10МБ!"));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setForm((f) => ({ ...f, file: reader.result, fileType: file.type }));
    };
    reader.readAsDataURL(file);
  };

  const nextStep = () => {
    if (step === 1 && (!form.description || !form.type)) {
      toast.error(
        uz(
          "Iltimos, barcha maydonlarni to'ldiring",
          "Пожалуйста, заполните все поля"
        )
      );
      return;
    }
    if (step === 2 && !form.budget) {
      toast.error(uz("Byudjetni tanlang", "Выберите бюджет"));
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      toast.error(uz("Ism va telefon majburiy!", "Имя и телефон обязательны!"));
      return;
    }

    try {
      // 1 — Backendga saqlash
      const res = await fetch("http://127.0.0.1:8000/api/custom-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          customer_phone: form.phone,
          description: form.description,
          budget: budgetLabels[form.budget] || form.budget,
          category: form.type,
        }),
      });

      if (!res.ok) throw new Error("Server xatosi");
      const data = await res.json();

      // 2 — Telegramga xabar yuborish
      await fetch("http://127.0.0.1:8000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          image: form.file || null,
          image_type: form.fileType || null,
          message:
            `🎨 MAXSUS BUYURTMA #${data.id}\n\n` +
            `Turi: ${typeLabels[form.type] || form.type}\n` +
            `Tavsif: ${form.description}\n` +
            `Byudjet: ${budgetLabels[form.budget] || ""} so'm\n` +
            `Muddat: ${deadlineLabels[form.deadline] || "—"}\n` +
            `To'lov: ${
              form.payment === "partial" ? "30% + 70%" : "To'liq oldindan"
            }\n` +
            `Manzil: ${form.address || "—"}`,
        }),
      });
      setOrderId(data.id);
      setSubmitted(true);
      toast.success(uz("Buyurtmangiz yuborildi! 🎉", "Заказ отправлен! 🎉"));
    } catch {
      toast.error(uz("Xatolik yuz berdi", "Произошла ошибка"));
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#faf9ff] pt-20 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-xl border border-[#4c1d95]/10 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-[#4c1d95] mb-3 font-serif">
            {uz("Buyurtma qabul qilindi! 🎉", "Заказ принят! 🎉")}
          </h2>
          <p className="text-gray-500 mb-2 leading-relaxed">
            {uz(
              "Adminimiz sizning buyurtmangizni ko'rib chiqadi va tez orada bog'lanadi.",
              "Наш администратор рассмотрит ваш заказ и свяжется с вами."
            )}
          </p>
          <div className="bg-[#ede9fe] rounded-2xl px-5 py-3 mb-8">
            <p className="text-xs text-[#4c1d95]/60 mb-1">
              {uz("Buyurtma ID", "ID заказа")}
            </p>
            <p className="font-black text-[#4c1d95] text-lg">{orderId}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-[#4c1d95] hover:bg-[#5b21b6] text-white font-bold py-3.5 rounded-2xl transition-colors"
            >
              {uz("Bosh sahifa", "Главная")}
            </button>
            <button
              onClick={() => navigate("/products")}
              className="flex-1 bg-[#ede9fe] hover:bg-[#4c1d95] hover:text-white text-[#4c1d95] font-bold py-3.5 rounded-2xl transition-colors"
            >
              {uz("Mahsulotlar", "Товары")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9ff] pt-20">
      {/* Hero */}
      <div className="bg-[#4c1d95] hero-pattern py-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("back")}
          </button>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl shrink-0">
              🎨
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-black font-serif mb-2">
                {uz("Maxsus buyurtma berish", "Специальный заказ")}
              </h1>
              <p className="text-white/65 leading-relaxed">
                {uz(
                  "O'z xohishingizga mос buyurtma bering — ijodkor o'quvchilar bajaradi",
                  "Сделайте заказ по своему желанию — творческие ученики выполнят"
                )}
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-3 mt-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                    step > s
                      ? "bg-green-400 text-white"
                      : step === s
                      ? "bg-white text-[#4c1d95]"
                      : "bg-white/20 text-white/60"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                <span
                  className={`text-xs font-bold hidden sm:block ${
                    step === s ? "text-white" : "text-white/50"
                  }`}
                >
                  {s === 1
                    ? uz("Tavsif", "Описание")
                    : s === 2
                    ? uz("Byudjet", "Бюджет")
                    : uz("Ma'lumotlar", "Контакты")}
                </span>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 w-8 sm:w-16 ${
                      step > s ? "bg-green-400" : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeInUp">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#4c1d95]/8">
              <h3 className="font-black text-[#4c1d95] text-lg mb-1 font-serif flex items-center gap-2">
                <PenTool className="w-5 h-5" />{" "}
                {uz("Nima kerak?", "Что нужно?")}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {uz(
                  "Imkon qadar batafsil yozing",
                  "Опишите как можно подробнее"
                )}
              </p>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={4}
                placeholder={uz(
                  "Masalan: \"Qizim uchun qo'lda tikilgan ko'k rangli sumka, 25x30 sm\"",
                  'Например: "Сумка ручной работы для дочери, голубого цвета, 25x30 см"'
                )}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4c1d95] outline-none text-sm resize-none transition-colors"
              />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#4c1d95]/8">
              <h3 className="font-black text-[#4c1d95] text-lg mb-4 font-serif flex items-center gap-2">
                <Palette className="w-5 h-5" />{" "}
                {uz("Turi qaysi?", "Какой тип?")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {types.map((tp) => (
                  <button
                    key={tp.id}
                    onClick={() => setForm((f) => ({ ...f, type: tp.id }))}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      form.type === tp.id
                        ? "border-[#4c1d95] bg-[#ede9fe]"
                        : "border-gray-200 hover:border-[#4c1d95]/30 hover:bg-[#faf9ff]"
                    }`}
                  >
                    <span className="text-2xl">{tp.icon}</span>
                    <span
                      className={`text-sm font-bold ${
                        form.type === tp.id ? "text-[#4c1d95]" : "text-gray-600"
                      }`}
                    >
                      {lang === "uz" ? tp.uz : tp.ru}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#4c1d95]/8">
              <h3 className="font-black text-[#4c1d95] text-lg mb-1 font-serif flex items-center gap-2">
                <FileImage className="w-5 h-5" />
                {uz("Namuna rasm", "Образец фото")}
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {uz("ixtiyoriy", "необязательно")}
                </span>
              </h3>
              {preview ? (
                <div className="relative inline-block mt-3">
                  <img
                    src={preview}
                    alt="preview"
                    className="h-40 rounded-xl object-cover border-2 border-[#4c1d95]/20"
                  />
                  <button
                    onClick={() => {
                      setPreview(null);
                      setForm((f) => ({ ...f, file: null }));
                    }}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 p-8 mt-3 border-2 border-dashed border-[#4c1d95]/20 rounded-xl cursor-pointer hover:bg-[#faf9ff] hover:border-[#4c1d95]/40 transition-all">
                  <Upload className="w-8 h-8 text-[#4c1d95]/40" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#4c1d95]">
                      {uz("Fayl tanlash", "Выбрать файл")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, PDF — max 10MB
                    </p>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              onClick={nextStep}
              className="w-full bg-[#4c1d95] hover:bg-[#5b21b6] text-white font-black py-4 rounded-2xl transition-all hover:scale-[1.01] shadow-xl shadow-[#4c1d95]/25"
            >
              {uz("Keyingisi →", "Далее →")}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeInUp">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#4c1d95]/8">
              <h3 className="font-black text-[#4c1d95] text-lg mb-4 font-serif flex items-center gap-2">
                <DollarSign className="w-5 h-5" /> {uz("Byudjet", "Бюджет")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {budgets.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setForm((f) => ({ ...f, budget: b.id }))}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      form.budget === b.id
                        ? "border-[#4c1d95] bg-[#ede9fe]"
                        : "border-gray-200 hover:border-[#4c1d95]/30"
                    }`}
                  >
                    <p
                      className={`font-black text-base ${
                        form.budget === b.id
                          ? "text-[#4c1d95]"
                          : "text-gray-700"
                      }`}
                    >
                      {b.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{b.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#4c1d95]/8">
              <h3 className="font-black text-[#4c1d95] text-lg mb-4 font-serif flex items-center gap-2">
                <Clock className="w-5 h-5" />{" "}
                {uz("Muddat — qachon kerak?", "Срок — когда нужно?")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {deadlineOptions.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setForm((f) => ({ ...f, deadline: d.id }))}
                    className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      form.deadline === d.id
                        ? "border-[#4c1d95] bg-[#ede9fe] text-[#4c1d95]"
                        : "border-gray-200 text-gray-600 hover:border-[#4c1d95]/30"
                    }`}
                  >
                    {lang === "uz" ? d.uz : d.ru}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#4c1d95]/8">
              <h3 className="font-black text-[#4c1d95] text-lg mb-4 font-serif flex items-center gap-2">
                <Star className="w-5 h-5" />{" "}
                {uz("To'lov usuli", "Способ оплаты")}
              </h3>
              <div className="space-y-3">
                {payments.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setForm((f) => ({ ...f, payment: p.id }))}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      form.payment === p.id
                        ? "border-[#4c1d95] bg-[#ede9fe]"
                        : "border-gray-200 hover:border-[#4c1d95]/30"
                    }`}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <span
                      className={`text-sm font-bold ${
                        form.payment === p.id
                          ? "text-[#4c1d95]"
                          : "text-gray-600"
                      }`}
                    >
                      {lang === "uz" ? p.uz : p.ru}
                    </span>
                    {form.payment === p.id && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-[#4c1d95] flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 bg-white border-2 border-gray-200 hover:border-[#4c1d95] text-gray-600 font-bold py-4 rounded-2xl transition-all"
              >
                ← {t("back")}
              </button>
              <button
                onClick={nextStep}
                className="flex-1 bg-[#4c1d95] hover:bg-[#5b21b6] text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-[#4c1d95]/25"
              >
                {uz("Keyingisi →", "Далее →")}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeInUp">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#4c1d95]/8">
              <h3 className="font-black text-[#4c1d95] text-lg mb-5 font-serif">
                {uz("Aloqa ma'lumotlari", "Контактные данные")}
              </h3>
              <div className="space-y-4">
                {[
                  {
                    key: "name",
                    icon: <PenTool className="w-4 h-4" />,
                    label: uz("Ism Familiya", "Имя Фамилия"),
                    placeholder: uz("Ism Familiya", "Имя Фамилия"),
                    type: "text",
                  },
                  {
                    key: "phone",
                    icon: <Phone className="w-4 h-4" />,
                    label: uz("Telefon", "Телефон"),
                    placeholder: "+998 90 000 00 00",
                    type: "tel",
                  },
                  {
                    key: "address",
                    icon: <MapPin className="w-4 h-4" />,
                    label: uz("Manzil (ixtiyoriy)", "Адрес (необязательно)"),
                    placeholder: uz("Shahar, ko'cha", "Город, улица"),
                    type: "text",
                  },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                      <span className="text-[#4c1d95]">{field.icon}</span>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field.key]: e.target.value }))
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4c1d95] outline-none text-sm transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#ede9fe] rounded-2xl p-5 border border-[#4c1d95]/15">
              <h4 className="font-black text-[#4c1d95] mb-3">
                {uz("Buyurtma xulosasi", "Итог заказа")}
              </h4>
              <div className="space-y-2 text-sm">
                {form.type && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">{uz("Turi", "Тип")}:</span>
                    <span className="font-bold text-[#4c1d95]">
                      {
                        types.find((t) => t.id === form.type)?.[
                          lang === "uz" ? "uz" : "ru"
                        ]
                      }
                    </span>
                  </div>
                )}
                {form.budget && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {uz("Byudjet", "Бюджет")}:
                    </span>
                    <span className="font-bold text-[#4c1d95]">
                      {budgetLabels[form.budget]} so'm
                    </span>
                  </div>
                )}
                {form.deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {uz("Muddat", "Срок")}:
                    </span>
                    <span className="font-bold text-[#4c1d95]">
                      {
                        deadlineOptions.find((d) => d.id === form.deadline)?.[
                          lang
                        ]
                      }
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    {uz("To'lov", "Оплата")}:
                  </span>
                  <span className="font-bold text-[#4c1d95]">
                    {form.payment === "partial"
                      ? uz("30% + 70%", "30% + 70%")
                      : uz("To'liq oldindan", "Полная предоплата")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-6 bg-white border-2 border-gray-200 hover:border-[#4c1d95] text-gray-600 font-bold py-4 rounded-2xl transition-all"
              >
                ← {t("back")}
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#4c1d95] hover:bg-[#5b21b6] text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-[#4c1d95]/25 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {uz("Buyurtma yuborish ✓", "Отправить заказ ✓")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
