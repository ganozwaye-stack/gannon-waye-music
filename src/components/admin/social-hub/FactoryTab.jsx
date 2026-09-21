import { useState } from 'react';
import PostFactoryPanel from '@/components/admin/social-hub/factory/PostFactoryPanel';
import ContentBriefPanel from '@/components/admin/social-hub/factory/ContentBriefPanel';
import ReelFactoryPanel from '@/components/admin/social-hub/factory/ReelFactoryPanel';

const VIEWS = [
  { key: 'posts', label: 'Post Factory (sprint days)' },
  { key: 'briefs', label: 'Content Brief Generator' },
  { key: 'reels', label: 'Reel Factory (Opus Clip)' },
];

export default function FactoryTab() {
  const [view, setView] = useState('posts');

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-xl font-display font-bold gradient-gold-text">Post &amp; Reel Factory</h2>
        <p className="text-muted-foreground text-sm">Generate briefs and reels — everything lands in the approval queue before it can be scheduled.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {VIEWS.map(v => (
          <button type="button" key={v.key} onClick={() => setView(v.key)}
            className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${view === v.key ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'posts' && <PostFactoryPanel />}
      {view === 'briefs' && <ContentBriefPanel />}
      {view === 'reels' && <ReelFactoryPanel />}
    </div>
  );
}