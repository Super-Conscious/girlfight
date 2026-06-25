// Bridges staging's local products.js to the Shopify catalog and resolves
// variants. The contract is shared with the client's import sheet:
//   • product handle  = `girl-fight-<id>`   (e.g. girl-fight-fighter)
//   • Color option    = "<Base> / <Ink>"    (e.g. "Black / Yellow")
//   • Size option     = S | M | L | XL
// Keep these in sync with SHOPIFY-CATALOG-SPEC.md / the import CSV.

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')
const norm = (s) => String(s ?? '').trim().toLowerCase().replace(/\s*\/\s*/g, '/').replace(/\s+/g, ' ')

export const handleFor = (product) => `girl-fight-${product.id}`

// The combined "Color" option value for a colorway (base tee + ink).
export const colorLabel = (isWhite, ink) => `${isWhite ? 'White' : 'Black'} / ${cap(ink)}`

const DEFAULT_TITLE = 'Default Title'

// Real buyer options, excluding Shopify's synthetic single Title/Default Title.
export function realOptions(product) {
  if (!product?.options) return []
  return product.options.filter(
    (o) => !(o.name === 'Title' && o.values.length === 1 && o.values[0] === DEFAULT_TITLE)
  )
}

// Resolve the Shopify variant matching the selected Color + Size. Forgiving on
// spacing/case so minor admin typos still resolve. Products with no Color/Size
// option fall through on that dimension.
export function resolveVariant(shopProduct, { color, size }) {
  const variants = shopProduct?.variants?.nodes || []
  return (
    variants.find((v) => {
      const o = {}
      for (const s of v.selectedOptions) o[s.name.toLowerCase()] = s.value
      const colorOk = !('color' in o) || norm(o.color) === norm(color)
      const sizeOk = !('size' in o) || norm(o.size) === norm(size)
      return colorOk && sizeOk
    }) || null
  )
}

export function formatMoney(money) {
  if (!money) return ''
  const { amount, currencyCode } = money
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
      minimumFractionDigits: Number(amount) % 1 === 0 ? 0 : 2,
    }).format(Number(amount))
  } catch {
    return `$${amount}`
  }
}
