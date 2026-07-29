# Gannon Waye Suite Final Run - 2026-07-29

Control room source: `C:\Users\ganno\Documents\Codex\gannon-waye-music-pr28-final`

Local staging branch: `launch/gannon-waye-suite-2026-07-29`

GitHub PR: `https://github.com/ganozwaye-stack/gannon-waye-music/pull/31`

Status time: 2026-07-30 01:21 AEST

## Current State

The latest pushed staging candidate is PR #31. Exact current head and CI status are tracked in PR #31 checkpoint comments so this document does not become stale every time evidence docs are committed. Latest verified launch-code checkpoint before the documentation update: `1017ce79282a493c41e2f5d1bd2553fbd838feba` (`1017ce7`), with all 8 GitHub checks green. It is not approved for production deployment. The 9pm target has passed, but the staging branch now has a green current checkpoint and the remaining work is approval-gated migration/commerce proof rather than a failing local build. No DNS, production deploy, live Stripe, supplier order, marketplace publish, customer email, password, 2FA, Base44 live-state change, or AI Sonia publication has been performed.

## Done

- Added legacy checkout result aliases:
  - `/store/checkout-success`
  - `/store/checkout-cancel`
  - `/payment-success`
  - `/order-success`
- Repaired stale merch/store Playwright tests so they target the current contract:
  - `/store` is the neon retail frontage.
  - `/store/all` is the product grid.
  - Winter bundle current price is `$119`.
- Repaired checkout, shipping, promo exclusion, route proof, print fulfilment, cart details, and admin edit audit tests.
- Added the local visible control-room board at `/control-room.html`.
- Removed the public Sonia voicemail/voice-note section from `SoniaAmbientPlayer`.
- Verified no private Mum audio file paths remain in app or public source.
- Kept untracked personal Mum media and review screenshots unstaged.
- Pushed the Instagram URL preview security fix that removes the unsafe image preview sink and validates image URLs before posting.
- Blocked private Mum audio and flagged raw memorial media from local dev access and Vite build output without deleting source files.
- Added Netlify 404 rules for private Mum audio and flagged raw memorial media.
- Removed Mum's Garden/private memorial URLs from the sitemap and global social preview metadata.
- Added noindex/nofollow/noarchive posture for Mum's Garden/private memorial routes.
- Redirected old `/mums-garden` public route into the `/mum` private gate.
- Tightened the Mum's Garden URL access shortcuts to the explicit `soniagarden2026` code only.
- Blocked international physical checkout until shipping is quoted.
- Removed old synthetic quick-view add-ons from checkout and blocked saved synthetic add-on cart items from payment.
- Updated Mum's Garden entrance so the launch component is Sonia-first, uses Sonia-present/family/single-artwork assets, does not use generic no-Sonia garden-reference images, and keeps the single artwork cover as a top-section feature.
- Added the micro-brand dropshipping approval-only procedure at `docs/micro-brand-dropshipping-procedure-2026-07-30.md`.
- Added the Base44-to-Emergent parity checklist at `docs/base44-emergent-parity-checklist-2026-07-30.md`.
- Added the current platform pricing decision snapshot at `docs/platform-pricing-snapshot-2026-07-30.md`.
- Added the current launch approval request at `docs/launch-approval-request-2026-07-30.md`.
- Added the local preview audit at `docs/local-preview-audit-2026-07-30.md`.
- Removed internal `Base44 Store Products` wording from the public store and added regression coverage.

## Audit Evidence

Passed:

- `npm run lint`
- `npm run build`
  - Expected local warning remains: Base44 proxy not enabled because `VITE_BASE44_APP_BASE_URL` is unset.
- `npm audit --audit-level=moderate`
  - Result: 0 vulnerabilities.
- Commerce Playwright batch:
  - `53 passed`, `1 skipped`
  - Covered customer details, payment success/cancel aliases, promo codes, promo exclusions, shipping, store product truth, and merch product fixes.
- Launch-critical Playwright batch:
  - `119 passed`, `1 skipped`
  - Covered public/admin route proof, systems manager routing, cart, cart details, checkout, store load, Mum's Garden, master exposure, public security, coaching private lock, retained public routes, and router safety.
