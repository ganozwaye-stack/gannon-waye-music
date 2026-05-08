/**
 * SUPPORTER PROFILE SYNC
 *
 * Calculates a supporter's total lifetime value (LTV) from all orders
 * and contributions, then upserts their SupporterProfile with the correct
 * tier and badge.
 *
 * This is the ONLY authoritative path for updating SupporterProfile tier/badge.
 * Call this after any order or contribution is created.
 */

import { base44 } from '@/api/base44Client';

const TIERS = [
  { min: 500, tier: 'inner_circle', badge: 'inner_circle' },
  { min: 200, tier: 'movement',     badge: 'top_supporter' },
  { min: 0,   tier: 'with_you',     badge: 'supporter' },
];

export const syncSupporterProfile = async (email) => {
  const [profiles, orders, contributions] = await Promise.all([
    base44.entities.SupporterProfile.filter({ supporter_email: email }),
    base44.entities.MerchOrder.filter({ customer_email: email }),
    base44.entities.SupportContribution.filter({ supporter_email: email }),
  ]);

  const totalLTV =
    orders.reduce((s, o) => s + (o.total_amount || 0), 0) +
    contributions.reduce((s, c) => s + (c.amount || 0), 0);

  const { tier, badge } = TIERS.find(t => totalLTV >= t.min);

  if (profiles.length > 0) {
    await base44.entities.SupporterProfile.update(profiles[0].id, { total_contributed: totalLTV, tier, badge });
  } else {
    await base44.entities.SupporterProfile.create({ supporter_email: email, total_contributed: totalLTV, tier, badge });
  }

  return { totalLTV, tier, badge };
};

export default { syncSupporterProfile };