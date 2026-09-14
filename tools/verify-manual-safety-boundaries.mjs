import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve('.');
const failures = [];

function read(path) {
  const target = resolve(ROOT, path);
  if (!existsSync(target)) {
    failures.push(`${path} is missing.`);
    return '';
  }
  return readFileSync(target, 'utf8');
}

function requireSnippet(path, snippet) {
  if (!read(path).includes(snippet)) {
    failures.push(`${path} is missing required safety-hold evidence: ${snippet}`);
  }
}

function forbid(path, pattern, label) {
  if (pattern.test(read(path))) {
    failures.push(`${path} contains a forbidden manual safety bypass: ${label}`);
  }
}

const heldEndpoints = [
  'base44/functions/sendBirthdayDiscount/entry.ts',
  'base44/functions/metricoolSchedulePost/entry.ts',
  'base44/functions/publishApprovedReel/entry.ts',
  'base44/functions/postReelToInstagram/entry.ts',
  'base44/functions/tiktokUploadDraft/entry.ts',
  'base44/functions/autonomousSocialPoster/entry.ts',
  'base44/functions/syncDeegoReportsToSheets/entry.ts',
];

for (const path of heldEndpoints) {
  requireSnippet(path, 'Safety hold');
  requireSnippet(path, 'skipped: true');
}

requireSnippet('src/pages/admin/Releases.jsx', 'legacy register is read-only');
requireSnippet('src/pages/admin/Releases.jsx', 'hasFullPublicReleaseGate');
forbid('src/pages/admin/Releases.jsx', /base44\.entities\.Release\.(?:create|update|updateMany|delete)\s*\(/, 'direct Release mutation');
forbid('src/pages/admin/Releases.jsx', /promoteMutation|publishSingleMutation|Published \(visible on site\)/, 'legacy public-release control');

requireSnippet('src/pages/admin/AutonomousOps.jsx', 'Safety hold active');
forbid('src/pages/admin/AutonomousOps.jsx', /base44\.functions\.invoke|ApprovalQueue\.update|updateApproval/, 'legacy automation execution or approval mutation');

requireSnippet('src/pages/admin/ContentAutomate.jsx', 'Safety hold active');
forbid('src/pages/admin/ContentAutomate.jsx', /base44\.functions\.invoke|handleRunAutomation|Run Generator/, 'legacy content-generator execution');

forbid('base44/functions/sendBirthdayDiscount/entry.ts', /Core\.SendEmail|PromoCode\.(?:create|update)/, 'customer email or live discount-code creation');
forbid('base44/functions/metricoolSchedulePost/entry.ts', /fetch\(|autoPublish|createClientFromRequest/, 'Metricool network scheduling');
forbid('base44/functions/publishApprovedReel/entry.ts', /functions\.invoke|postReelToInstagram|tiktokUploadDraft/, 'Reel connector invocation');
forbid('base44/functions/postReelToInstagram/entry.ts', /graph\.instagram\.com|media_publish|fetch\(/, 'Instagram Graph publication');
forbid('base44/functions/tiktokUploadDraft/entry.ts', /fetch\(|createClientFromRequest|integrations\./, 'TikTok external upload');
forbid('base44/functions/autonomousSocialPoster/entry.ts', /InvokeLLM|sendSlackAlert|createClientFromRequest|asServiceRole/, 'paid generation, data mutation, or Slack send');
forbid('base44/functions/syncDeegoReportsToSheets/entry.ts', /upsertRow|createClientFromRequest|integrations\./, 'Google Sheets connector write');

requireSnippet('base44/functions/deegoTelegram/entry.ts', 'if (!expected || got !== expected)');

if (failures.length > 0) {
  console.error('Manual safety-boundary check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Critical manual safety boundaries verified.');
