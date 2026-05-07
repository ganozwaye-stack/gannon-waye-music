// Advanced financial calculation utilities for enterprise-level business management

/**
 * Calculate complete financial breakdown for a single product
 */
export const calculateMerchFinancials = (product) => {
  const salePrice = product.sale_price || 0;
  const costPrice = product.cost_price || 0;
  const deliveryCost = product.delivery_cost || 0;
  const merchantFeePercent = product.merchant_fee_percent || 3.5;
  
  const merchantFee = salePrice * (merchantFeePercent / 100);
  const subtotal = salePrice - costPrice - deliveryCost;
  const totalProfit = subtotal - merchantFee;
  const profitMarginPercent = salePrice > 0 ? (totalProfit / salePrice) * 100 : 0;
  
  // GST calculation (10% in Australia)
  const gstCollected = salePrice * 0.1;
  const gstOnCosts = costPrice * 0.1;
  const gstOnDelivery = deliveryCost * 0.1;
  const netGst = gstCollected - gstOnCosts - gstOnDelivery;
  
  // Break-even analysis
  const breakEvenUnits = totalProfit > 0 ? Math.ceil(costPrice / totalProfit) : Infinity;
  
  // Profit tiers
  const profitAt10Units = totalProfit * 10;
  const profitAt50Units = totalProfit * 50;
  const profitAt100Units = totalProfit * 100;
  
  return {
    salePrice,
    costPrice,
    deliveryCost,
    merchantFeePercent,
    merchantFee,
    subtotal,
    totalProfit,
    profitMarginPercent,
    gstCollected,
    gstOnCosts,
    gstOnDelivery,
    netGst,
    breakEvenUnits,
    profitAt10Units,
    profitAt50Units,
    profitAt100Units,
  };
};

/**
 * Calculate store-wide totals with advanced analytics
 */
export const calculateStoreTotals = (products, orders) => {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.is_active).length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock_quantity || 0), 0);
  
  // Revenue calculations
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  
  // Cost calculations
  const totalCosts = orders.reduce((sum, order) => {
    const itemsCost = order.items?.reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.product_id);
      return itemSum + ((product?.cost_price || 0) + (product?.delivery_cost || 0)) * (item.quantity || 1);
    }, 0) || 0;
    return sum + itemsCost;
  }, 0);
  
  // Profit calculations
  const totalProfit = totalRevenue - totalCosts;
  const profitMarginPercent = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  // GST calculations
  const totalGstCollected = totalRevenue * 0.1;
  const netGstPayable = totalGstCollected * 0.5; // Simplified - assume 50% of revenue is costs with GST
  
  // Average metrics
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const avgItemsPerOrder = totalOrders > 0 ? orders.reduce((sum, o) => sum + (o.items?.length || 0), 0) / totalOrders : 0;
  
  // Inventory valuation
  const inventoryValue = products.reduce((sum, p) => {
    return sum + ((p.cost_price || 0) * (p.stock_quantity || 0));
  }, 0);
  
  const potentialRevenue = products.reduce((sum, p) => {
    return sum + ((p.sale_price || 0) * (p.stock_quantity || 0));
  }, 0);
  
  // Status breakdown
  const ordersByStatus = {
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };
  
  // Top products
  const productSales = products.map(p => {
    const unitsSold = orders.reduce((sum, order) => {
      const item = order.items?.find(i => i.product_id === p.id);
      return sum + (item?.quantity || 0);
    }, 0);
    const revenue = unitsSold * (p.sale_price || 0);
    const profit = unitsSold * calculateMerchFinancials(p).totalProfit;
    
    return {
      productId: p.id,
      productName: p.name,
      unitsSold,
      revenue,
      profit,
    };
  }).sort((a, b) => b.revenue - a.revenue);
  
  return {
    totalProducts,
    activeProducts,
    inactiveProducts: totalProducts - activeProducts,
    totalStock,
    totalOrders,
    totalRevenue,
    totalCosts,
    totalProfit,
    profitMarginPercent,
    totalGstCollected,
    netGstPayable,
    avgOrderValue,
    avgItemsPerOrder,
    inventoryValue,
    potentialRevenue,
    ordersByStatus,
    topProducts: productSales.slice(0, 5),
  };
};

