# Store Agent Policy: Inventory & Imagery

**Thanking You Kindly · Gannon Waye Music**
Version 1.0 · September 2026
Owner: Gannon Waye (ganozwaye@gmail.com / gannonwayemusic@gmail.com)

This document sets the strict, non-negotiable rules every store agent must follow when managing storefront inventory and imagery. It complements `docs/STORE-OPERATING-RULES.md` and `docs/STOREFRONT-CONTENT-POLICY.md`. Where documents overlap, the strictest rule applies.

---

## 1. Purpose

The storefront is the public face of an independent, care-led brand. Every product shown must be real, verified, honestly priced and truthfully stocked. Nothing appears on the storefront that Gannon has not approved. These rules exist to protect customer trust, cash flow, and the brand's dignity.

## 2. Inventory Rules — Non-Negotiable

1. **Live data only.** The public storefront renders only verified, live `MerchProduct` records (`is_active: true`, `publication_status: "live"`). Hard-coded products, demo items, or invented stock are prohibited. If live data is missing, the store fails closed and shows nothing.
2. **Stock is truth.** `stock_quantity` and `stock_by_variant` must reflect real, counted stock. Variant stock is authoritative when present. A product with zero stock is displayed as Sold Out, never hidden and never oversold.
3. **Every sale updates the record.** When an order is paid, inventory is adjusted and the Google Sheets inventory tracker is refreshed automatically. No agent may claim stock or restock a product without owner verification (`stock_verified_at` set).
4. **Pricing is owner-set.** Sale price, shipping policy, and discount eligibility are set and approved by Gannon only. Agents may never change a live price, publish a discount, or mark a product `exclude_from_discounts` on their own.
5. **Staging only.** Agents may stage draft products (name, description, images, proposed price). Agents may never move a product past `approved`, never set `approved_by` / `approved_at`, and never edit stock or pricing fields of a live product. Publishing is a human action by the owner.

## 3. Imagery Rules — Non-Negotiable

1. **One source of truth.** Product imagery comes only from the approved live record (`image_url`, `images_array`). Never substitute hard-coded, AI-generated, or concept imagery for current stock.
2. **The locked storefront artwork stays locked.** The boutique hero artwork and its configuration (`src/config/storefrontArtLock.js`, its URL and checksum) are permanent. No agent may replace, restyle, or re-composite them.
3. **Brand consistency.** All store visuals use the brand system: the Gannon Waye neon title, the gold palette, and the established typography. New merch sections must match the existing storefront look; no clashing layouts or off-palette colouring.
4. **Approved campaign imagery only.** Featured displays use artwork supplied or explicitly approved by Gannon (e.g. the Thank You collection display). Never generate new public-facing product photography without approval.
5. **Dignity of memorial content.** Sonia's Garden and memorial assets use authentic artifacts only. They are never mixed into merch marketing or composited with product imagery.

## 4. Copy & Public Presentation

1. No internal jargon, admin meta-commentary, or technical terms in public copy ("owner approved", "record synced", agent names, statuses).
2. Public copy is warm, direct, and first-person to the customer. Prices shown in AUD; delivery shown before payment.
3. Claims must be true and verifiable: never claim stock, shipping speed, or availability the data does not support.

## 5. Approval Gates

| Action | Agent may | Owner approval required |
|---|---|---|
| Stage draft product | Yes | Before it becomes public |
| Publish / retire a product | No | Yes |
| Change price, stock, or shipping of a live product | No | Yes |
| Replace or restyle locked storefront artwork | No | Never (permanently locked) |
| Generate new public-facing imagery | No | Yes |
| Feature merch on public pages | Draft proposal only | Yes |

Daily approval requests are capped at 7 items. High-risk actions (pricing, publication, imagery replacement) always require explicit owner approval and are logged to the audit trail.

## 6. Voting & Fan Input

Fan votes on upcoming merch are stored privately (`MerchVote`, admin-only). Vote counts are never displayed publicly and must not be used in public copy as social proof. Vote tallies inform the owner's production decisions only.

## 7. Consequences

Any agent action that breaches these rules is reverted immediately. Repeated breaches disable the responsible agent's write access. The storefront's integrity outranks any automation convenience.