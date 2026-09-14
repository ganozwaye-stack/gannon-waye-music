import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

// ONE PRESS LAUNCH PACKET. Owner only, deliberately decoupled from the
// private release-draft flow. One acknowledged press drafts the whole
// launch packet as PRIVATE records: press release, playlist pitch, fan
// email copy, social posts, merch concepts with manufacturer design specs,
// and a dated campaign calendar. Nothing publishes, posts, sends, schedules
// or delivers; every record is a draft held for separate owner approval.

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

function exact(value) {
  return String(value || '').trim();
}

const cut = (value, max) => exact(value).slice(0, max);

function addDays(dateStr, offset) {
  const d = new Date(exact(dateStr) + 'T00:00:00Z');
  if (Number.isNaN(d.getTime())) return exact(dateStr);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

function slugify(text) {
  return exact(text).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) || 'release';
}

const CALENDAR_PLATFORMS = ['tiktok', 'instagram_reels', 'instagram_feed', 'instagram_stories', 'facebook', 'twitter_x', 'youtube_shorts'];
const CALENDAR_CONTENT_TYPES = ['video_hook', 'story', 'community_cta', 'merch_cta', 'countdown', 'release_day', 'behind_scenes', 'lyric_reveal', 'fan_engagement'];

function calendarPlatform(value) {
  const v = exact(value).toLowerCase().replace(/\s+/g, '_');
  if (CALENDAR_PLATFORMS.includes(v)) return v;
  if (v.startsWith('instagram')) return 'instagram_reels';
  if (v === 'youtube' || v === 'shorts') return 'youtube_shorts';
  if (v === 'x' || v === 'twitter') return 'twitter_x';
  return 'tiktok';
}

function calendarContentType(value) {
  const v = exact(value).toLowerCase().replace(/[\s-]+/g, '_');
  return CALENDAR_CONTENT_TYPES.includes(v) ? v : 'video_hook';
}

const CAMPAIGN_SCHEMA = {
  type: 'object',
  properties: {
    press_release: { type: 'string' },
    playlist_pitch: { type: 'string' },
    fan_email: { type: 'string' },
    social_posts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          platform: { type: 'string', enum: ['tiktok', 'instagram', 'youtube', 'facebook'] },
          hook: { type: 'string' },
          caption: { type: 'string' },
          hashtags: { type: 'string' },
          first_comment: { type: 'string' },
          visual_direction: { type: 'string' },
          cta: { type: 'string' },
          manychat_keyword: { type: 'string' },
        },
        required: ['title', 'hook', 'caption'],
      },
    },
    schedule: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day_offset: { type: 'number' },
          platform: { type: 'string' },
          content_type: { type: 'string' },
          hook: { type: 'string' },
          caption: { type: 'string' },
          cta: { type: 'string' },
          visual_brief: { type: 'string' },
        },
        required: ['day_offset', 'platform', 'content_type', 'hook'],
      },
    },
  },
  required: ['press_release', 'playlist_pitch', 'fan_email', 'social_posts', 'schedule'],
};

