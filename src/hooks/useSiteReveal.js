import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Returns the current reveal state from the SiteReveal entity.
 * Falls back to date-based logic if no record exists yet.
 */
export function useSiteReveal() {
  const { data } = useQuery({
    queryKey: ['siteReveal'],
    queryFn: () => base44.entities.SiteReveal.list(),
    initialData: [],
    staleTime: 30_000, // re-fetch every 30s
  });

  const record = data[0];

  // Fallback: if no DB record yet, use hardcoded dates
  const ARTWORK_REVEAL_DATE = '2026-05-10T04:00:00Z'; // 2pm AEST May 10
  const RELEASE_DATE = '2026-06-10T02:00:00Z'; // midday AEST June 10

  const artworkRevealed = record?.artwork_revealed ?? (new Date() >= new Date(ARTWORK_REVEAL_DATE));
  const merchRevealed = record?.merch_revealed ?? (new Date() >= new Date(ARTWORK_REVEAL_DATE));
  const releaseDateIso = record?.release_date_iso ?? RELEASE_DATE;
  const releaseDateText = record?.release_date_text ?? 'June 10, 2026';
  const released = new Date() >= new Date(releaseDateIso);

  return { artworkRevealed, merchRevealed, releaseDateIso, releaseDateText, released };
}