import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import SiteNav from './SiteNav'
import { HomeMarquee, HomeFooter } from './Home'
import { useAuth } from './AuthContext'
import './Account.css'

function Shell({ children }) {
  return (
    <div className="ac-page">
      <SiteNav theme="light" />
      {children}
      <HomeMarquee bg="#FFFB00" color="#000" />
      <HomeFooter />
    </div>
  )
}

/* ─── Log In ─────────────────────────────────────────────── */
export function LoginPage() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    login(email)
    nav('/account')
  }

  return (
    <Shell>
      <main className="ac-main">
        <div className="ac-card">
          <span className="ac-eyebrow">Members only</span>
          <h1 className="ac-title">Log In</h1>
          <p className="ac-sub">Welcome back, fighter.</p>

          <form className="ac-form" onSubmit={handleSubmit}>
            <label className="ac-field">
              <span className="ac-flabel">Email</span>
              <input className="ac-input" type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />
            </label>
            <label className="ac-field">
              <span className="ac-flabel">Password</span>
              <input className="ac-input" type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </label>
            <button type="submit" className="ac-submit">Log In</button>
          </form>

          <div className="ac-alt">
            <Link to="/login" className="ac-link">Forgot password?</Link>
            <p>New here? <Link to="/register" className="ac-link ac-link--pink">Create an account</Link></p>
          </div>
        </div>
      </main>
    </Shell>
  )
}

/* ─── Create Account ─────────────────────────────────────── */
export function RegisterPage() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    register(name, email)
    nav('/account')
  }

  return (
    <Shell>
      <main className="ac-main">
        <div className="ac-card">
          <span className="ac-eyebrow">Join the club</span>
          <h1 className="ac-title">Create Account</h1>
          <p className="ac-sub">No apologies. Just access.</p>

          <form className="ac-form" onSubmit={handleSubmit}>
            <label className="ac-field">
              <span className="ac-flabel">Name</span>
              <input className="ac-input" type="text" value={name}
                onChange={e => setName(e.target.value)} placeholder="Your name" required />
            </label>
            <label className="ac-field">
              <span className="ac-flabel">Email</span>
              <input className="ac-input" type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />
            </label>
            <label className="ac-field">
              <span className="ac-flabel">Password</span>
              <input className="ac-input" type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Create a password" required />
            </label>
            <button type="submit" className="ac-submit">Create Account</button>
          </form>

          <div className="ac-alt">
            <p>Already have an account? <Link to="/login" className="ac-link ac-link--pink">Log in</Link></p>
          </div>
        </div>
      </main>
    </Shell>
  )
}

/* ─── My Account (dashboard) ─────────────────────────────── */
export function AccountPage() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  if (!user) return <Navigate to="/login" replace />

  function handleLogout() {
    logout()
    nav('/')
  }

  return (
    <Shell>
      <main className="ac-main ac-main--dash">
        <header className="ac-dash-head">
          <h1 className="ac-title">My Account</h1>
          <p className="ac-greeting">
            Hi, {user.name} <span className="ac-greeting-pill">No apologies</span>
          </p>
        </header>

        <div className="ac-grid">
          <section className="ac-block">
            <h2 className="ac-block__h">Order History</h2>
            <p className="ac-empty">You haven&rsquo;t placed any orders yet.</p>
            <Link to="/shop" className="ac-block__cta">Shop all &rarr;</Link>
          </section>

          <section className="ac-block">
            <h2 className="ac-block__h">Account Details</h2>
            <dl className="ac-details">
              <div className="ac-detail">
                <dt>Name</dt>
                <dd>{user.name}</dd>
              </div>
              <div className="ac-detail">
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
            </dl>
            <button type="button" className="ac-logout" onClick={handleLogout}>Log Out</button>
          </section>
        </div>
      </main>
    </Shell>
  )
}
