import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets, waitUntil } from 'base44:runtime';
import {
  tooLostConfigFromSecrets,
  getValidTooLostAccessToken,
} from '../../shared/tooLostAuth.ts';

// THE ONE-PRESS RELEASE MACHINE. Owner only. A single button press:
//   1. saves the Release + Lyric records,
//   2. WRITES the full launch pack with AI (press release, playlist pitch,
//      subscriber announcement email, 3 reel ideas, a lyric quote post and a
//      ManyChat keyword idea) using only the facts Gannon submitted,
//   3. generates a two-image playlist picture pack (abstract, NO faces ever),
//   4. wires the presave link onto the release,
//   5. pushes the release to Too Lost, and
//   6. schedules everything to go live at midnight on release day
//      (publishDueReleases + its midnight workflow).
// Nothing sends itself: every written piece lands as a draft for owner review.
// body.dry_run=true runs the whole pipeline without the Too Lost push or the
// picture pack, for QA.

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

function exact(value) {
  return String(value || '').trim();
}

function filled(value) {
  return typeof value === 'string' && value.trim().length > 0;
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
    const presaveUrl = exact(body.presave_url);
    const dryRun = body.dry_run === true;

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
      ...(presaveUrl ? { other_links: [{ platform: 'Too Lost Pre-Save', url: presaveUrl }] } : {}),
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

    // 3. THE WRITING PASS. One AI call writes the whole launch pack using ONLY
    //    the facts in this submission. Nothing invented, nothing auto-sent.
    const facts = [
      'Artist: Gannon Waye. Independent, Adelaide-born, Melbourne-based singer-songwriter. Heart-first, independent art.',
      `Release title: ${title}`,
      `Type: ${type}`,
      `Version: ${versionLabel}`,
      `Release date: ${releaseDate}`,
      description ? `The story behind the song, in Gannon's own submission: ${description}` : 'No story was provided. Do not invent one.',
      exact(body.genre) ? `Genre: ${exact(body.genre)}` : '',
      exact(body.mood) ? `Mood: ${exact(body.mood)}` : '',
      lyrics ? `Lyric sheet (use only for the lyric quote): ${lyrics.slice(0, 4000)}` : '',
    ].filter(Boolean).join('\n');

    let pack = null;
    try {
      pack = await base44.integrations.Core.InvokeLLM({
        prompt: `You are the release assistant for Gannon Waye Music. Write the complete launch pack for this new release.

${facts}

Voice and rules:
- Warm, honest, hopeful without hype. First person when speaking as Gannon.
- Australian English. NEVER use an em dash. No emojis.
- Use ONLY the facts above. Never invent chart positions, radio plays, venues, collaborations, quotes, awards, streaming numbers, links or dates.

Deliverables:
1. press_release: a ready-to-send press release, under 1500 characters. Strong opening line, the story, and a closing note that the release is out on the release date.
2. playlist_pitch: a short personal pitch to playlist curators, under 900 characters.
3. subscriber_email: subject and body. An announcement email to fans who subscribed for release updates. Body under 900 characters, warm and personal.
4. social: exactly 3 reel drafts. Each has hook (under 10 words), caption (under 300 characters, includes a call to action), hashtags (max 6, space separated, no # symbols), on_screen_text (short overlay text), cta, visual_direction (what to film. Gannon's own footage, lyric cards or artwork stills only. Never describe showing other people's faces).
5. lyric_quote: the single most powerful lyric line from the lyric sheet that would stop a scroller, under 120 characters. Empty string if no lyric sheet was provided.
6. manychat: keyword (one word, uppercase) and reply (the auto-reply fans get, under 400 characters).`,
        response_json_schema: {
          type: 'object',
          properties: {
            press_release: { type: 'string' },
            playlist_pitch: { type: 'string' },
            subscriber_email: {
              type: 'object',
              properties: { subject: { type: 'string' }, body: { type: 'string' } },
            },
            social: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  hook: { type: 'string' },
                  caption: { type: 'string' },
                  hashtags: { type: 'string' },
                  on_screen_text: { type: 'string' },
                  cta: { type: 'string' },
                  visual_direction: { type: 'string' },
                },
              },
            },
            lyric_quote: { type: 'string' },
            manychat: {
              type: 'object',
              properties: { keyword: { type: 'string' }, reply: { type: 'string' } },
            },
          },
        },
      });
    } catch {
      pack = null;
    }

    // 4. Save the pack as Content Studio drafts. Nothing is live; every card
    //    waits for owner review exactly like every other piece of content.
    const pressDraft = await sr.entities.ContentStudioRecord.create({
      content_type: 'press_snippet',
      title: `Press release — ${title}`,
      song: title,
      release: title,
      caption: filled(pack?.press_release) ? pack.press_release.slice(0, 2200) : '',
      description: filled(pack?.press_release)
        ? 'Written by the release assistant from the submitted release facts. Review before sending.'
        : 'AI writing failed this time. Write or paste the press release here, then review.',
      approval_status: 'draft',
    });

    const pitchDraft = await sr.entities.ContentStudioRecord.create({
      content_type: 'pitch_angle',
      title: `Playlist pitch — ${title}`,
      song: title,
      release: title,
      caption: filled(pack?.playlist_pitch) ? pack.playlist_pitch.slice(0, 2200) : '',
      description: filled(pack?.playlist_pitch)
        ? 'Written by the release assistant. Review before pitching.'
        : 'AI writing failed this time. Write or paste the pitch here, then review.',
      approval_status: 'draft',
    });

    let emailDraftId = null;
    if (pack?.subscriber_email?.body) {
      const emailDraft = await sr.entities.ContentStudioRecord.create({
        content_type: 'caption',
        title: `Subscriber announcement email — ${title}`,
        song: title,
        release: title,
        caption: `Subject: ${exact(pack.subscriber_email.subject) || `${title} is out now`}\n\n${pack.subscriber_email.body}`.slice(0, 2200),
        description: 'Draft fan announcement for release day. Review it, then send from the Newsletter dashboard.',
        approval_status: 'draft',
      });
      emailDraftId = emailDraft.id;
    }

    const socialDraftIds = [];
    if (Array.isArray(pack?.social)) {
      for (const [index, idea] of pack.social.slice(0, 3).entries()) {
        if (!filled(idea?.hook) && !filled(idea?.caption)) continue;
        const socialDraft = await sr.entities.ContentStudioRecord.create({
          content_type: 'reel_idea',
          title: `Reel idea ${index + 1} — ${title}`,
          song: title,
          release: title,
          hook: exact(idea.hook).slice(0, 500),
          caption: exact(idea.caption).slice(0, 2200),
          hashtags: exact(idea.hashtags).slice(0, 1000),
          on_screen_text: exact(idea.on_screen_text).slice(0, 1000),
          cta: exact(idea.cta),
          visual_direction: exact(idea.visual_direction).slice(0, 1000),
          description: 'Written by the release assistant. Review before posting.',
          approval_status: 'draft',
        });
        socialDraftIds.push(socialDraft.id);
      }
    }

    if (filled(pack?.lyric_quote)) {
      await sr.entities.ContentStudioRecord.create({
        content_type: 'lyric_quote_post',
        title: `Lyric quote post — ${title}`,
        song: title,
        release: title,
        hook: pack.lyric_quote.slice(0, 500),
        description: 'Quote taken from the submitted lyric sheet. Review before posting.',
        approval_status: 'draft',
      });
    }

    if (filled(pack?.manychat?.keyword)) {
      await sr.entities.ContentStudioRecord.create({
        content_type: 'manychat_keyword',
        title: `ManyChat keyword — ${title}`,
        song: title,
        release: title,
        manychat_keyword: exact(pack.manychat.keyword).toUpperCase().slice(0, 40),
        caption: exact(pack.manychat.reply).slice(0, 2200),
        description: 'Auto-reply draft. Review, then set up in ManyChat.',
        approval_status: 'draft',
      });
    }

    // 5. PLAYLIST PICTURE PACK — two visuals, abstract, absolutely no faces.
    //    Generated after the response so the button press stays instant; the
    //    pictures land in the admin gallery for review.
    if (!dryRun) {
      waitUntil((async () => {
        try {
          const tile = await sr.integrations.Core.GenerateImage({
            prompt: `Square playlist cover tile for the music single "${title}" by Gannon Waye. Deep near-black background, luminous warm gold light (#D4AF37), a soft glowing orb radiating gentle rays, elegant premium serif typography reading "${title.toUpperCase()}" with "Gannon Waye" beneath it. Cinematic, emotional, high-end independent music artwork. Absolutely no people, no faces, no human likenesses.`,
          });
          const story = await sr.integrations.Core.GenerateImage({
            prompt: `Vertical 9:16 story tile promoting the music single "${title}" by Gannon Waye. Deep near-black background, luminous warm gold light (#D4AF37), a soft glowing orb with gentle rays behind elegant serif typography reading "${title.toUpperCase()}" with "Out now" beneath it and "Gannon Waye" at the bottom. Cinematic independent music artwork. Absolutely no people, no faces, no human likenesses.`,
          });
          await sr.entities.GalleryImage.create({
            title: `Playlist picture (square) — ${title}`,
            image_url: tile?.url || '',
            category: 'release_artwork',
            description: 'Auto-generated playlist visual from the one-press release pack. No faces. Review before any public use.',
            photographer_credit: 'Release assistant (AI generated, no faces)',
            related_release: title,
            is_published: false,
          });
          await sr.entities.GalleryImage.create({
            title: `Playlist picture (story) — ${title}`,
            image_url: story?.url || '',
            category: 'release_artwork',
            description: 'Auto-generated story-format playlist visual from the one-press release pack. No faces. Review before any public use.',
            photographer_credit: 'Release assistant (AI generated, no faces)',
            related_release: title,
            is_published: false,
          });
          if (tile?.url) {
            await sr.entities.ContentStudioRecord.update(pitchDraft.id, { media_url: tile.url });
          }
          await sr.entities.AdminNotification.create({
            notification_type: 'system',
            severity: 'info',
            title: `Playlist picture pack ready — ${title}`,
            summary: 'Two visuals (square + story), generated with no faces, were saved to the gallery as drafts for review.',
            source: 'submitNewRelease',
            linked_entity: 'Release',
            linked_id: release.id,
            linked_route: '/admin/releases',
          });
        } catch {
          await sr.entities.AdminNotification.create({
            notification_type: 'system',
            severity: 'warning',
            requires_action: true,
            title: `Playlist picture pack failed — ${title}`,
            summary: 'The visuals could not be generated this time. The rest of the launch pack is safe in the Content Studio.',
            source: 'submitNewRelease',
            linked_entity: 'Release',
            linked_id: release.id,
            linked_route: '/admin/content-studio',
          });
        }
      })());
    }

    // 6. Push the release to Too Lost using the connected account (auto-renewed OAuth).
    let tooLost;
    if (dryRun) {
      tooLost = { status: 'not_attempted', detail: 'Dry run: Too Lost push skipped.' };
    } else {
      const config = tooLostConfigFromSecrets(secrets);
      const apiBase = secrets.get('TOO_LOST_API_BASE_URL') || 'https://api.toolost.com/v1';
      const auth = await getValidTooLostAccessToken(sr, config);

      if (auth.token) {
        try {
          const res = await fetch(`${apiBase}/releases`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${auth.token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              title,
              artists: [{ name: 'Gannon Waye', role: 'primary' }],
              release_date: releaseDate,
              tracks: [{
                title,
                ...(versionLabel && versionLabel !== 'Original' ? { version: versionLabel } : {}),
              }],
              ...(exact(body.genre) ? { genre: exact(body.genre) } : {}),
              ...(exact(body.mood) ? { mood: exact(body.mood) } : {}),
              ...(artworkUrl ? { artwork_url: artworkUrl } : {}),
              ...(presaveUrl ? { presave_url: presaveUrl } : {}),
            }),
          });

          if (res.status === 401) {
            tooLost = {
              status: 'reauthorise_required',
              detail: 'Too Lost rejected the connection. Click Connect Too Lost on the Distributors page, then submit again.',
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
      } else {
        tooLost = { status: auth.error, detail: auth.detail };
      }

      await sr.entities.Release.update(release.id, {
        toolost_sync_status: tooLost.status === 'created' ? 'created' : (tooLost.status || 'not_attempted'),
      });
    }

    // 7. Admin notification so the submission is always visible in the back office.
    await sr.entities.AdminNotification.create({
      notification_type: 'system',
      severity: tooLost.status === 'created' ? 'info' : 'warning',
      requires_action: tooLost.status !== 'created',
      title: `New release submitted — ${title}`,
      summary: `Saved to admin with release date ${releaseDate}${autoPublish ? ' and scheduled to publish automatically on release day' : ''}. Launch pack drafted: press release, playlist pitch${emailDraftId ? ', subscriber email' : ''}, ${socialDraftIds.length} reel ideas${filled(pack?.lyric_quote) ? ', a lyric quote post' : ''}${filled(pack?.manychat?.keyword) ? ', a ManyChat keyword idea' : ''}. ${dryRun ? 'Picture pack skipped (dry run).' : 'Playlist pictures generating.'} Too Lost sync: ${tooLost.status}.`,
      source: 'submitNewRelease',
      linked_entity: 'Release',
      linked_id: release.id,
      linked_route: '/admin/releases',
    });

    return Response.json({
      ok: true,
      dry_run: dryRun,
      release_id: release.id,
      lyric_id: lyricId,
      press_draft_id: pressDraft.id,
      pitch_draft_id: pitchDraft.id,
      email_draft_id: emailDraftId,
      social_draft_ids: socialDraftIds,
      pack: {
        press_release: filled(pack?.press_release),
        playlist_pitch: filled(pack?.playlist_pitch),
        subscriber_email: !!pack?.subscriber_email?.body,
        social_count: socialDraftIds.length,
        lyric_quote: filled(pack?.lyric_quote),
        manychat: filled(pack?.manychat?.keyword),
      },
      presave_wired: !!presaveUrl,
      pictures: dryRun ? 'skipped_dry_run' : 'generating',
      release_date: releaseDate,
      auto_publish_on_release_date: autoPublish,
      too_lost: tooLost,
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}