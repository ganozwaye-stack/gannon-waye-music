import { base44 } from '@/api/base44Client';

// Unified event tracking.
// Pushes to PostHog (via base44.analytics) and, when Google Analytics 4 is
// loaded on the page, to gtag as well. Safe to call before GA is configured,
// PostHog still records the event.
export function trackEvent(eventName, properties = {}) {
  try {
    base44.analytics.track({ eventName, properties });
  } catch (_) {
    /* ignore */
  }
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, properties);
    }
  } catch (_) {
    /* ignore */
  }
}