const MERCH_SCHEMA = {
  type: 'object',
  properties: {
    concepts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          asset_type: { type: 'string', enum: ['tshirt', 'jumper', 'hoodie', 'cap', 'poster', 'print'] },
          concept_pitch: { type: 'string' },
          linked_lyric: { type: 'string' },
          template_size: { type: 'string' },
          print_method: { type: 'string' },
          fabric: { type: 'string' },
          placement: { type: 'string' },
          size_chart: { type: 'string' },
          colourway: { type: 'string' },
          manufacturer_spec: { type: 'string' },
        },
        required: ['name', 'asset_type', 'concept_pitch', 'manufacturer_spec'],
      },
    },
  },
  required: ['concepts'],
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin' || !OWNER_EMAILS.has(exact(user.email).toLowerCase())) {
      return Response.json({ error: 'Only Gannon can generate a launch packet' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    if (body.launch_packet_acknowledged !== true) {
      return Response.json({
        error: 'Confirm the launch-packet acknowledgement first. Everything is generated as a private draft only.',
      }, { status: 400 });
    }

    const releaseId = exact(body.release_id);
    if (!releaseId) return Response.json({ error: 'release_id is required' }, { status: 400 });

    const sr = base44.asServiceRole;
    const release = await sr.entities.Release.get(releaseId).catch(() => null);
    if (!release?.id) return Response.json({ error: 'Release not found' }, { status: 404 });
    if (release.is_published === true) {
      return Response.json({ error: 'This release is already public. Packets are for private releases only.' }, { status: 409 });
    }

    const title = exact(release.title);
    const story = exact(release.description);
    const lyricsSample = cut(release.lyrics, 1200);
    const releaseDate = exact(release.release_date);
    const campaign = 'launch_' + slugify(title);

    const brandBrief =
      'You are drafting a private launch packet for Gannon Waye, a care-led singer-songwriter who runs Thanking You Kindly. '
      + 'Brand voice: sincere, warm, grounded, never salesy, never hype. House rules: never use the em dash character in any copy; '
      + 'use commas, colons or the middot instead. Gold essence palette only (gold #d4af37, champagne #f0e6c8, ivory #fdf4e0, night #0a0a0e). '
      + 'Everything you write is a private draft for the owner to review and approve; never claim anything is live. ';

    const releaseBrief =
      `Song title: ${title}. Release date: ${releaseDate}. `
      + `Story behind the song: ${story || 'not provided, keep the copy gentle and universal'}. `
      + `Lyrics sample for tone and quotes: ${lyricsSample || 'not provided, do not quote lyrics'}. `;

    const campaignDraft = await sr.integrations.Core.InvokeLLM({
      prompt: brandBrief
        + releaseBrief
        + 'Draft: 1) a one-paragraph press release, 2) a short playlist curator pitch, 3) a fan announcement email in plain text, '
        + '4) four to six social post drafts (title, platform, hook, caption, hashtags, first comment, visual direction, CTA, optional ManyChat keyword), '
        + '5) a campaign schedule of six to nine slots, each with a day_offset relative to the release date (use values between -21 and +14), '
        + 'a platform, a content_type from: video_hook, story, community_cta, merch_cta, countdown, release_day, behind_scenes, lyric_reveal, fan_engagement, '
        + 'a hook, a caption, a CTA and a visual brief. Write everything in the brand voice.',
      response_json_schema: CAMPAIGN_SCHEMA,
    });

    const merchDraft = await sr.integrations.Core.InvokeLLM({
      prompt: brandBrief
        + releaseBrief
        + 'Draft three merchandise concepts tied to the song story. For each concept give: name, asset_type (tshirt, jumper, hoodie, cap, poster or print), '
        + 'concept_pitch, a short lyric line that suits it (linked_lyric), template_size (print area in mm), print_method (DTG, screen print, embroidery or sublimation), '
        + 'fabric, placement, size_chart (XS to 3XL guidance), colourway using the brand palette with exact hex codes, and manufacturer_spec: a complete '
        + 'spec sheet a manufacturer can produce from, covering garment or stock type, weight, print area, stitch or finish notes, colourway hex codes and packaging. '
        + 'These specs let the owner create the designs manually with a manufacturer.',
      response_json_schema: MERCH_SCHEMA,
    });

    const campaignData = campaignDraft || {};
    const merchData = merchDraft || {};
    const socialPosts = Array.isArray(campaignData.social_posts) ? campaignData.social_posts : [];
    const schedule = Array.isArray(campaignData.schedule) ? campaignData.schedule : [];
    const concepts = Array.isArray(merchData.concepts) ? merchData.concepts : [];

    const created = { press: null, pitch: null, fan_email: null, social_count: 0, merch_count: 0, calendar_count: 0 };

    const press = await sr.entities.ContentStudioRecord.create({
      content_type: 'press_snippet',
      title: `Press release — ${title}`,
      song: title, release: title,
      caption: cut(campaignData.press_release, 2200),
      description: 'Private launch-packet draft. Not approved for any use.',
      approval_status: 'draft',
    });
    created.press = press.id;

    const pitch = await sr.entities.ContentStudioRecord.create({
      content_type: 'pitch_angle',
      title: `Playlist pitch — ${title}`,
      song: title, release: title,
      caption: cut(campaignData.playlist_pitch, 2200),
      description: 'Private launch-packet draft. Not approved for any use.',
      approval_status: 'draft',
    });
    created.pitch = pitch.id;

    const fanEmail = await sr.entities.ContentStudioRecord.create({
      content_type: 'caption',
      title: `Subscriber announcement email — ${title}`,
      song: title, release: title,
      caption: cut(campaignData.fan_email, 2200),
      description: 'Private launch-packet draft. Stage it in the Release Email Studio only when you approve it.',
      approval_status: 'draft',
    });
    created.fan_email = fanEmail.id;

    for (const post of socialPosts) {
      const postTitle = cut(post.title, 200) || 'Untitled post draft';
      await sr.entities.ContentStudioRecord.create({
        content_type: 'reel_idea',
        title: postTitle,
        song: title, release: title,
        hook: cut(post.hook, 500),
        caption: cut(post.caption, 2200),
        hashtags: cut(post.hashtags, 1000),
        first_comment: cut(post.first_comment, 2200),
        visual_direction: cut(post.visual_direction, 1000),
        cta: cut(post.cta, 200),
        manychat_keyword: cut(post.manychat_keyword, 60).toUpperCase(),
        platform: calendarPlatform(post.platform) === 'instagram_reels' ? 'instagram' : calendarPlatform(post.platform),
        approval_status: 'draft',
        description: 'Private launch-packet draft. Not approved for any use.',
      });
      created.social_count += 1;
    }

    const manufacturerSpecs = [];
    for (const concept of concepts) {
      const spec = cut(concept.manufacturer_spec, 1000);
      const conceptName = cut(concept.name, 120) || 'Merch concept';
      const asset = await sr.entities.DeegoDesignAsset.create({
        asset_name: `${conceptName} — ${title}`,
        asset_type: ['tshirt', 'jumper', 'hoodie', 'cap', 'poster', 'print'].includes(exact(concept.asset_type))
          ? exact(concept.asset_type) : 'other',
        creation_mode: 'manual_design',
        linked_song_title: title,
        linked_lyric: cut(concept.linked_lyric, 500),
        story_source: story ? cut(story, 300) : 'Song story not yet recorded',
        template_size: cut(concept.template_size, 120),
        mockup_required: true,
        manual_override_notes: spec,
        approval_status: 'draft',
        commercial_readiness: 'idea',
      });
      manufacturerSpecs.push({
        id: asset.id,
        name: conceptName,
        asset_type: asset.asset_type,
        print_method: cut(concept.print_method, 80),
        template_size: cut(concept.template_size, 80),
        spec: spec,
      });
      created.merch_count += 1;
    }

    for (const slot of schedule) {
      const offset = Math.max(-21, Math.min(14, Math.round(Number(slot.day_offset) || 0)));
      await sr.entities.ContentCalendarPost.create({
        campaign,
        scheduled_date: addDays(releaseDate, offset),
        platform: calendarPlatform(slot.platform),
        content_type: calendarContentType(slot.content_type),
        hook: cut(slot.hook, 500),
        caption: cut(slot.caption, 2200),
        cta: cut(slot.cta, 200),
        visual_brief: cut(slot.visual_brief, 1000),
        status: 'draft',
        generated_by: 'generateReleaseLaunchPacket',
        description: 'Private launch-packet draft. Nothing is scheduled externally.',
        source_chain: 'launch_packet_private_draft',
      });
      created.calendar_count += 1;
    }

    await sr.entities.AdminNotification.create({
      notification_type: 'approval',
      severity: 'info',
      requires_action: true,
      title: `Launch packet drafted — ${title}`,
      summary: `One press drafted ${created.social_count} social posts, ${created.merch_count} merch concepts with manufacturer specs, `
        + `and ${created.calendar_count} calendar slots. Everything is a private draft awaiting your review. Nothing published, posted, sent or scheduled.`,
      source: 'generateReleaseLaunchPacket',
      linked_entity: 'Release',
      linked_id: release.id,
      linked_route: '/admin/launch-packet-studio',
    });

    return Response.json({
      ok: true,
      external_actions: 'held',
      published: false,
      release_id: release.id,
      title,
      campaign,
      created,
      manufacturer_specs: manufacturerSpecs,
      review: {
        content_studio: '/admin/content-studio',
        merch_designs: '/admin/merch-designs',
        campaign_calendar: '/admin/release-promo-command',
      },
      note: 'Every record is a private draft. Nothing publishes, posts, sends, schedules or delivers until you approve each piece separately.',
    });
  } catch (error) {
    return Response.json({
      error: error?.message || 'The launch packet could not be drafted. No record was published or made public.',
    }, { status: 500 });
  }
}