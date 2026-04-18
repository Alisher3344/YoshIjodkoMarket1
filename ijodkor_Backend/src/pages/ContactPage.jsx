import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useLangStore } from "../store";
import toast from "react-hot-toast";

export default function ContactPage() {
  const { lang, t } = useLangStore();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.message) {
      toast.error(
        lang === "uz" ? "Barcha maydonlarni to'ldiring" : "Заполните все поля"
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(
          lang === "uz" ? "Xabar yuborildi! ✅" : "Сообщение отправлено! ✅"
        );
        setForm({ name: "", phone: "", message: "" });
      } else {
        toast.error(lang === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка");
      }
    } catch {
      toast.error(
        lang === "uz"
          ? "Server bilan bog'lanib bo'lmadi"
          : "Не удалось подключиться к серверу"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-[#4c1d95] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-black mb-1 font-serif">
            {t("contact_title")}
          </h1>
          <p className="text-white/60">
            {lang === "uz" ? "Biz bilan bog'laning" : "Свяжитесь с нами"}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact cards */}
          <div className="space-y-5">
            {[
              {
                icon: <MapPin className="w-5 h-5" />,
                label: t("contact_address_label"),
                value: "Qarshi sh., I.Karimov ko'chasi, 276-uy",
                href: null,
              },
              {
                icon: <Phone className="w-5 h-5" />,
                label: t("contact_phone_label"),
                value: "+998 98 777 07 27",
                href: "tel:+998987770727",
              },
              {
                icon: <Mail className="w-5 h-5" />,
                label: t("contact_email_label"),
                value: "info@yoshijodkor.uz",
                href: "mailto:info@yoshijodkor.uz",
              },
              {
                icon: <Clock className="w-5 h-5" />,
                label: lang === "uz" ? "Ish vaqti" : "Время работы",
                value: t("contact_hours"),
                href: null,
              },
            ].map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 flex items-start gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#8b5cf6] flex items-center justify-center text-white shrink-0 shadow-lg">
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                    {c.label}
                  </p>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="font-bold text-[#4c1d95] hover:text-[#7c3aed] transition-colors"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="font-bold text-[#4c1d95]">{c.value}</p>
                  )}
                </div>
              </div>
            ))}

            <a
              href="https://t.me/yoshijodkorlarimiz"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 bg-[#0088cc] text-white rounded-2xl p-5 hover:bg-[#0070aa] transition-colors shadow-lg"
            >
              <Send className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-black">Telegram</p>
                <p className="text-white/80 text-sm">@yoshijodkorlarimiz</p>
              </div>
            </a>
          </div>

          {/* Message form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="font-black text-[#4c1d95] text-xl mb-6 font-serif">
              {lang === "uz" ? "Xabar yuborish" : "Отправить сообщение"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  {lang === "uz" ? "Ismingiz" : "Ваше имя"}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={lang === "uz" ? "Ism Familiya" : "Имя Фамилия"}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4c1d95] outline-none text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  {lang === "uz" ? "Telefon" : "Телефон"}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+998 xx xxx xx xx"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4c1d95] outline-none text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  {lang === "uz" ? "Xabar" : "Сообщение"}
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder={
                    lang === "uz"
                      ? "Xabaringizni yozing..."
                      : "Напишите сообщение..."
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4c1d95] outline-none text-sm resize-none transition-colors"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#4c1d95] hover:bg-[#5b21b6] disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />{" "}
                    {lang === "uz" ? "Yuborish" : "Отправить"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
