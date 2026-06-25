import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HomeMarquee, HomeFooter } from './Home'
import { useCart } from './CartContext'
import { useShop } from './ShopContext'
import { formatMoney } from './lib/catalog'
import { PRODUCTS, getProduct, SIZES } from './products'
import SiteNav from './SiteNav'
import './Home.css'
import './ShopAll.css'
import './ProductPage.css'

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="24" height="24">
      <path d="M17 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7.16 14h9.69c.75 0 1.41-.41 1.75-1.03l3.24-5.88A1 1 0 0 0 21 5.66H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C3.52 18.37 4.48 20 6 20h12v-2H6l1.16-2z" />
    </svg>
  )
}

function ProductNav() {
  return <SiteNav theme="light" />
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`pp-acc${open ? ' is-open' : ''}`}>
      <button className="pp-acc__head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{title}</span>
        <span className="pp-acc__icon">{open ? '−' : '+'}</span>
      </button>
      <div className="pp-acc__body"><p>{children}</p></div>
    </div>
  )
}

export default function ProductPage() {
  const { id } = useParams()
  const product = getProduct(id) || PRODUCTS[0]
  const { open, count, addItem, busy } = useCart()
  const { getVariant, priceLabel } = useShop()

  const [size, setSize] = useState('XL')
  const [qty, setQty] = useState(1)

  // Colorway selection (mirrors the splash gallery model)
  const [isWhite, setIsWhite] = useState(false)
  const [colorIdx, setColorIdx] = useState(0)
  const variants = (isWhite ? product.variants.white : product.variants.black) || []
  const safeIdx = Math.min(colorIdx, variants.length - 1)
  const current = variants[safeIdx] || { src: product.img, color: '' }
  const shirtBg = isWhite ? '#ffffff' : '#000000'
  const hasWhite = (product.variants.white || []).length > 0
  const hasColors = variants.length > 1 || hasWhite

  // Live Shopify variant for the selected colorway + size
  const variant = getVariant(product, { isWhite, ink: current.color, size })
  const livePrice = variant ? formatMoney(variant.price) : product.price
  const soldOut = variant && variant.availableForSale === false
  const unavailable = !variant

  // Flat colorway list (all bases shown together, no reverse toggle)
  const flatVariants = product.flatVariants
    ? [
        ...(product.variants.black || []).map((v, idx) => ({ ...v, isWhite: false, idx })),
        ...(product.variants.white || []).map((v, idx) => ({ ...v, isWhite: true, idx })),
      ]
    : null

  // Hover-to-magnify on the product image
  const shirtRef = useRef(null)
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 })
  const handleZoomMove = (e) => {
    const el = shirtRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100))
    setZoom({ active: true, x, y })
  }

  useEffect(() => {
    document.body.style.background = '#fff'
    window.scrollTo(0, 0)
    setQty(1)
    setSize('XL')
    setIsWhite(false)
    setColorIdx(0)
    return () => { document.body.style.background = '' }
  }, [id])

  const more = PRODUCTS.filter((p) => p.id !== product.id)

  const handleAdd = () => {
    if (unavailable || soldOut || busy) return
    addItem(product, { size, isWhite, ink: current.color, qty })
  }

  return (
    <div className="pp-page">
      <ProductNav onCartOpen={open} cartCount={count} />

      {/* Product hero */}
      <section className="pp-hero">
        <div className="pp-hero__media">
          <img src="/shop/card-bg.png" alt="" className="pp-hero__bg" aria-hidden="true" />
          <img
            ref={shirtRef}
            src={current.src}
            alt={product.name}
            className={`pp-hero__shirt${zoom.active ? ' is-zoom' : ''}`}
            style={zoom.active ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            onMouseEnter={() => setZoom((z) => ({ ...z, active: true }))}
            onMouseLeave={() => setZoom({ active: false, x: 50, y: 50 })}
            onMouseMove={handleZoomMove}
          />
        </div>

        <div className="pp-hero__info">
          <nav className="pp-crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>&gt;</span>
            <Link to="/shop">Shop All</Link>
          </nav>

          <div className="pp-hero__detail">
            <div className="pp-head">
              <h1 className="pp-title">{product.name}</h1>
              <p className="pp-desc">{product.desc}</p>
            </div>

            {hasColors && (
              <div className="pp-opt">
                <span className="pp-opt__label">Color</span>
                <div className="pp-colors">
                  {flatVariants ? (
                    flatVariants.map((v) => {
                      const active = v.isWhite === isWhite && v.idx === safeIdx
                      return (
                        <button
                          key={`${v.isWhite ? 'w' : 'b'}-${v.color}`}
                          className={`pp-swatch${active ? ' is-active' : ''}`}
                          style={{ background: `linear-gradient(135deg, ${v.hex} 50%, ${v.isWhite ? '#ffffff' : '#000000'} 50%)` }}
                          onClick={() => { setIsWhite(v.isWhite); setColorIdx(v.idx) }}
                          aria-label={`${v.color} on ${v.isWhite ? 'white' : 'black'} tee`}
                          aria-pressed={active}
                        />
                      )
                    })
                  ) : (
                    <>
                      {variants.map((v, i) => (
                        <button
                          key={v.color}
                          className={`pp-swatch${i === safeIdx ? ' is-active' : ''}`}
                          style={{ background: `linear-gradient(135deg, ${v.hex} 50%, ${shirtBg} 50%)` }}
                          onClick={() => setColorIdx(i)}
                          aria-label={`${v.color} on ${isWhite ? 'white' : 'black'} tee`}
                          aria-pressed={i === safeIdx}
                        />
                      ))}
                      {hasWhite && (
                        <button
                          className="pp-swatch-toggle"
                          onClick={() => { setIsWhite((w) => !w); setColorIdx(0) }}
                          aria-label="Toggle shirt base color"
                        >⇄</button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="pp-options">
              <div className="pp-opt">
                <span className="pp-opt__label">Size</span>
                <div className="pp-sizes">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      className={`pp-size${size === s ? ' is-active' : ''}`}
                      onClick={() => setSize(s)}
                      aria-pressed={size === s}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pp-opt">
                <span className="pp-opt__label">Quantity</span>
                <div className="pp-qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                  <span className="pp-qty__num">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
                </div>
              </div>
            </div>

            <button className="pp-add" onClick={handleAdd} disabled={unavailable || soldOut || busy}>
              {soldOut ? 'Sold Out' : unavailable ? 'Unavailable' : busy ? 'Adding…' : <>Add to Cart <span>{livePrice}</span></>}
            </button>

            <div className="pp-accordions">
              <Accordion title="Specs">
                Heavyweight 100% cotton. Structured boxy fit. Screen-printed graphic.
                Model is 5&apos;9&quot; wearing size XL. Placeholder spec copy.
              </Accordion>
              <Accordion title="Shipping & Returns">
                Ships within 3–5 business days. Free returns within 30 days on unworn items.
                Placeholder shipping copy.
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* More apparel */}
      <section className="pp-more" aria-label="More apparel">
        <div className="pp-more__label"><span>More<br />apparel</span></div>
        <div className="pp-more__track">
          {more.map((p) => (
            <Link to={`/product/${p.id}`} key={p.id} className="sa-card pp-more__card">
              <div className="sa-card__img">
                <img src="/shop/card-bg.png" alt="" className="sa-card__bg" aria-hidden="true" />
                <img src={p.img} alt={p.name} className="sa-card__shirt" />
              </div>
              <div className="sa-card__meta">
                <span className="sa-card__name">{p.name}</span>
                <span className="sa-card__price">{priceLabel(p) || p.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <HomeMarquee bg="#000" color="#fff" />
      <HomeFooter />
    </div>
  )
}
