import useStore from '../store/useStore';

export function AboutPage() {
  const { lang } = useStore();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-screen">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🏫</div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">
          {lang === 'uz' ? "Biz haqimizda" : "О нас"}
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-base">
          {lang === 'uz'
            ? "Maktab o'quvchilari ijodini qo'llab-quvvatlash va sotiladigan platforma"
            : "Платформа для поддержки и продажи творческих работ школьников"}
        </p>
      </div>

      {/* Asosiy matn */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-xl font-black text-[#1a56db] mb-5">
          {lang === 'uz' ? "Yosh ijodkorlar uchun platforma" : "Платформа для юных творцов"}
        </h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            {lang === 'uz'
              ? "Ushbu platforma nafaqat zamonaviy raqamli yechimlarni taqdim etadi, balki eng avvalo o'quvchilarning ijodiy salohiyatini rivojlantirish va ularni qo'llab-quvvatlashga xizmat qiladi."
              : "Данная платформа не только предлагает современные цифровые решения, но прежде всего служит развитию творческого потенциала учеников и их поддержке."}
          </p>
          <p>
            {lang === 'uz'
              ? "Ushbu platforma orqali maktab o'quvchilari o'z ijod mahsulotlarini — rasmlar, qo'l mehnati buyumlari, tikuv ishlari va boshqa noyob ishlanmalarni namoyish etish, sotish va keng jamoatchilikka taqdim etish imkoniyatiga ega bo'ladi."
              : "Через эту платформу школьники могут демонстрировать, продавать и представлять широкой общественности свои творческие работы — картины, изделия ручной работы, швейные работы и другие уникальные изделия."}
          </p>
          <p>
            {lang === 'uz'
              ? "Platformamiz yosh ijodkorlarni rag'batlantirish, ularning iste'dodini yuzaga chiqarish va kelajakda mustahkam poydevor yaratishga qaratilgan."
              : "Наша платформа направлена на поощрение юных творцов, раскрытие их таланта и создание прочного фундамента для будущего."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { emoji: "🎨", titleUz: "O'quvchilar ijodi", titleRu: "Творчество учеников", descUz: "Maktab o'quvchilari tomonidan yaratilgan noyob san'at asarlari", descRu: "Уникальные произведения искусства, созданные школьниками" },
          { emoji: "💰", titleUz: "Qo'shimcha daromad", titleRu: "Дополнительный доход", descUz: "Har bir sotuvdan maktab va o'quvchiga daromad", descRu: "Доход для школы и ученика с каждой продажи" },
          { emoji: "🌟", titleUz: "Tarbiyaviy maqsad", titleRu: "Воспитательная цель", descUz: "Bolalarni mehnat va tadbirkorlikka o'rgatish", descRu: "Обучение детей труду и предпринимательству" },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-3">{item.emoji}</div>
            <h3 className="font-black text-gray-800 mb-2">{lang === 'uz' ? item.titleUz : item.titleRu}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{lang === 'uz' ? item.descUz : item.descRu}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-black mb-3">
          {lang === 'uz' ? "Bizning missiyamiz" : "Наша миссия"}
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
          {lang === 'uz'
            ? "Yoshijodkor.uz — Qashqadaryo viloyati maktab o'quvchilari ijodini butun O'zbekistonga taqdim etuvchi raqamli platforma. Biz o'quvchilarni rag'batlantirish, ularning ijodiy qobiliyatlarini rivojlantirish va ota-onalarga sifatli, qo'lda yasalgan mahsulotlar taqdim etish uchun yaratilganmiz."
            : "Yoshijodkor.uz — цифровая платформа, представляющая творчество школьников Кашкадарьинской области всему Узбекистану. Мы созданы для поощрения учеников, развития их творческих способностей и предоставления родителям качественных handmade товаров."}
        </p>
      </div>
    </div>
  );
}

export function ContactPage() {
  const { t, lang } = useStore();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-screen">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">📞</div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">{t('contact')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {[
            { icon: "📍", labelUz: "Manzil", labelRu: "Адрес", value: "Qashqadaryo viloyati, Qarshi shahri, I.Karimov ko'chasi, 276-uy" },
            { icon: "📞", labelUz: "Telefon", labelRu: "Телефон", value: "+998 98 777 07 27" },
            { icon: "✉️", labelUz: "Email", labelRu: "Email", value: "info@yoshijodkor.uz" },
            { icon: "🤝", labelUz: "Hamkorlik", labelRu: "Партнёрство", value: "Qashqadaryo viloyati Xalq ta'limi boshqarmasi" },
            { icon: "🕐", labelUz: "Ish vaqti", labelRu: "Режим работы", value: "09:00 - 22:00 (Dushanba-Yakshanba)" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                  {lang === 'uz' ? item.labelUz : item.labelRu}
                </div>
                <div className="font-semibold text-gray-800">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-black text-gray-800 mb-5">
            {lang === 'uz' ? "Xabar yuborish" : "Отправить сообщение"}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder={lang === 'uz' ? "Ismingiz" : "Ваше имя"}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db]"
            />
            <input
              type="tel"
              placeholder="+998 __ ___ __ __"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db]"
            />
            <textarea
              rows={4}
              placeholder={lang === 'uz' ? "Xabaringiz..." : "Ваше сообщение..."}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db] resize-none"
            />
            <button className="w-full bg-[#1a56db] text-white py-3 rounded-xl font-bold hover:bg-[#1341a8] transition">
              {lang === 'uz' ? "Yuborish" : "Отправить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
