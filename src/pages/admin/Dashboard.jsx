import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardList,
  Command,
  DollarSign,
  ExternalLink,
  Heart,
  Lightbulb,
  Megaphone,
  Package,
  Radio,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';

const externalTools = [
  { label: 'Skool Community', href: 'https://www.skool.com/gannon-waye-resilience-7022', desc: 'Mindset mentoring community' },
  { label: 'Pressmaster Twin', href: 'https://app.pressmaster.ai/identity-os/twin', desc: 'Brand brain + post ideas' },
  { label: 'HeyGen', href: 'https://app.heygen.com', desc: 'AI avatar/video creation' },
  { label: 'Metricool', href: 'https://app.metricool.com', desc: 'Approved scheduling only' },
  { label: 'Stripe', href: 'https://dashboard.stripe.com', desc: 'Payments + payouts' },
  { label: 'Google Drive Vault', href: 'https://drive.google.com/drive/my-drive', desc: 'Master assets + approvals' },
  { label: 'Base44 Editor', href: 'https://app.base44.com', desc: 'Website/app builder' },
];

const operatingHubs = [
  {
    title: 'Money Desk',
    desc: 'Revenue, orders, Stripe, margins and what can make money today.',
    icon: DollarSign,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    links: [
      { label: "Today's Money Moves", to: '/admin/todays-money-moves' },
      { label: 'Store & Orders Hub', to: '/admin/store-orders' },
      { label: 'Stripe Command Centre', to: '/admin/stripe-command-centre' },
      { label: 'Weekly Money Report', to: '/admin/weekly-money-report' },
    ],
  },
  {
    title: 'Content + Social',
    desc: 'Drafts, approvals, video scripts, Metricool queue and content performance.',
    icon: Megaphone,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    links: [
      { label: 'Launch & Content Hub', to: '/admin/launch-content' },
      { label: 'Daily Post Engine', to: '/admin/daily-post-engine' },
      { label: 'Social Schedule Queue', to: '/admin/social-schedule-queue' },
      { label: 'Metricool Command', to: '/admin/metricool-command' },
    ],
  },
  {
    title: 'Coaching + Skool',
    desc: 'Mindset mentoring offers, client readiness, resources, workbook library and Skool setup.',
    icon: BookOpen,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    links: [
      { label: 'Coaching Command', to: '/admin/coaching-command' },
      { label: 'Coaching Programs', to: '/admin/coaching-programs' },
      { label: 'Coaching Content Library', to: '/admin/coaching-content-library' },
      { label: 'Client Management', to: '/admin/client-management' },
    ],
  },
  {
    title: 'AI Agents',
    desc: 'Agent registry, task log, learning loop, approval gates and automation status.',
    icon: Brain,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    links: [
      { label: 'Ask Gannon OS', to: '/admin/ask-gannon-os' },
      { label: 'Automation & Agents', to: '/admin/automation-agents' },
      { label: 'Agent Registry', to: '/admin/agent-registry' },
      { label: 'Agent Task Log', to: '/admin/agent-task-log' },
      { label: 'Agent Revenue Status', to: '/admin/agent-revenue-status' },
    ],
  },
  {
    title: 'Creative Studio',
    desc: 'Artwork, merch visuals, AI twin video planning, campaigns and asset approvals.',
    icon: Sparkles,
    color: 'text-amber-300',
    bg: 'bg-amber-500/10',
    links: [
      { label: 'AI Twin Content Studio', to: '/admin/ai-twin-content-studio' },
      { label: 'Creative Studio', to: '/admin/creative-studio' },
      { label: 'Social Asset Library', to: '/admin/social-asset-library' },
      { label: 'Campaign Image Approval', to: '/admin/campaign-image-approval' },
      { label: 'Video Agent Command', to: '/admin/video-agent-command' },
    ],
  },
  {
    title: "Mum's Garden",
    desc: 'Memorial page, family submissions, music journey and launch preparation.',
    icon: Heart,
    color: 'text-rose-300',
    bg: 'bg-rose-500/10',
    links: [
      { label: "Mum's Garden Page", to: '/mum?access=soniagarden2026' },
      { label: 'Mum Admin', to: '/admin/mum' },
      { label: 'Tribute Studio', to: '/admin/mum-tribute-studio' },
      { label: 'Music Releases', to: '/admin/releases' },
    ],
  },
];

