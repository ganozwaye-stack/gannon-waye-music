// Shared fail-closed controls for owner-approved public releases and fan emails.
// These helpers only validate and fingerprint data. They never publish, deliver,
// schedule, post, or send anything.

export const RELEASE_CONTROL_VERSION = 'release-control-v2';

export const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

export function exact(value: unknown): string {
  return String(value ?? '').trim();
}

export function isExactOwner(user: any): boolean {
  return Boolean(
    user
    && user.role === 'admin'
    && OWNER_EMAILS.has(exact(user.email).toLowerCase()),
  );
}

function canonicalize(value: any): any {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, any>>((result, key) => {
        const nested = value[key];
        if (nested !== undefined) result[key] = canonicalize(nested);
        return result;
      }, {});
  }
  if (typeof value === 'string') return exact(value);
  return value ?? null;
}

export async function sha256Fingerprint(value: unknown): Promise<string> {
  const encoded = new TextEncoder().encode(JSON.stringify(canonicalize(value)));
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function isHttpsUrl(value: unknown): boolean {
  try {
    const url = new URL(exact(value));
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function releaseEvidenceErrors(release: Record<string, any>): string[] {
  const errors: string[] = [];
  if (!exact(release?.title)) errors.push('A release title is required.');
  if (!exact(release?.version_label)) errors.push('An exact version label is required.');
  const references = [
    ['rights_evidence_reference', 'rights evidence'],
    ['master_evidence_reference', 'master evidence'],
    ['delivery_evidence_reference', 'delivery evidence'],
  ] as const;

  for (const [field, label] of references) {
    if (exact(release?.[field]).length < 8) {
      errors.push(`A specific ${label} reference is required.`);
    }
  }
  if (!isHttpsUrl(release?.public_link_evidence_url)) {
    errors.push('A valid HTTPS public listening-link reference is required.');
  }
  return errors;
}

export function releaseControlSnapshot(release: Record<string, any>) {
  return {
    control_version: RELEASE_CONTROL_VERSION,
    release_id: exact(release?.id),
    title: exact(release?.title),
    type: exact(release?.type),
    version_label: exact(release?.version_label),
    release_date: exact(release?.release_date),
    description: exact(release?.description),
    lyrics: exact(release?.lyrics),
    credits: exact(release?.credits),
    artwork_url: exact(release?.artwork_url),
    distributor: exact(release?.distributor),
    distributor_link: exact(release?.distributor_link),
    spotify_link: exact(release?.spotify_link),
    apple_music_link: exact(release?.apple_music_link),
    youtube_link: exact(release?.youtube_link),
    youtube_video_id: exact(release?.youtube_video_id),
    other_links: release?.other_links ?? [],
    duration: exact(release?.duration),
    language: exact(release?.language),
    genre: exact(release?.genre),
    mood: exact(release?.mood),
    current_single_hero_copy: exact(release?.current_single_hero_copy),
    current_single_behind_story: exact(release?.current_single_behind_story),
    rights_evidence_reference: exact(release?.rights_evidence_reference),
    master_evidence_reference: exact(release?.master_evidence_reference),
    delivery_evidence_reference: exact(release?.delivery_evidence_reference),
    public_link_evidence_url: exact(release?.public_link_evidence_url),
  };
}

export async function fingerprintReleaseControl(release: Record<string, any>): Promise<string> {
  return sha256Fingerprint(releaseControlSnapshot(release));
}

export function releaseEmailSnapshot(draft: Record<string, any>, releaseFingerprint: string) {
  return {
    control_version: RELEASE_CONTROL_VERSION,
    release_id: exact(draft?.release_id),
    release_title: exact(draft?.release_title),
    release_version_label: exact(draft?.release_version_label),
    status: exact(draft?.status),
    subject: exact(draft?.subject),
    body_text: String(draft?.body_text ?? ''),
    body_html: String(draft?.body_html ?? ''),
    artwork_url: exact(draft?.artwork_url),
    cta_label: exact(draft?.cta_label),
    cta_url: exact(draft?.cta_url),
    release_fingerprint: exact(releaseFingerprint),
  };
}

export async function fingerprintReleaseEmailDraft(
  draft: Record<string, any>,
  releaseFingerprint: string,
): Promise<string> {
  return sha256Fingerprint(releaseEmailSnapshot(draft, releaseFingerprint));
}

export function validSendRequestId(value: unknown): boolean {
  return /^[A-Za-z0-9:_-]{16,128}$/.test(exact(value));
}
