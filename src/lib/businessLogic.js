/**
 * Centralized Business Logic Engine
 * All financial, inventory, and customer calculations
 * Single source of truth - NO DUPLICATION
 */

import { FINANCIAL_CONFIG, CUSTOMER_TIERS, ENGAGEMENT_CONFIG } from './platformConfig';

/**
 * Calculate product profitability
 * @param {Object} product - Product data
 * @returns {Object} Complete profitability analysis
 */
export const calculateProductProfitability = (product) => {
  const salePrice = Number(product.sale_price) || 0;
  const costPrice = Number(product.cost_price) || 0;
  const deliveryCost = Number(product.delivery_cost) || 0;
  const merchantFeePercent = Number(product.merchant_fee_percent || FINANCIAL_CONFIG.DEFAULT_MERCHANT_FEE_PERCENT);
  
  // Calculate fees
  const merchantFee = salePrice * (merchantFeePercent / 100);
  const gst = salePrice * FINANCIAL_CONFIG.GST_RATE;
  
  // Calculate profitability
  const totalCost = costPrice + deliveryCost + merchantFee;
  const profit = salePrice - totalCost;
  const marginPercent = salePrice > 0 ? (profit / salePrice) * 100 : 0;
  
  // Determine margin tier
  let marginTier = 'low';
  if (marginPercent >= 30) marginTier = 'excellent';
  else if (marginPercent >= 20) marginTier = 'good';
  else if (marginPercent >= 15) marginTier = 'acceptable';
  
  // Break-even analysis
  const breakEvenUnits = profit > 0 ? Math.ceil(costPrice / profit) : Infinity;
  
  return {
    pricing: {
      salePrice,
      costPrice,
      deliveryCost,
      merchantFee,
      merchantFeePercent,
      gst,
      totalCost,
    },
    profitability: {
      profit,
      marginPercent,
      marginTier,
      breakEvenUnits,
      isProfitable: profit > 0,
    },
    analysis: {
      marginTier,
      recommendations: generateMarginRecommendations(marginPercent, costPrice, deliveryCost),
    },
  };
};

/**
 * Calculate complete order financials
 * @param {Object} order - Order data
 * @param {Array} products - Product catalog for COGS
 * @returns {Object} Complete order financial breakdown
 */
export const calculateOrderFinancials = (order, products = []) => {
  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const gst = subtotal * FINANCIAL_CONFIG.GST_RATE;
  const merchantFee = subtotal * FINANCIAL_CONFIG.MERCHANT_FEE_RATE;
  
  // Calculate COGS
  const cogs = order.items?.reduce((sum, item) => {
    const product = products.find(p => p.id === item.product_id);
    return sum + ((product?.cost_price || 0) * item.quantity);
  }, 0) || 0;
  
  // Calculate charity allocation (10% of support)
  const charityAllocation = subtotal * FINANCIAL_CONFIG.CHARITY_DONATION_RATE;
  
  // Calculate net profit
  const revenue = subtotal;
  const totalCosts = cogs + merchantFee + charityAllocation;
  const netProfit = revenue - totalCosts;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  
  return {
    revenue: {
      subtotal,
      gst,
      totalCharged: subtotal + gst + merchantFee,
    },
    costs: {
      cogs,
      merchantFee,
      charityAllocation,
      total: totalCosts,
    },
    profitability: {
      netProfit,
      profitMargin,
      isProfitable: netProfit > 0,
    },
  };
};

/**
 * Calculate customer lifetime value (LTV)
 * @param {Object} customer - Customer data with orders and donations
 * @returns {Object} Complete LTV analysis
 */
export const calculateCustomerLTV = (customer) => {
  const orders = customer.orders || [];
  const donations = customer.donations || [];
  
  const merchSpend = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const donationSpend = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalLTV = merchSpend + donationSpend;
  
  // Determine tier
  let tier = 'day_one';
  let badge = 'day_one';
  Object.values(CUSTOMER_TIERS).forEach(t => {
    if (totalLTV >= t.minLTV) {
      tier = t.name;
      badge = t.badge;
    }
  });
  
  // Calculate order frequency
  const orderCount = orders.length;
  const avgOrderValue = orderCount > 0 ? merchSpend / orderCount : 0;
  
  // Calculate engagement score
  const engagementScore = calculateEngagementScore(customer);
  
  return {
    financials: {
      totalLTV,
      merchSpend,
      donationSpend,
      avgOrderValue,
    },
    tier: {
      name: tier,
      badge,
      nextTier: getNextTier(tier),
      amountToNextTier: getAmountToNextTier(tier, totalLTV),
    },
    behavior: {
      orderCount,
      donationCount: donations.length,
      engagementScore,
    },
  };
};

/**
 * Calculate engagement score (0-100)
 * @param {Object} customer - Customer activity data
 * @returns {number} Engagement score
 */
