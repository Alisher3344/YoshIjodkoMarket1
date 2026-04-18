import { useEffect } from 'react'
import { MapPin, Phone, Mail, Globe, Target, Heart, Users, Award, Star, Lightbulb, Rocket } from 'lucide-react'
import { useLangStore } from '../store'

export default function AboutPage() {
  const { lang } = useLangStore()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const uz = (uz, ru) => lang === 'uz' ? uz : ru

  const stats = [
    { icon: '🎨', value: '500+', label: uz("Ijodiy mahsulot", "Творческих работ") },
    { icon: '👨‍🎓', value: '50+', label: uz("Faol o'quvchi", "Активных учеников") },
    { icon: '🏫', value: '10+', label: uz("Hamkor maktab", "Школ-партнёров") },
    { icon: '🌟', value: '200+', label: uz("Mamnun mijoz", "Довольных клиентов") },
  ]

  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      uz: "Ijod va muhabbat",
      ru: "Творчество и любовь",
      desc_uz: "Har bir o'quvchining ijodiy ishiga hurmat va muhabbat bilan yondashib, ularni rag'batlantiramiz.",
      desc_ru: "Мы с уважением и любовью относимся к каждой творческой работе ученика."
    },
    {
      icon: <Target className="w-6 h-6" />,
      uz: "Aniq maqsad",
      ru: "Чёткая цель",
      desc_uz: "Yosh ijodkorlarni rag'batlantirish va ularning iste'dodini keng jamoatchilikka taqdim etish.",
      desc_ru: "Поддержка молодых творцов и представление их таланта широкой аудитории."
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      uz: "Innovatsiya",
      ru: "Инновации",
      desc_uz: "Ta'limni raqamlashtirib, o'quvchilar uchun zamonaviy imkoniyatlar yaratamiz.",
      desc_ru: "Цифровизация образования и создание современных возможностей для учеников."
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      uz: "Kelajak",
      ru: "Будущее",
      desc_uz: "Har bir yosh iste'dod kelajakda kuchli poydevorga ega bo'lishi uchun zamin yaratamiz.",
      desc_ru: "Создаём прочную основу, чтобы каждый молодой талант имел сильное будущее."
    },
  ]

  const team = [
    {
      name: 'Axmedov Xondamir',
      role_uz: 'Loyiha rahbari',
      role_ru: 'Руководитель проекта',
      emoji: '👨‍💼',
      photo: '/team-xondamir.jpg',
      desc_uz: "Loyihaning asosiy g'oyasi va rivojlanishi uchun mas'ul",
      desc_ru: "Ответственный за основную идею и развитие проекта"
    },
    {
      name: 'Ziyodulla',
      role_uz: 'Backend dasturchi',
      role_ru: 'Backend разработчик',
      emoji: '👨‍💻',
      desc_uz: "Server tomoni, ma'lumotlar bazasi va API ishlab chiqish",
      desc_ru: "Разработка серверной части, базы данных и API"
    },
    {
      name: 'Fathulla',
      role_uz: 'Frontend dasturchi',
      role_ru: 'Frontend разработчик',
      emoji: '🧑‍🎨',
      desc_uz: "Foydalanuvchi interfeysi va dizayn amalga oshirish",
      desc_ru: "Разработка пользовательского интерфейса и дизайна"
    },
    {
      name: 'Javohir',
      role_uz: 'Dasturchi',
      role_ru: 'Разработчик',
      emoji: '👨‍🔧',
      desc_uz: "Platforma funksionalligini ishlab chiqish va qo'llab-quvvatlash",
      desc_ru: "Разработка функциональности платформы и её поддержка"
    },
  ]

  return (
    <div className="min-h-screen bg-[#faf9ff] pt-20">

      {/* ── HERO ── */}
      <div className="bg-[#4c1d95] hero-pattern text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#8b5cf6]/20 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <div className="flex items-center gap-5 mb-6">
            <img src="/logo.png" alt="logo" className="w-28 h-28 object-contain shrink-0" />
            <p className="text-white/90 text-xl leading-relaxed font-bold">
              {uz(
                "SSMART — Ta'limni raqamlashtirish yo'lida Qashqadaryo viloyati maktabgacha va maktab ta'limi boshqarmasi bilan hamkorlikda, Qashqadaryo tajribasi asosida yaratilgan platforma.",
                "SSMART — Платформа, созданная на основе опыта Кашкадарьи в сотрудничестве с Управлением дошкольного и школьного образования Кашкадарьинской области на пути цифровизации образования."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-2">{s.icon}</div>
                <p className="text-3xl font-black text-[#4c1d95]">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1 font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ABOUT TEXT ── */}
      <section className="py-16 bg-[#faf9ff]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#4c1d95] bg-[#ede9fe] px-4 py-1.5 rounded-full">
                {uz("Biz haqimizda", "О нас")}
              </span>
              <h2 className="text-3xl font-black text-[#4c1d95] mt-4 mb-5 font-serif leading-tight">
                {uz("Yosh ijodkorlar uchun platforma", "Платформа для молодых творцов")}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  {uz(
                    "Ushbu platforma nafaqat zamonaviy raqamli yechimlarni taqdim etadi, balki eng avvalo o'quvchilarning ijodiy salohiyatini rivojlantirish va ularni qo'llab-quvvatlashga xizmat qiladi.",
                    "Данная платформа не только предоставляет современные цифровые решения, но прежде всего служит развитию творческого потенциала учеников и их поддержке."
                  )}
                </p>
                <p>
                  {uz(
                    "Ushbu platforma orqali maktab o'quvchilari o'z ijod mahsulotlarini — rasmlar, qo'l mehnati buyumlari, tikuv ishlari va boshqa noyob ishlanmalarni namoyish etish, sotish va keng jamoatchilikka taqdim etish imkoniyatiga ega bo'ladi.",
                    "Через SSMART школьники могут демонстрировать, продавать и представлять широкой аудитории свои творческие работы — рисунки, изделия ручной работы, шитьё и другие уникальные продукты."
                  )}
                </p>
                <p>
                  {uz(
                    "Platformamiz yosh ijodkorlarni rag'batlantirish, ularning iste'dodini yuzaga chiqarish va kelajakda mustahkam poydevor yaratishga qaratilgan.",
                    "Наша платформа направлена на поощрение молодых творцов, раскрытие их таланта и создание прочной основы для будущего."
                  )}
                </p>
              </div>
            </div>

            {/* Info card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#4c1d95]/10">
              <h3 className="font-black text-[#4c1d95] text-lg mb-6 font-serif flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {uz("Aloqa ma'lumotlari", "Контактные данные")}
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ede9fe] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#4c1d95]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                      {uz("Manzil", "Адрес")}
                    </p>
                    <p className="text-gray-700 font-semibold leading-snug">
                      Qashqadaryo viloyati, Qarshi shahri,<br />I.Karimov ko'chasi, 276-uy
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ede9fe] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#4c1d95]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                      {uz("Telefon", "Телефон")}
                    </p>
                    <a href="tel:+998987770727" className="text-[#4c1d95] font-black hover:underline text-lg">
                      +998 98 777 07 27
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ede9fe] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#4c1d95]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
                    <a href="mailto:info@yoshijodkor.uz" className="text-[#4c1d95] font-bold hover:underline">
                      info@yoshijodkor.uz
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ede9fe] flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-[#4c1d95]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                      {uz("Hamkorlik", "Партнёрство")}
                    </p>
                    <p className="text-gray-700 font-semibold leading-snug">
                      {uz(
                        "Qashqadaryo viloyati Xalq ta'limi boshqarmasi",
                        "Управление народного образования Кашкадарьинской области"
                      )}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#4c1d95] bg-[#ede9fe] px-4 py-1.5 rounded-full">
              {uz("Qadriyatlarimiz", "Наши ценности")}
            </span>
            <h2 className="text-3xl font-black text-[#4c1d95] mt-4 font-serif">
              {uz("Biz nimaga ishonamiz?", "Во что мы верим?")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <div key={i}
                className="group bg-[#faf9ff] hover:bg-[#4c1d95] rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:shadow-[#4c1d95]/20 hover:-translate-y-1 border border-[#4c1d95]/6 cursor-default">
                <div className="w-14 h-14 bg-[#ede9fe] group-hover:bg-white/20 rounded-2xl flex items-center justify-center text-[#4c1d95] group-hover:text-white mx-auto mb-4 transition-all">
                  {v.icon}
                </div>
                <h3 className="font-black text-[#4c1d95] group-hover:text-white mb-2 transition-colors font-serif">
                  {lang === 'uz' ? v.uz : v.ru}
                </h3>
                <p className="text-gray-500 group-hover:text-white/70 text-sm leading-relaxed transition-colors">
                  {lang === 'uz' ? v.desc_uz : v.desc_ru}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-16 bg-[#faf9ff]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#4c1d95] bg-[#ede9fe] px-4 py-1.5 rounded-full">
              {uz("Jamoa", "Команда")}
            </span>
            <h2 className="text-3xl font-black text-[#4c1d95] mt-4 font-serif">
              {uz("Bizning jamoa", "Наша команда")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {team.map((m, i) => (
              <div key={i}
                className="bg-white rounded-3xl p-6 shadow-sm border border-[#4c1d95]/10 hover:shadow-xl hover:shadow-[#4c1d95]/10 transition-all text-center group hover:-translate-y-1">
                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 shadow-xl shadow-[#4c1d95]/30 group-hover:scale-105 transition-transform">
                  {m.photo
                    ? <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-[#4c1d95] to-[#7c3aed] flex items-center justify-center text-5xl">{m.emoji}</div>
                  }
                </div>
                <h3 className="text-lg font-black text-[#4c1d95] mb-1 font-serif">{m.name}</h3>
                <p className="text-[#7c3aed] font-bold text-sm mb-3">
                  {lang === 'uz' ? m.role_uz : m.role_ru}
                </p>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">
                  {lang === 'uz' ? m.desc_uz : m.desc_ru}
                </p>
                {m.name === 'Axmedov Xondamir' && (
                  <a href="tel:+998987770727"
                    className="inline-flex items-center gap-2 bg-[#ede9fe] hover:bg-[#4c1d95] hover:text-white text-[#4c1d95] font-bold text-xs px-4 py-2 rounded-xl transition-all">
                    <Phone className="w-3.5 h-3.5" /> +998 98 777 07 27
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION BANNER ── */}
      <section className="py-14 bg-[#4c1d95] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <Star className="w-10 h-10 text-white/30 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-4 font-serif">
            {uz("Bizning missiya", "Наша миссия")}
          </h2>
          <p className="text-white/75 text-lg leading-relaxed">
            {uz(
              "Har bir o'quvchining ijodiy ishi qadrlanishi, ularning iste'dodi yuzaga chiqishi va munosib narxda sotilishi uchun qulay va zamonaviy platforma yaratish.",
              "Создать удобную современную платформу, где каждая творческая работа ученика будет оценена, талант — раскрыт, а труд — достойно вознаграждён."
            )}
          </p>
        </div>
      </section>
    </div>
  )
}
