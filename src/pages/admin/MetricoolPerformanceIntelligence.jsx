import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { BarChart2, RefreshCw, TrendingUp, Download, Zap } from 'lucide-react';

const PLATFORMS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'twitter', label: 'X / Twitter' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'youtube', label: 'YouTube' },
];

export default function MetricoolPerformanceIntelligence() {
  const { toast } = useToast();
  const [platform, setPlatform] = useState('instagram');
  const [startDate, setStartDate] = useState('2026-05-26');
  const [endDate, setEndDate] = useState('2026-06-10');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const { data: memories = [] } = useQuery({
    queryKey: ['mc-perf-memories'],
    queryFn: () => base44.entities.MusicAgentMemory.filter({ agent_name: 'Content Performance Agent' }, '-created_date', 20),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['mc-perf-posts'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ campaign: 'thank_you_june5_sprint', status: 'posted' }, 'sprint_day', 200),
  });

  const importMetrics = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke('metricoolImportMetrics', {
        platform,
        start_date: startDate,
        end_date: endDate,
      });
      setResult(res.data);
      toast({ title: res.data?.success ? `Metrics imported for ${platform} ✓` : res.data?.error });
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      setResult({ success: false, error: msg });
      toast({ title: `Import failed: ${msg}`, variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Metricool Integration</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Performance Intelligence</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Import live metrics from Metricool API · AI analysis → agent memory</p>
      </div>

      {/* Source chain */}
      <div className="text-[10px] font-body text-muted-foreground bg-secondary/20 rounded-lg px-3 py-2 flex flex-wrap gap-1">
        {['SocialAsset', '→', 'ContentCalendarPost', '→', 'QualityReview', '→', 'ApprovalQueue', '→', 'MetricoolSchedulerQueue', '→', 'Metricool', '→', 'ContentPerformance'].map((s, i) => (
          <span key={i} className={s === '→' ? 'text-border' : s === 'ContentPerformance' ? 'text-primary font-semibold' : ''}>{s}</span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Posted Content', value: posts.length, color: 'text-primary' },
          { label: 'Metrics Logged', value: posts.filter(p => p.performance_metrics).length, color: 'text-green-400' },
          { label: 'Agent Learnings', value: memories.length, color: 'text-purple-400' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Import panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Download className="w-4 h-4 text-primary" /> Import Metrics from Metricool API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Platform</Label>
            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map(p => (
                <button key={p.key} onClick={() => setPlatform(p.key)}
                  className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${platform === p.key ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Start Date</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-secondary/50 border-border/40 text-sm" />
            </div>
            <div>
              <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">End Date</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-secondary/50 border-border/40 text-sm" />
            </div>
          </div>

          <Button onClick={importMetrics} disabled={loading} className="gradient-gold-button border-0 gap-2">
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Importing...</> : <><Zap className="w-4 h-4" /> Import Metrics</>}
          </Button>

          {result && (
            <div className={`rounded-xl border p-4 space-y-3 ${result.success ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
              {result.success ? (
                <>
                  <p className="font-body text-sm text-green-400 font-semibold">✓ Metrics imported — {result.platform} · {result.period?.start_date} → {result.period?.end_date}</p>
                  {result.metrics && (
                    <div className="bg-secondary/30 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-foreground mb-2">Raw Metricool Data:</p>
                      <pre className="font-mono text-xs text-foreground/70 overflow-x-auto whitespace-pre-wrap max-h-48">
                        {JSON.stringify(result.metrics, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                <p className="font-body text-sm text-red-400">{result.error}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Posted content list */}
      {posts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><BarChart2 className="w-4 h-4 text-primary" /> Posted Content — Metrics Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {posts.map(post => {
              const hasMetrics = post.performance_metrics && Object.keys(post.performance_metrics).length > 0;
              return (
                <div key={post.id} className="flex items-center gap-3 p-3 border border-border/30 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs font-semibold text-foreground">Day {post.sprint_day} · {post.platform} · {post.scheduled_date}</p>
                    <p className="font-body text-xs text-muted-foreground line-clamp-1 mt-0.5">{post.hook || post.caption?.slice(0, 60) || '—'}</p>
                    {hasMetrics && (
                      <div className="flex gap-3 mt-1 flex-wrap">
                        {['views', 'likes', 'shares'].map(k => post.performance_metrics[k] != null && (
                          <span key={k} className="font-body text-[10px] text-muted-foreground">{k}: <strong className="text-foreground">{post.performance_metrics[k].toLocaleString()}</strong></span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Badge className={`border-0 text-[9px] uppercase ${hasMetrics ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {hasMetrics ? 'Logged' : 'Pending'}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Agent learnings */}
      {memories.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-purple-400" /> Agent Learnings from Metricool Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {memories.slice(0, 8).map(m => (
              <div key={m.id} className="p-3 bg-secondary/30 rounded-lg border border-border/30">
                <p className="font-body text-xs text-foreground/80 leading-relaxed">{m.summary}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-body text-[10px] text-muted-foreground">{new Date(m.created_date).toLocaleDateString('en-AU')}</span>
                  {m.tags?.map(t => <Badge key={t} className="bg-secondary text-muted-foreground border-0 text-[9px]">{t}</Badge>)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}