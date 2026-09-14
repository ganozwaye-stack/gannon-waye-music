import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// RELEASE LAUNCH PACKET STUDIO. Owner only. Creates a private release draft,
// then runs the owner's launch agents (specialist LLM with live web research)
// to build the full promotional packet in one press: a hero design draft,
// merchandise concepts, social posts, a press release, a playlist pitch, a
// fan email and a dated launch plan. Every generated item is a private draft
// awaiting the owner's separate review and approval. This endpoint never
// publishes, delivers to a distributor, posts, emails, schedules, spends,
// or takes any external action.

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

const PLATFORMS = new Set(['tiktok', 'instagram', 'youtube', 'facebook', 'x_twitter', 'all']);
const MERCH_TYPES = new Set(['tshirt', 'jumper', 'hoodie', 'cap', 'poster', 'cover', 'thumbnail', 'social_tile', 'ad_creative', 'template', 'other']);
const STEP_TYPES = new Set(['song_record', 'artwork', 'lyrics_storage', 'lyrics_approval', 'story', 'release_page', 'spotify_link', 'apple_music_link', 'youtube_link', 'press_pitch', 'playlist_pitch', 'reel_hooks', 'merch_tie_in', 'newsletter_draft', 'manychat_keyword', 'metricool_draft', 'approval_status', 'publish_status']);

const PACKET_SCHEMA = {
  type: 'object',
  properties: {
    press_release: { type: 'string', description: 'Ready-to-send press release under 2000 characters' },
    playlist_pitch: { type: 'string', description: 'Editor pitch under 2000 characters' },
    subscriber_email_subject: { type: 'string' },
    subscriber_email_body: { type: 'string' },
    social_posts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          platform: { type: 'string' },
          hook: { type: 'string' },
          caption: { type: 'string' },
          first_comment: { type: 'string' },
          hashtags: { type: 'string' },
          visual_direction: { type: 'string' },
          cta: { type: 'string' },
          manychat_keyword: { type: 'string' },
        },
        required: ['title', 'platform', 'caption'],
      },
    },
    merch_concepts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          product_type: { type: 'string' },
          concept: { type: 'string' },
          story_source: { type: 'string' },
        },
        required: ['name', 'concept'],
      },
    },
    hero_eyebrow: { type: 'string' },
    hero_copy: { type: 'string' },
    launch_plan: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          day_offset: { type: 'number' },
          step_type: { type: 'string' },
          needs_approval: { type: 'boolean' },
        },
        required: ['title'],
      },
    },
  },
  required: ['press_release', 'playlist_pitch', 'social_posts', 'merch_concepts', 'launch_plan'],
};

function exact(value) {
  return String(value || '').trim();
}

