import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { collectFanEmailAudience } from '../../shared/fanEmailAudience.ts';

// Sends an APPROVED ReleaseEmailDraft to the full fan audience (mailing list
// plus opted-in store customers, deduplicated by email). Owner-only: invoked
// from the Release Email Studio after Gannon presses Approve and Send.

const SITE_URL = 'https://gannonwaye.com';
const OWNER_EMAIL = 'gannonwayemusic@gmail.com';
const MAX_RECIPIENTS = 250;

function errorMessage(error) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin sign-in required.' }, { status: 403 });
    }

    const sr = base44.asServiceRole;
    const body = await req.json().catch(() => ({}));
    const draftId = String(body.draft_id || '').trim();
    if (!draftId) return Response.json({ error: 'draft_id required' }, { status: 400 });

    const matches = await sr.entities.ReleaseEmailDraft.filter({ id: draftId }, '', 1);
    const draft = matches?.[0];
    if (!draft?.id) return Response.json({ error: 'Draft not found' }, { status: 404 });

    if (draft.approval_status === 'sent') {
      return Response.json({ skipped: true, reason: 'This draft was already sent.' });
    }
    if (draft.approval_status !== 'approved') {
      return Response.json({ error: 'Approve the draft before sending.' }, { status: 400 });
    }

    // Each status of each release is only ever announced once.
    const priorSends = await sr.entities.ReleaseStatusEmailLog.filter(
      { release_id: draft.release_id, status: draft.status }, '', 1
    );
    if (priorSends?.length) {
      await sr.entities.ReleaseEmailDraft.update(draft.id, {
        approval_status: 'sent',
        sent_at: new Date().toISOString(),
        sent_count: 0,
        failed_count: 0,
      });
      return Response.json({ skipped: true, reason: 'Fans were already notified about this status.' });
    }

    const recipients = await collectFanEmailAudience(sr);
    const capped = recipients.length > MAX_RECIPIENTS;
    const sendList = recipients.slice(0, MAX_RECIPIENTS);

    let sent = 0;
    const failures = [];
    for (const email of sendList) {
      try {
        await sr.integrations.Core.SendEmail({
          to: email,
          subject: draft.subject,
          html: draft.body_html,
          text: draft.body_text,
        });
        sent += 1;
      } catch (error) {
        failures.push({ email, error: errorMessage(error).slice(0, 200) });
      }
    }

    await sr.entities.ReleaseEmailDraft.update(draft.id, {
      approval_status: 'sent',
      sent_at: new Date().toISOString(),
      sent_count: sent,
      failed_count: failures.length,
      recipient_count: recipients.length,
    });

    await sr.entities.ReleaseStatusEmailLog.create({
      release_id: draft.release_id,
      release_title: draft.release_title,
      status: draft.status,
      sent_count: sent,
      recipient_count: recipients.length,
    });

    await sr.integrations.Core.SendEmail({
      to: OWNER_EMAIL,
      subject: `Fan update sent: "${draft.release_title}" (${draft.status.replace(/_/g, ' ')})`,
      text: `${sent} of ${recipients.length} fans were emailed about "${draft.release_title}" moving to ${draft.status.replace(/_/g, ' ')}.`
        + (capped ? ` Only the first ${MAX_RECIPIENTS} were emailed this run; the rest need a follow-up send.` : '')
        + (failures.length ? `\n\n${failures.length} sends failed.` : ''),
    }).catch(() => {});

    await sr.entities.AdminNotification.create({
      notification_type: 'system',
      severity: failures.length ? 'warning' : 'info',
      requires_action: failures.length > 0 || capped,
      title: `Fan update sent: ${draft.release_title}`,
      summary: `${sent} fans emailed the ${draft.status.replace(/_/g, ' ')} update for "${draft.release_title}".`
        + (failures.length ? ` ${failures.length} failed.` : '')
        + (capped ? ` List exceeded ${MAX_RECIPIENTS}.` : ''),
      source: 'sendReleaseEmailDraft',
      linked_entity: 'ReleaseEmailDraft',
      linked_id: draft.id,
      linked_route: '/admin/release-email-studio',
    });

    return Response.json({
      sent: true,
      draft_id: draft.id,
      sent_count: sent,
      recipient_count: recipients.length,
      failed_count: failures.length,
      capped,
    });
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}