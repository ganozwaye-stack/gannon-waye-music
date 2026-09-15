# Staging vs Production Environment Guide

This guide separates safe, no-deploy acceptance checks from owner-controlled production deployment.

---

## 💻 Environment Configurations

### 1. Staging / Preview
* **Local Staging Server:** `http://localhost:5173` (run `npm run dev`)
* **Base44 Dev Preview:** Available inside the [Base44 Online Editor](https://app.base44.com/apps/69eb7905ca6eb4180010f794/editor) preview tab.
* **Database State:** Sandboxed data, test supporter logs.
* **Stripe Mode:** Test Mode (uses dummy cards like `4242...`).

### 2. Production / Live
* **Live Domain:** `https://gannonwaye.com`
* **GanozMix Direct app:** `https://ganozmixdirect.base44.app`
* **Database State:** Real contributions, actual support profile updates.
* **Stripe Mode:** Live Mode (uses real cards and payments).

---

## Release safety and test gates

1. **Run the no-deploy acceptance check first.** This checks the canonical app binding, release gates, Deego safety hold, supervisor suite, source build, storefront artwork, and store rules. It does not deploy or invoke a live backend function.

   ```bash
   npm run test:acceptance
   ```

2. **Review the local preview without triggering external actions.**

   ```bash
   npm run dev
   ```

   Check navigation, release visibility, public copy, cart rendering, and responsive layout. Do not use a live checkout, social-post, email, distributor, or connector control during this step.

3. **Run a controlled owner test only after agreeing the exact fixture and expected zero-external-effect result.** The global automation safety hold stays active. A deploy does not re-enable scheduled or entity-triggered automations.

4. **Site-only production deployment is owner-controlled and preflighted.** After the above checks and Gannon's explicit action-time approval, use the repository command:

   ```bash
   npm run deploy:site
   ```

   This first runs the full no-deploy acceptance suite and deployment-truth preflight, then runs `npx base44 site deploy -y`. It deploys the hosted site only; it does **not** prove functions, workflows, entities, connectors, or authentication settings are deployed or unchanged. Do not use `npx base44 deploy`, `base44 eject`, or an unbound copy application without first reviewing the exact resource and connector difference.

5. **Read back after deployment.** Confirm the deployed site/version and public release gates. Before treating backend safeguards as live, separately verify the deployed functions, workflows, entities, and connector/auth state. Re-enable one path only after its controlled owner test has passed and its external effect is explicitly approved.
