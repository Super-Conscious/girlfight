import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PRODUCTS as ALL_PRODUCTS } from './products'
import { useCart } from './CartContext'
import SiteNav from './SiteNav'
import './Home.css'

const MARQUEE_ITEMS = Array(14).fill('No Apologies.')

export function HomeMarquee({ bg = '#000', color = '#fff' }) {
  return (
    <div className="hm-marquee" style={{ background: bg, color }} aria-hidden="true">
      <div className="hm-marquee__track">
        {MARQUEE_ITEMS.map((t, i) => <span key={i}>{t}</span>)}
        {MARQUEE_ITEMS.map((t, i) => <span key={`d${i}`}>{t}</span>)}
      </div>
    </div>
  )
}

/* ─── Cart drawer ──────────────────────────────────── */
export function CartDrawer() {
  const { items, count, subtotal, isOpen, close, removeItem, updateQty } = useCart()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  return (
    <>
      <div
        className={`hm-cart__scrim${isOpen ? ' is-open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        className={`hm-cart${isOpen ? ' is-open' : ''}`}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <header className="hm-cart__head">
          <div className="hm-cart__title">
            <span>Your Cart</span>
            <span className="hm-cart__count">{count}</span>
          </div>
          <button className="hm-cart__close" onClick={close} aria-label="Close cart">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M2 2L20 20M20 2L2 20" stroke="currentColor" strokeWidth="2.4" />
            </svg>
          </button>
        </header>

        <div className="hm-cart__body">
          {count === 0 ? (
            <p className="hm-cart__empty">Your cart is empty.</p>
          ) : (
            <ul className="hm-cart__items">
              {items.map((i) => (
                <li key={i.key} className="hm-cart__item">
                  <div className="hm-cart__thumb">
                    <img src={i.img} alt={i.name} />
                  </div>
                  <div className="hm-cart__item-info">
                    <p className="hm-cart__item-name">{i.name}</p>
                    <p className="hm-cart__item-size">
                      Size: {i.size}{i.color ? ` · ${i.color}` : ''}
                    </p>
                    <div className="hm-cart__item-qty">
                      <button onClick={() => updateQty(i.key, i.qty - 1)} aria-label="Decrease quantity">−</button>
                      <span>{i.qty}</span>
                      <button onClick={() => updateQty(i.key, i.qty + 1)} aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                  <div className="hm-cart__item-right">
                    <span className="hm-cart__item-price">{i.price}</span>
                    <button className="hm-cart__item-remove" onClick={() => removeItem(i.key)} aria-label="Remove item">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="hm-cart__foot">
          <div className="hm-cart__subtotal">
            <span>Subtotal</span>
            <span className="hm-cart__price">${subtotal.toFixed(2)}</span>
          </div>
          <button className="hm-cart__checkout" disabled={count === 0}>Checkout</button>
        </footer>
      </aside>
    </>
  )
}

/* ─── Hero ─────────────────────────────────────────── */
function Hero({ onCartOpen, cartCount = 0 }) {
  return (
    <section className="hm-hero">
      {/* Background photo (decorative, behind logo) */}
      <div className="hm-hero__bg" aria-hidden="true">
        <img src="/home/hero-photo-bg.webp" alt="" />
      </div>

      {/* GIRLFIGHT logo (sandwiched — shows behind isolated subject) */}
      <div className="hm-hero__logo-wrap" aria-hidden="true">
        <img src="/girlfight-logo.webp" alt="" className="hm-hero__logo" />
      </div>

      {/* Foreground subject (background-removed cutout, layered over logo for depth) */}
      <div className="hm-hero__photo" aria-hidden="true">
        <img src="/home/hero-photo-fg.webp" alt="" />
      </div>

      {/* Stacked CTA — flush lines, rotated */}
      <div className="hm-hero__cta-stack">
        <span className="hm-hero__cta-line hm-hero__cta-line--yellow">Premium STREETWEAR.</span>
        <span className="hm-hero__cta-line hm-hero__cta-line--yellow">fight mentality.</span>
        <Link to="/shop" className="hm-hero__cta-line hm-hero__cta-line--shop">Shop Now</Link>
      </div>
    </section>
  )
}

/* ─── Section 1: Brand intro + product grid ─────────── */
const PRODUCTS = ALL_PRODUCTS.slice(0, 3)

/* Cycling B&W photo background for the brand banner (like a GIF, but
   sharp + lightweight). Crossfades through the frames on a timer. */
const BANNER_FRAMES = [
  '/home/banner/frame-1.webp',
  '/home/banner/frame-2.webp',
  '/home/banner/frame-3.webp',
  '/home/banner/frame-4.webp',
]

function BannerSlideshow() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive(a => (a + 1) % BANNER_FRAMES.length), 2200)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="hm-s1__banner-bg" aria-hidden="true">
      {BANNER_FRAMES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`hm-s1__banner-frame${i === active ? ' is-active' : ''}`}
        />
      ))}
    </div>
  )
}

function Section1() {
  return (
    <section className="hm-s1">
      <div className="hm-s1__banner">
        <BannerSlideshow />
        <div className="hm-s1__titles">
          <p className="hm-s1__bio">
            Girl Fight makes combat sports apparel for <br />dominating in and out of the gym.
          </p>
        </div>
        <div className="hm-s1__by-row">
          <span className="hm-s1__by">By</span>
          <div className="hm-s1__name">
            <span className="hm-s1__helen">helen</span>
            <span className="hm-s1__maroulis">maroulis</span>
          </div>
        </div>
      </div>

      <div className="hm-s1__products">
        {PRODUCTS.map(p => (
          <Link to={`/product/${p.id}`} key={p.id} className="hm-product-card">
            <div className="hm-product-card__img">
              <div className="hm-product-card__bg" aria-hidden="true">
                <img src="/home/product-bg.png" alt="" />
              </div>
              <img src={p.img} alt={p.name} className="hm-product-card__shirt" />
            </div>
            <div className="hm-product-card__meta">
              <span className="hm-product-card__name">{p.name}</span>
              <span className="hm-product-card__price">{p.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ─── Editorial 1: video / lifestyle placeholder ─────── */
function Editorial1() {
  return (
    <section className="hm-ed1">
      <Link to="/product/fighter" className="hm-ed1__photo" aria-label="Shop the Fighter Tee">
        <img src="/home/editorial-tee.webp" alt="Girl Fight — wearing the Fighter Tee" className="hm-ed1__main" />
        <div className="hm-ed1__shade" aria-hidden="true" />
        <div className="hm-ed1__info" aria-hidden="true">
          {[0, 1, 2].map(i => (
            <div className="hm-ed1__info-line" key={i}>
              <span>Height: 5&rsquo;3&rdquo;</span>
              <span>wearing: fighter Tee</span>
              <span>Color: Dark/yellow</span>
            </div>
          ))}
        </div>
      </Link>
    </section>
  )
}

/* ─── About / Story (endless parallax media scroll) ─────────
   Tiles tell the Helen & Dylan story. Each tile is an image or a
   muted-autoplay video (with an unmute toggle). To turn a tile into
   a video, set `type: 'video'`, point `src` at an .mp4 in /public,
   and give it a `.mp4` name — the caption icon switches automatically. */
const SP = '/home/story/'
const STORY_TILES = {
  helenMaroulis:   { src: SP + 'helen-maroulis.webp',   name: 'Helen_Maroulis.jpeg',   ar: '680 / 452' },
  dylanAccountant: { src: SP + 'dylan-accountant.webp', name: 'Dylan_Accountant.jpeg', ar: '687 / 760' },
  lilDylan:        { src: SP + 'lil-dylan.webp',        name: 'Lil_Dylan.jpeg',        ar: '1 / 1' },
  suckerPunch:     { src: SP + 'sucker-punch.webp',     name: 'Sucker_Punch.gif',      ar: '1 / 1' },
  helenDylan:      { src: SP + 'helen-dylan.webp',      name: 'Helen_Dylan.jpeg',      ar: '1359 / 1178' },
  mels:            { src: SP + 'mels.webp',             name: 'Mels.jpeg',             ar: '520 / 347' },
  chip:            { src: SP + 'chip.webp',             name: 'Chip_GRRRR.jpeg',       ar: '680 / 1215' },
  helenM:          { src: SP + 'helen-m.webp',          name: 'Helen_M.jpeg',          ar: '600 / 398' },
  helenJig:        { type: 'video', src: SP + 'helen-jig.mp4', poster: SP + 'helen-jig-poster.webp', name: 'Helens_Jig.mp4',     ar: '720 / 406' },
  lowriders:       { type: 'video', src: SP + 'lowriders.mp4', poster: SP + 'lowriders-poster.webp', name: 'Lowriders_Cool.mp4', ar: '720 / 406' },
  couchVsCart:     { type: 'video', src: SP + 'couch-vs-cart.mp4',    poster: SP + 'couch-vs-cart-poster.webp',    name: 'Couch_vs_Cart.mp4',   ar: '720 / 480' },
  fighters:        { type: 'video', src: SP + 'fighters.mp4',         poster: SP + 'fighters-poster.webp',         name: 'Fighters.mp4',        ar: '720 / 406' },
  dylanWrestling:  { type: 'video', src: SP + 'dylan-wrestling.mp4',  poster: SP + 'dylan-wrestling-poster.webp',  name: 'Dylan_Wrestling.mp4', ar: '720 / 406' },
}
const T = STORY_TILES
// One repeating "cell" of the scattered collage (positions/sizes from the
// Figma frame). The cell is wider/taller than any viewport, so the canvas
// can tile it infinitely yet the same asset is never on screen twice.
const CELL_W = 1720
const CELL_H = 940
const CELL_LAYOUT = [
  { t: T.helenMaroulis,   x: 599,  y: 28,  w: 338 },
  { t: T.suckerPunch,     x: 147,  y: 194, w: 172 },
  { t: T.chip,            x: 400,  y: 327, w: 197 },
  { t: T.dylanAccountant, x: 39,   y: 410, w: 171 },
  { t: T.helenJig,        x: 102,  y: 660, w: 338 },
  { t: T.helenDylan,      x: 678,  y: 331, w: 338 },
  { t: T.mels,            x: 696,  y: 774, w: 211 },
  { t: T.lilDylan,        x: 1273, y: 8,   w: 255 },
  { t: T.helenM,          x: 1181, y: 336, w: 281 },
  { t: T.lowriders,       x: 1346, y: 570, w: 338 },
  { t: T.couchVsCart,     x: 980,  y: 40,  w: 280 },
  { t: T.fighters,        x: 980,  y: 650, w: 320 },
  { t: T.dylanWrestling,  x: 450,  y: 720, w: 220 },
]

function StoryVideo({ tile }) {
  const ref = useRef(null)
  const [muted, setMuted] = useState(true)
  // Only play copies that are actually on screen (the canvas tiles many copies)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true // React's `muted` attribute is unreliable — force it so it loads silent
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.15 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  const toggle = (e) => {
    e.preventDefault(); e.stopPropagation()
    const v = ref.current; if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (!v.muted) v.play().catch(() => {})
  }
  return (
    <>
      <video ref={ref} src={tile.src} poster={tile.poster} muted loop playsInline preload="none" />
      <button type="button" className="hm-story__mute" onClick={toggle}
              aria-label={muted ? 'Unmute video' : 'Mute video'}>
        {muted
          ? <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zm2-7.3-1.3 1.3A8 8 0 0 1 18.5 12a8 8 0 0 1-1.3 6l1.3 1.3A10 10 0 0 0 20.5 12a10 10 0 0 0-2-7.3z"/><line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2"/></svg>
          : <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zm2-7.3-1.3 1.3A8 8 0 0 1 18.5 12a8 8 0 0 1-1.3 6l1.3 1.3A10 10 0 0 0 20.5 12a10 10 0 0 0-2-7.3z"/></svg>}
      </button>
    </>
  )
}

function StoryTile({ tile }) {
  const isVideo = tile.type === 'video'
  return (
    <figure className="hm-story__tile">
      <div className="hm-story__media" style={{ aspectRatio: tile.ar }}>
        {isVideo
          ? <StoryVideo tile={tile} />
          : <img src={tile.src} alt="" />}
      </div>
      <figcaption className="hm-story__cap">
        <span className="hm-story__cap-name">{tile.name}</span>
        {isVideo
          ? <img className="hm-story__cap-mp4" src={SP + 'icon-mp4.svg'} alt="" />
          : (
            <span className="hm-story__cap-icons">
              <img src={SP + 'icon-video2d.svg'} alt="" />
              <img src={SP + 'icon-camera.svg'} alt="" />
            </span>
          )}
      </figcaption>
    </figure>
  )
}

function StoryCell({ x, y, positions }) {
  return (
    <div className="hm-story__cell" style={{ left: x, top: y }}>
      {CELL_LAYOUT.map((it, i) => (
        <div key={i} data-ti={i} className="hm-story__slot"
             style={{ left: positions[i].x, top: positions[i].y, width: it.w, zIndex: positions[i].z }}>
          <StoryTile tile={it.t} />
        </div>
      ))}
    </div>
  )
}

function AboutSection() {
  const viewportRef = useRef(null)
  const worldRef = useRef(null)
  const [grid, setGrid] = useState({ cols: 4, rows: 4 })
  // Live per-tile positions (so individual tiles can be dragged around).
  // `positionsRef` is the source of truth mutated during a drag; `positions`
  // is the rendered snapshot, committed once on pointer-up to avoid
  // re-rendering (and reloading) videos on every mouse move.
  const positionsRef = useRef(CELL_LAYOUT.map((it) => ({ x: it.x, y: it.y, z: 1 })))
  const [positions, setPositions] = useState(() => positionsRef.current.map((p) => ({ ...p })))

  useEffect(() => {
    const vp = viewportRef.current
    const world = worldRef.current
    if (!vp || !world) return
    const s = { x: -120, y: -80, vx: 0, vy: 0, dragging: false, tile: null, lastX: 0, lastY: 0, moved: false, raf: 0 }

    const computeGrid = () => setGrid({
      cols: Math.ceil(vp.clientWidth / CELL_W) + 1,
      rows: Math.ceil(vp.clientHeight / CELL_H) + 1,
    })
    computeGrid()
    window.addEventListener('resize', computeGrid)

    const apply = () => {
      const wrapX = (((s.x % CELL_W) + CELL_W) % CELL_W) - CELL_W
      const wrapY = (((s.y % CELL_H) + CELL_H) % CELL_H) - CELL_H
      world.style.transform = `translate3d(${wrapX}px, ${wrapY}px, 0)`
    }
    const tick = () => {
      if (!s.dragging) {
        s.x += s.vx; s.y += s.vy
        s.vx *= 0.93; s.vy *= 0.93
        if (Math.abs(s.vx) < 0.04) s.vx = 0
        if (Math.abs(s.vy) < 0.04) s.vy = 0
      }
      apply()
      s.raf = requestAnimationFrame(tick)
    }
    s.raf = requestAnimationFrame(tick)

    // No pointer capture: capturing would retarget the click to the viewport
    // and the video unmute button would never fire. Track move/up on window
    // instead so the drag stays robust even if the cursor leaves the section.
    // When `s.tile` is set we're dragging an individual tile; otherwise a
    // press on empty/black space pans the whole canvas.
    let zTop = CELL_LAYOUT.length
    const onDown = (e) => {
      // Reset BEFORE the control guard: otherwise a stale `moved` from the
      // previous drag survives, and the capture-phase onClick below eats the
      // first mute-button click after any pan.
      s.moved = false
      // Don't start a drag when pressing a control (e.g. the unmute button),
      // otherwise the click gets treated as a drag and never reaches the button.
      if (e.target.closest('.hm-story__mute')) return
      s.lastX = e.clientX; s.lastY = e.clientY
      s.vx = 0; s.vy = 0
      const slot = e.target.closest('.hm-story__slot')
      if (slot) {
        // Grab this tile. It's tiled once per cell, so move every copy in sync
        // (and lift it above the others).
        const idx = Number(slot.dataset.ti)
        const els = world.querySelectorAll(`.hm-story__slot[data-ti="${idx}"]`)
        positionsRef.current[idx].z = ++zTop
        els.forEach((el) => { el.style.zIndex = zTop })
        s.tile = { idx, els }
      } else {
        s.dragging = true
      }
      vp.classList.add('is-grabbing')
    }
    const onMove = (e) => {
      const dx = e.clientX - s.lastX, dy = e.clientY - s.lastY
      if (s.tile) {
        if (Math.abs(dx) + Math.abs(dy) > 3) s.moved = true
        const p = positionsRef.current[s.tile.idx]
        p.x += dx; p.y += dy
        s.tile.els.forEach((el) => { el.style.left = p.x + 'px'; el.style.top = p.y + 'px' })
        s.lastX = e.clientX; s.lastY = e.clientY
        return
      }
      if (!s.dragging) return
      if (Math.abs(dx) + Math.abs(dy) > 3) s.moved = true
      s.x += dx; s.y += dy; s.vx = dx; s.vy = dy
      s.lastX = e.clientX; s.lastY = e.clientY
    }
    const onUp = () => {
      if (s.tile) {
        s.tile = null
        setPositions(positionsRef.current.map((p) => ({ ...p }))) // persist new spot
      }
      s.dragging = false
      vp.classList.remove('is-grabbing')
    }
    // Block click-throughs (e.g. video unmute) only when the press was a drag
    const onClick = (e) => { if (s.moved) { e.preventDefault(); e.stopPropagation() } }

    vp.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    vp.addEventListener('click', onClick, true)

    return () => {
      cancelAnimationFrame(s.raf)
      window.removeEventListener('resize', computeGrid)
      vp.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      vp.removeEventListener('click', onClick, true)
    }
  }, [])

  return (
    <section id="about" className="hm-story">
      <div className="hm-story__viewport" ref={viewportRef}>
        <div className="hm-story__world" ref={worldRef}>
          {Array.from({ length: grid.rows }).flatMap((_, r) =>
            Array.from({ length: grid.cols }).map((_, c) => (
              <StoryCell key={`${r}-${c}`} x={c * CELL_W} y={r * CELL_H} positions={positions} />
            ))
          )}
        </div>
      </div>

      <div className="hm-story__hint" aria-hidden="true">✛ Drag to browse photos &amp; video</div>

      <div className="hm-story__head">
        <span className="hm-story__about-pill">About us</span>
        <p className="hm-story__intro">Helen &amp; Dylan met in Los Angeles and traveled the World on a top secret mission for The United States of America, which will be detailed below. Girl Fight was the outcome of said mission.</p>
      </div>

      <div className="hm-story__intel">
        <div className="hm-story__intel-block">
          <p>we discovered</p>
          <span className="hm-story__intel-bar" />
          <p>&amp; will take that intel to our graves.</p>
        </div>
        <p className="hm-story__intel-sub">*Selections redacted by the CIA.</p>
      </div>
    </section>
  )
}

/* ─── FAQ section ───────────────────────────────────────── */
const FAQ_PLACEHOLDER = 'Placeholder answer — replace this copy with the real response. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'
const FAQS = [
  { q: 'Where are our products made?', a: FAQ_PLACEHOLDER },
  { q: 'How do I know when a drop is going to happen?', a: FAQ_PLACEHOLDER },
  { q: 'Do you ship internationally?', a: FAQ_PLACEHOLDER },
  { q: 'What is your return/refund policy?', a: FAQ_PLACEHOLDER },
]

export function FAQSection({ bgImg = '/home/faq-bg.webp', bgClass = 'hm-faq__bg--cat', decoration }) {
  const [open, setOpen] = useState(null)

  return (
    <section className="hm-faq">
      <div className={`hm-faq__bg ${bgClass}`} aria-hidden="true">
        <img src={bgImg} alt="" />
      </div>

      {decoration ?? (
        <div className="hm-faq__live-fast" aria-hidden="true">
          <div className="hm-faq__lf-pill hm-faq__lf-pill--1"><span>LIVE FAST</span></div>
          <div className="hm-faq__lf-pill hm-faq__lf-pill--2"><span>PET DOGS</span></div>
        </div>
      )}

      <div className="hm-faq__card">
        <h2 className="hm-faq__title">F.A.q.S</h2>
        <div className="hm-faq__list">
          {FAQS.map((item, i) => (
            <div key={i} className={`hm-faq__item${open === i ? ' is-open' : ''}`}>
              <button
                className="hm-faq__question"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{item.q}</span>
                <span className="hm-faq__icon">{open === i ? '−' : '+'}</span>
              </button>
              <div className="hm-faq__answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ────────────────────────────────────────────── */
export function HomeFooter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || submitting) return
    setSubmitting(true)
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } finally {
      setSubmitting(false)
      setSubmitted(true)
    }
  }

  return (
    <footer className="hm-footer">
      {/* Layering: black bg > splash Xerox texture > logo/text on top */}
      <div className="hm-footer__texture" aria-hidden="true">
        <img src="/texture.webp" alt="" />
      </div>

      {/* Big GIRLFIGHT logo lockup — graffiti logo + tagline pills, one baked-in image */}
      <div className="hm-footer__logo-block" aria-hidden="true">
        <img src="/home/footer-logo.webp" alt="Girl Fight — Premium streetwear. Fight mentality." className="hm-footer__logo-full" />
      </div>

      {/* Nav columns + email */}
      <div className="hm-footer__nav">
        <div className="hm-footer__col">
          <p className="hm-footer__col-head">RESOURCES</p>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop All</Link></li>
            <li><Link to="/#about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div className="hm-footer__col">
          <p className="hm-footer__col-head">LEGAL</p>
          <ul>
            <li><Link to="/legal/terms">Terms &amp; Conditions</Link></li>
            <li><Link to="/legal/privacy">Privacy Policy</Link></li>
            <li><Link to="/legal/shipping">Shipping Policy</Link></li>
            <li><Link to="/legal/refund">Refund Policy</Link></li>
          </ul>
        </div>
        <div className="hm-footer__email-col">
          <p className="hm-footer__email-head">JOIN OUR EMAIL LIST</p>
          <form onSubmit={handleSubmit} className="hm-footer__email-form">
            {submitted ? (
              <p className="hm-footer__email-thanks">You&rsquo;re in. Thanks!</p>
            ) : (
              <div className="hm-footer__email-field">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                />
                <button type="submit" disabled={submitting} aria-label="Subscribe">→</button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Lil Helen wrestler graphic */}
      <div className="hm-footer__wrestler" aria-hidden="true">
        <img src="/home/wrestler-kid.webp" alt="" />
      </div>

      <p className="hm-footer__copyright">@2026 Girl Fight</p>
    </footer>
  )
}

/* ─── Page ──────────────────────────────────────────────── */
export default function Home() {
  const { open, count } = useCart()

  useEffect(() => {
    document.body.style.background = '#fff'
    return () => { document.body.style.background = '' }
  }, [])

  // Scroll to the About section whenever the URL hash is #about (works both on
  // first load from another page and when clicking About while already on home)
  const location = useLocation()
  useEffect(() => {
    if (location.hash === '#about') {
      requestAnimationFrame(() => document.getElementById('about')?.scrollIntoView())
    }
  }, [location])

  // Adaptive nav color: yellow over dark sections, black over light ones.
  // Reads which section sits under the nav line (~30px from top) on scroll.
  const [navTheme, setNavTheme] = useState('light')
  useEffect(() => {
    const SECTIONS = [
      ['.hm-hero', 'light'], ['.hm-s1', 'dark'], ['.hm-ed1', 'light'],
      ['.hm-story', 'dark'], ['.hm-faq', 'dark'], ['.hm-footer', 'dark'],
    ]
    const els = SECTIONS
      .map(([sel, t]) => [document.querySelector(sel), t])
      .filter(([el]) => el)
    const NAV_Y = 30
    let raf = 0
    const update = () => {
      raf = 0
      for (const [el, t] of els) {
        const r = el.getBoundingClientRect()
        if (r.top <= NAV_Y && r.bottom > NAV_Y) { setNavTheme(t); break }
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="hm-page">
      <SiteNav theme={navTheme} overlay />
      <Hero onCartOpen={open} cartCount={count} />
      <HomeMarquee bg="#000" color="#fff" />
      <Section1 />
      <Editorial1 />
      <AboutSection />
      <HomeMarquee bg="#000" color="#fff" />
      <FAQSection />
      <HomeMarquee bg="#FFFB00" color="#000" />
      <HomeFooter />
    </div>
  )
}
