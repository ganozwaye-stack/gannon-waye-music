import { useState } from 'react';
import ImageEditorPanel from '@/components/admin/content-studio/image/ImageEditorPanel';
import CampaignApprovalPanel from '@/components/admin/content-studio/image/CampaignApprovalPanel';

const VIEWS = [
  { key: 'editor', label: 'Image Editor' },
  { key: 'campaign', label: 'Campaign Approvals' },
];

export default function ImageStudioTab() {
  const [view, setView] = useState('editor');

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-xl font-display font-bold gradient-gold-text">Image Studio &amp; Campaign Approvals</h2>
        <p className="text-muted-foreground text-sm">Canvas editor with filters and layers, plus the release-campaign image review gallery.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {VIEWS.map(v => (
          <button type="button" key={v.key} onClick={() => setView(v.key)}
            className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${view === v.key ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'editor' && <ImageEditorPanel />}
      {view === 'campaign' && <CampaignApprovalPanel />}
    </div>
  );
}