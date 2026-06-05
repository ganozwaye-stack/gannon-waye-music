import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain, ArrowLeft, CheckCircle2, XCircle, Activity, ChevronRight
} from 'lucide-react';

const AGENTS = [
  {
    name: 'music_orchestrator', label: 'Music Orchestrator', group: 'orchestrator',
    capabilities: ['research', 'analyse', 'draft', 'notify_internally', 'create_approval_items'],
    blocked: ['publish', 'post_external', 'send_email_external'],
    roi: 9, skills: ['Strategy', 'Coordination', 'Priority Ranking'],
    tools: ['MusicAgentMemory', 'MusicLearningRecord', 'AgentActionProposal', 'AdminNotification'],
    daily_work: ['Scan opportunities', 'Prioritise actions', 'Brief Gannon'],
    revenue_contribution: 'Orchestrates all music revenue streams',
  },
  {
    name: 'merch_sales_agent', label: 'Merch Sales Agent', group: 'business',
    capabilities: ['research', 'analyse', 'score', 'draft', 'create_approval_items'],
    blocked: ['change_prices', 'publish_bundle', 'send_email_external'],
    roi: 8, skills: ['Bundle Strategy', 'Profit Analysis', 'Demand Forecasting'],
    tools: ['MerchProduct', 'MerchOrder', 'AgentActionProposal', 'BundleOffer', 'AdminNotification'],
    daily_work: ['Check stock levels', 'Analyse profit margins', 'Propose bundles'],
    revenue_contribution: 'Bundle proposals, upsell opportunities, margin analysis',
  },
  {
    name: 'fan_engagement_agent', label: 'Fan Engagement Agent', group: 'social',
    capabilities: ['research', 'analyse', 'draft', 'notify_internally'],
    blocked: ['send_email_external', 'post_external', 'contact_fans'],
    roi: 7, skills: ['Fan Psychology', 'Community Building', 'Retention'],
    tools: ['FanPost', 'FanComment', 'FanReview', 'AdminNotification', 'EmailSubscriber'],
    daily_work: ['Review fan activity', 'Flag high-value fans', 'Draft engagement strategies'],
    revenue_contribution: 'Fan retention, superfan identification, review generation',
  },
  {
    name: 'content_revenue_agent', label: 'Content Revenue Agent', group: 'social',
    capabilities: ['research', 'analyse', 'draft', 'create_approval_items'],
    blocked: ['upload_tiktok', 'post_external', 'send_email_external'],
    roi: 8, skills: ['Content Strategy', 'Hook Writing', 'Platform Algorithm'],
    tools: ['SocialVideo', 'GrowthOpportunity', 'AgentActionProposal', 'AdminNotification'],
    daily_work: ['Analyse trends', 'Draft content briefs', 'Propose TikTok uploads'],
    revenue_contribution: 'Content-to-cash pipeline, TikTok draft preparation',
  },
  {
    name: 'pricing_optimiser', label: 'Pricing Optimiser', group: 'finance',
    capabilities: ['research', 'analyse', 'score', 'summarise', 'create_approval_items'],
    blocked: ['change_prices', 'create_discounts', 'change_stripe_settings'],
    roi: 9, skills: ['Price Elasticity', 'Margin Analysis', 'Competitor Intel'],
    tools: ['MerchProduct', 'AgentActionProposal', 'AgentMemory', 'AdminNotification'],
    daily_work: ['Monitor competitor pricing', 'Calculate margin scenarios', 'Propose price adjustments'],
    revenue_contribution: 'Margin optimisation, discount strategy, premium positioning',
  },
  {
    name: 'sync_licensing_agent', label: 'Sync Licensing Agent', group: 'music',
    capabilities: ['research', 'analyse', 'draft', 'create_approval_items'],
    blocked: ['contact_music_supervisors', 'send_pitches', 'sign_contracts'],
    roi: 9, skills: ['Sync Research', 'Brief Writing', 'Catalogue Matching'],
    tools: ['Release', 'AgentActionProposal', 'MusicAgentMemory', 'AdminNotification'],
    daily_work: ['Research sync opportunities', 'Match songs to briefs', 'Draft pitch documents'],
    revenue_contribution: 'Sync licensing pipeline — potentially highest per-song income',
  },
  {
    name: 'booking_revenue_agent', label: 'Booking Revenue Agent', group: 'business',
    capabilities: ['research', 'analyse', 'draft', 'notify_internally'],
    blocked: ['confirm_bookings', 'send_contracts', 'contact_venues'],
    roi: 7, skills: ['Venue Research', 'Rate Analysis', 'Tour Routing'],
    tools: ['BookingEnquiry', 'AgentActionProposal', 'AdminNotification'],
    daily_work: ['Monitor booking requests', 'Research venue opportunities', 'Draft tour proposals'],
    revenue_contribution: 'Live performance revenue research and scheduling support',
  },
  {
    name: 'email_revenue_agent', label: 'Email Revenue Agent', group: 'communication',
    capabilities: ['research', 'analyse', 'draft', 'create_approval_items'],
    blocked: ['send_email_external', 'create_segments', 'mass_email'],
    roi: 8, skills: ['Email Copywriting', 'List Segmentation Strategy', 'Revenue Attribution'],
    tools: ['EmailSubscriber', 'AgentActionProposal', 'AdminNotification'],
    daily_work: ['Analyse subscriber segments', 'Draft campaign emails', 'Propose list growth strategies'],
    revenue_contribution: 'Email-to-sale attribution, campaign proposal pipeline',
  },
  {
    name: 'superfan_converter', label: 'Superfan Converter', group: 'community',
    capabilities: ['research', 'analyse', 'score', 'draft', 'notify_internally'],
    blocked: ['send_email_external', 'contact_fans', 'create_private_groups'],
    roi: 9, skills: ['Fan Journey Mapping', 'Tier Design', 'Retention Economics'],
    tools: ['SuperfanProfile', 'SupporterProfile', 'AdminNotification', 'AgentMemory'],
    daily_work: ['Score fan value', 'Identify upgrade opportunities', 'Draft tier incentives'],
    revenue_contribution: 'Superfan pipeline — highest LTV customer development',
  },
  {
    name: 'revenue_orchestrator', label: 'Revenue Orchestrator', group: 'orchestrator',
    capabilities: ['research', 'analyse', 'summarise', 'draft', 'create_approval_items', 'update_dashboards'],
    blocked: ['publish', 'post_external', 'change_prices', 'send_email_external'],
    roi: 10, skills: ['Revenue Attribution', 'Opportunity Scoring', 'Cross-Stream Coordination'],
    tools: ['AgentActionProposal', 'RevenueOpportunity', 'AdminNotification', 'AgentMemory'],
    daily_work: ['Aggregate revenue signals', 'Score opportunities', 'Create morning briefings'],
    revenue_contribution: 'Master revenue coordination — highest overall system ROI',
  },
];

