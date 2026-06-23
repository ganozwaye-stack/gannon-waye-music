import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, X, Film, MessageSquare, Music, Link2, Megaphone, BarChart3, CheckCircle2, Clock } from 'lucide-react';

const CONTENT_TYPES = [
  { value: 'reel_idea', label: 'Reel Ideas', icon: Film },
  { value: 'hook', label: 'Hooks', icon: Megaphone },
  { value: 'caption', label: 'Captions', icon: MessageSquare },
  { value: 'first_comment', label: 'First Comments', icon: MessageSquare },
  { value: 'lyric_quote_post', label: 'Lyric Quote Posts', icon: Music },
  { value: 'manychat_keyword', label: 'ManyChat Keywords', icon: Megaphone },
  { value: 'music_link', label: 'Music Links', icon: Link2 },
  { value: 'merch_link', label: 'Merch Links', icon: Link2 },
  { value: 'press_snippet', label: 'Press Snippets', icon: Megaphone },
  { value: 'pitch_angle', label: 'Pitch Angles', icon: Megaphone },
  { value: 'metricool_draft', label: 'Metricool Drafts', icon: BarChart3 },
  { value: 'approval_queue', label: 'Approval Queue', icon: Clock },
  { value: 'posted_archive', label: 'Posted Archive', icon: CheckCircle2 },
  { value: 'performance_note', label: 'Performance Notes', icon: BarChart3 },
];

const APPROVAL_STYLES = {
  draft: 'bg-secondary text-muted-foreground',
  needs_review: 'bg-amber-500/20 text-amber-400',
  approved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
};

const EMPTY_FORM = {
  content_type: 'reel_idea',
  song: '',
  release: '',
  hook: '',
  on_screen_text: '',
  caption: '',
  first_comment: '',
  cta: '',
  manychat_keyword: '',
  destination_link: '',
  asset_required: '',
  approval_status: 'draft',
  metricool_status: 'not_sent',
  posted_status: 'not_posted',
  performance_notes: '',
  platform: 'all',
  sort_order: 0,
};

