import { Link } from 'react-router-dom';
import { Radio, ListMusic, Film, ArrowUpRight } from 'lucide-react';
import { useMusicEvidence } from '@/lib/useMusicEvidence';

const METRICS = [
  { kind: 'radio', title: 'New radio evidence', icon: Radio },
  { kind: 'playlist', title: 'New playlist evidence', icon: ListMusic },
  { kind: 'usage', title: 'New usage evidence', icon: Film },
];

export default function MusicEvidenceSummary() {
  const query = useMusicEvidence();
  const ready = query.isSuccess && query.data.sources.some(s => s.last_success_at);
  const events = query.data?.events || [];
  return (
    <section aria-labelledby="music-evidence-heading" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link to="/admin/music-activity" id="music-evidence-heading" className="text-lg font-semibold text-primary">Music activity</Link>
        <Link to="/admin/music-activity" className="text-sm underline text-muted-foreground">Sources and details</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {METRICS.map(({ kind, title, icon: Icon }) => (
          <Link key={kind} to={`/admin/music-activity?kind=${kind}&new=1`} className="rounded-xl border border-border bg-card p-4 hover:border-primary focus-visible:outline focus-visible:outline-primary">
            <div className="flex justify-between"><Icon className="w-5 h-5 text-primary" /><ArrowUpRight className="w-4 h-4" /></div>
            <p className="mt-3 text-xl font-semibold">{ready ? events.filter(e => e.kind === kind && !e.is_read && !e.is_baseline).length : 'Not connected'}</p>
            <p className="text-sm mt-1">{title}</p>
          </Link>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Verified records only, within the latest 100 loaded records. These are not lifetime plays. Collection and notification delivery are not yet enabled. Artist Pick never counts as a placement.</p>
    </section>
  );
}
