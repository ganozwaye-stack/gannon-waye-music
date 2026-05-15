import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const SEVERITY_CONFIG = {
  critical: { color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: XCircle, iconColor: 'text-red-400' },
  high: { color: 'bg-orange-500/10 text-orange-400 border-orange-500/30', icon: AlertTriangle, iconColor: 'text-orange-400' },
  warning: { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: AlertTriangle, iconColor: 'text-yellow-400' },
  info: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: Info, iconColor: 'text-blue-400' },
};

export default function RiskAlerts() {
  const [filter, setFilter] = useState('open');
  const qc = useQueryClient();

  const { data: alerts = [] } = useQuery({
    queryKey: ['risk-alerts', filter],
    queryFn: () => filter === 'all'
      ? base44.entities.RiskAlert.list('-created_date', 100)
      : base44.entities.RiskAlert.filter({ status: filter }, '-created_date', 100),
  });

  const updateAlert = useMutation({
    mutationFn: ({ id, status }) => base44.entities.RiskAlert.update(id, { status }),
    onSuccess: (_, v) => { qc.invalidateQueries({ queryKey: ['risk-alerts'] }); toast.success(`Alert ${v.status}`); },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-gold-text">Risk Alerts</h1>
        <p className="text-muted-foreground text-sm">Financial, legal, reputation, and system risks flagged by agents</p>
      </div>

      <div className="flex gap-2">
        {['open','acknowledged','resolved','all'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize ${filter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {alerts.map(alert => {
          const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
          const Icon = cfg.icon;
          return (
            <Card key={alert.id} className={`border ${cfg.color}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${cfg.iconColor} shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs ${cfg.color}`}>{alert.severity}</Badge>
                      <Badge className="bg-secondary text-secondary-foreground text-xs">{alert.alert_type}</Badge>
                    </div>
                    <p className="font-semibold text-sm">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                    {alert.recommended_action && (
                      <p className="text-xs text-primary mt-2">→ {alert.recommended_action}</p>
                    )}
                    {alert.source_agent && <p className="text-xs text-muted-foreground mt-1">Source: {alert.source_agent}</p>}
                    {alert.requires_professional && (
                      <Badge className="bg-orange-500/10 text-orange-400 text-xs mt-2">Requires Professional</Badge>
                    )}
                  </div>
                  {alert.status === 'open' && (
                    <div className="flex flex-col gap-1">
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => updateAlert.mutate({ id: alert.id, status: 'acknowledged' })}>
                        Acknowledge
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => updateAlert.mutate({ id: alert.id, status: 'resolved' })}>
                        Resolve
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {alerts.length === 0 && <p className="text-center text-muted-foreground py-12">No alerts found.</p>}
      </div>
    </div>
  );
}