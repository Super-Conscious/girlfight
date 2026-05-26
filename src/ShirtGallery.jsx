import { useState } from 'react'

function ReverseIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 6H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 3L13 6L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 14H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 11L3 14L6 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

// Figma layout order for the 2×2 grid: 1 (top-left), 2 (top-right), 4 (bottom-left), 3 (bottom-right)
const SECONDARY_DESIGNS = [DESIGNS[1], DESIGNS[2], DESIGNS[4], DESIGNS[3]]

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
  return (
    <div className="apparel-panel">
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
    </div>
  )
}
