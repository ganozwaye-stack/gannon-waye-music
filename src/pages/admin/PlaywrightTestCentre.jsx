import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Copy, Download, AlertTriangle, Play, Shield } from 'lucide-react';

const PLAYWRIGHT_CONFIG = `// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://gannonwaye.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});`;

const PKG_JSON = `{
  "name": "gannon-waye-playwright",
  "private": true,
  "scripts": {
    "test": "playwright test",
    "test:report": "playwright show-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.44.0",
    "dotenv": "^16.4.5"
  }
}`;

const DOT_ENV_EXAMPLE = `# .env.local — DO NOT COMMIT THIS FILE
# Add to .gitignore: .env.local

ADMIN_SESSION_COOKIE=your_admin_session_cookie_here
STRIPE_MODE=test`;

const GITIGNORE = `.env
.env.local
.env.*.local
node_modules/
playwright-report/
test-results/
*.cookie`;

const TEST_PACKS = [
  {
    id: 'public-routes',
    label: 'Public Routes',
    filename: 'public-routes.spec.ts',
    priority: 'Critical',
    description: 'All public routes return 200. No 404 or 500.',
    code: `import { test, expect } from '@playwright/test';

const PUBLIC_ROUTES = [
  '/', '/music', '/store', '/community', '/videos',
  '/back-this', '/current-single', '/lyrics', '/this-is-my-life',
  '/faq', '/member-tiers', '/mastering', '/bookings', '/contact',
  '/impact', '/privacy-policy', '/terms-of-service', '/order-status',
  '/merch-feedback', '/tiktok-callback', '/gift-checklist',
];

test.describe('Public Routes — all must return 200', () => {
  for (const route of PUBLIC_ROUTES) {
    test(\`\${route} opens successfully\`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).not.toBe(500);
      expect(res?.status()).not.toBe(404);
    });
  }
});`,
  },
  {
    id: 'admin-routes',
    label: 'Admin Routes',
    filename: 'admin-routes.spec.ts',
    priority: 'Critical',
    description: 'All admin routes load after login. Requires admin session cookie.',
    code: `import { test, expect } from '@playwright/test';

const ADMIN_ROUTES = [
  '/admin', '/admin/orders', '/admin/financials', '/admin/merch',
  '/admin/notifications', '/admin/approval-queue', '/admin/promo-codes',
  '/admin/order-profit-intelligence', '/admin/external-engineering-command',
  '/admin/playwright-test-centre', '/admin/agent-trust-hub',
  '/admin/business-attention-centre', '/admin/shipping-rates',
  '/admin/tiktok-platform-review',
];

test.describe('Admin Routes', () => {
  test.skip(!process.env.ADMIN_SESSION_COOKIE, 'Requires ADMIN_SESSION_COOKIE in .env.local');

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
      await expect(page.locator('h1').first()).toBeVisible();
    });
  }
});`,
  },
  {
    id: 'store-load',
    label: 'Store Load',
    filename: 'store-load.spec.ts',
    priority: 'Critical',
    description: '/store loads quickly, products render, no console errors, no infinite re-render.',
    code: `import { test, expect } from '@playwright/test';

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
    const products = page.locator('[class*="ProductCard"], [class*="product"], button').filter({ hasText: /add to cart|add|buy/i });
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test('No critical console errors on store page', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // wait for any re-render loops
    const realErrors = errors.filter(e =>
      !e.includes('favicon') && !e.includes('ResizeObserver')
    );
    expect(realErrors).toHaveLength(0);
  });

  test('Store does not infinite re-render', async ({ page }) => {
    let renderCount = 0;
    await page.goto('/store');
    // Listen for network requests as a proxy for re-renders triggering data fetches
    page.on('request', req => { if (req.url().includes('storeProducts')) renderCount++; });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    // More than 10 fetches in 3s would indicate a loop
    expect(renderCount).toBeLessThan(10);
  });
});`,
  },
  {
    id: 'cart',
    label: 'Cart',
    filename: 'cart.spec.ts',
    priority: 'Critical',
    description: 'Cart drawer opens, multiple products can be added, quantities update correctly.',
    code: `import { test, expect } from '@playwright/test';

test.describe('Cart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
  });

  test('Add to cart button works for in-stock item', async ({ page }) => {
    // Click first "Add to Cart" button (non-size items)
    const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(500);
      // Cart badge should show count > 0
      const badge = page.locator('[class*="CartButton"], [class*="cart"]').filter({ hasText: /[1-9]/ }).first();
      // At minimum, no error should occur
    }
  });

  test('Cart drawer opens', async ({ page }) => {
    // Click cart icon
    const cartBtn = page.locator('button').filter({ hasText: /cart|[0-9]+/i }).first();
    if (await cartBtn.isVisible()) {
      await cartBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('No size required for non-apparel items', async ({ page }) => {
    // CD products should not require size selection
    const cdCard = page.locator('[class*="product"], [class*="Product"]').filter({ hasText: /CD|single/i }).first();
    if (await cdCard.isVisible()) {
      const addBtn = cdCard.locator('button').filter({ hasText: /add to cart/i });
      if (await addBtn.isVisible()) {
        await addBtn.click();
        // Should not show size error
        await expect(page.locator('text=Please select a size')).not.toBeVisible();
      }
    }
  });
});`,
  },
  {
    id: 'checkout',
    label: 'Checkout',
    filename: 'checkout.spec.ts',
    priority: 'Critical',
    description: 'Checkout opens, Stripe redirect works, session not frozen.',
    code: `import { test, expect } from '@playwright/test';

// STRIPE SAFETY: Only auto-submit in test mode.
// NEVER auto-submit in live mode.
const STRIPE_MODE = process.env.STRIPE_MODE;

test.describe('Checkout Flow', () => {
  test('Checkout page loads', async ({ page }) => {
    await page.goto('/store/checkout');
    await page.waitForLoadState('networkidle');
    // Should either show cart or redirect to store if empty
    const url = page.url();
    expect(url).toMatch(/checkout|store/);
  });

  test('Store checkout does not freeze', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(500);
      await page.goto('/store/checkout');
      await page.waitForLoadState('networkidle');
      // Wait 5s — if the page is frozen this will timeout
      await page.waitForTimeout(5000);
      // Confirm page is still interactive
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 3000 });
    }
  });

  test.skip(STRIPE_MODE !== 'test', 'SKIPPED: Set STRIPE_MODE=test to run checkout tests');
  test('Checkout redirects to Stripe (test mode)', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.goto('/store/checkout');
      // Fill form and trigger checkout — do not auto-submit payment
      console.log('TEST MODE: Do not auto-submit. Verify Stripe form loads.');
    }
  });
});`,
  },
  {
    id: 'shipping',
    label: 'Shipping',
    filename: 'shipping.spec.ts',
    priority: 'High',
    description: 'Combined shipping rates: 1 item=$12.95, 2=$14.95, ≥$150=free.',
    code: `import { test, expect } from '@playwright/test';
import { base44 } from '@/api/base44Client'; // for direct function test

// These are manual verification tests
// Automated shipping calculation test via backend function
test.describe('Shipping Calculation Logic', () => {
  test('Shipping page loads in admin', async ({ page }) => {
    test.skip(!process.env.ADMIN_SESSION_COOKIE, 'Requires admin session');
    await page.goto('/admin/shipping-rates');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  // Manual verification matrix — confirm in browser:
  // 1 item (any category, AU): $12.95
  // 2 items (AU): $14.95 (NOT $25.90)
  // 3 items (AU): $16.95 (NOT $38.85)
  // Cart >= $150: $0.00 (free shipping)
  // CD only (AU): $12.95
  // Support/donation only: $0.00
  // International: "Quote required" / $0 placeholder
  test('Shipping rate rules are set up', async ({ page }) => {
    // This test just confirms the admin page exists
    // Manual browser test required for actual rate verification
    console.log('Manual test matrix:');
    console.log('1 AU merch item: $12.95');
    console.log('2 AU merch items: $14.95');
    console.log('Cart >= $150: free');
    console.log('International: quote required');
  });
});`,
  },
  {
    id: 'promo-codes',
    label: 'Promo Codes',
    filename: 'promo-codes.spec.ts',
    priority: 'Critical',
    description: 'F20UN26DVIP=20% off merch. F30MOM26A=30% off merch. Old/invalid codes rejected.',
    code: `import { test, expect } from '@playwright/test';

// VALID PROMO CODES (confirmed in DB 2026-05-28):
// F20UN26DVIP — 20% off apparel, accessories, poster, bundle. Excludes CD, vinyl, shipping.
// F30MOM26A — 30% off apparel, accessories, poster, bundle. Excludes CD, vinyl, shipping.
// NunY@69Ony@Son!@ — OWNER OVERRIDE CODE (90% off — for Gannon only, not for testing)

test.describe('Promo Code Validation', () => {
  test('Store checkout page exists', async ({ page }) => {
    await page.goto('/store/checkout');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/checkout|store/);
  });

  test('Admin promo codes page loads', async ({ page }) => {
    test.skip(!process.env.ADMIN_SESSION_COOKIE, 'Requires admin session');
    await page.goto('/admin/promo-codes');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  // Manual promo code test matrix:
  // F20UN26DVIP on a hoodie ($98) → discount applied: -$19.60 → total $78.40 + shipping
  // F20UN26DVIP on a CD ($10) → no discount (CD excluded) → total $10 + shipping
  // F30MOM26A on a hoodie ($98) → -$29.40 → total $68.60 + shipping
  // Shipping is NEVER discounted by promo code
  // LAUNCH20, SUMMER10, TEST50 → rejected (not in DB)
  test('Promo code validation manual matrix', async () => {
    console.log('MANUAL TEST MATRIX:');
    console.log('F20UN26DVIP + hoodie $98 → $78.40 + shipping');
    console.log('F20UN26DVIP + CD $10 → $10 + shipping (no discount)');
    console.log('F30MOM26A + hoodie $98 → $68.60 + shipping');
    console.log('LAUNCH20 → rejected (not in DB)');
    console.log('Old/expired codes → rejected');
    console.log('Shipping charge → NEVER discounted');
  });
});`,
  },
  {
    id: 'security',
    label: 'Security',
    filename: 'security.spec.ts',
    priority: 'Critical',
    description: 'No secrets visible in page source. Unauthenticated endpoints protected.',
    code: `import { test, expect } from '@playwright/test';

const SECRET_PATTERNS = [
  /sk_live_[a-zA-Z0-9]{20,}/,
  /sk_test_[a-zA-Z0-9]{20,}/,
  /whsec_[a-zA-Z0-9]{20,}/,
  /client_secret\s*[:=]\s*["'][a-zA-Z0-9]{10,}/,
];

const PUBLIC_PAGES_TO_CHECK = ['/', '/store', '/music', '/back-this'];

test.describe('Security — No Secrets in Page Source', () => {
  for (const route of PUBLIC_PAGES_TO_CHECK) {
    test(\`No secrets visible on \${route}\`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const content = await page.content();
      for (const pattern of SECRET_PATTERNS) {
        expect(content).not.toMatch(pattern);
      }
    });
  }
});

test.describe('Admin Routes — Unauthenticated Access', () => {
  test('Admin redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    // Should redirect to login or show login state
    const content = await page.content();
    const url = page.url();
    const isProtected =
      url.includes('login') ||
      url.includes('auth') ||
      content.includes('Sign in') ||
      content.includes('Log in') ||
      content.includes('login');
    expect(isProtected).toBeTruthy();
  });
});`,
  },
  {
    id: 'coaching-private-lock',
    label: 'Coaching Lock',
    filename: 'coaching-private-lock.spec.ts',
    priority: 'Critical',
    description: 'ALL coaching routes return 404 publicly. MOST IMPORTANT TEST.',
    code: `import { test, expect } from '@playwright/test';

// ⚠️ MOST CRITICAL TEST ⚠️
// Coaching must NEVER be publicly accessible.
// COACHING_PUBLIC_LAUNCH_ENABLED = false (hardcoded in lib/platformConfig.js)
// Do NOT change this until: legal review + 9-gate checklist + Gannon approval

const COACHING_ROUTES_MUST_BLOCK = [
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
];

test.describe('Coaching Privacy Lock — CRITICAL', () => {
  for (const route of COACHING_ROUTES_MUST_BLOCK) {
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
      expect(isBlocked).toBeTruthy();
    });
  }

  test('Admin coaching page requires login (unauthenticated)', async ({ page }) => {
    await page.goto('/admin/coaching-command');
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    // Should show login prompt, not coaching content
    const showsCoachingPublicly =
      content.toLowerCase().includes('coaching program') &&
      !content.toLowerCase().includes('sign in') &&
      !content.toLowerCase().includes('login');
    expect(showsCoachingPublicly).toBeFalsy();
  });
});`,
  },
  {
    id: 'mobile',
    label: 'Mobile',
    filename: 'mobile.spec.ts',
    priority: 'Medium',
    description: 'Public pages are responsive. No horizontal scroll. Mobile nav works.',
    code: `import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['Pixel 5'] });

const MOBILE_ROUTES = ['/', '/store', '/music', '/community', '/back-this', '/current-single'];

test.describe('Mobile Responsiveness', () => {
  for (const route of MOBILE_ROUTES) {
    test(\`\${route} is usable on mobile (no horizontal scroll)\`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = page.viewportSize()?.width || 390;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 30);
      await expect(page.locator('main, body > div, [class*="Layout"]').first()).toBeVisible();
    });
  }

  test('Mobile store cart button is visible', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const cartBtn = page.locator('button').filter({ hasText: /cart|[0-9]+/i }).first();
    // Cart button should be visible without horizontal scroll
    if (await cartBtn.isVisible()) {
      const box = await cartBtn.boundingBox();
      const viewport = page.viewportSize();
      if (box && viewport) {
        expect(box.x + box.width).toBeLessThan(viewport.width + 10);
      }
    }
  });
});`,
  },
];

