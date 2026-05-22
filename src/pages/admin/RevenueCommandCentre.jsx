import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DollarSign, TrendingUp, Users, Music, Mic, Radio, Handshake, Mail,
  ShoppingBag, Star, ExternalLink, ArrowLeft, ChevronRight, Zap, Eye,
  CheckCircle2, XCircle, Loader2, Package, Activity, Brain, AlertTriangle, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const AGENTS = [
  { name: 'revenue_orchestrator', label: 'Revenue Orchestrator', icon: Star, color: 'text-yellow-400', desc: 'Master coordinator — daily action list' },
  { name: 'merch_sales_agent', label: 'Merch Sales', icon: ShoppingBag, color: 'text-blue-400', desc: 'Flash sales, stock alerts, bundles' },
  { name: 'pricing_optimiser', label: 'Pricing Optimiser', icon: DollarSign, color: 'text-green-400', desc: 'Margin analysis, price recommendations' },
  { name: 'superfan_converter', label: 'Superfan Converter', icon: Users, color: 'text-pink-400', desc: 'Turns fans into buyers' },
  { name: 'email_revenue_agent', label: 'Email Revenue', icon: Mail, color: 'text-purple-400', desc: 'Campaigns, upsells, win-backs' },
  { name: 'content_revenue_agent', label: 'Content → Cash', icon: TrendingUp, color: 'text-orange-400', desc: 'Viral content with purchase CTAs' },
  { name: 'booking_revenue_agent', label: 'Bookings', icon: Mic, color: 'text-red-400', desc: 'Gigs, venues, corporate events' },
  { name: 'sync_licensing_agent', label: 'Sync Licensing', icon: Music, color: 'text-cyan-400', desc: 'Film/TV/ad placements, royalties' },
  { name: 'partnership_agent', label: 'Partnerships', icon: Handshake, color: 'text-teal-400', desc: 'Brand deals, sponsorships' },
  { name: 'streaming_royalty_agent', label: 'Streaming Royalties', icon: Radio, color: 'text-indigo-400', desc: 'Playlist pitching, Spotify growth' },
];

const REVENUE_TABS = [
  { key: 'all', label: 'All' },
  { key: 'new-opportunities', label: 'New Opps', statusFilter: 'new' },
  { key: 'being-reviewed', label: 'Reviewing', statusFilter: 'reviewing' },
  { key: 'in-progress', label: 'In Progress', statusFilter: 'in_progress' },
  { key: 'live-earning', label: 'Live & Earning', statusFilter: 'live' },
  { key: 'products', label: 'Products', typeFilter: 'product' },
  { key: 'bundles', label: 'Bundles', typeFilter: 'bundle' },
  { key: 'services', label: 'Services', typeFilter: 'service' },
  { key: 'sponsorships', label: 'Sponsorships', typeFilter: 'partnership' },
  { key: 'tiktok', label: 'TikTok', typeFilter: 'digital' },
  { key: 'content', label: 'Content', typeFilter: 'affiliate' },
  { key: 'store', label: 'Store', typeFilter: 'product' },
  { key: 'needs-approval', label: 'Needs Approval', statusFilter: 'reviewing' },
  { key: 'completed', label: 'Completed', statusFilter: 'live' },
  { key: 'rejected', label: 'Rejected', statusFilter: 'rejected' },
  { key: 'snoozed', label: 'Snoozed', statusFilter: 'archived' },
];

function filterOpportunities(opps, tabKey) {
  const tab = REVENUE_TABS.find(t => t.key === tabKey);
  if (!tab || tabKey === 'all') return opps;
  if (tab.statusFilter) return opps.filter(o => o.status === tab.statusFilter);
  if (tab.typeFilter) return opps.filter(o => o.revenue_type === tab.typeFilter || o.tags?.includes(tabKey));
  return opps;
}