- Memorial/audio safety Playwright batch after removing Sonia voice exposure:
  - `16 passed`
  - Covered Mum's Garden, master exposure, and public secret-pattern checks.
- Safety grep:
  - No remaining app/public references to the removed Sonia voice-note player, voicemail file names, or private Mum audio paths.
- Direct typecheck:
  - `tsc -p ./jsconfig.json --pretty false`: exit 0.
- GitHub checks for commit `1017ce7`:
  - Build & Playwright Tests: success.
  - CodeQL: success.
  - CodeQL Security Scan: success.
  - Lint and build: success.
  - Public routes and store smoke tests: success.
  - Secret Scanning & Credentials Check: success.
  - Security & Coaching Lock Tests: success.
  - Store & Cart Tests: success.
- Latest local guardrail audit evidence:
  - `npm run lint`: passed.
  - `npm run build`: passed with expected local Base44 proxy warning.
  - `npm audit --audit-level=moderate`: passed with `0` vulnerabilities.
  - Master exposure/private media Playwright: `7 passed`.
  - Shipping Playwright: `8 passed`.
  - Checkout Playwright: `16 passed`.
  - Public routes Playwright: `12 passed`.
  - Mum/security/master affected batch: `18 passed`.
  - Build output check: `dist/audio/mum` absent, flagged raw memory-lane files absent, and risky private Mum audio filenames absent from `dist`.

Failed / Not Clean:

- No current local typecheck/lint/build/npm-audit/GitHub-check failure is known for the latest safe staging head.
- Some admin legacy JS screens use explicit `// @ts-nocheck` exemptions to avoid risky launch-pressure business-logic rewrites.
- One checkout Playwright scenario previously showed local flake and passed on retry: `different sizes create separate cart lines`.
- The current worktree still contains local-only board changes plus untracked private/review media and test artifacts. These are intentionally not published unless approved.

## Approval Gates

These actions still require explicit approval:

- Production deployment.
- Hosted non-production preview, if it exposes private memorial assets.
- DNS/domain changes.
- Live Stripe checkout/payment proof beyond an approved controlled test.
- Marketplace publishing.
- Supplier ordering.
- Customer email sending.
- Base44 live-state writes/deploys.
- AI Sonia voice/avatar publication.
- Uploading private memorial assets to a public branch or preview.

## Main Website And Preview

Current local preview:

- `http://localhost:5173`
- `http://127.0.0.1:5173/control-room.html`

Key routes verified locally:

- `/`
- `/music`
- `/store`
- `/store/all`
- `/store/cart`
- `/store/cart-details`
- `/store/customer-details`
- `/store/checkout`
- `/checkout-success`
- `/store/checkout-success`
- `/payment-success`
- `/order-success`
- `/checkout-cancel`
- `/store/checkout-cancel`
- `/mum?access=soniagarden2026`
- `/mum/garden?access=soniagarden2026`
- `/without-you-here?access=soniagarden2026`
- `/mums-garden` redirects to `/mum`
- `/remember-mum`
- `/press-kit`
- `/systems-manager`
- `/systems/*`

## Mum's Garden

Current policy:

- Keep the tribute private/gated for review.
- Use only approved Sonia/Mum images.
- Do not include grave images, funeral-room imagery, blurred filler, or images that do not include Sonia unless they are approved object-memory assets.
- Use the single artwork cover as a top-section feature piece.
- Keep perfume/favourite-things objects as feature moments only after background cleanup and visual approval.
- Keep tattoo imagery together as its own section for later copy.
- Do not publish AI Sonia voice/avatar material without explicit approval.
- Do not expose Sonia voicemail/voice-note files without explicit approval.
- Keep private Mum voice-note files out of build/deploy output.
- Do not advertise memorial routes in sitemap/global social metadata.

Current evidence:

- Mum's Garden Playwright checks passed.
- Master exposure checks passed.
- Sonia voice-note public section removed.
- Private Mum audio direct URL is blocked in local preview.
- Private Mum audio and flagged raw memorial media are absent from `dist`.
- Hilbert sidecar finding resolved locally: old `/mums-garden` public route no longer renders the generated-scene memorial page.

