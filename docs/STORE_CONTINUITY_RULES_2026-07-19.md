# Store Continuity Rules

Date: 2026-07-19

This note preserves the approved merch-store direction from the active local repo:

`C:\Users\ganno\Documents\Codex\gannon-waye-music-pr-work`

## Current Approved Direction

- `/store` should open with the clean neon Gannon Waye retail-room image, not the older plain product grid.
- The first screen should show the store itself. Do not place headline/copy/buttons over the front hero.
- The product grid, cart drawer/actions, product details, and checkout flow remain underneath the hero.
- `/store-world` must continue to redirect to `/store` so older/internal links land on the current store experience.
- The verified Base44 neon boutique/store image is the primary hero image.
- Keep the CSS neon fallback scene for resilience if the remote hero image fails.
- `src/pages/Store.jsx` now uses a nav-safe top offset on `RetailStoreHero` so the neon `GANNON WAYE` sign is not hidden by the fixed menu.
- `src/components/public/PublicLayout.jsx` currently gives exact `/store` `pt-0`; the store page owns its hero spacing, while other public pages keep `pt-16`.
- Last visual check: hero image loaded, image top approximately 85px, nav bottom approximately 81px, the neon sign is fully visible below the menu, and 9 product cards remain visible below.
- Last validation: `npm run lint` passed and `npm run build` passed.

## Product Moments

- Winter warmer bundle.
- Hoodie.
- Journal bundle.
- Mug.
- Poster wall.

These products still belong in the store grid/cart flow. Do not re-add floating product hotspots, mini product strips, or extra Gannon Waye sign overlays on the opening hero unless Gannon explicitly asks for them again.

## Pricing Direction

- Current active pricing in `src/pages/Store.jsx` should not be replaced by older clone pricing.
- Hoodie: `$98 plus postage`.
- Tee: sold out.
- Winter warmer bundle: `$119 plus postage`.
- Journal bundle: `$59 plus postage`.
- Mug: `$9.90 plus postage`.
- Posters: variant pricing.

## Migration Rule

When reconciling into the GitHub PR / Emergent migration branch, treat the active repo's `src/pages/Store.jsx`, `src/lib/liveRetailProducts.js`, and `/store-world` route alias as the current store authority. Do not restore the older plain product-grid-first store, older pricing, or overlay-heavy StoreWorld front from the clone.
