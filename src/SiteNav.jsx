import { Link } from 'react-router-dom'
import { useCart } from './CartContext'
import './SiteNav.css'

const CartGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 15h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 6H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
)

/* Shared site nav (Figma 366:26887). theme: 'dark' = yellow (over dark
   pages), 'light' = black (over white pages). overlay = absolute over a hero. */
export default function SiteNav({ theme = 'dark', overlay = false }) {
  const { open, count } = useCart()
  const logo = theme === 'light' ? '/shop/nav-logo-black.svg' : '/shop/nav-logo.svg'
  return (
    <nav className={`gfnav gfnav--${theme}${overlay ? ' gfnav--overlay' : ''}`} aria-label="Main navigation">
      <Link to="/" className="gfnav__logo" aria-label="Girl Fight home">
        <img src={logo} alt="Girl Fight" />
      </Link>
      <div className="gfnav__right">
        <Link to="/shop" className="gfnav__link">Shop All</Link>
        <Link to="/#about" className="gfnav__link">About</Link>
        <button className="gfnav__cart" aria-label="Open cart" onClick={open}>
          <CartGlyph />
          {count > 0 && <span className="gfnav__cart-count">{count}</span>}
        </button>
      </div>
    </nav>
  )
}
