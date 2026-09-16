// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const REPO_ROOT = process.cwd();
const SECRET_SIGNATURES = [
  /sk_live_[A-Za-z0-9]{12,}/,
  /ghp_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];

test.describe('Public surface and CI security controls', () => {
  test('public pages do not expose private credential signatures', async ({ page }) => {
    for (const route of ['/', '/music', '/store']) {
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');

      const html = await page.locator('html').innerHTML();
      for (const signature of SECRET_SIGNATURES) {
        expect(html, `credential-like value exposed at ${route}: ${signature}`).not.toMatch(signature);
      }
    }
  });

  test('public pages do not render development error overlays or stack traces', async ({ page }) => {
    for (const route of ['/', '/music', '/store']) {
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');

      await expect(page.locator('vite-error-overlay')).toHaveCount(0);
      const body = await page.locator('body').innerText();
      expect(body).not.toContain('Internal Server Error');
      expect(body).not.toContain('ReferenceError:');
      expect(body).not.toContain('TypeError:');
    }
  });

  test('secret scanning is official, immutable and non-verifying', async () => {
    const workflow = fs.readFileSync(path.join(REPO_ROOT, '.github/workflows/all-tests.yml'), 'utf8');

    expect(workflow).toMatch(/uses:\s*trufflesecurity\/trufflehog@[a-f0-9]{40}/);
    expect(workflow).toContain('persist-credentials: false');
    expect(workflow).toContain('--no-verification');
    expect(workflow).not.toContain('trufflesecurity/trufflehog-actions@');
  });
});
