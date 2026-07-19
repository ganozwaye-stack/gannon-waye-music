import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, AlertTriangle, Copy, Film, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const DRIVE_INTAKE_ROOT = 'G:\\My Drive\\Gannon Waye Music\\Content Production';

const BRAND_EDIT_PRESETS = [
  {
    id: 'raw_truth',
    name: 'Raw Truth',
    use: 'Talking-head grief, resilience, behind-the-song, coaching draft content.',
    grade: 'Natural skin, mild warmth, contrast +8, saturation -4, grain 8-12%.',
    rhythm: 'Keep pauses. Cut only dead air, false starts, and repeated sentences.',
    text: 'Cream/gold captions, sentence case, 2 lines max, no gimmick bounce.',
  },
  {
    id: 'black_gold_merch',
    name: 'Black Gold Merch',
    use: 'THANKYOU merch, product demos, bundle offers, store CTAs.',
    grade: 'Black/gold cinematic contrast, warm highlights, product kept sharp.',
    rhythm: 'Fast product reveals every 1.5-2.5s, beat-synced cuts, final CTA card.',
    text: 'Bold gold product names, price cards only when current and approved.',
  },
  {
    id: 'memorial_garden',
    name: 'Memorial Garden',
    use: "Without You Here, Mum's Garden, Sonia memorial content.",
    grade: 'Soft garden warmth, low contrast, no harsh black funeral treatment.',
    rhythm: 'Slow, respectful, no jump scares, no aggressive zooms.',
    text: 'Minimal captions, lyric-led, no sales-forward overlays.',
  },
  {
    id: 'release_energy',
    name: 'Release Energy',
    use: 'TikTok/Reels/Shorts hooks, release push, fan engagement.',
    grade: 'Clean bright contrast, subtle gold lift, readable phone-first framing.',
    rhythm: 'Hook in first 1-2s, cut every 1-3s, pattern interrupt before second 5.',
    text: 'Strong hook text first, clear CTA last, no more than one idea per screen.',
  },
];

const DRIVE_FLOW = [
  ['00-Recordings Inbox', 'Save phone videos, screen recordings, voice notes and unedited takes here first.'],
  ['01-Raw Video To Process', 'Move only usable takes here after first review.'],
  ['02-Scripts Captions Hooks', 'Store transcript, hooks, captions, CTA and first comment drafts.'],
  ['03-Edited Drafts', 'Edited but not approved exports from CapCut, HeyGen or other editors.'],
  ['04-Approval Queue', 'Final draft package waiting for Gannon approval.'],
  ['05-Approved To Schedule', 'Approved video, caption, hashtags, first comment and link.'],
  ['06-Scheduled In Metricool', 'Scheduled items. Still tracked until confirmed live.'],
  ['07-Posted Archive', 'Final posted media and exact published copy.'],
];

const PLATFORM_TO_CALENDAR = {
  tiktok: 'tiktok',
  instagram: 'instagram_reels',
  facebook: 'facebook',
  youtube_shorts: 'youtube_shorts',
};

