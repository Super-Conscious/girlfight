import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'gf_cart'

const toNumber = (price) => parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* ignore */ }
  }, [items])

  const addItem = useCallback((product, opts = {}) => {
    const { size = 'OS', color = '', img = product.img, qty = 1 } = opts
    setItems((prev) => {
      const key = `${product.id}-${size}-${color}`
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, {
        key, id: product.id, name: product.name, img,
        price: product.price, priceNum: toNumber(product.price), size, color, qty,
      }]
    })
  }, [])

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }, [])

  const updateQty = useCallback((key, qty) => {
    setItems((prev) => (
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i))
    ))
  }, [])

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.qty * i.priceNum, 0), [items])

  const value = useMemo(() => ({
    items, addItem, removeItem, updateQty, count, subtotal,
    isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false),
  }), [items, addItem, removeItem, updateQty, count, subtotal, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
