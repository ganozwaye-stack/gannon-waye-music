import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Trash2, Send, CalendarClock, CheckCircle2, RefreshCw, Plus, Loader2, FilePlus2 } from 'lucide-react';
import { PLATFORMS, POST_TYPES, POST_STATUS_LABELS, APPROVAL_LABELS, statusClass, resultClass, resultLabel } from './platforms';

const EMPTY = {
  title: '',
  platforms: [],
  post_type: 'post',
  caption: '',
  hashtags: '',
  media_urls: [],
  scheduled_at: '',
  approval_status: 'pending_approval',
  status: 'draft',
  notes: '',
};

export default function ComposerTab({ post, onPostChange, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [current, setCurrent] = useState(null);
  const [assets, setAssets] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [manualUrl, setManualUrl] = useState('');

  useEffect(() => {
    base44.entities.SocialAsset.list('-created_date', 100)
      .then((page) => setAssets(page.items || []))
      .catch(() => setAssets([]));
  }, []);

  useEffect(() => {
    setCurrent(post || null);
    if (post) {
      setForm({
        title: post.title || '',
        platforms: post.platforms || [],
        post_type: post.post_type || 'post',
        caption: post.caption || '',
        hashtags: post.hashtags || '',
        media_urls: post.media_urls || [],
        scheduled_at: post.scheduled_at ? post.scheduled_at.slice(0, 16) : '',
        approval_status: post.approval_status || 'pending_approval',
        status: post.status || 'draft',
        notes: post.notes || '',
      });
    } else {
      setForm(EMPTY);
    }
    setMessage(null);
  }, [post && post.id]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const togglePlatform = (key) =>
    set({ platforms: form.platforms.includes(key) ? form.platforms.filter((p) => p !== key) : [...form.platforms, key] });
  const toggleMedia = (url) =>
    set({ media_urls: form.media_urls.includes(url) ? form.media_urls.filter((u) => u !== url) : [...form.media_urls, url] });

  const save = async (statusAfter) => {
    setMessage(null);
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'Give the post a title first.' });
      return;
    }
    if (statusAfter === 'scheduled') {
      if (form.approval_status !== 'approved') {
        setMessage({ type: 'error', text: 'Content must be approved before it can be scheduled.' });
        return;
      }
      if (!form.scheduled_at) {
        setMessage({ type: 'error', text: 'Pick a scheduled date and time first.' });
        return;
      }
      if (form.platforms.length === 0) {
        setMessage({ type: 'error', text: 'Select at least one platform.' });
        return;
      }
    }
    setBusy(true);
    try {
      const data = {
        title: form.title,
        platforms: form.platforms,
        post_type: form.post_type,
        caption: form.caption,
        hashtags: form.hashtags,
        media_urls: form.media_urls,
        scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
        approval_status: form.approval_status,
        notes: form.notes,
      };
      if (statusAfter) data.status = statusAfter;
      const saved = current && current.id
        ? await base44.entities.SocialStudioPost.update(current.id, data)
        : await base44.entities.SocialStudioPost.create(data);
      setCurrent(saved);
      onPostChange(saved);
      onSaved();
      setMessage({
        type: 'ok',
        text: statusAfter === 'scheduled'
          ? 'Scheduled. The publisher runs every 15 minutes and sends it when the time arrives.'
          : statusAfter === 'ready' ? 'Marked ready for approval.' : 'Saved.',
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const setApproval = async (value) => {
    if (!current || !current.id) {
      setMessage({ type: 'error', text: 'Save the post first, then approve it.' });
      return;
    }
    setMessage(null);
    setBusy(true);
    try {
      const saved = await base44.entities.SocialStudioPost.update(current.id, {
        approval_status: value,
        approval_note: value === 'approved' ? 'Approved in Social Studio' : '',
      });
      setCurrent(saved);
      onPostChange(saved);
      onSaved();
      set('approval_status', value);
      setMessage({ type: 'ok', text: value === 'approved' ? 'Approved. Ready to schedule or publish.' : 'Approval cleared.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const publish = async (recheck) => {
    setMessage(null);
    if (form.platforms.length === 0) {
      setMessage({ type: 'error', text: 'Select at least one platform.' });
      return;
    }
    if (form.approval_status !== 'approved') {
      setMessage({ type: 'error', text: 'Content must be approved before publishing.' });
      return;
    }
    setBusy(true);
    try {
      const res = await base44.functions.invoke('socialStudioPublish', {
        post_id: current.id,
        recheck: recheck === true,
      });
      const fresh = await base44.entities.SocialStudioPost.get(current.id);
      setCurrent(fresh);
      onPostChange(fresh);
      onSaved();
      if (res.data && res.data.status === 'published') {
        setMessage({ type: 'ok', text: 'Published to Instagram. The provider confirmed it.' });
      } else if (res.data && res.data.status === 'processing') {
        setMessage({ type: 'ok', text: 'Instagram is still processing the media. Press Check status in a moment.' });
      } else {
        const ig = fresh.publish_results && fresh.publish_results.find((r) => r.platform === 'instagram');
        setMessage({ type: 'error', text: `Publish failed: ${(ig && (ig.error || ig.note)) || 'see results below'}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!current || !current.id) return;
    setBusy(true);
    try {
      await base44.entities.SocialStudioPost.delete(current.id);
      onPostChange(null);
      onSaved();
      setMessage({ type: 'ok', text: 'Post deleted.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const results = (current && current.publish_results) || [];
  const inputClass = 'w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground';

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="font-display text-lg text-foreground">{current ? 'Edit post' : 'New post'}</h2>
          {current && (
            <button type="button" onClick={() => onPostChange(null)} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <FilePlus2 className="w-3.5 h-3.5" /> Start a new post
            </button>
          )}
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1 tracking-widest uppercase">Title</label>
          <input className={inputClass} value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Set Free release day" />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1 tracking-widest uppercase">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => togglePlatform(p.key)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  form.platforms.includes(p.key)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground'
                } ${!p.connected ? 'opacity-70' : ''}`}
              >
                {p.label}{p.canPublish ? '' : ' (plan only)'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1 tracking-widest uppercase">Post type</label>
            <select className={inputClass} value={form.post_type} onChange={(e) => set({ post_type: e.target.value })}>
              {POST_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1 tracking-widest uppercase">Scheduled date and time</label>
            <input type="datetime-local" className={inputClass} value={form.scheduled_at} onChange={(e) => set({ scheduled_at: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1 tracking-widest uppercase">Caption</label>
          <textarea className={`${inputClass} min-h-[7rem]`} value={form.caption} onChange={(e) => set({ caption: e.target.value })} placeholder="Write the caption" />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1 tracking-widest uppercase">Hashtags</label>
          <input className={inputClass} value={form.hashtags} onChange={(e) => set({ hashtags: e.target.value })} placeholder="#ThankingYouKindly #NewMusic" />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1 tracking-widest uppercase">Media (from asset library)</label>
          {assets.length === 0 ? (
            <p className="text-xs text-muted-foreground">No assets yet. Upload some in the Assets tab.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {assets.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleMedia(a.file_url)}
                  className={`relative rounded-md overflow-hidden border-2 ${form.media_urls.includes(a.file_url) ? 'border-primary' : 'border-border'}`}
                  title={a.name}
                >
                  <img src={a.thumbnail_url || a.file_url} alt={a.name} className="w-full h-16 object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <input
              className={inputClass}
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="Or paste a public media URL"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => { if (manualUrl.trim()) { set({ media_urls: [...form.media_urls, manualUrl.trim()] }); setManualUrl(''); } }}>
              Add
            </Button>
          </div>
        </div>

        {message && (
          <div className={`text-sm rounded-md px-3 py-2 border ${message.type === 'ok' ? 'border-primary/40 text-primary bg-primary/10' : 'border-destructive/40 text-destructive bg-destructive/10'}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="button" disabled={busy} onClick={() => save()}>{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Save</Button>
          <Button type="button" variant="secondary" disabled={busy} onClick={() => save('ready')}>Mark ready</Button>
          {current && form.approval_status !== 'approved' ? (
            <Button type="button" variant="outline" disabled={busy} onClick={() => setApproval('approved')}><CheckCircle2 className="w-4 h-4" /> Approve</Button>
          ) : current ? (
            <Button type="button" variant="ghost" disabled={busy} onClick={() => setApproval('pending_approval')}>Clear approval</Button>
          ) : null}
          <Button type="button" variant="secondary" disabled={busy} onClick={() => save('scheduled')}><CalendarClock className="w-4 h-4" /> Schedule</Button>
          <Button type="button" className="gradient-gold-button" disabled={busy} onClick={() => publish(false)}><Send className="w-4 h-4" /> Publish now</Button>
          {current && current.status === 'processing' && (
            <Button type="button" variant="outline" disabled={busy} onClick={() => publish(true)}><RefreshCw className="w-4 h-4" /> Check status</Button>
          )}
          {current && (
            <Button type="button" variant="destructive" disabled={busy} onClick={remove}><Trash2 className="w-4 h-4" /> Delete</Button>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h3 className="font-display text-sm text-foreground">Status</h3>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded text-xs ${statusClass(form.status)}`}>{POST_STATUS_LABELS[form.status] || form.status}</span>
            <span className={`px-2 py-1 rounded text-xs border ${form.approval_status === 'approved' ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>
              {APPROVAL_LABELS[form.approval_status]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Publishing and scheduling both require approval. Only Instagram is connected for real publishing; other selected platforms are recorded as plan-only.
          </p>
        </div>

        {results.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <h3 className="font-display text-sm text-foreground">Publish results</h3>
            {results.map((r, i) => (
              <div key={i} className="text-xs border-b border-border pb-2 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-foreground capitalize">{r.platform}</span>
                  <span className={resultClass(r.status)}>{resultLabel(r.status)}</span>
                </div>
                {r.error && <div className="text-destructive mt-1">{r.error}</div>}
                {r.note && <div className="text-muted-foreground mt-1">{r.note}</div>}
                {r.permalink && (
                  <a href={r.permalink} target="_blank" rel="noreferrer" className="text-primary underline mt-1 inline-block">View post</a>
                )}
                {r.attempted_at && <div className="text-muted-foreground mt-1">{new Date(r.attempted_at).toLocaleString()}</div>}
              </div>
            ))}
          </div>
        )}

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-display text-sm text-foreground mb-2">Notes</h3>
          <textarea className={`${inputClass} min-h-[5rem]`} value={form.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Internal notes, never published" />
        </div>
      </div>
    </div>
  );
}