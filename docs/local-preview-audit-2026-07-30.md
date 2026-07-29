# Local Preview Audit - 2026-07-30

Status: local preview audit passed; hosted preview still requires approval.

Branch: `launch/gannon-waye-suite-2026-07-29`

Local URL: `http://127.0.0.1:5173`

Control board: `http://127.0.0.1:5173/control-room.html`

## Routes Reviewed

- `/`
- `/store`
- `/store/all`
- `/mum?access=soniagarden2026`
- `/mum/garden?access=soniagarden2026`

## Screenshot Evidence

Local screenshot folder:

`review-screenshots/local-preview-2026-07-30-0155/`

Screenshots were generated locally and intentionally left untracked. They are review artifacts, not production assets.

Captured:

- `home-desktop.png`
- `store-desktop.png`
- `store-all-desktop.png`
- `store-mobile.png`
- `store-mobile-scrolled-grid-updated.png`
- `mum-gate-desktop.png`
- `mum-gate-desktop-viewport.png`
- `mum-garden-desktop.png`
- `mum-garden-desktop-viewport.png`
- `mum-garden-mobile.png`
- `mum-garden-mobile-viewport.png`

## Visual Findings

### Store

- Neon Gannon Waye Merch Store frontage is visible at the top of `/store`.
- The product cards are visible under Featured Gear.
- The scrolled mobile collection renders product cards correctly.
- Public store copy now says `Gannon Waye Store Products`, not `Base44 Store Products`.
- Public store copy no longer says `Pulled from the Base44 store list.`
- The full-page screenshot can look like it contains a long blank band because scroll-triggered animations are not activated for every offscreen section during one-shot full-page capture. A scrolled viewport check confirmed the collection renders.

### Mum's Garden

- Mum/Sonia is the central first-viewport signal.
- The single artwork cover is visible in the top section.
- Mobile layout is readable and does not show obvious horizontal overflow.
- No grave/funeral/no-Sonia garden-reference imagery appeared in the reviewed hero viewport.
- Private/review media and local audio remain untracked and unpublished.

## Commands Run

```powershell
$env:BASE_URL='http://127.0.0.1:5173'
npx playwright test tests/store-visuals.spec.js tests/store-load.spec.js tests/public-routes.spec.js tests/mum-tribute.spec.js --reporter=line
```

Result: `34 passed`.

```powershell
$env:BASE_URL='http://127.0.0.1:5173'
npx playwright test tests/store-visuals.spec.js tests/store-load.spec.js tests/mum-tribute.spec.js --reporter=line
```

Result after the public store-copy polish: `23 passed`.

```powershell
npm run lint
npx tsc -p ./jsconfig.json --pretty false
npm run build
npm audit --audit-level=moderate
```

Results:

- Lint passed.
- Typecheck passed.
- Build passed with the expected local warning: Base44 proxy not enabled because `VITE_BASE44_APP_BASE_URL` is unset.
- npm audit found 0 local vulnerabilities.

## Code Change From This Audit

- `src/pages/StoreWorld.jsx`
  - Changed public heading from `Base44 Store Products` to `Gannon Waye Store Products`.
  - Changed public note from `Pulled from the Base44 store list.` to `Curated from the current store list.`
- `src/gannonwaye-playwright-pack/tests/store-visuals.spec.js`
  - Added regression coverage so the public store does not expose the internal Base44 wording again.

## Decision

Local preview is still green for the audited scope. Hosted preview, production deploy, DNS, Stripe, marketplace, supplier, Base44 live, email, password/2FA, and AI Sonia actions remain approval-gated.
