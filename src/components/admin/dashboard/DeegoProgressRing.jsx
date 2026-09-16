import { Activity } from 'lucide-react';

// Visual load gauge derived from live attention counts — no fabricated metrics.
// compact=true is the small header gauge on Deego's Desk.
export default function DeegoProgressRing({ recs = 0, approvals = 0, blocked = 0, compact = false }) {
  const total = recs + approvals + blocked;
  const cap = 25;
  const loadPct = Math.min(Math.round((total / cap) * 100), 100);

  const R = 42;
  const C = 2 * Math.PI * R;
  const dash = (loadPct / 100) * C;

  const bars = [
    { label: 'Recommendations', value: recs, color: 'bg-primary' },
    { label: 'Approvals', value: approvals, color: 'bg-primary' },
    { label: 'Blocked', value: blocked, color: 'bg-red-400' },
  ];
  const maxBar = Math.max(1, ...bars.map((b) => b.value));

  return (
    <div className={`bg-card border border-border/40 rounded-2xl ${compact ? 'p-3 w-full sm:w-64' : 'p-5'}`}>
      <div className={`flex items-center gap-2 ${compact ? 'mb-2' : 'mb-4'}`}>
        <Activity className="w-4 h-4 text-primary" />
        <h3 className={`font-display text-foreground ${compact ? 'text-[11px] uppercase tracking-widest' : 'text-base'}`}>Attention Load</h3>
      </div>

      <div className={`flex items-center ${compact ? 'gap-3' : 'gap-5'}`}>
        {/* Ring */}
        <div className={`relative shrink-0 ${compact ? 'w-16 h-16' : 'w-24 h-24'}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={R} fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={R} fill="none"
              stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${dash} ${C}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-display text-foreground leading-none ${compact ? 'text-lg' : 'text-2xl'}`}>{total}</span>
            <span className="font-body text-[9px] uppercase tracking-widest text-muted-foreground mt-1">open</span>
          </div>
        </div>

        {/* Bars */}
        <div className={`flex-1 ${compact ? 'space-y-1.5' : 'space-y-3'}`}>
          {bars.map((b) => (
            <div key={b.label}>
              <div className={`flex items-center justify-between ${compact ? 'mb-0.5' : 'mb-1'}`}>
                <span className={`font-body uppercase tracking-wider text-muted-foreground ${compact ? 'text-[8px]' : 'text-[10px]'}`}>{b.label}</span>
                <span className="font-body text-[11px] text-foreground/80">{b.value}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary/40 overflow-hidden">
                <div className={`h-full ${b.color} rounded-full transition-all`} style={{ width: `${(b.value / maxBar) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}