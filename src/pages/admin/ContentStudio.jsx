import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, X, Film, MessageSquare, Music, Link2, Megaphone, BarChart3, CheckCircle2, Clock, Loader2, Bot, Sparkles, Video, ExternalLink, Zap } from 'lucide-react';

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
  const [aiPanel, setAiPanel] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiContentType, setAiContentType] = useState('caption');
  const [aiTone, setAiTone] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [videoPanel, setVideoPanel] = useState(null);
  const [videoForm, setVideoForm] = useState({ avatar_id: '', voice_id: '', engine: 'avatar_v', aspect_ratio: '9:16' });
  const [videoGenerating, setVideoGenerating] = useState(false);

  const { data: records = [] } = useQuery({
    queryKey: ['ContentStudioRecord'],
    queryFn: () => base44.entities.ContentStudioRecord.list('-updated_date', 200),
  });

  const { data: productionJobs = [] } = useQuery({
    queryKey: ['ContentProductionJob'],
    queryFn: () => base44.entities.ContentProductionJob.filter({ job_type: 'heygen_video' }, '-created_date', 50),
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
    if (editing) updateMutation.mutate({ id: editing, data: form });
    else createMutation.mutate(form);
  };

  const handleAIGenerate = async (e) => {
    e.preventDefault();
    setAiGenerating(true);
    setAiResult(null);
    try {
      const response = await base44.functions.invoke('generateResearchedSocialContent', {
        topic: aiTopic,
        content_type: aiContentType,
        platform: 'Instagram',
        tone: aiTone || 'authentic, warm, and credible',
      });
      if (response.data?.status === 'success') {
        setAiResult(response.data);
        queryClient.invalidateQueries({ queryKey: ['ContentPipelineItem'] });
      } else {
        setAiResult({ error: response.data?.error || 'Generation failed' });
      }
    } catch (err) {
      setAiResult({ error: err.message });
    }
    setAiGenerating(false);
  };

  const handleVideoGenerate = async (record) => {
    setVideoGenerating(true);
    try {
      const script = record.caption || record.hook || record.on_screen_text || '';
      const response = await base44.functions.invoke('generateHeyGenVideo', {
        title: record.song || 'Content Video',
        script: script,
        avatar_id: videoForm.avatar_id,
        voice_id: videoForm.voice_id,
        engine: videoForm.engine,
        aspect_ratio: videoForm.aspect_ratio,
        related_release: record.release || '',
        agent_generated_by: 'content_studio',
      });
      if (response.data?.status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['ContentProductionJob'] });
        setVideoPanel(null);
      } else {
        alert(response.data?.error || 'Failed to generate video');
      }
    } catch (err) {
      alert(err.message);
    }
    setVideoGenerating(false);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Admin · Private</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Content Studio</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            AI-powered content production. Research-verified social content, HeyGen video generation, and full pipeline tracking.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setAiPanel(!aiPanel)} className="gap-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30">
            <Sparkles className="w-4 h-4" /> AI Generate
          </Button>
          <Button onClick={() => { setEditing('new'); setForm({ ...EMPTY_FORM, content_type: activeTab }); }} className="gap-2">
            <Plus className="w-4 h-4" /> New
          </Button>
        </div>
      </div>

      {/* AI Generation Panel */}
      {aiPanel && (
        <div className="p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" /> AI Content Generation
            </h3>
            <button onClick={() => setAiPanel(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <p className="text-xs text-muted-foreground">
            Uses the <code className="text-purple-300">literature_researcher</code> agent to find credible, web-researched facts and generates social content citing real sources. Content is saved to the approval pipeline.
          </p>
          <form onSubmit={handleAIGenerate} className="space-y-3">
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Topic</label>
              <Input value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="e.g. The mental health benefits of music for grief processing" className="bg-secondary/50" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Content Type</label>
                <select value={aiContentType} onChange={e => setAiContentType(e.target.value)} className="w-full bg-secondary/50 border border-border/40 rounded-md px-3 py-2 text-sm">
                  <option value="caption">Caption</option>
                  <option value="hook">Hook</option>
                  <option value="reel">Reel Script</option>
                  <option value="lyric_quote_post">Lyric Quote Post</option>
                  <option value="behind_song_post">Behind the Song Post</option>
                  <option value="press_snippet">Press Snippet</option>
                  <option value="newsletter_draft">Newsletter Draft</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Tone (optional)</label>
                <Input value={aiTone} onChange={e => setAiTone(e.target.value)} placeholder="e.g. warm, empathetic, credible" className="bg-secondary/50" />
              </div>
            </div>
            <Button type="submit" disabled={aiGenerating} className="gap-2 bg-purple-500/30 hover:bg-purple-500/40">
              {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {aiGenerating ? 'Researching & Generating...' : 'Generate with Credible Research'}
            </Button>
          </form>

          {/* AI Result */}
          {aiResult && !aiResult.error && (
            <div className="space-y-3 mt-4 p-4 rounded-lg border border-purple-500/20 bg-card">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-foreground">Content Generated & Saved to Pipeline</span>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Generated Content:</p>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{aiResult.content}</p>
              </div>
              {aiResult.hashtags && aiResult.hashtags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-xs text-muted-foreground">Hashtags:</span>
                  {aiResult.hashtags.map((h, i) => <span key={i} className="text-xs text-blue-400">{h} </span>)}
                </div>
              )}
              {aiResult.sources && aiResult.sources.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-semibold">Credible Sources Used:</p>
                  {aiResult.sources.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-blue-400/70">
                      <Bot className="w-3 h-3 shrink-0" /> {s}
                    </div>
                  ))}
                </div>
              )}
              {aiResult.research_facts && aiResult.research_facts.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-semibold">Research Facts:</p>
                  {aiResult.research_facts.slice(0, 3).map((f, i) => (
                    <div key={i} className="text-xs text-muted-foreground/70 bg-secondary/20 rounded p-2">
                      <p className="text-foreground/80">{f.claim}</p>
                      <p className="text-blue-400/50 mt-0.5">Source: {f.source} {f.date && `(${f.date})`}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {aiResult?.error && (
            <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm text-red-400">
              ⚠ {aiResult.error}
            </div>
          )}
        </div>
      )}

      {/* Pending approval banner */}
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
          <div className="flex gap-2">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="gap-2">
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Record'}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm(EMPTY_FORM); }}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Content list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground text-center py-12">No {CONTENT_TYPES.find(t => t.value === activeTab)?.label.toLowerCase()} yet. Click "AI Generate" or "New" to create one.</p>
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
                  {record.approval_status === 'approved' && (record.caption || record.hook) && (
                    <button
                      onClick={() => setVideoPanel(videoPanel === record.id ? null : record.id)}
                      className="p-1.5 rounded hover:bg-secondary text-purple-400"
                      title="Generate HeyGen Video"
                    >
                      <Video className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => handleEdit(record)} className="p-1.5 rounded hover:bg-secondary"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  <button onClick={() => deleteMutation.mutate(record.id)} className="p-1.5 rounded hover:bg-secondary"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                </div>
              </div>

              {/* HeyGen video generation panel */}
              {videoPanel === record.id && (
                <div className="mt-3 p-3 rounded-lg border border-purple-500/20 bg-purple-500/5 space-y-2">
                  <p className="text-xs font-semibold text-purple-300 flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> Generate HeyGen Video from this content</p>
                  <p className="text-[10px] text-muted-foreground">Script preview: {(record.caption || record.hook || '').slice(0, 100)}...</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={videoForm.avatar_id} onChange={e => setVideoForm(f => ({ ...f, avatar_id: e.target.value }))} placeholder="HeyGen Avatar ID" className="bg-secondary/50 font-mono text-xs" />
                    <Input value={videoForm.voice_id} onChange={e => setVideoForm(f => ({ ...f, voice_id: e.target.value }))} placeholder="HeyGen Voice ID" className="bg-secondary/50 font-mono text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select value={videoForm.engine} onChange={e => setVideoForm(f => ({ ...f, engine: e.target.value }))} className="bg-secondary/50 border border-border/40 rounded-md px-2 py-1.5 text-xs">
                      <option value="avatar_iv">Avatar IV (Standard)</option>
                      <option value="avatar_v">Avatar V (High Quality)</option>
                    </select>
                    <select value={videoForm.aspect_ratio} onChange={e => setVideoForm(f => ({ ...f, aspect_ratio: e.target.value }))} className="bg-secondary/50 border border-border/40 rounded-md px-2 py-1.5 text-xs">
                      <option value="9:16">9:16 (Reels)</option>
                      <option value="16:9">16:9 (Horizontal)</option>
                      <option value="1:1">1:1 (Square)</option>
                    </select>
                  </div>
                  <Button size="sm" disabled={videoGenerating || !videoForm.avatar_id || !videoForm.voice_id} onClick={() => handleVideoGenerate(record)} className="gap-2 bg-purple-500/30 hover:bg-purple-500/40">
                    {videoGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Film className="w-3.5 h-3.5" />}
                    {videoGenerating ? 'Starting...' : 'Generate Video'}
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Recent production jobs */}
      {productionJobs.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-400" /> Recent Video Productions
          </h2>
          <div className="space-y-2">
            {productionJobs.slice(0, 5).map(job => (
              <div key={job.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-card/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{job.title}</p>
                  <p className="text-[10px] text-muted-foreground">{job.status} · {job.heygen_engine || 'avatar'}</p>
                </div>
                {job.video_url && job.status === 'completed' && (
                  <a href={job.video_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <ExternalLink className="w-3 h-3" /> View
                  </a>
                )}
                <a href="/admin/production-tracker" className="text-xs text-muted-foreground hover:text-primary">Tracker →</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}