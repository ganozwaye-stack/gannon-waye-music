import { MUSIC_MONITOR_SOURCES } from '@/lib/musicMonitorSources';
import { safeMusicSourceUrl } from '@/lib/useMusicEvidence';

export function musicDate(value) {
  const date = new Date(value);
  return value && Number.isFinite(date.getTime()) ? date.toLocaleString('en-AU', { timeZone: 'Australia/Melbourne', dateStyle: 'medium', timeStyle: 'short' }) : 'Not available';
}

export default function MusicEvidenceSources({ sources = [] }) {
  return (
    <section className="space-y-3" aria-labelledby="music-sources-heading">
      <h2 id="music-sources-heading" className="text-lg font-semibold">Sources and coverage</h2>
      <p className="text-sm text-muted-foreground">Open a source to check the original. Private artist analytics require your own sign in. No account credentials are stored here.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {MUSIC_MONITOR_SOURCES.map(source => {
          const status = sources.find(s => s.source_key === source.id);
          const last = status?.last_success_at;
          const stale = last && Date.now() - Date.parse(last) > 2 * 60 * 60 * 1000;
          return <a key={source.id} href={safeMusicSourceUrl(source.url)} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-border p-4 hover:border-primary">
            <h3 className="font-semibold text-primary">{source.name}</h3>
            <p className="text-sm mt-1">{stale ? 'Stale data' : status?.status || (source.kind === 'private' ? 'Not connected' : 'Collector not enabled')}</p>
            <p className="text-xs text-muted-foreground mt-1">Last successful collection: {musicDate(last)}</p>
            {status?.checked_at && <p className="text-xs text-muted-foreground">Last attempt: {musicDate(status.checked_at)}</p>}
            <p className="text-xs mt-2">{status?.coverage_note || (source.kind === 'private' ? 'Streams, listeners, radio spins and social uses are distinct measurements. No private reports have been imported.' : 'No continuous coverage has been established. Missing evidence does not mean no plays.')}</p>
          </a>;
        })}
      </div>
    </section>
  );
}
