import posthog from 'posthog-js';

const POSTHOG_KEY = 'phc_yAMDjc6mmR3xRyQhQQQngYB4ZXQ4mY9GoC9QKRwKp8ij';
const POSTHOG_HOST = 'https://us.i.posthog.com';

export function initPostHog() {
  if (typeof window === 'undefined') return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // We'll capture manually on route change
    persistence: 'localStorage',
  });
}

export { posthog };