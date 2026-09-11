import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { collectFanEmailAudience } from '../../shared/fanEmailAudience.ts';

// Prepares a premium fan email DRAFT (never sends) whenever an owner-approved
// release changes status. The draft lands in the Release Email Studio where
// Gannon previews, edits, approves and sends with one press each.
// Invoked by the Release Status Update workflow and by the studio itself.

const SITE_URL = 'https://gannonwaye.com';
const OWNER_EMAIL = 'gannonwayemusic@gmail.com';
// Gannon's approved press portrait. Embedded unedited, never altered.
const PORTRAIT_URL =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e6ad7f7a7_IMG_4345.JPG';

const STATUS_COPY = {
  idea: 'A brand new song idea is taking shape.',
  writing: 'This one is being written.',
  pre_production: 'It has moved into pre-production.',
  recording: 'It is officially in the studio, being recorded.',
  mixing: 'Recording is done and the mix is underway.',
  mastering: 'Mastering has begun. This is the final polish before it reaches you.',
  ready: 'It is finished and ready for release.',
  released: 'It is OUT NOW, streaming everywhere.',
};

function esc(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function errorMessage(error) {
  return error instanceof Error ? error.message : 'Unknown error';
}

function buildEmailHtml({ title, statusLine, ctaLabel, ctaUrl, artworkUrl }) {
  const banner = artworkUrl
    ? `<tr><td style="padding:0;">
      <img src="${esc(artworkUrl)}" alt="${esc(title)} artwork" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
    </td></tr>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background-color:#0a0a0e;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0e;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#12121a;border:1px solid #3d3420;border-radius:16px;overflow:hidden;">
  ${banner}
  <tr><td style="padding:36px 40px 8px 40px;text-align:center;">
    <p style="margin:0;font-family:Georgia,serif;font-size:11px;letter-spacing:5px;color:#d4af37;text-transform:uppercase;">Gannon Waye &middot; Release Update</p>
    <h1 style="margin:14px 0 0 0;font-family:Georgia,serif;font-size:34px;color:#f0e6c8;letter-spacing:1px;">${esc(title)}</h1>
  </td></tr>
  <tr><td style="padding:8px 40px 28px 40px;text-align:center;">
    <p style="margin:0 0 22px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#cfc6b8;">${esc(statusLine)}</p>
    <a href="${esc(ctaUrl)}" style="display:inline-block;background-color:#d4af37;color:#14100a;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 34px;border-radius:40px;">${esc(ctaLabel)}</a>
  </td></tr>
  <tr><td style="padding:0 40px 34px 40px;text-align:center;">
    <img src="${PORTRAIT_URL}" alt="Gannon Waye" width="170" style="display:block;width:170px;height:auto;border:0;border-radius:10px;border-bottom:3px solid #d4af37;margin:0 auto;" />
    <p style="margin:14px 0 0 0;font-family:Georgia,serif;font-size:24px;color:#f0e6c8;">Gannon Waye</p>
    <p style="margin:6px 0 0 0;font-family:Georgia,serif;font-style:italic;font-size:13px;color:#8a8070;">Thank you for being on this journey with me.</p>
  </td></tr>
  <tr><td style="padding:20px 40px;border-top:1px solid #241f12;text-align:center;">
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:18px;color:#6f695c;">You receive this because you asked for release updates.<br/>
    <a href="${SITE_URL}/email-preferences" style="color:#d4af37;text-decoration:none;">Update or stop these emails any time</a></p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const sr = base44.asServiceRole;
    const body = await req.json().catch(() => ({}));
    const releaseId = String(body.release_id || '').trim();
    if (!releaseId) return Response.json({ error: 'release_id required' }, { status: 400 });

    const matches = await sr.entities.Release.filter({ id: releaseId }, '', 1);
    const release = matches?.[0];
    if (!release?.id) return Response.json({ error: 'Release not found' }, { status: 404 });

    const approved = release.publishing_safe === true
      && release.public_release_approval_status === 'approved';
    if (!approved) {
      return Response.json({
        skipped: true,
        reason: 'Release is not owner-approved for public updates, so no fan email is drafted yet.',
      });
    }

    const status = String(body.status || release.status || '').trim();
    if (!status) return Response.json({ skipped: true, reason: 'No status to announce.' });

    // Fans were already emailed about this status: never draft it again.
    const priorSends = await sr.entities.ReleaseStatusEmailLog.filter(
      { release_id: releaseId, status }, '', 1
    );
    if (priorSends?.length) {
      return Response.json({ skipped: true, reason: 'Fans were already emailed about this status.' });
    }

    // A draft is already staged or in flight for this status.
    const priorDrafts = await sr.entities.ReleaseEmailDraft.filter(
      { release_id: releaseId, status }, '', 10
    );
    const pending = (priorDrafts || []).filter((d) =>
      ['draft', 'approved', 'sent'].includes(d.approval_status));
    if (pending.length) {
      return Response.json({
        skipped: true,
        reason: 'A draft for this status is already waiting in the Release Email Studio.',
        draft_id: pending[0].id,
      });
    }

    const title = String(release.title || '').trim() || 'New music';
    const statusLine = STATUS_COPY[status] || `Its status is now: ${status.replace(/_/g, ' ')}.`;
    const presaveMatch = /https?:\/\/[^\s"'\\]*too\.fm[^\s"'\\]*/i.exec(
      JSON.stringify(release.other_links || '')
    );
    const released = status === 'released';
    const cta = released
      ? { label: 'Listen now', url: `${SITE_URL}/music` }
      : presaveMatch
        ? { label: 'Pre-save it now', url: presaveMatch[0] }
        : { label: 'Follow along', url: `${SITE_URL}/music` };
    const subject = released
      ? `"${title}" by Gannon Waye is OUT NOW`
      : `An update on "${title}" from Gannon Waye`;
    const bodyText = [
      'Hi,',
      '',
      `Quick update on "${title}".`,
      '',
      statusLine,
      '',
      `${cta.label}: ${cta.url}`,
      '',
      'Thank you for being on this journey with me. It means more than you know.',
      '',
      'Gannon Waye',
      '',
      'You receive this because you asked for release updates.',
      `Update or stop these emails any time: ${SITE_URL}/email-preferences`,
    ].join('\n');
    const bodyHtml = buildEmailHtml({
      title, statusLine, ctaLabel: cta.label, ctaUrl: cta.url, artworkUrl: release.artwork_url,
    });

    const recipients = await collectFanEmailAudience(sr);

    const draft = await sr.entities.ReleaseEmailDraft.create({
      release_id: releaseId,
      release_title: title,
      status,
      subject,
      body_text: bodyText,
      body_html: bodyHtml,
      artwork_url: String(release.artwork_url || ''),
      cta_label: cta.label,
      cta_url: cta.url,
      recipient_count: recipients.length,
      approval_status: 'draft',
      prepared_source: String(body.source || 'status_change'),
    });

    await sr.integrations.Core.SendEmail({
      to: OWNER_EMAIL,
      subject: `New fan email draft ready: "${title}" (${status.replace(/_/g, ' ')})`,
      text: `A fan email draft for "${title}" moving to ${status.replace(/_/g, ' ')} is ready for your approval.\n\n`
        + `Recipients: ${recipients.length}\n`
        + `Subject line: ${subject}\n\n`
        + `Preview, edit and send it from the Release Email Studio:\n${SITE_URL}/admin/release-email-studio`,
    }).catch(() => {});

    await sr.entities.AdminNotification.create({
      notification_type: 'approval',
      severity: 'info',
      requires_action: true,
      title: `Fan email draft ready: ${title}`,
      summary: `Review, edit and send the ${status.replace(/_/g, ' ')} update for "${title}" to ${recipients.length} fans.`,
      source: 'prepareReleaseEmailDraft',
      linked_entity: 'ReleaseEmailDraft',
      linked_id: draft.id,
      linked_route: '/admin/release-email-studio',
    });

    return Response.json({
      drafted: true,
      draft_id: draft.id,
      release_id: releaseId,
      title,
      status,
      subject,
      recipient_count: recipients.length,
    });
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}