/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');
const { createHash } = require('node:crypto');
const { existsSync, readdirSync, readFileSync, statSync } = require('node:fs');
const { resolve, relative } = require('node:path');

const REPOSITORY_ROOT = resolve(__dirname, '../../..');
const PUBLIC_AUDIO_ROOT = resolve(REPOSITORY_ROOT, 'public/audio/releases');
const PRIVATE_MUM_AUDIO_ROOT = resolve(REPOSITORY_ROOT, 'public/audio/mum');
const PRIVATE_HALLWAY_PUBLIC_ROOT = resolve(REPOSITORY_ROOT, 'public/video/mum');
const DIST_ROOT = resolve(REPOSITORY_ROOT, 'dist');
const FORMER_MASTER_NAME = ['without-you-here', 'full-master.mp3'].join('-');
const FORMER_MASTER_URL = `/audio/releases/${FORMER_MASTER_NAME}`;
const FORMER_MASTER_EXPORT = ['WITHOUT_YOU_HERE', 'FULL_AUDIO_URL'].join('_');
const APPROVED_PREVIEW_NAME = 'without-you-here-preview-3m46-4m35.mp3';
const APPROVED_PREVIEW_URL = `/audio/releases/${APPROVED_PREVIEW_NAME}`;
const RAW_HALLWAY_NAME = 'hallway-garden-source.mov';
const FORMER_MASTER_SHA256 = 'fef71c077747b070cd72610dc692e21f03484e263590e47861d1f821093d0ae4';

function walkFiles(root, ignored = new Set()) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    if (ignored.has(entry.name)) return [];
    const path = resolve(root, entry.name);
    return entry.isDirectory() ? walkFiles(path, ignored) : [path];
  });
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function sha256Buffer(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

test.describe('Without You Here master exposure regression', () => {
  test('only the approved 49 second preview exists in public Without You Here audio assets', () => {
    const files = walkFiles(PUBLIC_AUDIO_ROOT)
      .map(path => relative(PUBLIC_AUDIO_ROOT, path))
      .filter(name => name.startsWith('without-you-here'));

    expect(files).toEqual([APPROVED_PREVIEW_NAME]);
    expect(statSync(resolve(PUBLIC_AUDIO_ROOT, APPROVED_PREVIEW_NAME)).size).toBeLessThan(2_000_000);
    expect(existsSync(resolve(PUBLIC_AUDIO_ROOT, FORMER_MASTER_NAME))).toBe(false);
  });

  test('source, fixtures, manifests and documentation contain no former master reference or export', () => {
    const files = walkFiles(REPOSITORY_ROOT, new Set(['.git', 'node_modules', 'dist', 'playwright-report', 'test-results']));
    const offenders = [];

    for (const path of files) {
      const buffer = readFileSync(path);
      if (buffer.includes(Buffer.from(FORMER_MASTER_URL)) || buffer.includes(Buffer.from(FORMER_MASTER_EXPORT))) {
        offenders.push(relative(REPOSITORY_ROOT, path));
      }
    }

    expect(offenders).toEqual([]);
  });

  test('production build contains neither the former filename nor the former master binary', () => {
    const files = walkFiles(DIST_ROOT);
    const filenameOffenders = [];
    const binaryOffenders = [];

    for (const path of files) {
      const buffer = readFileSync(path);
      if (buffer.includes(Buffer.from(FORMER_MASTER_NAME))) filenameOffenders.push(relative(DIST_ROOT, path));
      if (sha256(path) === FORMER_MASTER_SHA256) binaryOffenders.push(relative(DIST_ROOT, path));
    }

    expect(filenameOffenders).toEqual([]);
    expect(binaryOffenders).toEqual([]);
  });

  test('production build does not contain private Mum voice-note audio files', () => {
    const publicPrivateAudioFiles = walkFiles(PRIVATE_MUM_AUDIO_ROOT)
      .map(path => relative(PRIVATE_MUM_AUDIO_ROOT, path));
    expect(publicPrivateAudioFiles.length, 'fixture confirms private source audio exists locally for the guard to protect').toBeGreaterThan(0);

    const distAudioFiles = walkFiles(resolve(DIST_ROOT, 'audio/mum'))
      .map(path => relative(resolve(DIST_ROOT, 'audio/mum'), path));
    expect(distAudioFiles).toEqual([]);
  });

  test('raw hallway source video is not stored or shipped as a public static asset', () => {
    expect(existsSync(resolve(PRIVATE_HALLWAY_PUBLIC_ROOT, RAW_HALLWAY_NAME))).toBe(false);

    const distFiles = walkFiles(DIST_ROOT).map(path => relative(DIST_ROOT, path));
    expect(distFiles.filter(path => path.includes(RAW_HALLWAY_NAME))).toEqual([]);
    expect(distFiles.filter(path => path.startsWith('video/mum'))).toEqual([]);
  });

  test('private hallway dev video source is env-only and not hard-coded to a local personal path', () => {
    const config = readFileSync(resolve(REPOSITORY_ROOT, 'vite.config.js'), 'utf8');
    expect(config).toContain('process.env.MUM_HALLWAY_VIDEO_SOURCE');
    expect(config).not.toMatch(/iCloudPhotos|C:\/Users\/ganno/i);
  });

  test('private Mum voice-note audio URLs are blocked in local preview', async ({ request }) => {
    const response = await request.get('/audio/mum/voicemail.m4a');
    expect([404, 410]).toContain(response.status());
  });

  test('former public master URL does not return the former audio asset', async ({ request }) => {
    const response = await request.get(FORMER_MASTER_URL);
    if ([404, 410].includes(response.status())) return;

    const body = await response.body();
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type'] || '').not.toMatch(/audio|mpeg|octet-stream/i);
    expect(body.length).toBeLessThan(1_000_000);
    expect(sha256Buffer(body)).not.toBe(FORMER_MASTER_SHA256);
  });

  test('every exposed Without You Here player uses only the approved preview', async ({ page }) => {
    for (const route of [
      '/mum?access=soniagarden2026',
      '/mum/garden?access=soniagarden2026',
      '/without-you-here?access=soniagarden2026',
    ]) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const sources = await page.locator('audio[data-song-title="Without You Here"]').evaluateAll(nodes =>
        nodes.map(node => node.getAttribute('src'))
      );
      expect(sources.every(source => source === APPROVED_PREVIEW_URL)).toBe(true);
    }
  });
});
