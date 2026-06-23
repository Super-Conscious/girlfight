import { useEffect, Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HomeMarquee, HomeFooter } from './Home'
import { useCart } from './CartContext'
import { getLegal } from './legalContent'
import SiteNav from './SiteNav'
import './Home.css'
import './LegalPage.css'

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="24" height="24">
      <path d="M17 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7.16 14h9.69c.75 0 1.41-.41 1.75-1.03l3.24-5.88A1 1 0 0 0 21 5.66H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C3.52 18.37 4.48 20 6 20h12v-2H6l1.16-2z" />
    </svg>
  )
}

function LegalNav() {
  return <SiteNav theme="light" />
}

export default function LegalPage() {
  const { slug } = useParams()
  const data = getLegal(slug)
  const { open, count } = useCart()

  useEffect(() => {
    document.body.style.background = '#fff'
    window.scrollTo(0, 0)
    return () => { document.body.style.background = '' }
  }, [slug])

  return (
    <div className="lg-page">
      <LegalNav onCartOpen={open} cartCount={count} />

      <article className="lg-content">
        <header className="lg-head">
          <h1 className="lg-title">{data.title}</h1>
          <span className="lg-updated">Last modified on {data.updated}</span>
        </header>

        <div className="lg-body">
          <div className="lg-intro">
            {data.intro.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {data.sections.map((s, i) => (
            <Fragment key={i}>
              <hr className="lg-rule" />
              <section className="lg-section">
                <h2 className="lg-section__h">
                  <span className="lg-num">{i + 1}.</span> {s.h}
                </h2>
                <p>{s.p}</p>
              </section>
            </Fragment>
          ))}

          <hr className="lg-rule" />
          <section className="lg-section">
            <h2 className="lg-section__h">Contact Us</h2>
            <p>{data.contact}</p>
          </section>
        </div>
      </article>

      <HomeMarquee bg="#FFFB00" color="#000" />
      <HomeFooter />
    </div>
  )
}
