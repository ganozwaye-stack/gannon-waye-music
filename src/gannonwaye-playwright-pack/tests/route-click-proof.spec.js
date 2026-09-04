// Route and Click Proof Tests
// Verifies all key routes load and do not redirect to dashboard fallback.
import { test, expect } from '@playwright/test';

const PUBLIC_ROUTES = [
  { path: '/store', label: 'Verified Boutique Store' },
  { path: '/store/all', label: 'Legacy Store Redirect' },
  { path: '/music', label: 'Music' },
  { path: '/lyrics', label: 'Lyrics' },
  { path: '/checkout-success', label: 'Checkout Success' },
  { path: '/checkout-cancel', label: 'Checkout Cancel' },
];

const ADMIN_ROUTES = [
  { path: '/admin', label: 'Admin Dashboard' },
  { path: '/admin/orders', label: 'Orders' },
  { path: '/admin/music-opportunity-bulletin', label: 'Music Opportunity Bulletin' },
  { path: '/admin/base44-exit-plan', label: 'Base44 Exit Plan' },
  { path: '/admin/legal-drafts', label: 'Legal Drafts' },
  { path: '/admin/print-fulfilment', label: 'Print Fulfilment' },
  { path: '/admin/site-health', label: 'Site Health' },
];

test.describe('Public Routes Load Without 404', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route.label} — ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toContain('Page Not Found');
      expect(bodyText).not.toContain('404');
    });
  }
});

test.describe('Admin Routes Load (require admin auth)', () => {
  for (const route of ADMIN_ROUTES) {
    test(`${route.label} — ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      const bodyText = await page.textContent('body');
      // Should not 404 — either loads admin content or redirects to login (not 404)
      expect(bodyText).not.toContain('Page Not Found');
    });
  }
});

test.describe('Legacy product URLs fail closed to the verified store', () => {
  const PRODUCT_SLUGS = [
    'winter-writing-comfort-bundle',
    'thankyou-journal-pen-thermos-bundle',
    'respect-is-earned-wall-poster',
    'thankyou-respect-is-earned-coffee-mug',
    'thankyou-respect-is-earned-hoodie-front',
  ];

  for (const slug of PRODUCT_SLUGS) {
    test(`/store/product/${slug} returns to /store`, async ({ page }) => {
      await page.goto(`/store/product/${slug}`);
      await expect(page).toHaveURL('/store');
      await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
    });
  }
});

test.describe('Store card links resolve correctly', () => {
  test('Store world and verified product cards share the canonical route', async ({ page }) => {
    await page.goto('/store');
    await expect(page.locator('[data-testid="locked-storefront-world"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(2);
  });

  test('Store All redirects to the canonical verified store', async ({ page }) => {
    await page.goto('/store/all');
    await expect(page).toHaveURL('/store');
    await expect(page.locator('[data-testid="store-page"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(2);
  });
});

test.describe('API Keys Not Exposed In Frontend', () => {
  test('No Stripe secret key exposed in /store page', async ({ page }) => {
    await page.goto('/store/all');
    const html = await page.content();
    expect(html).not.toMatch(/sk_live_[a-zA-Z0-9]{20,}/);
    expect(html).not.toMatch(/sk_test_[a-zA-Z0-9]{20,}/);
  });

  test('No OpenAI key exposed in /store page', async ({ page }) => {
    await page.goto('/store/all');
    const html = await page.content();
    expect(html).not.toMatch(/sk-[a-zA-Z0-9]{20,}/);
  });

  test('Signed-out visitors cannot inspect print-provider configuration', async ({ page }) => {
    await page.goto('/admin/print-fulfilment');
    const html = await page.content();
    expect(html).not.toContain('PRINTFUL_API_TOKEN');
    expect(html).not.toContain('PRINTIFY_API_KEY');
    await expect(page.getByRole('heading', { name: 'Owner sign-in' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue to secure sign-in' })).toBeVisible();
  });
});