function cap(text, max) {
  const t = String(text || '').trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

function offsetDate(releaseDate, days) {
  const d = new Date(`${releaseDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return undefined;
  d.setUTCDate(d.getUTCDate() + Math.round(Number(days) || 0));
  return d.toISOString().slice(0, 10);
}

function buildPrompt(ctx) {
  const story = ctx.description || 'No story provided yet. Leave a [PLACEHOLDER] where the story is needed.';
  const lyricExcerpt = ctx.lyricsExcerpt
    ? `\n- Lyric excerpt (for lyric-quote posts only):\n${ctx.lyricsExcerpt}`
    : '\n- No lyrics were provided. Do not invent lyric lines; use [PLACEHOLDER] where a lyric quote belongs.';

  return `You are the senior launch strategist for Gannon Waye, an independent Australian singer-songwriter. His brand is Thanking You Kindly: a care-led music and gifting brand honouring his late mother Sonia Waye, with a share of proceeds supporting 1800RESPECT (domestic and family violence support). His aesthetic is a dark, cinematic gold palette. His voice is sincere, warm and specific, never hypey or generic.

A new private release draft was just created. Research today's current best practices for independent artists (press release formats for Australian music media, Spotify editorial and algorithmic playlist pitching, TikTok/Reels/Shorts release strategies, ManyChat keyword automations, merch drops timed to releases, pre-save and release-week funnels) and apply what the most authoritative current sources say.

Release details:
- Title: ${ctx.title}
- Version: ${ctx.versionLabel}
- Type: ${ctx.type}
- Release date: ${ctx.releaseDate}
- Genre: ${ctx.genre || 'not set'}
- Mood: ${ctx.mood || 'not set'}
- Story behind the song: ${story}${lyricExcerpt}

Produce the complete promotional launch packet as private owner-review drafts:

1. press_release: a ready-to-send press release, under 2000 characters, aimed at Australian music blogs, radio and playlists. Structured with a strong opening line, story angle, release facts and a short artist bio referencing the Thanking You Kindly mission.
2. playlist_pitch: under 2000 characters, written for a Spotify editorial playlist pitch, with genre/mood framing, the emotional core of the song, and why it fits editorial playlists right now.
3. subscriber_email_subject and subscriber_email_body: a warm fan email announcing the upcoming release, honest and personal, under 800 characters for the body.
4. social_posts: 6 to 8 posts across instagram, tiktok and youtube (platform must be one of those three). Mix announcement, story, lyric-quote (only from the provided lyrics), behind-the-scenes, countdown and release-day posts. Each has a short punchy hook, a caption under 1500 characters, a first_comment, hashtags, a visual_direction in the brand's dark-gold cinematic style, a cta and, where it fits a DM automation, a short manychat_keyword in CAPS.
5. merch_concepts: exactly 3 concepts tied to the song's story and the gifting brand (a clothing piece, a giftable item and one other). product_type must be one of: tshirt, jumper, hoodie, cap, poster, cover, thumbnail, social_tile, ad_creative, template, other. Each has a name, a concept description under 900 characters and a story_source naming what part of the song or story it draws on.
6. hero_eyebrow and hero_copy: the small label and one emotional line for the website homepage hero featuring this release. hero_copy under 160 characters.
7. launch_plan: 14 to 18 dated action items running from 28 days before release day to 14 days after. day_offset is days relative to the release date (negative before, 0 on release day). step_type must be one of: song_record, artwork, lyrics_storage, lyrics_approval, story, release_page, spotify_link, apple_music_link, youtube_link, press_pitch, playlist_pitch, reel_hooks, merch_tie_in, newsletter_draft, manychat_keyword, metricool_draft, approval_status, publish_status. Public-facing or external steps must have needs_approval true. Each description is under 400 characters and says exactly what to do and which tool in Gannon's studio handles it.

Hard style rules: never use the em dash character. Never fabricate streaming numbers, awards, press coverage or quotes from real people. Where a fact, link or lyric is unknown, write [PLACEHOLDER] instead of inventing it. Tone: sincere, specific, care-led.`;
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
      return Response.json({
        error: 'Confirm that this creates a private record and private promotional drafts only.',
      }, { status: 400 });
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

    // A new record begins private and cannot become public by date alone.
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

    // Private review shells. The launch agents fill these below; they stay
    // owner-review drafts and nothing about them is approved by existing.
    const pressDraft = await sr.entities.ContentStudioRecord.create({
      content_type: 'press_snippet',
      title: `Press release — ${title}`,
      song: title,
      release: title,
      caption: '',
      description: 'Private review shell.',
      approval_status: 'draft',
    });

    const pitchDraft = await sr.entities.ContentStudioRecord.create({
      content_type: 'pitch_angle',
      title: `Playlist pitch — ${title}`,
      song: title,
      release: title,
      caption: '',
      description: 'Private review shell.',
      approval_status: 'draft',
    });

    // ── LAUNCH PACKET ──────────────────────────────────────────────
    // One specialist pass with live web research builds every promotional
    // draft in one go. Failure here never loses the release draft: the
    // packet is reported as failed and the shells stay blank.
    let packet = null;
    let packetError = null;
    try {
      const llm = await sr.integrations.Core.InvokeLLM({
        prompt: buildPrompt({
          title,
          versionLabel,
          type,
          releaseDate,
          genre: exact(body.genre),
          mood: exact(body.mood),
          description,
          lyricsExcerpt: lyrics ? lyrics.slice(0, 1500) : '',
        }),
        add_context_from_internet: true,
        response_json_schema: PACKET_SCHEMA,
      });
      packet = llm && typeof llm === 'object' ? llm : null;
      if (!packet || !Array.isArray(packet.social_posts) || !Array.isArray(packet.launch_plan)) {
        packet = null;
        packetError = 'The strategy pass returned an incomplete packet';
      }
    } catch (e) {
      packetError = e?.message || 'The strategy pass failed';
    }

    let pressDone = false;
    let pitchDone = false;
    let releaseEmailDraftId = null;
    let heroDraftId = null;
    const socialDraftIds = [];
    const merchConceptIds = [];
    const launchPlanIds = [];

    if (packet) {
      // Press release and playlist pitch fill their shells, still drafts.
      if (exact(packet.press_release)) {
        await sr.entities.ContentStudioRecord.update(pressDraft.id, {
          caption: cap(packet.press_release, 2000),
          description: 'Generated launch packet draft. Owner review required before any use.',
        });
        pressDone = true;
      }
      if (exact(packet.playlist_pitch)) {
        await sr.entities.ContentStudioRecord.update(pitchDraft.id, {
          caption: cap(packet.playlist_pitch, 2000),
          description: 'Generated launch packet draft. Owner review required before any use.',
        });
        pitchDone = true;
      }

      // Fan email: a proper staged draft in the Release Email Studio.
      if (exact(packet.subscriber_email_subject)) {
        const emailDraft = await sr.entities.ReleaseEmailDraft.create({
          release_id: release.id,
          release_title: title,
          status: 'ready',
          subject: cap(packet.subscriber_email_subject, 200),
          body_text: exact(packet.subscriber_email_body) || undefined,
          artwork_url: artworkUrl || undefined,
          recipient_count: 0,
          approval_status: 'draft',
          prepared_source: 'launch_packet',
        });
        releaseEmailDraftId = emailDraft.id;
      }

      // Social posts: reel/post drafts in the Content Studio.
      for (let i = 0; i < packet.social_posts.length; i++) {
        const post = packet.social_posts[i] || {};
        const platformRaw = exact(post.platform).toLowerCase();
        if (!exact(post.caption)) continue;
        const record = await sr.entities.ContentStudioRecord.create({
          content_type: 'reel_idea',
          title: cap(post.title || `${title} post ${i + 1}`, 200),
          song: title,
          release: title,
          hook: cap(post.hook, 500) || undefined,
          caption: cap(post.caption, 2200),
          first_comment: cap(post.first_comment, 2200) || undefined,
          hashtags: cap(post.hashtags, 1000) || undefined,
          visual_direction: cap(post.visual_direction, 1000) || undefined,
          cta: cap(post.cta, 500) || undefined,
          manychat_keyword: exact(post.manychat_keyword) || undefined,
          platform: PLATFORMS.has(platformRaw) ? platformRaw : 'instagram',
          approval_status: 'draft',
          posted_status: 'not_posted',
          sort_order: i,
        });
        socialDraftIds.push(record.id);
      }

      // Merch concepts: design drafts in the merch design lane.
      for (const concept of packet.merch_concepts || []) {
        const c = concept || {};
        if (!exact(c.name)) continue;
        const typeRaw = exact(c.product_type).toLowerCase();
        const record = await sr.entities.DeegoDesignAsset.create({
          asset_name: cap(c.name, 200),
          asset_type: MERCH_TYPES.has(typeRaw) ? typeRaw : 'other',
          creation_mode: 'hybrid',
          linked_song_title: title,
          story_source: cap(c.story_source, 500) || 'Launch packet concept',
          notes: cap(c.concept, 2000),
          approval_status: 'draft',
          commercial_readiness: 'idea',
        });
        merchConceptIds.push(record.id);
      }

      // Hero design: a private Canvas Studio draft featuring this release.
      // is_live stays false, so the public hero does not change one pixel.
      const heroDraft = await sr.entities.HeroDesignSettings.create({
        is_live: false,
        hero_release_id: release.id,
        eyebrow_label: cap(packet.hero_eyebrow, 60) || 'New Release',
        heart_art_url: artworkUrl || '',
      });
      heroDraftId = heroDraft.id;

      // Dated launch plan from 28 days out to 14 days after release.
      for (const step of packet.launch_plan) {
        const s = step || {};
        if (!exact(s.title)) continue;
        const stepRaw = exact(s.step_type).toLowerCase();
        const record = await sr.entities.ReleaseActionPlan.create({
          title: cap(s.title, 200),
          description: cap(s.description, 2000),
          category: cap(s.category, 100) || 'release_launch',
          status: 'not_started',
          due_date: offsetDate(releaseDate, s.day_offset),
          related_release: release.id,
          related_song: title,
          release_name: title,
          step_type: STEP_TYPES.has(stepRaw) ? stepRaw : 'story',
          approval_required: s.needs_approval !== false,
        });
        launchPlanIds.push(record.id);
      }
    }

    const tooLost = {
      status: 'held',
      detail: 'Distribution is intentionally held. It requires a separate owner-approved delivery workflow.',
    };

    await sr.entities.AdminNotification.create({
      notification_type: 'system',
      severity: packetError ? 'warning' : 'info',
      requires_action: true,
      title: packetError
        ? `Release created, launch packet failed — ${title}`
        : `Release and launch packet created — ${title}`,
      summary: packetError
        ? `The private release draft was saved for ${releaseDate}, but the launch packet could not be built: ${packetError}. The review shells remain blank.`
        : `Private draft saved for ${releaseDate}. Launch packet drafted privately: ${socialDraftIds.length} social posts, ${merchConceptIds.length} merch concepts, hero design draft, ${launchPlanIds.length} launch-plan steps. Nothing is published, delivered, posted, emailed or scheduled.`,
      source: 'submitNewRelease',
      linked_entity: 'Release',
      linked_id: release.id,
      linked_route: '/admin/releases',
    });

    return Response.json({
      ok: true,
      private_draft: true,
      launch_packet: packetError ? 'failed' : 'built',
      launch_packet_error: packetError || undefined,
      release_id: release.id,
      lyric_id: lyricId,
      press_draft_id: pressDraft.id,
      pitch_draft_id: pitchDraft.id,
      email_draft_id: releaseEmailDraftId,
      hero_draft_id: heroDraftId,
      social_draft_ids: socialDraftIds,
      merch_concept_ids: merchConceptIds,
      launch_plan_ids: launchPlanIds,
      pack: {
        press_release: pressDone,
        playlist_pitch: pitchDone,
        subscriber_email: !!releaseEmailDraftId,
        social_count: socialDraftIds.length,
        merch_count: merchConceptIds.length,
        hero_draft: !!heroDraftId,
        launch_plan_count: launchPlanIds.length,
        review_shells: 3,
      },
      presave_wired: !!presaveUrl,
      pictures: 'not_requested',
      release_date: releaseDate,
      auto_publish_on_release_date: false,
      too_lost: tooLost,
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}