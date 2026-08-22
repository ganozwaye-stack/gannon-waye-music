import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

// Non-urgent, low-risk approval items are auto-deleted after this many days with no response.
const STALE_DAYS = 5;

Deno.serve(async (req: Request) => {
  try {
    const base44 = createClientFromRequest(req);
    const cutoff = new Date(Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000).toISOString();

    // Non-urgent (low risk) approval items still pending with no response, older than 5 days.
    const stale = await base44.asServiceRole.entities.ApprovalQueue.filter({
      status: 'pending',
      risk_level: 'low',
      created_date: { $lt: cutoff },
    }, '-created_date', 500) as Array<{ id: string; action_title?: string }>;

    if (!stale || stale.length === 0) {
      return Response.json({ deleted: 0, cutoff, reason: 'No stale low-risk pending approvals' });
    }

    const ids = stale.map((i) => i.id);
    await base44.asServiceRole.entities.ApprovalQueue.deleteMany({ id: { $in: ids } });

    return Response.json({
      deleted: ids.length,
      cutoff,
      deleted_titles: stale.map((i) => i.action_title),
    });
  } catch (error: unknown) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
});