# Gannon Waye Suite Final Run - 2026-07-29

Control room source: `C:\Users\ganno\Documents\Codex\gannon-waye-music-pr28-final`

Local staging branch: `feature/mum-garden-immersive-walk`

Status time: 2026-07-29 18:07 AEST

## Done

- Main website, store, Mum's Garden, legacy routes, and public safety checks have been audited locally.
- The public `Without You Here` full master has been removed from public assets.
- Sonia/Mum tribute playback now uses the approved preview audio only.
- Legacy public routes now redirect to safe retained pages instead of falling through to the 404.
- Spotify URL validation now accepts only approved Spotify hosts.
- Store visual errors were fixed by removing nested button markup, normalising Base44 public media URLs, and stubbing local-only Base44 SDK housekeeping calls in Vite dev preview.
- Local Base44 mocks now stay local for preview and tests, instead of trying real SDK calls for unknown functions/entities.

## Audit Evidence

- `npm run lint` passed.
- `npm run build` passed.
- Launch-critical Playwright suite passed: 69 passed, 3 skipped. Skips are admin-session-only checks with no admin cookie.
- Focused store/link suite passed: 12 passed, 3 skipped.
- Master exposure suite passed inside the launch-critical run: no former public master filename/export/binary in source or build.
- Build warning remains expected for local preview: Base44 proxy is not enabled because `VITE_BASE44_APP_BASE_URL` is unset.

## Approval Gates

These actions are still blocked until Gannon gives explicit approval:

- Production deployment.
- DNS/domain changes.
- Live Stripe checkout/payment proof beyond an approved controlled test.
- Marketplace publishing, supplier ordering, or customer email sending.
- Base44 live-state writes/deploys.
- AI Sonia voice/avatar publication.
- Uploading private memorial assets to a public GitHub branch or public preview if the asset review has not been confirmed.

## Main Website And Preview

The current local preview target is:

`http://localhost:5173`

Key routes verified locally:

- `/`
- `/music`
- `/store`
- `/store/all`
- `/store/cart`
- `/store/checkout`
- `/mum?access=soniagarden2026`
- `/mum/garden?access=soniagarden2026`
- `/without-you-here?access=soniagarden2026`
- `/mums-garden`
- `/remember-mum`
- `/press-kit`

## Mum's Garden

Current policy:

- Keep the tribute private/gated for review.
- Use only approved Sonia/Mum images.
- Do not include grave images, funeral-room imagery, blurred filler, or images that do not include Sonia unless they are approved object-memory assets.
- Use the single artwork cover as a top-section feature piece.
- Keep perfume/favourite-things objects as feature moments only after background cleanup and visual approval.
- Keep tattoo imagery together as its own section for later copy.
- Do not publish AI Sonia voice/avatar material without explicit approval.

## Merch Store

Current status:

- `/store` now shows the immersive neon/retail store first.
- Store products, images, prices, cart button, winter bundle add-to-cart, cart route, checkout route, and sticky checkout behavior passed local tests.
- Public store does not expose unapproved raw `MerchVisualAsset` statuses.
- Public media URLs are normalised away from Base44 file API URLs where possible.

## Micro-Brand Dropshipping Procedure

This procedure is approval-only until the supplier, marketplace, payments, and support flows are proven.

1. Product intake

- Source candidates from GanozMix or supplier research.
- Record problem solved, audience, supplier, landed cost, target price, shipping time, returns risk, competition, image rights, and confidence.
- Classify each record as `keep`, `maybe`, `test`, `gwm_merch`, or `delete_later`.

2. Margin and risk check

- Calculate landed cost including product cost, shipping, platform fees, payment fee, returns buffer, and expected ad/content cost.
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
- No supplier order until payment is cleared and the order is approved for fulfillment.

6. Separation from Gannon Waye Music

- Keep GanozMix product candidates, supplier notes, listing drafts, and marketplace orders separate from Gannon Waye Music merch, Stripe, supporters, customers, and fulfillment data.
- Gannon Waye merch remains brand-controlled and should not be mixed with general dropshipping inventory.

## Base44 To Emergent Staging Path

Migration is not parity-proven yet.

Current findings:

- The code still depends on `@base44/sdk`, Base44 functions, Base44 entities, and Base44 agents.
- Local preview uses mocks for auth, products, orders, checkout, GanozMix candidates, and approval-only flows.
- Base44 CLI is not locally available in this repo right now, so no Base44 live command was run.
- PR #28 is open/draft on GitHub, but the latest local staging work diverges from the PR head and must be reconciled before it represents the real deployable artifact.

Recommended staging path:

1. Keep Base44 live as production until replacement parity is proven.
2. Create a GitHub integration branch from this local staging tree.
3. Commit only required code/tests/docs and approved public assets.
4. Do not automatically commit extra private memorial source/review assets.
5. Update or replace PR #28 so GitHub matches the actual local staging candidate.
6. Let GitHub checks and review run on that integration branch.
7. Create a non-production preview.
8. Review store, Mum's Garden gate, routes, checkout mock/sandbox behavior, and media exposure.
9. Ask Gannon for explicit production approval.

## Exact Next Action

Create a GitHub integration branch from `feature/mum-garden-immersive-walk`, stage the code/test/doc changes that passed local audit, leave extra untracked personal Mum media out unless approved, push to GitHub, and open/update a PR for non-production preview review.
