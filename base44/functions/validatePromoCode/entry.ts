import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { code } = await req.json();

    if (!code) {
      return Response.json({ valid: false, reason: 'No code provided' });
    }

    // Use service role to read promo codes (admin-only entity)
    const codes = await base44.asServiceRole.entities.PromoCode.filter({ code: code.trim().toUpperCase(), is_active: true });

    if (!codes || codes.length === 0) {
      return Response.json({ valid: false, reason: 'Code not found or inactive' });
    }

    const promo = codes[0];

    // Check usage limit
    if (promo.max_uses !== null && promo.max_uses !== undefined && promo.times_used >= promo.max_uses) {
      return Response.json({ valid: false, reason: 'This code has reached its maximum uses' });
    }

    // Increment times_used
    await base44.asServiceRole.entities.PromoCode.update(promo.id, {
      times_used: (promo.times_used || 0) + 1,
    });

    return Response.json({
      valid: true,
      code: promo.code,
      discount_percent: promo.discount_percent,
      id: promo.id,
    });
  } catch (error) {
    return Response.json({ valid: false, reason: error.message }, { status: 500 });
  }
});