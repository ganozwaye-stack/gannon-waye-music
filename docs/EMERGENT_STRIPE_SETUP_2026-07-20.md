# Emergent Stripe Setup

Date: 2026-07-20

## Safe Setup Answers

- Site/business name: Gannon Waye Music
- Public domain: https://gannonwaye.com
- Business country: Australia
- Default currency: AUD
- Store type: artist merchandise, physical products, supporter/community payments, music-release campaign merch and limited bundles
- Shipping: Australia-wide shipping first
- Checkout mode before cutover: test mode only
- Production checkout status: disabled until live keys, webhook, order record and receipt are verified

## Stripe Environment Variables

Add these in the Emergent environment/settings area only after verifying the exact target backend:

- `STRIPE_SECRET_KEY`: server side only
- `STRIPE_PUBLISHABLE_KEY`: public/client key where needed
- `STRIPE_WEBHOOK_SECRET`: server side only, created after the webhook endpoint exists

Never paste live secret keys into chat or commit them to GitHub.

## Webhook Events

Enable these for the Emergent backend endpoint once it exists:

- `checkout.session.completed`
- `checkout.session.expired`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

## Suggested URLs

Use preview URLs first. After QA passes, use:

- Success URL: `https://gannonwaye.com/store/checkout-success`
- Cancel URL: `https://gannonwaye.com/store/checkout-cancel`
- Webhook URL: confirm in Emergent, likely an `/api/stripe/webhook` style route

## Gannon Must Enter Directly

These should be entered by Gannon inside Stripe/Emergent, not by Codex:

- Live secret keys
- Bank account details
- ABN/tax registration details
- Legal entity details
- Identity verification details
- One-time passwords or security prompts

## Live Gate

Do not switch checkout to live until:

- A low-value test order completes.
- The order record appears in the target database.
- Stripe webhook proof is visible.
- Receipt/email path works.
- Refund/cancel path is understood.
