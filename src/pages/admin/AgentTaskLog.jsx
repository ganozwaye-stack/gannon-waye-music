import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';
import { useState } from 'react';

export default function AgentTaskLog() {
  const [filter, setFilter] = useState('all');

  const { data: logs = [] } = useQuery({
    queryKey: ['agent-task-log-all'],
    queryFn: () => base44.entities.AgentTaskLog.list('-created_date', 100),
  });

  const filtered = filter === 'all' ? logs
    : filter === 'auto' ? logs.filter(l => l.was_automatic)
    : filter === 'approved' ? logs.filter(l => !l.was_automatic)
    : logs.filter(l => l.risk_check_result === filter);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-gold-text">Agent Task Log</h1>
        <p className="text-muted-foreground text-sm">Full audit trail of all agent actions — what was done, why, and how</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all','auto','approved','pass','blocked','escalated'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize ${filter === f ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
            {f} ({f === 'all' ? logs.length : f === 'auto' ? logs.filter(l=>l.was_automatic).length : f === 'approved' ? logs.filter(l=>!l.was_automatic).length : logs.filter(l=>l.risk_check_result===f).length})
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(log => (
          <div key={log.id} className="border border-border rounded-lg p-3 flex items-start gap-3">
            <Activity className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-sm">{log.task_title}</p>
                <Badge className={log.was_automatic ? 'bg-green-500/10 text-green-400 text-xs' : 'bg-yellow-500/10 text-yellow-400 text-xs'}>
                  {log.was_automatic ? 'Auto' : 'Approved'}
                </Badge>
                {log.risk_check_result && (
                  <Badge className={`text-xs ${log.risk_check_result === 'pass' ? 'bg-green-500/10 text-green-400' : log.risk_check_result === 'blocked' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>
                    {log.risk_check_result}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{log.agent_name} · {log.outcome}</p>
              {log.source_used && <p className="text-xs text-muted-foreground">Source: {log.source_used}</p>}
            </div>
            <p className="text-xs text-muted-foreground shrink-0">{new Date(log.created_date).toLocaleDateString()}</p>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No logs yet. Agent actions will appear here automatically.</p>}
      </div>
    </div>
  );
}