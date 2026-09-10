# Store Agent Policy: Inventory & Imagery

**Thanking You Kindly · Gannon Waye Music**
Version 1.0 · September 2026
Owner: Gannon Waye (ganozwaye@gmail.com / gannonwayemusic@gmail.com)

This document sets the strict, non-negotiable rules every store agent must follow when managing storefront inventory and imagery. It complements `docs/STORE-OPERATING-RULES.md` and `docs/STOREFRONT-CONTENT-POLICY.md`. Where documents overlap, the strictest rule applies.

---

## 1. Purpose

The storefront is the public face of an independent, care-led brand. Every product shown must be real, verified, honestly priced and truthfully stocked. Nothing appears on the storefront that Gannon has not approved. These rules exist to protect customer trust, cash flow, and the brand's dignity.

> ## THE FIRST RULE — A FACE IS NEVER TOUCHED BY AI
>
> **Non-negotiable. This rule overrides every other instruction, task, deadline or convenience, in every task, forever.**
>
> AI must never create, redraw, regenerate, re-imagine, retouch or "improve" the face or likeness of any real person — including Sonia Waye and Gannon himself. Portrait, memorial and family imagery is only ever the owner's authentic original photograph, used untouched. If an image task cannot be completed without generating or altering a human face, the task is not done — it is stopped and escalated to the owner. AI-generated "portraits" on products, posters or store artwork are prohibited outright.

## 2. Inventory Rules — Non-Negotiable

1. **Live data only.** The public storefront renders only verified, live `MerchProduct` records (`is_active: true`, `publication_status: "live"`). Hard-coded products, demo items, or invented stock are prohibited. If live data is missing, the store fails closed and shows nothing.
2. **Stock is truth.** `stock_quantity` and `stock_by_variant` must reflect real, counted stock. Variant stock is authoritative when present. A product with zero stock is displayed as Sold Out, never hidden and never oversold.
3. **Every sale updates the record.** When an order is paid, inventory is adjusted and the Google Sheets inventory tracker is refreshed automatically. No agent may claim stock or restock a product without owner verification (`stock_verified_at` set).
4. **Pricing is owner-set.** Sale price, shipping policy, and discount eligibility are set and approved by Gannon only. Agents may never change a live price, publish a discount, or mark a product `exclude_from_discounts` on their own.
5. **Staging only.** Agents may stage draft products (name, description, images, proposed price). Agents may never move a product past `approved`, never set `approved_by` / `approved_at`, and never edit stock or pricing fields of a live product. Publishing is a human action by the owner.

## 3. Imagery Rules — Non-Negotiable

1. **One source of truth.** Product imagery comes only from the approved live record (`image_url`, `images_array`). Never substitute hard-coded, AI-generated, or concept imagery for current stock.
2. **The locked storefront artwork stays locked.** The boutique hero artwork and its configuration (`src/config/storefrontArtLock.js`, its URL and checksum) are permanent. No agent may replace, restyle, re-composite, or place any overlay, banner or text block over any part of it — without the owner's explicit, contemporaneous permission for that specific change. The only sanctioned exception is a transparent, owner-managed hotspot zone (`StorefrontHotspot` entity, edited at `/admin/store-hotspots`), which never obscures the artwork.
3. **Brand consistency.** All store visuals use the brand system: the gold palette and the established typography. The "Gannon Waye" neon name is already part of the locked boutique hero photo itself (baked into the artwork as signage) — do not add a second, separate on-page rendering of the name over that photo; it duplicates what the photo already shows and was removed at the owner's direction (2026-09-08). New merch sections must match the existing storefront look; no clashing layouts or off-palette colouring.
4. **Approved campaign imagery only.** Featured displays use artwork supplied or explicitly approved by Gannon (e.g. the Thank You collection display). Never generate new public-facing product photography without approval.
5. **Dignity of memorial content.** Sonia's Garden and memorial assets use authentic artifacts only. They are never mixed into merch marketing or composited with product imagery.
6. **No AI faces — anywhere, ever.** Product imagery that would show a face must either use the owner's authentic original photograph, untouched, or leave the face out entirely. AI recreation of any human likeness is prohibited in all store and content tasks, with no exceptions. This restates THE FIRST RULE above.

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
| Create, regenerate or alter any human face or portrait | No | Prohibited outright — never permitted |
| Generate new public-facing imagery | No | Yes |
| Feature merch on public pages | Draft proposal only | Yes |

Daily approval requests are capped at 7 items. High-risk actions (pricing, publication, imagery replacement) always require explicit owner approval and are logged to the audit trail.

## 6. Voting & Fan Input

Fan votes on upcoming merch are stored privately (`MerchVote`, admin-only). Vote counts are never displayed publicly and must not be used in public copy as social proof. Vote tallies inform the owner's production decisions only.

## 7. Consequences

Any agent action that breaches these rules is reverted immediately. Repeated breaches disable the responsible agent's write access. The storefront's integrity outranks any automation convenience.