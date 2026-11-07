/**
 * The three doors on the group landing page.
 *
 * Only these three properties are presented at the root. Thanking You Kindly is
 * a separate ecommerce operation and must never appear here or link from it.
 *
 * Emblems use the owner's own approved artwork; no stock photography and no
 * generated people are used anywhere on this page.
 */
const ASSET_BASE = 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794';

export const GROUP_DOORS = [
  {
    key: 'music',
    title: 'Gannon Waye Music',
    subtitle: 'The songs, the releases and the stories behind them.',
    cta: 'Enter the music',
    href: '/home',
    emblem: `${ASSET_BASE}/07efd5c33_SetFree_heart_760.png`,
    emblemAlt: 'Gannon Waye Music',
  },
  {
    key: 'coaching',
    title: 'Coaching and Journals',
    subtitle: 'Guided work for self-worth, boundaries and creative confidence.',
    cta: 'Open coaching',
    href: '/coaching',
    emblem: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/53c9357e2_logo.png',
    emblemAlt: 'Coaching and Journals',
  },
  {
    key: 'wavefront',
    title: 'Wavefront',
    subtitle: 'New work and enquiries.',
    cta: 'Enquire',
    href: '/contact',
    emblem: `${ASSET_BASE}/01c177fdb_SetFree_ring_900.png`,
    emblemAlt: 'Wavefront',
  },
];