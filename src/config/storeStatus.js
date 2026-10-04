// Storefront emergency switch. While true, every public storefront route
// (store, cart, cart details, checkout) renders the crash screen instead of
// the real store. No products load, no orders can be placed. Flip to false
// to bring the store back exactly as it was, with no other code changes.
export const STORE_CRASHED = true;