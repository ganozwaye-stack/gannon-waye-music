import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import {
  Globe, ArrowLeft, CheckCircle2, XCircle, Clock, AlertTriangle,
  TrendingUp, Zap, ChevronRight, Eye, ArrowUpRight, Activity, Star
} from 'lucide-react';
import { toast } from 'sonner';

const EVOLUTION_ITEMS = [
  {
    id: 'checkout_addons',
    title: 'Remove Unapproved Checkout Add-ons',
    category: 'Commerce',
    priority: 'critical',
    status: 'done',
    description: 'All unapproved checkout add-ons have been removed. No bundled upsells are live unless explicitly approved.',
    route: '/admin/ecommerce-command',
    impact: 'Revenue integrity — prevents charging fans for unapproved items',
  },
  {
    id: 'bundle_approval',
    title: 'Bundle Approval Gate',
    category: 'Commerce',
    priority: 'done',
    status: 'done',
    description: 'Bundle Proposal Studio created. No bundle publishes without Gannon approval. All proposals go to Approval Queue.',
    route: '/admin/bundle-proposal-studio',
    impact: 'Revenue control — every bundle must be reviewed before going live',
  },
  {
    id: 'order_metrics',
    title: 'Order Status Separation',
    category: 'Commerce',
    priority: 'done',
    status: 'done',
    description: 'Active revenue totals exclude cancelled, refunded, and deleted orders. All status categories separated and clickable.',
    route: '/admin/orders',
    impact: 'Financial clarity — revenue figures are accurate and trustworthy',
  },
  {
    id: 'profit_intelligence',
    title: 'Profit/Loss per Order',
    category: 'Commerce',
    priority: 'done',
    status: 'done',
    description: 'Full profit calculation: sale price → discount → delivery → Stripe fee → product cost → net profit → margin %',
    route: '/admin/order-profit-intelligence',
    impact: 'Know exactly what every order earns after all costs',
  },
  {
    id: 'coaching_gate',
    title: 'Coaching System Private Gate',
    category: 'Coaching',
    priority: 'done',
    status: 'done',
    description: 'COACHING_PUBLIC_LAUNCH_ENABLED = false. All coaching pages are admin-only. No public exposure until approved.',
    route: '/admin/coaching-command',
    impact: 'Zero legal/reputational risk from premature coaching launch',
  },
  {
    id: 'tiktok_oauth',
    title: 'TikTok OAuth + Draft Upload',
    category: 'Social',
    priority: 'done',
    status: 'done',
    description: 'TikTok OAuth fixed — popup flow, same-tab fallback, secure token storage. Draft upload with SELF_ONLY + approval gate.',
    route: '/tiktok-platform-review',
    impact: 'TikTok content pipeline operational for developer review submission',
  },
  {
    id: 'agent_matrix',
    title: 'Agent Capability Matrix',
    category: 'Intelligence',
    priority: 'done',
    status: 'done',
    description: 'Full agent capability, blocker, tool access, ROI, and daily work queue matrix. Every agent documented.',
    route: '/admin/agent-capability-matrix',
    impact: 'Complete visibility into what agents can and cannot do',
  },
  {
    id: 'clickability',
    title: 'Full Site Clickability Audit',
    category: 'UX',
    priority: 'in_progress',
    status: 'in_progress',
    description: 'All admin cards, metrics, tabs, and rows are clickable and lead to source data. Dead-end dashboards eliminated.',
    route: '/admin/site-function-audit',
    impact: 'Every number traces to its source — no dead-end metrics',
  },
  {
    id: 'sync_licensing',
    title: 'Sync Licensing Command Centre',
    category: 'Music',
    priority: 'done',
    status: 'done',
    description: 'Full sync licensing pipeline: readiness checklist, platform guide, pitch preparation, song testing framework.',
    route: '/admin/sync-licensing-command',
    impact: 'Highest potential per-song income stream now has a working pipeline',
  },
  {
    id: 'tiktok_secret_rotation',
    title: 'Rotate TikTok Client Secret',
    category: 'Security',
    priority: 'critical',
    status: 'blocked',
    description: 'TikTok client secret was exposed in version history. Must rotate before production submission.',
    blocker: 'Requires Gannon to log into TikTok Developer Portal and regenerate the secret, then update TIKTOK_CLIENT_SECRET env var',
    route: '/admin/security-centre',
    impact: 'Security critical — prevents unauthorized access to TikTok account',
  },
  {
    id: 'tiktok_dev_review',
    title: 'TikTok Developer Review Submission',
    category: 'Social',
    priority: 'blocked',
    status: 'blocked',
    description: 'Demo video and documentation required for TikTok\'s manual developer review. All scopes and flows must be documented.',
    blocker: 'Requires: demo video recording, TikTok Developer Portal submission, 5-30 day review period',
    route: '/admin/tiktok-screen-guide',
    impact: 'Required for real TikTok users to use the connect flow',
  },
];

const STATUS_COLOR = {
  done: 'bg-green-500/20 text-green-400 border-green-500/30',
  in_progress: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  blocked: 'bg-red-500/20 text-red-400 border-red-500/30',
  planned: 'bg-slate-500/20 text-slate-400',
};
const PRIORITY_COLOR = {
  critical: 'bg-red-500/20 text-red-400',
  high: 'bg-orange-500/20 text-orange-400',
  done: 'bg-green-500/20 text-green-400',
  blocked: 'bg-red-500/20 text-red-400',
  in_progress: 'bg-yellow-500/20 text-yellow-400',
};

