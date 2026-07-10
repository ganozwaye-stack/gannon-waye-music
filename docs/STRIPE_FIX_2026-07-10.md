# Stripe Fix — 2026-07-10

## What was wrong

- Base44 payment diagnostics show `STRIPE_SECRET_KEY missing or invalid`, so checkout is blocked until server secrets are restored.
- `createPaymentIntent` created the Stripe client at module load before checking `STRIPE_SECRET_KEY`, which could fail badly instead of returning a safe checkout-unavailable response.
- Some admin screens pointed at `stripeIntelligenceRouter` as if it was the only webhook endpoint. That router does not create orders. The required order-fulfillment endpoint is `stripeWebhook`.
- Live webhooks could fall back to unsigned JSON if `STRIPE_WEBHOOK_SECRET` was missing. That is unsafe for live payments.
- The go-live checklist marked Stripe as done even though payment diagnostics show Stripe is still blocked.

## Code fixes made

- `createPaymentIntent` now validates `STRIPE_SECRET_KEY` before creating the Stripe client.
- `createPaymentIntent` now returns a safe `503 STRIPE_CONFIG_ERROR` when Stripe is not configured.
- `createCheckoutSession` now avoids creating duplicate open diagnostics for the same Stripe config issue.
- `stripeWebhook` now requires `STRIPE_WEBHOOK_SECRET` in live mode.
- `stripeIntelligenceRouter` now requires `STRIPE_WEBHOOK_SECRET` in live mode.
- `integrationHealthCheck` now reports invalid keys as invalid, not merely test mode.
- Stripe setup/admin screens now show `stripeWebhook` as the required order-fulfillment endpoint.
- Go-live checklist now marks Stripe as action/review until the secrets, webhook, and end-to-end checkout test are actually verified.

## Required Base44 secrets

Set these in Base44 app secrets/environment variables, never in frontend code:

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

Use either all test keys or all live keys. Do not mix `sk_live_` with `pk_test_`, or `sk_test_` with `pk_live_`.

## Required Stripe webhook endpoint

Register this first because it creates orders:

```text
https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/stripeWebhook
```

Optional secondary intelligence endpoint, only after order fulfillment is working:

```text
https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/stripeIntelligenceRouter
```

Recommended events:

- `checkout.session.completed`
- `checkout.session.expired`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`
- `charge.dispute.created`

## Verification checklist

Do not mark Stripe complete until all pass:

1. `integrationHealthCheck` passes for Stripe secret, publishable key, key mode, webhook secret, and Stripe API connectivity.
2. Stripe Dashboard webhook delivery to `stripeWebhook` returns HTTP 2xx.
3. A controlled checkout creates a Stripe Checkout Session.
4. A paid session creates a `MerchOrder`.
5. Receipt email sends.
6. Admin notification sends.
7. Inventory/profit logic runs.
8. Open `PaymentDiagnostic` records are reviewed and resolved only after the successful test.

