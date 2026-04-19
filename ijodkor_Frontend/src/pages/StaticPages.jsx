import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  User,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import useStore from "../store/useStore";
import { api } from "../services/api";

// ── Helper: telefon maskasi ─────────────────────────────────────────
function formatPhone(value) {
  // Faqat raqamlarni qoldirish
  let digits = value.replace(/\D/g, "");

  // 998 bilan boshlanmasa, qo'shamiz
  if (!digits.startsWith("998")) {
    if (digits.startsWith("0")) digits = digits.slice(1);
    digits = "998" + digits;
  }

  // Maksimal 12 raqam (998 XX XXX XX XX)
  digits = digits.slice(0, 12);

  // Formatlash
  let formatted = "+998";
  if (digits.length > 3) formatted += " " + digits.slice(3, 5);
  if (digits.length > 5) formatted += " " + digits.slice(5, 8);
  if (digits.length > 8) formatted += " " + digits.slice(8, 10);
  if (digits.length > 10) formatted += " " + digits.slice(10, 12);

  return formatted;
}

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
          {lang === "uz" ? "Biz bilan aloqa" : "Связаться с нами"}
        </h1>
        <p className="text-gray-500">
          {lang === "uz"
            ? "Savol yoki takliflaringiz bo'lsa — bizga yozing, tez orada javob beramiz"
            : "Если у вас есть вопросы или предложения — напишите нам"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6">
        {/* ── Kontakt info ────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-3xl p-6">
            <h3 className="font-black text-xl mb-5">
              {lang === "uz" ? "Ma'lumot" : "Информация"}
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <div className="text-white/70 text-xs uppercase font-bold mb-1">
                    {lang === "uz" ? "Telefon" : "Телефон"}
                  </div>
                  <a
                    href="tel: +998987770727"
                    className="font-bold text-base hover:text-white/80"
                  >
                    +998 98 777 07 27
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-white/70 text-xs uppercase font-bold mb-1">
                    Email
                  </div>
                  <a
                    href="mailto:info@yoshijodkor.uz"
                    className="font-bold text-base hover:text-white/80 break-all"
                  >
                    info@yoshijodkor.uz
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-white/70 text-xs uppercase font-bold mb-1">
                    {lang === "uz" ? "Manzil" : "Адрес"}
                  </div>
                  <div className="font-bold text-sm leading-relaxed">
                    {lang === "uz"
                      ? "Qashqadaryo viloyati, Qarshi sh."
                      : "Кашкадарьинская обл., г. Карши"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ish vaqti */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h4 className="font-black text-sm text-gray-800 mb-3">
              🕐 {lang === "uz" ? "Ish vaqti" : "Режим работы"}
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>{lang === "uz" ? "Dush - Juma" : "Пн - Пт"}:</span>
                <span className="font-bold">9:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>{lang === "uz" ? "Shanba" : "Суббота"}:</span>
                <span className="font-bold">9:00 - 14:00</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>{lang === "uz" ? "Yakshanba" : "Воскресенье"}:</span>
                <span className="font-bold">
                  {lang === "uz" ? "Dam" : "Выходной"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Forma ─────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8">
          {success ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                {lang === "uz" ? "Xabar yuborildi!" : "Сообщение отправлено!"}
              </h3>
              <p className="text-gray-500">
                {lang === "uz"
                  ? "Rahmat! Tez orada siz bilan bog'lanamiz."
                  : "Спасибо! Мы свяжемся с вами в ближайшее время."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-black text-xl text-gray-900 mb-4">
                {lang === "uz" ? "Xabar yuborish" : "Отправить сообщение"}
              </h3>

              {/* Ism */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  {lang === "uz" ? "Ismingiz" : "Ваше имя"} *
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    placeholder={
                      lang === "uz" ? "Ismingizni kiriting" : "Введите ваше имя"
                    }
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-sm outline-none transition ${
                      errors.name
                        ? "border-red-400"
                        : "border-gray-200 focus:border-[#1a56db]"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Telefon — MASK */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  {lang === "uz" ? "Telefon raqam" : "Телефон"} *
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    placeholder="+998 90 000 00 00"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-base outline-none transition font-mono ${
                      errors.phone
                        ? "border-red-400"
                        : "border-gray-200 focus:border-[#1a56db]"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {lang === "uz"
                    ? "Format: +998 90 000 00 00"
                    : "Формат: +998 90 000 00 00"}
                </p>
              </div>

              {/* Xabar */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  {lang === "uz" ? "Xabar matni" : "Сообщение"} *
                </label>
                <div className="relative">
                  <MessageSquare
                    size={16}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <textarea
                    value={form.message}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: "" });
                    }}
                    rows={5}
                    placeholder={
                      lang === "uz"
                        ? "Savol yoki taklifingizni yozing..."
                        : "Напишите ваш вопрос или предложение..."
                    }
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-sm outline-none transition resize-none ${
                      errors.message
                        ? "border-red-400"
                        : "border-gray-200 focus:border-[#1a56db]"
                    }`}
                  />
                </div>
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {form.message.length} / 500
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a56db] to-[#1341a8] hover:from-[#1341a8] hover:to-[#0d2a70] disabled:from-gray-300 disabled:to-gray-400 text-white py-3.5 rounded-xl font-black text-base transition"
              >
                <Send size={16} />
                {loading
                  ? lang === "uz"
                    ? "Yuborilmoqda..."
                    : "Отправка..."
                  : lang === "uz"
                  ? "Xabar yuborish"
                  : "Отправить сообщение"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── About Page (ilgari mavjud bo'lsa qoldiring) ──────────────────────
export function AboutPage() {
  const { lang } = useStore();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
        {lang === "uz" ? "Biz haqimizda" : "О нас"}
      </h1>
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 text-gray-700 leading-relaxed space-y-4">
        <p>
          {lang === "uz"
            ? "YoshIjodkor Market — Qashqadaryo viloyati o'quvchilarining ijod mahsulotlarini sotish, ayniqsa imkoniyati cheklangan bolalarga yordam berish uchun yaratilgan platforma."
            : "YoshIjodkor Market — платформа для продажи творческих работ школьников Кашкадарьинской области, особенно для помощи детям с ограниченными возможностями."}
        </p>
        <p>
          {lang === "uz"
            ? "Bizning maqsadimiz — har bir bolaning ijodini qadrlash va uni butun jamiyatga ko'rsatish. Siz mahsulot sotib olishingiz, yoki to'g'ridan-to'g'ri bolalarga yordam berishingiz mumkin."
            : "Наша цель — ценить творчество каждого ребёнка и показывать его всему обществу."}
        </p>
      </div>
    </div>
  );
}
