import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const MARQUEE_ITEMS = Array(14).fill('No Apologies.')

function HomeMarquee({ bg = '#000', color = '#fff' }) {
  return (
    <div className="hm-marquee" style={{ background: bg, color }} aria-hidden="true">
      <div className="hm-marquee__track">
        {MARQUEE_ITEMS.map((t, i) => <span key={i}>{t}</span>)}
        {MARQUEE_ITEMS.map((t, i) => <span key={`d${i}`}>{t}</span>)}
      </div>
    </div>
  )
}

/* ─── Hero ─────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hm-hero">
      {/* Background photo (decorative, behind logo) */}
      <div className="hm-hero__bg" aria-hidden="true">
        <img src="/home/hero-photo-bg.png" alt="" />
      </div>

      {/* GIRLFIGHT logo (sandwiched — shows through alpha of foreground photo) */}
      <div className="hm-hero__logo-wrap" aria-hidden="true">
        <img src="/home/logo-hero.svg" alt="" className="hm-hero__logo" />
      </div>

      {/* Foreground photo (alpha-channel cutout of athlete) */}
      <div className="hm-hero__photo" aria-hidden="true">
        <img src="/home/hero-photo.png" alt="" />
      </div>

      {/* Xerox texture overlay */}
      <div className="hm-hero__texture" aria-hidden="true">
        <img src="/home/texture-hero.png" alt="" />
      </div>

      {/* Yellow CTA pills */}
      <div className="hm-hero__pill hm-hero__pill--streetwear" aria-hidden="true">
        <span>Premium STREETWEAR.</span>
      </div>
      <div className="hm-hero__pill hm-hero__pill--mentality" aria-hidden="true">
        <span>fight mentality.</span>
      </div>

      {/* Shop Now */}
      <div className="hm-hero__cta">
        <Link to="/shop" className="hm-hero__shop-btn">Shop Now</Link>
      </div>

      {/* Nav overlay */}
      <nav className="hm-nav" aria-label="Main navigation">
        <Link to="/" className="hm-nav__link">HOME</Link>
        <Link to="/shop" className="hm-nav__link">SHOP ALL</Link>
        <Link to="/about" className="hm-nav__link">ABOUT</Link>
        <Link to="/info" className="hm-nav__link">INFO</Link>
        <button className="hm-nav__cart" aria-label="Cart">
          <img src="/home/cart.svg" alt="" />
        </button>
      </nav>
    </section>
  )
}

/* ─── Section 1: Brand intro + product grid ─────────── */
const PRODUCTS = [
  { id: 1, img: '/home/shirt-1.png', alt: 'Girl Fight Tee' },
  { id: 2, img: '/home/shirt-2.png', alt: 'Girl Fight Tee' },
  { id: 3, img: '/home/shirt-3.png', alt: 'Girl Fight Tee' },
  { id: 4, img: '/home/shirt-4.png', alt: 'Girl Fight Tee' },
]