export const calculateEngagementScore = (customer) => {
  let score = 0;
  
  // Purchase activity (40 points max)
  const orderPoints = Math.min(40, (customer.orders?.length || 0) * 5);
  score += orderPoints;
  
  // Donation activity (20 points max)
  const donationPoints = Math.min(20, (customer.donations?.length || 0) * 5);
  score += donationPoints;
  
  // Spending (20 points max)
  const totalSpend = (customer.orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0) +
                     (customer.donations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0);
  
  if (totalSpend >= 500) score += 20;
  else if (totalSpend >= 200) score += 15;
  else if (totalSpend >= 50) score += 10;
  else if (totalSpend >= 10) score += 5;
  
  // Engagement (20 points max)
  score += Math.min(10, (customer.fanPosts?.length || 0) * 2);
  score += customer.hasSubscription ? 5 : 0;
  score += customer.hasGiftTracker ? 5 : 0;
  
  return Math.min(100, score);
};

/**
 * Calculate inventory valuation
 * @param {Array} products - All products with stock and cost
 * @returns {Object} Complete inventory analysis
 */
export const calculateInventoryValuation = (products) => {
  const totalUnits = products.reduce((sum, p) => sum + (p.stock_quantity || 0), 0);
  const totalCostValue = products.reduce((sum, p) => sum + ((p.cost_price || 0) * (p.stock_quantity || 0)), 0);
  const totalRetailValue = products.reduce((sum, p) => sum + ((p.sale_price || 0) * (p.stock_quantity || 0)), 0);
  
  const lowStockProducts = products.filter(p => (p.stock_quantity || 0) < 10);
  const outOfStockProducts = products.filter(p => (p.stock_quantity || 0) === 0);
  const overstockProducts = products.filter(p => (p.stock_quantity || 0) > 100);
  
  return {
    valuation: {
      totalUnits,
      totalCostValue,
      totalRetailValue,
      potentialProfit: totalRetailValue - totalCostValue,
    },
    alerts: {
      lowStock: lowStockProducts.map(p => ({ id: p.id, name: p.name, stock: p.stock_quantity })),
      outOfStock: outOfStockProducts.map(p => ({ id: p.id, name: p.name })),
      overstock: overstockProducts.map(p => ({ id: p.id, name: p.name, stock: p.stock_quantity })),
    },
    metrics: {
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      overstockCount: overstockProducts.length,
      stockHealthScore: calculateStockHealthScore(products),
    },
  };
};

/**
 * Calculate campaign attribution
 * @param {Object} campaign - Campaign data
 * @param {Array} orders - Orders attributed to campaign
 * @returns {Object} Campaign performance analysis
 */
export const calculateCampaignAttribution = (campaign, orders = []) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map(o => o.customer_email)).size;
  
  const cogs = orders.reduce((sum, o) => {
    return sum + (o.items?.reduce((itemSum, item) => itemSum + ((item.cost || 0) * item.quantity), 0) || 0);
  }, 0);
  
  const grossProfit = totalRevenue - cogs;
  const roi = cogs > 0 ? ((grossProfit - cogs) / cogs) * 100 : 0;
  
  return {
    performance: {
      totalRevenue,
      totalOrders,
      uniqueCustomers,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    },
    profitability: {
      cogs,
      grossProfit,
      roi,
    },
    efficiency: {
      conversionRate: 0, // Requires impression data
      costPerAcquisition: 0, // Requires campaign cost data
    },
  };
};

// Helper functions
const generateMarginRecommendations = (marginPercent, costPrice, deliveryCost) => {
  const recommendations = [];
  
  if (marginPercent < 15) {
    recommendations.push('Consider increasing sale price to improve margin');
    if (costPrice) recommendations.push('Negotiate lower supplier costs');
    if (deliveryCost) recommendations.push('Optimize shipping costs');
  } else if (marginPercent < 25) {
    recommendations.push('Margin is acceptable but could be improved');
  } else {
    recommendations.push('Excellent margin - well positioned');
  }
  
  return recommendations;
};

const getNextTier = (currentTier) => {
  const tiers = Object.values(CUSTOMER_TIERS).sort((a, b) => a.minLTV - b.minLTV);
  const currentIndex = tiers.findIndex(t => t.name === currentTier);
  return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1].name : null;
};

const getAmountToNextTier = (currentTier, currentLTV) => {
  const tiers = Object.values(CUSTOMER_TIERS).sort((a, b) => a.minLTV - b.minLTV);
  const currentIndex = tiers.findIndex(t => t.name === currentTier);
  if (currentIndex >= tiers.length - 1) return 0;
  return tiers[currentIndex + 1].minLTV - currentLTV;
};

const calculateStockHealthScore = (products) => {
  if (products.length === 0) return 0;
  
  const healthyStock = products.filter(p => (p.stock_quantity || 0) >= 10).length;
  return Math.round((healthyStock / products.length) * 100);
};

export default {
  calculateProductProfitability,
  calculateOrderFinancials,
  calculateCustomerLTV,
  calculateEngagementScore,
  calculateInventoryValuation,
  calculateCampaignAttribution,
};