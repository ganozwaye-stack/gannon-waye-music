import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PauseCircle, TrendingUp, Clock, ShieldCheck } from 'lucide-react';

// Lifted from src/pages/admin/ContentAutomate.jsx — the safety-hold readout with
// read-only draft and opportunity counts.
export default function ContentAutomatePanel() {
  const { data: socialDrafts = [] } = useQuery({
    queryKey: ['social-drafts'],
    queryFn: () => base44.entities.SocialVideo.filter({ status: 'draft' }, '-created_date', 10),
    initialData: [],
  });
  const { data: viralOps = [] } = useQuery({
    queryKey: ['viral-opportunities'],
    queryFn: () => base44.entities.ViralOpportunity.filter({ status: 'new' }, '-created_date', 5),
    initialData: [],
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl text-foreground">Content preparation</h3>
        <p className="mt-1 font-body text-sm text-muted-foreground">
          Legacy automated generation and external notification controls are held while controlled draft-only testing is completed.
        </p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex gap-3 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-body text-sm font-medium text-foreground">Safety hold active</p>
            <p className="mt-1 font-body text-xs text-muted-foreground">
              This page cannot generate, schedule, send, publish, approve, or learn from content. Existing drafts remain available for review elsewhere.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-muted-foreground" /> Existing opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-2xl text-foreground">{viralOps.length}</p>
            <p className="font-body text-xs text-muted-foreground">Read-only records available for review.</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-muted-foreground" /> Existing drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-2xl text-foreground">{socialDrafts.length}</p>
            <p className="font-body text-xs text-muted-foreground">No draft is sent or scheduled from this page.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 bg-card">
        <CardContent className="flex items-center gap-3 p-4">
          <PauseCircle className="h-5 w-5 text-muted-foreground" />
          <p className="font-body text-sm text-muted-foreground">
            A future controlled test must be initiated by the owner, limited to one internal draft, carry an explicit cost acknowledgement, and produce no external message or post.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}