function OppDetailModal({ opp, onClose, onSendToApproval, onUpdateStatus }) {
  const [note, setNote] = useState('');
  const [acting, setActing] = useState(false);

  const handleSendToApproval = async () => {
    setActing(true);
    await onSendToApproval(opp, note);
    setActing(false);
    onClose();
  };

  const handleStatus = async (status) => {
    setActing(true);
    await onUpdateStatus(opp.id, status);
    setActing(false);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            {opp.opportunity_name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={`text-xs ${opp.status === 'live' ? 'bg-green-500/20 text-green-400' : opp.status === 'new' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {opp.status}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-colors"
              onClick={() => { onClose(); window.location.href = `/admin/revenue-command?tab=${opp.revenue_type}`; }}
            >
              {opp.revenue_type} ↗
            </Badge>
            {opp.estimated_value && (
              <Badge className="text-xs bg-green-500/10 text-green-400 cursor-pointer hover:bg-green-500/20 transition-colors">
                💰 {opp.estimated_value}
              </Badge>
            )}
          </div>

          {/* Recommended next step */}
          {opp.recommended_next_step && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Recommended Next Step</p>
              <p className="text-sm text-foreground/90">{opp.recommended_next_step}</p>
            </div>
          )}

          {/* Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: 'Difficulty', value: opp.difficulty, color: 'text-orange-400' },
              { label: 'Automation', value: opp.automation_potential, color: 'text-cyan-400' },
              { label: 'Audience Match', value: opp.audience_match, color: 'text-green-400' },
              { label: 'Risk', value: opp.risk_level, color: opp.risk_level === 'high' ? 'text-red-400' : 'text-yellow-400', isText: true },
            ].map(s => (
              <div key={s.label} className="bg-secondary/30 rounded-lg p-2 text-center">
                <p className={`text-lg font-bold ${s.color}`}>{s.value ?? '—'}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Source */}
          {opp.source_agent && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Brain className="w-3 h-3" />
              <span>Source: {opp.source_agent}</span>
            </div>
          )}

          {/* Tags */}
          {opp.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {opp.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-primary/10 transition-colors">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Source chain */}
          <div className="bg-secondary/10 border border-border rounded-xl p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Source Chain</p>
            <p className="text-xs font-mono text-foreground/60">
              RevenueOpportunity → {opp.source_agent || 'Agent'} → Analysis → KnowledgeVault → ApprovalQueue → Published Action → Revenue Result
            </p>
          </div>

          {/* Note for proposal */}
          <Textarea
            placeholder="Add context for the approval proposal (optional)..."
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            className="text-sm"
          />

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <Button className="gap-1 text-xs" onClick={handleSendToApproval} disabled={acting}>
              {acting ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
              Prepare Proposal
            </Button>
            <Button variant="outline" className="gap-1 text-xs" onClick={() => handleStatus('in_progress')} disabled={acting}>
              <Zap className="w-3 h-3" />Mark In Progress
            </Button>
            {opp.status !== 'live' && (
              <Button variant="outline" className="gap-1 text-xs text-green-400 border-green-500/30" onClick={() => handleStatus('live')} disabled={acting}>
                <Star className="w-3 h-3" />Mark Live
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => handleStatus('archived')} disabled={acting} className="text-xs text-muted-foreground">
              Snooze
            </Button>
            <Link to="/admin/revenue-actions">
              <Button variant="outline" className="gap-1 text-xs"><Eye className="w-3 h-3" />Revenue Actions</Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            Created: {opp.created_date ? format(new Date(opp.created_date), 'dd MMM yyyy, h:mm a') : '—'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ImpactBadgeModal({ value, onClose }) {
  if (!value) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl max-w-md w-full p-5" onClick={e => e.stopPropagation()}>
        <p className="font-semibold mb-2">Impact Explanation</p>
        <div className="bg-secondary/30 rounded-lg p-3">
          <p className="text-sm text-foreground/80">{value}</p>
        </div>
        <div className="mt-3 space-y-1 text-xs text-muted-foreground">
          <p>This label was assigned based on revenue type, automation potential, and audience match scores.</p>
          <p>Source: RevenueOpportunity entity → agent analysis → KnowledgeVault reasoning</p>
        </div>
        <Button variant="outline" size="sm" onClick={onClose} className="mt-3 gap-1 text-xs"><ArrowLeft className="w-3 h-3" />Back</Button>
      </div>
    </div>
  );
}

export default function RevenueCommandCentre() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeAgent, setActiveAgent] = useState(null);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [impactText, setImpactText] = useState(null);

  const activeTab = searchParams.get('tab') || 'all';
  const setTab = (key) => setSearchParams({ tab: key });

  const { data: opportunities = [], refetch } = useQuery({
    queryKey: ['revenue_opportunities'],
    queryFn: () => base44.entities.RevenueOpportunity.list('-created_date', 100),
    refetchInterval: 60000,
  });

  const updateStatus = async (id, status) => {
    await base44.entities.RevenueOpportunity.update(id, { status });
    qc.invalidateQueries({ queryKey: ['revenue_opportunities'] });
    toast.success(`Marked as ${status}`);
  };

  const sendToApproval = async (opp, note) => {
    try {
      await base44.entities.AgentActionProposal.create({
        title: opp.opportunity_name,
        agent_name: opp.source_agent || 'RevenueAgent',
        proposal_type: 'other',
        reason: note || opp.recommended_next_step || 'Revenue opportunity flagged for approval',
        estimated_revenue_impact: opp.estimated_value || '',
        risk_level: opp.risk_level || 'low',
        confidence_score: opp.audience_match || 5,
        status: 'pending_approval',
        source_chain: `RevenueOpportunity (${opp.id}) → ${opp.source_agent || 'Agent'} → ApprovalQueue`,
        if_approved_action: opp.recommended_next_step || 'Action the opportunity',
        if_rejected_action: 'Archive the opportunity — no action taken',
      });
      await base44.entities.AdminNotification.create({
        notification_type: 'approval',
        severity: 'high',
        title: `Proposal Ready: ${opp.opportunity_name}`,
        summary: `Revenue opportunity prepared for approval. ${opp.estimated_value ? 'Est. value: ' + opp.estimated_value : ''}`,
        source: opp.source_agent || 'RevenueAgent',
        requires_action: true,
        linked_entity: 'AgentActionProposal',
        linked_route: '/admin/revenue-actions',
        is_read: false,
      });
      qc.invalidateQueries({ queryKey: ['revenue_opportunities'] });
      qc.invalidateQueries({ queryKey: ['admin-notifications'] });
      toast.success('Proposal sent to Approval Queue + Business Attention Centre notified');
    } catch (err) {
      toast.error('Failed: ' + err.message);
    }
  };

  // Status counts
  const newCount = opportunities.filter(o => o.status === 'new').length;
  const reviewingCount = opportunities.filter(o => o.status === 'reviewing').length;
  const inProgressCount = opportunities.filter(o => o.status === 'in_progress').length;
  const liveCount = opportunities.filter(o => o.status === 'live').length;

  const STATUS_CARDS = [
    { key: 'new-opportunities', label: 'New Opportunities', value: newCount, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'hover:border-yellow-500/40' },
    { key: 'being-reviewed', label: 'Being Reviewed', value: reviewingCount, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/40' },
    { key: 'in-progress', label: 'In Progress', value: inProgressCount, color: 'text-green-400', bg: 'bg-green-500/10', border: 'hover:border-green-500/40' },
    { key: 'live-earning', label: 'Live & Earning', value: liveCount, color: 'text-primary', bg: 'bg-primary/10', border: 'hover:border-primary/40' },
  ];

  const filteredOpps = filterOpportunities(opportunities, activeTab);
  const topOpps = opportunities.filter(o => o.status === 'new' || o.status === 'reviewing').slice(0, 5);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Revenue Command Centre</h1>
            <p className="text-muted-foreground text-sm mt-0.5">10 agents working 24/7 — every metric is clickable</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1 text-xs">
            <RefreshCw className="w-3 h-3" />Refresh
          </Button>
          <Link to="/admin/revenue-actions">
            <Button size="sm" className="gap-1 text-xs"><Zap className="w-3 h-3" />Revenue Actions</Button>
          </Link>
        </div>
      </div>

      {/* Clickable Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATUS_CARDS.map(card => {
          const isActive = activeTab === card.key;
          return (
            <button
              key={card.key}
              onClick={() => setTab(card.key)}
              className={`w-full rounded-xl border p-4 text-left transition-all cursor-pointer
                ${isActive ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20' : `border-border bg-card ${card.border}`}`}
            >
              <div className={`${card.bg} w-8 h-8 rounded-lg flex items-center justify-center mb-2`}>
                <DollarSign className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className={`text-3xl font-bold ${isActive ? 'text-primary' : card.color}`}>{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
              {isActive && <p className="text-xs text-primary mt-1">▼ Filtered below</p>}
            </button>
          );
        })}
      </div>

      {/* Top Actions Today */}
      {activeTab === 'all' && topOpps.length > 0 && (
        <div className="border border-primary/30 bg-primary/3 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-primary">Today's Top Revenue Actions</h3>
          </div>
          {topOpps.map((opp, i) => (
            <div
              key={opp.id}
              className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border hover:border-primary/40 transition-all cursor-pointer group"
              onClick={() => setSelectedOpp(opp)}
            >
              <span
                className="text-xl font-bold text-primary/50 w-6 shrink-0 cursor-pointer group-hover:text-primary transition-colors"
                title="Click to view detail"
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer"
                    onClick={() => setSelectedOpp(opp)}
                  >
                    {opp.opportunity_name}
                  </p>
                  <Badge
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-colors"
                    onClick={e => { e.stopPropagation(); setTab(opp.revenue_type || 'all'); }}
                    title="Click to filter by this type"
                  >
                    {opp.revenue_type} ↗
                  </Badge>
                  {opp.estimated_value && (
                    <Badge
                      className="bg-green-500/10 text-green-400 text-xs cursor-pointer hover:bg-green-500/20 transition-colors"
                      onClick={e => { e.stopPropagation(); setImpactText(opp.estimated_value); }}
                      title="Click for impact breakdown"
                    >
                      💰 {opp.estimated_value}
                    </Badge>
                  )}
                </div>
                {opp.recommended_next_step && (
                  <p
                    className="text-xs text-muted-foreground mt-1 cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => setSelectedOpp(opp)}
                  >
                    {opp.recommended_next_step}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 text-xs cursor-pointer hover:bg-primary/10 hover:border-primary/40"
                onClick={e => { e.stopPropagation(); setSelectedOpp(opp); }}
              >
                Action →
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-1.5 min-w-max pb-1">
          {REVENUE_TABS.map(tab => {
            const count = filterOpportunities(opportunities, tab.key).length;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer border
                  ${isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary/40'
                  }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20' : 'bg-secondary text-secondary-foreground'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered Opportunities List */}
      <div className="space-y-2">
        {filteredOpps.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <DollarSign className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm font-medium">
              No items in "{REVENUE_TABS.find(t => t.key === activeTab)?.label || activeTab}"
            </p>
            <p className="text-xs text-muted-foreground mt-1">Revenue agents will populate this as they find opportunities.</p>
          </div>
        ) : filteredOpps.map(opp => (
          <div
            key={opp.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/20 transition-all cursor-pointer group"
            onClick={() => setSelectedOpp(opp)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">{opp.opportunity_name}</p>
                <Badge
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={e => { e.stopPropagation(); setTab(opp.revenue_type || 'all'); }}
                >
                  {opp.revenue_type}
                </Badge>
                {opp.estimated_value && (
                  <Badge
                    className="bg-green-500/10 text-green-400 text-xs cursor-pointer hover:bg-green-500/20 transition-colors"
                    onClick={e => { e.stopPropagation(); setImpactText(opp.estimated_value); }}
                  >
                    {opp.estimated_value}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{opp.source_agent} · {opp.status}</p>
            </div>
            <Badge variant="outline" className="text-xs shrink-0">{opp.status}</Badge>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </div>
        ))}
      </div>

      {/* Agent Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Your 10 Revenue Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AGENTS.map(agent => {
            const Icon = agent.icon;
            const agentOpps = opportunities.filter(o => o.source_agent === agent.name);
            return (
              <div
                key={agent.name}
                className="border border-border rounded-xl p-4 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => setActiveAgent(activeAgent === agent.name ? null : agent.name)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Icon className={`w-5 h-5 ${agent.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{agent.label}</p>
                      {agentOpps.length > 0 && (
                        <Badge
                          className="bg-primary/10 text-primary text-xs cursor-pointer hover:bg-primary/20"
                          onClick={e => { e.stopPropagation(); }}
                        >
                          {agentOpps.length} opps
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{agent.desc}</p>
                  </div>
                  <a href="https://app.base44.com" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                    <Button size="sm" variant="ghost" className="text-xs gap-1 cursor-pointer">
                      Chat <ExternalLink className="w-3 h-3" />
                    </Button>
                  </a>
                </div>
                {activeAgent === agent.name && agentOpps.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-border pt-3">
                    {agentOpps.slice(0, 3).map(opp => (
                      <div
                        key={opp.id}
                        className="text-xs p-2 bg-secondary rounded-lg flex items-center justify-between gap-2 cursor-pointer hover:bg-secondary/70 transition-colors"
                        onClick={() => setSelectedOpp(opp)}
                      >
                        <span className="truncate">{opp.opportunity_name}</span>
                        {opp.estimated_value && <span className="text-green-400 shrink-0">{opp.estimated_value}</span>}
                        <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {selectedOpp && (
        <OppDetailModal
          opp={selectedOpp}
          onClose={() => setSelectedOpp(null)}
          onSendToApproval={sendToApproval}
          onUpdateStatus={updateStatus}
        />
      )}
      {impactText && <ImpactBadgeModal value={impactText} onClose={() => setImpactText(null)} />}
    </div>
  );
}