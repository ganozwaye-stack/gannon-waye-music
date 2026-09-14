import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import { collectFanEmailAudience } from '../../shared/fanEmailAudience.ts';
import {
  OWNER_EMAILS,
  RELEASE_CONTROL_VERSION,
  exact,
  fingerprintReleaseControl,
  fingerprintReleaseEmailDraft,
  isExactOwner,
  releaseEvidenceErrors,
} from '../../shared/releaseControl.ts';

// Prepares one private, fingerprinted fan-email draft. It never sends email.
// A later manual send must re-check the same immutable publication receipt.

const SITE_URL = 'https://gannonwaye.com';
const PORTRAIT_URL =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e6ad7f7a7_IMG_4345.JPG';

const STATUS_COPY: Record<string, string> = {
  released: 'It is OUT NOW, streaming everywhere.',
};

function esc(value: unknown) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

function buildEmailHtml({ title, statusLine, ctaLabel, ctaUrl, artworkUrl }: any) {
  const banner = artworkUrl
    ? '<tr><td style="padding:0;"><img src="' + esc(artworkUrl)
      + '" alt="' + esc(title)
      + ' artwork" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" /></td></tr>'
    : '';
  return '<!DOCTYPE html><html lang="en"><body style="margin:0;padding:0;background-color:#0a0a0e;">'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0e;padding:32px 12px;"><tr><td align="center">'
    + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#12121a;border:1px solid #3d3420;border-radius:16px;overflow:hidden;">'
    + banner
    + '<tr><td style="padding:36px 40px 8px 40px;text-align:center;"><p style="margin:0;font-family:Georgia,serif;font-size:11px;letter-spacing:5px;color:#d4af37;text-transform:uppercase;">Gannon Waye &middot; Release Update</p>'
    + '<h1 style="margin:14px 0 0 0;font-family:Georgia,serif;font-size:34px;color:#f0e6c8;letter-spacing:1px;">' + esc(title) + '</h1></td></tr>'
    + '<tr><td style="padding:8px 40px 28px 40px;text-align:center;"><p style="margin:0 0 22px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#cfc6b8;">' + esc(statusLine) + '</p>'
    + '<a href="' + esc(ctaUrl) + '" style="display:inline-block;background-color:#d4af37;color:#14100a;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 34px;border-radius:40px;">' + esc(ctaLabel) + '</a></td></tr>'
    + '<tr><td style="padding:0 40px 34px 40px;text-align:center;"><img src="' + PORTRAIT_URL + '" alt="Gannon Waye" width="170" style="display:block;width:170px;height:auto;border:0;border-radius:10px;border-bottom:3px solid #d4af37;margin:0 auto;" />'
    + '<p style="margin:14px 0 0 0;font-family:Georgia,serif;font-size:24px;color:#f0e6c8;">Gannon Waye</p><p style="margin:6px 0 0 0;font-family:Georgia,serif;font-style:italic;font-size:13px;color:#8a8070;">Thank you for being on this journey with me.</p></td></tr>'
    + '<tr><td style="padding:20px 40px;border-top:1px solid #241f12;text-align:center;"><p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:18px;color:#6f695c;">You receive this because you asked for release updates.<br/><a href="' + SITE_URL + '/email-preferences" style="color:#d4af37;text-decoration:none;">Update or stop these emails any time</a></p></td></tr>'
    + '</table></td></tr></table></body></html>';
}

function hasMatchingApproval(receipt: any, release: any, fingerprint: string) {
  return Boolean(
    receipt
    && exact(receipt.release_id) === exact(release.id)
    && exact(receipt.content_fingerprint) === fingerprint
    && exact(receipt.approved_by).toLowerCase() === exact(release.public_release_approved_by).toLowerCase()
    && receipt.approved_at === release.public_release_approved_at
    && receipt.control_version === RELEASE_CONTROL_VERSION,
  );
}