## Merch Store

Current status:

- `/store` remains the neon retail frontage.
- `/store/all` remains the product grid.
- Store products, images, prices, winter bundle, cart, checkout, payment result aliases, promo codes, promo exclusions, and shipping checks pass locally.
- Winter bundle current audited price is `$119`.
- The skipped promo exclusion case is a documented manual approval test for the winter bundle checkout path.
- International physical checkout is blocked until shipping is quoted and approved.
- Old synthetic add-ons are removed from quick-view checkout and blocked if found in saved cart state.
- Ohm sidecar finding remains approval-gated: real Stripe proof still requires explicit approval.

## Micro-Brand Dropshipping Procedure

Detailed procedure: `docs/micro-brand-dropshipping-procedure-2026-07-30.md`.

This procedure remains approval-only until supplier, marketplace, payments, fulfilment, and support flows are proven.

1. Product intake

- Record problem solved, audience, supplier, landed cost, target price, shipping time, returns risk, competition, image rights, and confidence.
- Classify each record as `keep`, `maybe`, `test`, `gwm_merch`, or `delete_later`.

2. Margin and risk check

- Calculate landed cost including product cost, shipping, platform fees, payment fee, returns buffer, and expected content/ad cost.
- Reject or park products with unclear image rights, unclear variants, weak margin, long shipping, fragile goods, or high return risk.

3. Listing draft

- Create draft listing copy, images, title, specs, shipping copy, returns copy, and supplier notes.
- Keep status as `needs_review` or `pending_approval`.
- Do not publish to eBay, Shopify, marketplaces, or a live website without manual approval.

4. Manual approval

- Gannon reviews product, supplier URL, variants, landed cost, shipping, returns, image rights, and listing copy.
- Approval must name the product and allowed channel.
- If approval is missing or ambiguous, create an approval item and stop.

5. Controlled test

- Use one low-risk product first.
- Confirm marketplace OAuth, payment routing, order logging, email templates, customer support path, and cancellation/refund process.
- No supplier order until payment is cleared and the order is approved for fulfilment.

6. Separation from Gannon Waye Music

- Keep GanozMix product candidates, supplier notes, listing drafts, and marketplace orders separate from Gannon Waye Music merch, Stripe, supporters, customers, and fulfilment data.
- Gannon Waye merch remains brand-controlled and should not be mixed with general dropshipping inventory.

## Base44 To Emergent Staging Path

Detailed parity checklist: `docs/base44-emergent-parity-checklist-2026-07-30.md`.

Pricing snapshot: `docs/platform-pricing-snapshot-2026-07-30.md`.

Current approval request: `docs/launch-approval-request-2026-07-30.md`.

Local preview audit: `docs/local-preview-audit-2026-07-30.md`.

Migration is not parity-proven yet.

Current findings:

- The code still depends on `@base44/sdk`, Base44 functions, Base44 entities, and Base44 agents.
- Local preview uses mocks for auth, products, orders, checkout, GanozMix candidates, and approval-only flows.
- Base44 live production must stay in place until replacement parity is proven.
- PR #31 is the current staging PR at `1017ce7`. GitHub checks are green.
- Ampere sidecar finding: staging boundary is acceptable, but migration parity remains blocked until Base44 SDK/functions/entities/agents and mock commerce/auth are replaced or isolated.

Recommended staging path:

1. Keep Base44 live as production until replacement parity is proven.
2. Commit only required code/tests/docs and approved public assets.
3. Keep untracked personal memorial media and review screenshots out of the PR unless explicitly approved.
4. Keep GitHub checks green and refresh the PR checkpoint with current evidence.
5. If any later check fails, fix it locally, rerun the affected audit, commit, push, and repeat.
6. Create a non-production preview only after approval.
7. Review store, Mum's Garden gate, routes, checkout mock/sandbox behavior, and media exposure.
8. Ask Gannon for explicit production approval.

## Exact Next Action

Review and, if acceptable, commit the new documentation/control-room evidence update. Then rerun targeted docs/route checks, update PR #31 with the refreshed evidence, and continue only into approval-gated preview/deploy steps when Gannon explicitly approves them.
