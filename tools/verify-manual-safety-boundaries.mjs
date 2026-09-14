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
  'base44/functions/aiFanReply/entry.ts',
  'base44/functions/fanPostNotification/entry.ts',
  'base44/functions/notifyFanReminderRegistration/entry.ts',
  'base44/functions/onNewOrderAlert/entry.ts',
  'base44/functions/onDriveChange/entry.ts',
  'base44/functions/syncFanWallToSheets/entry.ts',
  'base44/functions/syncInventoryToSheets/entry.ts',
  'base44/functions/syncOrderToSheets/entry.ts',
  'base44/functions/syncSubscriberToSheets/entry.ts',
  'base44/functions/postApprovedToTiktok/entry.ts',
  'base44/functions/onMemorySubmission/entry.ts',
  'base44/functions/sendFanReminders/entry.ts',
  'base44/functions/syncOrderNotifications/entry.ts',
  'base44/functions/syncOrderToSheet/entry.ts',
  'base44/functions/onNewOrderSlack/entry.ts',
  'base44/functions/generateResearchedSocialContent/entry.ts',
  'base44/functions/icloudIngest/entry.ts',
];

for (const path of heldEndpoints) {
  requireSnippet(path, 'Safety hold');
  requireSnippet(path, 'skipped: true');
  forbid(
    path,
    /fetch\(|Core\.SendEmail|InvokeLLM|GenerateImage|functions\.invoke|connectors\.getConnection|integrations\./,
    'network, connector, paid-generation, or outbound-action code',
  );
}

requireSnippet('src/pages/admin/Releases.jsx', 'legacy register is read-only');
requireSnippet('src/pages/admin/Releases.jsx', 'hasFullPublicReleaseGate');
requireSnippet('base44/entities/Release.jsonc', '"create": false');
requireSnippet('base44/entities/Release.jsonc', '"update": false');
requireSnippet('base44/entities/Release.jsonc', '"delete": false');
requireSnippet('base44/entities/Release.jsonc', '"data.public_release_approved_by": "ganozwaye@gmail.com"');
requireSnippet('base44/entities/Release.jsonc', '"data.public_release_approved_at": {');
forbid('src/pages/admin/Releases.jsx', /base44\.entities\.Release\.(?:create|update|updateMany|delete)\s*\(/, 'direct Release mutation');
forbid('src/pages/admin/Releases.jsx', /promoteMutation|publishSingleMutation|Published \(visible on site\)/, 'legacy public-release control');

requireSnippet('src/pages/admin/NewReleaseStudio.jsx', 'private_draft_acknowledged');
requireSnippet('src/pages/admin/NewReleaseStudio.jsx', 'only a private release record and blank review drafts');
forbid('src/pages/admin/NewReleaseStudio.jsx', /AI-quota|costAcknowledged/, 'obsolete automatic-draft acknowledgement');
requireSnippet('base44/functions/submitNewRelease/entry.ts', 'private_draft_acknowledged');
requireSnippet('base44/functions/submitNewRelease/entry.ts', "external_actions: 'held'");
requireSnippet('base44/functions/submitNewRelease/entry.ts', 'auto_publish_on_release_date: false');
forbid(
  'base44/functions/submitNewRelease/entry.ts',
  /InvokeLLM|GenerateImage|fetch\(|tooLostAuth|secrets|waitUntil|integrations\./,
  'automatic generation, delivery, or connector code in the private-draft flow',
);
requireSnippet('src/components/admin/ReleasePackReport.jsx', 'All external actions are held');

requireSnippet('src/pages/admin/AutonomousOps.jsx', 'Safety hold active');
forbid('src/pages/admin/AutonomousOps.jsx', /base44\.functions\.invoke|ApprovalQueue\.update|updateApproval/, 'legacy automation execution or approval mutation');

requireSnippet('src/pages/admin/ContentAutomate.jsx', 'Safety hold active');
forbid('src/pages/admin/ContentAutomate.jsx', /base44\.functions\.invoke|handleRunAutomation|Run Generator/, 'legacy content-generator execution');

requireSnippet('base44/functions/deegoTelegram/entry.ts', 'if (!expected || got !== expected)');

if (failures.length > 0) {
  console.error('Manual safety-boundary check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Critical manual safety boundaries verified.');
