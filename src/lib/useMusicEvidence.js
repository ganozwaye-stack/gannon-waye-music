import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function deduplicateMusicEvents(rows = []) {
  const unique = new Map();
  for (const row of rows) {
    if (row.record_type !== 'event' || row.verified !== true || !row.event_key) continue;
    if (!['radio', 'playlist', 'usage'].includes(row.kind)) continue;
    if (!unique.has(row.event_key)) unique.set(row.event_key, row);
  }
  return [...unique.values()];
}

export function safeMusicSourceUrl(value) {
  try {
    const url = new URL(value);
    const hosts = ['www.abc.net.au', 'abc.net.au', 'open.spotify.com', 'music.apple.com', 'artists.spotify.com', 'artists.apple.com', 'studio.youtube.com', 'www.youtube.com', 'youtube.com', 'toolost.com', 'www.toolost.com', 'x.com', 'twitter.com'];
    return url.protocol === 'https:' && hosts.includes(url.hostname) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function useMusicEvidence(offset = 0) {
  return useQuery({
    queryKey: ['music-evidence', offset],
    queryFn: async () => {
      if (!base44.entities.MusicEvidence) throw new Error('Music evidence storage is not deployed.');
      const [events, sources] = await Promise.all([
        base44.entities.MusicEvidence.filter({ record_type: 'event' }, '-detected_at', 101, offset),
        base44.entities.MusicEvidence.filter({ record_type: 'source' }, '-checked_at', 30),
      ]);
      return { events: deduplicateMusicEvents(events.slice(0, 100)), sources, hasMore: events.length > 100 };
    },
    refetchInterval: 60000,
    retry: false,
    staleTime: 30000,
  });
}
