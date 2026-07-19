import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Brain,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Lightbulb,
  Megaphone,
  MessageCircle,
  Music,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

const questionBank = [
  'What should I work on today?',
  'Show me everything waiting for my approval.',
  'What will make me the most money this week?',
  'Which song is closest to release?',
  'Draft three TikToks for Without You Here.',
  'Which coaching products are still incomplete?',
  'Show me all outstanding producer conversations.',
];

const phaseOneModules = [
  { title: 'Owner Dashboard', status: 'live locally', route: '/admin', icon: Brain },
  { title: 'Daily Briefing Engine', status: 'first version here', route: '/admin/ask-gannon-os', icon: Lightbulb },
  { title: 'Unified Task Manager', status: 'next build', route: '/admin/scheduler', icon: ClipboardList },
  { title: 'Communications Centre', status: 'next build', route: '/admin/notifications', icon: MessageCircle },
  { title: 'Revenue Dashboard', status: 'existing hub', route: '/admin/todays-money-moves', icon: DollarSign },
  { title: 'AI Workforce', status: 'existing hub', route: '/admin/automation-agents', icon: Sparkles },
  { title: 'Content Pipeline', status: 'existing hub', route: '/admin/launch-content', icon: Megaphone },
];

function moneyValue(value) {
  return Number(value || 0).toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  });
}

function countPendingApprovals(approvals, socialAssets, calendarPosts) {
  const approvalQueue = approvals.filter(a => ['pending', 'awaiting_approval', 'draft'].includes(a.status)).length;
  const rawAssets = socialAssets.filter(a => ['raw', 'needs_review', 'pending'].includes(a.status)).length;
  const contentPosts = calendarPosts.filter(p => ['draft', 'awaiting_approval', 'approved'].includes(p.status)).length;
  return approvalQueue + rawAssets + contentPosts;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning Gannon.';
  if (hour < 18) return 'Good afternoon Gannon.';
  return 'Good evening Gannon.';
}

function buildDailyContext(data) {
  const {
    orders,
    approvals,
    socialAssets,
    calendarPosts,
    notifications,
    releases,
    issues,
    leads,
    agentLogs,
  } = data;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const activeOrders = orders.filter(o => !['cancelled', 'refunded', 'deleted', 'duplicate'].includes(o.status) && o.financial_status !== 'duplicate_void');
  const weekRevenue = activeOrders
    .filter(o => !o.created_date || new Date(o.created_date) >= weekAgo)
    .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  const pendingOrders = activeOrders.filter(o => ['pending', 'confirmed', 'processing', 'paid'].includes(o.status) && o.status !== 'shipped');
  const pendingApprovals = countPendingApprovals(approvals, socialAssets, calendarPosts);
  const replyMessages = notifications.filter(n => n.requires_action && !n.is_read);
  const contentReady = calendarPosts.filter(p => ['approved', 'ready', 'scheduled'].includes(p.status));
  const musicProgress = releases.filter(r => !['released', 'archived'].includes(r.status || 'draft'));
  const openIssues = issues.filter(i => ['open', 'investigating', 'critical'].includes(i.status || 'open'));
  const todayAgentLogs = agentLogs.filter(l => l.created_date && new Date(l.created_date).toDateString() === new Date().toDateString());

  return {
    activeOrders,
    weekRevenue,
    pendingOrders,
    pendingApprovals,
    replyMessages,
    contentReady,
    musicProgress,
    openIssues,
    leads,
    todayAgentLogs,
  };
}

function getClosestRelease(releases) {
  if (!releases.length) return null;

  const ranked = releases
    .map(release => {
      const score =
        (release.status === 'ready' ? 5 : 0) +
        (release.artwork_url || release.cover_art_url ? 2 : 0) +
        (release.spotify_url || release.streaming_url ? 2 : 0) +
        (release.lyrics ? 1 : 0);
      return { release, score };
    })
    .sort((a, b) => b.score - a.score);

  return ranked[0];
}

