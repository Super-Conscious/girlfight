import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { getProducts, shopifyConfigured } from './lib/shopify'
import { handleFor, colorLabel, resolveVariant, formatMoney } from './lib/catalog'

/* Loads the live Shopify catalog once and exposes lookups the cart + pages use
   to resolve variants and show real prices. Until the catalog is built in
   Shopify, lookups return null and callers fall back to local placeholders. */
const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const [productsByHandle, setProductsByHandle] = useState({})
  const [loading, setLoading] = useState(shopifyConfigured)

  useEffect(() => {
    if (!shopifyConfigured) return
    let alive = true
    getProducts()
      .then((ps) => {
        if (alive) setProductsByHandle(Object.fromEntries(ps.map((p) => [p.handle, p])))
      })
      .catch((e) => console.error('[shopify] products:', e.message))
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  const getShopProduct = useCallback(
    (local) => productsByHandle[handleFor(local)] || null,
    [productsByHandle]
  )

  // Resolve the Shopify variant for a local product + selected colorway/size.
  const getVariant = useCallback(
    (local, { isWhite = false, ink = '', size }) => {
      const sp = productsByHandle[handleFor(local)]
      if (!sp) return null
      return resolveVariant(sp, { color: colorLabel(isWhite, ink), size })
    },
    [productsByHandle]
  )

  // "From" price for listing cards — Shopify min variant price, or null.
  const priceLabel = useCallback(
    (local) => {
      const sp = productsByHandle[handleFor(local)]
      return sp ? formatMoney(sp.priceRange?.minVariantPrice) : null
    },
    [productsByHandle]
  )

  const value = useMemo(
    () => ({ productsByHandle, loading, getShopProduct, getVariant, priceLabel, shopifyConfigured }),
    [productsByHandle, loading, getShopProduct, getVariant, priceLabel]
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => useContext(ShopContext)
