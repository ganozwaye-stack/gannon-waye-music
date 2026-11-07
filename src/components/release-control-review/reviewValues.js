// Display and error helpers for the Release Review & Approval panel.
// Nothing here writes, publishes, emails or charges anything.

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

// The site hero image is not a cover.
export function isHeroPlaceholder(url) {
  return String(url || '').includes('/images/home/');
}

export function approveBlocker(record) {
  if (!record) return 'Blocked: no release loaded';
  const status = String(record.status ?? '').trim();
  if (!['ready', 'released'].includes(status)) return `Blocked: status is ${status || 'not set'}`;
  if (!isSet(record.version_label)) return 'Blocked: version label not set';
  if (isHeroPlaceholder(record.artwork_url)) return 'Blocked: artwork is the site hero placeholder, not a cover';
  if (!isSet(record.master_audio_url)) return 'Blocked: no master audio file';
  return '';
}

export function readError(error) {
  const response = error?.response;
  const data = response?.data ?? {};
  return {
    status: response?.status,
    message: data?.error || data?.message || error?.message || '',
    requirements: Array.isArray(data?.missing_requirements) ? data.missing_requirements.filter(Boolean) : [],
  };
}

export function errorNotice(error) {
  const { status, message, requirements } = readError(error);
  if (status === 403) return { tone: 'error', title: 'Owner only', detail: '', requirements: [] };
  if (status === 409) return { tone: 'error', title: message || 'Held', detail: '', requirements };
  if (status === 503 || status === 500) {
    return { tone: 'error', title: 'Failed closed. Nothing was published, sent or charged.', detail: '', requirements: [] };
  }
  return { tone: 'error', title: message || 'The request did not complete.', detail: '', requirements };
}