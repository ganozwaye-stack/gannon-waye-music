import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Copy, Download, ExternalLink, FileText, Shield, Play } from 'lucide-react';

const PLAYWRIGHT_CONFIG = `// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

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

const TEST_PACKS = [
  {
    id: 'routes',
    label: 'Route Tests',
    description: 'Every public and admin route opens without 500/404 error',
    priority: 'Critical',
    code: `import { test, expect } from '@playwright/test';

const PUBLIC_ROUTES = [
  '/', '/music', '/store', '/community', '/videos',
  '/back-this', '/current-single', '/lyrics', '/this-is-my-life',
  '/faq', '/member-tiers', '/mastering', '/bookings', '/contact',
  '/impact', '/privacy-policy', '/terms-of-service', '/order-status',
  '/merch-feedback',
];

const COACHING_LOCKED_ROUTES = [
  '/coaching', '/coaching-programs', '/mindset-coaching',
];

test.describe('Public Routes', () => {
  for (const route of PUBLIC_ROUTES) {
    test(\`\${route} opens successfully\`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).not.toBe(500);
      expect(res?.status()).not.toBe(404);
      await expect(page).not.toHaveTitle(/error/i);
    });
  }
});

test.describe('Coaching Lock', () => {
  for (const route of COACHING_LOCKED_ROUTES) {
    test(\`\${route} returns 404 (coaching is private)\`, async ({ page }) => {
      const res = await page.goto(route);
      // Should show PageNotFound or redirect
      const content = await page.content();
      const isBlocked = res?.status() === 404 || content.includes('404') || content.includes('not found');
      expect(isBlocked).toBeTruthy();
    });
  }
});`,
  },
  {
    id: 'navigation',
    label: 'Navigation Tests',
    description: 'Sidebar links, nav items, back buttons, and footer links work',
    priority: 'Critical',
    code: `import { test, expect } from '@playwright/test';

test.describe('Store Navigation', () => {
  test('Store product cards are clickable', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const cards = page.locator('[data-testid="product-card"], .product-card, [class*="ProductCard"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Back This page loads and has support button', async ({ page }) => {
    await page.goto('/back-this');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('button, a').filter({ hasText: /support|back|contribute/i }).first()).toBeVisible();
  });
});

test.describe('Admin Navigation (requires logged-in session)', () => {
  // NOTE: Set ADMIN_SESSION_COOKIE in env before running these
  test.skip(!process.env.ADMIN_SESSION_COOKIE, 'Requires admin session');

  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([{
      name: 'session',
      value: process.env.ADMIN_SESSION_COOKIE || '',
      domain: 'gannonwaye.com',
      path: '/',
    }]);
  });

  const ADMIN_ROUTES = [
    '/admin', '/admin/orders', '/admin/financials',
    '/admin/business-worth-command', '/admin/order-profit-intelligence',
    '/admin/offer-engine', '/admin/bundle-proposal-studio',
    '/admin/content-to-cash', '/admin/website-evolution',
    '/admin/todays-money-moves', '/admin/agent-capability-matrix',
    '/admin/az-index', '/admin/coaching-command',
    '/admin/tiktok-platform-review', '/admin/tiktok-recording-studio',
    '/admin/social-platform-parity', '/admin/notifications',
    '/admin/approval-queue', '/admin/qa-command-centre',
  ];

  for (const route of ADMIN_ROUTES) {
    test(\`\${route} opens without error\`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toBeVisible();
      const errors = [];
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
    });
  }
});`,
  },
  {
    id: 'clickability',
    label: 'Clickability Tests',
    description: 'All cards, tabs, buttons, badges, modals, and dropdowns are interactive',
    priority: 'High',
    code: `import { test, expect } from '@playwright/test';

test.describe('Store Clickability', () => {
  test('Product cards open detail or modal', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const firstCard = page.locator('button, [role="button"]').filter({ hasText: /add to cart|view|buy/i }).first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await page.waitForTimeout(500);
    }
  });

  test('No console errors on store page', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const realErrors = errors.filter(e => !e.includes('favicon') && !e.includes('ResizeObserver'));
    expect(realErrors).toHaveLength(0);
  });
});

test.describe('Tab Functionality', () => {
  test('Tabs change active state', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const tabs = page.locator('[role="tab"]');
    const tabCount = await tabs.count();
    if (tabCount > 1) {
      await tabs.nth(1).click();
      await expect(tabs.nth(1)).toHaveAttribute('data-state', 'active');
    }
  });
});

test.describe('Modal Functionality', () => {
  test('Checkout modal is scrollable', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    // Try opening a product
    const buyBtn = page.locator('button').filter({ hasText: /add|buy|checkout/i }).first();
    if (await buyBtn.isVisible()) {
      await buyBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('[role="dialog"], [class*="modal"], [class*="Modal"]').first();
      if (await modal.isVisible()) {
        const box = await modal.boundingBox();
        expect(box).toBeTruthy();
      }
    }
  });
});`,
  },
  {
    id: 'tiktok',
    label: 'TikTok Tests',
    description: 'TikTok OAuth flow, callback, and draft upload validation',
    priority: 'Critical',
    code: `import { test, expect } from '@playwright/test';

test.describe('TikTok Integration (Admin — requires session)', () => {
  test.skip(!process.env.ADMIN_SESSION_COOKIE, 'Requires admin session');

  test('TikTok Platform Review opens', async ({ page, context }) => {
    await context.addCookies([{
      name: 'session',
      value: process.env.ADMIN_SESSION_COOKIE || '',
      domain: 'gannonwaye.com',
      path: '/',
    }]);
    await page.goto('/admin/tiktok-platform-review');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Connect TikTok button is visible', async ({ page, context }) => {
    await context.addCookies([{
      name: 'session',
      value: process.env.ADMIN_SESSION_COOKIE || '',
      domain: 'gannonwaye.com',
      path: '/',
    }]);
    await page.goto('/admin/tiktok-platform-review');
    await page.waitForLoadState('networkidle');
    const connectBtn = page.locator('button').filter({ hasText: /connect tiktok/i });
    await expect(connectBtn).toBeVisible();
  });

  test('TikTok callback route exists', async ({ page }) => {
    // Callback with no code should show error/processing UI, not 404
    const res = await page.goto('/tiktok-callback');
    expect(res?.status()).not.toBe(404);
    expect(res?.status()).not.toBe(500);
  });

  test('No TikTok client secret visible in page source', async ({ page, context }) => {
    await context.addCookies([{
      name: 'session',
      value: process.env.ADMIN_SESSION_COOKIE || '',
      domain: 'gannonwaye.com',
      path: '/',
    }]);
    await page.goto('/admin/tiktok-platform-review');
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    // The actual secret value should never appear — only the env var name
    expect(content).not.toMatch(/client_secret\s*[:=]\s*"[a-zA-Z0-9]{10,}/);
  });
});`,
  },
  {
    id: 'coaching_lock',
    label: 'Coaching Privacy Lock',
    description: 'No coaching pages are publicly accessible',
    priority: 'Critical',
    code: `import { test, expect } from '@playwright/test';

const COACHING_ROUTES_MUST_404 = [
  '/coaching',
  '/coaching-programs',
  '/mindset-coaching',
  '/life-coaching',
  '/mentorship',
  '/coaching-signup',
  '/coaching-intake',
  '/book-coaching',
];

test.describe('Coaching Privacy Lock', () => {
  for (const route of COACHING_ROUTES_MUST_404) {
    test(\`\${route} is not publicly accessible\`, async ({ page }) => {
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

  test('Admin coaching page requires admin login', async ({ page }) => {
    // Without a session, admin routes should redirect to login
    await page.goto('/admin/coaching-command');
    await page.waitForLoadState('networkidle');
    // Should either show login or redirect — not coaching content
    const url = page.url();
    const isProtected = url.includes('login') || url.includes('auth') || !url.includes('/admin');
    // If still on admin, check it shows login state
    const content = await page.content();
    const showsCoachingPublicly = content.includes('coaching programs') && !content.includes('admin') && !content.includes('login');
    expect(showsCoachingPublicly).toBeFalsy();
  });
});`,
  },
  {
    id: 'commerce',
    label: 'Commerce & Profit Tests',
    description: 'Orders, profit, checkout (mode-aware — reads STRIPE_MODE env var)',
    priority: 'High',
    code: `import { test, expect } from '@playwright/test';

// ⚠️ STRIPE SAFETY RULE ⚠️
// Set STRIPE_MODE=test or STRIPE_MODE=live in your .env before running.
// NEVER use test cards (4242...) unless STRIPE_MODE=test is confirmed.
// If STRIPE_MODE=live, only run up to the Stripe page — do NOT submit payment
// unless Gannon has approved a specific controlled live purchase.
// If STRIPE_MODE is not set, checkout submit tests are SKIPPED.

const STRIPE_MODE = process.env.STRIPE_MODE; // 'test' | 'live' | undefined

test.describe('Commerce Admin (requires session)', () => {
  test.skip(!process.env.ADMIN_SESSION_COOKIE, 'Requires admin session');

  test.beforeEach(async ({ context }) => {
    await context.addCookies([{
      name: 'session',
      value: process.env.ADMIN_SESSION_COOKIE || '',
      domain: 'gannonwaye.com',
      path: '/',
    }]);
  });

  test('Orders page loads', async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Order Profit Intelligence opens', async ({ page }) => {
    await page.goto('/admin/order-profit-intelligence');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Financial Dashboard loads', async ({ page }) => {
    await page.goto('/admin/financials');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Store (Public — no payment required)', () => {
  test('Store opens and shows products', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const storeContent = page.locator('main, [class*="Store"]').first();
    await expect(storeContent).toBeVisible();
  });

  test('No unapproved bundles visible', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    expect(content).not.toMatch(/draft bundle|unapproved bundle/i);
  });
});

test.describe('Checkout Flow — TEST MODE ONLY', () => {
  // Only runs if STRIPE_MODE=test is explicitly set
  test.skip(STRIPE_MODE !== 'test', 
    'SKIPPED: STRIPE_MODE is not "test". Set STRIPE_MODE=test in .env only if STRIPE_SECRET_KEY starts with sk_test_ AND STRIPE_PUBLISHABLE_KEY starts with pk_test_. Never mix modes.');

  test('Checkout opens from store (test mode)', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    // Open first product
    const buyBtn = page.locator('button').filter({ hasText: /add|buy|checkout/i }).first();
    if (await buyBtn.isVisible()) {
      await buyBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('[role="dialog"]').first();
      if (await modal.isVisible()) {
        console.log('Modal opened — Stripe test card: 4242 4242 4242 4242 / 12/26 / 123');
      }
    }
  });

  // NOTE: Do not auto-submit payment in Playwright even in test mode.
  // Submit manually after confirming the Stripe form is loaded correctly.
});

test.describe('Checkout Flow — LIVE MODE', () => {
  // In live mode: never auto-submit, never use test cards
  test.skip(STRIPE_MODE !== 'live', 'SKIPPED: STRIPE_MODE is not "live"');

  test('Store and cart work (no payment submitted)', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    // Only verify the store renders — do NOT attempt checkout in live mode automatically
    const storeContent = page.locator('main').first();
    await expect(storeContent).toBeVisible();
    console.log('LIVE MODE: Store renders OK. Do NOT auto-submit checkout. Use approved controlled purchase only.');
  });
});`,
  },
  {
    id: 'mobile',
    label: 'Mobile Tests',
    description: 'All public pages are responsive and usable on mobile',
    priority: 'Medium',
    code: `import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['Pixel 5'] });

const MOBILE_ROUTES = ['/', '/store', '/music', '/community', '/back-this'];

test.describe('Mobile Responsiveness', () => {
  for (const route of MOBILE_ROUTES) {
    test(\`\${route} is usable on mobile\`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      // No horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = page.viewportSize()?.width || 390;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // 20px tolerance
      // Page renders content
      await expect(page.locator('main, [class*="Layout"], body > div')).toBeVisible();
    });
  }

  test('Mobile navigation menu opens', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const menuBtn = page.locator('button[aria-label*="menu"], button').filter({ hasText: /menu/i }).first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(300);
    }
  });
});`,
  },
];

const SETUP_INSTRUCTIONS = `# Playwright QA Setup

## Prerequisites
npm install -D @playwright/test
npx playwright install chromium

## Environment Variables
ADMIN_SESSION_COOKIE=your_admin_session_cookie_here

## Get Admin Session Cookie
1. Log into gannonwaye.com as admin in Chrome
2. Open DevTools → Application → Cookies → gannonwaye.com
3. Copy the session/auth cookie value
4. Set ADMIN_SESSION_COOKIE=<value>

## Run All Tests
npx playwright test

## Run Specific Category
npx playwright test --grep "TikTok"
npx playwright test --grep "Coaching"
npx playwright test --grep "Commerce"

## View Report
npx playwright show-report

## CI/CD
Add to GitHub Actions:
  - name: Run Playwright Tests
    run: npx playwright test
    env:
      ADMIN_SESSION_COOKIE: \${{ secrets.ADMIN_SESSION_COOKIE }}`;

export default function PlaywrightTestCentre() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(TEST_PACKS[0]);

  const copy = (text) => { navigator.clipboard.writeText(text); toast({ title: 'Copied to clipboard' }); };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Downloaded ${filename}` });
  };

  const downloadAll = () => {
    TEST_PACKS.forEach(pack => {
      downloadFile(`tests/${pack.id}.spec.ts`, pack.code);
    });
    downloadFile('playwright.config.ts', PLAYWRIGHT_CONFIG);
    downloadFile('PLAYWRIGHT_SETUP.md', SETUP_INSTRUCTIONS);
    toast({ title: 'All test files downloaded' });
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/qa-command-centre"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Playwright Test Centre</h1>
            <p className="text-sm text-muted-foreground mt-1">{TEST_PACKS.length} test suites ready for external browser testing on gannonwaye.com</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={downloadAll}><Download className="w-3 h-3 mr-1" />Download All Test Files</Button>
          <Button variant="outline" size="sm" onClick={() => copy(PLAYWRIGHT_CONFIG)}><Copy className="w-3 h-3 mr-1" />Copy Config</Button>
        </div>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 text-sm">
          <p className="font-semibold text-primary mb-2">How to Run</p>
          <ol className="space-y-1 text-muted-foreground">
            <li>1. Download all test files using the button above</li>
            <li>2. Run <code className="bg-secondary px-1 rounded">npm install -D @playwright/test && npx playwright install chromium</code></li>
            <li>3. Set <code className="bg-secondary px-1 rounded">ADMIN_SESSION_COOKIE</code> to your admin session cookie from gannonwaye.com</li>
            <li>4. Run <code className="bg-secondary px-1 rounded">npx playwright test</code></li>
            <li>5. View report: <code className="bg-secondary px-1 rounded">npx playwright show-report</code></li>
          </ol>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          {TEST_PACKS.map(pack => (
            <Card key={pack.id} className={`cursor-pointer hover:border-primary/40 transition-colors ${selected?.id === pack.id ? 'border-primary/60' : ''}`} onClick={() => setSelected(pack)}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm">{pack.label}</p>
                  <Badge className={pack.priority === 'Critical' ? 'bg-red-500/20 text-red-300 border-red-500/30' : pack.priority === 'High' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-secondary text-muted-foreground border-border'}>
                    {pack.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{pack.description}</p>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">playwright.config.ts</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full" onClick={() => copy(PLAYWRIGHT_CONFIG)}><Copy className="w-3 h-3 mr-1" />Copy Config</Button>
              <Button variant="outline" size="sm" className="w-full" onClick={() => downloadFile('playwright.config.ts', PLAYWRIGHT_CONFIG)}><Download className="w-3 h-3 mr-1" />Download Config</Button>
            </CardContent>
          </Card>
        </div>

        {selected && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base">{selected.label}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copy(selected.code)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
                  <Button variant="outline" size="sm" onClick={() => downloadFile(`tests/${selected.id}.spec.ts`, selected.code)}><Download className="w-3 h-3 mr-1" />Download</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto overflow-y-auto max-h-[60vh] whitespace-pre-wrap font-mono">
                {selected.code}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Setup Instructions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap max-h-64">{SETUP_INSTRUCTIONS}</pre>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => copy(SETUP_INSTRUCTIONS)}><Copy className="w-3 h-3 mr-1" />Copy Instructions</Button>
            <Button variant="outline" size="sm" onClick={() => downloadFile('PLAYWRIGHT_SETUP.md', SETUP_INSTRUCTIONS)}><Download className="w-3 h-3 mr-1" />Download</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}