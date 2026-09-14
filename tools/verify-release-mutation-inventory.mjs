import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const ROOT = resolve('.');
const failures = [];
const allowedFunctionMutators = new Set([
  'base44/functions/submitNewRelease/entry.ts',
  'base44/functions/publishSingleWorkflow/entry.ts',
]);
const releaseMutation = /\.entities\.Release\.(?:create|update|updateMany|delete)\s*\(/;
const directClientMutation = /base44\.entities\.Release\.(?:create|update|updateMany|delete)\s*\(/;

function walk(relativeDir, extensions) {
  const directory = resolve(ROOT, relativeDir);
  if (!existsSync(directory)) {
    failures.push(`${relativeDir} is missing.`);
    return [];
  }
  const files = [];
  const visit = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const target = resolve(current, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (extensions.some((extension) => entry.name.endsWith(extension))) files.push(target);
    }
  };
  visit(directory);
  return files;
}

for (const file of walk('base44/functions', ['.ts', '.tsx', '.js', '.mjs'])) {
  const source = readFileSync(file, 'utf8');
  const path = relative(ROOT, file).replaceAll('\\', '/');
  if (releaseMutation.test(source) && !allowedFunctionMutators.has(path)) {
    failures.push(`${path} mutates Release but is not an explicitly controlled release workflow.`);
  }
}

for (const file of walk('src', ['.jsx', '.tsx', '.js', '.ts'])) {
  const source = readFileSync(file, 'utf8');
  if (directClientMutation.test(source)) {
    failures.push(`${relative(ROOT, file)} directly mutates Release from the browser.`);
  }
}

const policyPath = resolve(ROOT, 'base44/release-action-policy.json');
if (!existsSync(policyPath)) {
  failures.push('base44/release-action-policy.json is missing.');
} else {
  try {
    const policy = JSON.parse(readFileSync(policyPath, 'utf8'));
    for (const controlled of ['submitNewRelease', 'publishSingleWorkflow']) {
      if (!policy.controlled_functions?.[controlled]) {
        failures.push(`Release mutation workflow ${controlled} is missing from the release action policy.`);
      }
    }
  } catch (error) {
    failures.push(`Release action policy is invalid JSON: ${error?.message || 'unknown error'}`);
  }
}

if (failures.length) {
  console.error('Release mutation inventory check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Release mutation inventory verified: only controlled backend workflows can mutate Release.');