function Section1() {
  return (
    <section className="hm-s1">
      <div className="hm-s1__banner">
        <div className="hm-s1__titles">
          <h1 className="hm-s1__title">Girl fight apparel</h1>
          <div className="hm-s1__by-row">
            <span className="hm-s1__created-by">created by</span>
            <span className="hm-s1__helen">helen</span>
            <span className="hm-s1__maroulis">maroulis</span>
          </div>
        </div>
        <p className="hm-s1__bio">
          Girl Fight makes combat sports apparel for&nbsp;&nbsp;dominating in and out of the gym.
        </p>
      </div>

      <div className="hm-s1__products">
        {PRODUCTS.map(p => (
          <Link to={`/product/${p.id}`} key={p.id} className="hm-product-card">
            <div className="hm-product-card__bg" aria-hidden="true">
              <img src="/home/product-bg.png" alt="" />
            </div>
            <img src={p.img} alt={p.alt} className="hm-product-card__shirt" />
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
      <div className="hm-ed1__frame" aria-label="Lifestyle video placeholder" />
      <div className="hm-ed1__info" aria-hidden="true">
        <span>Height: 5&apos;5&quot;</span>
        <span>wearing: fighter Tee</span>
        <span>Color: Cream</span>
      </div>
    </section>
  )
}

/* ─── Editorial 2: green jacket photo ──────────────────── */
function Editorial2() {
  return (
    <section className="hm-ed2">
      <div className="hm-ed2__photo">
        <img src="/home/editorial-1.png" alt="Girl Fight editorial" className="hm-ed2__main" />
        <img src="/home/film-grain.png" alt="" className="hm-ed2__grain" aria-hidden="true" />
        <img src="/home/editorial-2.png" alt="" className="hm-ed2__overlay" aria-hidden="true" />
      </div>
      <div className="hm-ed2__info" aria-hidden="true">
        <span>Height: 5&apos;5&quot;</span>
        <span>wearing: fighter jacket</span>
        <span>Color: Dark/Light Green</span>
      </div>
    </section>
  )
}

/* ─── About section ─────────────────────────────────────── */
const ABOUT_PHOTOS = [
  { img: '/home/about-helen-4.png',    label: 'Helen_Maroulis.jpeg',    style: { left: 587, top: -61,  width: 338 } },
  { img: '/home/about-dylan.png',       label: 'Sucker_Punch.jpeg',      style: { left: 174, top: 203,  width: 173 } },
  { img: '/home/about-img-8026.png',   label: 'Dylan_Accountant.jpeg',  style: { left: 68,  top: 680,  width: 171 } },
  { img: '/home/about-helen-1.png',    label: 'Helen_M.jpeg',           style: { left: 1181,top: 336,  width: 281 } },
  { img: '/home/about-helen-dylan.png',label: 'Helen_Dylan.jpeg',       style: { left: 675, top: 292,  width: 338 } },
  { img: '/home/about-lil-dylan.png',  label: 'Lil_Dylan',             style: { left: 1273,top: -13,  width: 255 } },
  { img: '/home/about-mels.png',        label: 'Mels.jpeg',              style: { left: 696, top: 774,  width: 211 } },
]

function AboutSection() {
  return (
    <section className="hm-about">
      {/* Tags */}
      <div className="hm-about__tag-about">
        <span>About us</span>
      </div>
      <div className="hm-about__tag-bio">
        <p>Helen &amp; Dylan met in Los Angeles and traveled the World on a top secret mission for The United States of America, which will be detailed below. Girl Fight was the outcome of said mission.</p>
      </div>

      {/* Redacted intel */}
      <div className="hm-about__intel">
        <p className="hm-about__intel-txt">we discovered</p>
        <div className="hm-about__intel-bar" />
        <p className="hm-about__intel-txt">&amp; will take that intel to our graves.</p>
        <p className="hm-about__intel-sub">*Selections redacted by the CIA and FBI.</p>
      </div>

      {/* Scattered photos */}
      {ABOUT_PHOTOS.map((p, i) => (
        <div
          key={i}
          className="hm-about__photo"
          style={{ left: p.style.left + 'px', top: p.style.top + 'px', width: p.style.width + 'px' }}
        >
          <img src={p.img} alt="" />
          <div className="hm-about__photo-label">
            <span>{p.label}</span>
          </div>
        </div>
      ))}
    </section>
  )
}

/* ─── FAQ section ───────────────────────────────────────── */
const FAQS = [
  'Where are our products made?',
  'How do I know when a drop is going to happen?',
  'Do you ship internationally?',
  'What is your return/refund policy?',
]

function FAQSection() {
  const [open, setOpen] = useState(null)

  return (
    <section className="hm-faq">
      <div className="hm-faq__bg" aria-hidden="true">
        <img src="/home/faq-bg.png" alt="" />
      </div>

      <div className="hm-faq__live-fast" aria-hidden="true">
        <div className="hm-faq__lf-pill hm-faq__lf-pill--1"><span>LIVE FAST</span></div>
        <div className="hm-faq__lf-pill hm-faq__lf-pill--2"><span>PET DOGS</span></div>
      </div>

      <div className="hm-faq__card">
        <h2 className="hm-faq__title">F.A.q.S</h2>
        <div className="hm-faq__list">
          {FAQS.map((q, i) => (
            <div key={i} className={`hm-faq__item${open === i ? ' is-open' : ''}`}>
              <button
                className="hm-faq__question"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{q}</span>
                <span className="hm-faq__icon">{open === i ? '−' : '+'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ────────────────────────────────────────────── */
function HomeFooter() {
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
      <div className="hm-footer__bg" aria-hidden="true">
        <img src="/home/footer-bg.png" alt="" />
        <div className="hm-footer__bg-lighten" />
      </div>
      <div className="hm-footer__texture" aria-hidden="true">
        <img src="/home/texture-scan.png" alt="" />
      </div>

      {/* Big GIRLFIGHT logo block */}
      <div className="hm-footer__logo-block" aria-hidden="true">
        <img src="/home/logo-footer.svg" alt="" className="hm-footer__logo" />
        <div className="hm-footer__pill hm-footer__pill--streetwear">
          <span>Premium STREETWEAR.</span>
        </div>
        <div className="hm-footer__pill hm-footer__pill--mentality">
          <span>fight mentality.</span>
        </div>
      </div>

      {/* Nav columns + email */}
      <div className="hm-footer__nav">
        <div className="hm-footer__col">
          <p className="hm-footer__col-head">RESOURCES</p>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop All</Link></li>
            <li><Link to="/about">About Us</Link></li>
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

      {/* Wrestler character */}
      <div className="hm-footer__wrestler" aria-hidden="true">
        <img src="/home/wrestler.png" alt="" />
        <img src="/home/wrestler-inner.png" alt="" className="hm-footer__wrestler-inner" />
      </div>

      <p className="hm-footer__copyright">@2026 Girl Fight</p>
    </footer>
  )
}

/* ─── Page ──────────────────────────────────────────────── */
export default function Home() {
  useEffect(() => {
    document.body.style.background = '#fff'
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <div className="hm-page">
      <Hero />
      <HomeMarquee bg="#000" color="#fff" />
      <Section1 />
      <Editorial1 />
      <Editorial2 />
      <AboutSection />
      <HomeMarquee bg="#000" color="#fff" />
      <FAQSection />
      <HomeMarquee bg="#FFFB00" color="#000" />
      <HomeFooter />
    </div>
  )
}
