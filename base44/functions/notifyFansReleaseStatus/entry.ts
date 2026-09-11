import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Emails the mailing list (EmailSubscriber) plus opted-in store customers
// (StoreCustomer) whenever an owner-approved release changes status. Each
// status of each release is announced at most once (ReleaseStatusEmailLog),
// unapproved releases are never announced, and Gannon always gets a summary.
// body.dry_run=true previews the email and counts recipients without sending.

const OWNER_EMAIL = 'gannonwayemusic@gmail.com';
const SITE_URL = 'https://gannonwaye.com';
const MAX_RECIPIENTS = 250;

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

function errorMessage(error) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const sr = base44.asServiceRole;
    const body = await req.json().catch(() => ({}));
    const releaseId = String(body.release_id || '').trim();
    const newStatus = String(body.new_status || '').trim();
    const oldStatus = String(body.old_status || '').trim();
    const dryRun = body.dry_run === true;

    if (!releaseId) return Response.json({ error: 'release_id required' }, { status: 400 });

    const matches = await sr.entities.Release.filter({ id: releaseId }, '', 1);
    const release = matches?.[0];
    if (!release?.id) return Response.json({ error: 'Release not found' }, { status: 404 });

    const approved = release.publishing_safe === true
      && release.public_release_approval_status === 'approved';

    if (!dryRun && !approved) {
      return Response.json({
        skipped: true,
        reason: 'Release is not owner-approved for public updates, so fans are not notified yet.',
      });
    }

    if (!newStatus || newStatus === oldStatus) {
      return Response.json({ skipped: true, reason: 'No status change to announce.' });
    }

    // Each status is only ever announced once per release.
    const prior = await sr.entities.ReleaseStatusEmailLog.filter(
      { release_id: releaseId, status: newStatus }, '', 1
    );
    if (prior?.length && !dryRun) {
      return Response.json({ skipped: true, reason: 'Fans were already notified about this status.' });
    }

    const title = String(release.title || '').trim() || 'New music';
    const line = STATUS_COPY[newStatus] || `Its status is now: ${newStatus.replace(/_/g, ' ')}.`;
    // Pull the too.fm presave URL out of the release's link list without
    // depending on how the SDK shapes that array.
    const presaveMatch = /https?:\/\/[^\s"'\\]*too\.fm[^\s"'\\]*/i.exec(
      JSON.stringify(release.other_links || '')
    );
    const cta = newStatus === 'released'
      ? `Listen now: ${SITE_URL}/music`
      : presaveMatch
        ? `Pre-save it here so it lands in your library the second it drops: ${presaveMatch[0]}`
        : `Follow along: ${SITE_URL}/music`;

    const subject = newStatus === 'released'
      ? `"${title}" by Gannon Waye is OUT NOW`
      : `An update on "${title}" from Gannon Waye`;

    const emailBody = [
      'Hi,',
      '',
      `Quick update on "${title}".`,
      '',
      line,
      '',
      cta,
      '',
      'Thank you for being on this journey with me. It means more than you know.',
      '',
      'Gannon Waye',
      '',
      'You receive this because you asked for release updates.',
      `Update or stop these emails any time: ${SITE_URL}/email-preferences`,
    ].join('\n');

    // The mailing list plus store customers, deduplicated by email.
    // Everyone who subscribed gets updates unless they unsubscribed or
    // explicitly opted out. Store customers only when they ticked the
    // marketing opt-in, because the checkout promises that an order does
    // not subscribe the buyer to marketing.
    const [subscribers, customers] = await Promise.all([
      sr.entities.EmailSubscriber.list('', 500),
      sr.entities.StoreCustomer.filter({ marketing_opt_in: true }, '', 500),
    ]);

    const seen = new Set();
    const recipients = [];
    const addRecipient = (record, allowed) => {
      if (allowed !== true) return;
      const email = String(record?.email || '').trim().toLowerCase();
      if (!email || seen.has(email)) return;
      seen.add(email);
      recipients.push(email);
    };
    for (const record of subscribers || []) {
      addRecipient(record, record.unsubscribed !== true && record.consent_updates !== false);
    }
    for (const record of customers || []) {
      addRecipient(record, record.marketing_opt_in === true);
    }
    const capped = recipients.length > MAX_RECIPIENTS;
    const sendList = recipients.slice(0, MAX_RECIPIENTS);

    if (dryRun) {
      return Response.json({
        preview: true,
        approved_for_live_send: approved,
        release_id: releaseId,
        title,
        new_status: newStatus,
        subject,
        recipient_count: recipients.length,
        sample_recipients: recipients.slice(0, 3),
        body: emailBody,
      });
    }

    let sent = 0;
    const failures = [];
    for (const email of sendList) {
      try {
        await sr.integrations.Core.SendEmail({ to: email, subject, text: emailBody });
        sent += 1;
      } catch (error) {
        failures.push({ email, error: errorMessage(error).slice(0, 200) });
      }
    }

    await sr.entities.ReleaseStatusEmailLog.create({
      release_id: releaseId,
      release_title: title,
      status: newStatus,
      sent_count: sent,
      recipient_count: recipients.length,
    });

    await sr.integrations.Core.SendEmail({
      to: OWNER_EMAIL,
      subject: `Fan update sent: "${title}" (${newStatus})`,
      text: `${sent} of ${recipients.length} fans were emailed about "${title}" moving to ${newStatus}.`
        + (capped ? ` Only the first ${MAX_RECIPIENTS} were emailed this run; the rest need a follow-up send.` : '')
        + (failures.length ? `\n\n${failures.length} sends failed. See admin notifications for details.` : '')
        + `\n\nSubject line: ${subject}`,
    }).catch(() => {});

    await sr.entities.AdminNotification.create({
      notification_type: 'system',
      severity: failures.length ? 'warning' : 'info',
      requires_action: failures.length > 0 || capped,
      title: `Fan update sent: ${title}`,
      summary: `${sent} fans emailed the ${newStatus} update for "${title}".`
        + (failures.length ? ` ${failures.length} failed.` : '')
        + (capped ? ` List exceeded ${MAX_RECIPIENTS}; remaining fans were not emailed.` : ''),
      source: 'notifyFansReleaseStatus',
      linked_entity: 'Release',
      linked_id: releaseId,
      linked_route: '/admin/releases',
    });

    return Response.json({
      sent: true,
      release_id: releaseId,
      title,
      new_status: newStatus,
      sent_count: sent,
      recipient_count: recipients.length,
      failed_count: failures.length,
      capped,
    });
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}