const defaultActions = [
  {
    title: 'Approve one money-making action',
    desc: 'Open Today’s Money Moves and choose one action that can be pushed forward today.',
    to: '/admin/todays-money-moves',
    icon: Zap,
    tone: 'green',
  },
  {
    title: 'Turn one idea into one ready post',
    desc: 'Use Launch & Content to move a draft through script, media, caption and approval.',
    to: '/admin/launch-content',
    icon: Megaphone,
    tone: 'pink',
  },
  {
    title: 'Progress the coaching offer',
    desc: 'Review the Skool/pricing copy and keep the coaching system staged until final approval.',
    to: '/admin/coaching-command',
    icon: BookOpen,
    tone: 'cyan',
  },
];

const toneClasses = {
  red: 'border-red-500/30 bg-red-500/10 text-red-300',
  yellow: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
  green: 'border-green-500/30 bg-green-500/10 text-green-300',
  pink: 'border-pink-500/30 bg-pink-500/10 text-pink-300',
  cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
};

function countToday(items) {
  const today = new Date().toDateString();
  return items.filter(item => item.created_date && new Date(item.created_date).toDateString() === today).length;
}

function moneyValue(value) {
  return Number(value || 0).toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  });
}

function SummaryCard({ icon: Icon, label, value, desc, to, color = 'text-primary' }) {
  const body = (
    <Card className="h-full border-border/40 bg-secondary/10 hover:border-primary/40 hover:bg-secondary/20 transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{desc}</p>
          </div>
          <Icon className={`w-5 h-5 ${color} shrink-0`} />
        </div>
      </CardContent>
    </Card>
  );

  return to ? <Link to={to}>{body}</Link> : body;
}

