import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

const EMPTY = {
  title: '',
  content_type: 'reel_idea',
  platform: 'instagram',
  hook: '',
  caption: '',
  hashtags: '',
  visual_direction: '',
  capcut_template: '',
  media_url: '',
  scheduled_date: '',
  approval_status: 'draft',
  song: '',
  release: '',
  cta: '',
  destination_link: '',
  on_screen_text: '',
  first_comment: '',
  manychat_keyword: '',
};

function FieldLabel({ children }) {
  return (
    <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{children}</p>
  );
}

export default function ContentRecordModal({ initial, onSave, onClose, saving }) {
  const [form, setForm] = useState({ ...EMPTY, ...(initial || {}) });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto">
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(form); }}
        className="w-full max-w-2xl my-8 rounded-2xl border border-border/40 bg-card p-6 space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-foreground">{initial?.id ? 'Edit' : 'New'} Post</h3>
          <button type="button" onClick={onClose}>
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Title</FieldLabel>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} className="bg-secondary/50" />
          </div>
          <div>
            <FieldLabel>Platform</FieldLabel>
            <select
              value={form.platform}
              onChange={(e) => set('platform', e.target.value)}
              className="w-full bg-secondary/50 border border-border/40 rounded px-3 py-2 text-sm"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="facebook">Facebook</option>
              <option value="x_twitter">X</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        <div>
          <FieldLabel>Hook</FieldLabel>
          <Input value={form.hook} onChange={(e) => set('hook', e.target.value)} className="bg-secondary/50" />
        </div>
        <div>
          <FieldLabel>Caption</FieldLabel>
          <Textarea value={form.caption} onChange={(e) => set('caption', e.target.value)} rows={4} className="bg-secondary/50" />
        </div>
        <div>
          <FieldLabel>Hashtags</FieldLabel>
          <Input
            value={form.hashtags}
            onChange={(e) => set('hashtags', e.target.value)}
            placeholder="#thankyoukindly #gannonwaye"
            className="bg-secondary/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Visual direction</FieldLabel>
            <Input value={form.visual_direction} onChange={(e) => set('visual_direction', e.target.value)} className="bg-secondary/50" />
          </div>
          <div>
            <FieldLabel>CapCut template</FieldLabel>
            <Input value={form.capcut_template} onChange={(e) => set('capcut_template', e.target.value)} className="bg-secondary/50" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Media URL</FieldLabel>
            <Input
              value={form.media_url}
              onChange={(e) => set('media_url', e.target.value)}
              placeholder="https://…"
              className="bg-secondary/50"
            />
          </div>
          <div>
            <FieldLabel>Schedule (date/time)</FieldLabel>
            <input
              type="datetime-local"
              value={form.scheduled_date ? form.scheduled_date.slice(0, 16) : ''}
              onChange={(e) => set('scheduled_date', e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="w-full bg-secondary/50 border border-border/40 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Content type</FieldLabel>
            <select
              value={form.content_type}
              onChange={(e) => set('content_type', e.target.value)}
              className="w-full bg-secondary/50 border border-border/40 rounded px-3 py-2 text-sm"
            >
              <option value="reel_idea">Reel Idea</option>
              <option value="hook">Hook</option>
              <option value="caption">Caption</option>
              <option value="lyric_quote_post">Lyric Quote Post</option>
              <option value="metricool_draft">Metricool Draft</option>
            </select>
          </div>
          <div>
            <FieldLabel>Approval status</FieldLabel>
            <select
              value={form.approval_status}
              onChange={(e) => set('approval_status', e.target.value)}
              className="w-full bg-secondary/50 border border-border/40 rounded px-3 py-2 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="needs_review">Needs Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? 'Saving…' : 'Save Post'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}