export default function ContentStudio() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('reel_idea');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: records = [] } = useQuery({
    queryKey: ['ContentStudioRecord'],
    queryFn: () => base44.entities.ContentStudioRecord.list('-updated_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ContentStudioRecord.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ContentStudioRecord'] }); setEditing(null); setForm(EMPTY_FORM); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ContentStudioRecord.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ContentStudioRecord'] }); setEditing(null); setForm(EMPTY_FORM); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ContentStudioRecord.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ContentStudioRecord'] }),
  });

  const filtered = records.filter(r => r.content_type === activeTab);
  const pendingApproval = records.filter(r => r.approval_status === 'needs_review');

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleEdit = (record) => {
    setEditing(record.id);
    setForm({ ...EMPTY_FORM, ...record });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Admin · Private</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Content Studio</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Social reel content connected to music releases. No auto-posting — all content requires Gannon's approval.
        </p>
      </div>

      {pendingApproval.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-amber-500/40 bg-amber-500/5">
          <Clock className="w-4 h-4 text-amber-400" />
          <p className="font-body text-xs text-amber-400">{pendingApproval.length} item(s) pending approval in the Approval Queue tab.</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {CONTENT_TYPES.map(t => {
          const Icon = t.icon;
          const count = records.filter(r => r.content_type === t.value).length;
          return (
            <button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs transition-all ${
                activeTab === t.value ? 'bg-primary text-primary-foreground' : 'border border-border/40 text-muted-foreground hover:border-primary/40'
              }`}
            >
              <Icon className="w-3 h-3" /> {t.label} {count > 0 && <span className="opacity-60">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Create button */}
      <Button onClick={() => { setEditing('new'); setForm({ ...EMPTY_FORM, content_type: activeTab }); }} className="gap-2">
        <Plus className="w-4 h-4" /> New {CONTENT_TYPES.find(t => t.value === activeTab)?.label.replace(/s$/, '')}
      </Button>

      {/* Edit/Create form */}
      {editing && (
        <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-border/40 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-foreground">{editing === 'new' ? 'Create' : 'Edit'} Content Record</h3>
            <button type="button" onClick={() => { setEditing(null); setForm(EMPTY_FORM); }}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Song</label>
              <Input value={form.song} onChange={e => set('song', e.target.value)} className="bg-secondary/50" />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Release</label>
              <Input value={form.release} onChange={e => set('release', e.target.value)} className="bg-secondary/50" />
            </div>
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Hook</label>
            <Input value={form.hook} onChange={e => set('hook', e.target.value)} className="bg-secondary/50" />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">On-Screen Text</label>
            <Textarea value={form.on_screen_text} onChange={e => set('on_screen_text', e.target.value)} className="bg-secondary/50" rows={2} />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Caption</label>
            <Textarea value={form.caption} onChange={e => set('caption', e.target.value)} className="bg-secondary/50" rows={3} />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">First Comment</label>
            <Textarea value={form.first_comment} onChange={e => set('first_comment', e.target.value)} className="bg-secondary/50" rows={2} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">CTA</label>
              <Input value={form.cta} onChange={e => set('cta', e.target.value)} className="bg-secondary/50" />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">ManyChat Keyword</label>
              <Input value={form.manychat_keyword} onChange={e => set('manychat_keyword', e.target.value)} className="bg-secondary/50" />
            </div>
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Destination Link</label>
            <Input value={form.destination_link} onChange={e => set('destination_link', e.target.value)} className="bg-secondary/50" />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Asset Required</label>
            <Input value={form.asset_required} onChange={e => set('asset_required', e.target.value)} className="bg-secondary/50" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Approval Status</label>
              <select value={form.approval_status} onChange={e => set('approval_status', e.target.value)} className="w-full bg-secondary/50 border border-border/40 rounded-md px-3 py-2 text-sm">
                <option value="draft">Draft</option>
                <option value="needs_review">Needs Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Metricool Status</label>
              <select value={form.metricool_status} onChange={e => set('metricool_status', e.target.value)} className="w-full bg-secondary/50 border border-border/40 rounded-md px-3 py-2 text-sm">
                <option value="not_sent">Not Sent</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Posted Status</label>
              <select value={form.posted_status} onChange={e => set('posted_status', e.target.value)} className="w-full bg-secondary/50 border border-border/40 rounded-md px-3 py-2 text-sm">
                <option value="not_posted">Not Posted</option>
                <option value="posted">Posted</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Performance Notes</label>
            <Textarea value={form.performance_notes} onChange={e => set('performance_notes', e.target.value)} className="bg-secondary/50" rows={2} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="gap-2">
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Record'}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm(EMPTY_FORM); }}>Cancel</Button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground text-center py-12">No {CONTENT_TYPES.find(t => t.value === activeTab)?.label.toLowerCase()} yet. Click "New" to create one.</p>
        ) : (
          filtered.map(record => (
            <div key={record.id} className="p-4 rounded-xl border border-border/40 bg-card space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {record.song && <span className="font-body text-sm font-semibold text-foreground">{record.song}</span>}
                    <Badge className={`text-[9px] border-0 ${APPROVAL_STYLES[record.approval_status] || ''}`}>{record.approval_status}</Badge>
                    {record.metricool_status !== 'not_sent' && <Badge className="text-[9px] border-0 bg-blue-500/20 text-blue-400">{record.metricool_status}</Badge>}
                    {record.posted_status === 'posted' && <Badge className="text-[9px] border-0 bg-green-500/20 text-green-400">Posted</Badge>}
                  </div>
                  {record.hook && <p className="font-body text-sm text-foreground/80">{record.hook}</p>}
                  {record.caption && <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-2">{record.caption}</p>}
                  {record.destination_link && <a href={record.destination_link} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-primary hover:underline mt-1 inline-block">{record.destination_link}</a>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleEdit(record)} className="p-1.5 rounded hover:bg-secondary"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  <button onClick={() => deleteMutation.mutate(record.id)} className="p-1.5 rounded hover:bg-secondary"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}