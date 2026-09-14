// Kept beside the function because Base44 bundles function-local dependencies.
// All unlisted capabilities are held before a service-role operation occurs.

export const DEEGO_INTERNAL_POLICY_VERSION = 'deego-internal-v1';

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

const INTERNAL_CAPABILITIES = new Set([
  'internal_read',
  'internal_record_write',
  'internal_summary',
]);

export function exact(value: unknown) {
  return String(value || '').trim();
}

export function isExactOwner(user: { role?: string; email?: string } | null | undefined) {
  return user?.role === 'admin' && OWNER_EMAILS.has(exact(user.email).toLowerCase());
}

export function isInternalCapability(value: unknown) {
  return INTERNAL_CAPABILITIES.has(exact(value));
}

export async function sha256(value: unknown) {
  const encoded = new TextEncoder().encode(JSON.stringify(value));
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
