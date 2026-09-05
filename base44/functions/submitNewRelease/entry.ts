import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// One-button new release submission — owner only.
// Saves the full release to admin (Release + Lyric records), creates press release
// and playlist pitch drafts, and pushes the release to Too Lost for distribution
// scheduling. Scheduling the site feature for release day is handled by the
// publishDueReleases function + its midnight workflow.

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

function exact(value) {
  return String(value || '').trim();
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const ownerEmail = exact(user.email).toLowerCase();
    if (user.role !== 'admin' || !OWNER_EMAILS.has(ownerEmail)) {
      return Response.json({ error: 'Only Gannon can submit a new release' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const title = exact(body.title);
    const releaseDate = exact(body.release_date);
    const lyrics = exact(body.lyrics);
    const artworkUrl = exact(body.artwork_url);
    const description = exact(body.description);
    const versionLabel = exact(body.version_label) || 'Original';
    const type = ['single', 'ep', 'album'].includes(exact(body.type)) ? exact(body.type) : 'single';
    const autoPublish = body.auto_publish_on_release_date !== false;

    if (!title) return Response.json({ error: 'Song name is required' }, { status: 400 });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
      return Response.json({ error: 'Release date is required (YYYY-MM-DD)' }, { status: 400 });
    }

    const sr = base44.asServiceRole;
    const approvedAt = new Date().toISOString();

    // 1. The Release record — every detail saved to admin.
    const release = await sr.entities.Release.create({
      title,
      type,
      status: 'ready',
      release_date: releaseDate,
      artwork_url: artworkUrl || undefined,
      description: description || undefined,
      lyrics: lyrics || undefined,
      genre: exact(body.genre) || undefined,
      mood: exact(body.mood) || undefined,
      language: exact(body.language) || 'English',
      version_label: versionLabel,
      is_published: false,
      publishing_safe: true,
      public_release_approval_status: 'approved',
      public_release_approved_by: ownerEmail,
      public_release_approved_at: approvedAt,
      public_release_approval_note: `Submitted and approved by ${ownerEmail} via New Release Studio`,
      auto_publish_on_release_date: autoPublish,
    });

    // 2. The Lyric record behind the same publication gate as every other lyric.
    let lyricId = null;
    if (lyrics) {
      const lyric = await sr.entities.Lyric.create({
        title,
        lyrics_text: lyrics,
        release_id: release.id,
        release_title: title,
        source: 'Pasted by Gannon in New Release Studio',
        is_published: false,
        publishing_safe: false,
        release_publication_approved: false,
        publishing_status: 'not_approved',
        approval_status: 'pending',
        version_status: 'ready_for_review',
        needs_review: true,
      });
      lyricId = lyric.id;
    }

    // 3. Press release and playlist pitch drafts into the Content Studio for review.
    const pressDraft = await sr.entities.ContentStudioRecord.create({
      content_type: 'press_snippet',
      title: `Press release draft — ${title}`,
      song: title,
      release: title,
      description: 'Created automatically when this release was submitted. Review, edit and approve before sending.',
      approval_status: 'draft',
    });
    const pitchDraft = await sr.entities.ContentStudioRecord.create({
      content_type: 'pitch_angle',
      title: `Playlist pitch draft — ${title}`,
      song: title,
      release: title,
      description: 'Created automatically when this release was submitted. Review, edit and approve before pitching.',
      approval_status: 'draft',
    });

    // 4. Push the release to Too Lost (OAuth Bearer token from secrets).
    let tooLost = { status: 'not_configured', detail: 'TOO_LOST_API_TOKEN secret is not set.' };
    const token = secrets.get('TOO_LOST_API_TOKEN');
    if (token) {
      const base = secrets.get('TOO_LOST_API_BASE_URL') || 'https://api.toolost.com/v1';
      try {
        const res = await fetch(`${base}/releases`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            title,
            artists: [{ name: 'Gannon Waye', role: 'primary' }],
            release_date: releaseDate,
            tracks: [{ title, ...exact(body.version_label) && exact(body.version_label) !== 'Original' ? { version: exact(body.version_label) } : {} }],
          }),
        });

        if (res.status === 401) {
          tooLost = {
            status: 'reauthorise_required',
            detail: 'Too Lost rejected the token (401). Access tokens expire after 15 days — refresh the TOO_LOST_API_TOKEN secret, then submit again.',
          };
        } else if (res.ok) {
          const data = await res.json().catch(() => ({}));
          tooLost = {
            status: 'created',
            too_lost_release_id: data?.data?.id ?? data?.id ?? null,
            detail: 'Release draft created on Too Lost and scheduled for the release date.',
          };
        } else {
          const text = await res.text().catch(() => '');
          tooLost = { status: 'error', detail: `Too Lost returned ${res.status}: ${text.slice(0, 400)}` };
        }
      } catch (fetchError) {
        tooLost = { status: 'error', detail: `Could not reach Too Lost: ${fetchError?.message || 'unknown error'}` };
      }
    }

    // 5. Admin notification so the submission is always visible in the back office.
    await sr.entities.AdminNotification.create({
      notification_type: 'system',
      severity: tooLost.status === 'created' ? 'info' : 'warning',
      requires_action: tooLost.status !== 'created',
      title: `New release submitted — ${title}`,
      summary: `Saved to admin with release date ${releaseDate}${autoPublish ? ' and scheduled to publish automatically on release day' : ''}. Too Lost sync: ${tooLost.status}. Press release and playlist pitch drafts are waiting in the Content Studio.`,
      source: 'submitNewRelease',
      linked_entity: 'Release',
      linked_id: release.id,
      linked_route: '/admin/releases',
    });

    return Response.json({
      ok: true,
      release_id: release.id,
      lyric_id: lyricId,
      press_draft_id: pressDraft.id,
      pitch_draft_id: pitchDraft.id,
      release_date: releaseDate,
      auto_publish_on_release_date: autoPublish,
      too_lost: tooLost,
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}