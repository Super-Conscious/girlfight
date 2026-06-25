# Girl Fight × Shopify — Headless Integration Handoff

**Status (2026-06-25):** Storefront API integration committed to `staging` (`f7642aa`).
Code-complete; **not deployed live.** It lights up once the Shopify catalog is built
and the env vars are set.

## ⚠️ Branch reality
`staging` is the live source — `girl-fight-staging.vercel.app` builds from it (verified
by build-hash match). **`main` is a stale single-page splash — ignore it.**

## What was built
Headless model: the React site renders products; Shopify owns cart + checkout.
- `src/lib/shopify.js` — Storefront GraphQL client (products + Cart API)
- `src/lib/catalog.js` — maps local `products.js` → Shopify variants
- `src/ShopContext.jsx` — loads the live catalog, resolves variants + prices
- `src/CartContext.jsx` — **rewritten to be Shopify Cart API-backed** (same public API
  as the old localStorage cart, so the UI is unchanged); `checkout()` → Shopify hosted checkout
- `ProductPage` / `ShopAll` / `Home` — live Shopify prices + availability gating
- `src/App.jsx` — `<ShopProvider>` wraps `<CartProvider>`

## Env vars (REQUIRED)
```
VITE_SHOPIFY_DOMAIN=hmc1ej-ga.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=<public Storefront token>
```
- **Local:** put them in `.env.local` (gitignored). Template is `.env.example`.
- **Token source:** Shopify admin → Sales channels → **Headless** → storefront
  "Girl Fight Apparel Headless" → **Storefront API → Manage → Public access token**.
  It's a *public* token (safe in the client bundle). Charlie has the current value.
- **Vercel:** the same two vars must also be set in the Girl Fight project (Jordan's
  scope) or the deployed site can't read Shopify and everything shows "Unavailable".

## The catalog (current blocker)
Shopify has no real catalog yet (only a leftover "Lil Helen" test product). Build the 5
products from the deliverables in this folder:
- `girlfight-shopify-import.csv` — Shopify product-import format (Products → Import)
- `SHOPIFY-CATALOG-SPEC.md` — the model, rules, and per-variant mockup map

**Contract the code depends on — do not change:**
- Product **handle** = `girl-fight-<id>` → `fighter`, `script`, `block`, `graffiti`, `splatter`
- Option **`Color`** = `"<Base> / <Ink>"` (e.g. `Black / Yellow`)
- Option **`Size`** = `S` / `M` / `L` / `XL`

**3 confirms still pending:** price ($45 placeholder vs the live $55 on the test product),
Tee vs Hoodie, and the size run.

## Pre-catalog behavior (expected)
Until the products exist, the storefront shows local placeholder prices and an
"Unavailable" add-to-cart. This is intentional — it auto-resolves the moment the catalog
is imported and inventory is set.

## To deploy to live staging
1. Set the Vercel env vars (above).
2. Build the catalog (import CSV, set prices + inventory).
3. `npm run deploy:staging` (manual Vercel CLI deploy in Jordan's scope).

Until step 3, the live staging site is unchanged.

## Verified
- `npm run build` passes.
- Cart create → real Shopify `checkoutUrl` proven live against the store.
- Variant resolver matches **88/88** variants against the import spec (incl. typo tolerance).

## Still TODO (separate workstream)
- **Customer-account login** — staging's `AuthContext` is a *fake* localStorage prototype.
  Real options: Shopify **Customer Account API** (hosted OAuth — the "Customer Account API"
  entry in the Headless channel) or **Supabase**. Not started.

## Gotchas
- The Headless channel did **not** enable `unauthenticated_read_product_inventory`, so the
  code uses `availableForSale` (boolean), not `quantityAvailable`. Enable that scope if you
  want exact stock counts.
- Store: `hmc1ej-ga.myshopify.com`. Storefront API version pinned to `2025-10` in `shopify.js`.
