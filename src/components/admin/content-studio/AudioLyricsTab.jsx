import { useState } from 'react';
import MasteringPanel from '@/components/admin/content-studio/audio/MasteringPanel';
import LyricsArchivePanel from '@/components/admin/content-studio/audio/LyricsArchivePanel';

const VIEWS = [
  { key: 'mastering', label: 'Mastering Queue' },
  { key: 'lyrics', label: 'Private Lyrics Archive' },
];

export default function AudioLyricsTab() {
  const [view, setView] = useState('mastering');

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-xl font-display font-bold gradient-gold-text">Audio, Mastering &amp; Lyrics</h2>
        <p className="text-muted-foreground text-sm">Engineer mastering review and the private lyrics archive. Published lyrics also appear on the public /lyrics page.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {VIEWS.map(v => (
          <button type="button" key={v.key} onClick={() => setView(v.key)}
            className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${view === v.key ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'mastering' && <MasteringPanel />}
      {view === 'lyrics' && <LyricsArchivePanel />}
    </div>
  );
}