export default async function (req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!isExactOwner(user)) {
      return Response.json({ error: 'Exact owner sign-in is required to prepare a release email draft.' }, { status: 403 });
    }

    const sr = base44.asServiceRole;
    const body = await req.json().catch(() => ({}));
    const releaseId = exact(body.release_id);
    const status = exact(body.status);
    if (!releaseId) return Response.json({ error: 'release_id required' }, { status: 400 });
    if (status !== 'released') {
      return Response.json({ skipped: true, reason: 'Only the released status can be staged for a fan email.' });
    }

    const release = await sr.entities.Release.get(releaseId).catch(() => null);
    if (!release?.id) return Response.json({ error: 'Release not found' }, { status: 404 });

    const evidenceErrors = releaseEvidenceErrors(release);
    const releaseFingerprint = await fingerprintReleaseControl(release);
    const publicGate = release.is_published === true
      && release.publishing_safe === true
      && release.status === 'released'
      && release.public_release_approval_status === 'approved'
      && OWNER_EMAILS.has(exact(release.public_release_approved_by).toLowerCase())
      && Boolean(release.public_release_approved_at)
      && exact(release.public_release_approval_fingerprint) === releaseFingerprint
      && Boolean(exact(release.public_release_approval_id));

    if (!publicGate || evidenceErrors.length || exact(release.release_email_dispatch_state) !== 'idle') {
      return Response.json({
        skipped: true,
        reason: 'A fan email draft requires a current immutable public-release approval and an idle dispatch state.',
      });
    }

    const approvals = await sr.entities.ReleasePublicationApproval.filter(
      { id: exact(release.public_release_approval_id) },
      '',
      1,
    );
    if (!hasMatchingApproval(approvals?.[0], release, releaseFingerprint)) {
      return Response.json({
        skipped: true,
        reason: 'The immutable publication approval does not match the current release snapshot.',
      });
    }

    const priorReceipts = await sr.entities.ReleaseEmailSendReceipt.filter(
      { release_id: releaseId, status },
      '-created_date',
      10,
    );
    if (priorReceipts?.length) {
      return Response.json({
        skipped: true,
        reason: 'A prior fan-email dispatch receipt exists for this release status. No replacement draft was created.',
      });
    }

    const priorDrafts = await sr.entities.ReleaseEmailDraft.filter(
      { release_id: releaseId, status },
      '-created_date',
      20,
    );
    const activeDraft = (priorDrafts || []).find((draft: any) =>
      ['draft', 'approved', 'sending', 'sent'].includes(exact(draft.approval_status))
      || ['claimed', 'sent', 'blocked'].includes(exact(draft.send_state)),
    );
    if (activeDraft) {
      return Response.json({
        skipped: true,
        reason: 'An existing fan-email draft needs review or reconciliation before another can be created.',
        draft_id: activeDraft.id,
      });
    }

    const title = exact(release.title) || 'New music';
    const versionLabel = exact(release.version_label) || 'Original';
    const statusLine = STATUS_COPY[status];
    const cta = { label: 'Listen now', url: exact(release.public_link_evidence_url) };
    const subject = '"' + title + '" by Gannon Waye is OUT NOW';
    const bodyText = [
      'Hi,',
      '',
      'Quick update on "' + title + '".',
      '',
      statusLine,
      '',
      cta.label + ': ' + cta.url,
      '',
      'Thank you for being on this journey with me. It means more than you know.',
      '',
      'Gannon Waye',
      '',
      'You receive this because you asked for release updates.',
      'Update or stop these emails any time: ' + SITE_URL + '/email-preferences',
    ].join('\\n');
    const bodyHtml = buildEmailHtml({
      title,
      statusLine,
      ctaLabel: cta.label,
      ctaUrl: cta.url,
      artworkUrl: release.artwork_url,
    });

    const draftPayload = {
      release_id: releaseId,
      release_title: title,
      release_version_label: versionLabel,
      status,
      subject,
      body_text: bodyText,
      body_html: bodyHtml,
      artwork_url: exact(release.artwork_url),
      cta_label: cta.label,
      cta_url: cta.url,
      publication_approval_id: exact(release.public_release_approval_id),
      release_fingerprint: releaseFingerprint,
    };
    const contentFingerprint = await fingerprintReleaseEmailDraft(draftPayload, releaseFingerprint);
    const recipients = await collectFanEmailAudience(sr);

    const draft = await sr.entities.ReleaseEmailDraft.create({
      ...draftPayload,
      content_fingerprint: contentFingerprint,
      recipient_count: recipients.length,
      approval_status: 'draft',
      send_state: 'ready',
      prepared_source: exact(body.source) || 'manual',
    });

    await sr.entities.AdminNotification.create({
      notification_type: 'approval',
      severity: 'info',
      requires_action: true,
      title: 'Fan email draft ready: ' + title,
      summary: 'Review and manually confirm the released update for "' + title + '" to ' + recipients.length + ' fans.',
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
      release_fingerprint: releaseFingerprint,
      content_fingerprint: contentFingerprint,
    });
  } catch (error) {
    return Response.json({
      error: 'Release-email draft preparation failed closed. No email was sent.',
      detail: errorMessage(error).slice(0, 160),
    }, { status: 500 });
  }
}
