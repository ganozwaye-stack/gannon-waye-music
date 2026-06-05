import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Film, Copy, RefreshCw, AlertTriangle } from 'lucide-react';

export default function VideoAgentCommand() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState('analyse');
  const [form, setForm] = useState({ transcript: '', timestamp_notes: '', video_context: '', platform: 'tiktok' });
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const { data: messages = [] } = useQuery({
    queryKey: ['video-messages'],
    queryFn: () => base44.entities.AgentMessage.filter({ message_type: 'video_task' }, '-created_date', 20),
  });

  const copy = t => { navigator.clipboard.writeText(t); toast({ title: 'Copied!' }); };

  const runAnalysis = async () => {
    if (!form.transcript && !form.timestamp_notes) {
      toast({ title: 'Paste transcript or timestamp notes first', variant: 'destructive' });
      return;
    }
    setRunning(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke('openAIVideoAssistant', form);
      setResult(res.data);
      qc.invalidateQueries({ queryKey: ['video-messages'] });
      toast({ title: '✅ Video analysis complete — review and approve output' });
    } catch (err) {
      toast({ title: err?.response?.data?.error || 'Analysis failed', variant: 'destructive' });
    }
    setRunning(false);
  };

  const TABS = [
    { id: 'analyse', label: '🎬 Analyse Video' },
    { id: 'capcut', label: 'CapCut Builder' },
    { id: 'history', label: `History (${messages.length})` },
    { id: 'phase', label: 'Phase 1 Info' },
  ];

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center gap-3 flex-wrap">
        <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Video Agent Command</h1>
          <p className="text-sm text-muted-foreground mt-1">Phase 1 · Hook detection · CapCut prompts · No auto-upload</p>
        </div>
      </div>

      {/* Phase 1 banner */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0" />
          <p className="text-xs text-blue-300">Phase 1 only — transcript analysis, hook detection, CapCut instructions. No automatic TikTok upload. All output requires approval.</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <Button key={t.id} variant={tab === t.id ? 'default' : 'outline'} size="sm" onClick={() => setTab(t.id)}>{t.label}</Button>
        ))}
      </div>

      {tab === 'analyse' && (
        <div className="space-y-4">
          {result?.analysis ? (
            <div className="space-y-3">
              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-green-300">Video Analysis — Awaiting Approval</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-xs">
                  {[
                    ['Best Hook Moment', result.analysis.best_hook_moment],
                    ['Hook Text', result.analysis.hook_text],
                    ['Hook Type', result.analysis.hook_type],
                    ['Caption', result.analysis.caption],
                    ['Thumbnail Idea', result.analysis.thumbnail_idea],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <div key={label}>
                      <p className="text-muted-foreground font-medium mb-1">{label}</p>
                      <div className="flex items-start gap-2">
                        <p className="flex-1 bg-secondary/30 p-2 rounded">{value}</p>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => copy(value)}><Copy className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  ))}
                  {result.analysis.clip_ideas?.length > 0 && (
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">Clip Ideas</p>
                      {result.analysis.clip_ideas.map((c, i) => <p key={i} className="bg-secondary/30 p-2 rounded mb-1">{c}</p>)}
                    </div>
                  )}
                  {result.analysis.capcut_prompt && (
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">CapCut Prompt</p>
                      <div className="flex items-start gap-2">
                        <p className="flex-1 bg-secondary/30 p-2 rounded font-mono">{result.analysis.capcut_prompt}</p>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => copy(result.analysis.capcut_prompt)}><Copy className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  )}
                  <p className="text-muted-foreground">Tokens: {result.tokens_used} · Approval required before use</p>
                </CardContent>
              </Card>
              <Button variant="outline" size="sm" onClick={() => setResult(null)}>Analyse Another</Button>
            </div>
          ) : (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Video Analysis — Phase 1</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Platform</label>
                  <select value={form.platform} onChange={e => setForm(f => ({...f, platform: e.target.value}))}
                    className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground">
                    {['tiktok','instagram','youtube_shorts','facebook'].map(p => <option key={p} value={p}>{p.replace('_',' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Video context</label>
                  <input value={form.video_context} onChange={e => setForm(f => ({...f, video_context: e.target.value}))}
                    placeholder="e.g. Behind-scenes recording session, Thank You track"
                    className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Transcript (paste from auto-captions or manual)</label>
                  <textarea value={form.transcript} onChange={e => setForm(f => ({...f, transcript: e.target.value}))} rows={5}
                    placeholder="Paste video transcript here..."
                    className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-xs font-mono text-foreground" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Or — manual timestamp notes</label>
                  <textarea value={form.timestamp_notes} onChange={e => setForm(f => ({...f, timestamp_notes: e.target.value}))} rows={3}
                    placeholder="0:00 — intro talking&#10;0:45 — emotional moment about the song&#10;1:20 — play guitar riff"
                    className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-xs font-mono text-foreground" />
                </div>
                <Button onClick={runAnalysis} disabled={running} className="w-full">
                  {running ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Analysing...</> : <><Film className="w-4 h-4 mr-2" />Detect Hooks + Generate CapCut Prompts (~$0.001)</>}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {tab === 'capcut' && (
        <div className="space-y-3">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <p className="font-semibold text-primary text-sm mb-2">CapCut Prompt Templates</p>
              {[
                { label: 'Emotional reveal cut', prompt: 'Start with blurred/dark frame → cut to sharp close-up at emotional peak → slow-motion 50% → text overlay: quote from hook → fade to black with title card' },
                { label: 'Music sync edit', prompt: 'Cut on every beat drop → zoom-in on lyric words → colour grade: warm gold tones → add grain texture 20% → end with logo/watermark fade' },
                { label: 'Behind-scenes style', prompt: 'Handheld shaky start → smooth out mid-clip → multiple angle cuts every 2s → add authentic caption text → no heavy filters, keep raw' },
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
          ) : messages.map(m => (
            <Card key={m.id} className="border-border/30">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{m.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.summary?.substring(0, 100)}</p>
                  </div>
                  <Badge className={m.status === 'resolved' ? 'bg-green-500/20 text-green-300 text-xs' : 'bg-amber-500/20 text-amber-300 text-xs'} variant="outline">{m.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'phase' && (
        <div className="space-y-3">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Phase 1 Capabilities</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[
                ['✅ Transcript input', 'Paste any video transcript or auto-captions'],
                ['✅ Manual timestamp notes', 'Describe moments by timestamp'],
                ['✅ Hook detection', 'AI finds strongest emotional opening moments'],
                ['✅ CapCut instructions', 'Specific edit instructions for CapCut'],
                ['✅ Caption generation', 'Platform-optimised post captions'],
                ['✅ Thumbnail ideas', 'Visual concept for thumbnail'],
                ['✅ Clip ideas', 'Which sections to cut and why'],
                ['✅ Emotional moment mapping', 'Identify peak emotional moments'],
                ['❌ Auto video editing', 'Phase 2 — not yet'],
                ['❌ Auto TikTok upload', 'Requires TikTok OAuth + approval — not yet'],
                ['❌ Auto caption burn-in', 'Phase 2 — not yet'],
              ].map(([label, desc]) => (
                <div key={label} className="flex items-start gap-2 p-2 border border-border/20 rounded">
                  <span className="shrink-0 font-mono">{label.substring(0, 1)}</span>
                  <div>
                    <span className="font-medium">{label.substring(2)}</span>
                    <span className="text-muted-foreground"> — {desc}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}