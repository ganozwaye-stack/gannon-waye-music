import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve('.');
const failures = [];
const read = (path) => {
  const target = resolve(ROOT, path);
  if (!existsSync(target)) {
    failures.push(`${path} is missing.`);
    return '';
  }
  return readFileSync(target, 'utf8');
};

const required = [
  ['src/components/public/SetFreeHero.jsx', 'if (!heroRelease) return null;'],
  ['src/pages/PreSave.jsx', 'onlyPublicReleases'],
  ['src/components/public/LiveFeedSection.jsx', 'PUBLIC_RELEASE_FILTER'],
  ['src/components/public/LiveFeedSection.jsx', 'onlyPublicReleases'],
  ['src/components/public/HomeCharts.jsx', 'PUBLIC_RELEASE_FILTER'],
  ['src/components/public/HomeCharts.jsx', 'onlyPublicReleases'],
  ['src/pages/Music.jsx', '<ReleaseGallery releaseTitle={featured?.title} />'],
  ['src/components/public/ReleaseGallery.jsx', 'if (!hasPublicRelease || isLoading || images.length === 0) return null;'],
  ['base44/workflows/Auto-Post New Release to Instagram.jsonc', '"condition": "${ false }"'],
  ['base44/workflows/Publish Due Releases (Midnight).jsonc', '"condition": "${ false }"'],
  ['base44/workflows/Notify Subscribers on New Release.jsonc', '"condition": "${ false }"'],
  ['base44/functions/notifySubscribersNewRelease/function.jsonc', '"is_active": false'],
  ['base44/functions/submitNewRelease/entry.ts', 'auto_publish_on_release_date: false'],
  ['base44/functions/submitNewRelease/entry.ts', 'publishing_safe: false'],
  ['base44/functions/submitNewRelease/entry.ts', "external_actions: 'held'"],
  ['base44/functions/prepareReleaseEmailDraft/entry.ts', "release.is_published === true"],
  ['base44/functions/prepareReleaseEmailDraft/entry.ts', "release.status === 'released'"],
  ['base44/functions/prepareReleaseEmailDraft/entry.ts', 'OWNER_EMAILS.has'],
  ['base44/functions/prepareReleaseEmailDraft/entry.ts', 'Gannon owner sign-in required to prepare a release email draft.'],
  ['src/pages/admin/ReleaseEmailStudio.jsx', 'const eligibleReleases = releases.filter'],
  ['src/pages/admin/ReleaseEmailStudio.jsx', 'No release currently meets the full public-release approval gate'],
  ['src/components/admin/ReleaseEmailDraftCard.jsx', 'buildEditedEmailHtml'],
  ['src/components/admin/ReleaseEmailDraftCard.jsx', 'body_html: buildEditedEmailHtml(bodyText)'],
  ['src/components/admin/ReleaseEmailDraftCard.jsx', 'window.confirm'],
  ['base44/functions/sendReleaseEmailDraft/entry.ts', "release?.is_published === true"],
  ['base44/functions/sendReleaseEmailDraft/entry.ts', "release?.status === 'released'"],
  ['base44/functions/sendReleaseEmailDraft/entry.ts', 'Gannon owner sign-in required.'],
  ['base44/functions/postReleaseToSocial/entry.ts', 'Automatic Instagram publication is disabled.'],
  ['base44/functions/notifyFansReleaseStatus/entry.ts', 'Automatic fan release-status email is disabled.'],
  ['base44/functions/notifySubscribersNewRelease/entry.ts', 'Automatic subscriber notification is disabled.'],
  ['base44/functions/publishDueReleases/entry.ts', 'Automatic release publication is disabled.'],
];

const forbidden = [
  ['src/components/public/UpcomingMerchVote.jsx', /Set Free/],
  ['src/components/public/ReleaseGallery.jsx', /releaseTitle\s*=\s*['"]Set Free['"]/],
  ['src/components/public/LiveFeedSection.jsx', /Release\.filter\(\{\s*is_published:\s*true\s*\}/],
  ['src/components/public/HomeCharts.jsx', /Release\.list\(/],
  ['base44/functions/postReleaseToSocial/entry.ts', /graph\.instagram\.com|media_publish|postToInstagram/],
  ['base44/functions/notifyFansReleaseStatus/entry.ts', /integrations\.Core\.SendEmail/],
  ['base44/functions/notifySubscribersNewRelease/entry.ts', /ApprovalQueue\.create|integrations\.Core\.SendEmail/],
  ['base44/functions/prepareReleaseEmailDraft/entry.ts', /integrations\.Core\.SendEmail/],
  ['src/pages/admin/ReleaseEmailStudio.jsx', /Every time a release status changes/],
];

for (const [path, snippet] of required) {
  if (!read(path).includes(snippet)) failures.push(`${path} is missing required public-release gate: ${snippet}`);
}

for (const [path, pattern] of forbidden) {
  if (pattern.test(read(path))) failures.push(`${path} contains forbidden draft-release bypass: ${pattern}`);
}

if (failures.length > 0) {
  console.error('Public release gate check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Public release gate check verified.');
