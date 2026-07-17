# Emergent GanozMix Direct Handoff

Updated: 17 July 2026

Purpose: give Emergent a clean, bounded build brief for GanozMix Direct without importing unstable Base44 marketplace state or mixing it with Gannon Waye Music commerce.

## Source Systems

- GitHub source of truth: `ganozwaye-stack/gannon-waye-music`.
- Migration tracker: `https://github.com/ganozwaye-stack/gannon-waye-music/issues/27`.
- Current migration priority order: `docs/base44-to-emergent-priority-list.md`.
- Base44 source app: `GanozMix Direct`, app id `69eb857abaebfe9e3df48083`.
- Base44 copy app exists, but the July 10 audit says the original app contains the real product state.

## Current Base44 Evidence

Queried through the Base44 connector on 17 July 2026:

- `Product`: 45 records returned in latest query.
- `Listing`: 2 records.
- `Order`: 0 records.
- `Store`: 1 eBay store, seller `ganoz1988`.
- eBay token expiry: `2026-07-08T15:45:58.806Z`.
- `JobQueue`: 36 records returned in latest query, many `DEAD_LETTER`.
- `ErrorLog`: repeated unresolved `syncOrders` errors with `INVALID_TOKEN_TYPE` and eBay HTTP 401.

Operational reading:

- Treat all live/listed flags as unverified until marketplace URLs are checked manually.
- Treat existing eBay connection as expired.
- Treat supplier/order automation as not production-ready.
- Treat orders as absent; do not infer sales traction.

## Emergent Build Boundary

Emergent should build:

- GanozMix Direct storefront.
- Product opportunity review.
- Supplier verification workflow.
- Listing template builder.
- Marketplace readiness checklist.
- Manual approval queue.
- Job/error dashboard.
- Client/subscription social service OS if kept separate from GWM music commerce.

Emergent must not automatically inherit:

- Gannon Waye Music Stripe logic.
- Gannon Waye Music merch orders.
- Supporter identity logic.
- Live marketplace publishing.
- Supplier ordering automation.
- Customer email sending.
- Any real secrets or tokens.

## First Product Candidate

Use this as the first manual proof product, not as an auto-publish item.

- Product: Magnetic Cable Organiser (Bamboo).
- Base44 ProductOpportunity id: `6a37065a616a405a3c1be0cc`.
- Category: `home_organisation`.
- Supplier: CJ Dropshipping.
- Supplier URL in record: `https://cjdropshipping.com/`.
- Supplier cost: `8.5`.
- Shipping cost: `6.0`.
- Estimated landed cost: `14.5`.
- Proposed retail price: `39.95`.
- Estimated margin: `42.1%`.
- Delivery time: `8-15 days`.
- Return risk: `low`.
- Legal risk: `none`.
- Competition: `medium`.
- Social content potential: `high`.
- Hero product potential: `true`.
- Approval status: `needs_review`.
- Problem solved: tangled cables and messy desk.
- Target audience: work from home professionals, students, creator desks.

Before any listing:

- Verify the exact supplier product URL, variant, stock, landed cost, shipping time, and returns.
- Confirm product images are licensed or supplier-approved.
- Confirm eBay OAuth is reconnected.
- Confirm listing copy and price with Gannon.
- Publish only after approval.

## Data to Export or Recreate

Minimum data model for Emergent:

- Products.
- Product opportunities.
- Listings.
- Stores/marketplaces.
- Orders.
- Job queue.
- Error log.
- Supplier trust.
- Product listing templates.
- Product content assets.
- Approval/action proposals.
- Team member/commission records only after role and privacy review.

Do not export secrets:

- eBay access token.
- eBay refresh token.
- Stripe keys.
- OAuth credentials.
- Customer payment data.
- Private bank/payment details.

## Build Phases

### Phase 1: Read-Only Mirror

- Import product/opportunity data without publish controls.
- Display stale/expired marketplace status honestly.
- Mark test/fake listings as test data.
- Show zero-order state plainly.

### Phase 2: Review and Cleanup

- Separate real products from test products.
- Mark dead-letter jobs resolved only after root cause is fixed.
- Add supplier verification checklist per product.
- Add approval gates for price, supplier, listing copy and marketplace publish.

### Phase 3: One Product Proof

- Build Magnetic Cable Organiser listing template.
- Create product page preview.
- Create short product content brief.
- Run manual review.
- Publish only after eBay OAuth, supplier verification and Gannon approval.

### Phase 4: Marketplace Integration

- Reconnect eBay using OAuth Bearer token.
- Test read-only order sync first.
- Test listing draft or sandbox flow before any live listing.
- Keep auto-fulfilment off.

## Human Approval and Login Required

- eBay OAuth login.
- Supplier account verification.
- Any product publishing.
- Any paid listing or ad.
- Any supplier contact or ordering.
- Any customer email.
- Any payment/Stripe/DNS/webhook change.

## Success Criteria

- Emergent has a read-only product/opportunity dashboard.
- Expired eBay state is not shown as connected.
- Test listings are clearly labelled.
- Magnetic Cable Organiser has a complete review pack.
- No marketplace publish action is available without approval.
- Base44 remains available as fallback until Emergent reaches feature parity.
