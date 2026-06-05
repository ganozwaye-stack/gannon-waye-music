import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, XCircle, Info, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const SEVERITY_CONFIG = {
  critical: {
    bar: 'border-l-4 border-l-red-500',
    badge: 'bg-red-500/15 text-red-300 border-red-500/40',
    icon: XCircle,
    iconColor: 'text-red-400',
    label: 'Critical',
    headerBg: 'bg-red-500/5',
  },
  high: {
    bar: 'border-l-4 border-l-orange-500',
    badge: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
    icon: AlertTriangle,
    iconColor: 'text-orange-400',
    label: 'High',
    headerBg: 'bg-orange-500/5',
  },
  warning: {
    bar: 'border-l-4 border-l-yellow-500',
    badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40',
    icon: AlertTriangle,
    iconColor: 'text-yellow-400',
    label: 'Warning',
    headerBg: 'bg-yellow-500/5',
  },
  info: {
    bar: 'border-l-4 border-l-blue-500',
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
    icon: Info,
    iconColor: 'text-blue-400',
    label: 'Info',
    headerBg: 'bg-blue-500/5',
  },
};

const TYPE_COLORS = {
  financial: 'bg-green-500/10 text-green-400',
  legal: 'bg-purple-500/10 text-purple-400',
  reputation: 'bg-pink-500/10 text-pink-400',
  security: 'bg-red-500/10 text-red-400',
  data: 'bg-cyan-500/10 text-cyan-400',
  brand: 'bg-amber-500/10 text-amber-400',
  system: 'bg-slate-500/10 text-slate-400',
  compliance: 'bg-orange-500/10 text-orange-400',
  opportunity: 'bg-emerald-500/10 text-emerald-400',
};

const STATUS_FILTERS = ['open', 'acknowledged', 'resolved', 'dismissed', 'all'];

export default function RiskAlerts() {
  const [filter, setFilter] = useState('open');
  const qc = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['risk-alerts', filter],
    queryFn: () => filter === 'all'
      ? base44.entities.RiskAlert.list('-created_date', 100)
      : base44.entities.RiskAlert.filter({ status: filter }, '-created_date', 100),
  });

  const updateAlert = useMutation({
    mutationFn: ({ id, status }) => base44.entities.RiskAlert.update(id, { status }),
    onSuccess: (_, v) => { qc.invalidateQueries({ queryKey: ['risk-alerts'] }); toast.success(`Alert marked ${v.status}`); },
  });

  // Group by severity for display
  const allAlerts = alerts;
  const counts = {
    open: allAlerts.filter(a => a.status === 'open').length,
    critical: allAlerts.filter(a => a.severity === 'critical').length,
  };

  const grouped = ['critical', 'high', 'warning', 'info'].reduce((acc, sev) => {
    const group = allAlerts.filter(a => a.severity === sev);
    if (group.length) acc[sev] = group;
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Risk Alerts</h1>
          <p className="text-muted-foreground text-sm mt-1">Financial, legal, reputation, and system risks flagged by agents</p>
        </div>
        <div className="flex gap-3">
          {counts.critical > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 animate-pulse">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-300 font-medium">{counts.critical} Critical</span>
            </div>
          )}
          {counts.open > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-yellow-300 font-medium">{counts.open} Open</span>
            </div>
          )}
        </div>
      </div>

      {/* Do-Not-Spend banner */}
      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-start gap-3">
        <Shield className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-yellow-300 text-xs"><strong>Do-Not-Spend-Or-Lose Rule: ACTIVE</strong> — High and critical alerts may require approval before action. Never resolve a financial or legal alert without human review.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize ${filter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Grouped by severity */}
      {Object.entries(grouped).map(([sev, group]) => {
        const cfg = SEVERITY_CONFIG[sev];
        const Icon = cfg.icon;
        return (
          <div key={sev}>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${cfg.headerBg} mb-2`}>
              <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
              <span className="text-xs font-semibold uppercase tracking-wider">{cfg.label}</span>
              <Badge className={`text-xs ml-1 ${cfg.badge}`}>{group.length}</Badge>
            </div>
            <div className="space-y-2">
              {group.map(alert => (
                <Card key={alert.id} className={`${cfg.bar} bg-card hover:bg-card/80 transition-all`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <Badge className={`text-xs border ${cfg.badge}`}>{alert.severity}</Badge>
                          <Badge className={`text-xs ${TYPE_COLORS[alert.alert_type] || 'bg-secondary text-secondary-foreground'}`}>{alert.alert_type}</Badge>
                          {alert.status !== 'open' && <Badge variant="outline" className="text-xs capitalize">{alert.status}</Badge>}
                          {alert.requires_professional && <Badge className="bg-orange-500/10 text-orange-400 text-xs border border-orange-500/30">⚖ Requires Professional</Badge>}
                        </div>
                        <p className="font-semibold text-sm">{alert.title}</p>
                        {alert.description && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{alert.description}</p>}
                        {alert.recommended_action && (
                          <div className="mt-2 px-2 py-1.5 bg-primary/5 border border-primary/20 rounded text-xs text-primary">
                            → {alert.recommended_action}
                          </div>
                        )}
                        {alert.source_agent && <p className="text-xs text-muted-foreground mt-2">Agent: {alert.source_agent}</p>}
                      </div>
                      {alert.status === 'open' && (
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <Button size="sm" variant="outline" className="text-xs h-7 w-28" onClick={() => updateAlert.mutate({ id: alert.id, status: 'acknowledged' })}>
                            <CheckCircle2 className="w-3 h-3 mr-1" />Acknowledge
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs h-7 w-28" onClick={() => updateAlert.mutate({ id: alert.id, status: 'resolved' })}>
                            Resolve
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs h-7 w-28 text-muted-foreground" onClick={() => updateAlert.mutate({ id: alert.id, status: 'dismissed' })}>
                            Dismiss
                          </Button>
                        </div>
                      )}
                      {alert.status === 'acknowledged' && (
                        <Button size="sm" variant="ghost" className="text-xs h-7 shrink-0" onClick={() => updateAlert.mutate({ id: alert.id, status: 'resolved' })}>
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {allAlerts.length === 0 && !isLoading && (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <p className="text-foreground font-medium">All clear</p>
          <p className="text-sm text-muted-foreground mt-1">No {filter === 'all' ? '' : filter} alerts found.</p>
        </div>
      )}
    </div>
  );
}