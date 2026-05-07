import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Simple Australia Post + DHL rates calculator
const SHIPPING_RATES = {
  AUS_STANDARD: { weight: 0.5, basePrice: 8.95, perKg: 1.5 },
  AUS_EXPRESS: { weight: 0.5, basePrice: 15.95, perKg: 2.5 },
  INTL_STANDARD: { weight: 0.5, basePrice: 25, perKg: 5 },
  INTL_EXPRESS: { weight: 0.5, basePrice: 45, perKg: 8 },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { destination, weight, shipping_type } = await req.json();

    // destination: 'au' or 'international'
    // weight: kg
    // shipping_type: 'standard' or 'express'

    if (!destination || !weight) {
      return Response.json({ error: 'Missing destination or weight' }, { status: 400 });
    }

    const rateKey = `${destination === 'au' ? 'AUS' : 'INTL'}_${shipping_type === 'express' ? 'EXPRESS' : 'STANDARD'}`;
    const rate = SHIPPING_RATES[rateKey];

    if (!rate) {
      return Response.json({ error: 'Invalid shipping rate' }, { status: 400 });
    }

    const cost = rate.basePrice + (Math.max(0, weight - rate.weight) * rate.perKg);
    const roundedCost = Math.ceil(cost * 100) / 100;

    return Response.json({
      destination,
      weight,
      shipping_type,
      rate_key: rateKey,
      cost: roundedCost,
      estimated_days: shipping_type === 'express' ? '1-2' : '3-5',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});