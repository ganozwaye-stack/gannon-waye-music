import { useState } from 'react';
import AssetLibraryPanel from '@/components/admin/social-hub/assets/AssetLibraryPanel';
import MediaPipelinePanel from '@/components/admin/social-hub/assets/MediaPipelinePanel';

const VIEWS = [
  { key: 'library', label: 'Asset Library' },
  { key: 'pipeline', label: 'Metricool Media Pipeline' },
];

export default function AssetsPipelineTab() {
  const [view, setView] = useState('library');

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-xl font-display font-bold gradient-gold-text">Asset Library &amp; Media Pipeline</h2>
        <p className="text-muted-foreground text-sm">Register and approve assets, then normalize approved public URLs into Metricool media IDs.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {VIEWS.map(v => (
          <button type="button" key={v.key} onClick={() => setView(v.key)}
            className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${view === v.key ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'library' && <AssetLibraryPanel />}
      {view === 'pipeline' && <MediaPipelinePanel />}
    </div>
  );
}