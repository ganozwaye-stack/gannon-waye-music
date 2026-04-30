import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Find existing reveal record or create one
    const existing = await base44.asServiceRole.entities.SiteReveal.list();

    if (existing.length > 0) {
      await base44.asServiceRole.entities.SiteReveal.update(existing[0].id, {
        artwork_revealed: true,
        merch_revealed: true,
        release_date_text: 'June 10, 2026',
        release_date_iso: '2026-06-10T02:00:00Z',
      });
    } else {
      await base44.asServiceRole.entities.SiteReveal.create({
        artwork_revealed: true,
        merch_revealed: true,
        release_date_text: 'June 10, 2026',
        release_date_iso: '2026-06-10T02:00:00Z',
      });
    }

    return Response.json({ success: true, message: 'Reveal triggered: artwork + merch now live' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});