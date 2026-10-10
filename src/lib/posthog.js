import posthog from 'posthog-js';

const POSTHOG_KEY = 'phc_yAMDjc6mmR3xRyQhQQQngYB4ZXQ4mY9GoC9QKRwKp8ij';
const POSTHOG_HOST = 'https://us.i.posthog.com';

export function initPostHog() {
  if (typeof window === 'undefined') return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // Shared tracker forwards sanitized counts only
    capture_pageleave: false,
    autocapture: false,
    disable_session_recording: true,
    save_campaign_params: false,
    save_referrer: false,
    before_send: () => null, // No direct captures; prevent background metadata/form events
    persistence: 'localStorage',
  });
}

export { posthog };