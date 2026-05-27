import { useState } from 'react'
import './App.css'
import ShirtGallery from './ShirtGallery'

const MARQUEE_ITEMS = Array(14).fill('NO APOLOGIES.')

function MarqueeBanner() {
  return (
    <div className="marquee-wrapper" aria-hidden="true">
      <div className="marquee-track">
        {MARQUEE_ITEMS.map((t, i) => <span key={i}>{t}</span>)}
        {MARQUEE_ITEMS.map((t, i) => <span key={`d${i}`}>{t}</span>)}
      </div>
    </div>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Instagram">
      <rect x="1.5" y="1.5" width="15" height="15" rx="4" stroke="#FF85F1" strokeWidth="1.5"/>
      <circle cx="9" cy="9" r="3.5" stroke="#FF85F1" strokeWidth="1.5"/>
      <circle cx="13.2" cy="4.8" r="1" fill="#FF85F1"/>
    </svg>
  )
}

function SocialBar() {
  return (
    <div className="social-bar">
      <span className="stay-tuned">Follow Us</span>
      <div className="social-icons">
        <a href="https://www.instagram.com/girlfightapparel?igsh=anlpajlwYmF6czRw" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <InstagramIcon />
        </a>
      </div>
    </div>
  )
}

export default function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [showApparel, setShowApparel] = useState(false)

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
    <div className="splash">
      <MarqueeBanner />

      <main className={`content${showApparel ? ' content--apparel' : ''}`}>
        <picture>
          <source srcSet="/texture.webp" type="image/webp" />
          <img className="texture" src="/texture.jpg" alt="" aria-hidden="true" />
        </picture>

        {showApparel ? (
          <ShirtGallery />
        ) : (
          <div className="video-panel">
            <video className="video-lg" autoPlay muted playsInline loop>
              <source src="/GF_SPLASH_HERO.webm" type="video/webm" />
              <source src="/GF_SPLASH_HERO_alpha.mp4" type="video/mp4" />
            </video>
            <video className="video-sm" autoPlay muted playsInline loop>
              <source src="/GF_SPLASH_HERO_sm.webm" type="video/webm" />
              <source src="/GF_SPLASH_HERO_sm_alpha.mp4" type="video/mp4" />
            </video>
          </div>
        )}

        <aside className="right-panel">
          <div className="block-coming-soon">
            <p className="label-coming-soon">Girl Fight</p>
            <p className="label-coming-soon">is coming soon</p>
          </div>

          <div className="creator-section">
            <div className="by-wrapper">
              <div className="by-tag">by</div>
            </div>
            <div className="name-blocks">
              <span className="name-block helen">Helen</span>
              <span className="name-block maroulis">Maroulis</span>
            </div>
          </div>

          <div className="block-bio">
            <p>Girl Fight makes premium apparel for life in and out of the gym.</p>
          </div>

          <button
            className={`block-view-apparel${showApparel ? ' is-active' : ''}`}
            onClick={() => setShowApparel(v => !v)}
          >
            {showApparel ? 'View Less Apparel' : 'View Upcoming Apparel'}
          </button>

          <form className={`block-email${emailFocused ? ' is-focused' : ''}`} onSubmit={handleSubmit}>
            <p className="email-label">Join our fight club</p>
            {submitted ? (
              <p className="email-thanks">You&rsquo;re in. Thanks!</p>
            ) : (
              <div className="email-field">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  required
                  aria-label="Email address"
                />
                <button type="submit" className="email-submit" aria-label="Subscribe" disabled={submitting}>→</button>
              </div>
            )}
          </form>

          <SocialBar />
        </aside>

        <span className="copyright">©2026 Girl Fight</span>
      </main>

      <MarqueeBanner />
    </div>
  )
}
