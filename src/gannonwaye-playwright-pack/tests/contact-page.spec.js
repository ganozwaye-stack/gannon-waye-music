// @ts-check
 
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Contact Page', () => {
  test('contact page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('contact page has correct heading text', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Contact');
  });

  test('contact page does NOT mention bookings in CTA copy', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    const body = await page.locator('body').innerText();
    // "bookings" must not appear in public CTAs (allow only as part of enquiries context)
    const bookingCount = (body.match(/\bbook Gannon\b|\blive booking\b|\bbooking enquiry\b/gi) || []).length;
    expect(bookingCount).toBe(0);
  });

  test('contact page Spotify link points to artist profile', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    const spotifyLink = page.locator('a[href*="open.spotify.com/artist"]');
    await expect(spotifyLink).toBeVisible();
    const href = await spotifyLink.getAttribute('href');
    expect(href).toContain('open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz');
  });

  test('contact page email link is present', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    const emailLink = page.locator('a[href^="mailto:"]').first();
    await expect(emailLink).toBeVisible();
  });

  test('contact page has no inline yellow/amber style attributes', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    const yellowElements = await page.evaluate(() => {
      const all = document.querySelectorAll('[style]');
      const hits = [];
      all.forEach(el => {
        const s = el.getAttribute('style') || '';
        if (/yellow|#facc15|#eab308|#fde047|#fbbf24|#f59e0b/i.test(s)) {
          hits.push(el.tagName + ':' + s);
        }
      });
      return hits;
    });
    expect(yellowElements).toHaveLength(0);
  });

  test('contact form is visible and has required fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    const form = page.locator('form').first();
    await expect(form.locator('input[placeholder="Your name"]')).toBeVisible();
    await expect(form.locator('input[type="email"]')).toBeVisible();
    await expect(form.locator('button[type="submit"]')).toBeVisible();
  });

  test('Instagram link is present and correct', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    const igLink = page.locator('a[href*="instagram.com/ganozwaye"]').first();
    await expect(igLink).toBeVisible();
  });

  test('TikTok link is present and correct', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    const ttLink = page.locator('a[href*="tiktok.com/@gannonwaye"]').first();
    await expect(ttLink).toBeVisible();
  });
});