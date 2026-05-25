import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Public promo code validation for checkout
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { code, email, product_category, cart_items } = await req.json();

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

    // Check expiry date
    if (promo.expires_at) {
      const expiry = new Date(promo.expires_at);
      if (new Date() > expiry) {
        return Response.json({ valid: false, reason: 'This code has expired' });
      }
    }

    // Check global usage limit
    if (promo.max_uses !== null && promo.max_uses !== undefined && promo.times_used >= promo.max_uses) {
      return Response.json({ valid: false, reason: 'This code has reached its maximum uses' });
    }

    // Check approval requirement
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

    // Check category restrictions with cart items
    if (cart_items && cart_items.length > 0) {
      // Get all categories in cart
      const cartCategories = cart_items.map(item => (item.category || item.product_type || 'other').toLowerCase());
      
      // If allowed_categories is set, ALL items must be in that list
      if (promo.allowed_categories && promo.allowed_categories.length > 0) {
        const allowed = promo.allowed_categories.map(c => c.toLowerCase());
        const hasInvalidItem = cartCategories.some(cat => !allowed.includes(cat));
        if (hasInvalidItem) {
          return Response.json({ 
            valid: false, 
            reason: `This code is only valid for: ${promo.allowed_categories.join(', ')}` 
          });
        }
      }

      // Check excluded categories - if ANY item is excluded, code is invalid
      if (promo.excluded_categories && promo.excluded_categories.length > 0) {
        const excluded = promo.excluded_categories.map(c => c.toLowerCase());
        const hasExcludedItem = cartCategories.some(cat => excluded.includes(cat));
        if (hasExcludedItem) {
          const excludedFound = cartCategories.filter(cat => excluded.includes(cat));
          return Response.json({ 
            valid: false, 
            reason: `This code cannot be used on: ${[...new Set(excludedFound)].join(', ')}` 
          });
        }
      }
    } else if (product_category) {
      // Fallback to single product_category check
      const cat = product_category.toLowerCase();

      if (promo.allowed_categories && promo.allowed_categories.length > 0) {
        const allowed = promo.allowed_categories.map(c => c.toLowerCase());
        if (!allowed.includes(cat)) {
          return Response.json({ valid: false, reason: `This code is only valid for: ${promo.allowed_categories.join(', ')}` });
        }
      }

      if (promo.excluded_categories && promo.excluded_categories.length > 0) {
        const excluded = promo.excluded_categories.map(c => c.toLowerCase());
        if (excluded.includes(cat)) {
          return Response.json({ valid: false, reason: `This code cannot be used on: ${product_category}` });
        }
      }
    }

    // Check excludes_support flag
    if (promo.excludes_support) {
      // This will be checked in checkout modal against cart type
      // Return warning flag for frontend to handle
      return Response.json({
        valid: true,
        code: promo.code,
        discount_percent: promo.discount_percent,
        id: promo.id,
        excludes_shipping: promo.excludes_shipping || false,
        excludes_support: true,
        allowed_categories: promo.allowed_categories || [],
        excluded_categories: promo.excluded_categories || [],
        requires_approval: promo.requires_approval || false,
        warning: 'This code cannot be used on support contributions',
      });
    }

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
    return Response.json({ valid: false, reason: 'Validation failed', details: error.message }, { status: 500 });
  }
});