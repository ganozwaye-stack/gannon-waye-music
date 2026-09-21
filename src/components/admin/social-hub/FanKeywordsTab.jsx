import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { X, Plus, Pencil, Trash2, Loader2, MessageCircle, ArrowUpRight, Radio } from 'lucide-react';

// Fan Keywords tab — full CRUD on ManyChatKeywordDraft (the existing entity,
// no new one). Active keywords are served live by the public resolveFanKeyword
// function on all networks.

const STATUS_STYLES = {
  draft: 'bg-secondary text-secondary-foreground',
  approved: 'bg-blue-500/10 text-blue-400',
  active: 'bg-green-500/10 text-green-400',
  archived: 'bg-muted text-muted-foreground line-through',
};

const TIER_STYLES = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-purple-500/10 text-purple-400',
};

const LINK_FIELDS = [
  { key: 'music_link', label: 'Music link' },
  { key: 'subscribe_link', label: 'Subscribe link' },
  { key: 'lyrics_link', label: 'Lyrics link' },
  { key: 'store_link', label: 'Store link' },
  { key: 'press_link', label: 'Press link' },
];

const EMPTY_FORM = {
  keyword: '',
  keyword_tier: 'primary',
  song: '',
  music_link: '',
  subscribe_link: '',
  lyrics_link: '',
  store_link: '',
  press_link: '',
  response_message: '',
  status: 'draft',
  sort_order: 0,
};

