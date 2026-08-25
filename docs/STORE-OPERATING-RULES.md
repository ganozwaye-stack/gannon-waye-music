# Store operating rules — binding on any agent that touches listings or sales

Set 25 August 2026. Joins the constitution at `https://gannonwaye.com/agent-rules.txt`.
Applies to every agent, from any vendor, working on Thanking You Kindly or gannonwaye.com.

---

## Verified state, 25 Aug 2026 — read before acting

```
Stripe live balance available ........ $89.98 AUD
Payouts ever made .................... 0
Payout schedule ...................... MANUAL   <- why the money never moved
charges_enabled / payouts_enabled .... true / true
Bank attached ........................ WBC ····1441, default for AUD, status "new"
Requirements outstanding ............. none
MCC .................................. 5815 digital goods — WRONG, sells physical goods
Real customer orders ................. 1 (Thea Elsworth, $90.48, 5 Jun, hoodie + mug)
Owner test payments .................. 2 x $0.99 — excluded from every metric
Webhook deliveries ever .............. 0
Products with stock .................. hoodie 14, mug 31, journal set 19 — ALL IN DRAFT
Suppliers ............................ 2 records, both seeded demo data, both fake
POD account .......................... none
```

No agent may modify any of the payment settings above. Report; Gannon clicks.

---

## On money

1. **No price exists until it is derived.** Price = verified base cost + verified shipping
   + platform fee + margin. A number that feels right is not a price. A packet carrying an
   underived price is rejected at the gate, never sent to Gannon.
2. **Never modify live payment configuration.** Not the payout schedule, not the MCC, not
   a webhook endpoint, not a currency, not a price on a live listing.
3. **Fees are counted before profit is claimed.** Stripe fees plus GST took $1.84 out of
   Thea's $90.48. Quoting gross as profit is an error, not a rounding.
4. **One ledger.** Every order carries a `storefront` tag. Revenue by storefront is a
   filter, never a transfer. No internal invoices between the two shops, ever.

## On stock and listings

5. **Stock lives once.** Only `Product` holds `stock_on_hand`. Duplicating a Product row
   to reach a second storefront is forbidden — that single act breaks every report.
6. **Never list what cannot ship.** Zero stock and no supplier means the listing does not
   exist. Listing what cannot be fulfilled is unlawful, not merely untidy.
7. **A listing may only reach `active` through an approved Product Approval Packet.**
   No agent sets `active` directly. Ever.
8. **Test and demo records are flagged `is_test_listing` and excluded** from every
   revenue, stock and performance figure. If a record cannot be traced to a real
   transaction, it is a test.

## On the schema itself

9. **Never write a value an enum does not permit.** If the value you need is not allowed,
   stop and request the schema change. Writing it anyway creates records that vanish
   silently from every filter. This has already happened four times in this system:
   `Product.business_line = "thanking_you_kindly"` (3 records, still outstanding), and
   `Listing.marketplace = "ebay_au"` plus `Listing.status = "draft"` (now corrected).
10. **Additive changes first. Destructive changes last, and separately approved.**
    Adding a field is safe. Renaming or removing one is a migration and needs an export,
    a field count before and after, and Gannon's explicit approval.

## On the flow

11. **Nothing reaches Gannon except through Deego and the approval queue.** One inbox.
12. **Deego cannot approve.** Not for small things, not when Gannon is asleep, not when
    something is urgent. Deego makes the decision easy; it never makes the decision.
13. **An agent that cannot finish a job stops and says so.** It never substitutes a guess
    and never sends a partial packet.
14. **Approval attaches to a version, not to a record.** Any edit after approval returns
    the item to pending and pauses anything in flight.
15. **Every approval carries a human user ID and a timestamp.** Never a system account.

---

## The listing production flow

```
SOURCE      supplier, verified cost, shipping cost, lead time. no cost = no movement
   |
COST        landed cost computed
   |
DESIGN      brand spec. two colours. silver sets up, gold pays off.
   |        song gate checked against the Release record, never from memory
   |
COPY        listing description, in the voice
   |
CAMPAIGN    marketing reel built to the Reel Standard — made, not described.
   |        hook written out, captions per platform, schedule, named buyer
   |
PACKET      all of the above in ONE approval. incomplete packets are held, not queued
   |
========== GANNON ==========   the only human gate
   |        Approve / Approve & schedule / Request changes / Decline
   |        "request changes" always takes a reason — that reason is the training data
   |
LIST        active on approved storefronts only
   |
SELL        webhook fires -> order created -> Gannon told to pack it
   |
PAYOUT      money moves to the bank on a schedule
```

Everything above the gate is automated. Everything below it is automated. The gate is the
only place a human is required, by design.

**Two links are currently broken: the webhook at SELL (Codex, open) and the payout
schedule at PAYOUT (Gannon, one setting).**