const CAPABILITY_COLOR = {
  research: 'bg-blue-500/20 text-blue-400',
  analyse: 'bg-purple-500/20 text-purple-400',
  score: 'bg-cyan-500/20 text-cyan-400',
  summarise: 'bg-slate-500/20 text-slate-300',
  draft: 'bg-green-500/20 text-green-400',
  notify_internally: 'bg-yellow-500/20 text-yellow-400',
  create_approval_items: 'bg-orange-500/20 text-orange-400',
  update_dashboards: 'bg-pink-500/20 text-pink-400',
};

const ROI_COLOR = (n) => n >= 9 ? 'text-green-400' : n >= 7 ? 'text-yellow-400' : 'text-red-400';

export default function AgentCapabilityMatrix() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('matrix');

  const topROI = [...AGENTS].sort((a, b) => b.roi - a.roi);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary/40 rounded transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Agent Capability Matrix</h1>
          <p className="text-muted-foreground text-sm">Every agent, every skill, every permission, every blocker — source-linked</p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-primary">{AGENTS.length}</p><p className="text-xs text-muted-foreground">Total Agents</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-green-400">{AGENTS.filter(a=>a.roi>=9).length}</p><p className="text-xs text-muted-foreground">ROI Score 9+</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-yellow-400">{[...new Set(AGENTS.flatMap(a=>a.capabilities))].length}</p><p className="text-xs text-muted-foreground">Unique Capabilities</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-red-400">{[...new Set(AGENTS.flatMap(a=>a.blocked))].length}</p><p className="text-xs text-muted-foreground">Blocked Actions</p></CardContent></Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="matrix">Matrix</TabsTrigger>
          <TabsTrigger value="roi">ROI Ranking</TabsTrigger>
          <TabsTrigger value="tools">Tool Access</TabsTrigger>
          <TabsTrigger value="blockers">Blockers</TabsTrigger>
          <TabsTrigger value="daily">Daily Work Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="mt-4 space-y-3">
          {AGENTS.map(agent => (
            <button key={agent.name} onClick={() => setSelected(agent)}
              className="w-full text-left border border-border rounded-xl p-4 hover:border-primary/40 hover:bg-secondary/10 transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">{agent.label}</span>
                    <Badge className="text-xs bg-secondary text-secondary-foreground">{agent.group}</Badge>
                    <span className={`text-sm font-bold ${ROI_COLOR(agent.roi)}`}>ROI {agent.roi}/10</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {agent.capabilities.map(c => (
                      <span key={c} className={`text-xs px-2 py-0.5 rounded-full ${CAPABILITY_COLOR[c] || 'bg-secondary text-secondary-foreground'}`}>{c.replace(/_/g,' ')}</span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{agent.revenue_contribution}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </TabsContent>

        <TabsContent value="roi" className="mt-4 space-y-2">
          {topROI.map((agent, i) => (
            <button key={agent.name} onClick={() => setSelected(agent)}
              className="w-full text-left border border-border rounded-xl p-4 hover:border-primary/40 transition-all flex items-center gap-4 group">
              <span className="text-2xl font-bold text-muted-foreground/30 w-8 shrink-0">#{i+1}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm">{agent.label}</span>
                  <span className={`text-base font-bold ${ROI_COLOR(agent.roi)}`}>{agent.roi}/10</span>
                </div>
                <p className="text-xs text-muted-foreground">{agent.revenue_contribution}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </TabsContent>

        <TabsContent value="tools" className="mt-4 space-y-2">
          {AGENTS.map(agent => (
            <div key={agent.name} className="border border-border rounded-xl p-4">
              <p className="font-semibold text-sm mb-2">{agent.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {agent.tools.map(t => (
                  <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="blockers" className="mt-4 space-y-2">
          {AGENTS.map(agent => (
            <div key={agent.name} className="border border-red-500/20 rounded-xl p-4">
              <p className="font-semibold text-sm mb-2">{agent.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {agent.blocked.map(b => (
                  <span key={b} className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded flex items-center gap-1">
                    <XCircle className="w-3 h-3" />{b.replace(/_/g,' ')}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="daily" className="mt-4 space-y-2">
          {AGENTS.map(agent => (
            <div key={agent.name} className="border border-border rounded-xl p-4">
              <p className="font-semibold text-sm mb-2">{agent.label}</p>
              <ul className="space-y-1">
                {agent.daily_work.map(w => (
                  <li key={w} className="text-xs text-muted-foreground flex items-center gap-2">
                    <Activity className="w-3 h-3 text-primary shrink-0" />{w}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold">{selected.label}</h2>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">ROI Score</p>
                  <p className={`text-2xl font-bold ${ROI_COLOR(selected.roi)}`}>{selected.roi}/10</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Group</p>
                  <p className="text-sm font-semibold capitalize">{selected.group}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Revenue Contribution</p>
                <p className="text-sm bg-green-500/5 border border-green-500/20 rounded-lg p-3">{selected.revenue_contribution}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Capabilities (What It Can Do)</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.capabilities.map(c => (
                    <span key={c} className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${CAPABILITY_COLOR[c] || 'bg-secondary text-secondary-foreground'}`}>
                      <CheckCircle2 className="w-3 h-3" />{c.replace(/_/g,' ')}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Blocked Actions (Requires Approval)</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.blocked.map(b => (
                    <span key={b} className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />{b.replace(/_/g,' ')}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.skills.map(s => (
                    <Badge key={s} className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tool Access</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.tools.map(t => (
                    <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Daily Work Queue</p>
                <ul className="space-y-1.5">
                  {selected.daily_work.map(w => (
                    <li key={w} className="text-sm flex items-center gap-2">
                      <Activity className="w-3 h-3 text-primary shrink-0" />{w}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2 pt-2 border-t border-border">
                <Link to="/admin/agent-intelligence">
                  <Button size="sm" variant="outline" className="text-xs">View Agent Intelligence</Button>
                </Link>
                <Link to="/admin/approval-queue">
                  <Button size="sm" variant="outline" className="text-xs">Approval Queue</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}