function KeywordForm({ initial, saving, onSave, onClose }) {
  const [form, setForm] = useState(() => (initial ? {
    keyword: initial.keyword || '',
    keyword_tier: initial.keyword_tier || 'primary',
    song: initial.song || '',
    music_link: initial.music_link || '',
    subscribe_link: initial.subscribe_link || '',
    lyrics_link: initial.lyrics_link || '',
    store_link: initial.store_link || '',
    press_link: initial.press_link || '',
    response_message: initial.response_message || '',
    status: initial.status || 'draft',
    sort_order: initial.sort_order || 0,
  } : EMPTY_FORM));

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const previewLinks = [
    { label: 'Music', url: form.music_link },
    { label: 'Subscribe', url: form.subscribe_link },
    { label: 'Lyrics', url: form.lyrics_link },
    { label: 'Store', url: form.store_link },
    { label: 'Press', url: form.press_link },
  ].filter((l) => l.url);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl my-8 border-primary/30">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-foreground">
              {initial ? `Edit keyword — ${initial.keyword}` : 'New fan keyword'}
            </h3>
            <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Keyword *</Label>
              <Input value={form.keyword} onChange={set('keyword')} placeholder="LISTEN" className="uppercase" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Tier *</Label>
              <select
                value={form.keyword_tier}
                onChange={set('keyword_tier')}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Song</Label>
              <Input value={form.song} onChange={set('song')} placeholder="Thankyou" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Sort order</Label>
              <Input type="number" value={form.sort_order} onChange={set('sort_order')} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-3 gap-y-2.5">
            {LINK_FIELDS.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground">{f.label}</Label>
                <Input value={form[f.key]} onChange={set(f.key)} placeholder="https://" />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Response message</Label>
            <Textarea
              value={form.response_message}
              onChange={set('response_message')}
              placeholder="What the fan receives when they send this keyword…"
              rows={4}
              maxLength={2000}
            />
            <p className="font-body text-[10px] text-muted-foreground">{form.response_message.length}/2000</p>
          </div>

          <div className="space-y-1.5">
            <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Status</Label>
            <div className="flex flex-wrap gap-1.5">
              {['draft', 'approved', 'active', 'archived'].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${form.status === s ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Live preview */}
          <div className="rounded-xl border border-border/40 bg-secondary/20 p-4">
            <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <MessageCircle className="w-3 h-3" /> Live preview — what the fan sees
            </p>
            <div className="rounded-xl bg-card border border-border/40 p-3 max-w-sm">
              <p className="font-body text-sm text-foreground whitespace-pre-wrap">
                {form.response_message || 'Your response message will appear here…'}
              </p>
              {previewLinks.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {previewLinks.map((l) => (
                    <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-primary/35 text-primary px-3 py-1 font-body text-xs hover:bg-primary/10 transition-colors">
                      {l.label} <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              type="button"
              className="gradient-gold-button border-0"
              disabled={saving || !form.keyword.trim() || !form.keyword_tier}
              onClick={() => {
                if (!form.keyword.trim()) return;
                onSave({ ...form, keyword: form.keyword.trim().toUpperCase(), sort_order: Number(form.sort_order) || 0 });
              }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {initial ? 'Save changes' : 'Create keyword'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function FanKeywordsTab() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [modal, setModal] = useState(null); // null | 'new' | record

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['manychat-keyword-drafts'],
    queryFn: () => base44.entities.ManyChatKeywordDraft.list('-updated_date', 200),
  });

  const sorted = useMemo(
    () => [...records].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    [records]
  );

  const invalidate = () => qc.invalidateQueries({ queryKey: ['manychat-keyword-drafts'] });

  const save = useMutation({
    mutationFn: ({ id, data }) =>
      id ? base44.entities.ManyChatKeywordDraft.update(id, data) : base44.entities.ManyChatKeywordDraft.create(data),
    onSuccess: () => { invalidate(); setModal(null); toast({ title: 'Keyword saved' }); },
    onError: (e) => toast({ title: 'Save failed', description: e.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: (id) => base44.entities.ManyChatKeywordDraft.delete(id),
    onSuccess: () => { invalidate(); toast({ title: 'Keyword deleted' }); },
    onError: (e) => toast({ title: 'Delete failed', description: e.message, variant: 'destructive' }),
  });

  const activeCount = records.filter((r) => r.status === 'active').length;

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-display font-bold gradient-gold-text">Fan Keywords</h2>
          <p className="text-muted-foreground text-sm">
            The words fans send on any network — one keyword, one response, one set of links.
          </p>
        </div>
        <Button type="button" onClick={() => setModal('new')} className="gap-2 gradient-gold-button border-0">
          <Plus className="w-4 h-4" /> New Keyword
        </Button>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-green-500/30 bg-green-500/5 p-3.5">
        <Radio className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
        <p className="font-body text-xs text-green-400/90">
          {activeCount} active keyword{activeCount === 1 ? '' : 's'} — active keywords are live on all networks. Approved keywords go live when you set them active; drafts are never shown to fans.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-xl">
          <MessageCircle className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">No keywords yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {sorted.map((r) => (
            <Card key={r.id} className="hover:border-primary/30 transition-all">
              <CardContent className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display text-lg font-bold text-foreground tracking-wide">{r.keyword}</span>
                    <Badge className={`text-xs border-0 ${TIER_STYLES[r.keyword_tier] || ''}`}>{r.keyword_tier}</Badge>
                    <Badge className={`text-xs border-0 ${STATUS_STYLES[r.status] || ''}`}>{r.status}</Badge>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button type="button" onClick={() => setModal(r)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground" aria-label="Edit keyword">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (window.confirm(`Delete keyword ${r.keyword}?`)) remove.mutate(r.id); }}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      aria-label="Delete keyword"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {r.song && <p className="font-body text-xs text-muted-foreground">Song: {r.song}</p>}

                <p className="font-body text-xs text-foreground/75 line-clamp-3 whitespace-pre-wrap">
                  {r.response_message || <span className="text-muted-foreground/60 italic">No response message yet</span>}
                </p>

                <div className="flex flex-wrap gap-1">
                  {LINK_FIELDS.filter((f) => r[f.key]).map((f) => (
                    <span key={f.key} className="font-body text-[10px] text-primary/80 bg-primary/5 border border-primary/20 rounded-full px-2 py-0.5">
                      {f.label.replace(' link', '')}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {modal && (
        <KeywordForm
          initial={modal === 'new' ? null : modal}
          saving={save.isPending}
          onSave={(data) => save.mutate({ id: modal === 'new' ? null : modal.id, data })}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}