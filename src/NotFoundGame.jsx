import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { blip, thud, koJingle, loseSfx } from './nfAudio'

const SPR = '/404/sprites/'

/* Modal scrim rendered to <body> so the lightbox fills the whole viewport
   instead of being trapped inside the scaled-down 404 game frame. */
function Modal({ children }) {
  return createPortal(<div className="nf-modal">{children}</div>, document.body)
}

/* On-screen touch controls — portaled to <body> so they render at real
   viewport size instead of shrinking with the scaled .nf-frame. They mutate
   the same g.current.keys the keyboard handler does. */
function TouchControls({ onKey }) {
  const press = (name) => (e) => { e.preventDefault(); onKey(name, true) }
  const release = (name) => (e) => { e.preventDefault(); onKey(name, false) }
  const Btn = ({ name, label, cls }) => (
    <button
      className={`nf-touch__btn ${cls}`}
      onPointerDown={press(name)}
      onPointerUp={release(name)}
      onPointerLeave={release(name)}
      onPointerCancel={release(name)}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={label}
    >{label}</button>
  )
  return createPortal(
    <div className="nf-touch">
      <div className="nf-touch__group">
        <Btn name="left" label="◀" cls="nf-touch__btn--dir" />
        <Btn name="right" label="▶" cls="nf-touch__btn--dir" />
      </div>
      <div className="nf-touch__group">
        <Btn name="block" label="BLOCK" cls="nf-touch__btn--block" />
        <Btn name="atk" label="HIT" cls="nf-touch__btn--atk" />
      </div>
    </div>,
    document.body
  )
}

/* ── tunables ─────────────────────────────────────────────── */
const X_MIN = 300, X_MAX = 1140
const SPRITE_HALF = 85
const MIN_SEP = 124
const HIT_RANGE = 188
const SPEED = 4.8
const AI_SPEED = 3.2
const ATK_DUR = 260
const ATK_CD = 470
const LUNGE = 50
const KNOCKBACK = 74
const DMG = 9
const DMG_SUPER = 26
const POWER_PER_HIT = 22      // player meter gain per landed hit (combo)
const POWER_DRAIN_HIT = 34    // player meter lost when you get hit
const BLOCK_MULT = 0.18       // damage taken while blocking
const TELEGRAPH = 700         // ms the AI charges before its special
const LEVELS = 5

