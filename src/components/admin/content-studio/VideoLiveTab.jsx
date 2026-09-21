import { useState } from 'react';
import VideoPanel from '@/components/admin/content-studio/video/VideoPanel';
import LivestreamPanel from '@/components/admin/content-studio/video/LivestreamPanel';
import VideoAgentPanel from '@/components/admin/content-studio/video/VideoAgentPanel';

const VIEWS = [
  { key: 'videos', label: 'Social Videos' },
  { key: 'livestream', label: 'Livestream Command' },
  { key: 'agent', label: 'Video Agent (CapCut)' },
];

export default function VideoLiveTab() {
  const [view, setView] = useState('videos');

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-xl font-display font-bold gradient-gold-text">Video &amp; Livestream Hub</h2>
        <p className="text-muted-foreground text-sm">Site video embeds, /live page controls with the HTTPS embed safety rule, and Phase 1 hook detection with CapCut prompts.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {VIEWS.map(v => (
          <button type="button" key={v.key} onClick={() => setView(v.key)}
            className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${view === v.key ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'videos' && <VideoPanel />}
      {view === 'livestream' && <LivestreamPanel />}
      {view === 'agent' && <VideoAgentPanel />}
    </div>
  );
}