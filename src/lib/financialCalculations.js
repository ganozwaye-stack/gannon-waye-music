// Comprehensive financial calculation library

export const calculateMerchFinancials = (product) => {
  const salePrice = Number(product.sale_price) || 0;
  const costPrice = Number(product.cost_price) || 0;
  const deliveryCost = Number(product.delivery_cost) || 0;
  const merchantFeePercent = Number(product.merchant_fee_percent) || 3.5;

  const merchantFee = salePrice * (merchantFeePercent / 100);
  const totalProfit = salePrice - costPrice - deliveryCost - merchantFee;
  const profitMarginPercent = salePrice > 0 ? (totalProfit / salePrice) * 100 : 0;

  return {
    salePrice,
    costPrice,
    deliveryCost,
    merchantFee,
    merchantFeePercent,
    totalProfit,
    profitMarginPercent: Math.round(profitMarginPercent * 100) / 100,
  };
};

export const calculatePromoDiscount = (basePrice, promoCode) => {
  // promoCode: { discount_percent, code }
  const discountAmount = basePrice * (promoCode.discount_percent / 100);
  const finalPrice = basePrice - discountAmount;

  return {
    basePrice,
    discountPercent: promoCode.discount_percent,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
  };
};

export const calculateOrderTotal = (items, shippingCost, promoCode) => {
  // items: [{ product, quantity, promoCode? }]
  let subtotal = 0;
  let totalDiscountAmount = 0;

  const lineItems = items.map(item => {
    const itemPrice = item.product.sale_price * item.quantity;
    let discount = 0;

    if (item.promoCode) {
      discount = itemPrice * (item.promoCode.discount_percent / 100);
    }

    const lineTotal = itemPrice - discount;
    subtotal += lineTotal;
    totalDiscountAmount += discount;

    return {
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.sale_price,
      itemPrice,
      discount,
      lineTotal,
    };
  });

  const gstAmount = (subtotal + shippingCost) * 0.1; // 10% GST for Australia
  const total = subtotal + shippingCost + gstAmount;

  return {
    lineItems,
    subtotal: Math.round(subtotal * 100) / 100,
    shippingCost: Math.round(shippingCost * 100) / 100,
    totalDiscountAmount: Math.round(totalDiscountAmount * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

export const calculateStoreTotals = (products, orders) => {
  let totalRevenue = 0;
  let totalCosts = 0;
  let totalProfit = 0;
  let totalOrders = orders.length;

  orders.forEach(order => {
    totalRevenue += order.total_amount || 0;
  });

  products.forEach(product => {
    const financials = calculateMerchFinancials(product);
    const unitsSold = orders.reduce((sum, order) => {
      const orderItem = order.items?.find(i => i.product_id === product.id);
      return sum + (orderItem?.quantity || 0);
    }, 0);

    const productCost = (product.cost_price || 0) * unitsSold;
    const productDeliveryCost = (product.delivery_cost || 0) * unitsSold;

    totalCosts += productCost + productDeliveryCost;
    totalProfit += financials.totalProfit * unitsSold;
  });

  const profitMarginPercent = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalCosts: Math.round(totalCosts * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
    totalOrders,
    profitMarginPercent: Math.round(profitMarginPercent * 100) / 100,
  };
};

export const calculateSupportFinancials = (contributions) => {
  let totalSupport = 0;
  let recurringCount = 0;
  let oneTimeCount = 0;

  contributions.forEach(contrib => {
    totalSupport += contrib.total_charged || 0;
    if (contrib.frequency === 'once') {
      oneTimeCount++;
    } else {
      recurringCount++;
    }
  });

  const avgContribution = contributions.length > 0
    ? Math.round((totalSupport / contributions.length) * 100) / 100
    : 0;

  return {
    totalSupport: Math.round(totalSupport * 100) / 100,
    recurringCount,
    oneTimeCount,
    totalContributors: contributions.length,
    avgContribution,
  };
};

export const calculateMarginWithPromo = (product, promoDiscount) => {
  const baseFinancials = calculateMerchFinancials(product);
  const discountAmount = product.sale_price * (promoDiscount / 100);
  const newSalePrice = product.sale_price - discountAmount;
  
  const merchantFee = newSalePrice * (baseFinancials.merchantFeePercent / 100);
  const newProfit = newSalePrice - baseFinancials.costPrice - baseFinancials.deliveryCost - merchantFee;
  const newMargin = newSalePrice > 0 ? (newProfit / newSalePrice) * 100 : 0;

  return {
    originalPrice: product.sale_price,
    discountPercent: promoDiscount,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalPrice: Math.round(newSalePrice * 100) / 100,
    originalProfit: baseFinancials.totalProfit,
    newProfit: Math.round(newProfit * 100) / 100,
    originalMargin: baseFinancials.profitMarginPercent,
    newMargin: Math.round(newMargin * 100) / 100,
  };
};