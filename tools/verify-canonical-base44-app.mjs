import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const EXPECTED_APP_ID = '69eb7905ca6eb4180010f794';
const bindingPath = resolve('base44/.app.jsonc');

const fail = (message) => {
  console.error(`\nBLOCKED: ${message}\n`);
  console.error('This repository may deploy only to the canonical Gannon Waye Music app.');
  console.error(`Expected Base44 app ID: ${EXPECTED_APP_ID}`);
  console.error('Do not use "base44 eject"; it creates and relinks to a new Copy app.');
  process.exit(1);
};

if (!existsSync(bindingPath)) {
  fail('base44/.app.jsonc is missing. Link this checkout explicitly to the canonical app before deployment.');
}

let binding;
try {
  const raw = readFileSync(bindingPath, 'utf8')
    .replace(/^\s*\/\/.*$/gm, '')
    .trim();
  binding = JSON.parse(raw);
} catch (error) {
  fail(`base44/.app.jsonc could not be parsed: ${error.message}`);
}

if (binding?.id !== EXPECTED_APP_ID) {
  fail(`This checkout is linked to ${binding?.id || 'an unknown app ID'}.`);
}

console.log(`Canonical Base44 app verified: ${EXPECTED_APP_ID}`);
