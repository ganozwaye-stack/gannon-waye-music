// Display-only helpers for the Release Review & Approval page.
// Nothing here publishes, approves, emails, delivers or charges anything.

export const HERO_IMAGE_MARKER = 'gannon-waye-home-hero';

export function isSet(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function formatValue(value) {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) {
    return value
      .map((entry) => (entry && typeof entry === 'object' ? JSON.stringify(entry) : String(entry)))
      .join(', ');
  }
  if (value && typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

// The site hero image was linked as a cover once; say so plainly instead of
// letting it pass as artwork.
export function isHeroImage(url) {
  return String(url || '').toLowerCase().includes(HERO_IMAGE_MARKER);
}

export function statusBlocksApproval(status) {
  return !['ready', 'released'].includes(String(status || '').trim());
}

export function blockedApprovalText(status) {
  return `Status is ${String(status || 'not set').trim()}, approval needs ready`;
}

export function readFunctionError(error) {
  const response = error?.response;
  const data = response?.data ?? {};
  return {
    status: response?.status,
    body: data?.error || data?.message || error?.message || 'The request failed.',
    requirements: Array.isArray(data?.missing_requirements) ? data.missing_requirements : [],
  };
}

export function errorNotice(error, action) {
  const { status, body, requirements } = readFunctionError(error);
  if (status === 403) {
    return { kind: 'error', title: 'Owner only', body: 'Exact owner sign-in is required for release review.', requirements: [] };
  }
  if (status === 404) {
    return { kind: 'error', title: 'Release not found', body: 'That release no longer exists. Search for it again.', requirements: [] };
  }
  if (status === 503) {
    return {
      kind: 'error',
      title: `${action} not reconciled`,
      body: `${body} The receipt exists but the record was not updated, and nothing was published.`,
      requirements,
    };
  }
  if (status === 500) {
    return {
      kind: 'error',
      title: `${action} failed closed`,
      body: `${body} Nothing was published, delivered or emailed.`,
      requirements,
    };
  }
  return { kind: 'error', title: `${action} did not complete`, body, requirements };
}