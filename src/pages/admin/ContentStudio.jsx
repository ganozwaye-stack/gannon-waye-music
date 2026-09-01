import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import ContentRecordCard from '@/components/content-studio/ContentRecordCard';
import ContentRecordModal from '@/components/content-studio/ContentRecordModal';

const PLATFORMS = ['all', 'instagram', 'tiktok', 'youtube', 'facebook', 'x_twitter'];
const STATUSES = ['all', 'draft', 'needs_review', 'approved', 'rejected'];
const SORT_OPTIONS = ['scheduled_asc', 'scheduled_desc', 'newest'];
const SORT_LABELS = {
  scheduled_asc: 'Scheduled ↑',
  scheduled_desc: 'Scheduled ↓',
  newest: 'Newest',
};

function FilterSelect({ label, value, onChange, options, labels }) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="uppercase tracking-wider">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-secondary/50 border border-border/40 rounded px-2 py-1 text-xs"
      >
        {options.map((o) => (
          <option key={o} value={o}>{labels?.[o] || o}</option>
        ))}
      </select>
    </label>
  );
}

export default function ContentStudio() {
  const qc = useQueryClient();
  const [platformF, setPlatformF] = useState('all');
  const [statusF, setStatusF] = useState('all');
  const [sortBy, setSortBy] = useState('scheduled_asc');
  const [modal, setModal] = useState(null); // null | 'new' | record
  const [busyId, setBusyId] = useState(null);

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['ContentStudioRecord'],
    queryFn: () => base44.entities.ContentStudioRecord.list('-updated_date', 300),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ContentStudioRecord.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ContentStudioRecord'] }),
  });
  const saveMutation = useMutation({
    mutationFn: ({ id, data }) =>
      id ? base44.entities.ContentStudioRecord.update(id, data) : base44.entities.ContentStudioRecord.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ContentStudioRecord'] });
      setModal(null);
    },
  });

  const sorted = useMemo(() => {
    let r = records.filter((rec) =>
      (platformF === 'all' || rec.platform === platformF) &&
      (statusF === 'all' || rec.approval_status === statusF)
    );
    if (sortBy === 'scheduled_asc') {
      r = [...r].sort((a, b) => (a.scheduled_date || '9999').localeCompare(b.scheduled_date || '9999'));
    } else if (sortBy === 'scheduled_desc') {
      r = [...r].sort((a, b) => (b.scheduled_date || '').localeCompare(a.scheduled_date || ''));
    } else {
      r = [...r].sort((a, b) => (b.updated_date || '').localeCompare(a.updated_date || ''));
    }
    return r;
  }, [records, platformF, statusF, sortBy]);

  const handleUpdate = (rec) => (partial) => updateMutation.mutate({ id: rec.id, data: partial });

  const handleGenerateVideo = async (rec) => {
    setBusyId(rec.id);
    try {
      const res = await base44.functions.invoke('generateHeyGenVideo', {
        title: rec.title || rec.song || 'Content Video',
        script: rec.caption || rec.hook || rec.on_screen_text || '',
        avatar_id: '',
        voice_id: '',
        engine: 'avatar_v',
        aspect_ratio: '9:16',
        related_release: rec.release || '',
        agent_generated_by: 'content_studio',
      });
      if (res.data?.status !== 'success') alert(res.data?.error || 'Video generation failed.');
    } catch (e) {
      alert(e.message);
    }
    setBusyId(null);
  };

  const handlePublish = async (rec) => {
    setBusyId(rec.id);
    try {
      const res = await base44.functions.invoke('postToInstagram', {
        media_url: rec.media_url,
        caption: rec.caption,
        title: rec.title,
      });
      const d = res.data || {};
      if (d.skipped) alert(`Publish held: ${d.reason}`);
      else if (d.success === false) alert(d.error || 'Publish failed.');
      else alert('Publish request sent.');
    } catch (e) {
      alert(e.message);
    }
    setBusyId(null);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Admin · Private</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Content Studio</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Single-screen content pipeline — draft to publish. {records.length} records.
          </p>
        </div>
        <Button onClick={() => setModal('new')} className="gap-2">
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-card/50 p-3">
        <FilterSelect label="Platform" value={platformF} onChange={setPlatformF} options={PLATFORMS} />
        <FilterSelect label="Status" value={statusF} onChange={setStatusF} options={STATUSES} />
        <FilterSelect label="Sort" value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} labels={SORT_LABELS} />
        <span className="font-body text-xs text-muted-foreground ml-auto">{sorted.length} shown</span>
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      ) : sorted.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground text-center py-12">
          No posts match these filters. Click "New Post" to create one.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((rec) => (
            <ContentRecordCard
              key={rec.id}
              record={rec}
              busy={busyId === rec.id}
              onEdit={() => setModal(rec)}
              onUpdate={handleUpdate(rec)}
              onGenerateVideo={() => handleGenerateVideo(rec)}
              onPublish={() => handlePublish(rec)}
            />
          ))}
        </div>
      )}

      {modal && (
        <ContentRecordModal
          initial={modal === 'new' ? null : modal}
          saving={saveMutation.isPending}
          onSave={(data) => saveMutation.mutate({ id: modal === 'new' ? null : modal.id, data })}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}