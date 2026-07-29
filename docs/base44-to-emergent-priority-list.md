# Base44 to Emergent Priority List

Updated: 30 July 2026

Purpose: move toward Emergent without losing the working Gannon Waye Music site, store, approvals, content records, or evidence trail. GitHub is the source of truth for code, docs, tests, dispatch files, migration decisions, and handoff packs.

## Current Position

- GitHub repo: `ganozwaye-stack/gannon-waye-music`.
- GitHub tracker: `https://github.com/ganozwaye-stack/gannon-waye-music/issues/27`.
- Current launch staging branch: `launch/gannon-waye-suite-2026-07-29`.
- Current launch staging PR: `https://github.com/ganozwaye-stack/gannon-waye-music/pull/31`.
- Current launch staging head and CI status are tracked in PR #31 checkpoint comments.
- Latest verified launch-code checkpoint before the documentation update: `1017ce79282a493c41e2f5d1bd2553fbd838feba`.
- Detailed parity checklist: `docs/base44-emergent-parity-checklist-2026-07-30.md`.
- Detailed dropshipping procedure: `docs/micro-brand-dropshipping-procedure-2026-07-30.md`.
- Current pricing snapshot: `docs/platform-pricing-snapshot-2026-07-30.md`.
- Previous clean migration branch `upgrade/base44-emergent-migration` remains useful for history, but PR #31 is the current audited launch-control branch.
- Historical route-integration branch `upgrade/gwm-command-centre-v2` remains open, but is not the clean Base44-to-Emergent merge path because it conflicts broadly with current `main`.
- Base44 project config exists at `base44/config.jsonc`.
- Build, lint, direct typecheck, local npm audit, focused Playwright checks, and 8 of 8 GitHub checks passed on the current launch staging head.
- Base44 remains the live/stability source until an Emergent replacement has feature parity and approval.
- Emergent must stay separate from Gannon Waye Music checkout, Stripe, supporter identity, and order logic unless a later migration is explicitly approved.

## Today Priority Order

### 1. Lock GitHub as the Source of Truth

Status: current staging branch is green, but not production-approved.

Do now:

- Keep `.github/workflows/build.yml` and `.github/workflows/playwright.yml`.
- Keep `.env.example` placeholder-only; real secrets stay in Base44/GitHub secret stores.
- Keep all migration decisions in `docs/` or `system-dispatch/`.
- Commit changes only after lint/build/smoke checks pass.
- Keep PR #31 as the current launch-control evidence thread unless a cleaner replacement PR is explicitly created.

Evidence to require:

- `npm run lint` passes.
- `npm run build` passes.
- Playwright smoke suite passes.
- `git status` only contains intentional changes.

### 2. Freeze Base44 Into Stabilise/Export Mode

Status: ready to action, but Base44 write/deploy still needs authenticated editor/CLI access.

Do now:

- Do not build major new systems in Base44 unless they protect the live site.
- Keep store, checkout, Stripe, orders, legal pages, admin auth, ApprovalQueue, and Metricool safety stable.
- Export or document schemas/entities needed by Emergent.
- Use Base44 connector reads to verify records where possible.

Human approval/login needed:

- Base44 editor changes.
- Base44 CLI login/deploy if PowerShell session still times out.
- Any live Stripe/payment setting changes.
- Any public publishing/scheduling.

### 3. Define the Emergent Build Boundary

Status: implemented as a handoff brief in `docs/emergent-ganozmix-handoff.md` and strengthened by `docs/base44-emergent-parity-checklist-2026-07-30.md`; still pending Emergent import/build.

Emergent should own:

- GanozMix Direct storefront rebuild.
- Product/supplier workflow.
- Dropshipping prototype.
- Subscription social service OS.
- Client portal and approval queue patterns.

Emergent must not inherit automatically:

- Gannon Waye Music Stripe logic.
- Existing merch/order records.
- Supporter identity/payment orchestration.
- Marketplace publishing without approval.
- Any supplier ordering automation.

