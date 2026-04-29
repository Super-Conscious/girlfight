import { useState, useRef, useEffect } from 'react'
import './App.css'

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

export default function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const timer = { id: null }
    function onEnded() {
      timer.id = setTimeout(() => {
        video.currentTime = 0
        video.play()
      }, 5000)
    }
    video.addEventListener('ended', onEnded)
    return () => {
      video.removeEventListener('ended', onEnded)
      clearTimeout(timer.id)
    }
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <div className="splash">
      <MarqueeBanner />

      <main className="content">
        <img
          className="texture"
          src="/texture.jpg"
          alt=""
          aria-hidden="true"
        />

        <div className="video-panel">
          <video ref={videoRef} autoPlay muted playsInline>
            <source src="/GF_SPLASH_HERO.webm" type="video/webm" />
            <source src="/GF_SPLASH_HERO_alpha.mp4" type="video/mp4" />
          </video>
        </div>

        <aside className="right-panel">
          <div className="block-coming-soon">
            <p className="label-coming-soon">Girl Fight</p>
            <p className="label-coming-soon">is coming soon</p>
          </div>

          <div className="creator-section">
            <div className="created-by-tag">Created by</div>
            <div className="name-blocks">
              <span className="name-block helen">Helen</span>
              <span className="name-block maroulis">Maroulis</span>
            </div>
          </div>

          <div className="block-bio">
            <p>Girl Fight makes premium apparel for life<br />in and out of the gym.</p>
          </div>

          <form className="block-email" onSubmit={handleSubmit}>
            <p className="email-label">Join our email list</p>
            {submitted ? (
              <p className="email-thanks">You&rsquo;re in. Thanks!</p>
            ) : (
              <div className="email-field">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                />
                <button type="submit" className="email-submit" aria-label="Subscribe">→</button>
              </div>
            )}
          </form>
        </aside>

        <span className="copyright">©2026 Girl Fight</span>
      </main>

      <MarqueeBanner />
    </div>
  )
}
