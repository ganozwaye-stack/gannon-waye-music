import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('.');
const failures = [];

function read(relativePath) {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) {
    failures.push(relativePath + ' is missing.');
    return '';
  }
  return readFileSync(path, 'utf8');
}

function requireText(relativePath, needle, message) {
  if (!read(relativePath).includes(needle)) failures.push(message);
}

function parseJson(relativePath) {
  try {
    return JSON.parse(read(relativePath));
  } catch (error) {
    failures.push(relativePath + ' is not valid JSON: ' + (error?.message || 'unknown error'));
    return null;
  }
}

const release = parseJson('base44/entities/Release.jsonc');
if (release) {
  for (const field of [
    'rights_evidence_reference',
    'master_evidence_reference',
    'delivery_evidence_reference',
    'public_link_evidence_url',
    'public_release_approval_id',
    'public_release_approval_fingerprint',
    'release_email_dispatch_state',
  ]) {
    if (!release.properties?.[field]) failures.push('Release is missing ' + field + '.');
  }
  if (!release.properties?.public_release_approval_status?.enum?.includes('approval_claimed')) {
    failures.push('Release approval state lacks approval_claimed compare-and-set state.');
  }
}

for (const ledgerPath of [
  'base44/entities/ReleasePublicationApproval.jsonc',
  'base44/entities/ReleaseEmailSendReceipt.jsonc',
]) {
  const ledger = parseJson(ledgerPath);
  if (
    ledger
    && (
      ledger.rls?.create !== false
      || ledger.rls?.update !== false
      || ledger.rls?.delete !== false
    )
  ) {
    failures.push(ledgerPath + ' must deny direct writes; only trusted backend service-role code may append receipts.');
  }
}

const draftSchema = parseJson('base44/entities/ReleaseEmailDraft.jsonc');
if (
  draftSchema
  && (
    draftSchema.rls?.create !== false
    || draftSchema.rls?.update !== false
    || draftSchema.rls?.delete !== false
  )
) {
  failures.push('ReleaseEmailDraft must deny direct writes; only exact-owner backend workflows may create or alter drafts.');
}

for (const field of [
  'release_version_label',
  'publication_approval_id',
  'release_fingerprint',
  'content_fingerprint',
  'send_state',
  'send_request_id',
  'send_claim_id',
]) {
  if (!release && false) continue;
  const draft = parseJson('base44/entities/ReleaseEmailDraft.jsonc');
  if (draft && !draft.properties?.[field]) failures.push('ReleaseEmailDraft is missing ' + field + '.');
}

requireText(
  'base44/shared/releaseControl.ts',
  'releaseEvidenceErrors',
  'Shared release control lacks fail-closed evidence validation.',
);
requireText(
  'base44/shared/releaseControl.ts',
  'fingerprintReleaseControl',
  'Shared release control lacks release fingerprinting.',
);
requireText(
  'base44/shared/releaseControl.ts',
  'fingerprintReleaseEmailDraft',
  'Shared release control lacks email-content fingerprinting.',
);

requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'releaseEvidenceErrors(candidate)',
  'Publication does not validate the required evidence.',
);
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'confirm_release_fingerprint',
  'Publication does not require the exact release fingerprint confirmation.',
);
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'requiredActionPhrase',
  'Publication does not compute a server-verified action phrase.',
);
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'confirm_approval_phrase',
  'Private approval does not require its server-verified typed phrase.',
);
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'confirm_publish_phrase',
  'Publication does not require its server-verified typed phrase.',
);
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'ReleasePublicationApproval.create',
  'Publication does not write an immutable approval receipt.',
);
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'casSucceeded(approvalClaimed)',
  'Publication approval is not compare-and-set guarded.',
);
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'validApprovalReceipt',
  'Publication does not re-check the immutable approval receipt.',
);
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'confirm_revoke_phrase',
  'Revocation does not require its own explicit typed phrase.',
);
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'revokeFingerprint',
  'Revocation does not re-check the current release fingerprint.',
);
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'Evidence is frozen after approval begins.',
  'Evidence is not frozen after approval begins.',
);
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'exact_snapshot_guard',
  'Evidence saves do not report an exact-snapshot compare-and-set guard.',
);
const publication = read('base44/functions/publishSingleWorkflow/entry.ts');
const saveEvidenceStart = publication.indexOf("if (action === 'save_evidence')");
const saveEvidenceEnd = publication.indexOf("\n    if (action === 'revoke')", saveEvidenceStart);
const saveEvidenceBlock = saveEvidenceStart >= 0 && saveEvidenceEnd > saveEvidenceStart
  ? publication.slice(saveEvidenceStart, saveEvidenceEnd)
  : '';
