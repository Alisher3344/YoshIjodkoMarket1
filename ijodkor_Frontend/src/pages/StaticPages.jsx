import { Link } from "react-router-dom";
import useStore from "../store/useStore";

export function AboutPage() {
  const { lang } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-gray-900 mb-6">
        {lang === "uz" ? "Biz haqimizda" : "О нас"}
      </h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
        <h2 className="text-xl font-black text-[#1a56db] mb-4">
          {lang === "uz" ? "Yoshijodkor.uz nima?" : "Что такое Yoshijodkor.uz?"}
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          {lang === "uz"
            ? "Yoshijodkor.uz — Qashqadaryo viloyati maktab o'quvchilarining ijodiy ishlarini sotish platformasi. Biz o'quvchilar tomonidan qo'lda yasalgan noyob mahsulotlarni sizga yetkazib beramiz."
            : "Yoshijodkor.uz — платформа для продажи творческих работ школьников Кашкадарьинской области. Мы доставляем вам уникальные изделия ручной работы, созданные учениками."}
        </p>
        <p className="text-gray-600 leading-relaxed">
          {lang === "uz"
            ? "Har bir xarid — o'quvchi kelajagiga hissa. Imkoniyati cheklangan o'quvchilar uchun to'lov bevosita ularning kartasiga o'tkaziladi."
            : "Каждая покупка — вклад в будущее ученика. Для учеников с ограниченными возможностями оплата переводится напрямую на их карту."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          {
            emoji: "🎨",
            titleUz: "O'quvchilar ijodi",
            titleRu: "Творчество учеников",
            descUz: "Noyob qo'lda yasalgan mahsulotlar",
            descRu: "Уникальные изделия ручной работы",
          },
          {
            emoji: "💰",
            titleUz: "Qo'shimcha daromad",
            titleRu: "Дополнительный доход",
            descUz: "Har bir sotuvdan o'quvchiga daromad",
            descRu: "Доход ученику с каждой продажи",
          },
          {
            emoji: "🌟",
            titleUz: "Tarbiyaviy maqsad",
            titleRu: "Воспитательная цель",
            descUz: "Bolalarni mehnatga o'rgatish",
            descRu: "Обучение детей труду",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-6 text-center"
          >
            <div className="text-4xl mb-3">{item.emoji}</div>
            <h3 className="font-black text-gray-900 mb-2">
              {lang === "uz" ? item.titleUz : item.titleRu}
            </h3>
            <p className="text-sm text-gray-500">
              {lang === "uz" ? item.descUz : item.descRu}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-[#1a56db] to-[#1e40af] rounded-3xl p-8 text-white text-center">
        <h2 className="text-2xl font-black mb-3">
          {lang === "uz" ? "Biz bilan bog'laning" : "Свяжитесь с нами"}
        </h2>
        <p className="text-blue-100 mb-6">
          {lang === "uz"
            ? "Savollaringiz bormi? Biz yordam berishga tayyormiz!"
            : "Есть вопросы? Мы готовы помочь!"}
        </p>
        <Link
          to="/contact"
          className="bg-white text-[#1a56db] px-8 py-3 rounded-2xl font-black hover:bg-blue-50 transition inline-block"
        >
          {lang === "uz" ? "Aloqa" : "Контакты"}
        </Link>
      </div>
    </div>
  );
}

export function ContactPage() {
  const { lang } = useStore();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-gray-900 mb-6">
        {lang === "uz" ? "Aloqa" : "Контакты"}
      </h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="space-y-4">
          {[
            {
              icon: "📞",
              label: lang === "uz" ? "Telefon" : "Телефон",
              value: "+998 98 777 07 27",
              href: "tel:+998987770727",
            },
            {
              icon: "✉️",
              label: "Email",
              value: "info@yoshijodkor.uz",
              href: "mailto:info@yoshijodkor.uz",
            },
            {
              icon: "📍",
              label: lang === "uz" ? "Manzil" : "Адрес",
              value:
                lang === "uz"
                  ? "Qashqadaryo viloyati, Qarshi sh."
                  : "Кашкадарьинская область, г. Карши",
              href: null,
            },
            {
              icon: "🕐",
              label: lang === "uz" ? "Ish vaqti" : "Режим работы",
              value: "09:00 — 22:00",
              href: null,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="font-bold text-[#1a56db] hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="font-bold text-gray-800">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 mb-4">
          {lang === "uz" ? "Ijtimoiy tarmoqlar" : "Социальные сети"}
        </h2>
        <div className="flex gap-3">
          <a
            href="https://t.me/yoshijodkor"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-[#1a56db] text-white px-5 py-3 rounded-2xl font-bold hover:bg-[#1341a8] transition"
          >
            Telegram
          </a>
          <a
            href="https://instagram.com/yoshijodkor"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-pink-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-pink-700 transition"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
