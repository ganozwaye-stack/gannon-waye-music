import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve('.');
const failures = [];

function read(relativePath) {
  const target = resolve(ROOT, relativePath);
  if (!existsSync(target)) {
    failures.push(`${relativePath} is missing.`);
    return '';
  }
  return readFileSync(target, 'utf8');
}

function requireText(relativePath, needle, message) {
  if (!read(relativePath).includes(needle)) failures.push(message);
}

const policyPath = 'base44/release-action-policy.json';
let policy = null;
try {
  policy = JSON.parse(read(policyPath));
} catch (error) {
  failures.push(`${policyPath} is not valid JSON: ${error?.message || 'unknown error'}`);
}

if (policy) {
  if (policy.version !== 1) failures.push('Release action policy must declare version 1.');
  if (policy.default_release_policy !== 'held') {
    failures.push('Release action policy must fail closed by default.');
  }

  const expectedControlled = {
    submitNewRelease: 'private_draft_only',
    publishSingleWorkflow: 'owner_confirmed_publication',
    sendReleaseEmailDraft: 'owner_confirmed_fan_email',
    tooLostOAuth: 'manual_owner_connection',
  };
  for (const [name, mode] of Object.entries(expectedControlled)) {
    if (policy.controlled_functions?.[name]?.mode !== mode) {
      failures.push(`Release action policy is missing controlled mode ${mode} for ${name}.`);
    }
  }

  const held = policy.held_entrypoints;
  if (!Array.isArray(held) || held.length === 0) {
    failures.push('Release action policy has no held entrypoints.');
  } else {
    const seen = new Set();
    for (const entrypoint of held) {
      if (seen.has(entrypoint)) failures.push(`Release action policy repeats ${entrypoint}.`);
      seen.add(entrypoint);
      const source = read(entrypoint);
      if (!source.includes('Safety hold') || !source.includes('skipped: true')) {
        failures.push(`${entrypoint} is declared held but does not return the standard safety hold.`);
      }
      if (/fetch\(|Core\.SendEmail|InvokeLLM|GenerateImage|functions\.invoke|connectors\.getConnection|integrations\./.test(source)) {
        failures.push(`${entrypoint} is declared held but still contains an external-action capability.`);
      }
    }
  }
}

requireText(
  'base44/functions/submitNewRelease/entry.ts',
  'private_draft_acknowledged',
  'Private draft creation no longer requires its explicit acknowledgement.'
);
requireText(
  'base44/functions/submitNewRelease/entry.ts',
  "external_actions: 'held'",
  'Private draft creation no longer records external actions as held.'
);
requireText(
  'src/pages/admin/NewReleaseStudio.jsx',
  'Automatic launch-packet generation is held',
  'New Release Studio no longer explains the automatic launch-packet safety hold.'
);
if (/generateReleaseLaunchPacket/.test(read('src/pages/admin/NewReleaseStudio.jsx'))) {
  failures.push('New Release Studio still invokes the automatic launch-packet generator.');
}
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'confirmTitle !== exactTitle || confirmVersion !== exactVersion',
  'Public release no longer requires exact title and version confirmation.'
);
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  "action === 'approve'",
  'Public release no longer separates approval from publication.'
);
requireText(
  'base44/functions/sendReleaseEmailDraft/entry.ts',
  "release?.is_published === true",
  'Fan email no longer requires a public release.'
);
requireText(
  'base44/functions/sendReleaseEmailDraft/entry.ts',
  "draft.approval_status !== 'approved'",
  'Fan email no longer requires draft approval.'
);
requireText(
  'base44/functions/tooLostOAuth/entry.ts',
  'rememberTooLostOAuthState(sr, state, actorEmail)',
  'Distributor connection no longer binds one-time state to the owner.'
);
requireText(
  'base44/functions/tooLostOAuth/entry.ts',
  'read_only: true',
  'Distributor status is no longer explicitly read-only.'
);

if (failures.length > 0) {
  console.error('Release action policy check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Release action policy verified: ${policy.held_entrypoints.length} held entrypoints and ${Object.keys(policy.controlled_functions).length} controlled flows.`);
