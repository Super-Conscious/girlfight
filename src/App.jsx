import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { CartProvider } from './CartContext'
import { AuthProvider } from './AuthContext'
import { CartDrawer } from './Home'
import Home from './Home'
import Splash from './Splash'
import ShopAll from './ShopAll'
import ProductPage from './ProductPage'
import LegalPage from './LegalPage'
import NotFound from './NotFound'
import { LoginPage, RegisterPage, AccountPage } from './AccountPages'

/* Reset to the top of the page on every route change. Jumps instantly
   (temporarily disabling the global `scroll-behavior: smooth`) so pages
   never animate-scroll up from a previous position. Hash links like
   /#about are left alone so they can scroll to their target. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    const html = document.documentElement
    const prev = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    html.style.scrollBehavior = prev
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <CartDrawer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopAll />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/legal/:slug" element={<LegalPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/splash" element={<Splash />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
