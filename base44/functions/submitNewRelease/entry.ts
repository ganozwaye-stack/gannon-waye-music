import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// RELEASE DRAFT STUDIO. Owner only. This endpoint creates private records and
// blank review shells. It never publishes, delivers to a distributor, posts,
// emails, schedules, or generates promotional material.

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
      return Response.json({ error: 'Only Gannon can create a new release draft' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    if (body.private_draft_acknowledged !== true) {
      return Response.json({ error: 'Confirm that this creates a private record and review shells only.' }, { status: 400 });
    }

    const title = exact(body.title);
    const releaseDate = exact(body.release_date);
    const lyrics = exact(body.lyrics);
    const artworkUrl = exact(body.artwork_url);
    const description = exact(body.description);
    const versionLabel = exact(body.version_label) || 'Original';
    const type = ['single', 'ep', 'album'].includes(exact(body.type)) ? exact(body.type) : 'single';
    const presaveUrl = exact(body.presave_url);

    if (!title) return Response.json({ error: 'Song name is required' }, { status: 400 });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
      return Response.json({ error: 'Release date is required (YYYY-MM-DD)' }, { status: 400 });
    }

    const sr = base44.asServiceRole;
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
      publishing_safe: false,
      public_release_approval_status: 'pending',
      public_release_approval_note: 'Created as a private launch draft. Rights, delivery, public approval and channel approvals remain required.',
      auto_publish_on_release_date: false,
      release_email_dispatch_state: 'idle',
      ...(presaveUrl ? { other_links: [{ platform: 'Too Lost Pre-Save', url: presaveUrl }] } : {}),
    });

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

    const pressDraft = await sr.entities.ContentStudioRecord.create({ content_type: 'press_snippet', title: `Press release — ${title}`, song: title, release: title, caption: '', description: 'Private review shell.', approval_status: 'draft' });
    const pitchDraft = await sr.entities.ContentStudioRecord.create({ content_type: 'pitch_angle', title: `Playlist pitch — ${title}`, song: title, release: title, caption: '', description: 'Private review shell.', approval_status: 'draft' });
    const emailDraft = await sr.entities.ContentStudioRecord.create({ content_type: 'caption', title: `Subscriber announcement email — ${title}`, song: title, release: title, caption: '', description: 'Private review shell.', approval_status: 'draft' });

    await sr.entities.AdminNotification.create({
      notification_type: 'system', severity: 'warning', requires_action: true,
      title: `Private release draft created — ${title}`,
      summary: `Saved privately with release date ${releaseDate}. Three blank review shells were created. It has not been delivered, published, posted, emailed, scheduled, or made public.`,
      source: 'submitNewRelease', linked_entity: 'Release', linked_id: release.id, linked_route: '/admin/releases',
    });

    return Response.json({
      ok: true, private_draft: true, external_actions: 'held', release_id: release.id, lyric_id: lyricId,
      press_draft_id: pressDraft.id, pitch_draft_id: pitchDraft.id, email_draft_id: emailDraft.id,
      social_draft_ids: [], pack: { press_release: false, playlist_pitch: false, subscriber_email: false, social_count: 0, lyric_quote: false, manychat: false, review_shells: 3 },
      presave_wired: !!presaveUrl, pictures: 'not_requested', release_date: releaseDate, auto_publish_on_release_date: false,
      too_lost: { status: 'held', detail: 'Distribution is intentionally held. It requires a separate owner-approved delivery workflow.' },
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}