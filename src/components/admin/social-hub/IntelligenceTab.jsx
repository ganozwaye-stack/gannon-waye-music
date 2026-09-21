import { useState } from 'react';
import CommentMonitorPanel from '@/components/admin/social-hub/intelligence/CommentMonitorPanel';
import IntelligencePanel from '@/components/admin/social-hub/intelligence/IntelligencePanel';

const VIEWS = [
  { key: 'triage', label: 'Comment Triage Monitor' },
  { key: 'intelligence', label: 'Social Intelligence' },
];

export default function IntelligenceTab() {
  const [view, setView] = useState('triage');

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-xl font-display font-bold gradient-gold-text">Social Intelligence &amp; Triage Monitor</h2>
        <p className="text-muted-foreground text-sm">Triage incoming comments, then run growth and viral analysis — all human-approval gated.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {VIEWS.map(v => (
          <button type="button" key={v.key} onClick={() => setView(v.key)}
            className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${view === v.key ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'triage' && <CommentMonitorPanel />}
      {view === 'intelligence' && <IntelligencePanel />}
    </div>
  );
}