// ENTERPRISE CUSTOMER IDENTITY SYSTEM
// Single source of truth for ALL customer data across orders, donations, merch, supporters, engagement

import { base44 } from '@/api/base44Client';

/**
 * Get complete unified customer profile
 * Aggregates: orders, donations, merch purchases, supporter activity, engagement, gift trackers, email prefs
 */
export const getCompleteCustomerProfile = async (email) => {
  try {
    const [orders, contributions, subscribers, supporters, preferences, giftTrackers, fanPosts] = await Promise.all([
      base44.entities.MerchOrder.filter({ customer_email: email }),
      base44.entities.SupportContribution.filter({ supporter_email: email }),
      base44.entities.EmailSubscriber.filter({ email }),
      base44.entities.SupporterProfile.filter({ supporter_email: email }),
      base44.entities.EmailPreference.filter({ email }),
      base44.entities.GiftRequirementTracker.filter({ subscriber_email: email }),
      base44.entities.FanPost.filter({ author_email: email }),
    ]);

    // Calculate financials
    const merchSpend = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const donationSpend = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalLTV = merchSpend + donationSpend;

    // Calculate engagement
    const orderCount = orders.length;
    const donationCount = contributions.length;
    const postCount = fanPosts.filter(p => p.status === 'approved').length;
    const isSubscriber = subscribers.length > 0;
    const hasGiftTracker = giftTrackers.length > 0;
    const giftProgress = hasGiftTracker ? calculateGiftProgress(giftTrackers[0]) : 0;

    // Engagement scoring (0-100)
    const engagementScore = calculateEngagementScore({
      orderCount,
      donationCount,
      postCount,
      isSubscriber,
      hasGiftTracker,
      giftProgress,
      lastOrderDate: orders.length > 0 ? new Date(orders[0].created_date) : null,
      lastDonationDate: contributions.length > 0 ? new Date(contributions[0].created_date) : null,
    });

    // Determine tier and insights
    let tier = 'supporter';
    let badge = 'supporter';
    if (totalLTV >= 500) {
      tier = 'inner_circle';
      badge = 'inner_circle';
    } else if (totalLTV >= 200) {
      tier = 'movement';
      badge = 'top_supporter';
    } else if (totalLTV >= 50) {
      tier = 'with_you';
      badge = 'supporter';
    }

    // Customer insights
    const insights = {
      isVIP: totalLTV >= 1000,
      isAtRisk: checkInactivity(orders, contributions),
      isHighValue: totalLTV >= 300 && orderCount >= 2,
      isHighEngagement: engagementScore >= 75,
      isGiftEligible: giftProgress >= 100,
      needsCheckIn: orderCount === 0 && donationCount === 1, // Donated but never bought merch
    };

    // Unified profile
    const profile = {
      email,
      name: supporters.length > 0 ? supporters[0].supporter_name : subscribers.length > 0 ? subscribers[0].name : null,
      tier,
      badge,
      engagementScore,
      insights,
      financial: {
        merchSpend,
        donationSpend,
        totalLTV,
        orderCount,
        donationCount,
        avgOrderValue: orderCount > 0 ? merchSpend / orderCount : 0,
        avgDonation: donationCount > 0 ? donationSpend / donationCount : 0,
      },
      engagement: {
        isSubscriber,
        postCount,
        giftProgress,
        hasGiftTracker,
        emailPreferences: preferences.length > 0 ? preferences[0] : null,
      },
      activity: {
        lastOrderDate: orders.length > 0 ? orders[0].created_date : null,
        lastDonationDate: contributions.length > 0 ? contributions[0].created_date : null,
        orderHistory: orders.slice(0, 10), // Last 10 orders
        donationHistory: contributions.slice(0, 10), // Last 10 donations
      },
      data: {
        supporterProfile: supporters.length > 0 ? supporters[0] : null,
        giftTracker: giftTrackers.length > 0 ? giftTrackers[0] : null,
      },
    };

    return profile;
  } catch (error) {
    console.error('Failed to get customer profile:', error);
    return null;
  }
};

/**
 * Calculate gift progress percentage (0-100)
 */
