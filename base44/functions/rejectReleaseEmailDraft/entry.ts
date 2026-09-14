import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import { exact, isExactOwner } from '../../shared/releaseControl.ts';

// Owner-only dismissal of a private, unsent draft. It never alters a release
// or any send claim.

function casSucceeded(result: any) {
  return Boolean(result?.success) && Number(result?.updated) === 1;
}

export default async function(req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!isExactOwner(user)) {
      return Response.json({ error: 'Exact owner sign-in is required to dismiss a release email draft.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const draftId = exact(body.draft_id);
    const fingerprint = exact(body.expected_content_fingerprint);
    if (!draftId || !fingerprint) {
      return Response.json({ error: 'draft_id and expected_content_fingerprint are required.' }, { status: 400 });
    }

    const sr = base44.asServiceRole;
    const dismissed = await sr.entities.ReleaseEmailDraft.updateMany(
      {
        id: draftId,
        approval_status: 'draft',
        send_state: 'ready',
        content_fingerprint: fingerprint,
      },
      {
        $set: {
          approval_status: 'rejected',
        },
      },
    );
    if (!casSucceeded(dismissed)) {
      return Response.json({
        error: 'This draft changed or is no longer safe to dismiss. Reload it before taking any further action.',
      }, { status: 409 });
    }

    return Response.json({ ok: true, draft_id: draftId, dismissed: true });
  } catch {
    return Response.json({ error: 'Draft dismissal failed. No email was sent.' }, { status: 500 });
  }
}
