import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X, Search, Globe, UserCircle } from 'lucide-react'
import { useLangStore, useCartStore } from '../../store'

export default function Navbar({ onSearchOpen }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { lang, setLang, t } = useLangStore()
  const cartCount = useCartStore(s => s.items.reduce((sum, i) => sum + i.qty, 0))
  const location = useLocation()

  const navLinks = [
    { to: '/', label: lang === 'uz' ? 'Bosh sahifa' : 'Главная' },
    { to: '/products', label: lang === 'uz' ? 'Mahsulotlar' : 'Товары' },
    { to: '/about', label: lang === 'uz' ? 'Biz haqimizda' : 'О нас' },
    { to: '/contact', label: lang === 'uz' ? 'Aloqa' : 'Контакты' },
  ]
  const isActive = (p) => location.pathname === p

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#4c1d95] shadow-xl shadow-[#4c1d95]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-20 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/ssmart-logo.png" alt="SSMART" className="h-12 object-contain" />
            <div className="w-px h-8 bg-white/20" />
            <img src="/navbar-logo.png" alt="logo" className="w-10 h-10 object-contain" />
            <p className="text-white font-black text-xs leading-snug max-w-[200px] hidden lg:block">
              Qashqadaryo viloyati maktabgacha va maktab ta'limi boshqarmasi bilan hamkorlikda
            </p>
          </Link>

          {/* Desktop Nav — right */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-end mr-2">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  isActive(link.to)
                    ? 'bg-white text-[#3b0764]'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}>
                {link.label}
              </Link>
            ))}

            {/* Buyurtma berish — special */}
            <Link to="/custom-order"
              className={`px-3 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap border-2 ${
                isActive('/custom-order')
                  ? 'bg-white text-[#3b0764] border-white'
                  : 'bg-white text-[#3b0764] border-white hover:bg-white/90 hover:scale-105 shadow-lg'
              }`}>
              ✨ {lang === 'uz' ? 'Buyurtma' : 'Заказ'}
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button onClick={onSearchOpen}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              <Search className="w-4.5 h-4.5" />
            </button>

            <button onClick={() => setLang(lang === 'uz' ? 'ru' : 'uz')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-black rounded-xl transition-all">
              <Globe className="w-3.5 h-3.5" />
              {lang === 'uz' ? 'RU' : 'UZ'}
            </button>

            <Link to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white hover:text-[#3b0764] text-white text-xs font-black rounded-xl transition-all border border-white/20">
              <UserCircle className="w-4 h-4" />
              {lang === 'uz' ? 'Kabinet' : 'Кабинет'}
            </Link>

            <Link to="/cart" className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              <ShoppingCart className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-white text-[#3b0764] text-xs font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button className="md:hidden p-2 text-white/70 hover:text-white rounded-xl"
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#3b0764] border-t border-white/10 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive(link.to)
                  ? 'bg-white text-[#3b0764]'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}>
              {link.label}
            </Link>
          ))}
          <Link to="/custom-order" onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl text-sm font-black bg-white text-[#3b0764] shadow-lg">
            ✨ {lang === 'uz' ? 'Buyurtma berish' : 'Сделать заказ'}
          </Link>
          <Link to="/admin" onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 rounded-xl text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all">
            👤 {lang === 'uz' ? 'Shaxsiy kabinet' : 'Личный кабинет'}
          </Link>
        </div>
      )}
    </nav>
  )
}
