import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SearchModal from './components/ui/SearchModal'
import InstallBanner from './components/ui/InstallBanner'

import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import CustomOrderPage from './pages/CustomOrderPage'
import CheckoutSuccessPage from './pages/CheckoutSuccessPage'

import { useAuthStore, useProductStore } from './store'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuthStore()
  return isLoggedIn ? children : <Navigate to="/admin" replace />
}

function Layout({ children }) {
  const [searchOpen, setSearchOpen] = useState(false)
  return (
    <>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <main>{children}</main>
      <Footer />
      <InstallBanner />
    </>
  )
}

export default function App() {
  const fetchProducts = useProductStore(s => s.fetchProducts)
  useEffect(() => { fetchProducts() }, [])

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
        <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/cart" element={<Layout><CartPage /></Layout>} />
        <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/custom-order" element={<Layout><CustomOrderPage /></Layout>} />
        <Route path="/checkout/success" element={<Layout><CheckoutSuccessPage /></Layout>} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Layout><AdminDashboardPage /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
