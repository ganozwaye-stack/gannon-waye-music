import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Legacy merch reveal state only. This hook must never authorise or describe a
 * public music Release; the Release entity's approval contract is authoritative.
 */
export function useSiteReveal() {
  const { data = [] } = useQuery({
    queryKey: ['site-reveal-merch-only'],
    queryFn: () => base44.entities.SiteReveal.list(),
    initialData: [],
    staleTime: 30_000,
  });

  const record = data[0];

  return {
    artworkRevealed: false,
    merchRevealed: record?.merch_revealed ?? true,
    releaseDateIso: null,
    releaseDateText: '',
    released: false,
  };
}
