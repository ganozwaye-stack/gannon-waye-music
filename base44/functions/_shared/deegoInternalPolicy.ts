// Deego's first execution lane is intentionally internal-only. Any capability
// not explicitly allowlisted here is held before a service-role operation occurs.

export const DEEGO_INTERNAL_POLICY_VERSION = 'deego-internal-v1';

export const DEEGO_OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

export const DEEGO_INTERNAL_CAPABILITIES = new Set([
  'internal_read',
  'internal_record_write',
  'internal_summary',
]);

export const DEEGO_HELD_CAPABILITIES = new Set([
  'email',
  'message',
  'social_post',
  'publish',
  'distribution',
  'submission',
  'payment',
  'refund',
  'purchase',
  'connector_access',
  'network_request',
  'schedule',
]);

export function exact(value: unknown) {
  return String(value || '').trim();
}

export function isExactOwner(user: { role?: string; email?: string } | null | undefined) {
  return user?.role === 'admin' && DEEGO_OWNER_EMAILS.has(exact(user.email).toLowerCase());
}

export function isInternalCapability(value: unknown) {
  return DEEGO_INTERNAL_CAPABILITIES.has(exact(value));
}

export async function sha256(value: unknown) {
  const encoded = new TextEncoder().encode(JSON.stringify(value));
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
