import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Sparkles, Check, X, Send, RefreshCw, Video } from 'lucide-react';

const PLATFORMS = [
  { key: 'instagram_reels', label: 'Instagram Reels' },
  { key: 'facebook_reels', label: 'Facebook Reels' },
  { key: 'youtube_shorts', label: 'YouTube Shorts' },
  { key: 'tiktok', label: 'TikTok' }
];

export default function ReelFactory() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: sources = [] } = useQuery({
    queryKey: ['sourceVideos'],
    queryFn: () => base44.entities.SourceVideo.list('-created_date', 50)
  });

  const { data: clips = [] } = useQuery({
    queryKey: ['reelClips'],
    queryFn: () => base44.entities.ReelClip.list('-virality_score', 100)
  });

  const [newTitle, setNewTitle] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState({});

  const run = async (key, fn) => {
    setBusy((b) => ({ ...b, [key]: true }));
    try {
      const res = await fn();
      return res;
    } finally {
      setBusy((b) => ({ ...b, [key]: false }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.file.files?.[0];
    if (!file || !newTitle.trim()) {
      toast({ title: 'Add a title and choose a video file' });
      return;
    }
    await run('upload', async () => {
      setUploading(true);
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        await base44.entities.SourceVideo.create({
          title: newTitle.trim(),
          video_url: file_url,
          status: 'uploaded',
          topic_keywords: newKeywords.split(',').map((s) => s.trim()).filter(Boolean)
        });
        setNewTitle('');
        setNewKeywords('');
        e.target.file.value = '';
        qc.invalidateQueries(['sourceVideos']);
        toast({ title: 'Source video saved' });
      } finally {
        setUploading(false);
      }
    });
  };

  const submitOpus = async (sv) => {
    await run('opus-' + sv.id, async () => {
      const r = await base44.functions.invoke('opusClipCreateProject', {
        sourceVideoId: sv.id, videoUrl: sv.video_url, topicKeywords: sv.topic_keywords || []
      });
      toast({ title: 'Submitted to Opus Clip', description: 'Project id: ' + (r.data.projectId || 'created') });
      qc.invalidateQueries(['sourceVideos']);
    });
  };

  const fetchClips = async (sv) => {
    if (!sv.opus_project_id) {
      toast({ title: 'Submit to Opus Clip first' });
      return;
    }
    await run('fetch-' + sv.id, async () => {
      const r = await base44.functions.invoke('opusClipFetchClips', { sourceVideoId: sv.id, projectId: sv.opus_project_id });
      toast({ title: 'Clips imported', description: (r.data.created || 0) + ' new clips for review' });
      qc.invalidateQueries(['reelClips']);
      qc.invalidateQueries(['sourceVideos']);
    });
  };

  const saveClip = async (clip, patch) => {
    await base44.entities.ReelClip.update(clip.id, patch);
    qc.invalidateQueries(['reelClips']);
  };

  const setApproval = async (clip, status) => {
    await base44.entities.ReelClip.update(clip.id, { approval_status: status });
    qc.invalidateQueries(['reelClips']);
    toast({ title: status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Sent to revision' });
  };

  const post = async (clip) => {
    await run('post-' + clip.id, async () => {
      const r = await base44.functions.invoke('publishApprovedReel', { reelClipId: clip.id });
      toast({ title: 'Post status: ' + r.data.postStatus, description: JSON.stringify(r.data.log) });
      qc.invalidateQueries(['reelClips']);
    });
  };

  const togglePlatform = (clip, key) => {
    const cur = clip.platform_targets || [];
    const next = cur.includes(key) ? cur.filter((p) => p !== key) : [...cur, key];
    saveClip(clip, { platform_targets: next });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-2">Reel Factory</p>
          <h1 className="font-display text-3xl md:text-4xl gradient-gold-text">Opus Clip → Reels → Approval</h1>
          <p className="font-body text-sm text-muted-foreground mt-2 max-w-2xl">
            Save a source video, send it to Opus Clip for AI-scored short cuts, review each clip, then approve and post.
            Nothing posts without your approval. Instagram Reels and TikTok post live; Facebook Reels and YouTube Shorts need connectors.
          </p>
        </div>

        {/* Source videos */}
        <section className="mb-12">
          <h2 className="font-body text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">1 · Source videos</h2>
          <form onSubmit={handleUpload} className="rounded-2xl border border-border/40 bg-card/40 p-5 mb-4">
            <div className="grid md:grid-cols-3 gap-3 items-end">
              <div>
                <Label className="text-xs">Title</Label>
                <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Behind the song: Without You Here" />
              </div>
              <div>
                <Label className="text-xs">Topic keywords (comma separated)</Label>
                <Input value={newKeywords} onChange={(e) => setNewKeywords(e.target.value)} placeholder="grief, healing, mother" />
              </div>
              <div>
                <Label className="text-xs">Video file</Label>
                <Input name="file" type="file" accept="video/*" />
              </div>
            </div>
            <div className="mt-4">
              <Button type="submit" disabled={uploading} className="gradient-gold-button border-0 rounded-full">
                <Upload className="w-4 h-4" /> {uploading ? 'Saving…' : 'Save source video'}
              </Button>
            </div>
          </form>

          <div className="space-y-2">
            {sources.length === 0 && (
              <p className="font-body text-sm text-muted-foreground">No source videos yet. This is where every reel begins.</p>
            )}
            {sources.map((sv) => (
              <div key={sv.id} className="rounded-xl border border-border/40 bg-card/30 p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Video className="w-4 h-4 text-primary/70 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-body text-sm text-foreground truncate">{sv.title}</p>
                    <p className="font-body text-[10px] text-muted-foreground truncate">{sv.video_url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-body text-[10px] tracking-widest uppercase px-2 py-1 rounded-full border border-border/40 text-muted-foreground">{sv.status}</span>
                  <Button type="button" size="sm" variant="outline" disabled={busy['opus-' + sv.id]} onClick={() => submitOpus(sv)} className="rounded-full">
                    <Sparkles className="w-3.5 h-3.5" /> {sv.opus_project_id ? 'Resubmit' : 'Opus Clip'}
                  </Button>
                  <Button type="button" size="sm" disabled={busy['fetch-' + sv.id]} onClick={() => fetchClips(sv)} className="rounded-full gradient-gold-button border-0">
                    <RefreshCw className="w-3.5 h-3.5" /> Fetch clips
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Clips review */}
        <section>
          <h2 className="font-body text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">2 · Clips for review</h2>
          {clips.length === 0 && (
            <p className="font-body text-sm text-muted-foreground">No clips yet. Fetch clips from a source video to see them here, ranked by virality score.</p>
          )}
          <div className="grid gap-4">
            {clips.map((clip) => (
              <ClipCard key={clip.id} clip={clip} onSave={saveClip} onApproval={setApproval} onPost={post} onTogglePlatform={togglePlatform} busy={busy['post-' + clip.id]} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ClipCard({ clip, onSave, onApproval, onPost, onTogglePlatform, busy }) {
  const [hook, setHook] = useState(clip.hook || '');
  const [caption, setCaption] = useState(clip.caption || '');
  const [hashtags, setHashtags] = useState((clip.hashtags || []).join(' '));
  const [firstComment, setFirstComment] = useState(clip.first_comment || '');
  const [cover, setCover] = useState(clip.cover_image_url || '');
  const [music, setMusic] = useState(clip.music_bed_url || '');

  const score = Math.round(clip.virality_score || 0);
  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-muted-foreground';

  const save = () => {
    onSave(clip, {
      hook, caption,
      hashtags: hashtags.split(/\s+/).map((s) => s.trim()).filter(Boolean),
      first_comment: firstComment,
      cover_image_url: cover,
      music_bed_url: music
    });
  };

  return (
    <div className="rounded-2xl border border-border/40 bg-card/30 p-4 md:p-5">
      <div className="grid md:grid-cols-[220px_1fr] gap-5">
        <div>
          <a href={clip.clip_video_url} target="_blank" rel="noreferrer" className="block aspect-[9/16] rounded-xl overflow-hidden border border-border/40 bg-secondary/40">
            {cover ? (
              <img src={cover} alt="cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Video className="w-8 h-8 text-muted-foreground/40" /></div>
            )}
          </a>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Virality</span>
            <span className={'font-body text-lg font-semibold ' + scoreColor}>{score}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-body text-[10px] tracking-widest uppercase px-2 py-1 rounded-full border border-border/40 text-muted-foreground">{clip.approval_status.replace('_', ' ')}</span>
            <span className="font-body text-[10px] tracking-widest uppercase px-2 py-1 rounded-full border border-border/40 text-muted-foreground">{clip.post_status.replace('_', ' ')}</span>
            {clip.source_video_title && <span className="font-body text-[10px] text-muted-foreground truncate">from {clip.source_video_title}</span>}
          </div>

          <div>
            <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">Hook</Label>
            <Input value={hook} onChange={(e) => setHook(e.target.value)} />
          </div>
          <div>
            <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">Caption</Label>
            <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} />
          </div>
          <div>
            <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">Hashtags</Label>
            <Input value={hashtags} onChange={(e) => setHashtags(e.target.value)} />
          </div>
          <div>
            <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">First comment (conversation + CTA)</Label>
            <Textarea value={firstComment} onChange={(e) => setFirstComment(e.target.value)} rows={2} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">Cover image (This Is Me)</Label>
              <Input value={cover} onChange={(e) => setCover(e.target.value)} placeholder="https://…" />
            </div>
            <div>
              <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">Music bed (2% volume)</Label>
              <Input value={music} onChange={(e) => setMusic(e.target.value)} placeholder="https://…" />
            </div>
          </div>

          <div>
            <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">Post to</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {PLATFORMS.map((p) => {
                const on = (clip.platform_targets || []).includes(p.key);
                return (
                  <button key={p.key} type="button" onClick={() => onTogglePlatform(clip, p.key)}
                    className={'font-body text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border transition-colors ' + (on ? 'gradient-gold-text border-primary/60 bg-primary/10' : 'border-border/40 text-muted-foreground hover:border-primary/40')}>
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="button" size="sm" variant="outline" onClick={save} className="rounded-full">Save edits</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => onApproval(clip, 'in_revision')} className="rounded-full border-amber-500/40 text-amber-400">Send to revision</Button>
            <Button type="button" size="sm" onClick={() => onApproval(clip, 'approved')} className="rounded-full gradient-gold-button border-0"><Check className="w-3.5 h-3.5" /> Approve</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => onApproval(clip, 'rejected')} className="rounded-full border-destructive/40 text-destructive"><X className="w-3.5 h-3.5" /> Reject</Button>
            <Button type="button" size="sm" disabled={clip.approval_status !== 'approved' || busy} onClick={() => onPost(clip)} className="rounded-full gradient-gold-button border-0"><Send className="w-3.5 h-3.5" /> {busy ? 'Posting…' : 'Post approved'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}