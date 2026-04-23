import { useState } from "react";
import { CheckCircle } from "lucide-react";
import useStore from "../store/useStore";
import { api } from "../services/api";
import { formatPhone } from "../utils/phone";

export function ContactPage() {
  const { lang } = useStore();

  const [form, setForm] = useState({
    name: "",
    phone: "+998 ",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setForm({ ...form, phone: formatted });
    if (errors.phone) setErrors({ ...errors, phone: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) {
      e.name = lang === "uz" ? "Ism majburiy" : "Имя обязательно";
    }
    // Telefon: kamida +998 XX XXX XX XX = 17 belgi
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 12) {
      e.phone =
        lang === "uz"
          ? "To'liq telefon raqam kiriting (+998 XX XXX XX XX)"
          : "Введите полный номер телефона";
    }
    if (!form.message.trim() || form.message.trim().length < 5) {
      e.message =
        lang === "uz"
          ? "Xabar kamida 5 ta belgi bo'lishi kerak"
          : "Сообщение минимум 5 символов";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.sendContact({
        name: form.name.trim(),
        phone: form.phone,
        message: form.message.trim(),
      });

      if (res.success) {
        setSuccess(true);
        setForm({ name: "", phone: "+998 ", message: "" });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert(res.error || "Xatolik");
      }
    } catch (err) {
      alert(lang === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  const infoItems = [
    {
      icon: "📍",
      labelUz: "Manzil",
      labelRu: "Адрес",
      value:
        lang === "uz"
          ? "Qashqadaryo viloyati, Qarshi shahri, I.Karimov ko'chasi, 276-uy"
          : "Кашкадарьинская обл., г. Карши, ул. И.Каримова, 276",
    },
    {
      icon: "📞",
      labelUz: "Telefon",
      labelRu: "Телефон",
      value: "+998 98 777 07 27",
    },
    {
      icon: "✉️",
      labelUz: "Email",
      labelRu: "Email",
      value: "info@yoshijodkor.uz",
    },
    {
      icon: "🤝",
      labelUz: "Hamkorlik",
      labelRu: "Партнёрство",
      value:
        lang === "uz"
          ? "Qashqadaryo viloyati Xalq ta'limi boshqarmasi"
          : "Управление народного образования Кашкадарьинской обл.",
    },
    {
      icon: "🕐",
      labelUz: "Ish vaqti",
      labelRu: "Режим работы",
      value:
        lang === "uz"
          ? "09:00 - 22:00 (Dushanba-Yakshanba)"
          : "09:00 - 22:00 (Пн-Вс)",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-screen">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">📞</div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          {lang === "uz" ? "Aloqa" : "Связь"}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ma'lumot ro'yxati */}
        <div className="space-y-4">
          {infoItems.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-4"
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                  {lang === "uz" ? item.labelUz : item.labelRu}
                </div>
                <div className="font-semibold text-gray-800">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Forma */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-black text-gray-800 mb-5">
            {lang === "uz" ? "Xabar yuborish" : "Отправить сообщение"}
          </h3>

          {success ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h4 className="text-lg font-black text-gray-900 mb-1">
                {lang === "uz" ? "Xabar yuborildi!" : "Сообщение отправлено!"}
              </h4>
              <p className="text-sm text-gray-500">
                {lang === "uz"
                  ? "Rahmat! Tez orada bog'lanamiz."
                  : "Спасибо! Мы свяжемся с вами."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  placeholder={lang === "uz" ? "Ismingiz" : "Ваше имя"}
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db] ${
                    errors.name ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="+998 __ ___ __ __"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db] ${
                    errors.phone ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => {
                    setForm({ ...form, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: "" });
                  }}
                  placeholder={
                    lang === "uz" ? "Xabaringiz..." : "Ваше сообщение..."
                  }
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db] resize-none ${
                    errors.message ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a56db] text-white py-3 rounded-xl font-bold hover:bg-[#1341a8] disabled:bg-gray-300 transition"
              >
                {loading
                  ? lang === "uz"
                    ? "Yuborilmoqda..."
                    : "Отправка..."
                  : lang === "uz"
                  ? "Yuborish"
                  : "Отправить"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── About Page ───────────────────────────────────────────────────────
export function AboutPage() {
  const { lang } = useStore();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-screen">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🏫</div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">
          {lang === "uz" ? "Biz haqimizda" : "О нас"}
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-base">
          {lang === "uz"
            ? "Maktab o'quvchilari ijodini qo'llab-quvvatlash va sotiladigan platforma"
            : "Платформа для поддержки и продажи творческих работ школьников"}
        </p>
      </div>

      {/* Asosiy matn */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-xl font-black text-[#1a56db] mb-5">
          {lang === "uz"
            ? "Yosh ijodkorlar uchun platforma"
            : "Платформа для юных творцов"}
        </h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            {lang === "uz"
              ? "Ushbu platforma nafaqat zamonaviy raqamli yechimlarni taqdim etadi, balki eng avvalo o'quvchilarning ijodiy salohiyatini rivojlantirish va ularni qo'llab-quvvatlashga xizmat qiladi."
              : "Данная платформа не только предлагает современные цифровые решения, но прежде всего служит развитию творческого потенциала учеников и их поддержке."}
          </p>
          <p>
            {lang === "uz"
              ? "Ushbu platforma orqali maktab o'quvchilari o'z ijod mahsulotlarini — rasmlar, qo'l mehnati buyumlari, tikuv ishlari va boshqa noyob ishlanmalarni namoyish etish, sotish va keng jamoatchilikka taqdim etish imkoniyatiga ega bo'ladi."
              : "Через эту платформу школьники могут демонстрировать, продавать и представлять широкой общественности свои творческие работы — картины, изделия ручной работы, швейные работы и другие уникальные изделия."}
          </p>
          <p>
            {lang === "uz"
              ? "Platformamiz yosh ijodkorlarni rag'batlantirish, ularning iste'dodini yuzaga chiqarish va kelajakda mustahkam poydevor yaratishga qaratilgan."
              : "Наша платформа направлена на поощрение юных творцов, раскрытие их таланта и создание прочного фундамента для будущего."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            emoji: "🎨",
            titleUz: "O'quvchilar ijodi",
            titleRu: "Творчество учеников",
            descUz: "Maktab o'quvchilari tomonidan yaratilgan noyob san'at asarlari",
            descRu: "Уникальные произведения искусства, созданные школьниками",
          },
          {
            emoji: "💰",
            titleUz: "Qo'shimcha daromad",
            titleRu: "Дополнительный доход",
            descUz: "Har bir sotuvdan maktab va o'quvchiga daromad",
            descRu: "Доход для школы и ученика с каждой продажи",
          },
          {
            emoji: "🌟",
            titleUz: "Tarbiyaviy maqsad",
            titleRu: "Воспитательная цель",
            descUz: "Bolalarni mehnat va tadbirkorlikka o'rgatish",
            descRu: "Обучение детей труду и предпринимательству",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center"
          >
            <div className="text-4xl mb-3">{item.emoji}</div>
            <h3 className="font-black text-gray-800 mb-2">
              {lang === "uz" ? item.titleUz : item.titleRu}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {lang === "uz" ? item.descUz : item.descRu}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-black mb-3">
          {lang === "uz" ? "Bizning missiyamiz" : "Наша миссия"}
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
          {lang === "uz"
            ? "Yoshijodkor.uz — Qashqadaryo viloyati maktab o'quvchilari ijodini butun O'zbekistonga taqdim etuvchi raqamli platforma. Biz o'quvchilarni rag'batlantirish, ularning ijodiy qobiliyatlarini rivojlantirish va ota-onalarga sifatli, qo'lda yasalgan mahsulotlar taqdim etish uchun yaratilganmiz."
            : "Yoshijodkor.uz — цифровая платформа, представляющая творчество школьников Кашкадарьинской области всему Узбекистану. Мы созданы для поощрения учеников, развития их творческих способностей и предоставления родителям качественных handmade товаров."}
        </p>
      </div>
    </div>
  );
}
