# Disaster Recovery & System Details - Gannon Waye Music

This document contains key credentials inventory, webhook paths, DNS specifications, and manual recovery steps for the Gannon Waye Music and GanozMix Direct platform.

---

## 🔑 Platform Identity Inventory

* **Base44 App ID:** `69eb7905ca6eb4180010f794`
* **Base44 Live Domain:** `https://gannonwaye.com`
* **GanozMix Direct URL:** `https://ganozmixdirect.base44.app`
* **GitHub Default Branch:** `main`
* **Active Clean Migration Branch:** `upgrade/base44-emergent-migration`
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

* **Required Order Fulfillment Webhook URL:** `https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/stripeWebhook`
* **Intelligence/diagnostic router:** `https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/stripeIntelligenceRouter`
* **Do not rely on `stripeIntelligenceRouter` alone for order creation.**
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
1. Open terminal in the directory `C:\Users\ganno\Documents\Codex\2026-05-23\can-you-screen-record-and-give\gannonwaye-live-eject-2026-06-01-tiktokfix`
2. Run `git status` to see any uncommitted work.
3. To rollback to the last working Git state, run:
   ```bash
   git reset --hard HEAD
   ```
4. Rebuild the bundle to verify compilation:
   ```bash
   npm run build
   ```
5. Deploy to Base44 Live:
   ```bash
   npx base44 deploy
   ```

### If Gannon gets locked out of the Admin panel:
* Admin credentials are tied to the Owner login email (`ganozwaye@gmail.com`). 
* If authentication fails, log into [app.base44.com](https://app.base44.com), open the Gannon Waye Music project, verify your email matches the platform admin config, and redeploy.