function answerQuestion(question, data, context) {
  const q = question.toLowerCase();

  if (!question.trim()) {
    return {
      title: 'Ask me the thing you would normally go hunting for.',
      bullets: [
        'Try: “What should I work on today?”',
        'Try: “What will make me the most money this week?”',
        'Try: “Show me everything waiting for approval.”',
      ],
      route: '/admin',
      routeLabel: 'Back to Owner Desktop',
    };
  }

  if (q.includes('approval') || q.includes('waiting')) {
    return {
      title: `${context.pendingApprovals} item${context.pendingApprovals === 1 ? '' : 's'} are waiting for approval.`,
      bullets: [
        `${data.approvals.length} ApprovalQueue records loaded.`,
        `${data.socialAssets.length} social assets checked.`,
        `${data.calendarPosts.length} content-calendar records checked.`,
        'Nothing should publish or schedule until you approve it.',
      ],
      route: '/admin/approval-queue',
      routeLabel: 'Open Approval Queue',
    };
  }

  if (q.includes('money') || q.includes('revenue') || q.includes('income')) {
    return {
      title: `Best money move: push one approved offer today, not ten half-finished ones.`,
      bullets: [
        `Tracked revenue this week: ${moneyValue(context.weekRevenue)}.`,
        `${context.pendingOrders.length} order${context.pendingOrders.length === 1 ? '' : 's'} may need fulfilment or follow-up.`,
        'Fastest cash path: one approved content asset that points to merch, coaching, or support.',
        'Best coaching path: finish one free lead magnet, then sell the paid reset/vault offer.',
      ],
      route: '/admin/todays-money-moves',
      routeLabel: "Open Today's Money Moves",
    };
  }

  if (q.includes('song') || q.includes('release') || q.includes('music')) {
    const closest = getClosestRelease(data.releases);
    return {
      title: closest ? `Closest release candidate: ${closest.release.title || closest.release.name || 'Untitled release'}.` : 'No release records are loaded in this local view yet.',
      bullets: closest
        ? [
            `Readiness score: ${closest.score}/10 from available fields.`,
            `Status: ${closest.release.status || 'not set'}.`,
            'Open Releases to confirm artwork, lyrics, streaming links, promo assets and merch tie-ins.',
          ]
        : [
            'Open Music Command Centre/Releases and confirm current song records.',
            'Without You Here should be treated as a priority launch track because the Mum’s Garden page depends on it.',
            'Next required data: artwork, audio preview, lyrics approval, release date and promo plan.',
          ],
      route: '/admin/releases',
      routeLabel: 'Open Releases',
    };
  }

  if (q.includes('tiktok') || q.includes('draft') || q.includes('without you here')) {
    return {
      title: 'Three safe TikTok draft angles for Without You Here.',
      bullets: [
        'Draft 1 — “I wrote this in my lounge room because grief needed somewhere to go.”',
        'Draft 2 — “This is not just a song. It is a place to sit with Mum for a minute.”',
        'Draft 3 — “If you have ever missed someone so much your chest hurt, this one is for you.”',
        'Send the best one into ApprovalQueue before scheduling or posting.',
      ],
      route: '/admin/social-post-factory',
      routeLabel: 'Open Social Post Factory',
    };
  }

  if (q.includes('coach') || q.includes('skool') || q.includes('product')) {
    return {
      title: 'Coaching is staged, but the paid product layer is not fully complete yet.',
      bullets: [
        `${context.leads.length} coaching/system lead record${context.leads.length === 1 ? '' : 's'} loaded.`,
        'Skool has welcome + pricing posts, but cover/icon upload and final paid gate choice still need approval.',
        'Workbooks/journals need to become real resources/products inside the app before launch.',
        'Keep only two free items; make the deeper workbook/course library paid.',
      ],
      route: '/admin/coaching-command',
      routeLabel: 'Open Coaching Command',
    };
  }

  if (q.includes('producer') || q.includes('conversation') || q.includes('messages') || q.includes('inbox')) {
    return {
      title: 'Producer and message tracking needs the Communications Centre build.',
      bullets: [
        `${context.replyMessages.length} action message${context.replyMessages.length === 1 ? '' : 's'} are currently visible through admin notifications.`,
        'Gmail, Skool, Instagram, Facebook, TikTok comments and producer threads are not yet unified into one inbox.',
        'Next build should create draft-only communication records with approval required before sending.',
      ],
      route: '/admin/notifications',
      routeLabel: 'Open Current Notifications',
    };
  }

  return {
    title: 'Here is the operating-system answer from the current data.',
    bullets: [
      `Revenue this week: ${moneyValue(context.weekRevenue)}.`,
      `${context.pendingApprovals} approval item${context.pendingApprovals === 1 ? '' : 's'} need a decision.`,
      `${context.replyMessages.length} message/alert item${context.replyMessages.length === 1 ? '' : 's'} require attention.`,
      `${context.openIssues.length} system issue${context.openIssues.length === 1 ? '' : 's'} are open.`,
      'My recommendation: action one money move, one content draft, and one coaching setup task today.',
    ],
    route: '/admin',
    routeLabel: 'Open Owner Desktop',
  };
}

