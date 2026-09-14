import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Rocket, Upload, Loader2 } from 'lucide-react';
import ReleasePackReport from '@/components/admin/ReleasePackReport';

const GENRES = ['singer_songwriter', 'folk', 'soul', 'pop', 'rnb', 'hip_hop', 'spoken_word', 'cinematic', 'rock', 'other'];
const MOODS = ['reflective', 'tender', 'raw', 'uplifting', 'melancholic', 'hopeful', 'anthemic', 'intimate', 'other'];

const inputClass = 'w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40';
const labelClass = 'block font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5';

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
    presave_url: '',
    auto_publish_on_release_date: false,
  });
  const [artwork, setArtwork] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [privateDraftAcknowledged, setPrivateDraftAcknowledged] = useState(false);

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
    if (!privateDraftAcknowledged) {
      toast({ title: 'Confirm the private-draft acknowledgement first', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke('submitNewRelease', {
        ...form,
        artwork_url: artwork?.url || '',
        private_draft_acknowledged: privateDraftAcknowledged,
      });
      const packetResponse = await base44.functions.invoke('generateReleaseLaunchPacket', {
        release_id: res.data.release_id,
      });
      setResult({ ...res.data, ...packetResponse.data, external_actions: 'held', release_date: res.data.release_date, too_lost: res.data.too_lost });
      toast({ title: 'Release created, launch packet built', description: form.title });
    } catch (err) {
      toast({
        title: 'Submission failed',
        description: err?.response?.data?.error || err?.message || 'Unknown error',
        variant: 'destructive',
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold gradient-gold-text">New Release Studio</h1>
        <p className="text-muted-foreground text-sm mt-1 font-body">
          Create a private release draft and review pack. One press also runs your launch agents: hero design, merch concepts, socials, press release, playlist pitch, fan email and a dated launch plan, all kept private for your review.
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
          <label className={labelClass} htmlFor="nrs-presave">Presave link (optional)</label>
          <input id="nrs-presave" className={inputClass} value={form.presave_url} onChange={e => set('presave_url', e.target.value)} placeholder="Paste an already verified pre-save link, if one exists" />
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
          <textarea id="nrs-lyrics" rows={6} className={inputClass} value={form.lyrics} onChange={e => set('lyrics', e.target.value)} placeholder="Paste the full lyrics — they stay private while the approval gates remain closed" />
        </div>

        <div className="p-3 border border-primary/20 bg-primary/5 rounded-lg">
          <p className="font-body text-xs text-foreground">
            This creates a private release draft, then your agents draft the full promotional packet around it. Every generated item stays a private draft for your review.
          </p>
          <p className="font-body text-xs text-muted-foreground mt-1">
            It does not deliver to a distributor, publish, post, send, schedule, or charge a payment method. Any later public release needs the separate exact owner approval gates.
          </p>
          <label className="mt-3 flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={privateDraftAcknowledged}
              onChange={e => setPrivateDraftAcknowledged(e.target.checked)}
              className="mt-0.5 accent-[#d4af37]"
            />
            <span className="font-body text-xs text-foreground">
              I understand this creates a private release record and private promotional drafts. It does not publish, deliver, post, email or schedule anything.
            </span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={submitting || uploading || !privateDraftAcknowledged}
          className="w-full gradient-gold-button rounded-full py-2.5 font-body text-xs tracking-wider uppercase"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
          {submitting ? 'Building your launch packet…' : 'Create release & build launch packet'}
        </Button>
      </form>

      <ReleasePackReport result={result} />
    </div>
  );
}