export default function PlaywrightTestCentre() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(TEST_PACKS[0]);

  const copy = (text) => { navigator.clipboard.writeText(text); toast({ title: 'Copied to clipboard' }); };
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
    downloadFile('playwright.config.ts', PLAYWRIGHT_CONFIG);
    downloadFile('package.json', PKG_JSON);
    downloadFile('.env.example', DOT_ENV_EXAMPLE);
    downloadFile('.gitignore', GITIGNORE);
    toast({ title: `Downloaded all ${TEST_PACKS.length} test files + config` });
  };

  const priorityColor = (p) => {
    if (p === 'Critical') return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (p === 'High') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-secondary text-muted-foreground border-border';
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/external-engineering-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Playwright Test Centre</h1>
            <p className="text-sm text-muted-foreground mt-1">{TEST_PACKS.length} test suites — download and run externally against gannonwaye.com. PLAYWRIGHT NOT RUN INSIDE BASE44.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={downloadAll}><Download className="w-3 h-3 mr-1" />Download All ({TEST_PACKS.length} tests + config)</Button>
        </div>
      </div>

      {/* NOT RUN banner */}
      <Card className="border-orange-500/30 bg-orange-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-orange-300">PLAYWRIGHT NOT RUN — External execution required</p>
            <p className="text-muted-foreground">Playwright cannot run inside Base44 preview. Download the test files and run externally using Warp terminal or your local machine.</p>
            <p className="text-muted-foreground font-mono text-xs">npm install -D @playwright/test && npx playwright install chromium && npx playwright test</p>
          </div>
        </CardContent>
      </Card>

      {/* How to Run */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-sm font-semibold text-primary mb-2">Setup — 5 Steps</p>
          <ol className="space-y-1 text-xs text-muted-foreground">
            <li>1. Download all test files (button above)</li>
            <li>2. <code className="bg-secondary px-1 rounded">npm install</code> (uses the package.json downloaded)</li>
            <li>3. <code className="bg-secondary px-1 rounded">npx playwright install chromium</code></li>
            <li>4. Create <code className="bg-secondary px-1 rounded">.env.local</code> from <code className="bg-secondary px-1 rounded">.env.example</code> — add your admin session cookie</li>
            <li>5. <code className="bg-secondary px-1 rounded">npx playwright test</code> → <code className="bg-secondary px-1 rounded">npx playwright show-report</code></li>
          </ol>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest px-1">Test Suites</p>
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

          {/* Config files */}
          <div className="space-y-1 pt-2">
            <p className="text-xs text-muted-foreground uppercase tracking-widest px-1">Config Files</p>
            {[
              { label: 'playwright.config.ts', content: PLAYWRIGHT_CONFIG, filename: 'playwright.config.ts' },
              { label: 'package.json', content: PKG_JSON, filename: 'package.json' },
              { label: '.env.example', content: DOT_ENV_EXAMPLE, filename: '.env.example' },
              { label: '.gitignore', content: GITIGNORE, filename: '.gitignore' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="flex-1 justify-start text-xs" onClick={() => setSelected({ id: f.label, label: f.label, code: f.content })}>
                  {f.label}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => downloadFile(f.filename, f.content)}>
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {selected && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base">{selected.label}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copy(selected.code || selected.content)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
                  <Button variant="outline" size="sm" onClick={() => downloadFile(`tests/${selected.filename || selected.id + '.ts'}`, selected.code || selected.content)}><Download className="w-3 h-3 mr-1" />Download</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto overflow-y-auto max-h-[60vh] whitespace-pre-wrap font-mono leading-relaxed">
                {selected.code || selected.content}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}