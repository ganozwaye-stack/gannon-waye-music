// Centralized Financial Calculations - Single Source of Truth
// All financial calculations across the platform must use these utilities

const GST_RATE = 0.10; // 10% Australian GST
const MERCHANT_FEE_RATE = 0.035; // 3.5% average (Stripe/PayPal)
const CHARITY_RATE = 0.10; // 10% to 1800RESPECT

/**
 * Calculate complete financial breakdown for an order
 * @param {Object} order - Order object with items, shipping, discounts
 * @param {Array} products - Product catalog with cost data
 * @returns {Object} Complete financial breakdown
 */
export const calculateOrderFinancials = (order, products) => {
  const items = order.items || [];
  
  // Revenue calculations
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  const shipping = order.shipping_cost || 0;
  const discount = order.discount_amount || 0;
  const totalCharged = subtotal + shipping - discount;
  
  // GST calculation (10% of taxable amount)
  const gstTaxable = subtotal; // GST applies to goods, not shipping for small businesses
  const gstCollected = gstTaxable * GST_RATE;
  
  // Merchant fees (3.5% of total charged)
  const merchantFee = totalCharged * MERCHANT_FEE_RATE;
  
  // Cost of goods sold
  const cogs = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.product_id);
    const costPrice = product?.cost_price || 0;
    const deliveryCost = product?.delivery_cost || 0;
    return sum + ((costPrice + deliveryCost) * item.quantity);
  }, 0);
  
  // Charity allocation (10% of support/donations, not merch sales)
  // For merch: charity comes from profit, not revenue
  const profitBeforeCharity = totalCharged - cogs - merchantFee;
  const charityAllocation = profitBeforeCharity > 0 ? profitBeforeCharity * CHARITY_RATE : 0;
  
  // Net profit
  const netProfit = profitBeforeCharity - charityAllocation;
  
  // Margin calculations
  const marginPercent = totalCharged > 0 ? (netProfit / totalCharged) * 100 : 0;
  
  return {
    revenue: {
      subtotal,
      shipping,
      discount,
      totalCharged,
    },
    taxes: {
      gstCollected,
      gstRate: GST_RATE,
    },
    costs: {
      cogs,
      merchantFee,
      merchantFeeRate: MERCHANT_FEE_RATE,
    },
    charity: {
      allocation: charityAllocation,
      rate: CHARITY_RATE,
      note: '10% of net profit donated to 1800RESPECT monthly',
    },
    profit: {
      gross: profitBeforeCharity,
      net: netProfit,
      marginPercent,
    },
    metadata: {
      calculatedAt: new Date().toISOString(),
      orderId: order.id,
      itemCount: items.length,
    }
  };
};

/**
 * Calculate product-level profitability
 * @param {Object} product - Product with pricing and costs
 * @returns {Object} Product profitability metrics
 */
export const calculateProductProfitability = (product) => {
  const salePrice = product.sale_price || 0;
  const costPrice = product.cost_price || 0;
  const deliveryCost = product.delivery_cost || 0;
  const merchantFeePercent = product.merchant_fee_percent || 3.5;
  
  const merchantFee = salePrice * (merchantFeePercent / 100);
  const totalCost = costPrice + deliveryCost + merchantFee;
  const profit = salePrice - totalCost;
  const marginPercent = salePrice > 0 ? (profit / salePrice) * 100 : 0;
  
  // Break-even analysis
  const breakEvenUnits = profit > 0 ? 1 : Math.ceil(Math.abs(costPrice) / profit);
  
  return {
    pricing: {
      salePrice,
      costPrice,
      deliveryCost,
      merchantFee,
      merchantFeePercent,
    },
    profitability: {
      profit,
      marginPercent,
      totalCost,
    },
    analysis: {
      breakEvenUnits,
      isProfitable: profit > 0,
      marginTier: marginPercent >= 30 ? 'excellent' : marginPercent >= 15 ? 'good' : 'low',
    }
  };
};

