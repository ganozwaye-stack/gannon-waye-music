/**
 * Centralized Customer Identity System
 * Single source of truth for all customer/supporter data
 * Unifies: orders, donations, subscriptions, engagement, LTV
 */

import { base44 } from '@/api/base44Client';

/**
 * Get complete customer profile by email
 * Aggregates all data from multiple entities
 */
export const getCompleteCustomerProfile = async (email) => {
  try {
    // Fetch all related data in parallel
    const [
      supporterProfiles,
      orders,
      contributions,
      subscriptions,
      giftTrackers,
      emailPrefs,
      fanPosts,
    ] = await Promise.all([
      base44.entities.SupporterProfile.filter({ supporter_email: email }),
      base44.entities.MerchOrder.filter({ customer_email: email }),
      base44.entities.SupportContribution.filter({ supporter_email: email }),
      base44.entities.EmailSubscriber.filter({ email }),
      base44.entities.GiftRequirementTracker.filter({ subscriber_email: email }),
      base44.entities.EmailPreference.filter({ email }),
      base44.entities.FanPost.filter({ author_email: email }),
    ]);

    const profile = supporterProfiles[0] || null;
    
    // Calculate lifetime value
    const merchSpend = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const donationSpend = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalLTV = merchSpend + donationSpend;
    
    // Calculate order statistics
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? merchSpend / totalOrders : 0;
    const lastOrderDate = orders.length > 0 
      ? new Date(Math.max(...orders.map(o => new Date(o.created_date).getTime())))
      : null;
    
    // Determine supporter tier based on total contributions
    const supporterTier = profile?.tier || (
      totalLTV >= 500 ? 'inner_circle' :
      totalLTV >= 200 ? 'movement' :
      totalLTV >= 50 ? 'with_you' : 'supporter'
    );
    
    // Calculate engagement score
    const engagementScore = calculateEngagementScore({
      orders: totalOrders,
      donations: contributions.length,
      fanPosts: fanPosts.length,
      totalSpend: totalLTV,
      hasSubscription: subscriptions.length > 0,
      hasGiftTracker: giftTrackers.length > 0,
    });
    
    return {
      email,
      profile,
      basicInfo: {
        name: profile?.supporter_name || subscriptions[0]?.name || orders[0]?.customer_name || 'Unknown',
        email,
        phone: subscriptions[0]?.phone || null,
        location: orders[0]?.shipping_address ? extractLocation(orders[0].shipping_address) : null,
      },
      financials: {
        totalLTV,
        merchSpend,
        donationSpend,
        avgOrderValue,
        currency: 'AUD',
      },
      statistics: {
        totalOrders,
        totalDonations: contributions.length,
        firstSupportDate: getEarliestDate([...orders, ...contributions]),
        lastSupportDate: lastOrderDate,
        supporterSince: getEarliestDate([...orders, ...contributions, ...subscriptions]),
      },
      engagement: {
        score: engagementScore,
        tier: supporterTier,
        badge: profile?.badge || getBadgeForTier(supporterTier),
        isPublic: profile?.is_public ?? true,
      },
      activity: {
        orders,
        contributions,
        subscriptions,
        giftTrackers,
        fanPosts,
        emailPrefs: emailPrefs[0] || null,
      },
      insights: {
        isHighValue: totalLTV >= 200,
        isAtRisk: lastOrderDate && (Date.now() - lastOrderDate.getTime()) > 90 * 24 * 60 * 60 * 1000,
        isVIP: totalLTV >= 500,
        preferredCategories: getOrderCategories(orders),
        donationFrequency: getDonationFrequency(contributions),
      },
    };
  } catch (error) {
    console.error('Failed to get customer profile:', error);
    return null;
  }
};

/**
 * Calculate engagement score (0-100)
 */
const calculateEngagementScore = (data) => {
  let score = 0;
  
  // Purchase activity (40 points max)
  score += Math.min(40, data.orders * 5);
  score += Math.min(20, data.donations * 5);
  
  // Spending (20 points max)
  if (data.totalSpend >= 500) score += 20;
  else if (data.totalSpend >= 200) score += 15;
  else if (data.totalSpend >= 50) score += 10;
  else if (data.totalSpend >= 10) score += 5;
  
  // Engagement (20 points max)
  score += Math.min(10, data.fanPosts * 2);
  score += data.hasSubscription ? 5 : 0;
  score += data.hasGiftTracker ? 5 : 0;
  
  return Math.min(100, score);
};

/**
 * Extract location from shipping address
 */
const extractLocation = (address) => {
  if (!address) return null;
  const parts = address.split(',').map(s => s.trim());
  return parts.length > 1 ? parts[parts.length - 1] : address;
};

/**
 * Get earliest date from array of records
 */
const getEarliestDate = (records) => {
  if (records.length === 0) return null;
  const dates = records
    .filter(r => r.created_date)
    .map(r => new Date(r.created_date));
  return dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : null;
};

/**
 * Get badge for supporter tier
 */
const getBadgeForTier = (tier) => {
  const badges = {
    inner_circle: 'inner_circle',
    movement: 'top_supporter',
    with_you: 'supporter',
    day_one: 'day_one',
  };
  return badges[tier] || 'supporter';
};

/**
 * Analyze order categories
 */
const getOrderCategories = (orders) => {
  const categories = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      // Would need product lookup for full category analysis
      categories[item.product_name] = (categories[item.product_name] || 0) + 1;
    });
  });
  return Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);
};

/**
 * Determine donation frequency pattern
 */
const getDonationFrequency = (contributions) => {
  if (contributions.length === 0) return 'none';
  const frequencies = contributions.map(c => c.frequency || 'once');
  const monthly = frequencies.filter(f => f === 'monthly').length;
  const fortnightly = frequencies.filter(f => f === 'fortnightly').length;
  
  if (monthly > contributions.length / 2) return 'monthly';
  if (fortnightly > contributions.length / 2) return 'fortnightly';
  return 'occasional';
};

/**
 * Update customer profile with new activity
 */
export const updateCustomerActivity = async (email, activityType, data) => {
  try {
    const profile = await getCompleteCustomerProfile(email);
    
    if (activityType === 'purchase') {
      // Update supporter profile if exists
      const existingProfiles = await base44.entities.SupporterProfile.filter({ supporter_email: email });
      if (existingProfiles.length > 0) {
        const currentProfile = existingProfiles[0];
        await base44.entities.SupporterProfile.update(currentProfile.id, {
          total_contributed: (currentProfile.total_contributed || 0) + (data.amount || 0),
        });
      }
    }
    
    return await getCompleteCustomerProfile(email);
  } catch (error) {
    console.error('Failed to update customer activity:', error);
    return null;
  }
};

/**
 * Search customers by various criteria
 */
export const searchCustomers = async (criteria) => {
  try {
    const allProfiles = await base44.entities.SupporterProfile.list();
    
    return allProfiles.filter(profile => {
      if (criteria.minLTV && (profile.total_contributed || 0) < criteria.minLTV) return false;
      if (criteria.tier && profile.tier !== criteria.tier) return false;
      if (criteria.badge && profile.badge !== criteria.badge) return false;
      if (criteria.minEngagement && calculateEngagementScore({ orders: 0, donations: 0, fanPosts: 0, totalSpend: profile.total_contributed || 0, hasSubscription: false, hasGiftTracker: false }) < criteria.minEngagement) return false;
      
      return true;
    });
  } catch (error) {
    console.error('Customer search failed:', error);
    return [];
  }
};

export default {
  getCompleteCustomerProfile,
  updateCustomerActivity,
  searchCustomers,
  calculateEngagementScore,
};