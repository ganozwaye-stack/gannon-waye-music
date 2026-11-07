// Shared, display-only helpers for the Release Review & Approval page.
// Nothing here writes, publishes, emails or delivers anything.

export const NOT_BUILT = 'NOT BUILT';

export const RELEASE_STATUSES = [
  'idea', 'writing', 'pre_production', 'recording', 'mixing', 'mastering', 'ready', 'released',
];

export const exact = (value) => String(value ?? '').trim();

export const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'boolean') return true;
  if (typeof value === 'number') return true;
  return exact(value) !== '';
};

export const displayValue = (value) => {
  if (!hasValue(value)) return NOT_BUILT;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === 'string' ? item : JSON.stringify(item))).join(' · ');
  }
  return String(value);
};

export const EVIDENCE_FIELDS = [
  { key: 'rights_evidence_reference', label: 'Rights evidence reference' },
  { key: 'master_evidence_reference', label: 'Master evidence reference' },
  { key: 'delivery_evidence_reference', label: 'Delivery evidence reference' },
  { key: 'public_link_evidence_url', label: 'Public link evidence url' },
];

// A cover is a square image. Anything pointing at the site's own hero art,
// a logo, a banner or a non-image path is not a cover.
const PLACEHOLDER_ART = /(hero|placeholder|banner|logo|galaxy|og[-_]?image|default|swatch|sprite|site-?art)/i;
const IMAGE_FILE = /\.(jpe?g|png|webp|avif|gif)(\?|$)/i;

export function artworkWarning(url) {
  const value = exact(url);
  if (!value) return 'No artwork stored. Artwork is not a cover.';
  if (PLACEHOLDER_ART.test(value)) {
    return 'This looks like site hero or placeholder art, not a square cover.';
  }
  if (!IMAGE_FILE.test(value)) {
    return 'This path is not an image file, so it is not a cover.';
  }
  return null;
}

export function approvalState(record) {
  return exact(record?.public_release_approval_status) || 'pending';
}

export function approvalExists(record) {
  return approvalState(record) === 'approved' || hasValue(record?.public_release_approved_at);
}

export function missingEvidence(record) {
  return EVIDENCE_FIELDS.filter((field) => !hasValue(record?.[field.key]));
}

// Every reason Approve is blocked, phrased so it can sit next to the control.
export function approveBlockers(record, typedTitle) {
  if (!record) return ['No release is loaded.'];
  const reasons = [];
  if (record.is_published === true) {
    reasons.push('This release is published. Revoke first before approving.');
  }
  if (record.publishing_safe === true) {
    reasons.push('Publishing is already marked safe. Revoke first before approving.');
  }
  if (approvalExists(record)) {
    reasons.push('An approval already exists (' + displayValue(record.public_release_approved_at) + '). Revoke first.');
  }
  if (exact(record.status) === 'mastering') {
    reasons.push('Status is mastering, which blocks approve.');
  } else if (!['ready', 'released'].includes(exact(record.status))) {
    reasons.push('Status must be ready or released (currently ' + displayValue(record.status) + ').');
  }
  if (!hasValue(record.version_label)) {
    reasons.push('Version label is empty, which blocks approve.');
  }
  for (const field of missingEvidence(record)) {
    reasons.push(field.label + ' is empty, which blocks approve.');
  }
  if (exact(typedTitle) !== exact(record.title)) {
    reasons.push('Type the exact song title to enable Approve.');
  }
  return reasons;
}

export function editBlockers(record) {
  if (!record) return ['No release is loaded.'];
  const reasons = [];
  if (record.is_published === true) reasons.push('This release is published. Revoke first before editing.');
  if (record.publishing_safe === true) reasons.push('Publishing is marked safe. Revoke first before editing.');
  if (!['pending', 'revoked'].includes(approvalState(record))) {
    reasons.push('Approval status is ' + approvalState(record) + '. Revoke first before editing.');
  }
  if (!hasValue(record.title)) reasons.push('The title is empty, so there is nothing to save.');
  return reasons;
}

function distance(a, b) {
  const left = a.toLowerCase();
  const right = b.toLowerCase();
  const rows = [];
  for (let i = 0; i <= left.length; i += 1) rows.push([i]);
  for (let j = 1; j <= right.length; j += 1) rows[0][j] = j;
  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
    }
  }
  return rows[left.length][right.length];
}

export function closestTitles(titles, query, count = 3) {
  const target = exact(query);
  return [...new Set(titles.map(exact).filter(Boolean))]
    .sort((a, b) => distance(a, target) - distance(b, target))
    .slice(0, count);
}

export function functionErrorStatus(error) {
  return error?.response?.status ?? error?.status ?? null;
}

export function functionErrorPayload(error) {
  const data = error?.response?.data ?? error?.data ?? null;
  return data && typeof data === 'object' ? data : {};
}

// Maps a failed release-control call onto the exact on-screen state it must show.
export function classifyFunctionError(error) {
  const status = functionErrorStatus(error);
  const payload = functionErrorPayload(error);
  const message = exact(payload.error) || exact(error?.message) || 'The request failed.';
  const requirements = Array.isArray(payload.missing_requirements) ? payload.missing_requirements : [];

  if (status === 403) {
    return { kind: 'error', title: 'Owner only', body: message, requirements: [] };
  }
  if (status === 404) {
    return {
      kind: 'error',
      title: 'Not found',
      body: 'No release record exists with that id. Nothing was created.',
      requirements: [],
    };
  }
  if (status === 409 && requirements.length > 0) {
    return {
      kind: 'warning',
      title: 'Evidence is missing',
      body: message + ' Fix these in Edit, then review again.',
      requirements,
      action: 'edit',
    };
  }
  if (status === 409) {
    return {
      kind: 'warning',
      title: 'Record changed since this review',
      body: (message || 'The record changed.') + ' Reload and review again.',
      requirements,
      action: 'reload',
    };
  }
  if (status === 503) {
    return {
      kind: 'error',
      title: 'Receipt exists, record not updated',
      body: 'The immutable approval receipt exists, but the release record was not updated. Nothing was published, delivered or emailed. Manual reconciliation is required.',
      requirements: [],
    };
  }
  if (status === 500) {
    return {
      kind: 'error',
      title: 'Failed closed',
      body: 'Release control failed closed. Nothing was published, delivered or emailed.',
      requirements: [],
    };
  }
  return { kind: 'error', title: 'Request failed', body: message, requirements };
}