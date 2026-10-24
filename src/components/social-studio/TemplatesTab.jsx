import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Play, Loader2 } from 'lucide-react';
import { PLATFORMS, POST_TYPES, TEMPLATE_CATEGORIES } from './platforms';

const EMPTY = {
  name: '',
  category: 'release',
  platforms: [],
  post_type: 'post',
  caption: '',
  hashtags: '',
};

export default function TemplatesTab({ onCreated }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const load = () => {
    setLoading(true);
    base44.entities.SocialStudioTemplate.list('-created_date', 100)
      .then((page) => setTemplates(page.items || []))
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const togglePlatform = (key) =>
    set({ platforms: form.platforms.includes(key) ? form.platforms.filter((p) => p !== key) : [...form.platforms, key] });

  const save = async () => {
    if (!form.name.trim()) {
      setMessage({ type: 'error', text: 'Give the template a name.' });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      if (editingId) await base44.entities.SocialStudioTemplate.update(editingId, form);
      else await base44.entities.SocialStudioTemplate.create(form);
      setForm(EMPTY);
      setEditingId(null);
      setMessage({ type: 'ok', text: 'Template saved.' });
      load();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (t) => {
    await base44.entities.SocialStudioTemplate.delete(t.id);
    if (editingId === t.id) { setEditingId(null); setForm(EMPTY); }
    load();
  };

  const use = async (t) => {
    setBusy(true);
    try {
      const post = await base44.entities.SocialStudioPost.create({
        title: t.name,
        platforms: t.platforms || [],
        post_type: t.post_type || 'post',
        caption: t.caption || '',
        hashtags: t.hashtags || '',
        media_urls: t.media_urls || [],
        approval_status: 'pending_approval',
        status: 'draft',
        template_id: t.id,
      });
      onCreated(post);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const inputClass = 'w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground';

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h2 className="font-display text-lg text-foreground">{editingId ? 'Edit template' : 'New template'}</h2>
        <input className={inputClass} value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Template name, e.g. Release day announcement" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1 tracking-widest uppercase">Category</label>
            <select className={inputClass} value={form.category} onChange={(e) => set({ category: e.target.value })}>
              {TEMPLATE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1 tracking-widest uppercase">Post type</label>
            <select className={inputClass} value={form.post_type} onChange={(e) => set({ post_type: e.target.value })}>
              {POST_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1 tracking-widest uppercase">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => togglePlatform(p.key)}
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  form.platforms.includes(p.key) ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <textarea className={`${inputClass} min-h-[6rem]`} value={form.caption} onChange={(e) => set({ caption: e.target.value })} placeholder="Caption template" />
        <input className={inputClass} value={form.hashtags} onChange={(e) => set({ hashtags: e.target.value })} placeholder="Default hashtags" />
        {message && (
          <div className={`text-sm rounded-md px-3 py-2 border ${message.type === 'ok' ? 'border-primary/40 text-primary bg-primary/10' : 'border-destructive/40 text-destructive bg-destructive/10'}`}>
            {message.text}
          </div>
        )}
        <div className="flex gap-2">
          <Button type="button" disabled={busy} onClick={save}><Plus className="w-4 h-4" /> {editingId ? 'Update' : 'Save template'}</Button>
          {editingId && (
            <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setForm(EMPTY); }}>Cancel edit</Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-lg text-foreground">Saved templates</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center"><Loader2 className="w-5 h-5 animate-spin" /> Loading</div>
        ) : templates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No templates yet. Create one for release days, promos and community posts.</p>
        ) : (
          templates.map((t) => (
            <div key={t.id} className="rounded-lg border border-border bg-card p-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-foreground font-medium">{t.name}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-secondary text-secondary-foreground">{t.category}</span>
                </div>
                {t.caption && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.caption}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => use(t)}><Play className="w-3.5 h-3.5" /> Use</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setEditingId(t.id); setForm({ ...t }); }}>Edit</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(t)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}