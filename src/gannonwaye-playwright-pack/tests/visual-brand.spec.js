/* eslint-disable no-undef */
// @ts-check
 
 
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

const PUBLIC_ROUTES = ['/', '/music', '/store', '/contact', '/community', '/videos', '/this-is-my-life'];

// Check that no Tailwind yellow/amber/orange classes are present in rendered HTML
// These are the raw class names that are NOT part of the gold token system
const BANNED_CLASSES = [
  'text-yellow-', 'bg-yellow-', 'border-yellow-', 'ring-yellow-',
  'text-amber-', 'bg-amber-', 'border-amber-', 'ring-amber-',
  'text-orange-', 'bg-orange-', 'border-orange-',
  'from-yellow', 'to-yellow', 'via-yellow',
  'from-amber', 'to-amber', 'via-amber',
];

test.describe('Visual Brand Audit — Gold Token Compliance', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`no raw yellow/amber classes on ${route}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route}`);
      // Wait for page to settle
      await page.waitForTimeout(1000);

      const violations = await page.evaluate((bannedClasses) => {
        const allElements = document.querySelectorAll('[class]');
        const hits = [];
        allElements.forEach(el => {
          const classes = el.getAttribute('class') || '';
          bannedClasses.forEach(banned => {
            if (classes.includes(banned)) {
              hits.push(`${el.tagName.toLowerCase()}: "${banned}" in "${classes.substring(0, 80)}"`);
            }
          });
        });
        return hits;
      }, BANNED_CLASSES);

      if (violations.length > 0) {
        console.log(`Yellow/amber violations on ${route}:`, violations);
      }
      expect(violations).toHaveLength(0);
    });
  }

  test('no raw yellow inline styles on homepage', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    const yellowInline = await page.evaluate(() => {
      const all = document.querySelectorAll('[style]');
      const hits = [];
      all.forEach(el => {
        const s = el.getAttribute('style') || '';
        if (/\byellow\b|#facc15|#eab308|#fde047|#fbbf24|#f59e0b/i.test(s)) {
          hits.push(el.tagName + ' style="' + s.substring(0, 80) + '"');
        }
      });
      return hits;
    });
    expect(yellowInline).toHaveLength(0);
  });

  test('store active nav uses gold token not raw yellow', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    const activeNavYellow = await page.evaluate(() => {
      const navLinks = document.querySelectorAll('nav a');
      const hits = [];
      navLinks.forEach(el => {
        const classes = el.getAttribute('class') || '';
        if (/text-yellow|bg-yellow|text-amber|bg-amber/.test(classes)) {
          hits.push(classes.substring(0, 80));
        }
      });
      return hits;
    });
    expect(activeNavYellow).toHaveLength(0);
  });

  test('no public booking/tour/live links in navbar', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    const navLinks = await page.locator('nav a').allInnerTexts();
    const forbidden = navLinks.filter(t =>
      /\blive\b|\bbookings?\b|\btours?\b|\bshows?\b|\bevents?\b/i.test(t)
    );
    expect(forbidden).toHaveLength(0);
  });

  test('Spotify artist link is correct on contact page', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    const spotifyLinks = await page.locator('a[href*="spotify.com"]').all();
    for (const link of spotifyLinks) {
      const href = await link.getAttribute('href');
      // Must not be a search link
      expect(href).not.toContain('/search/');
      expect(href).toContain('open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz');
    }
  });
});