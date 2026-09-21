import { useState } from 'react';
import WarRoomPanel from '@/components/admin/content-studio/sprint/WarRoomPanel';
import QuickUploadPanel from '@/components/admin/content-studio/sprint/QuickUploadPanel';
import DriveBrowserPanel from '@/components/admin/content-studio/sprint/DriveBrowserPanel';

const VIEWS = [
  { key: 'war-room', label: 'Sprint War Room' },
  { key: 'stage', label: 'Upload Staging' },
  { key: 'drive', label: 'Google Drive' },
];

export default function SprintStagingTab() {
  const [view, setView] = useState('war-room');

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-xl font-display font-bold gradient-gold-text">Sprint Command &amp; Staging</h2>
        <p className="text-muted-foreground text-sm">Release countdown, pending approvals, drag-and-drop audio/artwork staging, and the connected Drive.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {VIEWS.map(v => (
          <button type="button" key={v.key} onClick={() => setView(v.key)}
            className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${view === v.key ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'war-room' && <WarRoomPanel />}
      {view === 'stage' && <QuickUploadPanel />}
      {view === 'drive' && <DriveBrowserPanel />}
    </div>
  );
}