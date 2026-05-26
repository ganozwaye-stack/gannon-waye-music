import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, CheckCircle2, AlertTriangle, Send, RefreshCw, Lock, ChevronRight, X, Copy, Check } from 'lucide-react';

const PLATFORM_META = {
  tiktok: { label: 'TikTok', color: 'text-red-400', bg: 'bg-red-500/10' },
  instagram_reels: { label: 'IG Reels', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  instagram_stories: { label: 'IG Stories', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  instagram_feed: { label: 'IG Feed', color: 'text-purple-300', bg: 'bg-purple-500/10' },
  twitter_x: { label: 'X', color: 'text-sky-400', bg: 'bg-sky-500/10' },
  facebook: { label: 'Facebook', color: 'text-blue-400', bg: 'bg-blue-500/10' },
};

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
      {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function ScheduleModal({ post, onClose }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [datetime, setDatetime] = useState(`${post.scheduled_date || '2026-06-05'}T09:00`);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const schedule = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke('metricoolSchedulePost', {
        post_id: post.id,
        schedule_datetime: datetime,
      });
      setResult(res.data);
      qc.invalidateQueries({ queryKey: ['mc-sched-posts'] });
      toast({ title: res.data?.success ? `Scheduled to Metricool ✓` : res.data?.error });
      if (res.data?.success) setTimeout(onClose, 1500);
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      setResult({ success: false, error: msg });
      toast({ title: `Schedule failed: ${msg}`, variant: 'destructive' });
    }
    setLoading(false);
  };

  const pm = PLATFORM_META[post.platform] || { label: post.platform, color: 'text-foreground', bg: 'bg-secondary' };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl max-w-lg w-full my-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Badge className={`${pm.bg} ${pm.color} border-0 text-[9px] uppercase`}>{pm.label}</Badge>
              <span className="font-body text-xs text-muted-foreground">Day {post.sprint_day}</span>
            </div>
            <h3 className="font-display text-lg text-foreground line-clamp-1">{post.hook || post.caption?.slice(0, 60) || '—'}</h3>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Source chain */}
          <div className="text-[10px] font-body text-muted-foreground bg-secondary/20 rounded-lg px-3 py-2">
            SocialAsset → ContentCalendarPost → QualityReview → ApprovalQueue → <strong className="text-primary">MetricoolSchedulerQueue</strong> → Metricool → ContentPerformance
          </div>

          {/* Metricool export preview */}
          {post.metricool_export && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="font-body text-[10px] uppercase tracking-wider text-primary font-semibold">Metricool Caption Preview</p>
                <CopyBtn text={post.metricool_export} />
              </div>
              <p className="font-body text-xs text-foreground/70 whitespace-pre-wrap line-clamp-4">{post.metricool_export}</p>
            </div>
          )}

          <div>
            <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Schedule Date & Time</Label>
            <Input type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)} className="bg-secondary/50 border-border/40 text-sm" />
          </div>

          {result && (
            <div className={`rounded-lg border p-3 ${result.success ? 'border-green-500/40 bg-green-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
              {result.success ? (
                <>
                  <p className="font-body text-sm text-green-400 font-semibold">✓ Scheduled to Metricool</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">Metricool Post ID: <code className="font-mono text-primary">{result.metricool_post_id}</code></p>
                  <p className="font-body text-xs text-muted-foreground">Platform: {result.platform} · Time: {result.scheduled_at}</p>
                </>
              ) : (
                <p className="font-body text-sm text-red-400">{result.error}</p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={schedule} disabled={loading} className="flex-1 gradient-gold-button border-0 gap-2">
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Scheduling...</> : <><Send className="w-4 h-4" /> Send to Metricool API</>}
            </Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>

          <p className="font-body text-[10px] text-muted-foreground text-center">
            This post is approved — Metricool API will schedule it. Status updates to "scheduled" automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MetricoolSchedulerQueue() {
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('approved');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['mc-sched-posts'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ campaign: 'thank_you_june5_sprint' }, 'sprint_day', 200),
    refetchInterval: 30000,
  });

  const byStatus = {
    approved: posts.filter(p => p.status === 'approved'),
    scheduled: posts.filter(p => p.status === 'scheduled'),
    posted: posts.filter(p => p.status === 'posted'),
  };

  const filtered = byStatus[tab] || [];

  const byDate = filtered.reduce((acc, p) => {
    const d = p.scheduled_date || 'Unknown';
    if (!acc[d]) acc[d] = [];
    acc[d].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Metricool Integration</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Metricool Scheduler Queue</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Approved posts only · Send directly to Metricool API · No posts without approval</p>
      </div>

      {/* Hard gate notice */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-body text-sm text-green-400 font-semibold">Approval gate active</p>
          <p className="font-body text-xs text-muted-foreground mt-0.5">Only posts with status "approved" can be sent to Metricool. The backend enforces this — unapproved posts are rejected.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'approved', label: 'Ready to Schedule', color: 'text-green-400' },
          { key: 'scheduled', label: 'In Metricool', color: 'text-blue-400' },
          { key: 'posted', label: 'Posted Live', color: 'text-primary' },
        ].map(s => (
          <Card key={s.key} className={`cursor-pointer transition-all ${tab === s.key ? 'border-primary/60' : ''}`} onClick={() => setTab(s.key)}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold font-display ${s.color}`}>{byStatus[s.key]?.length || 0}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 flex-wrap">
        {['approved', 'scheduled', 'posted'].map(s => (
          <button key={s} onClick={() => setTab(s)}
            className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${tab === s ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)} ({byStatus[s]?.length || 0})
          </button>
        ))}
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-body text-sm">Loading...</div>
      ) : Object.keys(byDate).length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-xl">
          <Calendar className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">
            {tab === 'approved' ? 'No approved posts yet. Approve in the Approval Queue first.' : `No ${tab} posts.`}
          </p>
        </div>
      ) : (
        Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, datePosts]) => (
          <div key={date}>
            <p className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> {date}
            </p>
            <div className="space-y-2">
              {datePosts.map(post => {
                const pm = PLATFORM_META[post.platform] || { label: post.platform, color: 'text-foreground', bg: 'bg-secondary' };
                return (
                  <button
                    key={post.id}
                    onClick={() => tab === 'approved' ? setSelected(post) : null}
                    className={`w-full text-left flex items-start gap-3 p-4 border rounded-xl transition-all ${tab === 'approved' ? 'border-border/50 hover:border-primary/40 hover:bg-secondary/20 cursor-pointer' : 'border-border/30 cursor-default'}`}
                  >
                    <div className={`${pm.bg} px-2 py-1 rounded-md shrink-0 mt-0.5`}>
                      <span className={`font-body text-[10px] uppercase tracking-wider font-semibold ${pm.color}`}>{pm.label}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-semibold text-foreground">Day {post.sprint_day}</p>
                      <p className="font-body text-xs text-muted-foreground line-clamp-2 mt-0.5">{post.hook || post.caption?.slice(0, 100) || '—'}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {post.status === 'approved' && <Badge className="bg-primary/10 text-primary border-0 text-[9px] uppercase">Send to Metricool →</Badge>}
                      {post.status === 'scheduled' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                      {post.status === 'posted' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}

      {selected && <ScheduleModal post={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}