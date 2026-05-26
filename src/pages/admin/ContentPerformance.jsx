import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { TrendingUp, Star, CheckCircle2, RefreshCw, Zap, BarChart2, ChevronRight, X } from 'lucide-react';

const PLATFORM_META = {
  tiktok: { label: 'TikTok', color: 'text-red-400' },
  instagram_reels: { label: 'IG Reels', color: 'text-pink-400' },
  instagram_stories: { label: 'IG Stories', color: 'text-purple-400' },
  twitter_x: { label: 'X', color: 'text-sky-400' },
};

const METRICS_FIELDS = [
  { key: 'views', label: 'Views' },
  { key: 'likes', label: 'Likes' },
  { key: 'comments', label: 'Comments' },
  { key: 'shares', label: 'Shares' },
  { key: 'saves', label: 'Saves' },
  { key: 'reach', label: 'Reach' },
  { key: 'profile_visits', label: 'Profile Visits' },
  { key: 'follows_gained', label: 'Follows Gained' },
];

function LogMetricsModal({ post, onClose, onSave }) {
  const [metrics, setMetrics] = useState({
    views: '', likes: '', comments: '', shares: '', saves: '', reach: '', profile_visits: '', follows_gained: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const { toast } = useToast();

  const handleSave = async () => {
    const numMetrics = Object.fromEntries(
      Object.entries(metrics).filter(([, v]) => v !== '').map(([k, v]) => [k, Number(v)])
    );
    await onSave(post.id, { performance_metrics: numMetrics });
    if (Object.values(numMetrics).some(v => v > 0)) {
      await runAnalysis(numMetrics);
    }
    onClose();
  };

  const runAnalysis = async (numMetrics) => {
    setAnalyzing(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse these social media performance metrics for a Gannon Waye post (Australian indie singer-songwriter, "Thank You" release sprint).

Platform: ${PLATFORM_META[post.platform]?.label || post.platform}
Post hook: "${post.hook || post.caption?.slice(0, 100) || 'N/A'}"
Sprint day: ${post.sprint_day}

Metrics: ${JSON.stringify(numMetrics)}

Provide:
- performance_grade: A/B/C/D/F
- top_insight: The single most important insight from these numbers (1 sentence)
- what_worked: What drove engagement (1-2 sentences)
- what_to_replicate: Specific element to repeat (1 sentence)
- what_to_avoid: Specific element to drop or change (1 sentence)
- audience_signal: What these numbers tell us about the audience (1 sentence)`,
        response_json_schema: {
          type: 'object',
          properties: {
            performance_grade: { type: 'string' },
            top_insight: { type: 'string' },
            what_worked: { type: 'string' },
            what_to_replicate: { type: 'string' },
            what_to_avoid: { type: 'string' },
            audience_signal: { type: 'string' },
          }
        }
      });
      setAnalysis(res);
      // Save to MusicAgentMemory
      await base44.entities.MusicAgentMemory.create({
        agent_name: 'Content Performance Agent',
        memory_type: 'successful_release',
        summary: `Day ${post.sprint_day} ${PLATFORM_META[post.platform]?.label || post.platform}: ${res.top_insight}. Grade: ${res.performance_grade}. What worked: ${res.what_worked}`,
        importance_score: res.performance_grade === 'A' ? 9 : res.performance_grade === 'B' ? 7 : 5,
        confidence_score: 8,
        source: 'ContentPerformanceAgent',
        tags: [post.platform, `sprint_day_${post.sprint_day}`, 'performance'],
      });
    } catch (e) {
      toast({ title: 'Analysis failed', variant: 'destructive' });
    }
    setAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl max-w-lg w-full my-8 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <p className="font-body text-xs text-muted-foreground">{PLATFORM_META[post.platform]?.label} · Day {post.sprint_day}</p>
            <h3 className="font-display text-lg text-foreground line-clamp-1">{post.hook || post.caption?.slice(0, 60) || '—'}</h3>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {METRICS_FIELDS.map(f => (
              <div key={f.key}>
                <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">{f.label}</Label>
                <Input type="number" min="0" value={metrics[f.key]} onChange={e => setMetrics(m => ({ ...m, [f.key]: e.target.value }))}
                  placeholder="0" className="bg-secondary/50 border-border/40 text-sm" />
              </div>
            ))}
          </div>

          {analysis && (
            <div className="bg-secondary/30 border border-border/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={`text-sm font-bold border-0 ${analysis.performance_grade === 'A' ? 'bg-green-500/20 text-green-400' : analysis.performance_grade === 'B' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  Grade: {analysis.performance_grade}
                </Badge>
              </div>
              {[
                { label: 'Top Insight', val: analysis.top_insight },
                { label: 'What Worked', val: analysis.what_worked },
                { label: 'Replicate', val: analysis.what_to_replicate },
                { label: 'Avoid Next Time', val: analysis.what_to_avoid },
                { label: 'Audience Signal', val: analysis.audience_signal },
              ].map(r => r.val && (
                <div key={r.label}>
                  <p className="font-body text-[10px] tracking-wider uppercase text-muted-foreground">{r.label}</p>
                  <p className="font-body text-xs text-foreground/80 leading-relaxed">{r.val}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={analyzing} className="flex-1 gradient-gold-button border-0 gap-2">
              {analyzing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analysing...</> : <><CheckCircle2 className="w-4 h-4" /> Save Metrics</>}
            </Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContentPerformance() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);

  const { data: posts = [] } = useQuery({
    queryKey: ['perf-posts'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ campaign: 'thank_you_june5_sprint', status: 'posted' }, 'sprint_day', 200),
  });

  const { data: memories = [] } = useQuery({
    queryKey: ['perf-memories'],
    queryFn: () => base44.entities.MusicAgentMemory.filter({ agent_name: 'Content Performance Agent' }, '-created_date', 20),
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ContentCalendarPost.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['perf-posts'] }); toast({ title: 'Metrics saved ✓' }); }
  });

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Release Sprint</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Content Performance</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Log live post metrics · AI analysis → agent memory → future content improves automatically</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Posted', value: posts.length, color: 'text-primary' },
          { label: 'Metrics Logged', value: posts.filter(p => p.performance_metrics).length, color: 'text-green-400' },
          { label: 'Learnings Saved', value: memories.length, color: 'text-purple-400' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </CardContent></Card>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-xl">
          <BarChart2 className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">No posted content yet. Mark posts as "Posted" in the Schedule Queue first.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => {
            const pm = PLATFORM_META[post.platform] || { label: post.platform, color: 'text-foreground' };
            const hasMetrics = post.performance_metrics && Object.keys(post.performance_metrics).length > 0;
            return (
              <button
                key={post.id}
                onClick={() => setSelected(post)}
                className="w-full text-left flex items-start gap-3 p-4 border border-border/40 rounded-xl hover:border-primary/40 hover:bg-secondary/20 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`font-body text-xs font-semibold ${pm.color}`}>{pm.label}</span>
                    <span className="font-body text-xs text-muted-foreground">· Day {post.sprint_day} · {post.scheduled_date}</span>
                  </div>
                  <p className="font-body text-sm text-foreground line-clamp-1">{post.hook || post.caption?.slice(0, 80) || '—'}</p>
                  {hasMetrics && (
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {['views', 'likes', 'shares'].map(k => post.performance_metrics[k] != null && (
                        <span key={k} className="font-body text-xs text-muted-foreground">{k}: <strong className="text-foreground">{post.performance_metrics[k].toLocaleString()}</strong></span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={`text-[9px] border-0 ${hasMetrics ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {hasMetrics ? 'Metrics Logged' : 'Log Metrics'}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {memories.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-purple-400" /> Agent Learnings from Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {memories.slice(0, 5).map(m => (
              <div key={m.id} className="p-3 bg-secondary/30 rounded-lg">
                <p className="font-body text-xs text-foreground/80 leading-relaxed">{m.summary}</p>
                <p className="font-body text-[10px] text-muted-foreground mt-1">{new Date(m.created_date).toLocaleDateString('en-AU')}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {selected && (
        <LogMetricsModal
          post={selected}
          onClose={() => setSelected(null)}
          onSave={(id, data) => update.mutateAsync({ id, data })}
        />
      )}
    </div>
  );
}