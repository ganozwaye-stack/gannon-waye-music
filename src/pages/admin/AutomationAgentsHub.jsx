import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ClipboardList, ShieldCheck } from 'lucide-react';

export default function AutomationAgentsHub() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Legacy architecture</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Agent Architecture Status</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          This is a planning and record-review system, not a live agent-execution hub.
        </p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="w-5 h-5 text-primary" />
            No verified executor or cross-agent relay is active
          </CardTitle>
          <CardDescription>
            Older screens and status labels were architecture mockups, not evidence of running agents, broker events, scheduled jobs, or delivered messages.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Deego’s profiles are planning-only and have no direct record-write tools. The new internal dispatcher is intentionally limited to a separately verified synthetic receipt test.
          </p>
          <p>
            No background work, external messages, publishing, payments, submissions, account access, or scheduler is started from this page.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Brain className="w-4 h-4 text-primary" />Agent Registry</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">Inspect descriptive registry records. A label is not runtime proof.</p>
            <Link to="/admin/agent-registry"><Button size="sm" variant="outline">Open registry</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" />Safety Holds</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">Review held loops and the current verification boundary.</p>
            <Link to="/admin/autonomous-ops"><Button size="sm" variant="outline">Open safety holds</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><ClipboardList className="w-4 h-4 text-primary" />Internal Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">Review saved task records without starting external work.</p>
            <Link to="/admin/communications-hub"><Button size="sm" variant="outline">Open review desk</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
