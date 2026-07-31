// @ts-check
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const PREVIEW_TOKEN = process.env.MUM_GARDEN_PLAYWRIGHT_PREVIEW_TOKEN || 'local-mum-garden-preview-token-for-playwright-2026-07-31';

test('song feedback prompt does not block the Without You Here preview from playing', async ({ page }) => {
  await page.addInitScript(() => {
    window.__gwmMediaCalls = { play: 0, pause: 0 };

    HTMLMediaElement.prototype.play = function play() {
      window.__gwmMediaCalls.play += 1;
      this.dispatchEvent(new Event('play', { bubbles: true }));
      return Promise.resolve();
    };

    HTMLMediaElement.prototype.pause = function pause() {
      window.__gwmMediaCalls.pause += 1;
      this.dispatchEvent(new Event('pause', { bubbles: true }));
    };
  });

  await page.goto(`${BASE_URL}/mum?preview_token=${encodeURIComponent(PREVIEW_TOKEN)}`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/In loving memory of/i).first()).toBeVisible();

  await page.evaluate(() => {
    window.__gwmMediaCalls = { play: 0, pause: 0 };
  });

  await page.getByRole('button', { name: /play without you here preview/i }).first().click();

  await expect(page.getByText('While you listen')).toBeVisible();
  await expect(page.getByText('Tell Gannon what lands.')).toBeVisible();

  const calls = await page.evaluate(() => window.__gwmMediaCalls);
  expect(calls.play).toBeGreaterThan(0);
  expect(calls.pause).toBe(0);
});
