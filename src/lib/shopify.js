// Shopify Storefront API client (headless).
// Reads products + manages carts straight from the browser using a PUBLIC
// Storefront access token. The token is scoped to read products and manage
// carts/checkouts, so it's safe to expose client-side. Final payment happens
// on Shopify's hosted checkout (we just redirect to cart.checkoutUrl).

const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
const API_VERSION = '2025-10'

const ENDPOINT = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`

export const shopifyConfigured = Boolean(DOMAIN && TOKEN)

async function storefront(query, variables = {}) {
  if (!shopifyConfigured) {
    throw new Error(
      'Shopify not configured: set VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN'
    )
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  const json = await res.json()
  if (json.errors?.length) {
    throw new Error(json.errors.map(e => e.message).join('; '))
  }
  return json.data
}

// ---- Fragments -------------------------------------------------------------

const PRICE = `
  amount
  currencyCode
`

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { ${PRICE} }
    totalAmount { ${PRICE} }
  }
  lines(first: 50) {
    nodes {
      id
      quantity
      merchandise {
        ... on ProductVariant {
          id
          title
          image { url altText width height }
          price { ${PRICE} }
          selectedOptions { name value }
          product { title handle }
        }
      }
    }
  }
`

// ---- Products --------------------------------------------------------------

// Pulls the full catalog with variants + option values so we can map the
// existing local shirt UI (design / garment color / print color / size) to
// real Shopify variant IDs.
export async function getProducts(first = 50) {
  const query = `
    query Products($first: Int!) {
      products(first: $first) {
        nodes {
          id
          title
          handle
          description
          options { name values }
          featuredImage { url altText }
          priceRange { minVariantPrice { ${PRICE} } }
          variants(first: 100) {
            nodes {
              id
              title
              availableForSale
              price { ${PRICE} }
              image { url altText }
              selectedOptions { name value }
            }
          }
        }
      }
    }
  `
  const data = await storefront(query, { first })
  return data.products.nodes
}

// ---- Cart ------------------------------------------------------------------

export async function createCart(lines = []) {
  const query = `
    mutation CartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `
  const data = await storefront(query, { lines })
  throwUserErrors(data.cartCreate)
  return data.cartCreate.cart
}

export async function getCart(cartId) {
  const query = `
    query Cart($cartId: ID!) {
      cart(id: $cartId) { ${CART_FIELDS} }
    }
  `
  const data = await storefront(query, { cartId })
  return data.cart // null if the cart expired/completed
}

export async function addLines(cartId, lines) {
  const query = `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `
  const data = await storefront(query, { cartId, lines })
  throwUserErrors(data.cartLinesAdd)
  return data.cartLinesAdd.cart
}

export async function updateLine(cartId, lineId, quantity) {
  const query = `
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `
  const data = await storefront(query, {
    cartId,
    lines: [{ id: lineId, quantity }],
  })
  throwUserErrors(data.cartLinesUpdate)
  return data.cartLinesUpdate.cart
}

export async function removeLines(cartId, lineIds) {
  const query = `
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `
  const data = await storefront(query, { cartId, lineIds })
  throwUserErrors(data.cartLinesRemove)
  return data.cartLinesRemove.cart
}

function throwUserErrors(payload) {
  if (payload?.userErrors?.length) {
    throw new Error(payload.userErrors.map(e => e.message).join('; '))
  }
}
