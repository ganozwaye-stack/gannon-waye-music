// Catalogue recovery is independent of payment activation.
// Verified live product, stock, price and storefront-art gates stay intact.
export const STORE_CRASHED = false;
// Checkout is live. Live Stripe secret and publishable keys are both configured
// and verified, so the existing checkout path is open again.
export const STORE_CHECKOUT_HELD = false;