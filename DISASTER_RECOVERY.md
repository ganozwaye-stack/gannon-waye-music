# Disaster Recovery & System Details - Gannon Waye Music

This document contains key credentials inventory, webhook paths, DNS specifications, and manual recovery steps for the Gannon Waye Music and GanozMix Direct platform.

---

## 🔑 Platform Identity Inventory

* **Base44 App ID:** `69eb7905ca6eb4180010f794`
* **Base44 Live Domain:** `https://gannonwaye.com`
* **GanozMix Direct URL:** `https://ganozmixdirect.base44.app`
* **GitHub Repository Branch:** `main` (gannonwaye-live-eject-2026-06-01-tiktokfix)
* **Base44 Editor Workspace:** `https://app.base44.com/apps/69eb7905ca6eb4180010f794/editor`

---

## 🌐 DNS & Domain Setup (IONOS Portal)

* **Primary Domain:** `gannonwaye.com`
* **Redirect Mapping:** Ensure `www.gannonwaye.com` CNAME is pointed to `gannonwaye.com` (redirects must enforce SSL/HTTPS).
* **TikTok App Site Verification:**
  * Record Type: `TXT`
  * Host/Name: `@` (Root)
  * Value: `tiktok-developers-site-verification=YXTHpYcOkBnwfD0ht8YGfQqNZ2d30qRO`
  * Purpose: Required to verify website domain ownership inside the TikTok Developer Portal to resolve client_key errors.

---

## 💳 Stripe Webhook Configuration

* **Failing Endpoint (DO NOT USE):** `https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/stripeIntelligenceRouter`
* **Active Production Webhook URL (USE THIS):** `https://api.base44.app/api/apps/69eb7905ca6eb4180010f794/functions/stripeIntelligenceRouter`
* **Subscribed Events Checklist:**
  * `checkout.session.completed`
  * `checkout.session.expired`
  * `payment_intent.succeeded`
  * `payment_intent.payment_failed`
  * `charge.refunded`

---

## 🔒 Critical Platform Secrets (Names Only)

Verify that these keys exist inside your **Base44 App Settings → Secrets**:
* `STRIPE_SECRET_KEY` (Live key starting with `sk_live_...`)
* `STRIPE_WEBHOOK_SECRET` (Signing secret starting with `whsec_...` from the new endpoint)
* `OPENAI_API_KEY` (For story vaults and automated captions assistance)
* `METRICOOL_API_TOKEN` (To sync and queue approved posts to socials)
* `TIKTOK_CLIENT_KEY` (TikTok Developer portal app key)
* `TIKTOK_CLIENT_SECRET` (TikTok Developer portal app client secret)

---

## 🛠️ Step-by-Step Restoration Flows

### If the Website layout breaks:
1. Use the canonical Base44 source bound to App ID `69eb7905ca6eb4180010f794`. Do not use an old eject copy or an unbound local folder as deployment authority.
2. Inspect the current source and use a named Base44 checkpoint for recovery. Do not run destructive Git reset commands from this guide.
3. Run the no-deploy acceptance check:
   ```bash
   npm run test:acceptance
   ```
4. Review the local preview and identify the specific regression. Do not use a real checkout, social post, email, calendar, distributor, or connector control while diagnosing.
5. Only after the checks pass and Gannon gives explicit action-time approval, deploy using the guarded repository command:
   ```bash
   npm run deploy
   ```
6. Read back the deployed version and safety-hold state before considering any workflow re-enable.

### If Gannon gets locked out of the Admin panel:
* Admin credentials are tied to the Owner login email (`ganozwaye@gmail.com`). 
* If authentication fails, log into [app.base44.com](https://app.base44.com), open the Gannon Waye Music project, verify your email matches the platform admin config, and redeploy.
