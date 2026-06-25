import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import {
  getCart, createCart, addLines, updateLine, removeLines, shopifyConfigured,
} from './lib/shopify'
import { formatMoney, handleFor } from './lib/catalog'
import { PRODUCTS } from './products'
import { useShop } from './ShopContext'

/* Shopify-backed cart. Keeps the exact public surface the UI already uses
   (items / count / subtotal / addItem / removeItem / updateQty / open / close)
   but lines are real Shopify cart lines, so `checkout()` hands off to Shopify's
   hosted checkout. We persist only the cart id; line data lives server-side. */
const CartContext = createContext(null)
const STORAGE_KEY = 'gf_cart_id'

export function CartProvider({ children }) {
  const { getVariant } = useShop()
  const [cart, setCart] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  // Rehydrate an existing Shopify cart; drop the id if it expired/completed.
  useEffect(() => {
    if (!shopifyConfigured) return
    const id = localStorage.getItem(STORAGE_KEY)
    if (!id) return
    getCart(id)
      .then((c) => { if (c) setCart(c); else localStorage.removeItem(STORAGE_KEY) })
      .catch(() => localStorage.removeItem(STORAGE_KEY))
  }, [])

  const persist = useCallback((c) => {
    setCart(c)
    if (c?.id) localStorage.setItem(STORAGE_KEY, c.id)
  }, [])

  // addItem(localProduct, { size, isWhite, ink, qty }) — resolves to a real
  // Shopify variant before adding. `color` is accepted as an alias for `ink`.
  const addItem = useCallback(async (product, opts = {}) => {
    const { size = 'OS', isWhite = false, ink = '', color = '', qty = 1 } = opts
    const variant = getVariant(product, { isWhite, ink: ink || color, size })
    if (!variant) {
      console.warn('[cart] no Shopify variant for', product?.id, { isWhite, ink: ink || color, size })
      alert('That size/color isn’t available yet — check back soon.')
      return
    }
    if (variant.availableForSale === false) {
      alert('Sorry, that option is sold out.')
      return
    }
    setBusy(true)
    try {
      const id = cart?.id || localStorage.getItem(STORAGE_KEY)
      let c = null
      if (id) {
        try { c = await addLines(id, [{ merchandiseId: variant.id, quantity: qty }]) }
        catch { c = null } // stale/completed cart — make a fresh one
      }
      if (!c) c = await createCart([{ merchandiseId: variant.id, quantity: qty }])
      persist(c)
      setIsOpen(true)
    } catch (e) {
      console.error('[cart] addItem:', e.message)
      alert('Sorry — could not add to cart. Please try again.')
    } finally {
      setBusy(false)
    }
  }, [cart, getVariant, persist])

  const updateQty = useCallback(async (lineId, qty) => {
    if (!cart?.id) return
    setBusy(true)
    try {
      const c = qty <= 0
        ? await removeLines(cart.id, [lineId])
        : await updateLine(cart.id, lineId, qty)
      persist(c)
    } catch (e) {
      console.error('[cart] updateQty:', e.message)
    } finally {
      setBusy(false)
    }
  }, [cart, persist])

  const removeItem = useCallback(async (lineId) => {
    if (!cart?.id) return
    setBusy(true)
    try { persist(await removeLines(cart.id, [lineId])) }
    catch (e) { console.error('[cart] removeItem:', e.message) }
    finally { setBusy(false) }
  }, [cart, persist])

  const checkout = useCallback(() => {
    if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl
  }, [cart])

  // Map Shopify cart lines to the shape the existing cart drawer renders.
  const items = useMemo(() => (cart?.lines?.nodes || []).map((line) => {
    const m = line.merchandise
    const opt = {}
    for (const s of (m.selectedOptions || [])) opt[s.name.toLowerCase()] = s.value
    const local = PRODUCTS.find((p) => handleFor(p) === m.product?.handle)
    return {
      key: line.id,
      id: m.product?.handle,
      name: m.product?.title || local?.name || '',
      img: m.image?.url || local?.img || '',
      price: formatMoney(m.price),
      priceNum: Number(m.price?.amount) || 0,
      size: opt.size || '',
      color: opt.color || '',
      qty: line.quantity,
    }
  }), [cart])

  const count = cart?.totalQuantity || 0
  const subtotal = Number(cart?.cost?.subtotalAmount?.amount) || 0

  const value = useMemo(() => ({
    items, addItem, removeItem, updateQty, count, subtotal,
    isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false),
    checkout, checkoutUrl: cart?.checkoutUrl || null, busy,
  }), [items, addItem, removeItem, updateQty, count, subtotal, isOpen, checkout, cart, busy])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
