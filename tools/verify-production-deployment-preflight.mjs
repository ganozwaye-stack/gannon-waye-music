import { existsSync, readFileSync } from 'node:fs';

const fail = [];
const read = path => existsSync(path) ? readFileSync(path, 'utf8') : (fail.push(`${path} is missing.`), '');
const pkg = JSON.parse(read('package.json'));
const scripts = pkg.scripts || {};
if (!scripts['deploy:preflight']?.includes('npm run test:acceptance')) fail.push('deploy:preflight must run acceptance.');
if (!scripts['deploy:site']?.includes('npm run deploy:preflight') || !scripts['deploy:site']?.includes('npx base44 site deploy -y')) fail.push('deploy:site must be preflighted and site-only.');
if (scripts.deploy !== 'npm run deploy:site') fail.push('deploy must alias deploy:site.');
const guide = read('STAGING_GUIDE.md');
for (const item of ['npm run deploy:site', 'site-only', 'does **not** prove functions, workflows, entities, connectors, or authentication settings', 'Read back after deployment']) if (!guide.includes(item)) fail.push(`STAGING_GUIDE.md lacks: ${item}`);
for (const path of ['base44/.app.jsonc', 'base44/functions/publishSingleWorkflow/entry.ts', 'base44/functions/deegoInternalDispatcher/entry.ts']) if (!existsSync(path)) fail.push(`Critical source missing: ${path}`);
if (fail.length) { console.error(fail.join('\n')); process.exit(1); }
console.log('Deployment preflight verified: canonical tests pass before site-only deployment; backend readback remains required.');
