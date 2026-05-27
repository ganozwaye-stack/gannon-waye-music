import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Brain, Zap, RefreshCw, AlertTriangle,
  TrendingUp, Lock, Users, Star, Shield, Eye, ChevronRight,
  Calendar, BarChart2, Layers, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

const AGENTS = [
  { name: 'Social Orchestrator', role: 'Coordinates all social content, Metricool, approvals, assets, performance', icon: Layers, color: 'text-primary' },
  { name: 'Trend Research Agent', role: 'Researches TikTok, Instagram, YouTube Shorts, Threads trends in real-time', icon: TrendingUp, color: 'text-cyan-400' },
  { name: 'Brand Voice Agent', role: 'Turns ideas into Gannon Waye style — emotional, cinematic, direct, human', icon: Star, color: 'text-yellow-400' },
  { name: 'Asset Matching Agent', role: 'Matches approved SocialAsset records to posts — never uses unapproved files', icon: Eye, color: 'text-blue-400' },
  { name: 'Metricool Scheduling Agent', role: 'Prepares schedule-ready posts — CANNOT schedule without ApprovalQueue approval', icon: Calendar, color: 'text-green-400' },
  { name: 'Content Quality Agent', role: 'Scores brand fit, viral potential, emotional connection, cringe risk, platform fit', icon: BarChart2, color: 'text-orange-400' },
  { name: 'Performance Learning Agent', role: 'Reads Metricool performance data and learns what works', icon: Brain, color: 'text-purple-400' },
  { name: 'Revenue Intelligence Agent', role: 'Connects social content to store, fans, supporters, bookings, merch, releases', icon: TrendingUp, color: 'text-emerald-400' },
  { name: 'Compliance Gatekeeper', role: 'Blocks publishing/scheduling/outreach without approval — no exceptions', icon: Shield, color: 'text-red-400' },
  { name: 'Supervisor Agent', role: 'Reviews agent outputs — rejects generic/embarrassing/off-brand content before Gannon sees it', icon: Users, color: 'text-pink-400' },
];

const WORKFLOW = [
  { step: 'Research', desc: 'Trend + competitor analysis' },
  { step: 'Idea Gen', desc: 'Brand Voice Agent creates draft' },
  { step: 'Asset Match', desc: 'Match approved assets' },
  { step: 'Quality Council', desc: '5 agents score + review' },
  { step: 'Compliance Check', desc: 'Legal + platform safety' },
  { step: 'Approval Queue', desc: 'Gannon approves/rejects' },
  { step: 'Metricool', desc: 'Schedule approved posts only' },
  { step: 'Performance', desc: 'Track results' },
  { step: 'Learning', desc: 'Record what worked' },
];

const PLATFORM_COLORS = {
  tiktok: 'bg-pink-500/20 text-pink-300',
  instagram_reels: 'bg-purple-500/20 text-purple-300',
  instagram_feed: 'bg-purple-500/20 text-purple-300',
  instagram_stories: 'bg-purple-500/20 text-purple-300',
  facebook: 'bg-blue-500/20 text-blue-300',
  youtube_shorts: 'bg-red-500/20 text-red-300',
  twitter_x: 'bg-sky-500/20 text-sky-300',
};

