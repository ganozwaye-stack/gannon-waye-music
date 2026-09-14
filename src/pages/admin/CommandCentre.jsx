import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import StatusStrip from '@/components/admin/command-centre/StatusStrip';
import ActionsRequiredCard from '@/components/admin/command-centre/ActionsRequiredCard';
import WorkstreamTodoCard from '@/components/admin/command-centre/WorkstreamTodoCard';
import HubNav from '@/components/admin/command-centre/HubNav';
import { Activity, Shield } from 'lucide-react';

// THE single Command Centre. Every old dashboard cluster now lives here:
// status numbers, actions required across the business, the owner's
// workstream to-do list with deadlines, grouped links to every hub, and
// recent agent activity. One screen, no jumping between pages.
export default function CommandCentre() {
  const { data: recentLogs = [] } = useQuery({
    queryKey: ['agent-task-log-recent'],
    queryFn: () => base44.entities.AgentTaskLog.list('-created_date', 5).catch(() => []),
    initialData: [],
  });

  return (
    <div className="pb-12 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-1">One place to run everything</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Command Centre</h1>
          <p className="font-body text-sm text-muted-foreground mt-1 max-w-2xl">
            Your whole business on one screen: what needs you now, your workstream to-do list with deadlines,
            and every hub and owner tool one click away.
          </p>
        </div>
        <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 font-mono text-xs">ADMIN ACCESS</Badge>
      </div>

      <div className="border border-primary/30 bg-primary/5 rounded-lg p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-primary font-semibold text-sm">Nothing goes live without you</p>
          <p className="text-muted-foreground text-xs mt-1">
            Releases publish only from the Release Control Desk after review and your Go Live press. Launch packets,
            hero designs and hotspot zones all save as private drafts first.
          </p>
        </div>
      </div>

      <StatusStrip />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <ActionsRequiredCard />
        <WorkstreamTodoCard />
      </div>

      <HubNav />

      {recentLogs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" /> Recent Agent Activity
          </h2>
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <Card key={log.id} className="border-border/40">
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{log.task_title || 'Agent task'}</p>
                    <p className="text-xs text-muted-foreground">{log.agent_name || 'Agent'}</p>
                  </div>
                  <Badge className={log.was_automatic ? 'bg-green-500/10 text-green-400' : 'bg-primary/10 text-primary'}>
                    {log.was_automatic ? 'Auto' : 'Approved'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}