import { Link } from 'react-router-dom'
import { Phone, MapPin, Mail, Send, Heart, Globe } from "lucide-react"
import { useLangStore } from '../../store'

export default function Footer() {
  const { t, lang } = useLangStore()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#3b0764] text-white">
      <div className="h-1 bg-gradient-to-r from-[#4c1d95] via-[#ffffff] to-[#4c1d95]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-black font-serif">Yosh Ijodkor</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-5">{t('footer_desc')}</p>
            <div className="flex gap-2">
              {[
                { icon: <Send className="w-4 h-4"/>, href:'https://t.me/yoshijodkorlarimiz' },
                { icon: <Heart className="w-4 h-4"/>, href:'#' },
                { icon: <Globe className="w-4 h-4"/>, href:'#' },
              ].map((s,i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-[#ffffff] hover:text-[#3b0764] flex items-center justify-center transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-base mb-4 text-[#ffffff]">{t('footer_links')}</h4>
            <ul className="space-y-2">
              {[
                {to:'/',label:t('nav_home')},{to:'/products',label:t('nav_products')},
                {to:'/about',label:t('nav_about')},{to:'/contact',label:t('nav_contact')},
                {to:'/admin',label:t('nav_admin')},
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/50 hover:text-[#ffffff] text-sm transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-[#ffffff] transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-base mb-4 text-[#ffffff]">{t('contact_title')}</h4>
            <ul className="space-y-3">
              {[
                { icon:<MapPin className="w-4 h-4"/>, text:"Qarshi sh., I.Karimov ko'chasi, 276-uy" },
                { icon:<Phone className="w-4 h-4"/>, text:'+998 98 777 07 27', href:'tel:+998987770727' },
                { icon:<Mail className="w-4 h-4"/>, text:'info@yoshijodkor.uz', href:'mailto:info@yoshijodkor.uz' },
              ].map((c,i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/50">
                  <span className="text-[#ffffff] shrink-0 mt-0.5">{c.icon}</span>
                  {c.href
                    ? <a href={c.href} className="hover:text-white transition-colors">{c.text}</a>
                    : <span>{c.text}</span>}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-base mb-4 text-[#ffffff]">{t('footer_install')}</h4>
            <p className="text-white/50 text-sm mb-4">{t('footer_install_sub')}</p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain" />
                <div>
                  <p className="text-sm font-black">Yosh Ijodkor</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-sm">© {year} Yosh Ijodkor. {t('footer_rights')}.</p>
          <p className="text-white/20 text-xs">Made with ❤️ for students</p>
        </div>
      </div>
    </footer>
  )
}