export default function SocialAgentOS() {
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [councilRunning, setCouncilRunning] = useState(null);
  const [genResult, setGenResult] = useState(null);

  const { data: drafts = [] } = useQuery({
    queryKey: ['social-agent-drafts'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ status: 'draft' }, '-created_date', 20),
  });
  const { data: pendingApprovals = [] } = useQuery({
    queryKey: ['social-agent-pending'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ status: 'pending_approval' }, '-created_date', 20),
  });
  const { data: approvedPosts = [] } = useQuery({
    queryKey: ['social-agent-approved'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ status: 'approved' }, '-created_date', 10),
  });
  const { data: scheduledPosts = [] } = useQuery({
    queryKey: ['social-agent-scheduled'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ status: 'scheduled' }, '-created_date', 10),
  });

  const generateTodaysDrafts = async () => {
    setGenerating(true);
    setGenResult(null);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await base44.functions.invoke('generateDailyDrafts', { date: today, post_count: 3 });
      setGenResult(res.data);
      queryClient.invalidateQueries({ queryKey: ['social-agent-drafts'] });
      toast.success(res.data?.skipped ? res.data.message : `${res.data?.posts_created || 0} drafts created — in Approval Queue`);
    } catch (e) {
      toast.error(e?.response?.data?.error || e.message);
    }
    setGenerating(false);
  };

  const runQualityCouncil = async (postId) => {
    setCouncilRunning(postId);
    try {
      const res = await base44.functions.invoke('socialQualityCouncil', { post_id: postId });
      queryClient.invalidateQueries({ queryKey: ['social-agent-drafts'] });
      toast.success(`Council verdict: ${res.data?.council_verdict?.toUpperCase()} — avg ${res.data?.average_score}/10`);
    } catch (e) {
      toast.error(e?.response?.data?.error || e.message);
    }
    setCouncilRunning(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Agent System</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Social Agent OS</h1>
          <p className="text-muted-foreground text-sm mt-1">10-agent collaboration system · Approval-gated · No auto-posting</p>
        </div>
        <Button onClick={generateTodaysDrafts} disabled={generating} className="gap-2">
          {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Generate Today's Drafts (2–3)
        </Button>
      </div>

      {genResult && (
        <div className={`rounded-xl border p-4 ${genResult.skipped ? 'border-blue-500/40 bg-blue-500/5' : 'border-green-500/40 bg-green-500/5'}`}>
          <p className={`text-sm font-semibold ${genResult.skipped ? 'text-blue-400' : 'text-green-400'}`}>{genResult.message}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Drafts', value: drafts.length, color: 'text-muted-foreground' },
          { label: 'Pending Approval', value: pendingApprovals.length, color: 'text-amber-400' },
          { label: 'Approved', value: approvedPosts.length, color: 'text-green-400' },
          { label: 'Scheduled', value: scheduledPosts.length, color: 'text-blue-400' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </CardContent></Card>
        ))}
      </div>

      {pendingApprovals.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-400">{pendingApprovals.length} posts awaiting your approval</p>
                <p className="text-xs text-muted-foreground">Nothing schedules to Metricool without your sign-off</p>
              </div>
            </div>
            <Link to="/admin/approval-queue">
              <Button size="sm" variant="outline" className="border-amber-500/40 text-amber-400 gap-1">
                <ChevronRight className="w-3 h-3" /> Review
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {drafts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Draft Posts — Quality Council Review</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {drafts.slice(0, 6).map(p => (
              <div key={p.id} className="border border-border/30 rounded-xl p-4 flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge className={`text-[10px] ${PLATFORM_COLORS[p.platform] || 'bg-secondary'}`}>{p.platform}</Badge>
                    <Badge variant="outline" className="text-[10px] text-amber-400">{p.status}</Badge>
                  </div>
                  <p className="text-sm font-medium mb-1">{p.hook || '(no hook)'}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.caption}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => runQualityCouncil(p.id)} disabled={councilRunning === p.id} className="gap-1 shrink-0">
                  {councilRunning === p.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
                  Quality Council
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><Brain className="w-4 h-4 text-cyan-400" /> Agent Roster (10 agents)</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {AGENTS.map(a => (
              <div key={a.name} className="flex items-start gap-3 p-3 rounded-lg border border-border/20 hover:bg-secondary/20">
                <a.icon className={`w-4 h-4 shrink-0 mt-0.5 ${a.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold mb-0.5">{a.name}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{a.role}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Agent Collaboration Workflow</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {WORKFLOW.map((w, i) => (
              <div key={w.step} className="flex items-center gap-1.5">
                <div className="bg-secondary border border-border/40 rounded-lg px-2.5 py-1.5 text-center">
                  <p className="text-xs font-semibold">{w.step}</p>
                  <p className="text-[10px] text-muted-foreground">{w.desc}</p>
                </div>
                {i < WORKFLOW.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 bg-green-500/5 border border-green-500/20 rounded-lg p-2">
            <Lock className="w-4 h-4 text-green-400 shrink-0" />
            <p className="text-xs text-green-400">ApprovalQueue gate: no post leaves without Gannon's explicit approval</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Approval Queue', path: '/admin/approval-queue', desc: 'Review & approve drafts' },
          { label: 'Metricool Command', path: '/admin/metricool-command', desc: 'Scheduling hub' },
          { label: 'Social Asset Library', path: '/admin/social-asset-library', desc: 'Approved media' },
          { label: 'Social Schedule Queue', path: '/admin/social-schedule-queue', desc: 'Send to Metricool' },
          { label: 'Content Performance', path: '/admin/content-performance', desc: 'Track results' },
          { label: 'Metricool Diagnostics', path: '/admin/metricool-diagnostics', desc: 'Test connection' },
        ].map(n => (
          <Link key={n.path} to={n.path}>
            <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
              <CardContent className="p-4">
                <p className="text-sm font-semibold">{n.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}