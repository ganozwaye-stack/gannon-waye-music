import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// saveSubscriber: the one path for fan email signups. One subscriber per email
// address, ever: an existing email is re-consented in place instead of creating
// a second record, and any duplicates found at signup time are removed so the
// list self-heals.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return Response.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const existing = await base44.asServiceRole.entities.EmailSubscriber.filter({ email });

    if (existing.length > 0) {
      const current = existing[0];
      const patch = { consent_updates: true, unsubscribed: false, consent_at: new Date().toISOString() };
      if (body?.name && !current.name) patch.name = String(body.name).slice(0, 200);
      if (body?.phone && !current.phone) patch.phone = String(body.phone).slice(0, 40);
      if (body?.how_found && !current.how_found) patch.how_found = String(body.how_found);
      await base44.asServiceRole.entities.EmailSubscriber.update(current.id, patch);
      if (existing.length > 1) {
        const staleIds = existing.slice(1).map((r) => r.id);
        await base44.asServiceRole.entities.EmailSubscriber.deleteMany({ email, id: { $in: staleIds } });
      }
      return Response.json({ status: 'updated', id: current.id, removed: existing.length - 1 });
    }

    const record = {
      email,
      name: body?.name ? String(body.name).slice(0, 200) : 'Fan',
      consent_updates: true,
      consent_at: new Date().toISOString(),
      source: body?.source ? String(body.source).slice(0, 100) : 'site',
    };
    if (body?.phone) record.phone = String(body.phone).slice(0, 40);
    if (body?.how_found) record.how_found = String(body.how_found);
    const created = await base44.asServiceRole.entities.EmailSubscriber.create(record);
    return Response.json({ status: 'created', id: created.id, removed: 0 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}