const calculateGiftProgress = (giftTracker) => {
  if (!giftTracker) return 0;
  
  const requirements = [
    giftTracker.tiktok_followed ? 1 : 0,
    giftTracker.instagram_followed ? 1 : 0,
    giftTracker.post_engaged ? 1 : 0,
  ];
  
  const completed = requirements.reduce((a, b) => a + b, 0);
  return Math.round((completed / requirements.length) * 100);
};

/**
 * Calculate engagement score (0-100)
 * Factors: orders, donations, posts, subscription, gift participation, recency
 */
export const calculateEngagementScore = ({
  orderCount = 0,
  donationCount = 0,
  postCount = 0,
  isSubscriber = false,
  hasGiftTracker = false,
  giftProgress = 0,
  lastOrderDate = null,
  lastDonationDate = null,
}) => {
  let score = 0;

  // Order engagement (0-30 points)
  if (orderCount >= 5) score += 30;
  else if (orderCount >= 3) score += 25;
  else if (orderCount >= 2) score += 20;
  else if (orderCount >= 1) score += 10;

  // Donation engagement (0-25 points)
  if (donationCount >= 5) score += 25;
  else if (donationCount >= 3) score += 20;
  else if (donationCount >= 2) score += 15;
  else if (donationCount >= 1) score += 10;

  // Post engagement (0-20 points)
  if (postCount >= 3) score += 20;
  else if (postCount >= 1) score += 10;

  // Subscription (0-10 points)
  if (isSubscriber) score += 10;

  // Gift participation (0-15 points)
  if (hasGiftTracker) score += 5 + (giftProgress / 100) * 10;

  // Recency bonus (0-10 points)
  const now = new Date();
  const daysSinceLastActivity = Math.min(
    lastOrderDate ? Math.floor((now - new Date(lastOrderDate)) / (1000 * 60 * 60 * 24)) : 365,
    lastDonationDate ? Math.floor((now - new Date(lastDonationDate)) / (1000 * 60 * 60 * 24)) : 365
  );

  if (daysSinceLastActivity <= 30) score += 10;
  else if (daysSinceLastActivity <= 90) score += 7;
  else if (daysSinceLastActivity <= 180) score += 4;

  return Math.min(score, 100);
};

/**
 * Check if customer is at risk (inactive after donation/order)
 */
const checkInactivity = (orders, contributions) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // If they've made any activity in last 30 days, not at risk
  const recentOrders = orders.filter(o => new Date(o.created_date) > thirtyDaysAgo);
  const recentDonations = contributions.filter(c => new Date(c.created_date) > thirtyDaysAgo);

  if (recentOrders.length > 0 || recentDonations.length > 0) return false;

  // If they had activity more than 6 months ago but nothing since, at risk
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  const oldActivity = orders.some(o => new Date(o.created_date) > sixMonthsAgo) ||
    contributions.some(c => new Date(c.created_date) > sixMonthsAgo);

  return oldActivity;
};

/**
 * Sync supporter profile with aggregated data
 */
export const syncSupporterProfile = async (email) => {
  try {
    const profile = await getCompleteCustomerProfile(email);
    if (!profile) return { success: false, error: 'Profile not found' };

    const { financial, tier, badge, engagementScore } = profile;

    // Update or create supporter profile
    const supporters = await base44.entities.SupporterProfile.filter({ supporter_email: email });

    if (supporters.length > 0) {
      await base44.entities.SupporterProfile.update(supporters[0].id, {
        total_contributed: financial.totalLTV,
        tier,
        badge,
        supporter_name: profile.name,
      });
    } else {
      await base44.entities.SupporterProfile.create({
        supporter_email: email,
        supporter_name: profile.name,
        total_contributed: financial.totalLTV,
        tier,
        badge,
        is_public: true,
      });
    }

    return {
      success: true,
      profile: {
        email,
        tier,
        badge,
        totalLTV: financial.totalLTV,
        engagementScore,
      },
    };
  } catch (error) {
    console.error('Sync supporter profile failed:', error);
    return { success: false, error: error.message };
  }
};

export default {
  getCompleteCustomerProfile,
  calculateEngagementScore,
  syncSupporterProfile,
};