import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { computeMargin } from '../../shared/marginMath.ts';

// Standardized "Publish Single" workflow.
// Run from Admin -> Releases ("Publish Single" button).
// One click:
//   1. Promotes the release to the Home hero (is_current_single) and publishes it.
//   2. Song page (/release/:id) and Current Single page (/current-single) update automatically from the flag.
//   3. Generates a merch drop (3 drafts) with emotional hook + write-up + CTA, margin computed but NOT yet approved.
//   4. Creates a fan bundle offer + a VIP promo code.
//   5. Logs a Too Lost distribution task for approval (manual until TOO_LOST_API_TOKEN is set).
// Fan new-release emails are handled by the existing notifySubscribersNewRelease entity automation on is_published.

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const releaseId = body?.release_id;
    if (!releaseId) return Response.json({ error: 'release_id required' }, { status: 400 });

    const sr = base44.asServiceRole;

    // 1. Load release
    const release = await sr.entities.Release.get(releaseId);
    if (!release) return Response.json({ error: 'Release not found' }, { status: 404 });

    // 2. Promote to current single + publish (idempotent: clears flag on all others first)
    await sr.entities.Release.updateMany({ is_current_single: true }, { $set: { is_current_single: false } });
    await sr.entities.Release.update(releaseId, {
      is_current_single: true,
      is_published: true,
      status: 'released'
    });

    // 3. Generate merch proposals via LLM
    const merchResp = await sr.integrations.Core.InvokeLLM({
      prompt: `You are a merchandise strategist for independent artist Gannon Waye. A new single "${release.title}" just released. Description: ${release.description || '(no description)'}. Generate 3 merch drop items in a micro-brand dropshipping format: one apparel, one accessory, one poster/art print. Each must tie emotionally to the theme of the single. Return JSON with an items array. For each item: title, category (one of apparel|accessories|poster|other), emotional_hook (one punchy line that makes someone need this now), write_up (2-3 sentences), cta (short call to action), recommended_sale_price_aud (number, AUD), suggested_cost_aud (number, AUD).`,
      response_json_schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                category: { type: 'string', enum: ['apparel', 'accessories', 'poster', 'other'] },
                emotional_hook: { type: 'string' },
                write_up: { type: 'string' },
                cta: { type: 'string' },
                recommended_sale_price_aud: { type: 'number' },
                suggested_cost_aud: { type: 'number' }
              },
              required: ['title', 'category', 'emotional_hook', 'write_up', 'cta', 'recommended_sale_price_aud', 'suggested_cost_aud']
            }
          }
        },
        required: ['items']
      }
    });

    const merchItems = Array.isArray(merchResp?.items) ? merchResp.items : [];
    const createdMerch = [];
    for (const item of merchItems) {
      const sale = Number(item.recommended_sale_price_aud) || 0;
      const cost = Number(item.suggested_cost_aud) || 0;
      const m = computeMargin({ sale_price: sale, cost_price: cost, delivery_cost: 0 });
      const desc = `HOOK: ${item.emotional_hook}\n\n${item.write_up}\n\nCTA: ${item.cta}`;
      const product = await sr.entities.MerchProduct.create({
        name: `${item.title} — ${release.title} Edition`,
        description: desc,
        category: item.category,
        sale_price: sale,
        cost_price: cost,
        delivery_cost: 0,
        merchant_fee_percent: 3.5,
        profit_margin_percent: m.margin_percent,
        total_profit_per_unit: m.profit,
        sizes_available: item.category === 'apparel' ? ['S', 'M', 'L', 'XL', '2XL'] : [],
        images_array: release.artwork_url ? [release.artwork_url] : [],
        is_active: false // draft — needs admin approval + margin verification before listing
      });
      createdMerch.push({ id: product.id, title: item.title, margin: m.margin_percent, meets_floor: m.meets_floor });
    }

    // 4. Fan bundle offer (the 3 merch together)
    let bundleId = null;
    if (createdMerch.length >= 2) {
      const bundleSale = merchItems.reduce((s, i) => s + (Number(i.recommended_sale_price_aud) || 0), 0);
      const bundlePrice = Math.round(bundleSale * 0.85 * 100) / 100; // 15% off
      const bundle = await sr.entities.BundleOffer.create({
        bundle_name: `${release.title} — Fan Bundle`,
        products_included: createdMerch.map((m) => m.id),
        original_combined_price: bundleSale,
        bundle_price: bundlePrice,
        discount_percent: 15,
        status: 'draft',
        customer_headline: `Own a piece of "${release.title}"`,
        campaign_copy: `The complete ${release.title} drop, apparel, accessory and art print together with the digital single. Limited run. When it's gone, it's gone.`,
        show_original_price: true,
        show_saving: true,
        limited_time_label: true,
        stock_rule: 'while_stocks_last',
        image_url: release.artwork_url || '',
        created_by_agent: 'publishSingleWorkflow'
      });
      bundleId = bundle.id;
    }

    // 5. VIP promo code (one use per email, 15% off, launch window)
    const slug = (release.title || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8);
    const vipCode = ('VIP' + slug).slice(0, 12);
    await sr.entities.PromoCode.create({
      code: vipCode,
      discount_percent: 15,
      one_use_per_email: true,
      description: `VIP launch offer for ${release.title}. Auto-generated by Publish Single workflow.`,
      is_active: true
    });

    // 6. Too Lost distribution task (manual until Codex wires the API push — see docs/CODEX_HANDOFF_TOOLOST_ICLOUD.md)
    const distroStatus = 'manual_task';
    await sr.entities.AdminNotification.create({
      notification_type: 'approval',
      severity: 'high',
      title: `Too Lost distribution — ${release.title}`,
      summary: `Single "${release.title}" published. Submit to Too Lost via the distributor portal (API push not yet wired).`,
      source: 'publishSingleWorkflow',
      requires_action: true,
      linked_entity: 'Release',
      linked_id: releaseId,
      linked_route: `/release/${releaseId}`
    });

    return Response.json({
      ok: true,
      release_id: releaseId,
      hero: true,
      published: true,
      merch_proposals: createdMerch,
      bundle_id: bundleId,
      vip_code: vipCode,
      distribution: distroStatus
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}