function ActionRow({ action }) {
  const Icon = action.icon;
  return (
    <Link to={action.to}>
      <div className={`group rounded-xl border p-4 transition-all hover:translate-x-0.5 ${toneClasses[action.tone] || toneClasses.green}`}>
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm text-foreground">{action.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
          </div>
          <ArrowUpRight className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
}

function HubCard({ hub }) {
  const Icon = hub.icon;
  return (
    <Card className="border-border/40 bg-card/80 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={`${hub.bg} p-2.5 rounded-xl`}>
            <Icon className={`w-5 h-5 ${hub.color}`} />
          </div>
          <div>
            <CardTitle className="text-base font-display">{hub.title}</CardTitle>
            <CardDescription className="text-xs mt-1">{hub.desc}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 grid grid-cols-1 gap-2">
        {hub.links.map(link => (
          <Link key={`${hub.title}-${link.label}`} to={link.to}>
            <div className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/10 px-3 py-2 text-xs hover:bg-secondary/30 hover:text-foreground transition-colors">
              <span>{link.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: orders = [] } = useQuery({
    queryKey: ['owner-desktop-orders'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 100),
    initialData: [],
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ['owner-desktop-approval-queue'],
    queryFn: () => base44.entities.ApprovalQueue.list('-created_date', 100),
    initialData: [],
  });

  const { data: socialAssets = [] } = useQuery({
    queryKey: ['owner-desktop-social-assets'],
    queryFn: () => base44.entities.SocialAsset.list('-created_date', 100),
    initialData: [],
  });

  const { data: calendarPosts = [] } = useQuery({
    queryKey: ['owner-desktop-calendar-posts'],
    queryFn: () => base44.entities.ContentCalendarPost.list('-created_date', 100),
    initialData: [],
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['owner-desktop-notifications'],
    queryFn: () => base44.entities.AdminNotification.list('-created_date', 100),
    initialData: [],
  });

  const { data: agentLogs = [] } = useQuery({
    queryKey: ['owner-desktop-agent-logs'],
    queryFn: () => base44.entities.AgentTaskLog.list('-created_date', 100),
    initialData: [],
  });

  const { data: issues = [] } = useQuery({
    queryKey: ['owner-desktop-health-issues'],
    queryFn: () => base44.entities.SystemHealthIssue.list('-created_date', 100),
    initialData: [],
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['owner-desktop-leads'],
    queryFn: () => base44.entities.SystemsManagerLead.list('-created_date', 50),
    initialData: [],
  });

  const activeOrders = useMemo(
    () => orders.filter(o => !['cancelled', 'refunded', 'deleted', 'duplicate'].includes(o.status) && o.financial_status !== 'duplicate_void'),
    [orders]
  );

  const pendingOrders = useMemo(
    () => activeOrders.filter(o => ['pending', 'confirmed', 'processing', 'paid'].includes(o.status) && o.status !== 'shipped'),
    [activeOrders]
  );

  const activeRevenue = useMemo(
    () => activeOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
    [activeOrders]
  );

  const pendingApprovalCount = useMemo(() => {
    const queuePending = approvals.filter(a => ['pending', 'awaiting_approval', 'draft'].includes(a.status)).length;
    const rawAssets = socialAssets.filter(a => ['raw', 'needs_review', 'pending'].includes(a.status)).length;
    return queuePending + rawAssets;
  }, [approvals, socialAssets]);

  const draftPostCount = useMemo(
    () => calendarPosts.filter(p => ['draft', 'awaiting_approval', 'approved'].includes(p.status)).length,
    [calendarPosts]
  );

  const actionNotifications = useMemo(
    () => notifications.filter(n => n.requires_action && !n.is_read),
    [notifications]
  );

  const openIssues = useMemo(
    () => issues.filter(i => ['open', 'investigating', 'critical'].includes(i.status || 'open')),
    [issues]
  );

  const urgentActions = useMemo(() => {
    const dynamic = [];

    if (actionNotifications.length > 0) {
      dynamic.push({
        title: `${actionNotifications.length} business alert${actionNotifications.length === 1 ? '' : 's'} need attention`,
        desc: 'Open the Attention Centre and clear the items that block money, publishing or launch safety.',
        to: '/admin/business-attention-centre',
        icon: Bell,
        tone: 'red',
      });
    }

    if (pendingApprovalCount > 0) {
      dynamic.push({
        title: `${pendingApprovalCount} approval item${pendingApprovalCount === 1 ? '' : 's'} waiting`,
        desc: 'Approve, reject or edit before anything goes public or gets scheduled.',
        to: '/admin/approval-queue',
        icon: ClipboardList,
        tone: 'yellow',
      });
    }

    if (pendingOrders.length > 0) {
      dynamic.push({
        title: `${pendingOrders.length} order${pendingOrders.length === 1 ? '' : 's'} may need fulfilment`,
        desc: 'Check shipping, customer messages, tracking and order profit before closing the loop.',
        to: '/admin/store-orders?tab=orders',
        icon: Package,
        tone: 'green',
      });
    }

    if (openIssues.length > 0) {
      dynamic.push({
        title: `${openIssues.length} system issue${openIssues.length === 1 ? '' : 's'} open`,
        desc: 'Fix site health, payment, webhook or integration blockers before scaling traffic.',
        to: '/admin/site-health',
        icon: AlertTriangle,
        tone: 'red',
      });
    }

    return dynamic.length > 0 ? dynamic.slice(0, 4) : defaultActions;
  }, [actionNotifications.length, openIssues.length, pendingApprovalCount, pendingOrders.length]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-1">Gannon Waye OS</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Owner Desktop</h1>
          <p className="font-body text-sm text-muted-foreground mt-1 max-w-2xl">
            One front door for daily tasks, approvals, content, Skool/coaching, store money, agents, links and launch readiness.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/ask-gannon-os">
            <Button size="sm" variant="outline" className="text-xs border-primary/40 text-primary hover:bg-primary/10">
              Ask Gannon OS <Command className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link to="/admin/mission-control">
            <Button size="sm" className="gradient-gold-button border-0 text-xs">
              Mission Control <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link to="/admin/business-attention-centre">
            <Button size="sm" variant="outline" className="text-xs border-border/50">
              Attention Centre
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Safety rule is active</p>
              <p className="text-xs text-muted-foreground">
                Agents can draft, research, organise and prepare. They must not spend money, publish, change pricing, invite members or schedule posts without approval.
              </p>
            </div>
          </div>
          <Badge className="bg-green-500/10 text-green-300 border border-green-500/20 w-fit">approval-gated</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          icon={DollarSign}
          label="Tracked store revenue"
          value={moneyValue(activeRevenue)}
          desc={`${activeOrders.length} active order${activeOrders.length === 1 ? '' : 's'}`}
          to="/admin/store-orders"
          color="text-green-400"
        />
        <SummaryCard
          icon={ClipboardList}
          label="Needs approval"
          value={pendingApprovalCount}
          desc="Drafts, campaigns or agent actions"
          to="/admin/approval-queue"
          color={pendingApprovalCount > 0 ? 'text-yellow-400' : 'text-green-400'}
        />
        <SummaryCard
          icon={Megaphone}
          label="Content pipeline"
          value={draftPostCount}
          desc="Draft / approved / ready posts"
          to="/admin/launch-content"
          color="text-pink-400"
        />
        <SummaryCard
          icon={Activity}
          label="Agent work today"
          value={countToday(agentLogs)}
          desc={`${agentLogs.length} recent logged actions`}
          to="/admin/agent-task-log"
          color="text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" /> Today’s Command Stack
              </CardTitle>
              <CardDescription className="text-xs">
                The shortest route from “what do I do now?” to money, content, coaching or repairs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {urgentActions.map(action => <ActionRow key={action.title} action={action} />)}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {operatingHubs.map(hub => <HubCard key={hub.title} hub={hub} />)}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-border/40 bg-secondary/10">
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" /> Daily Brainstorm
              </CardTitle>
              <CardDescription className="text-xs">
                Use this as the repeatable money-making rhythm.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {[
                ['1', 'Pick one offer to sell today', 'Merch, coaching, support, music, or GanozMix.'],
                ['2', 'Create one proof asset', 'A post, story, video, email draft, image or short script.'],
                ['3', 'Send it through approval', 'Nothing public until approved and logged.'],
                ['4', 'Measure the result', 'Track clicks, replies, sales, bookings or saves.'],
              ].map(([step, title, desc]) => (
                <div key={step} className="flex gap-3 rounded-xl border border-border/30 bg-background/40 p-3">
                  <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center bg-primary/15 text-primary border border-primary/20">{step}</Badge>
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-primary" /> Outside Tools
              </CardTitle>
              <CardDescription className="text-xs">
                Your daily external links without hunting through browser tabs.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              {externalTools.map(tool => (
                <a key={tool.label} href={tool.href} target="_blank" rel="noopener noreferrer">
                  <div className="rounded-lg border border-border/30 bg-secondary/10 px-3 py-2 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{tool.label}</p>
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{tool.desc}</p>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Radio className="w-4 h-4 text-primary" /> Readiness Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/20 pb-2">
                <span className="text-muted-foreground">Order fulfilment</span>
                <Badge className={pendingOrders.length ? 'bg-yellow-500/10 text-yellow-300' : 'bg-green-500/10 text-green-300'}>
                  {pendingOrders.length ? `${pendingOrders.length} to check` : 'clear'}
                </Badge>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-2">
                <span className="text-muted-foreground">New leads</span>
                <Badge className={leads.length ? 'bg-cyan-500/10 text-cyan-300' : 'bg-secondary text-muted-foreground'}>
                  {leads.length}
                </Badge>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-2">
                <span className="text-muted-foreground">System issues</span>
                <Badge className={openIssues.length ? 'bg-red-500/10 text-red-300' : 'bg-green-500/10 text-green-300'}>
                  {openIssues.length ? `${openIssues.length} open` : 'none open'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Skool launch</span>
                <Badge className="bg-yellow-500/10 text-yellow-300">staged</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Best next move</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Review Skool pricing, upload the cover/icon manually, then action one approved content asset for the coaching offer.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
