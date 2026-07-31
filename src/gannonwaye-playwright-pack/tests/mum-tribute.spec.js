// @ts-check
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const PREVIEW_TOKEN = process.env.MUM_GARDEN_PLAYWRIGHT_PREVIEW_TOKEN || 'local-mum-garden-preview-token-for-playwright-2026-07-31';
const LEGACY_QUERY_KEYS = ['access', 'invite', 'token', 'code', 'passcode'];
const FORMER_SHARED_CODE = ['sonia', 'garden', '2026'].join('');
const LEGACY_QUERY_VALUES = [
  ['tr', 'ue'].join(''),
  ['1'].join(''),
  ['fam', 'ily'].join(''),
  ['bro', 'ther'].join(''),
  ['in', 'vite'].join(''),
  ['v', 'ip'].join(''),
  ['gan', 'non'].join(''),
  FORMER_SHARED_CODE,
];
const LEGACY_UNLOCK_QUERIES = [
  ...LEGACY_QUERY_VALUES.map(value => `access=${encodeURIComponent(value)}`),
  ...LEGACY_QUERY_KEYS.map(key => `${key}=${encodeURIComponent(FORMER_SHARED_CODE)}`),
];

const gotoRoute = (page, route) => page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
const withPreviewToken = route => `${route}?preview_token=${encodeURIComponent(PREVIEW_TOKEN)}`;

test.describe("Mum's Garden launch pages", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('gwm-song-feedback-submitted:without-you-here', 'true');
    });
  });

  test('sky foyer loads as the public entry point', async ({ page }) => {
    await gotoRoute(page, withPreviewToken('/mum'));
    await expect(page.getByText('In loving memory of').first()).toBeVisible();
    await expect(page.getByText(/Sonia/i).first()).toBeVisible();
    await expect(page.getByText(/Katisa Waye/i).first()).toBeVisible();
    await expect(page.getByText('1961 - 2022')).toBeVisible();
    await expect(page.getByText(/As long/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /enter sonia's garden/i })).toBeVisible();
  });

  test('sky foyer play button is a player and does not navigate away', async ({ page }) => {
    await gotoRoute(page, withPreviewToken('/mum'));
    await expect(page).toHaveURL(`${BASE_URL}/mum`);
    const startingUrl = page.url();
    await page.getByRole('button', { name: /play without you here preview/i }).first().click();
    await expect(page).toHaveURL(startingUrl);
    const audio = page.locator('audio[data-song-title="Without You Here"]').first();
    await expect(audio).toHaveAttribute('data-song-artist', 'Gannon Waye');
  });

  test('garden page starts with image-led garden and sticky player', async ({ page }) => {
    await gotoRoute(page, withPreviewToken('/mum/garden'));
    await expect(page.getByRole('heading', { name: /Walk into Mum's garden/i })).toBeVisible();
    await expect(page.getByText(/Sonia first: her real garden, the single artwork, family memories/i)).toBeVisible();
    await expect(page.getByText(/From sky to backyard/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /Without You Here belongs at the front/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Macca's coffee run, every time/i })).toBeVisible();
    await expect(page.getByText(/Without You Here/i).first()).toBeVisible();
    await expect(page.locator('audio[data-song-title="Without You Here"]').first()).toHaveAttribute('data-song-artist', 'Gannon Waye');
  });

  test('garden page keeps approved feature sections available', async ({ page }) => {
    await gotoRoute(page, withPreviewToken('/mum/garden'));
    await page.locator('#photos').scrollIntoViewIfNeeded();
    await expect(page.getByText(/Memory Lane/i).first()).toBeVisible();
    await expect(page.getByText(/Tattoo scrapbook/i).first()).toBeVisible();
    await expect(page.getByText(/The things that made the garden feel like Sonia/i).first()).toBeVisible();
  });

  test('garden page has no horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoRoute(page, withPreviewToken('/mum/garden'));
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 2);
  });

  test('legacy predictable query values do not unlock the private garden', async ({ page }) => {
    for (const query of LEGACY_UNLOCK_QUERIES) {
      await gotoRoute(page, `/mum?${query}`);
      await expect(page.getByText(/Mum's Garden is being prepared with care/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /enter sonia's garden/i })).toHaveCount(0);
    }
  });
});
