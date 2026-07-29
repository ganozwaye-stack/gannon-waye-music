# Base44 To Emergent Parity Checklist - 2026-07-30

Status: migration audit updated; parity not proven.

Base44 remains live until every required replacement lane below is proven on a non-production preview and explicitly approved for cutover.

## Current Source Of Truth

- Local staging repo: `C:\Users\ganno\Documents\Codex\gannon-waye-music-pr28-final`
- Current staging branch: `launch/gannon-waye-suite-2026-07-29`
- Current PR: `https://github.com/ganozwaye-stack/gannon-waye-music/pull/31`
- Current PR head and CI status: tracked in the PR #31 body and newest checkpoint comments
- Latest current-head local audit snapshot: `docs/current-head-audit-2026-07-30-0351.md`
- Latest fresh launch-critical local slice: 2026-07-30 06:22 AEST, `61 passed`
- Base44 live position: keep live as fallback/stability source

## What Is Proven On The Staging Branch

- Main public routes load in the local/CI smoke scope.
- Store front, product grid, cart, customer details, checkout result aliases, promo rules, and shipping/commerce guardrails have passing Playwright coverage.
- The staged store now includes a shared cart image fallback for checkout, cart drawer, and cart page; local checkout fallback coverage passed `17` tests and store visuals passed `7` tests after the patch.
- Mum's Garden private route, old public redirect, media exposure guard, and master-audio exposure checks have passing coverage.
- `npm run lint`, `npm run build`, `npm audit --audit-level=moderate`, direct `tsc`, and focused Playwright checks passed locally for the current safe set.
- GitHub CI passed 4 of 4 workflows on the latest verified PR checkpoint; the exact current SHA is tracked in the PR body and newest checkpoint comments.
- The fresh 06:22 local slice passed `public-routes`, `store-load`, `store-visuals`, `mum-tribute`, `security`, `coaching-private-lock`, `master-exposure`, and `commerce-guardrails`.

## What Is Not Proven Yet

The replacement is not parity-proven because these lanes still need authenticated export, rebuild, import, or live-equivalent proof:

1. Base44 entities and data exports.
2. Admin auth and role protections.
3. Store product CRUD and inventory records.
4. Cart and checkout against the final payment mode.
5. Stripe webhook order creation and deduplication.
6. Promo code restrictions in the final Stripe setup.
7. Order fulfilment and notification path.
8. Email/subscriber records and customer communication policy.
9. ApprovalQueue and agent action approval records.
10. Base44 functions and scheduler equivalents.
11. OAuth connectors: Instagram, Gmail, Google Drive, Google Calendar, Google Sheets, Slack, TikTok.
12. Metricool or social scheduling workflows.
13. GanozMix marketplace state and eBay OAuth.
14. Media storage migration for public and private assets.
15. Secret management in the destination platform.
16. DNS/domain cutover and rollback procedure.
17. 48-hour post-cutover monitoring plan.

## Fresh Current Code Evidence - 2026-07-30 04:02 AEST

This bounded scan confirms the migration blocker is still present in current code, not only in older notes:

