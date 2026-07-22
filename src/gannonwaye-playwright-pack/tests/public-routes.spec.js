/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const NOT_FOUND_COPY = /page not found|404|does not exist|couldn.t find/i;

const legacyRoutes = [
  { from: '/tour', to: '/', landmark: 'h1' },
  { from: '/bookings', to: '/', landmark: 'h1' },
  { from: '/store-world', to: '/store', landmark: 'img[alt="Gannon Waye Merch Store"]' },
  { from: '/support', to: '/contact', landmark: 'h1' },
  { from: '/releases', to: '/music', landmark: 'h1' },
  { from: '/gift-tracker', to: '/gift-checklist', landmark: 'h1' },
  { from: '/about', to: '/this-is-my-life', landmark: 'h1' },
];

const retainedBase44Routes = [
  { route: '/mum', landmark: 'h1' },
  { route: '/without-you-here', landmark: 'h1' },
  { route: '/mums-garden', landmark: 'text=Written on Mother\'s Day' },
  { route: '/remember-mum', landmark: 'h1' },
  { route: '/press-kit', landmark: 'h1' },
];

const expectedUrl = (path, suffix = '') => `${BASE_URL}${path}${suffix}`;

test.describe('Legacy public routes on the production build', () => {
  for (const { from, to, landmark } of legacyRoutes) {
    test(`${from} resolves once to ${to}, preserves query parameters and is not a 404`, async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const navigations = [];
      page.on('framenavigated', frame => {
        if (frame === page.mainFrame()) navigations.push(frame.url());
      });

      const suffix = '?utm_source=legacy-route-test&campaign=without-you-here';
      const response = await page.goto(expectedUrl(from, suffix), { waitUntil: 'domcontentloaded' });

      expect(response?.status()).toBeLessThan(400);
      await expect(page).toHaveURL(expectedUrl(to, suffix));
      await expect(page.locator('body')).not.toContainText(NOT_FOUND_COPY);
      await expect(page.locator(landmark).first()).toBeVisible();
      expect(navigations.length).toBeLessThanOrEqual(3);
      await context.close();
    });
  }
});

test.describe('Retained Base44 public addresses', () => {
  for (const { route, landmark } of retainedBase44Routes) {
    test(`${route} loads directly in a fresh context`, async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const response = await page.goto(expectedUrl(route), { waitUntil: 'domcontentloaded' });

      expect(response?.status()).toBeLessThan(400);
      await expect(page).toHaveURL(expectedUrl(route));
      await expect(page.locator('body')).not.toContainText(NOT_FOUND_COPY);
      await expect(page.locator(landmark).first()).toBeVisible();
      await context.close();
    });
  }
});