export default function NotFoundGame({ player, opponents, onExit }) {
  const [phase, setPhase] = useState('rules')
  const [level, setLevel] = useState(1)
  const [hp, setHp] = useState({ p1: 100, p2: 100 })
  const [count, setCount] = useState('3')
  const [banner, setBanner] = useState(null)
  const [touch, setTouch] = useState(false)

  const opp = opponents[Math.min(level, opponents.length) - 1]
  const nextOpp = opponents[level] || null

  // Mobile uses a narrowed fighter range so the wide 1440 canvas can scale up
  // big on a portrait screen (bigger characters + ring) while keeping both
  // fighters on-screen. Desktop keeps the full range.
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const BND = isMobile
    ? { min: 540, max: 900, p1: 640, p2: 800 }
    : { min: X_MIN, max: X_MAX, p1: 470, p2: 970 }

  const p1Ref = useRef(null), p2Ref = useRef(null)
  const pow1Ref = useRef(null), pow2Ref = useRef(null)
  const bannerT = useRef(0)
  const g = useRef(null)
  const fresh = (x) => ({ x, atk: 0, cd: 0, hit: false, flash: 0, hp: 100, power: 0, combo: 0, block: false, sup: false, charge: 0, ai: 600 })
  if (!g.current) g.current = { p1: fresh(BND.p1), p2: fresh(BND.p2), keys: {}, level: 1, last: 0, raf: 0 }

  const flash = (text, cls) => {
    setBanner({ text, cls })
    clearTimeout(bannerT.current)
    bannerT.current = setTimeout(() => setBanner(null), 750)
  }

  // touch buttons mutate the same key map the keyboard does
  const setKey = (name, v) => { g.current.keys[name] = v }

  // show on-screen controls on coarse-pointer (touch) devices
  useEffect(() => {
    const m = window.matchMedia('(pointer: coarse)')
    setTouch(m.matches)
    const h = (e) => setTouch(e.matches)
    m.addEventListener?.('change', h)
    return () => m.removeEventListener?.('change', h)
  }, [])

  // clear held keys whenever we leave the fight so nothing carries over
  useEffect(() => { if (phase !== 'fight') g.current.keys = {} }, [phase])

  // keyboard (← → move, SPACE attack, ↓/S block)
  useEffect(() => {
    const set = (e, v) => {
      const k = e.key
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') g.current.keys.left = v
      else if (k === 'ArrowRight' || k === 'd' || k === 'D') g.current.keys.right = v
      else if (k === ' ' || k === 'Spacebar') g.current.keys.atk = v
      else if (k === 'ArrowDown' || k === 's' || k === 'S') g.current.keys.block = v
      else return
      e.preventDefault()
    }
    const down = (e) => set(e, true), up = (e) => set(e, false)
    window.addEventListener('keydown', down); window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  const draw = () => {
    const s = g.current
    const place = (ref, f, faceRight) => {
      if (!ref.current) return
      const lunge = f.atk > 0 ? (faceRight ? LUNGE : -LUNGE) * Math.sin((1 - f.atk / ATK_DUR) * Math.PI) : 0
      ref.current.style.transform = `translateX(${f.x - SPRITE_HALF + lunge}px) scaleX(${faceRight ? 1 : -1})`
      ref.current.classList.toggle('is-hit', f.flash > 0)
    }
    place(p1Ref, s.p1, s.p1.x < s.p2.x)
    place(p2Ref, s.p2, s.p2.x < s.p1.x)
    p1Ref.current?.classList.toggle('is-blocking', !!s.p1.block)
    p1Ref.current?.classList.toggle('is-super', s.p1.sup && s.p1.atk > 0)
    p2Ref.current?.classList.toggle('is-charging', s.p2.charge > 0)
    p2Ref.current?.classList.toggle('is-super', s.p2.sup && s.p2.atk > 0)
    if (pow1Ref.current) { pow1Ref.current.style.width = s.p1.power + '%'; pow1Ref.current.parentElement.classList.toggle('is-full', s.p1.power >= 100) }
    if (pow2Ref.current) { pow2Ref.current.style.width = s.p2.power + '%'; pow2Ref.current.parentElement.classList.toggle('is-full', s.p2.power >= 100) }
  }

  const startAttack = (f, force) => {
    if (!force && (f.cd > 0 || f.atk > 0)) return
    f.atk = ATK_DUR; f.cd = ATK_CD; f.hit = false
    if (f === g.current.p1) f.sup = f.power >= 100
    blip()
  }

  useEffect(() => {
    if (phase !== 'fight') return
    const s = g.current
    s.last = performance.now()
    const lvl = s.level
    const aiSpeed = AI_SPEED * (1 + (lvl - 1) * 0.17)
    const atkProb = Math.min(0.95, 0.62 + (lvl - 1) * 0.09)
    const aiGap = () => (360 + Math.random() * 560) * (1 - (lvl - 1) * 0.13)
    const aiDmg = 7 + (lvl - 1) * 1.7
    const aiSuper = 22 + lvl * 4
    const aiChargeRate = 0.018 + (lvl - 1) * 0.007   // power per ms

    const tick = (now) => {
      const dt = Math.min(48, now - s.last); s.last = now
      const { p1, p2, keys } = s
      const f = dt / 16.67

      // ---- player ----
      p1.block = !!keys.block
      if (!p1.block) {
        if (keys.left) p1.x -= SPEED * f
        if (keys.right) p1.x += SPEED * f
        if (keys.atk) startAttack(p1)
      }

      // ---- AI: charge meter, telegraph + unleash super, else fight ----
      p2.power = Math.min(100, p2.power + aiChargeRate * dt)
      const dist = Math.abs(p1.x - p2.x)
      const dir = p1.x < p2.x ? -1 : 1
      if (p2.charge > 0) {
        p2.charge -= dt
        if (p2.charge <= 0) { p2.sup = true; startAttack(p2, true); p2.power = 0 }
      } else if (p2.power >= 100 && p2.atk <= 0 && dist < HIT_RANGE + 40) {
        p2.charge = TELEGRAPH
        flash('BLOCK!', 'warn')
      } else if (p2.atk <= 0) {
        if (dist > HIT_RANGE - 26) p2.x += dir * aiSpeed * f
        else { p2.ai -= dt; if (p2.ai <= 0) { Math.random() < atkProb ? startAttack(p2) : (p2.x -= dir * aiSpeed * 6); p2.ai = aiGap() } }
      }

      // ---- hits ----
      for (const [self, foe, faceRight] of [[p1, p2, p1.x < p2.x], [p2, p1, p2.x < p1.x]]) {
        if (self.atk > 0) {
          self.atk -= dt
          if (!self.hit && self.atk < ATK_DUR * 0.7 && self.atk > ATK_DUR * 0.2) {
            const facingFoe = faceRight ? foe.x > self.x : foe.x < self.x
            if (facingFoe && Math.abs(self.x - foe.x) <= HIT_RANGE) {
              self.hit = true
              const isP1 = self === p1
              const base = isP1 ? (self.sup ? DMG_SUPER : DMG) : (self.sup ? aiSuper : aiDmg)
              const dmg = foe.block ? base * BLOCK_MULT : base
              foe.hp = Math.max(0, foe.hp - dmg)
              foe.flash = 180
              if (!foe.block) foe.x += (faceRight ? 1 : -1) * KNOCKBACK * (self.sup ? 1.6 : 1)
              thud()
              if (self.sup && foe.block) flash('BLOCKED!', 'good')
              else if (self.sup && isP1) flash('SUPER!', 'good')
              else if (self.sup) flash('SPECIAL!', 'warn')
              else if (foe.block) flash('BLOCK', 'good')
              if (isP1) { p1.combo++; p1.power = self.sup ? 0 : Math.min(100, p1.power + POWER_PER_HIT) }
              else { p1.combo = 0; p1.power = Math.max(0, p1.power - POWER_DRAIN_HIT) }
              setHp({ p1: p1.hp, p2: p2.hp })
            }
          }
        } else { self.sup = false }
        if (self.cd > 0) self.cd -= dt
        if (self.flash > 0) self.flash -= dt
      }

      // ---- separation + bounds ----
      if (Math.abs(p1.x - p2.x) < MIN_SEP) {
        const mid = (p1.x + p2.x) / 2
        if (p1.x < p2.x) { p1.x = mid - MIN_SEP / 2; p2.x = mid + MIN_SEP / 2 }
        else { p1.x = mid + MIN_SEP / 2; p2.x = mid - MIN_SEP / 2 }
      }
      p1.x = Math.max(BND.min, Math.min(BND.max, p1.x))
      p2.x = Math.max(BND.min, Math.min(BND.max, p2.x))

      draw()

      if (p1.hp <= 0 || p2.hp <= 0) {
        if (p2.hp <= 0) { koJingle(); setPhase(s.level >= LEVELS ? 'won' : 'cleared') }
        else { loseSfx(); setPhase('lost') }
        return
      }
      s.raf = requestAnimationFrame(tick)
    }
    s.raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(s.raf)
  }, [phase])

  useEffect(() => {
    if (phase !== 'countdown') return
    const seq = ['3', '2', '1', 'FIGHT!']
    let i = 0; setCount(seq[0]); blip()
    const id = setInterval(() => { i++; if (i < seq.length) { setCount(seq[i]); blip() } else { clearInterval(id); setPhase('fight') } }, 700)
    return () => clearInterval(id)
  }, [phase])

  useEffect(() => { draw() }, [phase, level])

  const resetFighters = () => { g.current.p1 = fresh(BND.p1); g.current.p2 = fresh(BND.p2); setHp({ p1: 100, p2: 100 }) }
  const nextLevel = () => { const nl = level + 1; g.current.level = nl; resetFighters(); setLevel(nl); setPhase('countdown') }
  const retry = () => { resetFighters(); setPhase('countdown') }
  const restart = () => { g.current.level = 1; resetFighters(); setLevel(1); setPhase('countdown') }

  // On mobile the HUD is portaled to <body> so it pins to the real viewport top
  // at full size — independent of the down-scaled, bottom-aligned arena frame.
  const hud = (
    <div className={`nf-hud${isMobile ? ' nf-hud--fixed' : ''}`}>
      <div className="nf-hud__side">
        <div className="nf-hud__name">{player.name}</div>
        <div className="nf-hud__bar"><i style={{ width: `${hp.p1}%` }} className="nf-hud__fill nf-hud__fill--p1" /></div>
        <div className="nf-hud__pow"><i ref={pow1Ref} className="nf-hud__pow-fill nf-hud__pow-fill--p1" style={{ width: 0 }} /></div>
      </div>
      <div className="nf-hud__vs">VS<span className="nf-hud__lv">LV {level}/{LEVELS}</span></div>
      <div className="nf-hud__side nf-hud__side--r">
        <div className="nf-hud__name">{opp.name}</div>
        <div className="nf-hud__bar"><i style={{ width: `${hp.p2}%` }} className="nf-hud__fill nf-hud__fill--p2" /></div>
        <div className="nf-hud__pow"><i ref={pow2Ref} className="nf-hud__pow-fill nf-hud__pow-fill--p2" style={{ width: 0 }} /></div>
      </div>
    </div>
  )

  return (
    <div className="nf-game">
      {isMobile ? createPortal(hud, document.body) : hud}

      <div className="nf-arena">
        <img ref={p1Ref} className="nf-fighter-sprite" src={SPR + player.key + '.png'} alt={player.name} />
        <img ref={p2Ref} className="nf-fighter-sprite" src={SPR + opp.key + '.png'} alt={opp.name} />
      </div>

      {banner && <div className={`nf-banner nf-banner--${banner.cls}`} key={banner.text + Math.random()}>{banner.text}</div>}

      {touch && (phase === 'fight' || phase === 'countdown') && <TouchControls onKey={setKey} />}

      {phase === 'rules' && (
        <Modal>
          <div className="nf-modal__card">
            <h2 className="nf-modal__title">How to Fight</h2>
            <ul className="nf-modal__rules">
              {touch ? (
                <>
                  <li><b>◀ ▶</b> &nbsp;move &nbsp;·&nbsp; <b>HIT</b> &nbsp;attack</li>
                  <li><b>BLOCK</b> — cuts damage &amp; stops their special</li>
                </>
              ) : (
                <>
                  <li><b>← →</b> &nbsp;move &nbsp;·&nbsp; <b>SPACE</b> &nbsp;attack</li>
                  <li><b>↓</b> &nbsp;block — cuts damage &amp; stops their special</li>
                </>
              )}
              <li>Land hits in a row to charge your <b>POWER</b> bar → full = <b>SUPER</b> attack</li>
              <li>When they <b className="nf-warn">glow red</b>, a special is coming — <b>block it!</b></li>
              <li>Beat all <b>{LEVELS} levels</b>. No apologies.</li>
            </ul>
            <button className="nf-modal__btn" onClick={() => setPhase('countdown')}>Fight!</button>
          </div>
        </Modal>
      )}

      {phase === 'countdown' && <div className="nf-count" key={count}>{count}</div>}

      {phase === 'cleared' && (
        <Modal><div className="nf-modal__card">
          <h2 className="nf-modal__title">Level {level} Cleared!</h2>
          {nextOpp && <p className="nf-modal__win">Next up: {nextOpp.name}</p>}
          <button className="nf-modal__btn" onClick={nextLevel}>Next Fight →</button>
        </div></Modal>
      )}

      {phase === 'won' && (
        <Modal><div className="nf-modal__card">
          <h2 className="nf-modal__title">You Win!</h2>
          <p className="nf-modal__win">Champion of the mat 🏆</p>
          <div className="nf-modal__btns">
            <button className="nf-modal__btn" onClick={restart}>Play Again</button>
            <button className="nf-modal__btn nf-modal__btn--ghost" onClick={onExit}>← Fighters</button>
          </div>
        </div></Modal>
      )}

      {phase === 'lost' && (
        <Modal><div className="nf-modal__card">
          <h2 className="nf-modal__title nf-modal__title--ko">You Lose!</h2>
          <p className="nf-modal__win">Level {level} of {LEVELS}</p>
          <div className="nf-modal__btns">
            <button className="nf-modal__btn" onClick={retry}>Try Again</button>
            <button className="nf-modal__btn nf-modal__btn--ghost" onClick={onExit}>← Fighters</button>
          </div>
        </div></Modal>
      )}
    </div>
  )
}
