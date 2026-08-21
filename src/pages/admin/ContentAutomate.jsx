import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, TrendingUp, CheckCircle2, Clock, AlertCircle, Send
} from 'lucide-react';

export default function ContentAutomate() {
  const [automationActive, setAutomationActive] = useState(true);

  const { data: socialDrafts = [] } = useQuery({
    queryKey: ['social-drafts'],
    queryFn: () => base44.entities.SocialVideo.filter({ status: 'draft' }, '-created_date', 10),
    refetchInterval: 60000,
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ['pending-approvals-social'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 5),
    refetchInterval: 30000,
  });

  const { data: viralOps = [] } = useQuery({
    queryKey: ['viral-opportunities'],
    queryFn: () => base44.entities.ViralOpportunity.filter({ status: 'new' }, '-created_date', 5),
    refetchInterval: 120000,
  });

  const { data: socialVideos = [] } = useQuery({
    queryKey: ['social-videos-published'],
    queryFn: () => base44.entities.SocialVideo.filter({ status: 'published' }, '-created_date', 10),
    refetchInterval: 60000,
  });

  const handleRunAutomation = async () => {
    try {
      const res = await base44.functions.invoke('autonomousSocialPoster', {});
      console.log('Automation result:', res);
    } catch (err) {
      console.error('Automation failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Content Automation</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">AI-driven social content generation and approval workflow</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRunAutomation}
            className="gap-2"
          >
            <Zap className="w-4 h-4" />
            Run Generator
          </Button>
          <Button
            variant={automationActive ? 'default' : 'outline'}
            onClick={() => setAutomationActive(!automationActive)}
          >
            {automationActive ? 'Active' : 'Paused'}
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Viral Trends', value: viralOps.length, icon: TrendingUp, color: 'text-orange-400' },
          { label: 'Drafts Pending', value: socialDrafts.length, icon: Clock, color: 'text-yellow-400' },
          { label: 'Awaiting Approval', value: approvals.length, icon: AlertCircle, color: 'text-red-400' },
          { label: 'Published', value: socialVideos.filter(v => v.status === 'published').length, icon: CheckCircle2, color: 'text-green-400' },
        ].map(s => (
          <Card key={s.label} className="bg-card/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className={`font-display text-2xl mt-1 ${s.color}`}>{s.value}</p>
                </div>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            Viral Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {viralOps.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No viral opportunities yet. Check back soon!</p>
          ) : (
            viralOps.map(op => (
              <div key={op.id} className="bg-secondary/30 rounded-lg p-3 border border-border/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium text-foreground">{op.trend}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">{op.recommended_angle}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px]">{op.platform}</Badge>
                      <Badge className={`text-[10px] ${op.competition_level === 'high' ? 'bg-red-500/10 text-red-400' : op.competition_level === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                        {op.competition_level} competition
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Drafts Awaiting Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            Drafts Ready for Review ({socialDrafts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {socialDrafts.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No drafts. Run the generator to create content.</p>
          ) : (
            socialDrafts.map(draft => (
              <div key={draft.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg border border-border/30">
                <div className="flex-1">
                  <p className="font-body text-sm text-foreground">{draft.title}</p>
                  <p className="font-body text-xs text-muted-foreground">Platform: {draft.platform}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">Ready</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            Awaiting Your Approval ({approvals.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {approvals.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No approvals pending.</p>
          ) : (
            approvals.map(app => (
              <div key={app.id} className="bg-red-500/5 rounded-lg p-3 border border-red-500/30">
                <p className="font-body text-sm font-medium text-foreground">{app.action_title}</p>
                <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-2">{app.proposed_output}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                  <Button size="sm" variant="outline">Reject</Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="bg-blue-500/5 border border-blue-500/30">
        <CardContent className="p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">How It Works</p>
          <ol className="space-y-1 font-body text-xs text-foreground/70">
            <li>1. <strong>Scan Trends:</strong> System monitors viral trends across TikTok/Instagram</li>
            <li>2. <strong>Generate Hooks:</strong> AI creates 3 hook variations tailored to your brand</li>
            <li>3. <strong>Draft Content:</strong> Hooks saved as draft social videos for review</li>
            <li>4. <strong>Approval Queue:</strong> Posts queued for your approval before publishing</li>
            <li>5. <strong>Auto-Learn:</strong> Approved posts logged to KnowledgeVault to improve future suggestions</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}