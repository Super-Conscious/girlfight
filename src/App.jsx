import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './CartContext'
import { CartDrawer } from './Home'
import Home from './Home'
import Splash from './Splash'
import ShopAll from './ShopAll'
import ProductPage from './ProductPage'
import LegalPage from './LegalPage'
import NotFound from './NotFound'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopAll />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/legal/:slug" element={<LegalPage />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
