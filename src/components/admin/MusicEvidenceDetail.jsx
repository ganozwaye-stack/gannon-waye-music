import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { safeMusicSourceUrl } from '@/lib/useMusicEvidence';
import { musicDate } from './MusicEvidenceSources';

export default function MusicEvidenceDetail() {
  const { eventId } = useParams();
  const query = useQuery({
    queryKey: ['music-evidence-detail', eventId],
    queryFn: async () => {
      const rows = await base44.entities.MusicEvidence.filter({ id: eventId, record_type: 'event' }, '-detected_at', 1);
      if (!rows[0] || rows[0].verified !== true) throw new Error('No verified event is available at this reference.');
      return rows[0];
    },
    retry: false,
  });
  const event = query.data;
  const sourceUrl = safeMusicSourceUrl(event?.source_url);
  return <div className="space-y-5 max-w-3xl">
    <Link to="/admin/music-activity" className="text-primary underline">Back to music activity</Link>
    <h1 className="text-2xl font-semibold">Music evidence details</h1>
    {query.isPending && <p role="status">Loading evidence</p>}
    {query.isError && <p role="alert">{query.error.message} Return to music activity to inspect source coverage.</p>}
    {event && <article className="rounded-xl border border-border p-5 space-y-4">
      <h2 className="text-xl font-semibold">{event.track_title}</h2>
      <p>{event.kind === 'radio' ? 'Verified radio evidence' : event.kind === 'playlist' ? 'Verified playlist observation' : 'Verified usage report'}</p>
      <p className="text-primary">{event.source_name}</p>
      <p>{event.evidence_summary || 'This record has no additional description.'}</p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div><dt className="text-muted-foreground">Occurrence time reported by source</dt><dd>{musicDate(event.occurred_at)}</dd></div>
        <div><dt className="text-muted-foreground">First detected</dt><dd>{musicDate(event.detected_at)}</dd></div>
      </dl>
      <p className="text-xs text-muted-foreground">Dates use Melbourne time. Detection time is not an inferred broadcast or playlist addition time.</p>
      {sourceUrl ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg bg-primary text-primary-foreground p-3 font-semibold">Open original source</a> : <p role="alert">A supported original source link is missing. Do not treat this as a complete evidence record.</p>}
    </article>}
  </div>;
}