/**
 * Calculate margin with promo code applied
 */
export const calculateMarginWithPromo = (product, promoPercent) => {
  const originalPrice = product.sale_price || 0;
  const discountedPrice = originalPrice * (1 - (promoPercent / 100));
  const costPrice = product.cost_price || 0;
  const deliveryCost = product.delivery_cost || 0;
  const merchantFeePercent = product.merchant_fee_percent || 3.5;
  
  const merchantFee = discountedPrice * (merchantFeePercent / 100);
  const profit = discountedPrice - costPrice - deliveryCost - merchantFee;
  const marginPercent = discountedPrice > 0 ? (profit / discountedPrice) * 100 : 0;
  
  return {
    originalPrice,
    discountedPrice,
    discountAmount: originalPrice - discountedPrice,
    promoPercent,
    costPrice,
    deliveryCost,
    merchantFee,
    profit,
    marginPercent,
    isProfitable: profit > 0,
  };
};

/**
 * Calculate shipping profitability
 */
export const calculateShippingProfit = (orderTotal, shippingCharged, shippingCost, destination) => {
  const shippingProfit = shippingCharged - shippingCost;
  const shippingMarginPercent = shippingCharged > 0 ? (shippingProfit / shippingCharged) * 100 : 0;
  
  return {
    shippingCharged,
    shippingCost,
    shippingProfit,
    shippingMarginPercent,
    orderTotal,
    destination,
  };
};

/**
 * Customer lifetime value calculation
 */
export const calculateCustomerLTV = (customerOrders) => {
  const totalOrders = customerOrders.length;
  const totalRevenue = customerOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const firstOrderDate = customerOrders.length > 0 ? new Date(customerOrders[0].created_date) : new Date();
  const lastOrderDate = customerOrders.length > 0 ? new Date(customerOrders[customerOrders.length - 1].created_date) : new Date();
  const customerAgeDays = Math.max(1, Math.floor((lastOrderDate - firstOrderDate) / (1000 * 60 * 60 * 24)));
  const purchaseFrequency = totalOrders / (customerAgeDays / 30); // Orders per month
  
  return {
    totalOrders,
    totalRevenue,
    avgOrderValue,
    customerAgeDays,
    purchaseFrequency,
    projectedAnnualValue: avgOrderValue * purchaseFrequency * 12,
  };
};

/**
 * Generate financial report
 */
export const generateFinancialReport = (products, orders, dateRange = 'all') => {
  const now = new Date();
  let filteredOrders = orders;
  
  if (dateRange !== 'all') {
    const daysAgo = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    filteredOrders = orders.filter(o => new Date(o.created_date) >= cutoffDate);
  }
  
  const storeTotals = calculateStoreTotals(products, filteredOrders);
  
  return {
    reportDate: now.toISOString(),
    dateRange,
    summary: storeTotals,
    insights: {
      healthScore: storeTotals.profitMarginPercent >= 30 ? 'Excellent' : storeTotals.profitMarginPercent >= 15 ? 'Good' : 'Needs Attention',
      recommendation: storeTotals.profitMarginPercent >= 30 
        ? 'Strong margins. Consider scaling marketing spend.' 
        : storeTotals.profitMarginPercent >= 15
        ? 'Healthy margins. Review cost optimization opportunities.'
        : 'Review pricing strategy and supplier costs to improve margins.',
      cashFlowStatus: storeTotals.inventoryValue < storeTotals.totalRevenue * 0.5 ? 'Healthy' : 'Review inventory levels',
    },
  };
};