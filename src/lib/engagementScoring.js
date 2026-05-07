// Supporter Engagement Scoring System

export const ENGAGEMENT_SCORES = {
  // Social Engagement
  TIKTOK_FOLLOW: 10,
  INSTAGRAM_FOLLOW: 10,
  POST_ENGAGEMENT: 10,
  SCREENSHOT_SUBMITTED: 15,

  // Purchase Engagement
  MERCH_PURCHASE: 15,
  FIRST_MERCH_PURCHASE: 25,
  MERCH_MULTIPLE_PURCHASES: 20,
  VINYL_PURCHASE: 20,
  SIGNED_ITEM_PURCHASE: 30,

  // Support Engagement
  ONE_TIME_SUPPORT: 20,
  RECURRING_SUPPORT_INITIATED: 30,
  RECURRING_SUPPORT_MILESTONE_3M: 10,
  RECURRING_SUPPORT_MILESTONE_6M: 15,
  RECURRING_SUPPORT_MILESTONE_12M: 25,

  // Community Engagement
  COMMENT_POSTED: 5,
  FAN_MEDIA_SUBMITTED: 15,
  FAN_MEDIA_FEATURED: 25,
  COMMUNITY_POST_CREATED: 10,

  // Email Engagement
  EMAIL_OPENED: 2,
  EMAIL_CLICKED: 5,
  NEWSLETTER_SIGNUP: 10,

  // Gift Campaign
  GIFT_REQUIREMENTS_MET: 35,
  GIFT_CLAIMED: 50,
  GIFT_VERIFIED: 60,
  GIFT_SENT: 70,

  // Long-term Loyalty
  SUPPORTER_30_DAYS: 10,
  SUPPORTER_90_DAYS: 20,
  SUPPORTER_365_DAYS: 50,
};

export const SUPPORTER_TIERS = {
  BRONZE: { min: 0, max: 49, label: 'Early Supporter', badge: '🌱' },
  SILVER: { min: 50, max: 149, label: 'Inner Circle', badge: '⭐' },
  GOLD: { min: 150, max: 299, label: 'Day One', badge: '👑' },
  PLATINUM: { min: 300, max: Infinity, label: 'Movement Leader', badge: '🔥' },
};

export const SUPPORTER_MILESTONES = [
  { score: 10, label: 'First Step', emoji: '🚶' },
  { score: 25, label: 'Believer', emoji: '💫' },
  { score: 50, label: 'Inner Circle', emoji: '⭐' },
  { score: 100, label: 'Day One', emoji: '👑' },
  { score: 200, label: 'Movement Leader', emoji: '🔥' },
  { score: 350, label: 'Legend', emoji: '✨' },
];

export const SUPPORTER_BADGES = {
  EARLY_SUPPORTER: { id: 'early', label: 'Early Supporter', emoji: '🌱', criteria: 'First 500 supporters' },
  DAY_ONE: { id: 'day_one', label: 'Day One', emoji: '📅', criteria: 'Here from the beginning' },
  MAJOR_SUPPORTER: { id: 'major_supporter', label: 'Major Supporter', emoji: '💎', criteria: '$500+ lifetime' },
  RECURRING_CHAMPION: { id: 'recurring', label: 'Recurring Champion', emoji: '🔄', criteria: '3+ months recurring' },
  COMMUNITY_VOICE: { id: 'community', label: 'Community Voice', emoji: '💬', criteria: '5+ community posts' },
  GIFT_COLLECTOR: { id: 'gift_collector', label: 'Gift Collector', emoji: '🎁', criteria: 'Claimed gift' },
  MERCH_ENTHUSIAST: { id: 'merch', label: 'Merch Enthusiast', emoji: '👕', criteria: '3+ merch purchases' },
};

export function calculateEngagementScore(supporter) {
  let score = 0;

  // Gift engagement
  if (supporter.tracker?.tiktok_followed) score += ENGAGEMENT_SCORES.TIKTOK_FOLLOW;
  if (supporter.tracker?.instagram_followed) score += ENGAGEMENT_SCORES.INSTAGRAM_FOLLOW;
  if (supporter.tracker?.post_engaged) score += ENGAGEMENT_SCORES.POST_ENGAGEMENT;
  if (supporter.tracker?.screenshot_submitted) score += ENGAGEMENT_SCORES.SCREENSHOT_SUBMITTED;
  if (supporter.tracker?.status === 'gift_verified') score += ENGAGEMENT_SCORES.GIFT_VERIFIED;
  if (supporter.tracker?.status === 'gift_sent') score += ENGAGEMENT_SCORES.GIFT_SENT;

  // Purchase engagement
  if (supporter.totalOrders > 0) {
    score += ENGAGEMENT_SCORES.FIRST_MERCH_PURCHASE;
    if (supporter.totalOrders > 1) score += ENGAGEMENT_SCORES.MERCH_MULTIPLE_PURCHASES;
  }

  // Support engagement
  if (supporter.totalContributions > 0) {
    score += ENGAGEMENT_SCORES.ONE_TIME_SUPPORT;
    if (supporter.subContributions?.some(c => c.frequency !== 'once')) {
      score += ENGAGEMENT_SCORES.RECURRING_SUPPORT_INITIATED;
    }
  }

  // Loyalty bonus
  if (supporter.signupDate) {
    const daysSinceSignup = Math.floor((Date.now() - new Date(supporter.signupDate)) / (1000 * 60 * 60 * 24));
    if (daysSinceSignup >= 365) score += ENGAGEMENT_SCORES.SUPPORTER_365_DAYS;
    else if (daysSinceSignup >= 90) score += ENGAGEMENT_SCORES.SUPPORTER_90_DAYS;
    else if (daysSinceSignup >= 30) score += ENGAGEMENT_SCORES.SUPPORTER_30_DAYS;
  }

  return score;
}

export function getSupporterTier(score) {
  for (const [key, tier] of Object.entries(SUPPORTER_TIERS)) {
    if (score >= tier.min && score <= tier.max) {
      return { ...tier, key };
    }
  }
  return SUPPORTER_TIERS.BRONZE;
}

export function getNextMilestone(score) {
  return SUPPORTER_MILESTONES.find(m => m.score > score) || null;
}

export function getUnlockedMilestones(score) {
  return SUPPORTER_MILESTONES.filter(m => m.score <= score);
}

export function getEligibleBadges(supporter) {
  const badges = [];
  const daysSinceSignup = Math.floor((Date.now() - new Date(supporter.signupDate)) / (1000 * 60 * 60 * 24));

  if (daysSinceSignup <= 30) badges.push(SUPPORTER_BADGES.EARLY_SUPPORTER);
  if (supporter.tracker?.status === 'gift_sent') badges.push(SUPPORTER_BADGES.GIFT_COLLECTOR);
  if (supporter.totalSpend >= 500) badges.push(SUPPORTER_BADGES.MAJOR_SUPPORTER);
  if (supporter.subContributions?.some(c => c.frequency !== 'once' && daysSinceSignup >= 90)) {
    badges.push(SUPPORTER_BADGES.RECURRING_CHAMPION);
  }
  if (supporter.totalOrders >= 3) badges.push(SUPPORTER_BADGES.MERCH_ENTHUSIAST);

  return badges;
}