export default function WebsiteEvolution() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState('all');

  const { data: settings = [] } = useQuery({
    queryKey: ['site-settings-evolution'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });
  const siteSettings = settings[0];
  const campaignSectionLive = siteSettings?.show_thank_you_campaign_section !== false;

  const toggleCampaignSection = useMutation({
    mutationFn: async (show) => {
      if (siteSettings?.id) {
        return base44.entities.SiteSettings.update(siteSettings.id, { show_thank_you_campaign_section: show });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['site-settings-evolution'] });
      qc.invalidateQueries({ queryKey: ['siteSettings'] });
      toast.success(campaignSectionLive ? 'Campaign section hidden (rolled back)' : 'Campaign section now live');
    },
  });

  const done = EVOLUTION_ITEMS.filter(i => i.status === 'done');
  const inProgress = EVOLUTION_ITEMS.filter(i => i.status === 'in_progress');
  const blocked = EVOLUTION_ITEMS.filter(i => i.status === 'blocked');

  const filtered = tab === 'all' ? EVOLUTION_ITEMS : tab === 'done' ? done : tab === 'blocked' ? blocked : inProgress;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary/40 rounded transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Website Evolution Engine</h1>
          <p className="text-muted-foreground text-sm">Every system upgrade — status, impact, source chain, and what requires action</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-green-500/20"><CardContent className="p-4"><p className="text-2xl font-bold text-green-400">{done.length}</p><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
        <Card className="border-yellow-500/20"><CardContent className="p-4"><p className="text-2xl font-bold text-yellow-400">{inProgress.length}</p><p className="text-xs text-muted-foreground">In Progress</p></CardContent></Card>
        <Card className="border-red-500/20"><CardContent className="p-4"><p className="text-2xl font-bold text-red-400">{blocked.length}</p><p className="text-xs text-muted-foreground">Blocked</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-primary">{EVOLUTION_ITEMS.length}</p><p className="text-xs text-muted-foreground">Total Items</p></CardContent></Card>
      </div>

      {/* ── HOMEPAGE APPROVAL GATE ─────────────────────────── */}
      <div className={`rounded-xl border p-5 space-y-4 ${campaignSectionLive ? 'border-amber-500/40 bg-amber-500/5' : 'border-border/40 bg-secondary/10'}`}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${campaignSectionLive ? 'bg-amber-400 animate-pulse' : 'bg-secondary'}`} />
            <div>
              <p className="font-semibold text-sm text-foreground">Thank You Campaign Section — Homepage</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={campaignSectionLive ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px] uppercase tracking-wider' : 'bg-secondary text-muted-foreground text-[9px] uppercase tracking-wider'}>
                  {campaignSectionLive ? 'LIVE — AWAITING GANNON REVIEW' : 'HIDDEN / ROLLED BACK'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Thank You artwork section below hero — went live with code deploy. Hero quote preserved and untouched.
                Use the buttons below to approve (keep live) or rollback (hide it) until you're ready.
              </p>
            </div>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs shrink-0">
              <Eye className="w-3 h-3" />Preview Live
            </Button>
          </a>
        </div>

        <div className="bg-secondary/30 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
          <p><strong className="text-foreground">What's live:</strong> Campaign artwork + copy + 4 CTAs (Support, Pre-Save, Store, Founding Supporters)</p>
          <p><strong className="text-foreground">Hero quote:</strong> ✅ Preserved — "For them, it was about appearance. For me, I was breaking inside."</p>
          <p><strong className="text-foreground">Placement:</strong> Below ThankYouSingle section, above The Story section</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {campaignSectionLive ? (
            <>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 border-0 gap-1.5 text-xs"
                onClick={() => toggleCampaignSection.mutate(true)}
                disabled={toggleCampaignSection.isPending}>
                <CheckCircle2 className="w-3 h-3" />Approve — Keep Live
              </Button>
              <Button size="sm" variant="destructive" className="gap-1.5 text-xs"
                onClick={() => toggleCampaignSection.mutate(false)}
                disabled={toggleCampaignSection.isPending}>
                <XCircle className="w-3 h-3" />Rollback — Hide Section
              </Button>
            </>
          ) : (
            <Button size="sm" className="gradient-gold-button border-0 gap-1.5 text-xs"
              onClick={() => toggleCampaignSection.mutate(true)}
              disabled={toggleCampaignSection.isPending}>
              <CheckCircle2 className="w-3 h-3" />Re-publish Section
            </Button>
          )}
          <Link to="/admin/approval-queue">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Clock className="w-3 h-3" />View Approval Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Blocked items — show prominently */}
      {blocked.length > 0 && (
        <div className="border border-red-500/30 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-red-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />Blocked — Requires Manual Action</p>
          {blocked.map(item => (
            <div key={item.id} className="bg-red-500/5 rounded-lg p-3">
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-xs text-red-300/80 mt-1">🔒 {item.blocker}</p>
              <Link to={item.route}><Button size="sm" variant="outline" className="mt-2 text-xs border-red-500/30 text-red-400 gap-1"><Eye className="w-3 h-3" />View</Button></Link>
            </div>
          ))}
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({EVOLUTION_ITEMS.length})</TabsTrigger>
          <TabsTrigger value="done">Done ({done.length})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({inProgress.length})</TabsTrigger>
          <TabsTrigger value="blocked">Blocked ({blocked.length})</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4 space-y-3">
          {filtered.map(item => (
            <Link key={item.id} to={item.route}>
              <div className="border border-border rounded-xl p-4 hover:border-primary/40 hover:bg-secondary/10 transition-all group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <Badge className={`text-xs ${STATUS_COLOR[item.status]}`}>{item.status.replace('_', ' ')}</Badge>
                      <Badge className="text-xs bg-secondary text-secondary-foreground">{item.category}</Badge>
                    </div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    {item.blocker && <p className="text-xs text-red-400 mt-1">🔒 {item.blocker}</p>}
                    <p className="text-xs text-green-400 mt-1">💡 {item.impact}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}