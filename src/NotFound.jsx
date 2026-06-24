import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { HomeMarquee } from './Home'
import { startMusic, blip, selectSfx, startSfx, setMuted, getMuted } from './nfAudio'
import NotFoundGame from './NotFoundGame'
import './NotFound.css'

const A = '/404/'
const SPR = A + 'sprites/'
const LOGO = '/girlfight-logo.webp'

// L→R, row 1 then row 2 — order matches Figma node 551:2455
const CHARACTERS = [
  { key: 'dylan',          name: 'Dylan',          portrait: A + 'dylan.webp' },
  { key: 'chip',           name: 'Chip',           portrait: A + 'chip.webp' },
  { key: 'helen',          name: 'Helen',          portrait: A + 'helen.webp' },
  { key: 'lil-dylan',      name: 'Lil Dylan',      portrait: A + 'lil-dylan.webp' },
  { key: 'lil-helen',      name: 'Lil Helen',      portrait: A + 'lil-helen.webp', raw: true },
  { key: 'wrestler-dylan', name: 'Wrestler Dylan', portrait: A + 'wrestler-dylan.webp' },
  { key: 'the-cat',        name: 'The Cat',        portrait: A + 'the-cat.webp' },
  { key: 'punk-helen',     name: 'Punk Helen',     portrait: A + 'punk-helen.webp', raw: true },
]

// 5-opponent ladder: the previewed P2 first, then the rest (excluding the player)
function buildLadder(p1i, p2i) {
  const others = CHARACTERS.map((_, i) => i).filter((i) => i !== p1i)
  const order = [p2i, ...others.filter((i) => i !== p2i)]
  return order.slice(0, 5).map((i) => CHARACTERS[i])
}

const Logo = ({ variant }) => (
  <img className={`nf-logo nf-logo--${variant}`} src={LOGO} alt="Girl Fight" />
)

/* ─── Screen 1: 404 intro ─────────────────────────────── */
function Intro({ onPlay }) {
  return (
    <div className="nf-intro">
      <div className="nf-intro__logo">
        <Logo variant="lg" />
        <div className="nf-cyf">choose your fighter</div>
      </div>

      <div className="nf-roster">
        {CHARACTERS.map((c) => (
          <img key={c.key} className="nf-roster__char" src={SPR + c.key + '.png'} alt={c.name} />
        ))}
      </div>

      <div className="nf-actions">
        <div className="nf-actions__msg">
          <div className="nf-actions__exist">404 Error: Page not found</div>
          <div className="nf-actions__home">You could&nbsp;<Link to="/" className="nf-actions__link">go home</Link></div>
        </div>
        <div className="nf-actions__or">or</div>
        <button type="button" className="nf-play" onClick={onPlay}>play now</button>
      </div>
    </div>
  )
}

/* ─── Screen 2: character select ──────────────────────── */
function Select({ p1, p2, onPick, onStart }) {
  const picked = p1 != null

  return (
    <div className="nf-select">
      <div className="nf-select__logo">
        <Logo variant="md" />
        <div className="nf-cyf nf-cyf--sm">choose&nbsp;&nbsp;your&nbsp;&nbsp;fighter.</div>
      </div>

      {/* left: selected fighter as an 8-bit full body */}
      <div className="nf-fighter">
        <div className="nf-fighter__stage">
          {picked && <img className="nf-sprite" src={SPR + CHARACTERS[p1].key + '.png'} alt={CHARACTERS[p1].name} />}
        </div>
        <div className="nf-tag nf-tag--p1">
          <span className="nf-tag__p">P1</span>
          <span className="nf-tag__n">{picked ? CHARACTERS[p1].name : 'pick one'}</span>
        </div>
      </div>

      {/* character grid */}
      <div className="nf-grid">
        {CHARACTERS.map((c, i) => (
          <button
            key={c.key}
            type="button"
            className={`nf-cell${p1 === i ? ' is-p1' : ''}${p2 === i ? ' is-p2' : ''}${c.raw ? ' is-raw' : ''}`}
            onClick={() => onPick(i)}
            aria-label={c.name}
          >
            <img className={`nf-cell__img${c.raw ? ' nf-cell__img--raw' : ''}`} src={c.portrait} alt="" />
          </button>
        ))}
      </div>

      {/* right: computer opponent (auto-chosen, dimmed for less emphasis) */}
      <div className="nf-fighter nf-fighter--p2">
        <div className="nf-fighter__stage">
          {p2 != null && <img className="nf-sprite nf-sprite--p2" src={SPR + CHARACTERS[p2].key + '.png'} alt={CHARACTERS[p2].name} />}
        </div>
        <div className="nf-tag nf-tag--p2">
          <span className="nf-tag__p">VS</span>
          <span className="nf-tag__nwrap">
            <span className="nf-tag__n">{p2 != null ? CHARACTERS[p2].name : '???????'}</span>
            <span className="nf-tag__sub">computer</span>
          </span>
        </div>
      </div>

      {picked && (
        <button type="button" className="nf-start" onClick={onStart}>▶ Press Start</button>
      )}
    </div>
  )
}

