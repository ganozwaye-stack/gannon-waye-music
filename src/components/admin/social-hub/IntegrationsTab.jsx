import { useState } from 'react';
import StoryStudioPanel from '@/components/admin/social-hub/integrations/StoryStudioPanel';
import AutoDMPanel from '@/components/admin/social-hub/integrations/AutoDMPanel';
import InstagramSyncPanel from '@/components/admin/social-hub/integrations/InstagramSyncPanel';
import TikTokReviewPanel from '@/components/admin/social-hub/integrations/TikTokReviewPanel';

const VIEWS = [
  { key: 'ig_sync', label: 'Instagram Sync' },
  { key: 'ig_story', label: 'Story Studio' },
  { key: 'ig_dm', label: 'Auto-DM Command' },
  { key: 'tiktok', label: 'TikTok Platform Review' },
];

export default function IntegrationsTab() {
  const [view, setView] = useState('ig_sync');

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-xl font-display font-bold gradient-gold-text">IG &amp; TikTok Integrations</h2>
        <p className="text-muted-foreground text-sm">Posting, story assets, the approval-gated DM funnel, and TikTok OAuth diagnostics.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {VIEWS.map(v => (
          <button type="button" key={v.key} onClick={() => setView(v.key)}
            className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${view === v.key ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'ig_sync' && <InstagramSyncPanel />}
      {view === 'ig_story' && <StoryStudioPanel />}
      {view === 'ig_dm' && <AutoDMPanel />}
      {view === 'tiktok' && <TikTokReviewPanel />}
    </div>
  );
}