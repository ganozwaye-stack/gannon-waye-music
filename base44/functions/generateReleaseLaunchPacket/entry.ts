import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const OWNER_EMAILS = new Set(['ganozwaye@gmail.com', 'gannonwayemusic@gmail.com']);
const PLATFORMS = new Set(['tiktok', 'instagram', 'youtube']);

const schema = {
  type: 'object',
  properties: {
    press_release: { type: 'string' }, playlist_pitch: { type: 'string' }, email_subject: { type: 'string' }, email_body: { type: 'string' }, hero_eyebrow: { type: 'string' },
    social_posts: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, platform: { type: 'string' }, hook: { type: 'string' }, caption: { type: 'string' }, hashtags: { type: 'string' }, visual_direction: { type: 'string' }, cta: { type: 'string' }, manychat_keyword: { type: 'string' } }, required: ['title', 'platform', 'caption'] } },
    merch_concepts: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, product_type: { type: 'string' }, concept: { type: 'string' } }, required: ['name', 'concept'] } },
    launch_steps: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, day_offset: { type: 'number' } }, required: ['title'] } },
  },
  required: ['press_release', 'playlist_pitch', 'social_posts', 'merch_concepts', 'launch_steps'],
};

const clean = (value, max = 2000) => String(value || '').trim().slice(0, max);
const releaseDay = (date, offset) => { const d = new Date(`${date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + Number(offset || 0)); return d.toISOString().slice(0, 10); };

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' || !OWNER_EMAILS.has(clean(user.email).toLowerCase())) return Response.json({ error: 'Only Gannon can build a launch packet' }, { status: 403 });

    const { release_id: releaseId } = await req.json();
    if (!clean(releaseId)) return Response.json({ error: 'Release id is required' }, { status: 400 });
    const sr = base44.asServiceRole;
    const release = await sr.entities.Release.get(releaseId);
    if (!release || release.is_published || release.publishing_safe) return Response.json({ error: 'Only private release drafts can receive a launch packet' }, { status: 400 });

    const prompt = `You are a senior independent-music launch strategist. Use current web research to produce private review drafts for Gannon Waye's Thanking You Kindly brand, a care-led Australian singer-songwriter and gifting project. A new private release is titled "${release.title}" (${release.type}, ${release.version_label || 'Original'}), release date ${release.release_date}, genre ${release.genre || '[PLACEHOLDER]'}, mood ${release.mood || '[PLACEHOLDER]'}. Story: ${release.description || '[PLACEHOLDER]'} Lyrics excerpt: ${(release.lyrics || '[No lyrics supplied: do not invent lyrics]').slice(0, 1200)}. Create a press release, Spotify pitch, fan email, 6 social drafts across Instagram/TikTok/YouTube, 3 merch concepts, a hero eyebrow and 14 dated launch steps. Research current best practices. Never use em dashes, invent facts, quotes, numbers, streaming claims or lyrics. Use [PLACEHOLDER] for unknown facts. All content is private and awaits owner approval; never imply it has been published, sent, scheduled, or delivered.`;
    const packet = await sr.integrations.Core.InvokeLLM({ prompt, add_context_from_internet: true, response_json_schema: schema });

    const press = await sr.entities.ContentStudioRecord.create({ content_type: 'press_snippet', title: `Press release — ${release.title}`, song: release.title, release: release.title, caption: clean(packet.press_release), description: 'Private AI launch-packet draft. Owner review required.', approval_status: 'draft' });
    const pitch = await sr.entities.ContentStudioRecord.create({ content_type: 'pitch_angle', title: `Playlist pitch — ${release.title}`, song: release.title, release: release.title, caption: clean(packet.playlist_pitch), description: 'Private AI launch-packet draft. Owner review required.', approval_status: 'draft' });
    const email = await sr.entities.ReleaseEmailDraft.create({ release_id: release.id, release_title: release.title, status: 'ready', subject: clean(packet.email_subject, 200) || `A new song is on its way: ${release.title}`, body_text: clean(packet.email_body, 2000), artwork_url: release.artwork_url, approval_status: 'draft', prepared_source: 'launch_packet' });
    const social = await Promise.all((packet.social_posts || []).slice(0, 8).map((post, index) => sr.entities.ContentStudioRecord.create({ content_type: 'reel_idea', title: clean(post.title, 200), song: release.title, release: release.title, hook: clean(post.hook, 500), caption: clean(post.caption, 2200), hashtags: clean(post.hashtags, 1000), visual_direction: clean(post.visual_direction, 1000), cta: clean(post.cta, 500), manychat_keyword: clean(post.manychat_keyword, 100), platform: PLATFORMS.has(clean(post.platform).toLowerCase()) ? clean(post.platform).toLowerCase() : 'instagram', approval_status: 'draft', posted_status: 'not_posted', sort_order: index })));
    const merch = await Promise.all((packet.merch_concepts || []).slice(0, 3).map(concept => sr.entities.DeegoDesignAsset.create({ asset_name: clean(concept.name, 200), asset_type: 'other', creation_mode: 'hybrid', linked_song_title: release.title, notes: clean(concept.concept), approval_status: 'draft', commercial_readiness: 'idea' })));
    const hero = await sr.entities.HeroDesignSettings.create({ is_live: false, hero_release_id: release.id, eyebrow_label: clean(packet.hero_eyebrow, 60) || 'New Release', heart_art_url: release.artwork_url || '' });
    const steps = await Promise.all((packet.launch_steps || []).slice(0, 18).map(step => sr.entities.ReleaseActionPlan.create({ title: clean(step.title, 200), description: clean(step.description), category: 'release_launch', status: 'not_started', due_date: releaseDay(release.release_date, step.day_offset), related_release: release.id, related_song: release.title, release_name: release.title, step_type: 'story', approval_required: true })));

    return Response.json({ ok: true, press_draft_id: press.id, pitch_draft_id: pitch.id, email_draft_id: email.id, hero_draft_id: hero.id, social_draft_ids: social.map(x => x.id), merch_concept_ids: merch.map(x => x.id), launch_plan_ids: steps.map(x => x.id), pack: { press_release: true, playlist_pitch: true, subscriber_email: true, social_count: social.length, merch_count: merch.length, hero_draft: true, launch_plan_count: steps.length } });
  } catch (error) {
    return Response.json({ error: error?.message || 'Unable to build launch packet' }, { status: 500 });
  }
}