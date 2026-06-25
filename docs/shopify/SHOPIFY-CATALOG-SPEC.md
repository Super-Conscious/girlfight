# Girl Fight — Shopify Catalog Build Spec

We're building the storefront as a **headless Shopify** site: the Girl Fight site renders the products, and Shopify handles cart + checkout. For that to work, the catalog in Shopify must follow the structure below **exactly** — it's the contract our code maps to.

## The model

- **5 products** (one per design).
- Each product has **two options**: `Color` and `Size`.
- **Color** values are the paired colorways (base tee + ink), e.g. `Black / Yellow`. Use these labels verbatim.
- **Size** values: S, M, L, XL.
- A **variant** = every Color × Size combination (88 variants total).

## ⚠️ Rules that must not change (our site keys off these)

1. **Handle** — keep the `Handle` column exactly as given (e.g. `girl-fight-fighter`). Rename the *Title* freely; never the Handle.
2. **Option names** must be `Color` and `Size`.
3. **Color values** must match the labels below verbatim (capitalization + ` / ` spacing).

## ✅ What we need YOU to fill in

- **Product names** (Title) — working titles are provided; rename as you like.
- **Price** — placeholder is `$45.00`; set the real price per variant (or per product).
- **Inventory quantity** per variant — *required for anything to be buyable.* (Or set Inventory Policy to "continue selling when out of stock".)
- **Product photos** — the references below are the graphic mockups; upload real product photography per colorway in the Shopify admin.
- **Confirm:** are these **Tees** (we assumed Tee) and is the size run **S/M/L/XL** correct?

## How to use the spreadsheet

`girlfight-shopify-import.csv` is in Shopify's product-import format. **Shopify admin → Products → Import → upload the CSV.** It creates all 5 products with the right options/variants/SKUs. Then fill in price, inventory, names, and images in the admin. (Or just use it as a reference and build by hand — either way, keep the Handles + Color/Size values.)

---

## Per-product variant map (which mockup = which colorway)


### Girl Fight Tee — Fighter Graphic
- **Handle:** `girl-fight-fighter`  •  **Variants:** 2 colorways × 4 sizes = 8

| Color (option value) | Reference mockup |
|---|---|
| `Black / Yellow` | `/shirts/5-black/yellow.png` |
| `White / Black` | `/shirts/5-white/black.png` |

### Girl Fight Tee — Script Wordmark
- **Handle:** `girl-fight-script`  •  **Variants:** 5 colorways × 4 sizes = 20

| Color (option value) | Reference mockup |
|---|---|
| `Black / White` | `/shirts/2-black/white.png` |
| `Black / Yellow` | `/shirts/2-black/yellow.png` |
| `Black / Pink` | `/shirts/2-black/pink.png` |
| `White / Black` | `/shirts/2-white/black.png` |
| `White / Pink` | `/shirts/2-white/pink.png` |

### Girl Fight Tee — Block Logo
- **Handle:** `girl-fight-block`  •  **Variants:** 5 colorways × 4 sizes = 20

| Color (option value) | Reference mockup |
|---|---|
| `Black / Yellow` | `/shirts/1-black/yellow.png` |
| `Black / Pink` | `/shirts/1-black/pink.png` |
| `Black / White` | `/shirts/1-black/white.png` |
| `White / Black` | `/shirts/1-white/black.png` |
| `White / Pink` | `/shirts/1-white/pink.png` |

### Girl Fight Tee — Graffiti
- **Handle:** `girl-fight-graffiti`  •  **Variants:** 5 colorways × 4 sizes = 20

| Color (option value) | Reference mockup |
|---|---|
| `Black / Pink` | `/shirts/4-black/pink.png` |
| `Black / White` | `/shirts/4-black/white.png` |
| `Black / Yellow` | `/shirts/4-black/yellow.png` |
| `White / Black` | `/shirts/4-white/black.png` |
| `White / Pink` | `/shirts/4-white/pink.png` |

### Girl Fight Tee — Splatter
- **Handle:** `girl-fight-splatter`  •  **Variants:** 5 colorways × 4 sizes = 20

| Color (option value) | Reference mockup |
|---|---|
| `Black / White` | `/shirts/3-black/white.png` |
| `Black / Yellow` | `/shirts/3-black/yellow.png` |
| `Black / Pink` | `/shirts/3-black/pink.png` |
| `White / Black` | `/shirts/3-white/black.png` |
| `White / Pink` | `/shirts/3-white/pink.png` |