if (!saveEvidenceBlock.includes('const candidate = evidenceCandidate(release, body);')) {
  failures.push('Evidence saves must derive a complete candidate from the current private record.');
}
for (const field of [
  'rights_evidence_reference',
  'master_evidence_reference',
  'delivery_evidence_reference',
  'public_link_evidence_url',
]) {
  if (!saveEvidenceBlock.includes(`${field}: exact(candidate.${field})`)) {
    failures.push(`Evidence saves do not preserve an omitted ${field} value from the current record.`);
  }
  if (saveEvidenceBlock.includes(`${field}: exact(body.${field})`)) {
    failures.push(`Evidence saves may clear an omitted ${field} value from a partial request.`);
  }
}
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'updated_date: release.updated_date',
  'Release approval, publication, or revocation lacks an updated-date snapshot guard.',
);
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'reconcileLinkedLyricsPublication',
  'Post-commit lyric propagation can still turn a committed release outcome into a generic failure.',
);
requireText(
  'base44/functions/publishSingleWorkflow/entry.ts',
  'manual_reconciliation_required',
  'Committed release outcomes do not report a reconciliation-required result.',
);

requireText(
  'base44/functions/prepareReleaseEmailDraft/entry.ts',
  'ReleasePublicationApproval.filter',
  'Email drafting does not verify immutable publication approval.',
);
requireText(
  'base44/functions/prepareReleaseEmailDraft/entry.ts',
  'content_fingerprint',
  'Email drafting does not bind draft content to a fingerprint.',
);
if (read('base44/functions/prepareReleaseEmailDraft/entry.ts').includes('integrations.Core.SendEmail')) {
  failures.push('Draft preparation must not send email.');
}

const send = read('base44/functions/sendReleaseEmailDraft/entry.ts');
for (const needle of [
  'validSendRequestId(requestId)',
  "send_state: 'claimed'", 
  'ReleaseEmailSendReceipt.create',
  'casSucceeded(draftClaim)',
  'casSucceeded(releaseClaim)',
  'confirm_draft_fingerprint',
  'confirm_send_phrase',
  'expectedSendPhrase',
  'updated_date: draft.updated_date',
  'updated_date: release.updated_date',
  "release_email_dispatch_state: 'idle'", 
]) {
  if (!send.includes(needle)) failures.push('Email send control is missing ' + needle + '.');
}
const receiptIndex = send.indexOf("receipt_type: 'claimed'");
const sendIndex = send.indexOf('integrations.Core.SendEmail');
if (receiptIndex < 0 || sendIndex < 0 || receiptIndex > sendIndex) {
  failures.push('The immutable claimed receipt must be written before outbound email.');
}
if (!send.includes('will not be retried automatically')) {
  failures.push('Claimed sends must explicitly fail closed from automatic retry.');
}

const card = read('src/components/admin/ReleaseEmailDraftCard.jsx');
if (card.includes('base44.entities.ReleaseEmailDraft.update')) {
  failures.push('ReleaseEmailDraftCard still writes release-email state directly from the browser.');
}
for (const functionName of [
  'updateReleaseEmailDraft',
  'sendReleaseEmailDraft',
  'rejectReleaseEmailDraft',
]) {
  if (!card.includes(functionName)) failures.push('ReleaseEmailDraftCard does not use ' + functionName + '.');
}
for (const field of [
  'confirm_release_fingerprint',
  'confirm_draft_fingerprint',
  'confirm_send_phrase',
  'send_request_id',
]) {
  if (!card.includes(field)) failures.push('ReleaseEmailDraftCard does not pass ' + field + '.');
}

for (const path of [
  'base44/functions/updateReleaseEmailDraft/entry.ts',
  'base44/functions/rejectReleaseEmailDraft/entry.ts',
]) {
  requireText(path, 'isExactOwner', path + ' is not owner checked.');
  requireText(path, 'updateMany', path + ' is not compare-and-set guarded.');
}

if (failures.length) {
  console.error('Release control integrity check failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('Release control integrity verified.');
