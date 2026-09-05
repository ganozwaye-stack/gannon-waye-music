import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Rocket, Upload, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

const GENRES = ['singer_songwriter', 'folk', 'soul', 'pop', 'rnb', 'hip_hop', 'spoken_word', 'cinematic', 'rock', 'other'];
const MOODS = ['reflective', 'tender', 'raw', 'uplifting', 'melancholic', 'hopeful', 'anthemic', 'intimate', 'other'];

const inputClass = 'w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40';
const labelClass = 'block font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5';

function ResultRow({ ok, warn, label, detail }) {
  const Icon = ok ? CheckCircle2 : (warn ? AlertTriangle : XCircle);
  const color = ok ? 'text-green-400' : (warn ? 'text-yellow-400' : 'text-red-400');
  return (
    <div className="flex items-start gap-2.5 py-2">
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${color}`} />
      <div>
        <p className="font-body text-sm text-foreground">{label}</p>
        {detail && <p className="font-body text-xs text-muted-foreground mt-0.5">{detail}</p>}
      </div>
    </div>
  );
}

export default function NewReleaseStudio() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: '',
    version_label: 'Original',
    type: 'single',
    release_date: '',
    genre: '',
    mood: '',
    description: '',
    lyrics: '',
    auto_publish_on_release_date: true,
  });
  const [artwork, setArtwork] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const set = (key, value) => setForm(current => ({ ...current, [key]: value }));

  const handleArtwork = async (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      setArtwork({ name: file.name, url: res.file_url });
    } catch {
      toast({ title: 'Artwork upload failed — try again', variant: 'destructive' });
    }
    setUploading(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.release_date) {
      toast({ title: 'Song name and release date are required', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke('submitNewRelease', {
        ...form,
        artwork_url: artwork?.url || '',
      });
      setResult(res.data);
      toast({ title: 'Release submitted 🚀', description: form.title });
    } catch (err) {
      toast({
        title: 'Submission failed',
        description: err?.response?.data?.error || err?.message || 'Unknown error',
        variant: 'destructive',
      });
    }
    setSubmitting(false);
  };

  const tooLost = result?.too_lost;

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold gradient-gold-text">New Release Studio</h1>
        <p className="text-muted-foreground text-sm mt-1 font-body">
          One button. Your song is saved to admin, synced to Too Lost, scheduled to go live on release day, and your press release and playlist pitch drafts are waiting in the Content Studio.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="nrs-title">Song name</label>
          <input id="nrs-title" className={inputClass} value={form.title} onChange={e => set('title', e.target.value)} placeholder="The exact public title" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="nrs-version">Version</label>
            <input id="nrs-version" className={inputClass} value={form.version_label} onChange={e => set('version_label', e.target.value)} placeholder="Original, Radio Edit…" />
          </div>
          <div>
            <label className={labelClass} htmlFor="nrs-type">Type</label>
            <select id="nrs-type" className={inputClass} value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="single">Single</option>
              <option value="ep">EP</option>
              <option value="album">Album</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="nrs-date">Release date</label>
            <input id="nrs-date" type="date" className={inputClass} value={form.release_date} onChange={e => set('release_date', e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="nrs-genre">Genre</label>
            <select id="nrs-genre" className={inputClass} value={form.genre} onChange={e => set('genre', e.target.value)}>
              <option value="">—</option>
              {GENRES.map(g => <option key={g} value={g}>{g.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="nrs-mood">Mood</label>
          <select id="nrs-mood" className={inputClass} value={form.mood} onChange={e => set('mood', e.target.value)}>
            <option value="">—</option>
            {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Artwork</label>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2 font-body text-xs tracking-wider uppercase border border-primary/40 text-primary hover:bg-primary/10 transition-all">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {artwork ? 'Replace artwork' : 'Upload artwork'}
              <input type="file" accept="image/*" className="hidden" onChange={handleArtwork} />
            </label>
            {artwork && (
              <span className="font-body text-xs text-muted-foreground truncate max-w-[240px]">{artwork.name}</span>
            )}
          </div>
          {artwork && (
            <img src={artwork.url} alt="Release artwork preview" className="mt-3 w-28 h-28 rounded-xl object-cover border border-border/40" />
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="nrs-description">The story behind the song (optional)</label>
          <textarea id="nrs-description" rows={3} className={inputClass} value={form.description} onChange={e => set('description', e.target.value)} placeholder="What this song is about — in your words" />
        </div>

        <div>
          <label className={labelClass} htmlFor="nrs-lyrics">Lyrics</label>
          <textarea id="nrs-lyrics" rows={6} className={inputClass} value={form.lyrics} onChange={e => set('lyrics', e.target.value)} placeholder="Paste the full lyrics — they're saved behind the usual review gate before going public" />
        </div>

        <label className="flex items-start gap-3 p-3 border border-primary/20 bg-primary/5 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={form.auto_publish_on_release_date}
            onChange={e => set('auto_publish_on_release_date', e.target.checked)}
            className="mt-0.5 accent-[#d4af37]"
          />
          <span className="font-body text-xs text-foreground">
            Go live automatically at midnight on release day
            <span className="block text-muted-foreground mt-0.5">
              Your song page, the current single feature and the music listing all update together the moment the date arrives.
            </span>
          </span>
        </label>

        <Button
          type="submit"
          disabled={submitting || uploading}
          className="w-full gradient-gold-button rounded-full py-2.5 font-body text-xs tracking-wider uppercase"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
          {submitting ? 'Submitting…' : 'Submit release — one button does it all'}
        </Button>
      </form>

      {result && (
        <div className="mt-6 border border-border/40 rounded-xl p-4 bg-card/40">
          <p className="font-display text-lg text-foreground mb-1">Submission report</p>
          <ResultRow ok label="Release saved to admin" detail={`Release date ${result.release_date}${result.auto_publish_on_release_date ? ' · auto-publishing on the day' : ''}`} />
          <ResultRow ok={!!result.lyric_id} warn={!result.lyric_id} label={result.lyric_id ? 'Lyrics saved for review' : 'No lyrics provided'} detail={result.lyric_id ? 'Held behind the usual lyric review gate.' : 'You can add lyrics later from the Lyrics Archive.'} />
          <ResultRow ok label="Press release draft created" detail="Waiting in the Content Studio for your review." />
          <ResultRow ok label="Playlist pitch draft created" detail="Waiting in the Content Studio for your review." />
          <ResultRow
            ok={tooLost?.status === 'created'}
            warn={tooLost?.status === 'reauthorise_required' || tooLost?.status === 'not_configured'}
            label={
              tooLost?.status === 'created' ? `Synced to Too Lost${tooLost.too_lost_release_id ? ` (release #${tooLost.too_lost_release_id})` : ''}` :
              tooLost?.status === 'reauthorise_required' ? 'Too Lost needs re-authorising' :
              tooLost?.status === 'not_configured' ? 'Too Lost not connected yet' :
              'Too Lost sync failed'
            }
            detail={tooLost?.detail}
          />
          <p className="font-body text-[11px] text-muted-foreground mt-2">
            The final mastered audio still needs uploading in the Too Lost portal — everything else is scheduled.
          </p>
        </div>
      )}
    </div>
  );
}