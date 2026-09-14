import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve('.');
const failures = [];

function read(path) {
  const target = resolve(ROOT, path);
  if (!existsSync(target)) {
    failures.push(path + ' is missing.');
    return '';
  }
  return readFileSync(target, 'utf8');
}

function requireSnippet(path, snippet) {
  if (!read(path).includes(snippet)) {
    failures.push(path + ' is missing required release-control evidence: ' + snippet);
  }
}

function forbid(path, pattern, label) {
  if (pattern.test(read(path))) {
    failures.push(path + ' contains a forbidden release-control path: ' + label);
  }
}

const deskPath = 'src/pages/admin/ReleaseControlDesk.jsx';
requireSnippet(deskPath, "base44.functions.invoke('publishSingleWorkflow'");
requireSnippet(deskPath, "action: 'review'");
requireSnippet(deskPath, 'confirm_release_fingerprint');
requireSnippet(deskPath, 'confirm_revoke_phrase');
requireSnippet(deskPath, 'window.confirm');
requireSnippet(deskPath, 'REVIEW_MAX_AGE_MS');
requireSnippet(deskPath, 'review_key');
requireSnippet(deskPath, 'reviewed_at_ms');
requireSnippet(deskPath, "String(action || '').toUpperCase() + ' ' + exact(title)");
requireSnippet(deskPath, 'Review is read-only.');
forbid(
  deskPath,
  /base44\.entities\.Release\.(?:create|update|updateMany|delete)\s*\(/,
  'browser-side Release mutation',
);
forbid(
  deskPath,
  /base44\.integrations\.|Core\.SendEmail|UploadFile|fetch\(/,
  'browser-side external action',
);

requireSnippet('src/App.jsx', "import ReleaseControlDesk from '@/pages/admin/ReleaseControlDesk';");
requireSnippet('src/App.jsx', '<Route path="/admin/release-control" element={<ReleaseControlDesk />} />');
requireSnippet('src/components/admin/AdminLayout.jsx', "label: 'Release Control Desk'");
requireSnippet('src/components/admin/AdminLayout.jsx', "path: '/admin/release-control'");
requireSnippet('src/components/admin/AdminLayout.jsx', 'ownerOnly: true');

if (failures.length) {
  console.error('Release Control Desk check failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('Release Control Desk verified: review is local/read-only and controlled actions require a fresh fingerprint plus browser confirmation.');
