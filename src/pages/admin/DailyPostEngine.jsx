import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Zap, RefreshCw, Calendar, CheckCircle2,
  Lock, ChevronRight, Brain, Eye, Copy
} from 'lucide-react';
import { toast } from 'sonner';

const PLATFORM_COLORS = {
  tiktok: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  instagram_reels: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  instagram_feed: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  instagram_stories: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  facebook: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  youtube_shorts: 'bg-red-500/20 text-red-300 border-red-500/30',
  twitter_x: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
};

const STATUS_COLORS = {
  draft: 'bg-secondary text-muted-foreground',
  pending_approval: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  approved: 'bg-green-500/20 text-green-300 border-green-500/30',
  scheduled: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  posted: 'bg-emerald-500/20 text-emerald-300',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function DailyPostEngine() {
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [expandedPost, setExpandedPost] = useState(null);
  const [councilRunning, setCouncilRunning] = useState(null);

  const { data: posts = [], refetch } = useQuery({
    queryKey: ['daily-posts', selectedDate],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ scheduled_date: selectedDate }, 'created_date', 20),
  });

  const { data: recentPosts = [] } = useQuery({
    queryKey: ['recent-posts-engine'],
    queryFn: () => base44.entities.ContentCalendarPost.list('-created_date', 30),
  });

  const generateDrafts = async () => {
    setGenerating(true);
    try {
      const res = await base44.functions.invoke('generateDailyDrafts', { date: selectedDate, post_count: 3 });
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['recent-posts-engine'] });
      toast.success(res.data?.skipped ? res.data.message : `${res.data?.posts_created || 0} drafts created → Approval Queue`);
    } catch (e) {
      toast.error(e?.response?.data?.error || e.message);
    }
    setGenerating(false);
  };

  const runCouncil = async (postId) => {
    setCouncilRunning(postId);
    try {
      const res = await base44.functions.invoke('socialQualityCouncil', { post_id: postId });
      await refetch();
      toast.success(`Council: ${res.data?.council_verdict?.toUpperCase()} — ${res.data?.average_score}/10`);
    } catch (e) {
      toast.error(e?.response?.data?.error || e.message);
    }
    setCouncilRunning(null);
  };

  const copyMetricool = (post) => {
    const text = post.metricool_export || `${post.caption || ''}\n\n${post.hashtags || ''}`.trim();
    navigator.clipboard.writeText(text).then(() => toast.success('Copied for Metricool'));
  };

  const statusBreakdown = recentPosts.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Social Engine</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Daily Post Engine</h1>
        <p className="text-muted-foreground text-sm mt-1">2–3 approval-gated drafts per day · Nothing posts without your sign-off</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="bg-secondary border border-border/40 rounded-lg px-3 py-2 text-sm font-body text-foreground"
        />
        <Button onClick={generateDrafts} disabled={generating} className="gap-2">
          {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Generate {selectedDate} Drafts
        </Button>
        <Link to="/admin/approval-queue">
          <Button variant="outline" size="sm" className="gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approval Queue
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {['draft', 'pending_approval', 'approved', 'scheduled', 'posted', 'rejected'].map(s => (
          <Card key={s}><CardContent className="p-3 text-center">
            <p className="text-xl font-bold font-display">{statusBreakdown[s] || 0}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{s.replace('_', ' ')}</p>
          </CardContent></Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold">Posts for {selectedDate}</h2>
          <Badge variant="outline" className="text-xs">{posts.length} posts</Badge>
        </div>

        {posts.length === 0 ? (
          <Card className="border-dashed border-border/40">
            <CardContent className="p-8 text-center">
              <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No posts for this date yet</p>
              <p className="text-xs text-muted-foreground mt-1">Click "Generate Drafts" to create 2–3 AI drafts</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map(post => {
              const isExpanded = expandedPost === post.id;
              return (
                <Card key={post.id} className="hover:border-primary/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <Badge className={`text-[10px] border ${PLATFORM_COLORS[post.platform] || 'bg-secondary'}`}>{post.platform}</Badge>
                          <Badge className={`text-[10px] border ${STATUS_COLORS[post.status] || 'bg-secondary'}`}>{post.status}</Badge>
                        </div>
                        <p className="text-sm font-semibold mb-1">{post.hook || '(no hook set)'}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{post.caption}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {post.status === 'draft' && (
                          <Button size="sm" variant="outline" onClick={() => runCouncil(post.id)} disabled={councilRunning === post.id} className="gap-1">
                            {councilRunning === post.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
                            Council
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setExpandedPost(isExpanded ? null : post.id)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => copyMetricool(post)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border/30 space-y-3">
                        {post.hook && <div><p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Hook</p><p className="text-sm">{post.hook}</p></div>}
                        {post.caption && <div><p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Caption</p><p className="text-sm whitespace-pre-wrap">{post.caption}</p></div>}
                        {post.hashtags && <div><p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Hashtags</p><p className="text-xs text-muted-foreground">{post.hashtags}</p></div>}
                        {post.status === 'approved' && (
                          <div className="flex items-center gap-2 bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                            <p className="text-xs text-green-400 font-semibold flex-1">Approved — ready to schedule</p>
                            <Link to="/admin/metricool-scheduler-queue">
                              <Button size="sm" variant="outline" className="border-green-500/40 text-green-400 gap-1">Schedule <ChevronRight className="w-3 h-3" /></Button>
                            </Link>
                          </div>
                        )}
                        {(post.status === 'draft' || post.status === 'pending_approval') && (
                          <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/20 rounded-lg p-2">
                            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <p className="text-xs text-amber-400">Scheduling locked until approved in Approval Queue</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-400">Zero auto-posting policy</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Every post: Draft → Quality Council → Approval Queue (your sign-off) → Metricool scheduler.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}