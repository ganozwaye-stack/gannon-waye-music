# Staging vs Production Environment Guide

To prevent broken code, payment errors, and broken layouts on the live site, follow this deployment guide.

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

## 🚦 Deployment Gate Rules

1. **Verify Local Compiles First:** Never push code directly without verifying that it builds on your computer. Run:
   ```bash
   npm run build
   ```
2. **Review Changes in Local Browser:** Open `http://localhost:5173` and test:
   * Navbar click targets.
   * Add to Cart checkout fields.
   * Live Tipping Modal opening and fields rendering.
3. **Run Staging Check:** Verify that test orders pass using Stripe Test mode coordinates before updating live keys.
4. **Owner Approval Gate:** Real payment tests (with real money) require your explicit owner sign-off.
5. **Deploy Commands:**
   ```bash
   npx base44 deploy
   ```
   This takes the local compiled files and publishes them to the live production server.
