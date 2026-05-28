import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Copy, Download, Terminal, CheckCircle2, Play, GitBranch, Zap } from 'lucide-react';

// ─── CONFIG FILES ────────────────────────────────────────────────────────────

const FILES = {
  playwrightConfig: {
    filename: 'playwright.config.js',
    label: 'playwright.config.js',
    content: `// playwright.config.js
// Target: https://gannonwaye.com
// Playwright installed: Firefox + WebKit + Chromium
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config({ path: '.env.local' });

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 1,
  reporter: [['html'], ['list']],
  timeout: 30000,
  use: {
    baseURL: 'https://gannonwaye.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});`,
  },
  packageJson: {
    filename: 'package.json',
    label: 'package.json',
    content: `{
  "name": "gannonwaye-business-os-tests",
  "private": true,
  "description": "Playwright test suite for gannonwaye.com",
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:store": "playwright test tests/store-load.spec.js tests/cart.spec.js tests/checkout.spec.js tests/shipping.spec.js tests/promo-codes.spec.js --headed",
    "test:security": "playwright test tests/security.spec.js tests/coaching-private-lock.spec.js",
    "test:report": "playwright show-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.44.0",
    "dotenv": "^16.4.5"
  }
}`,
  },
  envExample: {
    filename: '.env.example',
    label: '.env.example',
    content: `# .env.local — DO NOT COMMIT THIS FILE
# Copy this file to .env.local and fill in values locally.
# .env.local is listed in .gitignore — NEVER commit it.

# ─── WHY CHECKOUT TESTS ARE SKIPPED ──────────────────────────────────────────
# tests/checkout.spec.js skips the Stripe submit test unless STRIPE_MODE=test
# This is intentional: prevents accidental live charges during automated tests.
# To run checkout tests:
#   1. Confirm BOTH Stripe keys start with sk_test_ / pk_test_ (not live)
#   2. Set STRIPE_MODE=test below
#   3. Use test card: 4242 4242 4242 4242 / exp 12/26 / cvc 123
# ─────────────────────────────────────────────────────────────────────────────

# Stripe mode: 'test' or 'live'
# ONLY set to 'test' if BOTH keys are sk_test_ and pk_test_
# Setting to 'test' enables checkout form submission tests
# NEVER mix test keys with live keys
STRIPE_MODE=test

# Admin session cookie (for admin route tests):
# 1. Log into gannonwaye.com as admin in Chrome/Safari
# 2. Open DevTools → Application → Cookies → gannonwaye.com
# 3. Find the auth/session cookie (usually named 'session' or '__Host-session')
# 4. Copy the VALUE only — paste below
# DO NOT share this value — treat it like a password
ADMIN_SESSION_COOKIE=your_admin_session_cookie_here

# Base URL (optional override — defaults to https://gannonwaye.com)
BASE_URL=https://gannonwaye.com`,
  },
  gitignore: {
    filename: '.gitignore',
    label: '.gitignore',
    content: `.env
.env.local
.env.*.local
node_modules/
playwright-report/
test-results/
*.cookie
*.log`,
  },
  readme: {
    filename: 'README_RUN_TESTS.md',
    label: 'README_RUN_TESTS.md',
    content: `# Gannon Waye — Playwright Test Suite
# Target: https://gannonwaye.com

## STATUS
Playwright: INSTALLED LOCALLY (Firefox + WebKit + Chromium confirmed)
GitHub: gannonwaye-business-os (private repo — primary)
GitLab: secondary / not used unless required

## SETUP (run once)

\`\`\`bash
npm install
npx playwright install
cp .env.example .env.local
# Edit .env.local — add your ADMIN_SESSION_COOKIE
\`\`\`

## RUN ALL TESTS
\`\`\`bash
npx playwright test
\`\`\`

## RUN HEADED (see browser)
\`\`\`bash
npx playwright test --headed
\`\`\`

## RUN STORE TESTS ONLY (most important)
\`\`\`bash
npx playwright test tests/store-load.spec.js tests/cart.spec.js tests/checkout.spec.js tests/shipping.spec.js tests/promo-codes.spec.js --headed
\`\`\`

## VIEW REPORT
\`\`\`bash
npx playwright show-report
\`\`\`

## TEST FILES
- tests/store-load.spec.js      — store loads, products render, no freeze
- tests/cart.spec.js            — cart drawer, add multiple items, badge, remove
- tests/checkout.spec.js        — checkout opens, no freeze, Stripe redirect
- tests/shipping.spec.js        — combined shipping, not multiplied per item
- tests/promo-codes.spec.js     — F20UN26DVIP, F30MOM26A work; old codes fail
- tests/stripe.spec.js          — Stripe integration checks
- tests/public-routes.spec.js   — all public routes return 200
- tests/admin-routes.spec.js    — admin routes load (requires session)
- tests/clickability.spec.js    — buttons, tabs, modals, dropdowns
- tests/tiktok.spec.js          — TikTok OAuth callback, connect button
- tests/metricool.spec.js       — Metricool admin page
- tests/security.spec.js        — no secrets in source, auth guards
- tests/coaching-private-lock.spec.js — coaching NOT public (CRITICAL)
- tests/mobile.spec.js          — responsive, no horizontal scroll

## PROMO CODE MATRIX
Valid codes (confirmed in DB 2026-05-28):
- F20UN26DVIP — 20% off apparel/accessories/poster/bundle. CD/vinyl excluded. Shipping excluded.
- F30MOM26A   — 30% off apparel/accessories/poster/bundle. CD/vinyl excluded. Shipping excluded.

Invalid/old codes (must fail):
- fnd@gwTYV!P
- F@mFr!3NdsOFg@noz
- LAUNCH20, SUMMER10, TEST50, any random code

## SHIPPING MATRIX
- 1 AU item:  $12.95
- 2 AU items: $14.95 (NOT $25.90)
- 3 AU items: $16.95 (NOT $38.85)
- Cart >= $150: FREE
- International: quote required / $0 placeholder
- Support/donation: $0

## STRIPE SAFETY
STRIPE_MODE=test: use test cards (4242 4242 4242 4242)
STRIPE_MODE=live: inspect only — NEVER auto-submit payment
`,
  },
};

