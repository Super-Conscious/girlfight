// Shared product catalog — used by Home (first 3), Shop All (all) and Product pages.
// Colorways reuse the splash mockups in /public/shirts/{design}-{black|white}/{ink}.png
export const PRODUCTS = [
  {
    id: 'fighter',
    design: 5,
    img: '/shop/tee-fighter.webp',
    name: 'Another Dope Hoodie',
    price: '$45',
    desc: 'Crafted in heavyweight cotton with a structured, boxy fit. The premium tee features the bold yellow Girl Fight wordmark paired with our fighter graphic.',
    // Only two colorways (one per base) — show both as flat swatches, no ⇄ toggle.
    flatVariants: true,
    variants: {
      black: [
        { color: 'yellow', hex: '#FFFB00', src: '/shirts/5-black/yellow.png' },
      ],
      white: [
        { color: 'black', hex: '#000000', src: '/shirts/5-white/black.png' },
      ],
    },
  },
  {
    id: 'script',
    design: 2,
    img: '/shop/tee-script.webp',
    name: 'Another Dope Hoodie',
    price: '$45',
    desc: 'Crafted in heavyweight cotton with a structured, boxy fit. The premium tee features the Girl Fight script wordmark in a clean finish.',
    variants: {
      black: [
        { color: 'white', hex: '#ffffff', src: '/shirts/2-black/white.png' },
        { color: 'yellow', hex: '#FFFB00', src: '/shirts/2-black/yellow.png' },
        { color: 'pink', hex: '#FF85F1', src: '/shirts/2-black/pink.png' },
      ],
      white: [
        { color: 'black', hex: '#000000', src: '/shirts/2-white/black.png' },
        { color: 'pink', hex: '#FF85F1', src: '/shirts/2-white/pink.png' },
      ],
    },
  },
  {
    id: 'block',
    design: 1,
    img: '/shop/tee-block.webp',
    name: 'Another Dope Hoodie',
    price: '$45',
    desc: 'Crafted in heavyweight cotton with a structured, boxy fit. The premium tee features the GIRL/FIGHT block logo.',
    variants: {
      black: [
        { color: 'yellow', hex: '#FFFB00', src: '/shirts/1-black/yellow.png' },
        { color: 'pink', hex: '#FF85F1', src: '/shirts/1-black/pink.png' },
        { color: 'white', hex: '#ffffff', src: '/shirts/1-black/white.png' },
      ],
      white: [
        { color: 'black', hex: '#000000', src: '/shirts/1-white/black.png' },
        { color: 'pink', hex: '#FF85F1', src: '/shirts/1-white/pink.png' },
      ],
    },
  },
  {
    id: 'graffiti',
    design: 4,
    img: '/shop/tee-graffiti.webp',
    name: 'Another Dope Hoodie',
    price: '$45',
    desc: 'Crafted in heavyweight cotton with a structured, boxy fit. The premium tee features a wildstyle Girl Fight graffiti graphic.',
    variants: {
      black: [
        { color: 'pink', hex: '#FF85F1', src: '/shirts/4-black/pink.png' },
        { color: 'white', hex: '#ffffff', src: '/shirts/4-black/white.png' },
        { color: 'yellow', hex: '#FFFB00', src: '/shirts/4-black/yellow.png' },
      ],
      white: [
        { color: 'black', hex: '#000000', src: '/shirts/4-white/black.png' },
        { color: 'pink', hex: '#FF85F1', src: '/shirts/4-white/pink.png' },
      ],
    },
  },
  {
    id: 'splatter',
    design: 3,
    img: '/shop/tee-splatter.webp',
    name: 'Another Dope Hoodie',
    price: '$45',
    desc: 'Crafted in heavyweight cotton with a structured, boxy fit. The premium tee features a sprayed Girl Fight graphic in distressed white.',
    variants: {
      black: [
        { color: 'white', hex: '#ffffff', src: '/shirts/3-black/white.png' },
        { color: 'yellow', hex: '#FFFB00', src: '/shirts/3-black/yellow.png' },
        { color: 'pink', hex: '#FF85F1', src: '/shirts/3-black/pink.png' },
      ],
      white: [
        { color: 'black', hex: '#000000', src: '/shirts/3-white/black.png' },
        { color: 'pink', hex: '#FF85F1', src: '/shirts/3-white/pink.png' },
      ],
    },
  },
]

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id)

export const SIZES = ['S', 'M', 'L', 'XL']
