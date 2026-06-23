import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HomeMarquee, FAQSection, HomeFooter } from './Home'
import { useCart } from './CartContext'
import { PRODUCTS } from './products'
import SiteNav from './SiteNav'
import './Home.css'
import './ShopAll.css'

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="24" height="24">
      <path d="M17 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7.16 14h9.69c.75 0 1.41-.41 1.75-1.03l3.24-5.88A1 1 0 0 0 21 5.66H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C3.52 18.37 4.48 20 6 20h12v-2H6l1.16-2z" />
    </svg>
  )
}

function ShopNav() {
  return <SiteNav theme="dark" overlay />
}

function MindOverBody() {
  return (
    <div className="sa-mob" aria-hidden="true">
      <span className="sa-mob__pill sa-mob__pill--mind">mind</span>
      <span className="sa-mob__pill sa-mob__pill--over">over</span>
      <span className="sa-mob__pill sa-mob__pill--body">body</span>
    </div>
  )
}

export default function ShopAll() {
  const { open, count } = useCart()

  useEffect(() => {
    document.body.style.background = '#fff'
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <div className="sa-page">
      {/* Hero: nav + heading on black with Xerox texture */}
      <header className="sa-hero">
        <div className="sa-hero__texture" aria-hidden="true">
          <img src="/texture.webp" alt="" />
        </div>
        <ShopNav onCartOpen={open} cartCount={count} />
        <div className="sa-hero__heading">
          <h1 className="sa-hero__title">Premium STREETWEAR.<br />fight mentality.</h1>
          <p className="sa-hero__body">
            Girl/Fight builds street-driven fight wear designed to move with you through every
            part of the work. From hard training sessions to daily life, our apparel is made to
            hold up under pressure, carry confidence, and represent the discipline it takes to
            show up and put in the work. This is gear for fighters who don&rsquo;t turn it off
            when they leave the gym because strength is a mindset, not a moment.
          </p>
        </div>
      </header>

      <HomeMarquee bg="#000" color="#fff" />

      {/* Product grid */}
      <section className="sa-grid" aria-label="All products">
        {PRODUCTS.map((p) => (
          <Link to={`/product/${p.id}`} key={p.id} className="sa-card">
            <div className="sa-card__img">
              <img src="/shop/card-bg.png" alt="" className="sa-card__bg" aria-hidden="true" />
              <img src={p.img} alt={p.name} className="sa-card__shirt" />
            </div>
            <div className="sa-card__meta">
              <span className="sa-card__name">{p.name}</span>
              <span className="sa-card__price">{p.price}</span>
            </div>
          </Link>
        ))}
      </section>

      <HomeMarquee bg="#000" color="#fff" />

      <FAQSection bgImg="/shop/faq-bg.webp" bgClass="sa-faq-bg" decoration={<MindOverBody />} />

      <HomeMarquee bg="#FFFB00" color="#000" />

      <HomeFooter />
    </div>
  )
}
