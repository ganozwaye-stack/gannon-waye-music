import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const DRAFT_TITLE = 'Draft: Termination of Involvement with GanozMix Direct - Victor de Mauro';

const DRAFT_CONTENT = `Subject: Termination of Involvement with GanozMix Direct

Victor,

This letter confirms that, effective immediately, any involvement, access, collaboration, representation, or association you may have had with GanozMix Direct is terminated.

You are not authorised to access, represent, act on behalf of, make decisions for, use accounts connected to, communicate as, or otherwise hold yourself out as being involved with GanozMix Direct.

Any access credentials, materials, files, business information, or account permissions connected to GanozMix Direct must no longer be used. If you are in possession of any business materials or access, you are required to return, delete, or confirm removal of them as appropriate.

This notice is provided for clarity and record-keeping. No further involvement with GanozMix Direct is authorised unless confirmed in writing by Gannon Waye.

Regards,
Gannon Waye`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const existing = await base44.asServiceRole.entities.KnowledgeVault.filter(
      { title: DRAFT_TITLE },
      '-created_date',
      1
    );

    const recordPayload = {
      title: DRAFT_TITLE,
      category: 'legal',
      content: DRAFT_CONTENT,
      summary: 'Draft only. Do not send without Gannon approval. Stored for GanozMix Direct legal/admin review.',
      source: 'seedGanozMixLegalDraft',
      tags: ['ganozmix-direct', 'victor-de-mauro', 'termination-draft', 'draft_pending_gannon_approval'],
      access_level: 'admin_only',
      is_sensitive: true,
    };

    let draft = existing?.[0];
    if (draft?.id) {
      draft = await base44.asServiceRole.entities.KnowledgeVault.update(draft.id, recordPayload);
    } else {
      draft = await base44.asServiceRole.entities.KnowledgeVault.create(recordPayload);
    }

    await base44.asServiceRole.entities.AuditLog.create({
      entity_name: 'KnowledgeVault',
      entity_id: draft.id,
      action: existing?.[0]?.id ? 'update' : 'create',
      user_email: user.email,
      user_role: user.role,
      timestamp: new Date().toISOString(),
      description: 'Victor de Mauro removed from active GanozMix Direct roles/references where present in codebase search; draft termination notice stored for approval only.',
      changes: [
        {
          field: 'status',
          new_value: 'draft_pending_gannon_approval',
        },
      ],
      metadata: {
        rollback_available: true,
      },
    });

    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'system',
      severity: 'warning',
      title: 'GanozMix legal draft ready for review',
      summary: 'Victor de Mauro termination/removal notice has been stored as a draft only. Do not send without approval.',
      source: 'seedGanozMixLegalDraft',
      requires_action: true,
      linked_entity: 'KnowledgeVault',
      linked_id: draft.id,
      linked_route: '/admin/legal-drafts',
    });

    return Response.json({
      success: true,
      draft_id: draft.id,
      status: 'draft_pending_gannon_approval',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
