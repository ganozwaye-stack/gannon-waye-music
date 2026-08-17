// Shared margin engine for merch approval gate.
// Used by publishSingleWorkflow (draft generation) and the merch approval action.
// House rule: a merch product is NOT listable unless profit_margin_percent >= MARGIN_FLOOR_PERCENT.

export const MARGIN_FLOOR_PERCENT = 50;

export function computeMargin({ sale_price, cost_price, delivery_cost = 0, merchant_fee_percent = 3.5 }) {
  const sale = Number(sale_price) || 0;
  const cost = Number(cost_price) || 0;
  const delivery = Number(delivery_cost) || 0;
  const fee = sale * (Number(merchant_fee_percent) / 100);
  const total_cost = cost + delivery + fee;
  const profit = sale - total_cost;
  const margin_percent = sale > 0 ? (profit / sale) * 100 : 0;
  return {
    fee: round2(fee),
    total_cost: round2(total_cost),
    profit: round2(profit),
    margin_percent: round2(margin_percent),
    meets_floor: margin_percent >= MARGIN_FLOOR_PERCENT
  };
}

// Minimum sale price that still clears the 50% floor for a given cost + delivery.
export function enforceMarginFloor({ cost_price, delivery_cost = 0, merchant_fee_percent = 3.5 }) {
  const cost = Number(cost_price) || 0;
  const delivery = Number(delivery_cost) || 0;
  const fee_rate = Number(merchant_fee_percent) / 100;
  // profit = sale - cost - delivery - sale*fee_rate >= sale * floor/100
  // sale*(1 - fee_rate - floor/100) >= cost + delivery
  const denom = 1 - fee_rate - MARGIN_FLOOR_PERCENT / 100;
  if (denom <= 0) return null;
  const min_sale = (cost + delivery) / denom;
  return Math.ceil(min_sale * 100) / 100;
}

function round2(n) { return Math.round(n * 100) / 100; }