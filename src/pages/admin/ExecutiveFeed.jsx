import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle, Shield, DollarSign, TrendingUp, Globe, Music,
  ShoppingBag, Brain, Activity, Star, ArrowRight, CheckCircle2,
  Lightbulb, Eye, Zap
} from 'lucide-react';

const RULE = (
  <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
    <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
    <p className="text-yellow-300 text-xs font-body">
      <strong>Do-Not-Spend-Or-Lose Rule: ACTIVE</strong> — No AI action may spend money, change prices, issue refunds, create legal commitments, or publish high-risk content without explicit approval.
    </p>
  </div>
);

export default function ExecutiveFeed() {
  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const { data: alerts = [] } = useQuery({
    queryKey: ['exec-alerts'],
    queryFn: () => base44.entities.RiskAlert.filter({ status: 'open' }),
  });
  const { data: pending = [] } = useQuery({
    queryKey: ['exec-pending'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }),
  });
  const { data: recentLogs = [] } = useQuery({
    queryKey: ['exec-logs'],
    queryFn: () => base44.entities.AgentTaskLog.list('-created_date', 10),
  });
  const { data: vaultItems = [] } = useQuery({
    queryKey: ['exec-vault'],
    queryFn: () => base44.entities.KnowledgeVault.list('-created_date', 5),
  });
  const { data: ideas = [] } = useQuery({
    queryKey: ['exec-ideas'],
    queryFn: () => base44.entities.IdeaOpportunity.filter({ status: 'new' }),
  });

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
  const financialRisks = alerts.filter(a => a.alert_type === 'financial');
  const legalRisks = alerts.filter(a => a.alert_type === 'legal');
  const reputationRisks = alerts.filter(a => a.alert_type === 'reputation');
  const opportunities = alerts.filter(a => a.alert_type === 'opportunity');
  const topIdeas = ideas.sort((a, b) => (b.opportunity_score || 0) - (a.opportunity_score || 0)).slice(0, 3);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Executive Intelligence Feed</h1>
        <p className="text-muted-foreground text-sm mt-1 font-body">{today}</p>
      </div>

      {RULE}

      {/* Priority Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard icon={AlertTriangle} color="text-red-400" bg="bg-red-500/10" label="Critical Alerts" value={criticalAlerts.length} link="/admin/risk-alerts" urgent={criticalAlerts.length > 0} />
        <SummaryCard icon={CheckCircle2} color="text-yellow-400" bg="bg-yellow-500/10" label="Awaiting Approval" value={pending.length} link="/admin/approval-queue" urgent={pending.length > 0} />
        <SummaryCard icon={Lightbulb} color="text-green-400" bg="bg-green-500/10" label="New Opportunities" value={ideas.length} link="/admin/ideas-engine" />
        <SummaryCard icon={Activity} color="text-blue-400" bg="bg-blue-500/10" label="Agent Actions Today" value={recentLogs.length} link="/admin/agent-task-log" />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Today's Priorities */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" /> Today's Priorities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pending.length === 0 && criticalAlerts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No urgent items — system is clear.</p>
            ) : (
              <>
                {criticalAlerts.slice(0, 3).map(a => (
                  <PriorityRow key={a.id} icon={AlertTriangle} iconColor="text-red-400" label={a.title} sub={`${a.alert_type} · ${a.severity}`} link="/admin/risk-alerts" badge="Critical" badgeColor="bg-red-500/20 text-red-400" />
                ))}
                {pending.slice(0, 3).map(p => (
                  <PriorityRow key={p.id} icon={CheckCircle2} iconColor="text-yellow-400" label={p.action_title} sub={`${p.agent_name} · needs approval`} link="/admin/approval-queue" badge="Pending" badgeColor="bg-yellow-500/20 text-yellow-400" />
                ))}
              </>
            )}
          </CardContent>
        </Card>

        {/* Risk Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" /> Risk Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RiskRow label="Financial Risks" count={financialRisks.length} color="text-red-400" />
            <RiskRow label="Legal Risks" count={legalRisks.length} color="text-orange-400" />
            <RiskRow label="Reputation Risks" count={reputationRisks.length} color="text-yellow-400" />
            <RiskRow label="Opportunities" count={opportunities.length} color="text-green-400" />
            {alerts.length === 0 && <p className="text-muted-foreground text-sm">No active risk alerts.</p>}
          </CardContent>
        </Card>

        {/* Top Ideas */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-green-400" /> Top Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topIdeas.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm">No ideas yet.</p>
                <Link to="/admin/ideas-engine" className="text-xs text-primary mt-1 flex items-center justify-center gap-1">Generate ideas <ArrowRight className="w-3 h-3" /></Link>
              </div>
            ) : topIdeas.map(idea => (
              <div key={idea.id} className="border border-border rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium">{idea.title}</p>
                  {idea.opportunity_score && <Badge variant="outline" className="text-xs shrink-0 ml-2">{idea.opportunity_score}/100</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{idea.category} · {idea.estimated_monthly_value || 'Revenue TBD'}</p>
              </div>
            ))}
            <Link to="/admin/ideas-engine" className="text-xs text-primary flex items-center gap-1 pt-1">View all ideas <ArrowRight className="w-3 h-3" /></Link>
          </CardContent>
        </Card>

        {/* Recent Intelligence */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" /> Recent Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {vaultItems.length === 0 ? (
              <p className="text-muted-foreground text-sm">No knowledge vault entries yet.</p>
            ) : vaultItems.map(item => (
              <div key={item.id} className="border border-border rounded-lg p-3">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.category} · {new Date(item.created_date).toLocaleDateString('en-AU')}</p>
                {item.summary && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>}
              </div>
            ))}
            <Link to="/admin/knowledge-vault" className="text-xs text-primary flex items-center gap-1 pt-1">Open vault <ArrowRight className="w-3 h-3" /></Link>
          </CardContent>
        </Card>

      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-widest">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: 'Ideas Engine', path: '/admin/ideas-engine', icon: Lightbulb },
            { label: 'Research Hub', path: '/admin/research-hub', icon: Eye },
            { label: 'Ecommerce Intel', path: '/admin/ecommerce-intelligence', icon: ShoppingBag },
            { label: 'Trend Monitor', path: '/admin/trend-monitor', icon: TrendingUp },
            { label: 'Approval Queue', path: '/admin/approval-queue', icon: CheckCircle2 },
            { label: 'Risk Alerts', path: '/admin/risk-alerts', icon: AlertTriangle },
            { label: 'Agent Registry', path: '/admin/agent-registry', icon: Brain },
            { label: 'Orchestrator', path: '/admin/orchestrator-chat', icon: Zap },
          ].map(item => (
            <Link key={item.path} to={item.path}>
              <div className="border border-border rounded-lg p-3 hover:border-primary/40 transition-colors flex items-center gap-2">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-body">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, color, bg, label, value, link, urgent }) {
  return (
    <Link to={link}>
      <Card className={`hover:border-primary/30 transition-all cursor-pointer ${urgent ? 'border-yellow-500/30' : ''}`}>
        <CardContent className="p-4 flex items-center gap-3">
          <div className={`${bg} p-2 rounded-lg`}><Icon className={`w-5 h-5 ${color}`} /></div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function PriorityRow({ icon: Icon, iconColor, label, sub, link, badge, badgeColor }) {
  return (
    <Link to={link}>
      <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/30 transition-colors">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
          <div>
            <p className="text-sm font-medium leading-tight">{label}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        </div>
        <Badge className={`text-xs shrink-0 ml-2 ${badgeColor}`}>{badge}</Badge>
      </div>
    </Link>
  );
}

function RiskRow({ label, count, color }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-bold text-sm ${count > 0 ? color : 'text-muted-foreground'}`}>{count}</span>
    </div>
  );
}