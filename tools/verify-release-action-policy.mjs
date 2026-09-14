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

function requirePolicyRequirements(policy, name, mode, requirements) {
  const entry = policy.controlled_functions?.[name];
  if (entry?.mode !== mode) {
    failures.push(`Release action policy is missing controlled mode ${mode} for ${name}.`);
    return;
  }
  for (const requirement of requirements) {
    if (!entry.required?.includes(requirement)) {
      failures.push(`Release action policy is missing ${requirement} for ${name}.`);
    }
  }
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

  requirePolicyRequirements(policy, 'submitNewRelease', 'private_draft_only', [
    'exact_owner', 'private_draft_acknowledgement', 'external_actions_held',
  ]);
  requirePolicyRequirements(policy, 'publishSingleWorkflow', 'owner_confirmed_publication', [
    'exact_owner', 'exact_title', 'exact_version', 'current_release_fingerprint',
    'immutable_approval_receipt', 'separate_approval_then_publish', 'exact_revoke_phrase',
    'server_verified_action_phrase',
  ]);
  requirePolicyRequirements(policy, 'sendReleaseEmailDraft', 'owner_confirmed_fan_email', [
    'exact_owner', 'public_released_record', 'current_evidence', 'immutable_publication_receipt',
    'exact_title_version_and_fingerprints', 'private_release_email_dispatch_claim',
    'send_deduplication', 'no_retry_after_claim',
  ]);
  requirePolicyRequirements(policy, 'tooLostOAuth', 'manual_owner_connection', [
    'exact_owner', 'one_time_state', 'read_only_status', 'no_automatic_renewal',
  ]);

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
  'Private draft creation no longer requires its explicit acknowledgement.',
);
requireText(
  'base44/functions/submitNewRelease/entry.ts',
  "external_actions: 'held'",
  'Private draft creation no longer records external actions as held.',
);
requireText(
  'src/pages/admin/NewReleaseStudio.jsx',
  'Automatic launch-packet generation is held',
  'New Release Studio no longer explains the automatic launch-packet safety hold.',
);
if (/generateReleaseLaunchPacket/.test(read('src/pages/admin/NewReleaseStudio.jsx'))) {
  failures.push('New Release Studio still invokes the automatic launch-packet generator.');
}

const publication = read('base44/functions/publishSingleWorkflow/entry.ts');
for (const needle of [
  'requireExactConfirmation(body, candidate, fingerprint, action)',
  'releaseEvidenceErrors(candidate)',
  'ReleasePublicationApproval.create',
  'casSucceeded(approvalClaimed)',
  'validApprovalReceipt',
  'confirm_revoke_phrase',
  'confirm_approval_phrase',
  'confirm_publish_phrase',
  'requiredActionPhrase',
  'revokeFingerprint',
]) {
  if (!publication.includes(needle)) {
    failures.push(`Public release control is missing required fail-closed guard: ${needle}`);
  }
}

const emailSend = read('base44/functions/sendReleaseEmailDraft/entry.ts');
for (const needle of [
  'validSendRequestId(requestId)',
  "send_state: 'claimed'",
  'ReleaseEmailSendReceipt.create',
  'casSucceeded(draftClaim)',
  'casSucceeded(releaseClaim)',
  'confirm_release_fingerprint',
  'confirm_draft_fingerprint',
  "release_email_dispatch_state: 'idle'",
  'will not be retried automatically',
]) {
  if (!emailSend.includes(needle)) {
    failures.push(`Fan email control is missing required fail-closed guard: ${needle}`);
  }
}
const receiptIndex = emailSend.indexOf("receipt_type: 'claimed'");
const sendIndex = emailSend.indexOf('integrations.Core.SendEmail');
if (receiptIndex < 0 || sendIndex < 0 || receiptIndex > sendIndex) {
  failures.push('A durable claimed receipt must be attempted before outbound email.');
}

requireText(
  'base44/functions/prepareReleaseEmailDraft/entry.ts',
  'ReleasePublicationApproval.filter',
  'Email drafting does not verify immutable publication approval.',
);
if (read('base44/functions/prepareReleaseEmailDraft/entry.ts').includes('integrations.Core.SendEmail')) {
  failures.push('Draft preparation must not send email.');
}

requireText(
  'base44/functions/tooLostOAuth/entry.ts',
  'rememberTooLostOAuthState(sr, state, actorEmail)',
  'Distributor connection no longer binds one-time state to the owner.',
);
requireText(
  'base44/functions/tooLostOAuth/entry.ts',
  'read_only: true',
  'Distributor status is no longer explicitly read-only.',
);

if (failures.length > 0) {
  console.error('Release action policy check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Release action policy verified: ${policy.held_entrypoints.length} held entrypoints and ${Object.keys(policy.controlled_functions).length} controlled flows.`);
