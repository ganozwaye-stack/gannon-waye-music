// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const FIRST_VISIT_KEY = 'gw-first-visit-seen';

const VIEWPORTS = [
  { name: '320x568 portrait', width: 320, height: 568 },
  { name: '360x640 portrait', width: 360, height: 640 },
  { name: '375x667 portrait', width: 375, height: 667 },
  { name: '390x844 portrait', width: 390, height: 844 },
  { name: '412x915 portrait', width: 412, height: 915 },
  { name: '430x932 portrait', width: 430, height: 932 },
  { name: '568x320 landscape', width: 568, height: 320 },
  { name: '640x360 landscape', width: 640, height: 360 },
  { name: '667x375 landscape', width: 667, height: 375 },
  { name: '844x390 landscape', width: 844, height: 390 },
  { name: '915x412 landscape', width: 915, height: 412 },
  { name: '932x430 landscape', width: 932, height: 430 },
];

async function expectDocumentCanScroll(page, distance) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  const viewport = page.viewportSize();
  await page.mouse.move(
    Math.floor((viewport?.width || 320) / 2),
    Math.floor((viewport?.height || 568) / 2),
  );
  await page.mouse.wheel(0, distance);

  await expect.poll(
    () => page.evaluate(() => window.scrollY),
    { message: 'The page must respond to a real wheel/trackpad scroll gesture.' },
  ).toBeGreaterThan(20);
}

async function expectNoFullscreenBlocker(page) {
  const blockers = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    return Array.from(document.querySelectorAll('body *'))
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const visible = style.display !== 'none'
          && style.visibility !== 'hidden'
          && Number(style.opacity || 1) > 0
          && style.pointerEvents !== 'none';
        return visible
          && style.position === 'fixed'
          && rect.width >= viewportWidth * 0.9
          && rect.height >= viewportHeight * 0.9;
      })
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        role: element.getAttribute('role'),
        label: element.getAttribute('aria-label'),
        testId: element.getAttribute('data-testid'),
        className: String(element.getAttribute('class') || '').slice(0, 160),
      }));
  });

  expect(blockers, 'No closed dialog or drawer may keep a viewport-sized click blocker mounted.').toEqual([]);
}

test.describe('Mobile home remains operable at supported phone sizes', () => {
  for (const viewport of VIEWPORTS) {
    test(`${viewport.name}: onboarding, navigation and fixed UI do not freeze scrolling`, async ({ page }) => {
      test.setTimeout(90_000);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Force the real first-visit path for every viewport. This runs before app code.
      await page.addInitScript((key) => {
        try {
          window.localStorage.removeItem(key);
        } catch (error) {
          // Storage can be unavailable in hardened browsers. The component handles this too.
        }
      }, FIRST_VISIT_KEY);

      await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('main')).toBeVisible();
      await expect.poll(
        () => page.evaluate(() => document.documentElement.scrollHeight),
        { timeout: 20_000, message: 'The home page must render enough content to scroll.' },
      ).toBeGreaterThan(viewport.height + 100);

      const welcome = page.getByRole('dialog', { name: /This is more than music/i });
      await expect(welcome).toBeVisible({ timeout: 8_000 });

      const welcomeMetrics = await welcome.evaluate((element) => ({
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
      }));

      if (welcomeMetrics.scrollHeight > welcomeMetrics.clientHeight + 2) {
        await welcome.hover();
        await page.mouse.wheel(0, Math.max(360, viewport.height));
        await expect.poll(
          () => welcome.evaluate((element) => element.scrollTop),
          { message: 'The first-visit guide must scroll when its content exceeds the viewport.' },
        ).toBeGreaterThan(0);
      }

      const dismissWelcome = page.getByRole('button', { name: /Just exploring/i });
      await dismissWelcome.scrollIntoViewIfNeeded();
      await dismissWelcome.click();
      await expect(welcome).toBeHidden();
      await expect.poll(() => page.evaluate((key) => window.localStorage.getItem(key), FIRST_VISIT_KEY)).toBe('1');

      await expectDocumentCanScroll(page, Math.max(420, viewport.height));

      // Search is another full-screen overlay. It must always expose a working close control.
      await page.getByRole('button', { name: 'Search the site' }).click();
      const searchDialog = page.getByRole('dialog', { name: 'Search the Gannon Waye site' });
      await expect(searchDialog).toBeVisible();
      await searchDialog.getByRole('button', { name: 'Close search' }).click();
      await expect(searchDialog).toBeHidden();

      // The cart backdrop and drawer must not remain mounted after the drawer is closed.
      await page.getByRole('button', { name: 'Open cart' }).click();
      const cartDrawer = page.locator('[data-testid="cart-drawer"]');
      await expect(cartDrawer).toBeVisible();
      await cartDrawer.locator('button').first().click();
      await expect(cartDrawer).toBeHidden();

      const mobileMenuButton = page.getByRole('button', { name: 'Open navigation menu' });
      const mobileMenu = page.locator('#mobile-navigation-menu');

      if (viewport.width < 768) {
        await expect(mobileMenuButton).toBeVisible();
        await mobileMenuButton.click();
        await expect(mobileMenu).toBeVisible();
        await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');

        const menuMetrics = await mobileMenu.evaluate((element) => ({
          clientHeight: element.clientHeight,
          scrollHeight: element.scrollHeight,
        }));

        if (menuMetrics.scrollHeight > menuMetrics.clientHeight + 2) {
          await mobileMenu.evaluate((element) => {
            element.scrollTop = element.scrollHeight;
          });
          await expect.poll(
            () => mobileMenu.evaluate((element) => element.scrollTop),
            { message: 'The expanded mobile menu must scroll on short screens.' },
          ).toBeGreaterThan(0);
          await expect(mobileMenu.getByRole('link', { name: 'My Profile' })).toBeVisible();
        }

        await page.getByRole('button', { name: 'Close navigation menu' }).click();
        await expect(mobileMenu).toBeHidden();
        await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
      } else {
        // Wide phone landscape switches to the desktop navigation intentionally.
        await expect(mobileMenuButton).toBeHidden();
        await expect(page.getByRole('button', { name: 'Open more navigation links' })).toBeVisible();
      }

      await expectNoFullscreenBlocker(page);
      await expectDocumentCanScroll(page, Math.max(420, viewport.height));

      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);

      const bottomTabs = page.locator('nav.fixed.bottom-0');
      if (viewport.width < 768) {
        await expect(bottomTabs).toBeVisible();
        const footerAndTabs = await page.evaluate(() => {
          const footer = document.querySelector('footer');
          const tabs = document.querySelector('nav.fixed.bottom-0');
          if (!footer || !tabs) return null;
          const footerRect = footer.getBoundingClientRect();
          const tabsRect = tabs.getBoundingClientRect();
          return {
            footerBottom: footerRect.bottom,
            tabsTop: tabsRect.top,
            overlaps: footerRect.bottom > tabsRect.top + 1,
          };
        });
        expect(footerAndTabs).not.toBeNull();
        expect(footerAndTabs.overlaps, 'Bottom navigation must not cover the footer at maximum scroll.').toBe(false);
      } else {
        await expect(bottomTabs).toBeHidden();
      }
    });
  }
});
