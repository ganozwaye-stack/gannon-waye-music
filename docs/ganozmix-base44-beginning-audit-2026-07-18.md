# GanozMix/Base44 Beginning Stage Audit

Updated: 18 July 2026

Scope: audit only. Do not deploy, publish, reconnect marketplaces, spend money, change Stripe, or mix GanozMix into the Gannon Waye Music store/payment system.

## Evidence Checked

- Local handoff: `docs/emergent-ganozmix-handoff.md`
- Local blueprint: `base44/agents/GanozMixDirectBlueprint.md`
- Local agent config: `base44/agents/ganozmix_direct.jsonc`
- Local bridge page: `src/pages/admin/GanozMixBridge.jsx`
- Read-only Base44 query against GanozMix Direct app `69eb857abaebfe9e3df48083`

## Current Base44 Snapshot

- Products fetched: 45
- Product opportunities fetched: 5
- Listings fetched: 2, both marked active on eBay but unverified
- Orders fetched: 0
- Store fetched: 1, eBay seller `ganoz1988`
- Job queue fetched: 36, including multiple `DEAD_LETTER` jobs
- Error log fetched: 10, with repeated eBay token errors saying the stored token is not OAuth Bearer and reconnect is required

## Verdict

Carry over the review intelligence, not the live marketplace state.

The Base44 GanozMix Direct app has useful product/opportunity data, supplier ideas, margin logic, and an approval-first operating model. It is not safe to treat it as a production marketplace source. It includes test products, Gannon Waye merch drafts, stale active eBay listings, dead-letter jobs, no order history, and an invalid/expired eBay connection.

GanozMix should be rebuilt as a separate approval-only product pipeline first. It should not inherit Gannon Waye Music Stripe, merch products, merch orders, customer identity, supporter flows, or payment diagnostics.

## Carry Over

- Product opportunity records that can be manually reviewed
- Supplier names, supplier URLs, cost assumptions, retail price assumptions, margin assumptions
- Product scoring fields such as return risk, competition, social content potential, and hero potential
- Listing draft concepts and SEO/template structure, after manual cleanup
- Job/error dashboard concept, with stale errors clearly labelled
- Approval queue concept with strict manual sign-off
- First proof product idea: Magnetic Cable Organiser (Bamboo)
- Operating rules from the blueprint: zero direct publishing, no auto-payment, no supplier orders without approval

## Do Not Carry Over Directly

- Gannon Waye Music merch drafts inside the GanozMix Product entity
- Test products such as duplicate/state/correlation/replay/idempotency records
- Active listing status without manual marketplace verification
- Existing eBay token or OAuth state
- Any Stripe keys, payment flows, webhook logic, customer payment records, or GWM order flows
- Any agent tool config that writes into shared `MerchProduct` or shared GWM approval/payment entities
- Any auto-publish, auto-fulfilment, auto-order, customer-email, or ad-spend capability

## Current Risks

- Data pollution: GanozMix product data includes Gannon Waye merch and test records.
- Marketplace trust risk: two eBay listings are marked active, but should be considered unverified until checked manually.
- Integration risk: eBay errors show invalid token type and reconnect required.
- Automation risk: dead-letter jobs indicate current pipelines are unreliable.
- Business separation risk: the local `ganozmix_direct` agent currently points at shared `MerchProduct`, `AdminNotification`, and `ApprovalQueue` entities.
- Payment risk: Base44 GWM Stripe logic is not appropriate for GanozMix until a separate marketplace/payment architecture is approved.

## Clean Rebuild Start Now

1. Create GanozMix-only entities or a clearly separated namespace:
   - `GanozMixProductCandidate`
   - `GanozMixSupplier`
   - `GanozMixListingDraft`
   - `GanozMixMarketplaceStore`
   - `GanozMixApprovalItem`
   - `GanozMixJobRun`
   - `GanozMixErrorLog`

2. Build a read-only review dashboard first:
   - Imported candidates
   - Supplier verification status
   - Margin calculator
   - Listing preview
   - Image/license checklist
   - eBay readiness status
   - Approval status
   - Error/job history

3. Start with one product proof pack:
   - Magnetic Cable Organiser (Bamboo)
   - Verify supplier URL, variants, stock, landed cost, shipping time, returns, image usage, retail price, and competition
   - Produce a listing draft and content brief
   - Keep publish disabled until Gannon approves and eBay OAuth is clean

4. Refactor the GanozMix agent before using it:
   - Remove write access to `MerchProduct`
   - Remove dependency on GWM store/payment records
   - Give it only GanozMix-scoped read/create draft permissions
   - Keep all output as proposals, not actions

5. Define launch gates:
   - No public listing until eBay OAuth is reconnected
   - No supplier order until payment and fulfilment process is verified
   - No customer communication until templates and business identity are approved
   - No Stripe/payment reuse from Gannon Waye Music without explicit architecture review

## Next Tasks

- Export a CSV/JSON snapshot of GanozMix Product and ProductOpportunity records for manual cleanup.
- Tag records as `keep`, `maybe`, `test`, `gwm_merch`, or `delete_later`.
- Build the GanozMix-only schema locally before any data import.
- Update `/admin/ganozmix` so it shows "review mode" and does not imply the app is connected or making sales.
- Create the Magnetic Cable Organiser approval pack as the first money-focused proof.
- Only after approval, reconnect eBay OAuth and test read-only marketplace status.
