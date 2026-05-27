import { useState, useEffect } from 'react'

function ReverseIcon() {
  return (
    <svg width="22" height="27" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 6H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 3L13 6L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 14H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 11L3 14L6 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="7" height="7" rx="1" fill="currentColor" />
      <rect x="10" y="1" width="7" height="7" rx="1" fill="currentColor" />
      <rect x="1" y="10" width="7" height="7" rx="1" fill="currentColor" />
      <rect x="10" y="10" width="7" height="7" rx="1" fill="currentColor" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="10" height="20" viewBox="0 0 10 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 1L1 10L9 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="10" height="20" viewBox="0 0 10 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L9 10L1 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CarouselIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="1" width="12" height="14" rx="1.5" fill="currentColor" />
      <rect x="0" y="3.5" width="6" height="9" rx="1" fill="currentColor" opacity="0.45" />
      <rect x="16" y="3.5" width="6" height="9" rx="1" fill="currentColor" opacity="0.45" />
    </svg>
  )
}

const DESIGNS = [
  {
    id: 5,
    black: [
      { color: 'yellow', hex: '#FFFB00', src: '/shirts/5-black/yellow.png' },
    ],
    white: [
      { color: 'black', hex: '#000000', src: '/shirts/5-white/black.png' },
    ],
  },
  {
    id: 1,
    black: [
      { color: 'yellow', hex: '#FFFB00', src: '/shirts/1-black/yellow.png' },
      { color: 'pink',   hex: '#FF85F1', src: '/shirts/1-black/pink.png'   },
      { color: 'white',  hex: '#ffffff', src: '/shirts/1-black/white.png'  },
    ],
    white: [
      { color: 'black', hex: '#000000', src: '/shirts/1-white/black.png' },
      { color: 'pink',  hex: '#FF85F1', src: '/shirts/1-white/pink.png'  },
    ],
  },
  {
    id: 2,
    black: [
      { color: 'white',  hex: '#ffffff', src: '/shirts/2-black/white.png'  },
      { color: 'yellow', hex: '#FFFB00', src: '/shirts/2-black/yellow.png' },
      { color: 'pink',   hex: '#FF85F1', src: '/shirts/2-black/pink.png'   },
    ],
    white: [
      { color: 'black', hex: '#000000', src: '/shirts/2-white/black.png' },
      { color: 'pink',  hex: '#FF85F1', src: '/shirts/2-white/pink.png'  },
    ],
  },
  {
    id: 3,
    black: [
      { color: 'white',  hex: '#ffffff', src: '/shirts/3-black/white.png'  },
      { color: 'yellow', hex: '#FFFB00', src: '/shirts/3-black/yellow.png' },
      { color: 'pink',   hex: '#FF85F1', src: '/shirts/3-black/pink.png'   },
    ],
    white: [
      { color: 'black', hex: '#000000', src: '/shirts/3-white/black.png' },
      { color: 'pink',  hex: '#FF85F1', src: '/shirts/3-white/pink.png'  },
    ],
  },
  {
    id: 4,
    black: [
      { color: 'pink',   hex: '#FF85F1', src: '/shirts/4-black/pink.png'   },
      { color: 'white',  hex: '#ffffff', src: '/shirts/4-black/white.png'  },
      { color: 'yellow', hex: '#FFFB00', src: '/shirts/4-black/yellow.png' },
    ],
    white: [
      { color: 'black', hex: '#000000', src: '/shirts/4-white/black.png' },
      { color: 'pink',  hex: '#FF85F1', src: '/shirts/4-white/pink.png'  },
    ],
  },
]

const CAROUSEL_ORDER = [DESIGNS[0], DESIGNS[1], DESIGNS[2], DESIGNS[4], DESIGNS[3]]
const SECONDARY_DESIGNS = [DESIGNS[1], DESIGNS[2], DESIGNS[4], DESIGNS[3]]

function getOffset(i, active, n) {
  let d = (i - active + n) % n
  if (d > Math.floor(n / 2)) d -= n
  return d
}

function ShirtCard({ design, isLarge }) {
  const [colorIdx, setColorIdx] = useState(0)
  const [isWhite, setIsWhite] = useState(false)
  const [hovered, setHovered] = useState(false)

  const variants = isWhite ? design.white : design.black
  const safeIdx = Math.min(colorIdx, variants.length - 1)
  const current = variants[safeIdx]
  const shirtBg = isWhite ? '#ffffff' : '#000000'
  const showPicker = isLarge || hovered

  function handleSwatchClick(e, i) {
    e.stopPropagation()
    setColorIdx(i)
  }

  function handleReverse(e) {
    e.stopPropagation()
    setIsWhite(w => !w)
    setColorIdx(0)
  }

  return (
    <div
      className={`shirt-card${isLarge ? ' shirt-card--large' : ' shirt-card--thumb'}`}
      onMouseEnter={() => !isLarge && setHovered(true)}
      onMouseLeave={() => !isLarge && setHovered(false)}
    >
      <img src={current.src} alt="Shirt design" />
      {showPicker && (
        <div className="shirt-picker">
          {variants.map((v, i) => (
            <button
              key={v.color}
              className={`swatch${i === safeIdx ? ' swatch--active' : ''}`}
              style={{
                background: `linear-gradient(135deg, ${v.hex} 50%, ${shirtBg} 50%)`,
              }}
              onClick={(e) => handleSwatchClick(e, i)}
              aria-label={`${v.color} colorway`}
            />
          ))}
          <button
            className="reverse-btn"
            onClick={handleReverse}
            aria-label="Toggle shirt color"
          >
            <ReverseIcon />
          </button>
        </div>
      )}
    </div>
  )
}

