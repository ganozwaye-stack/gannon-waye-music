// @ts-check
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const ACCESS = 'soniagarden2026';

const gotoRoute = (page, route) => page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });

test.describe("Mum's Garden launch pages", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('gwm-song-feedback-submitted:without-you-here', 'true');
    });
  });

  test('sky foyer loads as the public entry point', async ({ page }) => {
    await gotoRoute(page, `/mum?access=${ACCESS}`);
    await expect(page.getByText('In loving memory of').first()).toBeVisible();
    await expect(page.getByText(/Sonia/i).first()).toBeVisible();
    await expect(page.getByText(/Katisa Waye/i).first()).toBeVisible();
    await expect(page.getByText('1961 - 2022')).toBeVisible();
    await expect(page.getByText(/As long/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /enter sonia's garden/i })).toBeVisible();
  });

  test('sky foyer play button is a player and does not navigate away', async ({ page }) => {
    await gotoRoute(page, `/mum?access=${ACCESS}`);
    const startingUrl = page.url();
    await page.getByRole('button', { name: /play without you here preview/i }).first().click();
    await expect(page).toHaveURL(startingUrl);
    const audio = page.locator('audio[data-song-title="Without You Here"]').first();
    await expect(audio).toHaveAttribute('data-song-artist', 'Gannon Waye');
  });

  test('garden page starts with welcome and the long horizontal player', async ({ page }) => {
    await gotoRoute(page, `/mum/garden?access=${ACCESS}`);
    await expect(page.getByText("Welcome to Sonia's Garden")).toBeVisible();
    await expect(page.getByText(/A soft walk through the world she left behind/i)).toBeVisible();
    await expect(page.getByText(/Without You Here/i).first()).toBeVisible();
    await expect(page.locator('audio[data-song-title="Without You Here"]').first()).toHaveAttribute('data-song-artist', 'Gannon Waye');
  });

  test('garden page keeps approved feature sections available', async ({ page }) => {
    await gotoRoute(page, `/mum/garden?access=${ACCESS}`);
    await page.locator('#photos').scrollIntoViewIfNeeded();
    await expect(page.getByText(/Memory Lane/i).first()).toBeVisible();
    await expect(page.getByText(/Tattoo scrapbook/i).first()).toBeVisible();
    await expect(page.getByText(/The things that made the garden feel like Sonia/i).first()).toBeVisible();
  });

  test('garden page has no horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoRoute(page, `/mum/garden?access=${ACCESS}`);
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 2);
  });
});
