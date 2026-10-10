import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const fixture = {
  id: 'livestream-test-only',
  live_stream_enabled: true,
  live_stream_status: 'scheduled',
  live_stream_title: 'Scheduled test broadcast',
  live_stream_provider: 'Facebook',
  live_stream_scheduled_at: '2026-10-07T09:00:00Z',
  live_stream_embed_url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fgann0nwaye%2Fvideos%2F123456%2F',
  live_stream_tiktok_url: 'https://www.tiktok.com/@gann0nwaye/live',
  tiktok_url: 'https://www.tiktok.com/@gann0nwaye',
  facebook_url: 'https://www.facebook.com/gann0nwaye',
};

// Seed only the local React Query cache. These scenarios never write SiteSettings
// or contact a broadcasting platform, and must not be run against production.
async function showSettings(page, overrides = {}) {
  await page.evaluate(async (settings) => {
    const { queryClientInstance } = await import('/src/lib/query-client.js');
    queryClientInstance.setQueryData(['public-livestream-settings'], [settings]);
  }, { ...fixture, ...overrides });
}

test.describe('Candidate live hub', () => {
  test.skip(!/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(BASE_URL), 'Local cache fixtures only');

  test.beforeEach(async ({ page }) => {
    await page.route(/https:\/\/.*(facebook\.com|tiktok\.com|youtube\.com).*/, route => route.abort());
    await page.goto(`${BASE_URL}/live`);
    await expect(page.getByTestId('live-hub').getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('public route has one main landmark and an offline hub', async ({ page }) => {
    await expect(page).toHaveURL(`${BASE_URL}/live`);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Gannon Waye Live', exact: true })).toBeVisible();
    await expect(page.getByText('No broadcast is live right now', { exact: true })).toBeVisible();
  });

  test('disabled broadcast hides its details and dedicated stream link', async ({ page }) => {
    await showSettings(page, { live_stream_enabled: false, live_stream_status: 'live' });
    await expect(page.getByText(fixture.live_stream_title, { exact: true })).toHaveCount(0);
    await expect(page.getByText('Broadcast via Facebook', { exact: true })).toHaveCount(0);
    await expect(page.getByTestId('live-hub')).not.toContainText('Melbourne time');
    await expect(page.getByRole('link', { name: /Watch on TikTok/ })).toHaveAttribute('href', fixture.tiktok_url);
    await expect(page.getByTestId('live-hub').locator('iframe')).toHaveCount(0);
  });

  test('scheduled broadcast has a Melbourne schedule and no player', async ({ page }) => {
    await showSettings(page);
    await expect(page.getByRole('heading', { name: fixture.live_stream_title, exact: true })).toBeVisible();
    await expect(page.getByTestId('live-hub')).toContainText('Melbourne time');
    await expect(page.getByTestId('live-hub').locator('iframe')).toHaveCount(0);
  });

  test('live public player renders and ended status removes it', async ({ page }) => {
    await showSettings(page, { live_stream_status: 'live' });
    await expect(page.getByTestId('live-hub').locator('iframe')).toHaveAttribute('src', fixture.live_stream_embed_url);
    await expect(page.getByRole('link', { name: /Watch on Facebook/ })).toHaveAttribute('href', fixture.facebook_url);
    await showSettings(page, { live_stream_status: 'ended' });
    await expect(page.getByTestId('live-hub').locator('iframe')).toHaveCount(0);
  });

  test('dashboard and off-platform URLs never become a player or platform button', async ({ page }) => {
    await showSettings(page, { live_stream_status: 'live', live_stream_embed_url: 'https://www.facebook.com/live/producer', live_stream_tiktok_url: 'https://example.com', facebook_url: 'https://example.com' });
    await expect(page.getByTestId('live-hub').locator('iframe')).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Watch on TikTok|Watch on Facebook/ })).toHaveCount(0);
  });

  test('waiting page refreshes settings without a reload', async ({ page }) => {
    await page.clock.install();
    await showSettings(page, { live_stream_status: 'live' });
    await expect(page.getByText('Live now', { exact: true })).toBeVisible();
    // Local SDK returns an empty settings list on the next interval fetch.
    await page.clock.fastForward(16_000);
    await expect(page.getByText('No broadcast is live right now', { exact: true })).toBeVisible();
  });
});
