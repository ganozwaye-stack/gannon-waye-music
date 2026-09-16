import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { usePlayerStore } from '@/lib/playerStore';
import { PUBLIC_RELEASE_FILTER, isPublicRelease } from '@/lib/publicRelease';

// Set Free goes live 25 September 2026, Melbourne time. Until then the ambient
// player carries Without You Here; from that moment it carries Set Free as soon
// as the exact release is public on the site. Only approved, published releases
// are ever played, and it starts once per visit, never nagging after a stop.
const SET_FREE_MOMENT = new Date('2026-09-25T00:00:00+10:00').getTime();
const SESSION_KEY = 'gw-ambient-player-started';

const SKIP_PREFIXES = ['/store', '/embed-timer', '/checkout', '/tiktok', '/toolost'];
const SKIP_PATHS = ['/mum', '/mums-garden', '/sonias-garden', '/remember-mum', '/without-you-here', '/memorial'];

export default function AmbientReleasePlayer() {
  const location = useLocation();
  const playTrack = usePlayerStore((s) => s.playTrack);
  const active = usePlayerStore((s) => s.active);

  const { data: candidates = [] } = useQuery({
    queryKey: ['ambient-public-releases'],
    queryFn: () => base44.entities.Release.filter(PUBLIC_RELEASE_FILTER, '-release_date', 25),
    staleTime: 60_000,
    initialData: [],
  });

  useEffect(() => {
    if (active) return undefined;
    const path = location.pathname;
    if (SKIP_PREFIXES.some((prefix) => path.startsWith(prefix)) || SKIP_PATHS.includes(path)) return undefined;

    let started = false;
    try { started = sessionStorage.getItem(SESSION_KEY) === '1'; } catch {}
    if (started) return undefined;

    const releases = candidates.filter(isPublicRelease);
    const setFree = releases.find((r) => (r.title || '').toLowerCase() === 'set free');
    const withoutYouHere = releases.find((r) => (r.title || '').toLowerCase() === 'without you here');
    const release = (Date.now() >= SET_FREE_MOMENT && setFree)
      ? setFree
      : (withoutYouHere || setFree);
    if (!release?.spotify_link) return undefined;

    const timer = setTimeout(() => {
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
      playTrack(release.spotify_link, {
        title: release.title,
        artwork: release.artwork_url || '',
        lyrics: release.lyrics || '',
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [candidates, active, location.pathname, playTrack]);

  return null;
}