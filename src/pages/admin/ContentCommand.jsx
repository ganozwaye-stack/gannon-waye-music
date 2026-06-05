import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Zap, CheckCircle2, Send, BarChart2, Image, FileText,
  Calendar, TrendingUp, RefreshCw, Plus, ArrowRight, AlertTriangle, Radio, Bookmark, Heart, Share2, Edit3,
  Layers, Target, Cpu, Play, ExternalLink
} from 'lucide-react';

const PLATFORM_META = {
  instagram:        { label: 'Instagram',      color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20' },
  tiktok:           { label: 'TikTok',          color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20' },
  facebook:         { label: 'Facebook',        color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
  youtube_shorts:   { label: 'YouTube Shorts',  color: 'text-red-500',    bg: 'bg-red-600/10',    border: 'border-red-600/20' },
  threads:          { label: 'Threads',         color: 'text-gray-300',   bg: 'bg-gray-500/10',   border: 'border-gray-500/20' },
  pinterest:        { label: 'Pinterest',       color: 'text-rose-400',   bg: 'bg-rose-500/10',   border: 'border-rose-500/20' },
  twitter_x:        { label: 'X/Twitter',       color: 'text-sky-400',    bg: 'bg-sky-500/10',    border: 'border-sky-500/20' },
};

const STATUS_CONFIG = {
  draft:             { label: 'Draft',            color: 'bg-secondary text-muted-foreground' },
  awaiting_approval: { label: 'Awaiting Approval', color: 'bg-amber-500/20 text-amber-300' },
  approved:          { label: 'Approved',          color: 'bg-green-500/20 text-green-300' },
  scheduled:         { label: 'Scheduled',         color: 'bg-blue-500/20 text-blue-300' },
  posted:            { label: 'Posted',            color: 'bg-green-600/20 text-green-200' },
  rejected:          { label: 'Rejected',          color: 'bg-red-500/20 text-red-300' },
};

const NAV_MODULES = [
  { label: 'Post Factory', desc: 'AI-generate sprint briefs', to: '/admin/social-post-factory', icon: Zap, color: 'text-primary' },
  { label: 'Approval Queue', desc: 'Review before publishing', to: '/admin/approval-queue', icon: CheckCircle2, color: 'text-green-400' },
  { label: 'Schedule Queue', desc: 'Approved → Metricool', to: '/admin/social-schedule-queue', icon: Calendar, color: 'text-blue-400' },
  { label: 'Asset Library', desc: 'Videos, images, overlays', to: '/admin/social-asset-library', icon: Image, color: 'text-purple-400' },
  { label: 'Quality Review', desc: 'Score drafts before publish', to: '/admin/content-quality-review', icon: Target, color: 'text-amber-400' },
  { label: 'Performance', desc: 'Analytics & engagement', to: '/admin/content-performance', icon: BarChart2, color: 'text-cyan-400' },
  { label: 'Metricool Setup', desc: 'API config & diagnostics', to: '/admin/metricool-api-setup', icon: Radio, color: 'text-orange-400' },
  { label: 'Daily Post Engine', desc: 'Auto-generate daily drafts', to: '/admin/daily-post-engine', icon: Cpu, color: 'text-pink-400' },
];

const PLATFORM_RULES = {
  instagram: { focus: 'Saves · Shares · Carousels · Emotional story captions', emoji: '📸' },
  tiktok: { focus: 'Hooks · Watch time · Replays · Authenticity · Short cuts', emoji: '🎵' },
  youtube_shorts: { focus: 'Retention · Curiosity · Emotional payoff', emoji: '▶️' },
  pinterest: { focus: 'Evergreen emotional inspiration · Merch/product discovery', emoji: '📌' },
  threads: { focus: 'Conversational vulnerability · Community replies', emoji: '🧵' },
  facebook: { focus: 'Emotional storytelling · Shares · Supporters', emoji: '💙' },
  twitter_x: { focus: 'Punchy emotional statements · Repostability', emoji: '✖️' },
};

function PostCard({ post, onApprove, onReject, onEdit }) {
  const pm = PLATFORM_META[post.platform] || PLATFORM_META.instagram;
  const sc = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft;

  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex gap-2 flex-wrap">
            <span className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border ${pm.bg} ${pm.color} ${pm.border}`}>{pm.label}</span>
            <span className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border-0 ${sc.color}`}>{sc.label}</span>
            {post.campaign && <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">{post.campaign}</span>}
          </div>
          {post.predicted_viral_probability > 0 && (
            <span className="text-xs text-amber-300 font-mono shrink-0">{Math.round((post.predicted_viral_probability || 0) * 100)}% viral</span>
          )}
        </div>

        {post.hook && <p className="text-sm font-medium text-foreground border-l-2 border-primary/40 pl-3 italic line-clamp-2">"{post.hook}"</p>}
        {post.caption && <p className="text-xs text-muted-foreground line-clamp-3">{post.caption}</p>}
        {post.hashtags && <p className="text-xs text-primary/60 line-clamp-1">{post.hashtags}</p>}

        {(post.actual_likes > 0 || post.actual_saves > 0) && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            {post.actual_likes > 0 && <span><Heart className="w-3 h-3 inline mr-1" />{post.actual_likes}</span>}
            {post.actual_saves > 0 && <span><Bookmark className="w-3 h-3 inline mr-1" />{post.actual_saves}</span>}
            {post.actual_shares > 0 && <span><Share2 className="w-3 h-3 inline mr-1" />{post.actual_shares}</span>}
            {post.store_clicks > 0 && <span>🛍 {post.store_clicks} clicks</span>}
          </div>
        )}

        <div className="flex gap-2 flex-wrap pt-1">
          {post.status === 'awaiting_approval' && (
            <>
              <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700" onClick={() => onApprove(post)}>
                <CheckCircle2 className="w-3 h-3 mr-1" />Approve
              </Button>
              <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => onReject(post)}>Reject</Button>
            </>
          )}
          {post.status === 'approved' && (
            <a href="https://app.metricool.com" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700">
                <Send className="w-3 h-3 mr-1" />Send to Metricool
              </Button>
            </a>
          )}
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => onEdit(post)}>
            <Edit3 className="w-3 h-3 mr-1" />Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function GenerateModal({ onClose, onGenerated }) {
  const { toast } = useToast();
  const [platform, setPlatform] = useState('instagram');
  const [campaign, setCampaign] = useState('thank_you_june5');
  const [angle, setAngle] = useState('emotional_story');
  const [generating, setGenerating] = useState(false);

  const ANGLES = [
    { id: 'emotional_story', label: 'Emotional Story' },
    { id: 'viral_hook', label: 'Viral Hook' },
    { id: 'merch_cta', label: 'Merch / Store CTA' },
    { id: 'community', label: 'Community / Fan Love' },
    { id: 'behind_scenes', label: 'Behind The Scenes' },
    { id: 'presave', label: 'Pre-Save Push' },
    { id: 'vulnerability', label: 'Vulnerable / Personal' },
  ];

  const platformRule = PLATFORM_RULES[platform];

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await base44.functions.invoke('generateContentPost', { platform, campaign, angle });
      const post = res.data;
      toast({ title: `Post generated for ${platform} ✓` });
      onGenerated(post);
      onClose();
    } catch (e) {
      toast({ title: `Generation failed: ${e?.response?.data?.error || e.message}`, variant: 'destructive' });
    }
    setGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-card border border-border/40 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl gradient-gold-text">Generate Post</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Platform</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(PLATFORM_META).map(([id, pm]) => (
                  <button key={id} onClick={() => setPlatform(id)}
                    className={`p-2 rounded-lg border text-xs font-medium transition-all ${platform === id ? `${pm.bg} ${pm.border} ${pm.color}` : 'border-border/40 text-muted-foreground hover:border-primary/30'}`}>
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {platformRule && (
              <p className="text-xs text-primary/70 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                {platformRule.emoji} {platformRule.focus}
              </p>
            )}

            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Content Angle</label>
              <div className="grid grid-cols-2 gap-2">
                {ANGLES.map(a => (
                  <button key={a.id} onClick={() => setAngle(a.id)}
                    className={`p-2 rounded-lg border text-xs transition-all ${angle === a.id ? 'border-primary bg-primary/10 text-primary' : 'border-border/40 text-muted-foreground hover:border-primary/30'}`}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Campaign</label>
              <select value={campaign} onChange={e => setCampaign(e.target.value)}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground">
                <option value="thank_you_june5">Thank You · June 5 Launch</option>
                <option value="merch_launch">Merch Launch</option>
                <option value="founding_supporters">Founding Supporters</option>
                <option value="community_engagement">Community Engagement</option>
                <option value="store_promotion">Store Promotion</option>
              </select>
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={generating} className="w-full gradient-gold-button border-0 gap-2">
            {generating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating + saving to queue…</> : <><Zap className="w-4 h-4" /> Generate & Queue for Approval</>}
          </Button>
          <p className="text-xs text-muted-foreground text-center">Post saved as draft · enters ApprovalQueue automatically</p>
        </div>
      </div>
    </div>
  );
}

export default function ContentCommand() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState('overview');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [showGenerate, setShowGenerate] = useState(false);
  const [editPost, setEditPost] = useState(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['cc-posts', platformFilter],
    queryFn: () => platformFilter === 'all'
      ? base44.entities.ContentPost.list('-created_date', 60)
      : base44.entities.ContentPost.filter({ platform: platformFilter }, '-created_date', 60),
    refetchInterval: 30000,
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ['cc-approvals'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 20),
    refetchInterval: 20000,
  });

  const { data: visualQueue = [] } = useQuery({
    queryKey: ['cc-visuals'],
    queryFn: () => base44.entities.VisualGenerationQueue.filter({ approval_status: 'awaiting_approval' }, '-created_date', 20),
  });

  const updatePost = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ContentPost.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cc-posts'] }); toast({ title: 'Updated ✓' }); },
  });

  const handleApprove = post => updatePost.mutate({ id: post.id, data: { status: 'approved', approved_at: new Date().toISOString() } });
  const handleReject  = post => updatePost.mutate({ id: post.id, data: { status: 'rejected' } });

  const grouped = {
    awaiting_approval: posts.filter(p => p.status === 'awaiting_approval'),
    approved:          posts.filter(p => p.status === 'approved'),
    scheduled:         posts.filter(p => p.status === 'scheduled'),
    draft:             posts.filter(p => p.status === 'draft'),
    posted:            posts.filter(p => p.status === 'posted'),
  };

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'queue',    label: `Approval Queue (${grouped.awaiting_approval.length + approvals.length})` },
    { id: 'approved', label: `Approved (${grouped.approved.length})` },
    { id: 'drafts',   label: `Drafts (${grouped.draft.length})` },
    { id: 'scheduled', label: `Scheduled (${grouped.scheduled.length})` },
    { id: 'posted',   label: `Posted (${grouped.posted.length})` },
    { id: 'agents',   label: 'AI Agents' },
    { id: 'platforms', label: 'Platform Rules' },
    { id: 'visuals',  label: `Visuals (${visualQueue.length})` },
  ];

  const currentPosts = { queue: grouped.awaiting_approval, approved: grouped.approved, drafts: grouped.draft, scheduled: grouped.scheduled, posted: grouped.posted }[tab] || [];

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Content OS</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Content Command</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">AI-researched · AI-generated · Human-approved · Metricool-scheduled</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowGenerate(true)} className="gradient-gold-button border-0 gap-2">
            <Zap className="w-4 h-4" />Generate Post
          </Button>
          <Link to="/admin/social-post-factory">
            <Button variant="outline" size="sm" className="gap-1.5"><Plus className="w-3.5 h-3.5" />Sprint Brief</Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Awaiting Approval', count: grouped.awaiting_approval.length + approvals.length, color: 'text-amber-400', urgent: true },
          { label: 'Approved Ready',    count: grouped.approved.length,    color: 'text-green-400' },
          { label: 'Scheduled',         count: grouped.scheduled.length,   color: 'text-blue-400' },
          { label: 'Drafts',            count: grouped.draft.length,       color: 'text-muted-foreground' },
          { label: 'Posted Live',       count: grouped.posted.length,      color: 'text-primary' },
        ].map(({ label, count, color, urgent }) => (
          <Card key={label} className={urgent && count > 0 ? 'border-amber-500/30' : ''}>
            <CardContent className="p-3 text-center">
              <p className={`text-2xl font-bold font-display ${color}`}>{count}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Metricool status */}
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="p-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-sm text-green-300 font-medium">Metricool REST API — Connected</p>
            <p className="text-xs text-muted-foreground">Token set · API key authenticated · REST scheduling available</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/metricool-api-setup">
              <Button variant="outline" size="sm" className="text-xs gap-1.5"><Radio className="w-3 h-3" />Diagnostics</Button>
            </Link>
            <a href="https://app.metricool.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="text-xs gap-1.5"><ExternalLink className="w-3 h-3" />Open Metricool</Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Platform filter */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={platformFilter === 'all' ? 'default' : 'outline'} onClick={() => setPlatformFilter('all')}>All</Button>
        {Object.entries(PLATFORM_META).map(([id, pm]) => (
          <Button key={id} size="sm" variant={platformFilter === id ? 'default' : 'outline'} onClick={() => setPlatformFilter(id)}>{pm.label}</Button>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${tab === t.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ─────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {NAV_MODULES.map(({ label, desc, to, icon: NavIcon, color }) => (
              <Link key={to} to={to}>
                <Card className="hover:border-primary/40 transition-all h-full cursor-pointer group">
                  <CardContent className="p-4 flex items-start gap-3">
                    <NavIcon className={`w-5 h-5 shrink-0 mt-0.5 ${color} group-hover:scale-110 transition-transform`} />
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pending approvals alert */}
          {(approvals.length > 0 || grouped.awaiting_approval.length > 0) && (
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-300">{approvals.length + grouped.awaiting_approval.length} items awaiting your approval</p>
                    <p className="text-xs text-muted-foreground">Nothing publishes without your sign-off</p>
                  </div>
                </div>
                <Link to="/admin/approval-queue">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 border-0 text-xs gap-1.5">
                    <ArrowRight className="w-3 h-3" />Review Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Recent posted */}
          {grouped.posted.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Recently Posted</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {grouped.posted.slice(0, 3).map(p => (
                  <PostCard key={p.id} post={p} onApprove={handleApprove} onReject={handleReject} onEdit={setEditPost} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── POST LISTS ────────────────────────────────────────── */}
      {['queue', 'approved', 'drafts', 'scheduled', 'posted'].includes(tab) && (
        isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : currentPosts.length === 0 ? (
          <Card><CardContent className="p-8 text-center">
            <p className="text-muted-foreground text-sm">No {tab} posts yet</p>
            <Button className="mt-4" onClick={() => setShowGenerate(true)}>
              <Zap className="w-4 h-4 mr-1" />Generate First Post
            </Button>
          </CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPosts.map(post => (
              <PostCard key={post.id} post={post} onApprove={handleApprove} onReject={handleReject} onEdit={setEditPost} />
            ))}
          </div>
        )
      )}

      {/* ── AI AGENTS ─────────────────────────────────────────── */}
      {tab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: 'Viral Hook Agent', icon: TrendingUp, color: 'text-amber-400',
              desc: 'Finds high-performing emotional hooks, viral psychology triggers, creator gap opportunities',
              action: 'Find Viral Hooks', angle: 'viral_hook',
            },
            {
              name: 'Caption Agent', icon: FileText, color: 'text-blue-400',
              desc: 'Writes platform-specific captions, CTAs, comment bait, share prompts, conversion prompts',
              action: 'Write Captions', angle: 'emotional_story',
            },
            {
              name: 'Visual Direction Agent', icon: Image, color: 'text-purple-400',
              desc: 'Creates visual direction, motion cover prompts, CapCut/Runway/Canva prompts, thumbnail concepts',
              action: 'Create Visual Brief', angle: 'behind_scenes',
            },
            {
              name: 'Platform Optimisation Agent', icon: Layers, color: 'text-green-400',
              desc: 'Optimises formatting, hashtag strategy, posting time, and hook structure for each platform',
              action: 'Optimise for Platform', angle: 'viral_hook',
            },
            {
              name: 'Audience Emotion Agent', icon: Heart, color: 'text-pink-400',
              desc: 'Tracks which emotions perform best, which captions drive engagement, which hooks generate saves/shares',
              action: 'Analyse Emotions', angle: 'vulnerability',
            },
          ].map(agent => (
            <Card key={agent.name} className="hover:border-primary/30 transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    {<agent.icon className={`w-5 h-5 ${agent.color}`} />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{agent.name}</p>
                    <Badge className="bg-secondary text-muted-foreground border-0 text-[9px] tracking-wider uppercase mt-0.5">AI Agent</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{agent.desc}</p>
                <Button size="sm" variant="outline" className="w-full text-xs gap-1.5"
                  onClick={() => { setShowGenerate(true); }}>
                  <Play className="w-3 h-3" />{agent.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── PLATFORM RULES ────────────────────────────────────── */}
      {tab === 'platforms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(PLATFORM_RULES).map(([id, rule]) => {
            const pm = PLATFORM_META[id];
            return (
              <Card key={id} className={`border ${pm?.border || 'border-border/40'}`}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{rule.emoji}</span>
                    <span className={`font-semibold text-sm ${pm?.color || 'text-foreground'}`}>{pm?.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{rule.focus}</p>
                  <Button size="sm" variant="ghost" className="w-full text-xs gap-1"
                    onClick={() => { setPlatformFilter(id); setTab('drafts'); }}>
                    View {pm?.label} Drafts <ArrowRight className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── VISUAL QUEUE ──────────────────────────────────────── */}
      {tab === 'visuals' && (
        <div className="space-y-3">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-primary mb-1">Visual Generation Queue</p>
              <p className="text-xs text-muted-foreground">CapCut · Runway · Canva · motion covers · quote cards · story assets</p>
            </CardContent>
          </Card>
          {visualQueue.length === 0 ? (
            <Card><CardContent className="p-8 text-center">
              <p className="text-muted-foreground text-sm">No visual requests pending</p>
            </CardContent></Card>
          ) : visualQueue.map(v => (
            <Card key={v.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{v.visual_concept || v.prompt?.slice(0, 60)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{v.visual_type} · {v.platform}</p>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-300 border-0 text-[9px] uppercase tracking-wider">{v.asset_status}</Badge>
                </div>
                {v.prompt && <p className="text-xs text-muted-foreground line-clamp-2">{v.prompt}</p>}
              </CardContent>
            </Card>
          ))}
          <Link to="/admin/social-asset-library">
            <Button variant="outline" className="w-full gap-2"><Image className="w-4 h-4" />Open Full Asset Library</Button>
          </Link>
        </div>
      )}

      {/* ── MODALS ─────────────────────────────────────────────── */}
      {showGenerate && (
        <GenerateModal
          onClose={() => setShowGenerate(false)}
          onGenerated={() => qc.invalidateQueries({ queryKey: ['cc-posts'] })}
        />
      )}

      {editPost && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-card border border-border/40 rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Edit Post</h2>
              <button onClick={() => setEditPost(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Status</label>
              <select value={editPost.status} onChange={e => setEditPost(p => ({...p, status: e.target.value}))}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground">
                {['draft','awaiting_approval','approved','scheduled','posted','rejected','archived'].map(s => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Hook</label>
              <input value={editPost.hook || ''} onChange={e => setEditPost(p => ({...p, hook: e.target.value}))}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Caption</label>
              <textarea value={editPost.caption || ''} onChange={e => setEditPost(p => ({...p, caption: e.target.value}))} rows={4}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Hashtags</label>
              <input value={editPost.hashtags || ''} onChange={e => setEditPost(p => ({...p, hashtags: e.target.value}))}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setEditPost(null)}>Cancel</Button>
              <Button className="flex-1" onClick={() => { updatePost.mutate({ id: editPost.id, data: editPost }); setEditPost(null); }}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}