function MuteButton() {
  const [m, setM] = useState(getMuted())
  return (
    <button
      type="button"
      className="nf-mute"
      aria-label={m ? 'Turn sound on' : 'Turn sound off'}
      onClick={() => { startMusic(); const nm = !m; setMuted(nm); setM(nm); if (!nm) blip() }}
    >
      {m ? 'SOUND ON ♪' : 'SOUND OFF'}
    </button>
  )
}

export default function NotFound() {
  const [screen, setScreen] = useState('intro')
  const [p1, setP1] = useState(null)
  const [p2, setP2] = useState(null)
  const [scale, setScale] = useState(1)
  const screenRef = useRef(null)

  // Scale the 1440×752 content frame down to fit; background/marquees stay 100% width.
  // On phones the intro/select screens lay out natively (scale 1) — only the fight
  // arena keeps the fit-scale because its fighter logic uses fixed 1440-space coords.
  useEffect(() => {
    const fit = () => {
      if (window.innerWidth <= 768) {
        if (screen !== 'game') { setScale(1); return }
        // Fight arena (mobile): the HUD is portaled to the top, so the frame only
        // holds the ring + fighters and bottom-aligns above the touch controls.
        // Scale ≈ screenW/780 → bigger characters than the full-1440 fit while the
        // ring still fills the width; height term just guards short screens.
        const h = screenRef.current ? screenRef.current.clientHeight : window.innerHeight
        setScale(Math.min(1, window.innerWidth / 780, (h - 100) / 752))
        return
      }
      const h = screenRef.current ? screenRef.current.clientHeight : window.innerHeight
      setScale(Math.min(1, window.innerWidth / 1440, h / 752))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [screen])

  useEffect(() => {
    document.body.classList.add('nf-lock')
    const prevTitle = document.title
    document.title = '404'
    return () => {
      document.body.classList.remove('nf-lock')
      document.title = prevTitle
    }
  }, [])

  const play = () => {
    startMusic()   // first user gesture → audio allowed
    blip()
    setScreen('select')
  }

  const pick = (i) => {
    setP1(i)
    selectSfx()
    let r
    do { r = Math.floor(Math.random() * CHARACTERS.length) } while (r === i)
    setP2(r)
  }

  return (
    <div className="nf-root">
      <HomeMarquee bg="#FFFB00" color="#000" />
      <div className={`nf-screen${screen === 'game' ? ' nf-screen--game' : ''}`} ref={screenRef}>
        <div className="nf-frame" style={{ transform: `scale(${scale})` }}>
          {screen === 'intro' && <Intro onPlay={play} />}
          {screen === 'select' && <Select p1={p1} p2={p2} onPick={pick} onStart={() => { startSfx(); setScreen('game') }} />}
          {screen === 'game' && (
            <NotFoundGame player={CHARACTERS[p1]} opponents={buildLadder(p1, p2)} onExit={() => setScreen('select')} />
          )}
        </div>
        <MuteButton />
      </div>
      <HomeMarquee bg="#FFFB00" color="#000" />
    </div>
  )
}
