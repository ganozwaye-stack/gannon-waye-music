import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle, CheckCircle2, Clock, Brain, Shield, DollarSign,
  Zap, TrendingUp, FileText, Globe, Music, Users, Megaphone,
  Eye, Lock, Activity, ChevronRight, Bell, Star
} from 'lucide-react';

const DASHBOARDS = [
  { label: 'Agent Registry', path: '/admin/agent-registry', icon: Brain, color: 'text-purple-400', desc: '100+ specialist agents' },
  { label: 'Approval Queue', path: '/admin/approval-queue', icon: CheckCircle2, color: 'text-yellow-400', desc: 'Pending decisions' },
  { label: 'Risk Alerts', path: '/admin/risk-alerts', icon: AlertTriangle, color: 'text-red-400', desc: 'Financial & legal flags' },
  { label: 'Knowledge Vault', path: '/admin/knowledge-vault', icon: Lock, color: 'text-blue-400', desc: 'Secure document store' },
  { label: 'Legal Dashboard', path: '/admin/legal-dashboard', icon: FileText, color: 'text-orange-400', desc: 'Legal ops & timeline' },
  { label: 'Wealth Dashboard', path: '/admin/wealth-dashboard', icon: DollarSign, color: 'text-green-400', desc: 'Revenue & protection' },
  { label: 'Research Hub', path: '/admin/research-hub', icon: Eye, color: 'text-cyan-400', desc: 'Deep intelligence' },
  { label: 'Creative Studio', path: '/admin/creative-studio', icon: Music, color: 'text-pink-400', desc: 'Music, content, video' },
  { label: 'Marketing Centre', path: '/admin/marketing-centre', icon: Megaphone, color: 'text-indigo-400', desc: 'Campaigns & growth' },
  { label: 'Social Command', path: '/admin/social-command', icon: Users, color: 'text-teal-400', desc: 'All social channels' },
  { label: 'Website Ops', path: '/admin/website-ops', icon: Globe, color: 'text-lime-400', desc: 'Site automation' },
  { label: 'Security Centre', path: '/admin/security-centre', icon: Shield, color: 'text-rose-400', desc: 'Access & compliance' },
  { label: 'Agent Task Log', path: '/admin/agent-task-log', icon: Activity, color: 'text-slate-400', desc: 'All agent actions' },
  { label: 'Trend Monitor', path: '/admin/trend-monitor', icon: TrendingUp, color: 'text-amber-400', desc: 'Rising opportunities' },
  { label: 'Orchestrator', path: '/admin/orchestrator-chat', icon: Zap, color: 'text-violet-400', desc: 'Master AI chat' },
];

export default function CommandCentre() {
  const { data: pendingApprovals = [] } = useQuery({
    queryKey: ['approval-queue-pending'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }),
  });
  const { data: openAlerts = [] } = useQuery({
    queryKey: ['risk-alerts-open'],
    queryFn: () => base44.entities.RiskAlert.filter({ status: 'open' }),
  });
  const { data: agents = [] } = useQuery({
    queryKey: ['agent-registry'],
    queryFn: () => base44.entities.AgentRegistry.list(),
  });
  const { data: recentLogs = [] } = useQuery({
    queryKey: ['agent-task-log-recent'],
    queryFn: () => base44.entities.AgentTaskLog.list('-created_date', 5),
  });

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const criticalAlerts = openAlerts.filter(a => a.severity === 'critical').length;
  const highAlerts = openAlerts.filter(a => a.severity === 'high').length;

  return (
    <div className="p-6 space-y-8 min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Gannon Command Centre</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">AI Operating System — Private & Secure</p>
        </div>
        <div className="flex gap-2">
          {criticalAlerts > 0 && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
              {criticalAlerts} Critical
            </Badge>
          )}
          <Badge className="bg-primary/20 text-primary border-primary/30">
            {activeAgents} Active Agents
          </Badge>
        </div>
      </div>

      {/* Status Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatusCard icon={CheckCircle2} color="text-yellow-400" bg="bg-yellow-500/10" label="Pending Approvals" value={pendingApprovals.length} link="/admin/approval-queue" />
        <StatusCard icon={AlertTriangle} color="text-red-400" bg="bg-red-500/10" label="Open Risk Alerts" value={openAlerts.length} link="/admin/risk-alerts" />
        <StatusCard icon={Brain} color="text-purple-400" bg="bg-purple-500/10" label="Agents Registered" value={agents.length} link="/admin/agent-registry" />
        <StatusCard icon={Activity} color="text-green-400" bg="bg-green-500/10" label="Tasks Logged Today" value={recentLogs.length} link="/admin/agent-task-log" />
      </div>

      {/* Do Not Spend Rule Banner */}
      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-yellow-300 font-semibold text-sm">Do-Not-Spend-Or-Lose Rule: ACTIVE</p>
          <p className="text-muted-foreground text-xs mt-1">All agents are blocked from spending money, issuing refunds, changing prices, creating legal commitments, or publishing high-risk content without your explicit approval.</p>
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-yellow-400" /> Needs Your Attention
          </h2>
          <div className="space-y-2">
            {pendingApprovals.slice(0, 5).map(item => (
              <Link key={item.id} to="/admin/approval-queue">
                <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-lg p-3 hover:bg-yellow-500/10 transition-colors flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.action_title}</p>
                    <p className="text-xs text-muted-foreground">{item.agent_name} · Risk: {item.risk_level}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Risk Alerts */}
      {openAlerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" /> Risk Alerts
          </h2>
          <div className="space-y-2">
            {openAlerts.slice(0, 3).map(alert => (
              <Link key={alert.id} to="/admin/risk-alerts">
                <div className="border border-red-500/20 bg-red-500/5 rounded-lg p-3 hover:bg-red-500/10 transition-colors flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.alert_type} · {alert.source_agent}</p>
                  </div>
                  <Badge className={`text-xs ${alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {alert.severity}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" /> Command Dashboards
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {DASHBOARDS.map(d => (
            <Link key={d.path} to={d.path}>
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardContent className="p-4">
                  <d.icon className={`w-6 h-6 ${d.color} mb-2`} />
                  <p className="font-medium text-sm text-foreground">{d.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{d.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Agent Activity */}
      {recentLogs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" /> Recent Agent Activity
          </h2>
          <div className="space-y-2">
            {recentLogs.map(log => (
              <div key={log.id} className="border border-border rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{log.task_title}</p>
                  <p className="text-xs text-muted-foreground">{log.agent_name}</p>
                </div>
                <Badge className={log.was_automatic ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}>
                  {log.was_automatic ? 'Auto' : 'Approved'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusCard({ icon: Icon, color, bg, label, value, link }) { // eslint-disable-line
  return (
    <Link to={link}>
      <Card className="hover:border-primary/30 transition-all cursor-pointer">
        <CardContent className="p-4 flex items-center gap-3">
          <div className={`${bg} p-2 rounded-lg`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}