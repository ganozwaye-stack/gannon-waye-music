import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MusicEvidenceSummary from '@/components/admin/MusicEvidenceSummary';
import MusicEvidenceSources, { musicDate } from '@/components/admin/MusicEvidenceSources';
import { useMusicEvidence } from '@/lib/useMusicEvidence';
import { MUSIC_MONITOR_TRACKS } from '@/lib/musicMonitorSources';

export default function MusicActivity() {
  const [params, setParams] = useSearchParams();
  const [offset, setOffset] = useState(0);
  const query = useMusicEvidence(offset);
  const kind = params.get('kind') || 'all';
  const song = params.get('song') || 'all';
  const newOnly = params.get('new') === '1';
  const events = (query.data?.events || []).filter(e => (kind === 'all' || e.kind === kind) && (song === 'all' || e.track_title === song) && (!newOnly || (!e.is_read && !e.is_baseline)));
  function filter(key, value) { const next = new URLSearchParams(params); next.set(key, value); setParams(next); setOffset(0); }
  return <div className="pb-12 space-y-7 font-body">
    <div className="flex flex-wrap justify-between items-start gap-3">
      <div><h1 className="text-2xl font-semibold">Music activity</h1><p className="text-sm text-muted-foreground mt-1">Set Free, Thankyou and Without You Here</p></div>
      <Button variant="outline" disabled={query.isFetching} onClick={() => query.refetch()}>Refresh stored evidence</Button>
    </div>
    <div role="status" className="rounded-xl border border-primary/40 bg-primary/5 p-4 text-sm">
      Collector and automatic alerts are not enabled. This view refreshes stored evidence once a minute while open; it does not itself collect broadcasts or private streaming data. Production deployment and a tested collector are still required.
    </div>
    <MusicEvidenceSummary />
    <section className="rounded-xl border border-border p-4 space-y-2">
      <h2 className="font-semibold">Verified manual check: 26 September 2026, 10:28 am Melbourne</h2>
      <p className="text-sm">All three tracks are live on the official Unearthed profile. Set Free is Artist Pick. Each track has an empty playedOn list. No station play count can be derived from this.</p>
      <p className="text-sm">No Gannon Waye matches in the 100 tracks returned by either linked new music playlist. Apple returned 100 of 100. Spotify returned 100, but its embed did not expose a verified total. These are current snapshots, not placement history.</p>
      <p className="text-sm">No artist match in the latest ten timestamped plays checked for each of Unearthed, triple j and Double J. This is not a complete airplay history.</p>
      <a className="inline-block text-primary underline text-sm" href="https://www.abc.net.au/triplejunearthed/artist/gannon-waye" target="_blank" rel="noopener noreferrer">Open official profile</a>
    </section>
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Recorded evidence</h2>
      <div className="flex flex-wrap gap-3 text-sm">
        <label>Type <select aria-label="Evidence type" value={kind} onChange={e => filter('kind', e.target.value)} className="bg-card border border-border rounded p-2"><option value="all">All</option><option value="radio">Radio</option><option value="playlist">Playlists</option><option value="usage">Usage</option></select></label>
        <label>Song <select aria-label="Song" value={song} onChange={e => filter('song', e.target.value)} className="bg-card border border-border rounded p-2"><option value="all">All three songs</option>{MUSIC_MONITOR_TRACKS.map(t => <option key={t}>{t}</option>)}</select></label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={newOnly} onChange={e => filter('new', e.target.checked ? '1' : '0')} />New evidence only</label>
      </div>
      {query.isPending && <p role="status">Loading stored evidence</p>}
      {query.isError && <p role="alert" className="text-sm">Evidence storage is unavailable. No live count is being shown. {query.error?.message}</p>}
      {query.isSuccess && !events.length && <p className="text-sm text-muted-foreground">No verified records in this loaded page match your filters. This does not mean your music has not been played.</p>}
      <div className="space-y-2">{events.map(e => <Link key={e.event_key} to={`/admin/music-activity/event/${encodeURIComponent(e.id)}`} className="block rounded-xl border border-border p-4 hover:border-primary">
        <p className="font-semibold">{e.track_title}: {e.kind === 'radio' ? 'radio play' : e.kind === 'playlist' ? 'playlist observation' : 'usage report'}</p>
        <p className="text-sm">{e.source_name}</p><p className="text-xs text-muted-foreground">Detected {musicDate(e.detected_at)}. Open evidence and original source.</p>
      </Link>)}</div>
      <div className="flex flex-wrap items-center gap-3"><Button variant="outline" disabled={!offset} onClick={() => setOffset(Math.max(0, offset - 100))}>Newer records</Button><Button variant="outline" disabled={!query.data?.hasMore} onClick={() => setOffset(offset + 100)}>Older records</Button><span className="text-xs text-muted-foreground">Filters apply to this page of up to 100 records.</span></div>
    </section>
    <MusicEvidenceSources sources={query.data?.sources || []} />
  </div>;
}
