import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Pencil, Check, Sparkles, Instagram, Upload, Calendar, Loader2 } from 'lucide-react';

const PLATFORM_LABELS = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
  x_twitter: 'X',
  all: 'All',
};

const APPROVAL_STYLES = {
  draft: 'bg-secondary text-muted-foreground',
  needs_review: 'bg-amber-500/20 text-amber-400',
  approved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
};

export default function ContentRecordCard({ record, onEdit, onUpdate, onGenerateVideo, onPublish, busy }) {
  const fileRef = useRef(null);
  const title = record.title || record.song || 'Untitled post';
  const platform = PLATFORM_LABELS[record.platform] || record.platform || '—';

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onUpdate({ media_url: file_url });
    } catch (err) {
      alert(err.message || 'Upload failed');
    }
    e.target.value = '';
  };

  return (
    <div className="rounded-2xl border border-border/40 bg-card overflow-hidden flex flex-col">
      {/* Media preview area */}
      <div className="relative aspect-video bg-secondary/40 flex items-center justify-center">
        {record.media_url ? (
          <video
            src={record.media_url}
            className="w-full h-full object-cover"
            controls
            muted
            preload="metadata"
          />
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-2 text-muted-foreground/60 hover:text-primary p-4"
          >
            <Upload className="w-6 h-6" />
            <span className="font-body text-[11px] uppercase tracking-wider">Attach video</span>
          </button>
        )}
        <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFile} />
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Header: title + badges */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg text-foreground leading-tight">{title}</h3>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge className="text-[9px] border-0 bg-primary/15 text-primary">{platform}</Badge>
            <Badge className={`text-[9px] border-0 ${APPROVAL_STYLES[record.approval_status] || ''}`}>
              {record.approval_status}
            </Badge>
          </div>
        </div>

        {/* Platform status indicators */}
        <div className="flex flex-wrap gap-1.5">
          {record.metricool_status && record.metricool_status !== 'not_sent' && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400">
              Metricool: {record.metricool_status}
            </span>
          )}
          {record.posted_status === 'posted' && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/15 text-green-400">Posted</span>
          )}
        </div>

        {record.hook && (
          <p className="font-body text-sm text-foreground/85 font-medium">{record.hook}</p>
        )}

        {record.caption && (
          <div className="max-h-32 overflow-y-auto rounded-lg bg-secondary/30 p-2.5">
            <p className="font-body text-xs text-foreground/75 whitespace-pre-wrap leading-relaxed">
              {record.caption}
            </p>
          </div>
        )}

        {record.hashtags && (
          <p className="font-body text-xs text-blue-400/80">{record.hashtags}</p>
        )}
        {record.visual_direction && (
          <p className="font-body text-[11px] text-muted-foreground">
            <span className="text-muted-foreground/60">Visual:</span> {record.visual_direction}
          </p>
        )}
        {record.capcut_template && (
          <p className="font-body text-[11px] text-muted-foreground">
            <span className="text-muted-foreground/60">CapCut:</span> {record.capcut_template}
          </p>
        )}

        {/* Schedule picker */}
        <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <input
            type="datetime-local"
            value={record.scheduled_date ? record.scheduled_date.slice(0, 16) : ''}
            onChange={(e) =>
              onUpdate({ scheduled_date: e.target.value ? new Date(e.target.value).toISOString() : null })
            }
            className="bg-secondary/50 border border-border/40 rounded px-2 py-1 text-xs"
          />
        </label>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-1.5 mt-auto pt-2">
          <Button size="sm" variant="outline" type="button" onClick={() => fileRef.current?.click()} className="gap-1 text-xs">
            <Upload className="w-3 h-3" /> Attach
          </Button>
          <Button size="sm" variant="outline" type="button" disabled={busy} onClick={onGenerateVideo} className="gap-1 text-xs">
            {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Generate
          </Button>
          <Button size="sm" variant="outline" type="button" onClick={onEdit} className="gap-1 text-xs">
            <Pencil className="w-3 h-3" /> Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            type="button"
            disabled={record.approval_status === 'approved'}
            onClick={() => onUpdate({ approval_status: 'approved' })}
            className="gap-1 text-xs"
          >
            <Check className="w-3 h-3" /> Approve
          </Button>
          <Button size="sm" variant="outline" type="button" disabled={busy} onClick={onPublish} className="gap-1 text-xs">
            {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Instagram className="w-3 h-3" />} Publish
          </Button>
        </div>
      </div>
    </div>
  );
}