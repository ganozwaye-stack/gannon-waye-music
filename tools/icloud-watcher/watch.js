#!/usr/bin/env node
/*
 * Local iCloud media watcher for Gannon Waye.
 * Uploads downloaded iCloud files into Base44 via /functions/icloudIngest.
 * Does not delete, move, rename, or alter original files.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const WATCH_DIR = process.env.ICLOUD_WATCH_DIR || path.join(process.env.USERPROFILE || process.env.HOME || '.', 'iCloudPhotos', 'Photos');
const BASE44_APP_URL = (process.env.BASE44_APP_URL || 'https://gannonwaye.base44.app').replace(/\/$/, '');
const INGEST_KEY = process.env.ICLOUD_INGEST_KEY;
const STATE_PATH = process.env.ICLOUD_WATCH_STATE || path.join(__dirname, '.icloud-ingest-state.json');
const DRY_RUN = String(process.env.ICLOUD_DRY_RUN || '').toLowerCase() === 'true';
const MAX_FILES = Number(process.env.ICLOUD_MAX_FILES || 50);
const MIN_STABLE_SECONDS = Number(process.env.ICLOUD_MIN_STABLE_SECONDS || 60);
const MAX_BYTES = Number(process.env.ICLOUD_MAX_BYTES || 250 * 1024 * 1024);
const EXTENSIONS = new Set((process.env.ICLOUD_EXTENSIONS || '.jpg,.jpeg,.png,.webp,.heic,.heif,.mov,.mp4,.m4v,.mp3,.wav,.aiff,.aif,.flac,.m4a')
  .split(',')
  .map(v => v.trim().toLowerCase())
  .filter(Boolean));

if (!INGEST_KEY) {
  fail('ICLOUD_INGEST_KEY is required. Put it in your local environment or .env runner wrapper.');
}

main().catch(err => fail(err.stack || err.message || String(err)));

async function main() {
  if (!fs.existsSync(WATCH_DIR)) fail(`Watch directory does not exist: ${WATCH_DIR}`);
  const state = readState();
  const files = listFiles(WATCH_DIR)
    .filter(file => EXTENSIONS.has(path.extname(file).toLowerCase()))
    .map(file => ({ file, stat: fs.statSync(file) }))
    .filter(item => item.stat.isFile())
    .filter(item => Date.now() - item.stat.mtimeMs >= MIN_STABLE_SECONDS * 1000)
    .filter(item => item.stat.size > 0 && item.stat.size <= MAX_BYTES)
    .sort((a, b) => a.stat.mtimeMs - b.stat.mtimeMs);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of files) {
    if (uploaded >= MAX_FILES) break;
    const sha256 = hashFile(item.file);
    const key = `${sha256}:${item.stat.size}`;
    if (state.uploaded[key]) {
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`[dry-run] would upload ${item.file}`);
      skipped++;
      continue;
    }

    try {
      const result = await uploadFile(item.file, item.stat, sha256);
      state.uploaded[key] = {
        path: item.file,
        uploaded_at: new Date().toISOString(),
        response: result,
      };
      writeState(state);
      uploaded++;
      console.log(`[uploaded] ${item.file}`);
    } catch (err) {
      failed++;
      console.error(`[failed] ${item.file}: ${err.message}`);
    }
  }

  console.log(JSON.stringify({ watch_dir: WATCH_DIR, considered: files.length, uploaded, skipped, failed }, null, 2));
  if (failed > 0) process.exitCode = 2;
}

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full));
    else out.push(full);
  }
  return out;
}

function hashFile(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

async function uploadFile(filePath, stat, sha256) {
  const body = {
    file_name: path.basename(filePath),
    mime_type: mimeFromExt(path.extname(filePath).toLowerCase()),
    source_path: filePath,
    file_size: stat.size,
    modified_at: stat.mtime.toISOString(),
    sha256,
    file_base64: fs.readFileSync(filePath).toString('base64'),
  };

  const response = await fetch(`${BASE44_APP_URL}/functions/icloudIngest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-icloud-ingest-key': INGEST_KEY,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let parsed;
  try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
  if (!response.ok || parsed.error) {
    throw new Error(parsed.error || `HTTP ${response.status}: ${text.slice(0, 200)}`);
  }
  return parsed;
}

function mimeFromExt(ext) {
  const map = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.heic': 'image/heic', '.heif': 'image/heif',
    '.mov': 'video/quicktime', '.mp4': 'video/mp4', '.m4v': 'video/x-m4v', '.webm': 'video/webm',
    '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.aiff': 'audio/aiff', '.aif': 'audio/aiff', '.flac': 'audio/flac', '.m4a': 'audio/mp4',
  };
  return map[ext] || 'application/octet-stream';
}

function readState() {
  if (!fs.existsSync(STATE_PATH)) return { uploaded: {} };
  return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
}

function writeState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