/**
 * Calculate customer lifetime value (LTV)
 * @param {Array} orders - All orders by this customer
 * @param {Object} customer - Customer profile
 * @returns {Object} LTV metrics
 */
export const calculateCustomerLTV = (orders, customer) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalProfit = orders.reduce((sum, order) => {
    const financials = calculateOrderFinancials(order, []);
    return sum + financials.profit.net;
  }, 0);
  
  const firstOrderDate = orders.length > 0 ? new Date(orders[orders.length - 1].created_date) : new Date();
  const lastOrderDate = orders.length > 0 ? new Date(orders[0].created_date) : new Date();
  const customerAgeDays = Math.max(1, Math.floor((lastOrderDate.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const purchaseFrequency = customerAgeDays > 0 ? (totalOrders / customerAgeDays) * 365 : 0;
  
  return {
    lifetime: {
      totalRevenue,
      totalProfit,
      totalOrders,
      customerAgeDays,
    },
    metrics: {
      avgOrderValue,
      purchaseFrequency, // per year
      ltv: totalRevenue,
      profitLtv: totalProfit,
    },
    tier: totalRevenue >= 500 ? 'platinum' : totalRevenue >= 200 ? 'gold' : totalRevenue >= 50 ? 'silver' : 'bronze',
  };
};

/**
 * Calculate inventory valuation
 * @param {Array} products - All products with stock and costs
 * @returns {Object} Inventory metrics
 */
export const calculateInventoryValuation = (products) => {
  const totalUnits = products.reduce((sum, p) => sum + (p.stock_quantity || 0), 0);
  const totalCostValue = products.reduce((sum, p) => {
    return sum + ((p.cost_price || 0) * (p.stock_quantity || 0));
  }, 0);
  const totalRetailValue = products.reduce((sum, p) => {
    return sum + ((p.sale_price || 0) * (p.stock_quantity || 0));
  }, 0);
  
  const potentialProfit = totalRetailValue - totalCostValue;
  const marginPercent = totalRetailValue > 0 ? (potentialProfit / totalRetailValue) * 100 : 0;
  
  // Low stock alerts
  const lowStockProducts = products.filter(p => (p.stock_quantity || 0) < 10);
  const outOfStockProducts = products.filter(p => (p.stock_quantity || 0) === 0);
  
  return {
    valuation: {
      totalUnits,
      totalCostValue,
      totalRetailValue,
      potentialProfit,
      marginPercent,
    },
    alerts: {
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      lowStockProducts: lowStockProducts.map(p => ({ id: p.id, name: p.name, stock: p.stock_quantity })),
      outOfStockProducts: outOfStockProducts.map(p => ({ id: p.id, name: p.name })),
    }
  };
};

/**
 * Calculate campaign attribution
 * @param {String} source - Traffic source (instagram, tiktok, email, etc.)
 * @param {Array} orders - Orders attributed to this campaign
 * @returns {Object} Campaign performance metrics
 */
export const calculateCampaignAttribution = (source, orders) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalProfit = orders.reduce((sum, order) => {
    const financials = calculateOrderFinancials(order, []);
    return sum + financials.profit.net;
  }, 0);
  
  const uniqueCustomers = new Set(orders.map(o => o.customer_email)).size;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate = 0; // Would need impression/click data
  
  return {
    source,
    performance: {
      totalOrders,
      totalRevenue,
      totalProfit,
      uniqueCustomers,
      avgOrderValue,
      conversionRate,
    },
    roi: {
      revenuePerCustomer: uniqueCustomers > 0 ? totalRevenue / uniqueCustomers : 0,
      profitPerCustomer: uniqueCustomers > 0 ? totalProfit / uniqueCustomers : 0,
    }
  };
};

// Export all calculation utilities
export default {
  calculateOrderFinancials,
  calculateProductProfitability,
  calculateCustomerLTV,
  calculateInventoryValuation,
  calculateCampaignAttribution,
  GST_RATE,
  MERCHANT_FEE_RATE,
  CHARITY_RATE,
};
