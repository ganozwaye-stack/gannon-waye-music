import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve('.');
const read = (path) => readFileSync(resolve(ROOT, path), 'utf8');

const required = [
  ['src/components/public/SetFreeHero.jsx', 'if (!heroRelease) return null;'],
  ['src/pages/PreSave.jsx', 'onlyPublicReleases'],
  ['src/components/public/LiveFeedSection.jsx', 'PUBLIC_RELEASE_FILTER'],
  ['src/components/public/LiveFeedSection.jsx', 'onlyPublicReleases'],
  ['src/components/public/HomeCharts.jsx', 'PUBLIC_RELEASE_FILTER'],
  ['src/components/public/HomeCharts.jsx', 'onlyPublicReleases'],
  ['src/pages/Music.jsx', '<ReleaseGallery releaseTitle={featured?.title} />'],
  ['src/components/public/ReleaseGallery.jsx', 'if (!hasPublicRelease || isLoading || images.length === 0) return null;'],
  ['base44/workflows/Auto-Post New Release to Instagram.jsonc', '"condition": "false"'],
  ['base44/workflows/Publish Due Releases (Midnight).jsonc', '"condition": "false"'],
  ['base44/functions/submitNewRelease/entry.ts', 'const autoPublish = false;'],
  ['base44/functions/submitNewRelease/entry.ts', 'publishing_safe: false'],
  ['base44/functions/submitNewRelease/entry.ts', 'const allowDistributionPush = false;'],
  ['base44/functions/prepareReleaseEmailDraft/entry.ts', "release.is_published === true"],
  ['base44/functions/prepareReleaseEmailDraft/entry.ts', "release.status === 'released'"],
  ['base44/functions/publishDueReleases/entry.ts', 'Automatic release publication is disabled.'],
];

const forbidden = [
  ['src/components/public/UpcomingMerchVote.jsx', /Set Free/],
  ['src/components/public/ReleaseGallery.jsx', /releaseTitle\s*=\s*['"]Set Free['"]/],
  ['src/components/public/LiveFeedSection.jsx', /Release\.filter\(\{\s*is_published:\s*true\s*\}/],
  ['src/components/public/HomeCharts.jsx', /Release\.list\(/],
];

const failures = [];

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