export default function ShirtGallery() {
  const [viewMode, setViewMode] = useState('carousel')
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [carouselStates, setCarouselStates] = useState(
    CAROUSEL_ORDER.map(() => ({ colorIdx: 0, isWhite: false }))
  )

  useEffect(() => {
    if (viewMode !== 'carousel' || paused) return
    const id = setInterval(() => setActiveIdx(i => (i + 1) % CAROUSEL_ORDER.length), 3500)
    return () => clearInterval(id)
  }, [viewMode, paused])

  const activeState = carouselStates[activeIdx]
  const activeDesign = CAROUSEL_ORDER[activeIdx]
  const activeVariants = activeState.isWhite ? activeDesign.white : activeDesign.black
  const activeSafeIdx = Math.min(activeState.colorIdx, activeVariants.length - 1)
  const shirtBg = activeState.isWhite ? '#ffffff' : '#000000'

  return (
    <div className="apparel-panel">
      <picture>
        <source srcSet="/texture.webp" type="image/webp" />
        <img className="texture" src="/texture.jpg" alt="" aria-hidden="true" />
      </picture>

      <div className="apparel-view-toggle">
        <button
          className={`view-btn${viewMode === 'carousel' ? ' is-active' : ''}`}
          onClick={() => setViewMode('carousel')}
          aria-label="Carousel view"
        >
          <CarouselIcon />
        </button>
        <button
          className={`view-btn${viewMode === 'grid' ? ' is-active' : ''}`}
          onClick={() => setViewMode('grid')}
          aria-label="Grid view"
        >
          <GridIcon />
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="apparel-inner">
          <div className="apparel-primary">
            <ShirtCard design={DESIGNS[0]} isLarge />
          </div>
          <div className="apparel-grid">
            {SECONDARY_DESIGNS.map(d => (
              <ShirtCard key={d.id} design={d} />
            ))}
          </div>
        </div>
      ) : (
        <div className="apparel-carousel">
          <div className="carousel-stage">
            <div className="carousel-nav">
              <button className="carousel-arrow carousel-arrow--prev" onClick={() => setActiveIdx(i => (i - 1 + CAROUSEL_ORDER.length) % CAROUSEL_ORDER.length)} aria-label="Previous shirt">
                <ChevronLeft />
              </button>
              <button className="carousel-arrow carousel-arrow--next" onClick={() => setActiveIdx(i => (i + 1) % CAROUSEL_ORDER.length)} aria-label="Next shirt">
                <ChevronRight />
              </button>
            </div>
            {CAROUSEL_ORDER.map((design, i) => {
              const offset = getOffset(i, activeIdx, CAROUSEL_ORDER.length)
              const st = carouselStates[i]
              const variants = st.isWhite ? design.white : design.black
              const src = variants[Math.min(st.colorIdx, variants.length - 1)].src
              return (
                <div
                  key={design.id}
                  className="carousel-slide"
                  data-offset={String(offset)}
                  onClick={offset !== 0 ? () => setActiveIdx(i) : undefined}
                  onMouseEnter={offset === 0 ? () => setPaused(true) : undefined}
                  onMouseLeave={offset === 0 ? () => setPaused(false) : undefined}
                >
                  <img src={src} alt="Shirt design" />
                </div>
              )
            })}
          </div>
          <div className="carousel-picker" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            {activeVariants.map((v, i) => (
              <button
                key={v.color}
                className={`swatch${i === activeSafeIdx ? ' swatch--active' : ''}`}
                style={{ background: `linear-gradient(135deg, ${v.hex} 50%, ${shirtBg} 50%)` }}
                onClick={() => setCarouselStates(s => s.map((st, idx) =>
                  idx === activeIdx ? { ...st, colorIdx: i } : st
                ))}
                aria-label={`${v.color} colorway`}
              />
            ))}
            <button
              className="reverse-btn reverse-btn--light"
              onClick={() => setCarouselStates(s => s.map((st, idx) =>
                idx === activeIdx ? { ...st, isWhite: !st.isWhite, colorIdx: 0 } : st
              ))}
              aria-label="Toggle shirt color"
            >
              <ReverseIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
