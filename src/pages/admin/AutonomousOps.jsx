import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, PauseCircle, Clock } from 'lucide-react';

const HELD_LOOPS = [
  ['Autonomous research', 'Research and drafting remain off until a bounded owner-approved internal test is defined.'],
  ['Trend engine', 'No background scanning or paid AI calls are permitted during the safety hold.'],
  ['Executive brief', 'Owner-controlled internal review only; no automatic email, Slack, or external delivery.'],
  ['Site health check', 'No automatic repair or account change is permitted during the safety hold.'],
  ['Agent improvement', 'No autonomous prompt or data mutation is permitted during the safety hold.'],
  ['Release calendar sync', 'No calendar, distributor, release, or public-post action is permitted during the safety hold.'],
];

export default function AutonomousOps() {
  const { data: logs = [] } = useQuery({
    queryKey: ['auto-ops-logs'],
    queryFn: () => base44.entities.AgentTaskLog.filter({ was_automatic: true }, '-created_date', 20),
    initialData: [],
  });

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="font-display text-3xl text-foreground">Automation safety control</h1>
        <p className="mt-1 font-body text-sm text-muted-foreground">
          Execution controls are deliberately unavailable while legacy manual and scheduled paths are being made fail-closed.
        </p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex gap-3 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-body text-sm font-medium text-foreground">Safety hold active</p>
            <p className="mt-1 font-body text-xs text-muted-foreground">
              No loop can publish, send, schedule, spend, change an account, or approve work. A future controlled test must be exact-owner, bounded, and evidence-producing.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {HELD_LOOPS.map(([name, detail]) => (
          <Card key={name} className="border-border/40 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <PauseCircle className="h-4 w-4 text-muted-foreground" />
                {name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="mb-2 text-xs text-muted-foreground">Held</Badge>
              <p className="font-body text-xs text-muted-foreground">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/40 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Historical automatic activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No automatic activity is being claimed by this control panel.</p>
          ) : (
            <p className="font-body text-sm text-muted-foreground">
              {logs.length} historical log record{logs.length === 1 ? '' : 's'} are available for audit. They do not prove an active automation.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