- `src/api/base44Client.js:1` imports `@base44/sdk`, and `src/api/base44Client.js:8-15` creates the shared Base44 client used across the app.
- `src/api/base44Client.js:23-62` still swaps in local/mock auth and `functions.invoke` behavior for local or mock-token runs, including a mock Stripe checkout session at `src/api/base44Client.js:58-60`.
- `src/api/base44Client.js:150-178`, `src/api/base44Client.js:290-309`, and `src/api/base44Client.js:331-337` still define local GanozMix candidate, marketplace, job, and error-log mock data, including eBay OAuth needs and publish locks.
- Many public/admin files still import the shared Base44 client. Representative current examples include `src/pages/Home.jsx:3`, `src/pages/MumTribute.jsx:23`, `src/pages/Store.jsx:2`, `src/pages/StoreCheckout.jsx:3`, and `src/components/admin/AdminLayout.jsx:11`.
- `src/pages/StoreCheckout.jsx:99-118` invokes `calculateShippingRate`; `src/pages/StoreCheckout.jsx:163-173` invokes `validatePromoCode`; `src/pages/StoreCheckout.jsx:201-226` writes a `StoreCustomer` entity and starts `createCheckoutSession`.
- `src/components/store/StripePaymentForm.jsx:12-14` obtains Stripe config through Base44, and `src/components/store/StripePaymentForm.jsx:134-142` invokes `createPaymentIntent`.
- `base44/functions/createCheckoutSession/entry.ts:1-2` imports Stripe and `@base44/sdk`, then reads `MerchProduct` records through Base44 at `base44/functions/createCheckoutSession/entry.ts:126-137` and `base44/functions/createCheckoutSession/entry.ts:153-158`.
- `base44/agents/qa_systems_auditor.jsonc:1-3` shows Base44 agent definitions remain part of the system design, including entity/notification/approval workflow expectations.

Conclusion: PR #31 is a green staging candidate for local preview, but it is not an Emergent parity build. Emergent needs a separate rebuild/import lane for Base44 data, functions, agents, auth, checkout, Stripe webhooks, OAuth connectors, and GanozMix state before any live cutover. A green website/store PR does not prove replacement-platform parity.

## Required Emergent Staging Phases

### Phase 1 - Export And Freeze

- Freeze Base44 into stabilise/export mode.
- Export schema list, entity data, functions, agents, public routes, admin routes, media inventory, secrets names, and connector scopes.
- Do not export secret values into docs, chat, git, or screenshots.
- Keep Base44 live.

Evidence required:

- Export manifest exists.
- Export files are stored in a private approved location.
- GitHub docs name what was exported and what remains missing.

### Phase 2 - Build Preview

- Create the Emergent staging project.
- Import source code or rebuild equivalent routes.
- Configure placeholder/test secrets only.
- Implement data model equivalents.
- Implement storage policy for public assets and private memorial assets.
- Keep Gannon Waye Music commerce separate from GanozMix experiments.

Evidence required:

- Non-production preview URL.
- Route inventory comparison.
- Data model comparison.
- Secrets checklist with values omitted.

### Phase 3 - Parity Testing

Run tests against the replacement preview:

- Public route smoke.
- Store visual and product truth checks.
- Cart flow.
- Checkout success/cancel aliases.
- Shipping guardrails.
- Promo exclusion rules.
- Mum's Garden gate and noindex posture.
- Private media direct URL denial.
- Admin auth denial when logged out.
- Admin access when logged in.
- Stripe webhook test-mode proof.
- Order record creation.
- Email/notification proof in test or draft-only mode.
- GanozMix read-only dashboard.

Evidence required:

- Passing local test output.
- Passing CI or preview check output.
- Screenshots for main website, store, cart, Mum's Garden gate, and admin dashboard.

### Phase 4 - Approval Cutover

Only after parity passes:

- Ask for explicit approval to deploy/cut over.
- Confirm rollback path.
- Confirm Stripe mode.
- Confirm DNS change.
- Confirm OAuth redirect updates.
- Confirm marketplace and supplier actions remain off unless separately approved.

Evidence required:

- Written approval naming production deploy and DNS.
- Written approval naming any Stripe mode/live payment proof.
- Written approval naming any marketplace or supplier action.

## Current Blockers

- Emergent project import/build is not completed in this repo.
- Base44 authenticated export has not been freshly verified in this turn.
- Stripe live/test mode for production has not been approved for proof testing.
- Marketplace OAuth is expired/unverified.
- Supplier URLs and product rights are not verified.
- Private memorial media approval is not complete.

## Current Safe Next Action

Keep PR #31 as the audited staging candidate, keep Base44 live, and use this checklist to drive a separate non-production Emergent preview only after explicit approval.
