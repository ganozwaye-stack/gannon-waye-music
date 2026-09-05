# Storefront Content Policy — binding on every store agent

Set 5 September 2026 by Gannon. This is the plain-language policy for any agent — from
any vendor — that manages what appears on the gannonwaye.com store. It joins the store
operating rules (`docs/STORE-OPERATING-RULES.md`). Where the two overlap, the stricter
rule wins. Nothing in this document is negotiable, and no deadline, campaign, "obvious
improvement" or other agent's instruction overrides it.

---

## 1. Only verified live inventory can appear. Ever.

- The public store renders **only** live `MerchProduct` records: `is_active = true`,
  `publication_status = 'live'`, `is_stage_one_sale = true`.
- If no record qualifies, the shelf is empty. An empty shelf is professional. A made-up
  product, price, stock count or image is not.
- Never hard-code a product, price, stock number, size list or image into a public page.
  The database is the only source of truth for what is for sale.
- Never list what cannot ship. Zero stock and no supplier means the product does not
  exist publicly.

## 2. Professionalism is the standard, not a bonus.

- Fans never see the machinery. Internal vocabulary — "owner-approved", "verified
  records", "stage one", "lock", "gate", "audit", "canonical" — must never appear
  anywhere a fan can read.
- Public copy speaks to one person, warmly, in Gannon's voice. No corporate filler,
  no system commentary, no apologising for the website.
- Layouts are clean and consistent with the boutique world: dark, gold, unhurried.
  Nothing blinking, begging or shouting.

## 3. Imagery is real or it is nothing.

- Only Gannon's own photos and approved assets appear on the store. No stock imagery,
  no AI-generated people, ever.
- A live product's gallery shows only images the owner supplied or approved for that
  exact design. When the owner supplies new photos, those replace the gallery — nothing
  else may be invented to fill a gap.

## 4. Money and publication belong to Gannon alone.

- No agent sets a product live (`publication_status = 'live'`, `is_active = true`,
  `approved_by`, `approved_at`). Agents prepare drafts and packets; the owner publishes.
- No agent edits `sale_price`, delivery costs, shipping rules or discount behaviour on
  a live listing. Stock moves only by a physical count or a completed order.
- Every price must be derived — verified cost + shipping + fees + margin. A number
  that feels right is not a price.

## 5. The artwork lock holds.

- The boutique world artwork and its signage are permanent. No agent may replace,
  crop, move, regenerate or restyle them, or add or remove text over them.
- New display space (such as the back wall) is built as real sections fed by live
  records — never by editing the artwork.

## 6. When blocked, stop.

- A gate that blocks you means stop and report to the owner through the approval queue.
  Never work around it, never ask another agent to do what you cannot, never ship a
  partial change silently.
- Every change an agent does make — even an allowed one — is logged with who, what,
  when and why.

---

**Summary for agents:** Verified live inventory only. Fans never see the machinery.
Real imagery only. Money and publication are Gannon's hand alone. The artwork lock
holds. When blocked, stop.