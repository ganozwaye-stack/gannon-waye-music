# Micro-Brand Dropshipping Procedure - 2026-07-30

Status: approval-only procedure ready for review.

This document separates two different commerce lanes:

- Gannon Waye Music merch: brand-controlled products connected to the music site and store.
- GanozMix Direct: separate micro-brand/dropshipping product research and marketplace experiments.

No marketplace listing, supplier order, paid sample, customer email, live Stripe action, or public publish is approved by this document.

## Operating Rule

Every product starts in review mode. A product can move forward only when the evidence below is complete and Gannon approves the exact product, exact channel, and exact action.

## Lane A - Gannon Waye Music Merch

Use this for the artist store and `Thank You` / `Respect Is Earned` products.

Current launch-safe position:

- Keep `/store` as the neon Gannon Waye retail frontage.
- Keep `/store/all` as the full product grid.
- Keep products brand-led, not generic dropshipping inventory.
- Keep international physical checkout blocked until shipping is manually quoted.
- Keep synthetic add-ons blocked from payment.
- Keep live fulfilment manual until a provider and sample quality are approved.
- Do not connect a fulfilment API or supplier automation without approval.

Required before live fulfilment activation:

1. Confirm final product list, prices, sizes, photos, mockups, and stock state.
2. Confirm whether each item is stocked, made to order, or manual fulfilment.
3. Confirm domestic and international postage rules.
4. Confirm refund/return language for apparel, mugs, posters, bundles, and sold-out collector products.
5. Confirm Stripe product and coupon setup in test mode or live mode before any payment proof.
6. Run a controlled approved checkout proof.
7. Only after successful proof, approve production fulfilment workflow.

## Lane B - GanozMix Direct Micro-Brand

Use this for dropshipping or marketplace experiments. Keep it separate from Gannon Waye Music customers, Stripe, supporter data, merch orders, and fulfilment.

The first proof product remains:

- Product: Magnetic Cable Organiser (Bamboo)
- Source app candidate: `6a37065a616a405a3c1be0cc`
- Supplier in old record: CJ Dropshipping
- Old estimate: landed cost AUD 14.50, retail AUD 39.95, margin 42.1 percent
- Status: needs review, not approved for publish

## Product Intake Checklist

For each candidate, record:

1. Product name and category.
2. Problem solved and target customer.
3. Supplier name and exact product URL.
4. Variants, material, dimensions, weight, and packaging.
5. Supplier rating, stock level, processing time, and shipping methods.
6. Product cost, shipping cost, payment fee, marketplace fee, returns buffer, and total landed cost.
7. Target retail price and net margin.
8. Delivery estimate to Australia and the main target country.
9. Return/refund risk.
10. Image and video rights.
11. Competition check: eBay, Google Shopping, Amazon, and local comparable listings.
12. Branding risk: trademarks, restricted claims, unsafe goods, medical claims, children safety, batteries, liquids, cosmetics, or regulated products.
13. Cleanup lane: `keep`, `maybe`, `test`, `gwm_merch`, or `delete_later`.
14. Approval status: `needs_review`, `needs_edit`, `approved`, `blocked`, or `rejected`.

## Margin Gate

Calculate:

```text
landed_cost = supplier_cost + shipping_cost + packaging_or_handling + payment_fee + marketplace_fee + returns_buffer
net_margin = retail_price - landed_cost
net_margin_percent = net_margin / retail_price
```

Default reject or park conditions:

- Net margin below 25 percent before ads/content cost.
- Delivery estimate above 15 business days unless the product is clearly unique.
- Supplier URL is generic or cannot identify the exact SKU.
- Image rights are unclear.
- Product has high return risk or quality uncertainty.
- Product is fragile, electrical, safety-sensitive, medical, cosmetic, counterfeit-adjacent, trademark-heavy, or regulated.
- Competition sells the same product cheaper with faster local shipping.

## Listing Draft Gate

A draft listing may be created only after the intake and margin gates pass.

Draft must include:

- Listing title under marketplace title limit.
- Short description and specifications.
- Clean product images or approved supplier images.
- Shipping estimate and returns language.
- What is included in the package.
- Variant rules.
- Supplier URL and backup supplier note.
- Margin calculation.
- Competition notes.
- Risks and open questions.

Draft status must remain `pending_approval`. Publishing controls stay locked.

## Approval Gate

Approval must name:

- Product.
- Channel.
- Price.
- Shipping rule.
- Supplier.
- Whether the action is draft, test listing, paid sample, or live publish.

Ambiguous approval is not enough. If the approval is unclear, create an approval item and stop.

## Controlled Test Gate

Before public selling:

1. Reconnect marketplace OAuth while Gannon is present.
2. Test read-only marketplace status first.
3. Confirm payment route in test mode or an approved low-value live proof.
4. Confirm order logging.
5. Confirm cancellation/refund process.
6. Confirm customer support mailbox or form.
7. Confirm supplier order process manually.
8. Confirm no Gannon Waye Music order/customer data is mixed into GanozMix.

## Forbidden Without Approval

- Publishing listings.
- Reconnecting eBay or another marketplace.
- Placing supplier orders.
- Buying samples.
- Running paid ads.
- Sending customer emails.
- Using live Stripe checkout.
- Importing Gannon Waye Music customers into GanozMix.
- Deleting product records or files.
- Connecting fulfilment APIs.

## Launch Decision

For tonight, the procedure is ready as an approval-only operating model. It is not ready for live dropshipping revenue until supplier verification, marketplace OAuth, payment proof, support workflow, and owner approval are complete.
