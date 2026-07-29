import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, Search, Download, AlertTriangle, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TABS = [
  { key: 'all', label: 'All Lyrics' },
  { key: 'draft', label: 'Draft' },
  { key: 'ready_for_review', label: 'Ready for Review' },
  { key: 'needs_source', label: 'Needs Source' },
  { key: 'sensitive_review', label: 'Sensitive Review' },
  { key: 'publish_later', label: 'Publish Later' },
  { key: 'approved', label: 'Approved' },
];

const STATUS_LABELS = {
  draft: 'Draft',
  ready_for_review: 'Ready for Review',
  needs_source: 'Needs Source',
  sensitive_review: 'Sensitive Review',
  publish_later: 'Publish Later',
  approved: 'Approved',
};

const STATUS_COLORS = {
  draft: 'text-yellow-500',
  ready_for_review: 'text-blue-400',
  needs_source: 'text-orange-400',
  sensitive_review: 'text-red-400',
  publish_later: 'text-purple-400',
  approved: 'text-green-500',
};

export default function LyricsArchive() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(/** @type {any} */ (null));
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(/** @type {Record<string, any>} */ ({}));

  const { data: lyrics = [] } = useQuery({
    queryKey: ['lyrics'],
    queryFn: () => base44.entities.Lyric.list('-sort_order'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Lyric.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['lyrics']); setEditing(null); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Lyric.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['lyrics']); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Lyric.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['lyrics']),
  });

  const filtered = useMemo(() => {
    let result = lyrics;
    if (activeTab !== 'all') {
      result = result.filter(l => l.version_status === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.title?.toLowerCase().includes(q) ||
        l.lyrics_text?.toLowerCase().includes(q) ||
        l.draft_notes?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [lyrics, activeTab, search]);

  const handleNew = () => {
    setEditing({});
    setForm({
      title: '', slug: '', release_title: '', lyrics_text: '', inspiration: '',
      is_published: false, sort_order: 0, copyright_year: '',
      version_status: 'needs_source', draft_notes: '',
      publishing_status: 'not_approved', approval_status: 'pending',
      source: 'pasted by Gannon', needs_review: true,
      contains_explicit_language: false, contains_unresolved_wording: false,
      contains_sensitive_content: false, publishing_safe: false,
    });
  };

  const handleEdit = (lyric) => {
    setEditing(lyric);
    setForm({
      title: lyric.title || '', slug: lyric.slug || '', release_title: lyric.release_title || '',
      lyrics_text: lyric.lyrics_text || '', inspiration: lyric.inspiration || '',
      is_published: lyric.is_published || false, sort_order: lyric.sort_order || 0,
      copyright_year: lyric.copyright_year || '',
      version_status: lyric.version_status || 'needs_source',
      draft_notes: lyric.draft_notes || '',
      publishing_status: lyric.publishing_status || 'not_approved',
      approval_status: lyric.approval_status || 'pending',
      source: lyric.source || 'pasted by Gannon',
      needs_review: lyric.needs_review ?? true,
      contains_explicit_language: lyric.contains_explicit_language || false,
      contains_unresolved_wording: lyric.contains_unresolved_wording || false,
      contains_sensitive_content: lyric.contains_sensitive_content || false,
      publishing_safe: lyric.publishing_safe || false,
    });
  };

  const handleSave = () => {
    if (!form.title || !form.lyrics_text) return;
    if (editing?.id) {
      updateMutation.mutate({ id: editing.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleExport = () => {
    const headers = ['Title', 'Version Status', 'Publishing Status', 'Approval Status', 'Needs Review', 'Explicit', 'Unresolved', 'Sensitive', 'Publishing Safe', 'Source'];
    const rows = lyrics.map(l => [
      `"${(l.title || '').replace(/"/g, '""')}"`,
      l.version_status || '', l.publishing_status || '', l.approval_status || '',
      l.needs_review ? 'Yes' : 'No',
      l.contains_explicit_language ? 'Yes' : 'No',
      l.contains_unresolved_wording ? 'Yes' : 'No',
      l.contains_sensitive_content ? 'Yes' : 'No',
      l.publishing_safe ? 'Yes' : 'No',
      `"${(l.source || '').replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'lyrics_archive_export.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const counts = useMemo(() => {
    const c = { all: lyrics.length, draft: 0, ready_for_review: 0, needs_source: 0, sensitive_review: 0, publish_later: 0, approved: 0 };
    lyrics.forEach(l => { if (c[l.version_status] !== undefined) c[l.version_status]++; });
    return c;
  }, [lyrics]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Admin · Private Archive</p>
          <h1 className="font-display text-3xl text-foreground">Lyrics Archive</h1>
          <p className="font-body text-xs text-muted-foreground mt-1">All lyrics stored here. Published lyrics also appear on the public /lyrics page.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="gap-2"><Download className="w-4 h-4" /> Export</Button>
          <Button onClick={handleNew} className="gap-2"><Plus className="w-4 h-4" /> Add Lyrics</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-lg font-body text-xs tracking-wide transition-colors ${
              activeTab === tab.key ? 'bg-primary/15 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground border border-transparent'
            }`}
          >
            {tab.label} <span className="text-[9px] opacity-60">({counts[tab.key] || 0})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search lyrics by title, text, or notes..."
          className="w-full bg-secondary/50 border border-border/40 rounded-lg pl-10 pr-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
        />
      </div>

      {/* Edit form */}
      {editing && (
        <div className="mb-6 bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-body text-sm font-semibold text-foreground">{editing.id ? 'Edit Lyrics' : 'New Lyrics'}</h2>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Song title *" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
            <input value={form.release_title} onChange={e => setForm({ ...form, release_title: e.target.value })} placeholder="Release title" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
          </div>
          <textarea value={form.lyrics_text} onChange={e => setForm({ ...form, lyrics_text: e.target.value })} placeholder="Lyrics text (exact as supplied) *" rows={8} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground font-mono" />
          <textarea value={form.inspiration} onChange={e => setForm({ ...form, inspiration: e.target.value })} placeholder="Story behind the song" rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
          <textarea value={form.draft_notes} onChange={e => setForm({ ...form, draft_notes: e.target.value })} placeholder="Draft notes (spelling issues, unresolved wording, review notes)" rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input value={form.copyright_year} onChange={e => setForm({ ...form, copyright_year: e.target.value })} placeholder="Copyright year" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
            <input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="Source" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
            <select value={form.version_status} onChange={e => setForm({ ...form, version_status: e.target.value })} className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground">
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={form.approval_status} onChange={e => setForm({ ...form, approval_status: e.target.value })} className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.needs_review} onChange={e => setForm({ ...form, needs_review: e.target.checked })} className="rounded" /><span className="font-body text-xs text-foreground">Needs Review</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.contains_explicit_language} onChange={e => setForm({ ...form, contains_explicit_language: e.target.checked })} className="rounded" /><span className="font-body text-xs text-foreground">Explicit Language</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.contains_unresolved_wording} onChange={e => setForm({ ...form, contains_unresolved_wording: e.target.checked })} className="rounded" /><span className="font-body text-xs text-foreground">Unresolved Wording</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.contains_sensitive_content} onChange={e => setForm({ ...form, contains_sensitive_content: e.target.checked })} className="rounded" /><span className="font-body text-xs text-foreground">Sensitive Content</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.publishing_safe} onChange={e => setForm({ ...form, publishing_safe: e.target.checked })} className="rounded" /><span className="font-body text-xs text-foreground">Publishing Safe</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} className="rounded" /><span className="font-body text-xs text-foreground">Published (public)</span></label>
          </div>
          <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" /> Save</Button>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && !editing && (
          <p className="font-body text-sm text-muted-foreground text-center py-12">No lyrics found in this view.</p>
        )}
        {filtered.map(lyric => (
          <div key={lyric.id} className="bg-card/50 border border-border/40 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-lg text-foreground">{lyric.title}</h3>
                  <span className={`text-[9px] uppercase tracking-widest ${STATUS_COLORS[lyric.version_status] || 'text-muted-foreground'}`}>
                    {STATUS_LABELS[lyric.version_status] || lyric.version_status}
                  </span>
                  {lyric.is_published
                    ? <span className="text-[9px] uppercase tracking-widest text-green-500 flex items-center gap-1"><Eye className="w-3 h-3" /> Published</span>
                    : <span className="text-[9px] uppercase tracking-widest text-muted-foreground flex items-center gap-1"><EyeOff className="w-3 h-3" /> Private</span>}
                  {lyric.contains_sensitive_content && <span className="text-[9px] uppercase tracking-widest text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Sensitive</span>}
                  {lyric.contains_unresolved_wording && <span className="text-[9px] uppercase tracking-widest text-orange-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Unresolved</span>}
                  {lyric.needs_review && <span className="text-[9px] uppercase tracking-widest text-yellow-500 flex items-center gap-1"><FileText className="w-3 h-3" /> Needs Review</span>}
                </div>
                {lyric.release_title && <p className="font-body text-xs text-muted-foreground mt-0.5">{lyric.release_title}</p>}
                <p className="font-body text-xs text-foreground/50 mt-2 line-clamp-2 whitespace-pre-line">{lyric.lyrics_text}</p>
                {lyric.draft_notes && <p className="font-body text-[10px] text-muted-foreground/60 mt-2 italic line-clamp-2">{lyric.draft_notes}</p>}
                <p className="font-body text-[9px] text-muted-foreground/40 mt-1">Source: {lyric.source || '—'} · Added: {lyric.created_date ? new Date(lyric.created_date).toLocaleDateString('en-AU') : '—'}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(lyric)} className="text-muted-foreground hover:text-primary"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteMutation.mutate(lyric.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 text-[10px] text-muted-foreground/50">
        <Shield className="w-3 h-3" />
        <span>Lyrics archive — all lyrics stored here. Published lyrics (is_published) appear on the public /lyrics page. Unpublished lyrics are private.</span>
      </div>
    </div>
  );
}