function MetricCard({ label, value, desc, icon: Icon, tone = 'text-primary' }) {
  return (
    <Card className="border-border/40 bg-secondary/10">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${tone}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{desc}</p>
          </div>
          <Icon className={`w-5 h-5 ${tone} shrink-0`} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AskGannonOS() {
  const [question, setQuestion] = useState('What should I work on today?');

  const { data: orders = [] } = useQuery({ queryKey: ['ask-os-orders'], queryFn: () => base44.entities.MerchOrder.list('-created_date', 100), initialData: [] });
  const { data: approvals = [] } = useQuery({ queryKey: ['ask-os-approvals'], queryFn: () => base44.entities.ApprovalQueue.list('-created_date', 100), initialData: [] });
  const { data: socialAssets = [] } = useQuery({ queryKey: ['ask-os-social-assets'], queryFn: () => base44.entities.SocialAsset.list('-created_date', 100), initialData: [] });
  const { data: calendarPosts = [] } = useQuery({ queryKey: ['ask-os-calendar-posts'], queryFn: () => base44.entities.ContentCalendarPost.list('-created_date', 100), initialData: [] });
  const { data: notifications = [] } = useQuery({ queryKey: ['ask-os-notifications'], queryFn: () => base44.entities.AdminNotification.list('-created_date', 100), initialData: [] });
  const { data: releases = [] } = useQuery({ queryKey: ['ask-os-releases'], queryFn: () => base44.entities.Release.list('-created_date', 100), initialData: [] });
  const { data: issues = [] } = useQuery({ queryKey: ['ask-os-issues'], queryFn: () => base44.entities.SystemHealthIssue.list('-created_date', 100), initialData: [] });
  const { data: leads = [] } = useQuery({ queryKey: ['ask-os-leads'], queryFn: () => base44.entities.SystemsManagerLead.list('-created_date', 100), initialData: [] });
  const { data: agentLogs = [] } = useQuery({ queryKey: ['ask-os-agent-logs'], queryFn: () => base44.entities.AgentTaskLog.list('-created_date', 100), initialData: [] });

  const data = useMemo(() => ({
    orders,
    approvals,
    socialAssets,
    calendarPosts,
    notifications,
    releases,
    issues,
    leads,
    agentLogs,
  }), [agentLogs, approvals, calendarPosts, issues, leads, notifications, orders, releases, socialAssets]);

  const context = useMemo(() => buildDailyContext(data), [data]);
  const answer = useMemo(() => answerQuestion(question, data, context), [context, data, question]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-1">Gannon Waye OS</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Ask Gannon OS</h1>
          <p className="font-body text-sm text-muted-foreground mt-1 max-w-2xl">
            Ask one question and get a private operating answer from your music, coaching, content, revenue, agents and site-health modules.
          </p>
        </div>
        <Badge className="bg-green-500/10 text-green-300 border border-green-500/20">draft-only · approval-gated</Badge>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">{getGreeting()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              This is the first local Daily Briefing Engine. It summarises and routes work; it does not send, publish, charge, invite or schedule anything.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard icon={DollarSign} label="Revenue this week" value={moneyValue(context.weekRevenue)} desc={`${context.activeOrders.length} active orders`} tone="text-green-400" />
        <MetricCard icon={ClipboardList} label="Approvals" value={context.pendingApprovals} desc="approval/content queue" tone={context.pendingApprovals ? 'text-yellow-400' : 'text-green-400'} />
        <MetricCard icon={Bell} label="Replies / alerts" value={context.replyMessages.length} desc="requires action" tone={context.replyMessages.length ? 'text-red-300' : 'text-green-400'} />
        <MetricCard icon={AlertTriangle} label="Website health" value={context.openIssues.length} desc="open issues" tone={context.openIssues.length ? 'text-red-300' : 'text-green-400'} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:items-start">
        <Card className="xl:col-span-2 border-border/40">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" /> Ask the operating system
            </CardTitle>
            <CardDescription className="text-xs">
              Start with one of the prompts or type your own. This version uses local system logic; later this can be connected to the full AI answer engine.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="What should I work on today?"
              className="min-h-24 bg-background/60"
            />
            <div className="flex flex-wrap gap-2">
              {questionBank.map(item => (
                <Button key={item} size="sm" variant="outline" className="text-xs border-border/50" onClick={() => setQuestion(item)}>
                  {item}
                </Button>
              ))}
            </div>

            <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-xl text-foreground">{answer.title}</h2>
                  <ul className="mt-4 space-y-2">
                    {answer.bullets.map(bullet => (
                      <li key={bullet} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={answer.route} className="inline-flex mt-5">
                    <Button size="sm" className="gradient-gold-button border-0 text-xs">
                      {answer.routeLabel} <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Biggest impact today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3">
                <p className="font-semibold text-foreground">One money action</p>
                <p className="text-muted-foreground mt-1">Choose one approved offer/content path and move it forward today.</p>
              </div>
              <div className="rounded-xl border border-pink-500/20 bg-pink-500/10 p-3">
                <p className="font-semibold text-foreground">One content asset</p>
                <p className="text-muted-foreground mt-1">Create or polish one post tied to a real offer, not a random idea.</p>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
                <p className="font-semibold text-foreground">One coaching setup task</p>
                <p className="text-muted-foreground mt-1">Finish the Skool visual upload or confirm the paid/free access model.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" /> Phase 1 modules
              </CardTitle>
              <CardDescription className="text-xs">The first week build order from the OS brief.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {phaseOneModules.map(module => {
                const Icon = module.icon;
                return (
                  <Link key={module.title} to={module.route}>
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/30 bg-secondary/10 px-3 py-2 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-xs font-medium truncate">{module.title}</span>
                      </div>
                      <Badge className="bg-secondary text-muted-foreground text-[10px] shrink-0">{module.status}</Badge>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-4 flex items-start gap-3">
              <Users className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Missing future connection</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Gmail, Skool messages, socials comments and producer conversations still need a proper Communications Centre entity before this becomes a true one-inbox system.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
