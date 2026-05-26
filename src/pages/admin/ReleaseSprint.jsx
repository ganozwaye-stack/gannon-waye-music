import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Calendar, Video, Image, Heart, ShoppingBag, Music, Zap, CheckCircle2,
  Clock, AlertTriangle, Copy, Check, RefreshCw, ChevronRight, ChevronDown,
  ExternalLink, Play, Film, Hash, Send, Eye, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RELEASE_DATE = new Date('2026-06-05T00:00:00+10:00');
const CAMPAIGN = 'thank_you_june5_sprint';

const PLATFORM_META = {
  tiktok: { label: 'TikTok', color: 'text-red-400', bg: 'bg-red-500/10' },
  instagram_reels: { label: 'IG Reels', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  instagram_stories: { label: 'IG Stories', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  instagram_feed: { label: 'IG Feed', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  twitter_x: { label: 'X / Twitter', color: 'text-sky-400', bg: 'bg-sky-500/10' },
  facebook: { label: 'Facebook', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  youtube_shorts: { label: 'YT Shorts', color: 'text-red-500', bg: 'bg-red-500/10' },
};

const STATUS_META = {
  draft: { label: 'Draft', color: 'text-muted-foreground', bg: 'bg-secondary' },
  pending_approval: { label: 'Pending Approval', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  approved: { label: 'Approved', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
  scheduled: { label: 'Scheduled', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  posted: { label: 'Posted ✓', color: 'text-green-500', bg: 'bg-green-500/15 border-green-500/40' },
  rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
};

const SPRINT_THEMES = [
  'Emotional reveal — the gratitude angle',
  'Raw story — what the song is really about',
  'Behind the scenes — writing/studio process',
  'Merch + CD pre-order CTA',
  'Fan community love and appreciation',
  'Lyric teaser — most emotional line',
  'Countdown urgency — 5 days to go',
  'Personal message to supporters',
  'Final push — release eve build-up',
  'RELEASE DAY — Thank You is out now',
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
      {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function PostDetailModal({ post, onClose, onApprove, onReject }) {
  if (!post) return null;
  const pm = PLATFORM_META[post.platform] || { label: post.platform, color: 'text-foreground', bg: 'bg-secondary' };
  const sm = STATUS_META[post.status] || STATUS_META.draft;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full my-8 space-y-0 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${pm.bg} ${pm.color} border-0 text-[10px] font-body tracking-wider uppercase`}>{pm.label}</Badge>
              <Badge className={`${sm.bg} ${sm.color} border text-[10px] font-body tracking-wider uppercase`}>{sm.label}</Badge>
              <span className="font-body text-xs text-muted-foreground">Day {post.sprint_day} · {post.scheduled_date}</span>
            </div>
            <h3 className="font-display text-lg text-foreground">{SPRINT_THEMES[(post.sprint_day || 1) - 1]}</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {post.hook && (
            <Field label="Hook (first 1-3s)" value={post.hook} />
          )}
          {post.caption && (
            <Field label="Caption" value={post.caption} large />
          )}
          {post.cta && (
            <Field label="Call to Action" value={post.cta} />
          )}
          {post.on_screen_text && (
            <Field label="On-Screen Text" value={post.on_screen_text} />
          )}
          {post.shot_list && (
            <Field label="Shot List" value={post.shot_list} />
          )}
          {post.edit_rhythm && (
            <Field label="Edit Rhythm" value={post.edit_rhythm} />
          )}
          {post.broll_ideas && (
            <Field label="B-Roll Ideas" value={post.broll_ideas} />
          )}
          {post.hashtags && (
            <Field label="Hashtags" value={post.hashtags} />
          )}
          {post.metricool_export && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">📋 Metricool Ready — Copy & Paste</p>
                <CopyBtn text={post.metricool_export} />
              </div>
              <pre className="font-body text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">{post.metricool_export}</pre>
            </div>
          )}
          {post.content_notes && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
              <p className="font-body text-[10px] tracking-wider uppercase text-amber-400 mb-1">Production Notes</p>
              <p className="font-body text-xs text-foreground/70 leading-relaxed">{post.content_notes}</p>
            </div>
          )}
          {post.source_chain && (
            <p className="font-body text-[10px] text-muted-foreground/50">Source: {post.source_chain}</p>
          )}
        </div>

        <div className="p-4 border-t border-border flex gap-2 flex-wrap">
          {post.status === 'pending_approval' && (
            <>
              <Button onClick={() => onApprove(post)} className="gap-1.5 bg-green-600 hover:bg-green-700 border-0">
                <CheckCircle2 className="w-4 h-4" /> Approve
              </Button>
              <Button variant="outline" onClick={() => onReject(post)} className="gap-1.5 border-red-500/40 text-red-400 hover:bg-red-500/10">
                <X className="w-4 h-4" /> Reject
              </Button>
            </>
          )}
          {post.status === 'approved' && (
            <Button variant="outline" onClick={() => onApprove(post, 'scheduled')} className="gap-1.5 border-blue-500/40 text-blue-400">
              <Calendar className="w-4 h-4" /> Mark Scheduled in Metricool
            </Button>
          )}
          {post.status === 'scheduled' && (
            <Button variant="outline" onClick={() => onApprove(post, 'posted')} className="gap-1.5 border-green-500/40 text-green-400">
              <CheckCircle2 className="w-4 h-4" /> Mark as Posted
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose} className="ml-auto">Close</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, large }) {
  return (
    <div className="bg-secondary/30 border border-border/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{label}</p>
        <CopyBtn text={value} />
      </div>
      <p className={`font-body text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap ${large ? '' : 'line-clamp-3'}`}>{value}</p>
    </div>
  );
}

export default function ReleaseSprint() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [generatingDay, setGeneratingDay] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const daysLeft = Math.max(0, Math.ceil((RELEASE_DATE - new Date()) / (1000 * 60 * 60 * 24)));

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['sprint-posts'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ campaign: CAMPAIGN }, 'sprint_day', 200),
    refetchInterval: 30000,
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ['sprint-approvals'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending', risk_type: 'publishing' }, '-created_date', 50),
  });

  const updatePost = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ContentCalendarPost.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sprint-posts'] }),
  });

  const handleApprove = async (post, newStatus = 'approved') => {
    await updatePost.mutateAsync({ id: post.id, data: { status: newStatus } });
    if (post.approval_id) {
      await base44.entities.ApprovalQueue.update(post.approval_id, { status: newStatus === 'approved' ? 'approved' : 'actioned' });
      qc.invalidateQueries({ queryKey: ['sprint-approvals'] });
    }
    toast({ title: `Post ${newStatus === 'approved' ? 'approved' : newStatus === 'scheduled' ? 'marked scheduled' : 'marked posted'} ✓` });
    setSelectedPost(p => p ? { ...p, status: newStatus } : null);
  };

  const handleReject = async (post) => {
    await updatePost.mutateAsync({ id: post.id, data: { status: 'rejected' } });
    if (post.approval_id) {
      await base44.entities.ApprovalQueue.update(post.approval_id, { status: 'rejected' });
      qc.invalidateQueries({ queryKey: ['sprint-approvals'] });
    }
    toast({ title: 'Post rejected', variant: 'destructive' });
    setSelectedPost(null);
  };

  const generateSprint = async (dayNum = null) => {
    if (dayNum) {
      setGeneratingDay(dayNum);
    } else {
      setGenerating(true);
    }
    try {
      const payload = dayNum ? { day: dayNum } : {};
      const res = await base44.functions.invoke('generateReleaseSprint', payload);
      qc.invalidateQueries({ queryKey: ['sprint-posts'] });
      qc.invalidateQueries({ queryKey: ['sprint-approvals'] });
      toast({ title: res.data?.message || `${res.data?.posts_created || 0} posts generated` });
    } catch (err) {
      toast({ title: 'Generation failed. Try again.', variant: 'destructive' });
    }
    setGenerating(false);
    setGeneratingDay(null);
  };

  // Group posts by sprint day
  const postsByDay = useMemo(() => {
    const map = {};
    for (const p of posts) {
      const d = p.sprint_day || 0;
      if (!map[d]) map[d] = [];
      map[d].push(p);
    }
    return map;
  }, [posts]);

  // Sprint day metadata
  const sprintDays = useMemo(() => Array.from({ length: 10 }, (_, i) => {
    const d = new Date(RELEASE_DATE);
    d.setDate(d.getDate() - (10 - i));
    const dayPosts = postsByDay[i + 1] || [];
    const isPast = d < new Date();
    const isToday = d.toDateString() === new Date().toDateString();
    return {
      day: i + 1,
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' }),
      theme: SPRINT_THEMES[i],
      posts: dayPosts,
      total: dayPosts.length,
      approved: dayPosts.filter(p => ['approved', 'scheduled', 'posted'].includes(p.status)).length,
      pending: dayPosts.filter(p => p.status === 'pending_approval').length,
      posted: dayPosts.filter(p => p.status === 'posted').length,
      isPast,
      isToday,
      isReleaseDay: i === 9,
    };
  }), [postsByDay]);

  const totalPosts = posts.length;
  const totalApproved = posts.filter(p => ['approved', 'scheduled', 'posted'].includes(p.status)).length;
  const totalPending = posts.filter(p => p.status === 'pending_approval').length;
  const totalPosted = posts.filter(p => p.status === 'posted').length;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">June 5, 2026 Release</p>
            <h1 className="font-display text-3xl font-bold gradient-gold-text">Release Sprint Command</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">10-day Metricool social content engine · All posts require approval before scheduling</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-body font-semibold ${daysLeft <= 7 ? 'border-yellow-500/60 bg-yellow-500/10 text-yellow-400' : 'border-primary/40 bg-primary/10 text-primary'}`}>
              <Calendar className="w-4 h-4" />
              <span>{daysLeft} days · June 5 Release</span>
              {daysLeft <= 7 && <span className="animate-pulse">⚡</span>}
            </div>
            <Button
              onClick={() => generateSprint()}
              disabled={generating}
              className="gradient-gold-button border-0 gap-2"
            >
              {generating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating Sprint...</> : <><Zap className="w-4 h-4" /> Generate Full Sprint</>}
            </Button>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-green-500/5 border border-green-500/30 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-body text-sm text-green-400 font-semibold">No external posts without approval</p>
          <p className="font-body text-xs text-muted-foreground mt-0.5">Source chain: Generate Sprint → ContentCalendarPost → ApprovalQueue → Admin Approval → Copy to Metricool → Schedule → Post</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Posts', value: totalPosts, icon: Film, color: 'text-blue-400' },
          { label: 'Pending Approval', value: totalPending, icon: Clock, color: 'text-amber-400' },
          { label: 'Approved', value: totalApproved, icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Posted', value: totalPosted, icon: Send, color: 'text-primary' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-7 h-7 shrink-0 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold font-display">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Approvals Alert */}
      {totalPending > 0 && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" /> {totalPending} posts awaiting your approval
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex gap-2">
              <Link to="/admin/approval-queue">
                <Button variant="outline" size="sm" className="gap-1.5 border-amber-500/40 text-amber-400">
                  <Eye className="w-3 h-3" /> Review Approval Queue
                </Button>
              </Link>
              <p className="font-body text-xs text-muted-foreground self-center">Or click any post below to review & approve inline.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 10-Day Sprint Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> 10-Day Sprint Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sprintDays.map(day => (
            <div key={day.day} className={`rounded-xl border transition-all ${day.isToday ? 'border-primary/60 bg-primary/5' : day.isPast ? 'border-border/30 opacity-70' : 'border-border/50'}`}>
              {/* Day header row */}
              <button
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full text-left p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 font-body text-sm font-bold ${day.isReleaseDay ? 'bg-primary text-primary-foreground' : day.isToday ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    {day.day}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body text-sm font-semibold text-foreground">{day.label}</span>
                      {day.isToday && <Badge className="bg-primary/20 text-primary border-0 text-[9px] tracking-wider uppercase">Today</Badge>}
                      {day.isReleaseDay && <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-[9px] tracking-wider uppercase">🎵 Release Day</Badge>}
                    </div>
                    <p className="font-body text-xs text-muted-foreground truncate mt-0.5">{day.theme}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-body">
                    {day.total > 0 ? (
                      <>
                        <span className="text-muted-foreground">{day.total} posts</span>
                        {day.pending > 0 && <span className="text-amber-400">{day.pending} pending</span>}
                        {day.approved > 0 && <span className="text-green-400">{day.approved} ✓</span>}
                      </>
                    ) : (
                      <span className="text-muted-foreground/50">No content</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs gap-1"
                      onClick={e => { e.stopPropagation(); generateSprint(day.day); }}
                      disabled={generatingDay === day.day}
                    >
                      {generatingDay === day.day ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      {day.total > 0 ? 'Re-gen' : 'Generate'}
                    </Button>
                    {expandedDay === day.day ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
              </button>

              {/* Expanded posts */}
              {expandedDay === day.day && (
                <div className="border-t border-border/40 p-3 space-y-2">
                  {day.posts.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="font-body text-sm text-muted-foreground">No content generated yet for Day {day.day}.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 gap-1.5"
                        onClick={() => generateSprint(day.day)}
                        disabled={generatingDay === day.day}
                      >
                        {generatingDay === day.day ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                        Generate Day {day.day} Content
                      </Button>
                    </div>
                  ) : (
                    day.posts.map(post => {
                      const pm = PLATFORM_META[post.platform] || { label: post.platform, color: 'text-foreground', bg: 'bg-secondary' };
                      const sm = STATUS_META[post.status] || STATUS_META.draft;
                      return (
                        <button
                          key={post.id}
                          onClick={() => setSelectedPost(post)}
                          className="w-full text-left flex items-start gap-3 p-3 rounded-lg border border-border/30 hover:border-primary/40 hover:bg-secondary/30 transition-all"
                        >
                          <div className={`${pm.bg} px-2 py-1 rounded-md shrink-0`}>
                            <span className={`font-body text-[10px] tracking-wider uppercase font-semibold ${pm.color}`}>{pm.label}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm text-foreground line-clamp-2">{post.hook || post.caption || '—'}</p>
                            <p className="font-body text-[10px] text-muted-foreground mt-0.5">{post.content_type?.replace(/_/g, ' ')}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge className={`${sm.bg} ${sm.color} border text-[9px] tracking-wider uppercase`}>{sm.label}</Badge>
                            {post.metricool_export && (
                              <div className="flex items-center gap-0.5 text-primary/60" title="Metricool ready">
                                <Copy className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Metricool Integration Guide */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-blue-400">
            <ExternalLink className="w-4 h-4" /> Metricool Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs font-body text-muted-foreground space-y-1.5">
          <p>1. Generate content for a sprint day above (or regenerate)</p>
          <p>2. Review and approve posts — click any card to see full brief</p>
          <p>3. Copy the <strong className="text-primary">Metricool Ready</strong> field (caption + hashtags pre-formatted)</p>
          <p>4. Paste into Metricool, set the date/time, and schedule</p>
          <p>5. Mark as "Scheduled" above, then "Posted" after it goes live</p>
          <p className="pt-1 text-muted-foreground/50">No automated external posting. All content manual-scheduled via Metricool.</p>
        </CardContent>
      </Card>

      {/* Post detail modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onApprove={(post, status) => handleApprove(post, status)}
          onReject={handleReject}
        />
      )}
    </div>
  );
}