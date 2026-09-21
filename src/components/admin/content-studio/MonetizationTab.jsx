import { useState } from 'react';
import ContentToCashPanel from '@/components/admin/content-studio/monetization/ContentToCashPanel';
import ContentPerformancePanel from '@/components/admin/content-studio/monetization/ContentPerformancePanel';
import ContentDashboardPanel from '@/components/admin/content-studio/monetization/ContentDashboardPanel';
import ContentAutomatePanel from '@/components/admin/content-studio/monetization/ContentAutomatePanel';

const VIEWS = [
  { key: 'to-cash', label: 'Content-to-Cash Engine' },
  { key: 'performance', label: 'Performance Analytics' },
  { key: 'dashboard', label: 'Content Dashboard' },
  { key: 'automate', label: 'Content Preparation' },
];

export default function MonetizationTab() {
  const [view, setView] = useState('to-cash');

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-xl font-display font-bold gradient-gold-text">Content-to-Cash &amp; Performance Analytics</h2>
        <p className="text-muted-foreground text-sm">Revenue-driven briefs, live post metrics with AI learnings, dashboard alerts, and the held automation lane.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {VIEWS.map(v => (
          <button type="button" key={v.key} onClick={() => setView(v.key)}
            className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${view === v.key ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'to-cash' && <ContentToCashPanel />}
      {view === 'performance' && <ContentPerformancePanel />}
      {view === 'dashboard' && <ContentDashboardPanel />}
      {view === 'automate' && <ContentAutomatePanel />}
    </div>
  );
}