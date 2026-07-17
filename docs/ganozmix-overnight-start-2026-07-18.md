# GanozMix Overnight Start

Updated: 18 July 2026

Scope: safe overnight work only. No marketplace reconnect, no publishing, no paid actions, no customer contact, no file deletion, and no Gannon Waye Music store/payment crossover.

## What Was Started

- Created a GanozMix-only entity namespace for product candidates, suppliers, listing drafts, marketplace stores, approval items, job runs, and error logs.
- Refactored the `ganozmix_direct` agent instructions so it can only prepare review packs and approval items.
- Added local mock GanozMix data so the admin page can render in development without pushing live schema changes first.
- Rebuilt `/admin/ganozmix` as a review-mode dashboard instead of a direct "go sell now" bridge.
- Updated the public GanozMix case study so it presents the system as an approval-first rebuild, not a live marketplace automation.

## Source App Audit Snapshot

- Source app id: `69eb857abaebfe9e3df48083`
- Source URL: `https://ganozmixdirect.base44.app`
- Products found: 45
- Product opportunities found: 5
- Listings found: 2, active or unverified in the old app
- Orders found: 0
- Marketplace store found: eBay seller `ganoz1988`
- Job records found: 36, including dead letters
- Error logs found: 10, including eBay OAuth/token failures

## Safe Verdict

Carry over the review intelligence, not the live marketplace state.

The old GanozMix app has useful ideas, but it is mixed with Gannon Waye merch, test records, old jobs, stale marketplace state, and broken eBay OAuth. The rebuild should stay separate from the Gannon Waye Music store, Stripe, customer records, supporter flows, and fulfilment system.

## First Product Proof

First proof product: Magnetic Cable Organiser (Bamboo)

Before it can become a listing draft, review:

- Supplier URL
- Variants and stock
- Landed cost
- Shipping time
- Return policy
- Image usage rights
- Retail price
- eBay competition
- Differentiation and content angle

## User Approval Needed

- Approve Adobe re-auth and final cover face/Photoshop direction.
- Approve any deletion or offload of large local files.
- Approve eBay OAuth reconnect when ready.
- Approve any product import into live GanozMix entities.
- Approve any listing publish, supplier order, paid subscription, or customer message.
- Approve the final controlled live checkout/payment test before public sales push.

## Next Safe Tasks

- Export a product/opportunity cleanup table from the source archive.
- Classify candidates as `keep`, `maybe`, `test`, `gwm_merch`, or `delete_later`.
- Build the Magnetic Cable Organiser review pack.
- Add supplier and margin-check fields to the admin review workflow.
- Prepare a Base44 entity push plan, but do not push live schema until the review checkpoint is accepted.
