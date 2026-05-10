import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { code, email, product_category } = await req.json();

    if (!code) {
      return Response.json({ valid: false, reason: 'No code provided' });
    }

    // Use service role to read promo codes (admin-only entity)
    const codes = await base44.asServiceRole.entities.PromoCode.filter({
      code: code.trim().toUpperCase(),
      is_active: true,
    });

    if (!codes || codes.length === 0) {
      return Response.json({ valid: false, reason: 'Code not found or inactive' });
    }

    const promo = codes[0];

    // Check global usage limit
    if (promo.max_uses !== null && promo.max_uses !== undefined && promo.times_used >= promo.max_uses) {
      return Response.json({ valid: false, reason: 'This code has reached its maximum uses' });
    }

    // Check approval requirement — email must be in approved_emails list
    if (promo.requires_approval) {
      if (!email) {
        return Response.json({ valid: false, reason: 'Email required for this code' });
      }
      const approved = promo.approved_emails || [];
      if (!approved.includes(email.toLowerCase().trim())) {
        return Response.json({ valid: false, reason: 'This code requires manual approval. Contact us to verify eligibility.' });
      }
    }

    // Check one-use-per-email
    if (promo.one_use_per_email) {
      if (!email) {
        return Response.json({ valid: false, reason: 'Email required for this code' });
      }
      const usedBy = promo.used_by_emails || [];
      if (usedBy.includes(email.toLowerCase().trim())) {
        return Response.json({ valid: false, reason: 'This code has already been used with this email address' });
      }
    }

    // Check category restrictions
    if (product_category) {
      const cat = product_category.toLowerCase();

      // If allowed_categories is set, product must be in that list
      if (promo.allowed_categories && promo.allowed_categories.length > 0) {
        const allowed = promo.allowed_categories.map(c => c.toLowerCase());
        if (!allowed.includes(cat)) {
          return Response.json({ valid: false, reason: `This code is only valid for: ${promo.allowed_categories.join(', ')}` });
        }
      }

      // Check excluded categories
      if (promo.excluded_categories && promo.excluded_categories.length > 0) {
        const excluded = promo.excluded_categories.map(c => c.toLowerCase());
        if (excluded.includes(cat)) {
          return Response.json({ valid: false, reason: `This code cannot be used on: ${product_category}` });
        }
      }
    }

    // Record usage (increment count, add email to used_by_emails)
    const updateData = {
      times_used: (promo.times_used || 0) + 1,
    };
    if (promo.one_use_per_email && email) {
      const usedBy = promo.used_by_emails || [];
      updateData.used_by_emails = [...usedBy, email.toLowerCase().trim()];
    }

    await base44.asServiceRole.entities.PromoCode.update(promo.id, updateData);

    return Response.json({
      valid: true,
      code: promo.code,
      discount_percent: promo.discount_percent,
      id: promo.id,
      excludes_shipping: promo.excludes_shipping || false,
      excludes_support: promo.excludes_support || false,
      allowed_categories: promo.allowed_categories || [],
      excluded_categories: promo.excluded_categories || [],
      requires_approval: promo.requires_approval || false,
    });
  } catch (error) {
    return Response.json({ valid: false, reason: error.message }, { status: 500 });
  }
});