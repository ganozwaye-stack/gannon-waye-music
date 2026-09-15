import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const failures = [];
const read = path => {
  const target = resolve(path);
  if (!existsSync(target)) {
    failures.push(`${path} is missing.`);
    return '';
  }
  return readFileSync(target, 'utf8');
};

const pkg = JSON.parse(read('package.json'));
const scripts = pkg.scripts || {};
if (!scripts['deploy:preflight']?.includes('npm run test:acceptance')) {
  failures.push('deploy:preflight must run the complete no-deploy acceptance suite.');
}
if (!scripts['deploy:site']?.includes('npm run deploy:preflight') || !scripts['deploy:site']?.includes('npx base44 site deploy -y')) {
  failures.push('deploy:site must run the preflight before the explicit site-only Base44 command.');
}
if (scripts.deploy !== 'npm run deploy:site') {
  failures.push('deploy must remain an explicit alias for the preflighted site-only deployment path.');
}

const guide = read('STAGING_GUIDE.md');
for (const phrase of [
  'npm run test:acceptance',
  'npm run deploy:site',
  'site-only',
  'does **not** prove functions, workflows, entities, connectors, or authentication settings',
  'Read back after deployment',
]) {
  if (!guide.includes(phrase)) failures.push(`STAGING_GUIDE.md is missing deployment-truth instruction: ${phrase}`);
}

for (const path of [
  'base44/.app.jsonc',
  'base44/functions/publishSingleWorkflow/entry.ts',
  'base44/functions/deegoInternalDispatcher/entry.ts',
  'tools/verify-release-control-integrity.mjs',
  'tools/verify-deego-internal-lane.mjs',
]) {
  if (!existsSync(resolve(path))) failures.push(`Critical deployment-preflight source is missing: ${path}`);
}

if (failures.length) {
  console.error('Production deployment preflight check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Production deployment preflight verified: canonical acceptance must pass; site-only deployment still requires backend/readback proof.');
