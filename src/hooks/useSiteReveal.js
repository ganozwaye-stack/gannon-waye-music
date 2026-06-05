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

  // Fallback: if no DB record yet, default to revealed (May 10 has passed)
  const RELEASE_DATE = '2026-06-05T00:00:00Z'; // 5 June 2026

  const artworkRevealed = record?.artwork_revealed ?? true;
  const merchRevealed = record?.merch_revealed ?? true;
  const releaseDateIso = record?.release_date_iso ?? RELEASE_DATE;
  const releaseDateText = record?.release_date_text ?? '5 June 2026';
  const released = true;
  
  return { artworkRevealed, merchRevealed, releaseDateIso, releaseDateText, released };
}