### 4. Repair GanozMix Direct Before Marketplace Push

Status: procedure documented and approval-only; live marketplace push remains blocked by external marketplace/OAuth state and missing supplier verification.

Priority product to action first:

- Magnetic Cable Organiser (Bamboo), based on the 2026-07-10 audit.

Do next:

- Reconnect eBay OAuth with a valid Bearer token.
- Resolve dead-letter extraction/enrichment jobs.
- Verify supplier URL, landed cost, shipping time, returns, and listing legality.
- Build one listing template and one short proof video.
- Publish only after Gannon approval and live URL verification.

Human approval/login needed:

- eBay OAuth.
- Supplier account access.
- Product publishing approval.
- Any paid listing/advertising action.

### 5. Convert One Content Draft Into a Real Approved Asset

Status: first review-only approval pack created at `content-production/approval-packs/2026-07-17-reel-1-thankyou/`; final media export still needs Gannon approval and edit/export work.

Do next:

- Picked the 16 July Instagram Reels emotional story draft from Base44 ApprovalQueue.
- Matched it to verified `Thank You` cover, banner and reveal-audio URLs.
- Created a review-only approval pack with no executable publish payload.
- Keep Metricool status as draft until approved.

Human approval needed:

- Final caption approval.
- Audio timestamp approval.
- Final visual approval.
- Metricool scheduling approval.

### 6. Preserve Live Revenue and Trust Systems

Status: ongoing guardrail.

Do not break:

- Stripe.
- Checkout.
- Cart.
- Orders.
- Webhooks.
- Promo codes.
- Inventory.
- Legal pages.
- Admin auth.
- ApprovalQueue.
- Metricool safety.
- Agent approval rules.

## Automatic Work Queue

These can be done by Codex/GitHub agents without further approval:

- Maintain migration docs and dispatch docs.
- Run lint/build/Playwright checks.
- Create safe GitHub workflow files.
- Prepare schema/entity export notes.
- Prepare Emergent build specs.
- Prepare content drafts and production instructions.
- Create non-published approval checklists.
- Audit links, routes, and stale docs.

These require Gannon approval or login:

- Publishing posts.
- Scheduling through Metricool.
- Charging or testing live payments.
- Changing Stripe secrets/settings.
- Base44 deployment if login is required.
- eBay OAuth and marketplace listing.
- Supplier contact/order placement.
- Public legal/policy changes.
- Sending customer/bulk emails.

## Stale or Conflicting Sources Repaired

These files should not override the July 17 migration priority order:

- `DISASTER_RECOVERY.md` now distinguishes default `main` from the active clean migration branch and points order fulfillment at `stripeWebhook`.
- `src/docs/FINAL_OWNER_HANDOFF.md` is now marked historical and superseded by July 2026 audit/migration docs.
- `src/pages/admin/GanozMixBridge.jsx` now shows eBay reconnect/approval-gated marketplace publishing rather than "connected" or one-click live publishing.
- `system-dispatch/master-cross-platform-dispatch.md` may still call itself the single source of truth. It remains the broad dispatch brief, but this file is the current migration priority order.

## Recommended Next GitHub Commit Scope

Commit together:

- GitHub workflow additions.
- `.env.example` and `.gitignore` template fix.
- Playwright stability updates.
- Tailwind scan exclusion.
- Dispatch/report updates.
- This priority list.

Do not include:

- Generated Playwright reports.
- Local `.env` files.
- Secrets.
- Node modules.
- Unverified Base44 export dumps.

## Step-by-Step Checkpoints

1. Confirm this priority order.
2. Commit/push the GitHub source-of-truth updates.
3. Open or update a GitHub PR for migration readiness.
4. Build an Emergent handoff pack from the Base44/GanozMix boundaries and `docs/base44-emergent-parity-checklist-2026-07-30.md`.
5. Use Base44 editor/connector to create or confirm approval records.
6. Reconnect blocked external services only when Gannon is present.