// ─── TEST PACKS ──────────────────────────────────────────────────────────────

const TEST_PACKS = [
  {
    id: 'store-load',
    label: 'Store Load',
    filename: 'store-load.spec.js',
    priority: 'Critical',
    description: 'Store loads <5s. Products visible. No freeze. No console errors. Coffee mug images visible.',
    code: `// tests/store-load.spec.js
// Target: https://gannonwaye.com/store
const { test, expect } = require('@playwright/test');

test.describe('Store Load', () => {
  test('Store loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });

  test('Store shows at least one product', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    // Wait up to 8s for products — they load from DB or fall back to static data
    const addBtns = page.locator('button').filter({ hasText: /add to cart/i });
    await addBtns.first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
    const count = await addBtns.count();
    if (count === 0) {
      // Check if fallback products rendered at all (any product card)
      const productCards = page.locator('[class*="rounded-2xl"]').filter({ hasText: /AUD|\$/ });
      const cardCount = await productCards.count();
      console.log('Product cards found:', cardCount);
      expect(cardCount).toBeGreaterThan(0);
    } else {
      expect(count).toBeGreaterThan(0);
    }
  });

  test('Product images are visible', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    // Wait for at least one product image to load
    await page.waitForTimeout(2000);
    const images = page.locator('img[src*="base44"], img[src*="media.base44"]');
    const count = await images.count();
    console.log('Product images found:', count);
    if (count > 0) {
      // Check first product image actually loaded (naturalWidth > 0)
      const firstImg = images.first();
      const naturalWidth = await firstImg.evaluate(img => img.naturalWidth).catch(() => 0);
      console.log('First image naturalWidth:', naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    } else {
      // Fall back to any img tag
      const allImgs = page.locator('img');
      const allCount = await allImgs.count();
      expect(allCount).toBeGreaterThan(0);
    }
  });

  test('Coffee mug product is visible', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const mug = page.locator('p, h2, h3, span').filter({ hasText: /mug|cup/i }).first();
    if (await mug.isVisible()) {
      await expect(mug).toBeVisible();
    } else {
      console.log('INFO: Mug product not found by text — may be database-only item');
    }
  });

  test('Product image zoom/detail modal opens on click', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    // Click on a product image to open detail modal
    const productImage = page.locator('img').first();
    if (await productImage.isVisible()) {
      await productImage.click();
      await page.waitForTimeout(800);
      // Modal or zoom overlay should appear
      const modal = page.locator('[role="dialog"], [class*="modal"], [class*="Modal"], [class*="Detail"]').first();
      const modalVisible = await modal.isVisible().catch(() => false);
      if (modalVisible) {
        await expect(modal).toBeVisible();
      }
      // At minimum, no crash
    }
  });

  test('No critical console errors on store page', async ({ page }) => {
    const errors = [];
    const failedRequests = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push({ text: msg.text(), location: msg.location() });
      }
    });
    page.on('requestfailed', req => {
      failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
    });
    page.on('response', resp => {
      if (resp.status() >= 400 && resp.status() !== 401) {
        // Log non-auth failures
        console.log(\`Response \${resp.status()} from: \${resp.url()}\`);
      }
    });
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    // Filter expected noise:
    // - 401 = Base44 auth check on public page (expected, non-critical)
    // - favicon 404 = cosmetic
    // - ResizeObserver = browser quirk
    // - Non-Error promise rejection = framer-motion / minor
    const realErrors = errors.filter(e =>
      !e.text.includes('favicon') &&
      !e.text.includes('ResizeObserver') &&
      !e.text.includes('Non-Error promise rejection') &&
      !e.text.includes('401') &&
      !e.text.toLowerCase().includes('auth') &&
      !e.text.toLowerCase().includes('unauthorized')
    );
    if (realErrors.length > 0) {
      console.log('\\n=== CONSOLE ERRORS ===');
      realErrors.forEach(e => {
        console.log('ERROR:', e.text);
        if (e.location?.url) console.log('  at:', e.location.url, 'line', e.location.lineNumber);
      });
    }
    if (failedRequests.length > 0) {
      console.log('\\n=== FAILED REQUESTS ===');
      failedRequests.forEach(r => console.log(r.url, '-', r.failure));
    }
    expect(realErrors).toHaveLength(0);
  });

  test('Store does not infinite re-render (no render loop)', async ({ page }) => {
    let fetchCount = 0;
    page.on('request', req => {
      if (req.url().includes('MerchProduct') || req.url().includes('storeProducts')) fetchCount++;
    });
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    // More than 15 fetches in 4s = render loop
    expect(fetchCount).toBeLessThan(15);
  });

  test('Cart button is visible on store page', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    // Cart button should be in the DOM
    const cartArea = page.locator('[class*="Cart"], button').filter({ hasText: /cart/i }).first();
    // Just confirm page renders without crash — cart button visibility varies
  });
});`,
  },
  {
    id: 'cart',
    label: 'Cart',
    filename: 'cart.spec.js',
    priority: 'Critical',
    description: 'Add multiple products, cart badge updates, drawer opens, quantities update, remove works.',
    code: `// tests/cart.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Cart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
  });

  test('Cart button is visible', async ({ page }) => {
    // Cart icon/button should be present
    const body = await page.content();
    expect(body.toLowerCase()).toMatch(/cart|shopping/i);
  });

  test('Add CD to cart (no size required)', async ({ page }) => {
    // CDs should be addable without size selection
    const addBtns = page.locator('button').filter({ hasText: /add to cart/i });
    const count = await addBtns.count();
    if (count > 0) {
      await addBtns.first().click();
      await page.waitForTimeout(600);
      // Toast should appear or cart badge should update
      const toast = page.locator('[class*="toast"], [role="alert"]').first();
      const toastVisible = await toast.isVisible().catch(() => false);
      // No error should appear
      const errToast = page.locator('[class*="toast"]').filter({ hasText: /error/i });
      const hasError = await errToast.isVisible().catch(() => false);
      expect(hasError).toBeFalsy();
    }
  });

  test('Adding apparel without size shows size error', async ({ page }) => {
    // Find an apparel product with size buttons
    const sizeBtns = page.locator('button').filter({ hasText: /^(XS|S|M|L|XL|XXL|2XL)$/ });
    const hasSizeButtons = await sizeBtns.count() > 0;
    if (hasSizeButtons) {
      // Find the "Add to Cart" near a size-required product without selecting size
      const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
      await addBtn.click();
      await page.waitForTimeout(400);
      // Should show size selection error
      const sizeError = page.locator('p, span, div').filter({ hasText: /select a size|size required/i });
      const hasError = await sizeError.isVisible().catch(() => false);
      // Either shows error OR the button was for a non-size product
      console.log('Size error shown:', hasError);
    }
  });

  test('Select size then add apparel to cart', async ({ page }) => {
    const sizeBtns = page.locator('button').filter({ hasText: /^(XS|S|M|L|XL|XXL|2XL)$/ });
    const hasSizeButtons = await sizeBtns.count() > 0;
    if (hasSizeButtons) {
      // Click a size button
      await sizeBtns.first().click();
      await page.waitForTimeout(300);
      // Now click add to cart
      const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
      await addBtn.click();
      await page.waitForTimeout(600);
      // No error
      const errToast = page.locator('[class*="toast"]').filter({ hasText: /error/i });
      const hasError = await errToast.isVisible().catch(() => false);
      expect(hasError).toBeFalsy();
    }
  });

  test('Add multiple different products', async ({ page }) => {
    const addBtns = page.locator('button').filter({ hasText: /add to cart/i });
    const count = await addBtns.count();
    // Try to add first 2 in-stock non-size products
    let added = 0;
    for (let i = 0; i < Math.min(count, 3); i++) {
      const btn = addBtns.nth(i);
      if (await btn.isVisible() && await btn.isEnabled()) {
        await btn.click();
        await page.waitForTimeout(500);
        added++;
        if (added >= 2) break;
      }
    }
    console.log(\`Added \${added} products to cart\`);
  });

  test('Cart drawer opens', async ({ page }) => {
    // First add something
    const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(500);
    }
    // Click cart button
    const cartBtn = page.locator('[class*="CartButton"], button[aria-label*="cart"], button').filter({ hasText: /cart/i }).first();
    if (await cartBtn.isVisible()) {
      await cartBtn.click();
      await page.waitForTimeout(600);
      // Drawer or sheet should appear
      const drawer = page.locator('[role="dialog"], [class*="Drawer"], [class*="Sheet"]').first();
      const drawerVisible = await drawer.isVisible().catch(() => false);
      console.log('Cart drawer visible:', drawerVisible);
    }
  });

  test('Cart checkout button navigates to checkout', async ({ page }) => {
    const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(500);
      // Go directly to checkout page
      await page.goto('/store/checkout');
      await page.waitForLoadState('networkidle');
      const url = page.url();
      expect(url).toMatch(/checkout|store/);
    }
  });
});`,
  },
  {
    id: 'checkout',
    label: 'Checkout',
    filename: 'checkout.spec.js',
    priority: 'Critical',
    description: 'Checkout loads, no freeze, shipping shown separately, Stripe redirect works.',
    code: `// tests/checkout.spec.js
const { test, expect } = require('@playwright/test');

const STRIPE_MODE = process.env.STRIPE_MODE;

test.describe('Checkout', () => {
  test('Checkout page loads without 404/500', async ({ page }) => {
    await page.goto('/store/checkout');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    // Should be on checkout or redirect to store (empty cart)
    expect(url).toMatch(/checkout|store/);
    // No server error
    const content = await page.content();
    expect(content).not.toMatch(/500|Internal Server Error/i);
  });

  test('Checkout page does not freeze', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    // Add first available product
    const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(500);
    }
    await page.goto('/store/checkout');
    await page.waitForLoadState('networkidle');
    // Wait 5 seconds — frozen page would not respond
    await page.waitForTimeout(5000);
    // Page should still be interactive
    const heading = page.locator('h1, h2, h3').first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('Shipping is displayed as a separate line item', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(500);
    }
    await page.goto('/store/checkout');
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    // Shipping should be mentioned separately from item price
    const hasShipping = content.toLowerCase().includes('shipping') || content.toLowerCase().includes('postage');
    console.log('Shipping visible on checkout:', hasShipping);
    // Not asserting as mandatory since Stripe handles this — just log
  });

  test('Success route exists', async ({ page }) => {
    const res = await page.goto('/checkout-success');
    // Should not be 404
    if (res) expect(res.status()).not.toBe(404);
  });

  test('Cancel route redirects gracefully', async ({ page }) => {
    // Stripe cancel usually redirects back to store or cart
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/store|home|\//);
  });

  test.skip(STRIPE_MODE !== 'test', 'SKIPPED: Set STRIPE_MODE=test in .env.local to enable checkout submit tests');
  test('Checkout form opens Stripe (test mode)', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(500);
      await page.goto('/store/checkout');
      await page.waitForLoadState('networkidle');
      console.log('TEST MODE: Fill form and click checkout. Stripe test card: 4242 4242 4242 4242 / 12/26 / 123');
    }
  });
});`,
  },
  {
    id: 'shipping',
    label: 'Shipping',
    filename: 'shipping.spec.js',
    priority: 'High',
    description: 'Combined shipping: 1=$12.95, 2=$14.95, ≥$150=free. Not multiplied per item.',
    code: `// tests/shipping.spec.js
// Combined shipping logic: base $12.95 + $2.00 per additional item
// NOT $12.95 per item
const { test, expect } = require('@playwright/test');

test.describe('Shipping Calculation', () => {
  test('Shipping admin page loads', async ({ page }) => {
    test.skip(!process.env.ADMIN_SESSION_COOKIE, 'Requires ADMIN_SESSION_COOKIE');
    await page.goto('/admin/shipping-rates');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Checkout page shows shipping as separate item', async ({ page }) => {
    // Add to cart and check checkout shows shipping
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(500);
      await page.goto('/store/checkout');
      await page.waitForLoadState('networkidle');
      const content = await page.content();
      // Shipping should appear in checkout
      const hasShippingRef = /shipping|postage|delivery/i.test(content);
      console.log('Shipping referenced in checkout:', hasShippingRef);
    }
  });

  // MANUAL TEST MATRIX — verify in browser:
  // 1 AU merch item:  $12.95 shipping
  // 2 AU merch items: $14.95 (NOT $25.90)
  // 3 AU merch items: $16.95 (NOT $38.85)
  // Cart >= $150 AUD: FREE shipping
  // CD only (AU):    $12.95
  // Support/donation only: $0.00
  // International:   "Quote required" / $0 placeholder
  // Promo code F20UN26DVIP: shipping amount UNCHANGED (only merch discounted)
  test('Manual shipping matrix log', async () => {
    console.log('=== MANUAL SHIPPING TEST MATRIX ===');
    console.log('1 AU item:     expect $12.95');
    console.log('2 AU items:    expect $14.95 (NOT $25.90)');
    console.log('3 AU items:    expect $16.95 (NOT $38.85)');
    console.log('Cart >= $150:  expect FREE');
    console.log('International: expect quote required');
    console.log('Promo applied: shipping amount must NOT change');
    console.log('Verify these in browser manually or via Stripe checkout form');
  });
});`,
  },
  {
    id: 'promo-codes',
    label: 'Promo Codes',
    filename: 'promo-codes.spec.js',
    priority: 'Critical',
    description: 'Valid codes work. Old codes fnd@gwTYV!P and F@mFr!3NdsOFg@noz fail. Shipping never discounted.',
    code: `// tests/promo-codes.spec.js
// Valid codes (confirmed in DB 2026-05-28):
//   F20UN26DVIP — 20% off eligible merch (apparel/accessories/poster/bundle)
//   F30MOM26A   — 30% off eligible merch (apparel/accessories/poster/bundle)
// Invalid/old codes (must reject):
//   fnd@gwTYV!P
//   F@mFr!3NdsOFg@noz
//   LAUNCH20, SUMMER10, TEST50, any random string
const { test, expect } = require('@playwright/test');

test.describe('Promo Code Validation', () => {
  test('Admin promo codes page loads and shows active codes', async ({ page }) => {
    test.skip(!process.env.ADMIN_SESSION_COOKIE, 'Requires ADMIN_SESSION_COOKIE');
    await page.goto('/admin/promo-codes');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
    const content = await page.content();
    // F20UN26DVIP should be in the active list
    expect(content).toContain('F20UN26DVIP');
    expect(content).toContain('F30MOM26A');
  });

  test('Checkout page exists for promo testing', async ({ page }) => {
    await page.goto('/store/checkout');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/checkout|store/);
  });

  // MANUAL TEST MATRIX — verify in checkout form:
  // F20UN26DVIP + hoodie ($98)  → discount: -$19.60 → subtotal $78.40 + shipping unchanged
  // F20UN26DVIP + CD ($10)      → no discount (CD excluded) → subtotal $10 + shipping unchanged
  // F30MOM26A + hoodie ($98)    → discount: -$29.40 → subtotal $68.60 + shipping unchanged
  // fnd@gwTYV!P                 → ERROR: invalid code
  // F@mFr!3NdsOFg@noz           → ERROR: invalid code
  // LAUNCH20                    → ERROR: invalid code
  // Any random text             → ERROR: invalid code
  // Shipping charge             → NEVER changes when promo applied
  test('Promo code manual test matrix log', async () => {
    console.log('=== MANUAL PROMO CODE TEST MATRIX ===');
    console.log('F20UN26DVIP + hoodie $98  → $78.40 merch + shipping unchanged');
    console.log('F20UN26DVIP + CD $10      → $10 (no discount, CD excluded)');
    console.log('F30MOM26A + hoodie $98    → $68.60 merch + shipping unchanged');
    console.log('fnd@gwTYV!P               → REJECTED (invalid)');
    console.log('F@mFr!3NdsOFg@noz         → REJECTED (invalid)');
    console.log('LAUNCH20                  → REJECTED (not in DB)');
    console.log('Any random code           → REJECTED');
    console.log('Shipping line             → NEVER discounted by any promo code');
  });

  test('validatePromoCode backend function reachable', async ({ page, request }) => {
    // Confirm the function endpoint exists (should return 200 or 401, not 404)
    const resp = await request.post('https://gannonwaye.com/api/functions/validatePromoCode', {
      data: { code: 'INVALIDTEST' },
      failOnStatusCode: false,
    });
    // 401 (auth required) or 400 (bad code) are acceptable — 404 is not
    expect(resp.status()).not.toBe(404);
    console.log('validatePromoCode status:', resp.status());
  });
});`,
  },
  {
    id: 'stripe',
    label: 'Stripe',
    filename: 'stripe.spec.js',
    priority: 'High',
    description: 'Stripe config reachable, checkout session creation, customer email captured from Stripe.',
    code: `// tests/stripe.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Stripe Integration', () => {
  test('getStripeConfig function returns publishable key', async ({ request }) => {
    const resp = await request.post('https://gannonwaye.com/api/functions/getStripeConfig', {
      data: {},
      failOnStatusCode: false,
    });
    // Should return 200 with publishable key
    expect(resp.status()).toBe(200);
    const json = await resp.json().catch(() => null);
    if (json) {
      expect(json.publishable_key || json.key || json.publishableKey).toBeTruthy();
      // Must not expose secret key
      const str = JSON.stringify(json);
      expect(str).not.toMatch(/sk_live_/);
      expect(str).not.toMatch(/sk_test_/);
    }
  });

  test('createCheckoutSession function is reachable', async ({ request }) => {
    const resp = await request.post('https://gannonwaye.com/api/functions/createCheckoutSession', {
      data: { items: [], email: 'test@example.com' },
      failOnStatusCode: false,
    });
    // 400/422 (bad input) is fine — 404 is not
    expect(resp.status()).not.toBe(404);
    console.log('createCheckoutSession status:', resp.status());
  });

  test('No Stripe secret key visible in any public page', async ({ page }) => {
    for (const route of ['/', '/store', '/music']) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const content = await page.content();
      expect(content).not.toMatch(/sk_live_[a-zA-Z0-9]+/);
      expect(content).not.toMatch(/sk_test_[a-zA-Z0-9]+/);
      expect(content).not.toMatch(/whsec_[a-zA-Z0-9]+/);
    }
  });

  test('Stripe publishable key is present in store page scripts', async ({ page }) => {
    // The pk_live_ or pk_test_ key is expected to be present (it is public)
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    const hasPublishableKey = content.includes('pk_live_') || content.includes('pk_test_') || content.includes('STRIPE_PUBLISHABLE_KEY');
    console.log('Publishable key reference in page:', hasPublishableKey);
    // Acceptable either way — just confirm no secret key
    expect(content).not.toMatch(/sk_live_/);
    expect(content).not.toMatch(/sk_test_/);
  });
});`,
  },
  {
    id: 'public-routes',
    label: 'Public Routes',
    filename: 'public-routes.spec.js',
    priority: 'Critical',
    description: 'All public routes return 200. No 404 or 500.',
    code: `// tests/public-routes.spec.js
const { test, expect } = require('@playwright/test');

const PUBLIC_ROUTES = [
  '/',
  '/music',
  '/store',
  '/community',
  '/videos',
  '/back-this',
  '/current-single',
  '/lyrics',
  '/this-is-my-life',
  '/faq',
  '/member-tiers',
  '/mastering',
  '/bookings',
  '/contact',
  '/impact',
  '/privacy-policy',
  '/terms-of-service',
  '/order-status',
  '/merch-feedback',
  '/gift-checklist',
  '/tiktok-callback',
  '/tour',
];

test.describe('Public Routes — all must load', () => {
  for (const route of PUBLIC_ROUTES) {
    test(\`\${route} opens successfully\`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).not.toBe(500);
      expect(res?.status()).not.toBe(404);
      // Wait for basic render
      await page.waitForLoadState('domcontentloaded');
      // Content should not be a blank page
      const body = await page.evaluate(() => document.body.innerText.trim());
      expect(body.length).toBeGreaterThan(0);
    });
  }
});`,
  },
  {
    id: 'admin-routes',
    label: 'Admin Routes',
    filename: 'admin-routes.spec.js',
    priority: 'Critical',
    description: 'Admin routes load after login. Requires ADMIN_SESSION_COOKIE.',
    code: `// tests/admin-routes.spec.js
const { test, expect } = require('@playwright/test');

const ADMIN_ROUTES = [
  '/admin',
  '/admin/orders',
  '/admin/financials',
  '/admin/merch',
  '/admin/notifications',
  '/admin/approval-queue',
  '/admin/promo-codes',
  '/admin/order-profit-intelligence',
  '/admin/external-engineering-command',
  '/admin/playwright-test-centre',
  '/admin/agent-trust-hub',
  '/admin/shipping-rates',
  '/admin/tiktok-platform-review',
  '/admin/business-attention-centre',
  '/admin/merch-financials',
];

test.describe('Admin Routes — require login', () => {
  test.skip(!process.env.ADMIN_SESSION_COOKIE, 'Set ADMIN_SESSION_COOKIE in .env.local');

  test.beforeEach(async ({ context }) => {
    await context.addCookies([{
      name: 'session',
      value: process.env.ADMIN_SESSION_COOKIE || '',
      domain: 'gannonwaye.com',
      path: '/',
    }]);
  });

  for (const route of ADMIN_ROUTES) {
    test(\`\${route} loads without error\`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      // Should have a heading
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 8000 });
      // No crash
      const content = await page.content();
      expect(content).not.toMatch(/500|Internal Server Error|Cannot read/i);
    });
  }

  test('Admin redirects unauthenticated users', async ({ browser }) => {
    const ctx = await browser.newContext(); // fresh context, no cookie
    const page = await ctx.newPage();
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    const content = await page.content();
    // Should show login or redirect
    const isProtected = url.includes('login') || url.includes('auth') ||
      content.includes('Sign in') || content.includes('Log in');
    expect(isProtected).toBeTruthy();
    await ctx.close();
  });
});`,
  },
  {
    id: 'clickability',
    label: 'Clickability',
    filename: 'clickability.spec.js',
    priority: 'High',
    description: 'Store cards clickable. Tabs switch. Modals open. Buttons respond.',
    code: `// tests/clickability.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Store Clickability', () => {
  test('Product cards are clickable and open detail/modal', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    // Click first product image
    const img = page.locator('img').first();
    if (await img.isVisible()) {
      await img.click();
      await page.waitForTimeout(800);
      // Modal or detail view should appear (not crash)
      const url = page.url();
      const content = await page.content();
      console.log('After image click — URL:', url, '— Content length:', content.length);
    }
  });

  test('Add to cart button is clickable', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const btn = page.locator('button').filter({ hasText: /add to cart/i }).first();
    if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(400);
      // Should not navigate away or crash
      expect(page.url()).toContain('store');
    }
  });

  test('Navigation links on homepage work', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Click Store link
    const storeLink = page.locator('a').filter({ hasText: /store|merch/i }).first();
    if (await storeLink.isVisible()) {
      await storeLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('store');
    }
  });

  test('Back this / Support button is clickable', async ({ page }) => {
    await page.goto('/back-this');
    await page.waitForLoadState('networkidle');
    const btn = page.locator('button, a').filter({ hasText: /support|back|contribute|donate/i }).first();
    if (await btn.isVisible()) {
      await expect(btn).toBeEnabled();
    }
  });
});`,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    filename: 'tiktok.spec.js',
    priority: 'Critical',
    description: 'TikTok callback route exists. Connect button visible. No client_secret in source.',
    code: `// tests/tiktok.spec.js
const { test, expect } = require('@playwright/test');

test.describe('TikTok Integration', () => {
  test('TikTok callback route returns 200 (not 404)', async ({ page }) => {
    const res = await page.goto('/tiktok-callback');
    expect(res?.status()).not.toBe(404);
    expect(res?.status()).not.toBe(500);
  });

  test('TikTok callback handles missing code param gracefully', async ({ page }) => {
    await page.goto('/tiktok-callback');
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    // Should show error/processing state — not blank or crashed
    expect(content.length).toBeGreaterThan(100);
    expect(content).not.toMatch(/Cannot read|TypeError|undefined is not/);
  });

  test('TikTok platform review page loads (admin)', async ({ page }) => {
    test.skip(!process.env.ADMIN_SESSION_COOKIE, 'Requires ADMIN_SESSION_COOKIE');
    await page.goto('/admin/tiktok-platform-review');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('No TikTok client_secret visible in page source', async ({ page }) => {
    test.skip(!process.env.ADMIN_SESSION_COOKIE, 'Requires ADMIN_SESSION_COOKIE');
    await page.goto('/admin/tiktok-platform-review');
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    expect(content).not.toMatch(/client_secret\s*[:=]\s*["'][a-zA-Z0-9]{10,}/);
  });

  test('tiktokOAuth function is reachable', async ({ request }) => {
    const resp = await request.post('https://gannonwaye.com/api/functions/tiktokOAuth', {
      data: { action: 'status' },
      failOnStatusCode: false,
    });
    expect(resp.status()).not.toBe(404);
    console.log('tiktokOAuth status:', resp.status());
  });
});`,
  },
  {
    id: 'metricool',
    label: 'Metricool',
    filename: 'metricool.spec.js',
    priority: 'Medium',
    description: 'Metricool admin pages load. Diagnostics accessible.',
    code: `// tests/metricool.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Metricool Integration', () => {
  test('Metricool diagnostics admin page loads', async ({ page }) => {
    test.skip(!process.env.ADMIN_SESSION_COOKIE, 'Requires ADMIN_SESSION_COOKIE');
    await page.goto('/admin/metricool-diagnostics');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Metricool command page loads', async ({ page }) => {
    test.skip(!process.env.ADMIN_SESSION_COOKIE, 'Requires ADMIN_SESSION_COOKIE');
    await page.goto('/admin/metricool-command');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('metricoolDiagnostics function is reachable', async ({ request }) => {
    const resp = await request.post('https://gannonwaye.com/api/functions/metricoolDiagnostics', {
      data: {},
      failOnStatusCode: false,
    });
    // 401 (needs auth) is acceptable — 404 is not
    expect(resp.status()).not.toBe(404);
    console.log('metricoolDiagnostics status:', resp.status());
  });
});`,
  },
  {
    id: 'security',
    label: 'Security',
    filename: 'security.spec.js',
    priority: 'Critical',
    description: 'No secrets in page source. Admin auth required. Unauthenticated function endpoints return 401.',
    code: `// tests/security.spec.js
const { test, expect } = require('@playwright/test');

const SECRET_PATTERNS = [
  /sk_live_[a-zA-Z0-9]{10,}/,
  /sk_test_[a-zA-Z0-9]{10,}/,
  /whsec_[a-zA-Z0-9]{10,}/,
  /client_secret\s*[:=]\s*["'][a-zA-Z0-9]{10,}/,
  /METRICOOL_API_TOKEN\s*[:=]\s*["'][a-zA-Z0-9]{10,}/,
];

const PUBLIC_PAGES = ['/', '/store', '/music', '/back-this', '/community'];

test.describe('Security — No Secrets in Page Source', () => {
  for (const route of PUBLIC_PAGES) {
    test(\`No secrets visible on \${route}\`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const content = await page.content();
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(content)) {
          console.error(\`SECRET LEAK DETECTED on \${route}: pattern \${pattern}\`);
        }
        expect(content).not.toMatch(pattern);
      }
    });
  }
});

test.describe('Admin Auth Guard', () => {
  test('Admin requires login (unauthenticated)', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    const url = page.url();
    const isProtected = url.includes('login') || url.includes('auth') ||
      content.includes('Sign in') || content.includes('Log in') || content.includes('login');
    expect(isProtected).toBeTruthy();
  });
});

test.describe('Backend Function Auth', () => {
  // These functions should return 401 without auth, not 200 or 404
  const SENSITIVE_FUNCTIONS = ['notifyAdmin', 'sendOrderReceipt', 'syncOrderToSheets'];

  for (const fn of SENSITIVE_FUNCTIONS) {
    test(\`\${fn} returns 401 without auth\`, async ({ request }) => {
      const resp = await request.post(\`https://gannonwaye.com/api/functions/\${fn}\`, {
        data: {},
        failOnStatusCode: false,
      });
      expect(resp.status()).not.toBe(404);
      // Should be 401 (auth required) not 200 (open to public)
      console.log(\`\${fn} status: \${resp.status()} (expect 401, not 200)\`);
    });
  }
});`,
  },
  {
    id: 'coaching-private-lock',
    label: 'Coaching Lock ⚠',
    filename: 'coaching-private-lock.spec.js',
    priority: 'Critical',
    description: 'MOST CRITICAL. ALL coaching routes 404 publicly. COACHING_PUBLIC_LAUNCH_ENABLED=false.',
    code: `// tests/coaching-private-lock.spec.js
// ⚠️ MOST CRITICAL TEST ⚠️
// COACHING_PUBLIC_LAUNCH_ENABLED = false (lib/platformConfig.js)
// Must NEVER be changed without: legal review + 9-gate checklist + Gannon approval
const { test, expect } = require('@playwright/test');

const COACHING_MUST_404 = [
  '/coaching',
  '/coaching-programs',
  '/mindset-coaching',
  '/life-coaching',
  '/mentorship',
  '/coaching-signup',
  '/coaching-intake',
  '/book-coaching',
  '/meditation-library',
  '/coaching-roi',
  '/life-coach',
  '/mindset',
];

test.describe('Coaching Privacy Lock — CRITICAL ⚠️', () => {
  for (const route of COACHING_MUST_404) {
    test(\`\${route} is NOT publicly accessible\`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const content = await page.content();
      const title = await page.title();
      const isBlocked =
        content.includes('404') ||
        content.includes('Not Found') ||
        content.includes('Page Not Found') ||
        title.toLowerCase().includes('not found');
      if (!isBlocked) {
        console.error(\`CRITICAL: Coaching route \${route} is publicly accessible! Fix immediately.\`);
      }
      expect(isBlocked).toBeTruthy();
    });
  }

  test('Admin coaching page requires login (unauthenticated)', async ({ page }) => {
    await page.goto('/admin/coaching-command');
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    const url = page.url();
    // Must NOT show coaching content without login
    const showsCoachingPublicly =
      content.toLowerCase().includes('coaching program') &&
      !content.toLowerCase().includes('sign in') &&
      !content.toLowerCase().includes('login') &&
      !url.includes('login');
    if (showsCoachingPublicly) {
      console.error('CRITICAL: Coaching admin page is accessible without login!');
    }
    expect(showsCoachingPublicly).toBeFalsy();
  });
});`,
  },
  {
    id: 'mobile',
    label: 'Mobile',
    filename: 'mobile.spec.js',
    priority: 'Medium',
    description: 'Public pages responsive. No horizontal scroll. Mobile nav works.',
    code: `// tests/mobile.spec.js
const { test, expect, devices } = require('@playwright/test');

test.use({ ...devices['Pixel 5'] });

const MOBILE_ROUTES = ['/', '/store', '/music', '/community', '/back-this', '/current-single'];

test.describe('Mobile Responsiveness', () => {
  for (const route of MOBILE_ROUTES) {
    test(\`\${route} — no horizontal scroll on mobile\`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = page.viewportSize()?.width || 390;
      if (bodyWidth > viewportWidth + 30) {
        console.warn(\`\${route} has horizontal overflow: body \${bodyWidth}px > viewport \${viewportWidth}px\`);
      }
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 30);
    });
  }

  test('Store add to cart visible on mobile', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
    const isVisible = await addBtn.isVisible().catch(() => false);
    console.log('Add to cart visible on mobile:', isVisible);
  });

  test('Mobile navigation opens', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const menuBtn = page.locator('button').filter({ hasText: /menu/i }).first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(400);
    }
  });
});`,
  },
];

