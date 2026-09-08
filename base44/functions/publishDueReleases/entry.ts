import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { tooLostConfigFromSecrets, getValidTooLostAccessToken } from '../../shared/tooLostAuth.ts';

// Scheduled by the "Publish Due Releases (Midnight)" workflow. Publishes releases
// that Gannon submitted through the New Release Studio with
// auto_publish_on_release_date=true, once their release date arrives and their
// owner approval is valid. His one-button submission IS his approval; this function
// only executes that pre-approved instruction on the day, and never publishes
// anything the owner has not already approved.

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const sr = base44.asServiceRole;

    const today = new Date().toISOString().slice(0, 10);
    const candidates = await sr.entities.Release.filter({
      auto_publish_on_release_date: true,
      is_published: false,
    });

    const due = candidates.filter(release => {
      const releaseDate = String(release.release_date || '').slice(0, 10);
      const approvedBy = String(release.public_release_approved_by || '').toLowerCase();
      return (
        !!releaseDate &&
        releaseDate <= today &&
        release.public_release_approval_status === 'approved' &&
        OWNER_EMAILS.has(approvedBy) &&
        !!release.public_release_approved_at &&
        ['ready', 'released'].includes(release.status)
      );
    });

    const published = [];
    for (const release of due) {
      await sr.entities.Release.update(release.id, {
        is_published: true,
        status: 'released',
      });

      if (release.type === 'single') {
        // The newest release-day single becomes the featured current single.
        await sr.entities.Release.updateMany(
          { is_current_single: true },
          { $set: { is_current_single: false } }
        );
        await sr.entities.Release.update(release.id, { is_current_single: true });
      }

      await sr.entities.Lyric.updateMany(
        { release_id: release.id },
        { $set: { release_publication_approved: true } }
      );

      // Distribution push: Too Lost receives the release and its metadata the
      // moment the release date arrives. Releases already synced at submission
      // (toolost_sync_status 'created') are already scheduled on Too Lost, so
      // only unsynced or failed releases are pushed now.
      let tooLostNote = '';
      if (release.toolost_sync_status !== 'created' && release.toolost_sync_status !== 'pushed_on_release_date') {
        const config = tooLostConfigFromSecrets(secrets);
        const auth = await getValidTooLostAccessToken(sr, config);
        if (auth.token) {
          const apiBase = secrets.get('TOO_LOST_API_BASE_URL') || 'https://api.toolost.com/v1';
          try {
            const res = await fetch(`${apiBase}/releases`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${auth.token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              body: JSON.stringify({
                title: release.title,
                artists: [{ name: 'Gannon Waye', role: 'primary' }],
                release_date: String(release.release_date || '').slice(0, 10),
                tracks: [{
                  title: release.title,
                  ...(release.version_label && release.version_label !== 'Original' ? { version: release.version_label } : {}),
                }],
                ...(release.genre ? { genre: release.genre } : {}),
                ...(release.mood ? { mood: release.mood } : {}),
                ...(release.language ? { language: release.language } : {}),
              }),
            });
            if (res.ok) {
              await sr.entities.Release.update(release.id, { toolost_sync_status: 'pushed_on_release_date' });
              tooLostNote = ' Too Lost metadata pushed for release day.';
            } else if (res.status === 401) {
              await sr.entities.Release.update(release.id, { toolost_sync_status: 'reauthorise_required' });
              tooLostNote = ' Too Lost push failed, the connection needs reconnecting on the Distributors page.';
            } else {
              await sr.entities.Release.update(release.id, { toolost_sync_status: 'error' });
              tooLostNote = ` Too Lost push failed (${res.status}).`;
            }
          } catch (pushError) {
            await sr.entities.Release.update(release.id, { toolost_sync_status: 'error' });
            tooLostNote = ` Too Lost push failed: ${pushError?.message || 'unknown error'}`;
          }
        } else {
          await sr.entities.Release.update(release.id, {
            toolost_sync_status: auth.error === 'not_connected' ? 'not_connected' : 'reauthorise_required',
          });
          tooLostNote = ` Too Lost push skipped: ${auth.detail}`;
        }
      } else {
        tooLostNote = ' Too Lost already has this release scheduled.';
      }

      await sr.entities.AdminNotification.create({
        notification_type: 'system',
        severity: 'info',
        title: `Published: ${release.title}`,
        summary: `${release.title} went live on its scheduled release date (${String(release.release_date).slice(0, 10)}).${tooLostNote}`,
        source: 'publishDueReleases',
        linked_entity: 'Release',
        linked_id: release.id,
        linked_route: '/admin/releases',
      });

      published.push({ id: release.id, title: release.title });
    }

    return Response.json({ ok: true, checked: candidates.length, published });
  } catch (error) {
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}