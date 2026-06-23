import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from './CartContext'
import './SiteNav.css'

const CartGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 15h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 6H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
)

/* Shared site nav (Figma 366:26887). theme: 'dark' = yellow (over dark
   pages), 'light' = black (over white pages). overlay = absolute over a hero.
   On <= 900px the links collapse into a hamburger → full-screen menu. */
export default function SiteNav({ theme = 'dark', overlay = false }) {
  const { open, count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const logo = theme === 'light' ? '/shop/nav-logo-black.svg' : '/shop/nav-logo.svg'

  // lock body scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    document.body.classList.add('gfnav-menu-lock')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('gfnav-menu-lock')
    }
  }, [menuOpen])

  return (
    <nav className={`gfnav gfnav--${theme}${overlay ? ' gfnav--overlay' : ''}`} aria-label="Main navigation">
      <Link to="/" className="gfnav__logo" aria-label="Girl Fight home" onClick={() => setMenuOpen(false)}>
        <img src={logo} alt="Girl Fight" />
      </Link>

      {/* Desktop links */}
      <div className="gfnav__right">
        <Link to="/shop" className="gfnav__link">Shop All</Link>
        <Link to="/#about" className="gfnav__link">About</Link>
        <button className="gfnav__cart" aria-label="Open cart" onClick={open}>
          <CartGlyph />
          {count > 0 && <span className="gfnav__cart-count">{count}</span>}
        </button>
      </div>

      {/* Mobile controls (cart + hamburger) */}
      <div className="gfnav__mobile">
        <button className="gfnav__cart" aria-label="Open cart" onClick={open}>
          <CartGlyph />
          {count > 0 && <span className="gfnav__cart-count">{count}</span>}
        </button>
        <button
          className={`gfnav__burger${menuOpen ? ' is-open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Full-screen mobile menu */}
      <div className={`gfnav__menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <button
          className="gfnav__menu-close"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M3 3L25 25M25 3L3 25" stroke="currentColor" strokeWidth="2.6" />
          </svg>
        </button>
        <Link to="/" className="gfnav__menu-link" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/shop" className="gfnav__menu-link" onClick={() => setMenuOpen(false)}>Shop All</Link>
        <Link to="/#about" className="gfnav__menu-link" onClick={() => setMenuOpen(false)}>About</Link>
        <button
          className="gfnav__menu-link gfnav__menu-cart"
          onClick={() => { setMenuOpen(false); open() }}
        >
          Cart{count > 0 ? ` (${count})` : ''}
        </button>
      </div>
    </nav>
  )
}