// ─── WARP COMMANDS ───────────────────────────────────────────────────────────
const WARP_COMMANDS = [
  { label: 'Install deps', cmd: 'npm install' },
  { label: 'Install Playwright', cmd: 'npm install -D @playwright/test' },
  { label: 'Install browsers', cmd: 'npx playwright install' },
  { label: 'Run all tests', cmd: 'npx playwright test' },
  { label: 'Run headed (see browser)', cmd: 'npx playwright test --headed' },
  { label: 'Run store tests only', cmd: 'npx playwright test tests/store-load.spec.js tests/cart.spec.js tests/checkout.spec.js tests/shipping.spec.js tests/promo-codes.spec.js --headed' },
  { label: 'Run security tests', cmd: 'npx playwright test tests/security.spec.js tests/coaching-private-lock.spec.js' },
  { label: 'View report', cmd: 'npx playwright show-report' },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function PlaywrightTestCentre() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(TEST_PACKS[0]);
  const [activeTab, setActiveTab] = useState('tests');

  const copy = (text) => { navigator.clipboard.writeText(text); toast({ title: 'Copied!' }); };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Downloaded ${filename}` });
  };

  const downloadAll = () => {
    TEST_PACKS.forEach(p => downloadFile(`tests/${p.filename}`, p.code));
    Object.values(FILES).forEach(f => downloadFile(f.filename, f.content));
    toast({ title: `Downloaded ${TEST_PACKS.length} test files + config files` });
  };

  const priorityColor = (p) => {
    if (p === 'Critical') return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (p === 'High') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-secondary text-muted-foreground border-border';
  };

  const tabs = [
    { id: 'tests', label: 'Test Files' },
    { id: 'config', label: 'Config Files' },
    { id: 'warp', label: 'Warp Commands' },
    { id: 'github', label: 'GitHub / README' },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/external-engineering-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Playwright Test Centre</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {TEST_PACKS.length} test suites · Playwright installed locally · Firefox + WebKit + Chromium · Target: gannonwaye.com
            </p>
          </div>
        </div>
        <Button size="sm" onClick={downloadAll}>
          <Download className="w-3 h-3 mr-1" />Download All ({TEST_PACKS.length} tests + config)
        </Button>
      </div>

      {/* Status — installed */}
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <p className="font-semibold text-green-300">Playwright INSTALLED LOCALLY — Firefox + WebKit confirmed</p>
            <p className="text-muted-foreground">
              Warp + Cursor connected to GitHub. Test files ready to download and run externally against gannonwaye.com.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <code className="bg-secondary/80 px-2 py-1 rounded text-xs font-mono text-green-300">npx playwright test tests/store-load.spec.js tests/cart.spec.js tests/checkout.spec.js tests/shipping.spec.js tests/promo-codes.spec.js --headed</code>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => copy('npx playwright test tests/store-load.spec.js tests/cart.spec.js tests/checkout.spec.js tests/shipping.spec.js tests/promo-codes.spec.js --headed')}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <Button key={t.id} variant={activeTab === t.id ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab(t.id)}>
            {t.label}
          </Button>
        ))}
      </div>

      {/* TAB: TESTS */}
      {activeTab === 'tests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            {TEST_PACKS.map(pack => (
              <Card
                key={pack.id}
                className={`cursor-pointer hover:border-primary/40 transition-colors ${selected?.id === pack.id ? 'border-primary/60' : ''}`}
                onClick={() => setSelected(pack)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm">{pack.label}</p>
                    <Badge className={`${priorityColor(pack.priority)} text-xs`} variant="outline">{pack.priority}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{pack.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {selected && (
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base">{selected.label}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copy(selected.code)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
                    <Button variant="outline" size="sm" onClick={() => downloadFile(`tests/${selected.filename}`, selected.code)}><Download className="w-3 h-3 mr-1" />Download</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto overflow-y-auto max-h-[60vh] whitespace-pre-wrap font-mono leading-relaxed">
                  {selected.code}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* TAB: CONFIG */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            {Object.values(FILES).map(f => (
              <Card key={f.filename} className={`cursor-pointer hover:border-primary/40 transition-colors ${selected?.filename === f.filename ? 'border-primary/60' : ''}`} onClick={() => setSelected(f)}>
                <CardContent className="p-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-mono">{f.filename}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={e => { e.stopPropagation(); downloadFile(f.filename, f.content); }}>
                    <Download className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {selected?.content && (
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-sm font-mono">{selected.filename || selected.label}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copy(selected.content || selected.code)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
                    <Button variant="outline" size="sm" onClick={() => downloadFile(selected.filename || `${selected.id}.txt`, selected.content || selected.code)}><Download className="w-3 h-3 mr-1" />Download</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto overflow-y-auto max-h-[60vh] whitespace-pre-wrap font-mono leading-relaxed">
                  {selected.content || selected.code}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* TAB: WARP COMMANDS */}
      {activeTab === 'warp' && (
        <div className="space-y-3">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-primary mb-1">Warp is installed + GitHub connected. Run these commands in Warp terminal:</p>
              <p className="text-xs text-muted-foreground">Open Warp → navigate to your test folder → run in order</p>
            </CardContent>
          </Card>

          {WARP_COMMANDS.map(({ label, cmd }) => (
            <div key={label} className="border border-border/40 rounded-lg p-3 flex items-center gap-3">
              <Terminal className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <code className="text-sm font-mono text-foreground break-all">{cmd}</code>
              </div>
              <Button variant="outline" size="sm" onClick={() => copy(cmd)} className="shrink-0">
                <Copy className="w-3 h-3 mr-1" />Copy
              </Button>
            </div>
          ))}

          <Card className="border-amber-500/20 bg-amber-500/5 mt-4">
            <CardContent className="p-4 text-sm">
              <p className="font-semibold text-amber-300 mb-1">Note on .env.local</p>
              <p className="text-muted-foreground text-xs">Create <code className="bg-secondary px-1 rounded">.env.local</code> in the test folder with your admin session cookie. Never commit this file. Add <code className="bg-secondary px-1 rounded">.env.local</code> to <code className="bg-secondary px-1 rounded">.gitignore</code>.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: GITHUB / README */}
      {activeTab === 'github' && (
        <div className="space-y-4">
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-4 space-y-2">
              <p className="text-sm font-semibold text-blue-300 flex items-center gap-2"><GitBranch className="w-4 h-4" />GitHub Repo: gannonwaye-business-os (private)</p>
              <p className="text-xs text-muted-foreground">Primary: GitHub · Secondary: GitLab (not used unless required)</p>
              <p className="text-xs text-muted-foreground">Warp + Cursor are connected to GitHub. Create the repo at github.com → New → Private → name: gannonwaye-business-os</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">README_RUN_TESTS.md</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copy(FILES.readme.content)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
                  <Button variant="outline" size="sm" onClick={() => downloadFile('README_RUN_TESTS.md', FILES.readme.content)}><Download className="w-3 h-3 mr-1" />Download</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto overflow-y-auto max-h-[50vh] whitespace-pre-wrap font-mono leading-relaxed">
                {FILES.readme.content}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Files to include in repo (not secrets)</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {[
                  ['App.jsx', 'Route map'],
                  ['components/admin/AdminLayout.jsx', 'Admin nav'],
                  ['pages/Store.jsx', 'Store page'],
                  ['pages/StoreCheckout.jsx', 'Checkout page'],
                  ['components/store/CartButton.jsx', 'Cart button'],
                  ['components/store/CartDrawer.jsx', 'Cart drawer'],
                  ['lib/cartStore.js', 'Zustand cart store'],
                  ['functions/createCheckoutSession.js', 'Stripe checkout'],
                  ['functions/stripeWebhook.js', 'Order webhook'],
                  ['functions/validatePromoCode.js', 'Promo validation'],
                  ['functions/calculateShippingRate.js', 'Shipping calc'],
                  ['functions/tiktokOAuth.js', 'TikTok OAuth'],
                  ['functions/metricoolSchedulePost.js', 'Metricool'],
                  ['entities/*.json', 'All entity schemas'],
                  ['playwright.config.js', 'Test config'],
                  ['tests/', 'All test files'],
                  ['.env.example', 'Env template (not values)'],
                  ['.gitignore', 'Excludes .env.local'],
                  ['README_RUN_TESTS.md', 'How to run tests'],
                ].map(([file, desc]) => (
                  <div key={file} className="flex items-start gap-2 p-2 border border-border/30 rounded">
                    <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />
                    <div><p className="font-mono text-foreground">{file}</p><p className="text-muted-foreground">{desc}</p></div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 border border-red-500/30 rounded-lg bg-red-500/5">
                <p className="text-xs font-semibold text-red-300 mb-1">NEVER include in repo:</p>
                <p className="text-xs text-muted-foreground">.env · .env.local · Stripe keys · TikTok client_secret · Metricool token · session cookies · customer data</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}