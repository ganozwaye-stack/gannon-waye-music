import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// resolveFanKeyword: PUBLIC, read-only fan keyword resolver. No auth, no
// logging, no entity writes. Normalizes the incoming word (uppercase, trim,
// strip punctuation/spaces) and matches it against ManyChatKeywordDraft,
// preferring active over approved over draft, never archived.
// Reads via service role because the entity is admin-read-only by RLS and
// this endpoint is intentionally public and read-only.

const DEFAULT_MESSAGE =
  "Hey, thanks for reaching out! I didn't catch a keyword there, but you're very welcome here. " +
  'You can hear Gannon\u2019s music at https://gannonwaye.com/music, or back the project and ' +
  'grab early merch at https://gannonwaye.com/back-this. Drop a word like LISTEN, MERCH, LYRICS, ' +
  'PRESS or BREATH anytime and I\u2019ll find it for you.';

const DEFAULT_LINKS = {
  music: 'https://gannonwaye.com/music',
  subscribe: 'https://gannonwaye.com/back-this',
};

function normalizeKeyword(raw) {
  return String(raw || '')
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9]/g, '');
}

const STATUS_RANK = { active: 0, approved: 1, draft: 2 };

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const normalized = normalizeKeyword(body?.keyword);
    const network = body?.network ? String(body.network).slice(0, 60) : null;

    if (!normalized) {
      return Response.json({
        found: false,
        keyword: '',
        song: null,
        network,
        response_message: DEFAULT_MESSAGE,
        links: DEFAULT_LINKS,
      });
    }

    const records = await base44.asServiceRole.entities.ManyChatKeywordDraft.list('-updated_date', 500);

    const matches = records
      .filter((r) => r.status !== 'archived' && STATUS_RANK[r.status] !== undefined)
      .filter((r) => normalizeKeyword(r.keyword) === normalized)
      .sort((a, b) => {
        const rankDiff = STATUS_RANK[a.status] - STATUS_RANK[b.status];
        if (rankDiff !== 0) return rankDiff;
        return (a.sort_order || 0) - (b.sort_order || 0);
      });

    if (matches.length === 0) {
      return Response.json({
        found: false,
        keyword: normalized,
        song: null,
        network,
        response_message: DEFAULT_MESSAGE,
        links: DEFAULT_LINKS,
      });
    }

    const m = matches[0];
    return Response.json({
      found: true,
      keyword: m.keyword,
      song: m.song || null,
      network,
      response_message: m.response_message || '',
      links: {
        music: m.music_link || null,
        subscribe: m.subscribe_link || null,
        lyrics: m.lyrics_link || null,
        store: m.store_link || null,
        press: m.press_link || null,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}