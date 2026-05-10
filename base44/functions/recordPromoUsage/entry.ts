import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { promo_id, email } = await req.json();

    if (!promo_id) {
      return Response.json({ success: false, reason: 'No promo_id provided' });
    }

    const promo = await base44.asServiceRole.entities.PromoCode.get(promo_id);
    if (!promo) {
      return Response.json({ success: false, reason: 'Promo not found' });
    }

    const updateData = {
      times_used: (promo.times_used || 0) + 1,
    };

    if (promo.one_use_per_email && email) {
      const usedBy = promo.used_by_emails || [];
      updateData.used_by_emails = [...usedBy, email.toLowerCase().trim()];
    }

    await base44.asServiceRole.entities.PromoCode.update(promo_id, updateData);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, reason: error.message }, { status: 500 });
  }
});