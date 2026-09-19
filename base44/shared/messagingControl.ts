import { OWNER_EMAILS, exact, isExactOwner, sha256Fingerprint, validSendRequestId } from './releaseControl.ts';

export const MESSAGING_CONTROL_VERSION = 'messaging-control-v1';

export { OWNER_EMAILS, exact, isExactOwner, validSendRequestId };

export function outboundMessageSnapshot(draft: Record<string, any>) {
  return {
    control_version: MESSAGING_CONTROL_VERSION,
    message_draft_id: exact(draft?.id),
    channel: exact(draft?.channel),
    message_type: exact(draft?.message_type),
    title: exact(draft?.title),
    body: String(draft?.body ?? ''),
    recipient_scope: exact(draft?.recipient_scope),
    recipient_ref: exact(draft?.recipient_ref),
    audience_description: exact(draft?.audience_description),
  };
}

export async function fingerprintOutboundMessage(draft: Record<string, any>): Promise<string> {
  return sha256Fingerprint(outboundMessageSnapshot(draft));
}

export function approvalMatchesDraft(receipt: any, draft: any, fingerprint: string): boolean {
  return Boolean(
    receipt
    && exact(receipt.message_draft_id) === exact(draft.id)
    && exact(receipt.channel) === exact(draft.channel)
    && exact(receipt.recipient_scope) === exact(draft.recipient_scope)
    && exact(receipt.recipient_ref) === exact(draft.recipient_ref)
    && exact(receipt.content_fingerprint) === exact(fingerprint)
    && OWNER_EMAILS.has(exact(receipt.approved_by).toLowerCase())
    && Boolean(receipt.approved_at)
    && exact(receipt.control_version) === MESSAGING_CONTROL_VERSION,
  );
}

export function expectedApprovalPhrase(draft: any): string {
  return 'APPROVE ' + exact(draft.channel).toUpperCase() + ' ' + exact(draft.id);
}

export function requiresSmsComplianceText(draft: any): boolean {
  return exact(draft.channel) === 'sms_fan'
    && ['fan_campaign', 'individual_reply'].includes(exact(draft.message_type));
}

export function smsBodyComplianceErrors(draft: any): string[] {
  if (!requiresSmsComplianceText(draft)) return [];
  const body = String(draft?.body ?? '');
  const errors: string[] = [];
  if (!/gannon\s+waye/i.test(body)) {
    errors.push('The SMS must identify Gannon Waye as the sender.');
  }
  if (!/\bSTOP\b/i.test(body)) {
    errors.push('The SMS must include a STOP opt-out instruction.');
  }
  return errors;
}

export function validE164(phone: unknown): boolean {
  return /^\+[1-9]\d{7,14}$/.test(exact(phone));
}

export function twilioBasicAuth(accountSid: string, authToken: string): string {
  return 'Basic ' + btoa(accountSid + ':' + authToken);
}