export default function VideoAgentCommand() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState('analyse');
  const [form, setForm] = useState({
    transcript: '',
    timestamp_notes: '',
    video_context: '',
    platform: 'tiktok',
    editing_preset: 'raw_truth',
  });
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [queueing, setQueueing] = useState(false);

  const { data: messages = [] } = useQuery({
    queryKey: ['video-messages'],
    queryFn: () => base44.entities.AgentMessage.filter({ message_type: 'video_task' }, '-created_date', 20),
  });

  const selectedPreset = BRAND_EDIT_PRESETS.find(p => p.id === form.editing_preset) || BRAND_EDIT_PRESETS[0];

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied' });
  };

  const setFormValue = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const runAnalysis = async () => {
    if (!form.transcript && !form.timestamp_notes) {
      toast({ title: 'Paste transcript or timestamp notes first', variant: 'destructive' });
      return;
    }

    setRunning(true);
    setResult(null);
    try {
      const presetContext = [
        `Editing preset: ${selectedPreset.name}`,
        `Use: ${selectedPreset.use}`,
        `Filter/grade: ${selectedPreset.grade}`,
        `Edit rhythm: ${selectedPreset.rhythm}`,
        `Caption/text style: ${selectedPreset.text}`,
      ].join('\n');

      const res = await base44.functions.invoke('openAIVideoAssistant', {
        ...form,
        video_context: `${form.video_context}\n\n${presetContext}`.trim(),
      });
      setResult(res.data);
      qc.invalidateQueries({ queryKey: ['video-messages'] });
      toast({ title: 'Video analysis complete - review before use' });
    } catch (err) {
      toast({ title: err?.response?.data?.error || 'Analysis failed', variant: 'destructive' });
    }
    setRunning(false);
  };

  const queueForApproval = async () => {
    if (!result?.analysis) {
      toast({ title: 'Analyse a video first', variant: 'destructive' });
      return;
    }

    setQueueing(true);
    try {
      const platform = PLATFORM_TO_CALENDAR[form.platform] || 'tiktok';
      const title = result.analysis.hook_text || result.analysis.best_hook_moment || `${selectedPreset.name} video draft`;
      const proposedOutput = [
        `# ${title}`,
        `Platform: ${platform}`,
        `Editing preset: ${selectedPreset.name}`,
        `Hook: ${result.analysis.hook_text || result.analysis.best_hook_moment || 'Needs hook approval'}`,
        `Caption: ${result.analysis.caption || 'Needs caption approval'}`,
        result.analysis.thumbnail_idea ? `Thumbnail: ${result.analysis.thumbnail_idea}` : null,
        result.analysis.capcut_prompt ? `CapCut prompt: ${result.analysis.capcut_prompt}` : null,
        Array.isArray(result.analysis.clip_ideas) && result.analysis.clip_ideas.length
          ? `Clip ideas:\n${result.analysis.clip_ideas.map((clip, index) => `${index + 1}. ${clip}`).join('\n')}`
          : null,
        'External action rule: approval only. This does not publish, schedule, spend, or upload publicly.',
      ].filter(Boolean).join('\n\n');

      const intake = await base44.entities.VideoIntakeItem.create({
        file_name: `manual-video-analysis-${new Date().toISOString().slice(0, 10)}`,
        drive_path: `${DRIVE_INTAKE_ROOT}\\04-Approval Queue`,
        source_type: 'other',
        campaign: 'thankyou_merch_push',
        platform_targets: [platform],
        editing_preset: form.editing_preset,
        status: 'approval_pending',
        transcript: form.transcript,
        hook: result.analysis.hook_text || result.analysis.best_hook_moment || '',
        caption: result.analysis.caption || '',
        capcut_prompt: result.analysis.capcut_prompt || '',
        thumbnail_brief: result.analysis.thumbnail_idea || '',
        safety_notes: 'Created from Video Agent Command. Requires Gannon approval before scheduling or upload.',
      });

      await base44.entities.ApprovalQueue.create({
        agent_name: 'scripting_caption_agent',
        action_title: `Approve video draft: ${title}`.slice(0, 180),
        action_description: `Review this ${platform} draft using the ${selectedPreset.name} editing preset. Approval moves it to the next workflow step only; it does not auto-post.`,
        risk_type: ['publishing', 'brand'],
        risk_level: selectedPreset.id === 'memorial_garden' ? 'high' : 'medium',
        status: 'pending',
        payload: {
          entity: 'ContentCalendarPost',
          action: 'create',
          data: {
            campaign: 'thankyou_merch_push',
            platform,
            content_type: selectedPreset.id === 'black_gold_merch' ? 'merch_cta' : 'video_hook',
            hook: result.analysis.hook_text || result.analysis.best_hook_moment || '',
            caption: result.analysis.caption || '',
            cta: selectedPreset.id === 'black_gold_merch' ? 'Shop the THANKYOU collection' : 'Listen, comment, join the list or visit the store',
            on_screen_text: result.analysis.hook_text || '',
            edit_rhythm: selectedPreset.rhythm,
            visual_brief: result.analysis.thumbnail_idea || selectedPreset.use,
            media_required: true,
            media_status: 'brief_written',
            metricool_ready: false,
            status: 'pending_approval',
            generated_by: 'VideoAgentCommand',
            source_chain: `VideoIntakeItem (${intake.id}) -> VideoAgentCommand -> ApprovalQueue`,
            content_notes: `Preset: ${selectedPreset.name}. CapCut: ${result.analysis.capcut_prompt || 'Needs edit prompt approval.'}`,
          },
        },
        proposed_output: proposedOutput,
        auto_eligible: false,
        tags: ['video', 'social', platform, form.editing_preset, 'approval_required'],
      });

      toast({ title: 'Draft sent to Approval Queue' });
      qc.invalidateQueries({ queryKey: ['video-messages'] });
    } catch (err) {
      toast({ title: err?.message || 'Could not create approval item', variant: 'destructive' });
    }
    setQueueing(false);
  };

  const tabs = [
    { id: 'analyse', label: 'Analyse Video' },
    { id: 'intake', label: 'Drive Intake' },
    { id: 'presets', label: 'Brand Filters' },
    { id: 'capcut', label: 'CapCut Builder' },
    { id: 'history', label: `History (${messages.length})` },
    { id: 'phase', label: 'Phase 1 Info' },
  ];

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center gap-3 flex-wrap">
        <Link to="/admin">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Video Agent Command</h1>
          <p className="text-sm text-muted-foreground mt-1">Hook detection, Drive intake, brand filters, CapCut prompts, approval-gated output</p>
        </div>
      </div>

      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0" />
          <p className="text-xs text-blue-300">
            Phase 1: transcript analysis, hook detection, brand editing presets and CapCut instructions. No public posting. No direct publish. Approval required.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {tabs.map(item => (
          <Button key={item.id} variant={tab === item.id ? 'default' : 'outline'} size="sm" onClick={() => setTab(item.id)}>
            {item.label}
          </Button>
        ))}
      </div>

      {tab === 'analyse' && (
        <div className="space-y-4">
          {result?.analysis ? (
            <div className="space-y-3">
              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-green-300">Video Analysis - Awaiting Approval</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-xs">
                  {[
                    ['Best Hook Moment', result.analysis.best_hook_moment],
                    ['Hook Text', result.analysis.hook_text],
                    ['Hook Type', result.analysis.hook_type],
                    ['Caption', result.analysis.caption],
                    ['Thumbnail Idea', result.analysis.thumbnail_idea],
                  ].filter(([, value]) => value).map(([label, value]) => (
                    <div key={label}>
                      <p className="text-muted-foreground font-medium mb-1">{label}</p>
                      <div className="flex items-start gap-2">
                        <p className="flex-1 bg-secondary/30 p-2 rounded">{value}</p>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => copy(value)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {result.analysis.clip_ideas?.length > 0 && (
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">Clip Ideas</p>
                      {result.analysis.clip_ideas.map((clip, index) => <p key={index} className="bg-secondary/30 p-2 rounded mb-1">{clip}</p>)}
                    </div>
                  )}
                  {result.analysis.capcut_prompt && (
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">CapCut Prompt</p>
                      <div className="flex items-start gap-2">
                        <p className="flex-1 bg-secondary/30 p-2 rounded font-mono">{result.analysis.capcut_prompt}</p>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => copy(result.analysis.capcut_prompt)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  <p className="text-muted-foreground">Tokens: {result.tokens_used} - approval required before use</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={queueForApproval} disabled={queueing}>
                      {queueing ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Queueing...</> : 'Send to Approval Queue'}
                    </Button>
                    <Link to="/admin/approval-queue?tab=pending">
                      <Button size="sm" variant="outline">Open Approval Queue</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Button variant="outline" size="sm" onClick={() => setResult(null)}>Analyse Another</Button>
            </div>
          ) : (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Video Analysis</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Platform</label>
                  <select value={form.platform} onChange={event => setFormValue('platform', event.target.value)}
                    className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground">
                    {['tiktok', 'instagram', 'youtube_shorts', 'facebook'].map(platform => (
                      <option key={platform} value={platform}>{platform.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Brand editing preset</label>
                  <select value={form.editing_preset} onChange={event => setFormValue('editing_preset', event.target.value)}
                    className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground">
                    {BRAND_EDIT_PRESETS.map(preset => <option key={preset.id} value={preset.id}>{preset.name}</option>)}
                  </select>
                  <div className="mt-2 rounded-lg border border-primary/20 bg-primary/5 p-2 text-xs text-muted-foreground">
                    <p className="font-semibold text-primary">{selectedPreset.name}</p>
                    <p className="mt-1">{selectedPreset.use}</p>
                    <p className="mt-1">Grade: {selectedPreset.grade}</p>
                    <p className="mt-1">Rhythm: {selectedPreset.rhythm}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Video context</label>
                  <input value={form.video_context} onChange={event => setFormValue('video_context', event.target.value)}
                    placeholder="e.g. Behind-scenes recording session, THANKYOU merch, Without You Here story"
                    className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground" />
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Transcript</label>
                  <textarea value={form.transcript} onChange={event => setFormValue('transcript', event.target.value)} rows={5}
                    placeholder="Paste video transcript or auto-captions here..."
                    className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-xs font-mono text-foreground" />
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Manual timestamp notes</label>
                  <textarea value={form.timestamp_notes} onChange={event => setFormValue('timestamp_notes', event.target.value)} rows={3}
                    placeholder={'0:00 - intro talking\n0:45 - emotional moment about the song\n1:20 - product close-up or guitar riff'}
                    className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-xs font-mono text-foreground" />
                </div>

                <Button onClick={runAnalysis} disabled={running} className="w-full">
                  {running ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Analysing...</> : <><Film className="w-4 h-4 mr-2" />Detect Hooks + Generate Branded Edit Prompt</>}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {tab === 'intake' && (
        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Google Drive Source of Truth</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-lg border border-border/40 bg-background/40 p-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Save raw videos here first</p>
                <p className="mt-1 font-mono text-xs text-primary">{DRIVE_INTAKE_ROOT}\\00-Recordings Inbox</p>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {DRIVE_FLOW.map(([folder, note]) => (
                  <div key={folder} className="rounded-lg border border-border/30 bg-secondary/20 p-3">
                    <p className="font-mono text-xs text-foreground">{folder}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{note}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100/80">
                Live Drive watching still needs the Google Drive integration connected in production. Until then, this folder is the manual source of truth and every file still goes through approval.
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'presets' && (
        <div className="grid gap-3 md:grid-cols-2">
          {BRAND_EDIT_PRESETS.map(preset => (
            <Card key={preset.id} className="border-border/40">
              <CardHeader className="pb-2"><CardTitle className="text-sm">{preset.name}</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p><strong className="text-foreground">Use:</strong> {preset.use}</p>
                <p><strong className="text-foreground">Filter/grade:</strong> {preset.grade}</p>
                <p><strong className="text-foreground">Edit rhythm:</strong> {preset.rhythm}</p>
                <p><strong className="text-foreground">Text:</strong> {preset.text}</p>
                <Button variant="outline" size="sm" className="mt-2 h-7 text-xs" onClick={() => {
                  setFormValue('editing_preset', preset.id);
                  setTab('analyse');
                }}>
                  Use preset
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'capcut' && (
        <div className="space-y-3">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <p className="font-semibold text-primary text-sm mb-2">CapCut Prompt Templates</p>
              {[
                { label: 'Raw Truth', prompt: 'Natural skin tone, mild warmth, grain 10%, cream/gold captions, cut only dead air, keep honest pauses, no heavy transitions.' },
                { label: 'Black Gold Merch', prompt: 'Black/gold grade, sharp product close-ups, beat-synced cuts every 1.5-2.5s, gold price card only if approved, final store CTA.' },
                { label: 'Memorial Garden', prompt: 'Soft warm grade, gentle fade transitions, low contrast, lyric-led captions, no harsh black treatment, no sales-forward overlays.' },
                { label: 'Release Energy', prompt: 'Hook text in first second, clear phone framing, subtle gold lift, fast pattern interrupt before 5s, final CTA to stream/comment/shop.' },
              ].map(({ label, prompt }) => (
                <div key={label} className="border border-border/30 rounded-lg p-3 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold">{label}</p>
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => copy(prompt)}>Copy</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{prompt}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-2">
          {messages.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No video analysis tasks yet.</CardContent></Card>
          ) : messages.map(message => (
            <Card key={message.id} className="border-border/30">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{message.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{message.summary?.substring(0, 100)}</p>
                  </div>
                  <Badge className={message.status === 'resolved' ? 'bg-green-500/20 text-green-300 text-xs' : 'bg-amber-500/20 text-amber-300 text-xs'} variant="outline">
                    {message.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'phase' && (
        <div className="space-y-3">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Current Capabilities</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[
                ['Yes', 'Transcript input - paste any transcript or auto-captions'],
                ['Yes', 'Manual timestamp notes - describe moments by timestamp'],
                ['Yes', 'Hook detection - finds strongest emotional opening moments'],
                ['Yes', 'Brand presets - Raw Truth, Black Gold Merch, Memorial Garden, Release Energy'],
                ['Yes', 'CapCut instructions - specific edit instructions for the chosen preset'],
                ['Yes', 'Caption generation - platform-optimised post captions'],
                ['Blocked', 'Auto public posting - blocked by approval gates'],
                ['Blocked', 'TikTok direct publish - draft/inbox upload only after approval'],
                ['Later', 'Auto caption burn-in - needs CapCut/render integration'],
              ].map(([status, desc]) => (
                <div key={desc} className="flex items-start gap-2 p-2 border border-border/20 rounded">
                  <span className={status === 'Yes' ? 'text-green-400' : status === 'Blocked' ? 'text-red-400' : 'text-yellow-400'}>{status}</span>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
