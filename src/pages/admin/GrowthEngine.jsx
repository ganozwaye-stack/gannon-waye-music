import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Shield, Loader2, Zap, TrendingUp, DollarSign, Target, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const RULE = (
  <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
    <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
    <p className="text-yellow-300 text-xs"><strong>Safety Rule Active:</strong> All opportunities require human approval before any action. No automated content posting. No automated engagement.</p>
  </div>
);

const PLATFORM_COLORS = { tiktok: 'text-pink-400', instagram: 'text-purple-400', youtube: 'text-red-400', twitter: 'text-blue-400', all: 'text-green-400' };
const COMP_COLORS = { none: 'text-green-400', low: 'text-green-400', medium: 'text-yellow-400', high: 'text-orange-400', saturated: 'text-red-400' };

export default function GrowthEngine() {
  const [scanning, setScanning] = useState(false);
  const queryClient = useQueryClient();

  const { data: growthOps = [] } = useQuery({
    queryKey: ['growth-opportunities'],
    queryFn: () => base44.entities.GrowthOpportunity.filter({ status: 'new' }, '-created_date', 30),
    refetchInterval: 60000,
  });

  const { data: revenueOps = [] } = useQuery({
    queryKey: ['revenue-opportunities'],
    queryFn: () => base44.entities.RevenueOpportunity.filter({ status: 'new' }, '-created_date', 20),
    refetchInterval: 60000,
  });

  const { data: allGrowth = [] } = useQuery({
    queryKey: ['all-growth'],
    queryFn: () => base44.entities.GrowthOpportunity.list('-created_date', 50),
  });

  const updateGrowth = useMutation({
    mutationFn: ({ id, status }) => base44.entities.GrowthOpportunity.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['growth-opportunities'] }),
  });

  const updateRevenue = useMutation({
    mutationFn: ({ id, status }) => base44.entities.RevenueOpportunity.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['revenue-opportunities'] }),
  });

  const runScan = async () => {
    setScanning(true);
    try {
      await base44.functions.invoke('growthOpportunityScanner', {});
      queryClient.invalidateQueries({ queryKey: ['growth-opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['revenue-opportunities'] });
      toast.success('Growth scan complete. New opportunities loaded.');
    } catch (err) {
      toast.error('Scan failed: ' + err?.message);
    }
    setScanning(false);
  };

  const approveGrowth = (id) => {
    updateGrowth.mutate({ id, status: 'approved' });
    toast.success('Approved — saved to action queue');
  };

  const dismissGrowth = (id) => {
    updateGrowth.mutate({ id, status: 'expired' });
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Growth Engine</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">Viral opportunities, revenue intelligence, audience growth vectors</p>
        </div>
        <Button onClick={runScan} disabled={scanning} className="gradient-gold-button border-0 shrink-0">
          {scanning ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Scanning...</> : <><Zap className="w-4 h-4 mr-2" />Run Growth Scan</>}
        </Button>
      </div>

      {RULE}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="New Growth Ops" value={growthOps.length} icon={TrendingUp} color="text-green-400" bg="bg-green-500/10" />
        <StatCard label="Revenue Ops" value={revenueOps.length} icon={DollarSign} color="text-primary" bg="bg-primary/10" />
        <StatCard label="Total Scanned" value={allGrowth.length} icon={Target} color="text-blue-400" bg="bg-blue-500/10" />
        <StatCard label="Approved" value={allGrowth.filter(g => g.status === 'approved').length} icon={CheckCircle2} color="text-purple-400" bg="bg-purple-500/10" />
      </div>

      <Tabs defaultValue="growth">
        <TabsList>
          <TabsTrigger value="growth">Viral Growth ({growthOps.length})</TabsTrigger>
          <TabsTrigger value="revenue">Revenue ({revenueOps.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({allGrowth.filter(g => g.status === 'approved').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="mt-4">
          {growthOps.length === 0 ? (
            <EmptyState icon={TrendingUp} message="No new growth opportunities. Run a scan above." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {growthOps.map(op => (
                <GrowthCard key={op.id} op={op} onApprove={() => approveGrowth(op.id)} onDismiss={() => dismissGrowth(op.id)} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          {revenueOps.length === 0 ? (
            <EmptyState icon={DollarSign} message="No revenue opportunities yet. Run a scan to populate." />

          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {revenueOps.map(op => (
                <RevenueCard key={op.id} op={op} onApprove={() => updateRevenue.mutate({ id: op.id, status: 'approved' })} onDismiss={() => updateRevenue.mutate({ id: op.id, status: 'rejected' })} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          {allGrowth.filter(g => g.status === 'approved').length === 0 ? (
            <EmptyState icon={CheckCircle2} message="No approved opportunities yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allGrowth.filter(g => g.status === 'approved').map(op => (
                <GrowthCard key={op.id} op={op} approved />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GrowthCard({ op, onApprove, onDismiss, approved }) {
  const PLATFORM_COLORS = { tiktok: 'text-pink-400', instagram: 'text-purple-400', youtube: 'text-red-400', all: 'text-green-400' };
  return (
    <Card className="hover:border-primary/20 transition-colors">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-sm leading-tight">{op.trend_name}</p>
            <div className="flex gap-1 mt-1 flex-wrap">
              <Badge variant="outline" className={`text-xs ${PLATFORM_COLORS[op.platform] || 'text-muted-foreground'}`}>{op.platform}</Badge>
              <Badge variant="outline" className="text-xs capitalize">{op.opportunity_type?.replace('_', ' ')}</Badge>
              {op.competition_level && <Badge variant="outline" className="text-xs">{op.competition_level} competition</Badge>}
            </div>
          </div>
          <div className="text-right shrink-0">
            {op.viral_probability && <p className="text-2xl font-bold text-primary">{op.viral_probability}<span className="text-xs text-muted-foreground">/10</span></p>}
            <p className="text-xs text-muted-foreground">viral prob</p>
          </div>
        </div>

        {op.recommended_hook && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-2">
            <p className="text-xs text-muted-foreground mb-0.5">Hook:</p>
            <p className="text-xs text-primary italic">"{op.recommended_hook}"</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          {op.emotional_trigger && <div><span className="text-muted-foreground">Emotion: </span><span>{op.emotional_trigger}</span></div>}
          {op.recommended_format && <div><span className="text-muted-foreground">Format: </span><span>{op.recommended_format}</span></div>}
          {op.estimated_growth_impact && <div><span className="text-muted-foreground">Growth: </span><span className="text-green-400">{op.estimated_growth_impact}</span></div>}
          {op.estimated_revenue_impact && <div><span className="text-muted-foreground">Revenue: </span><span className="text-primary">{op.estimated_revenue_impact}</span></div>}
        </div>

        {!approved && (
          <div className="flex gap-2 pt-1">
            <Button size="sm" className="flex-1 gradient-gold-button border-0 text-xs" onClick={onApprove}><CheckCircle2 className="w-3 h-3 mr-1" />Approve</Button>
            <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={onDismiss}><XCircle className="w-3 h-3 mr-1" />Dismiss</Button>
          </div>
        )}
        {approved && <Badge className="bg-green-500/10 text-green-400 text-xs">Approved ✓</Badge>}
      </CardContent>
    </Card>
  );
}

function RevenueCard({ op, onApprove, onDismiss }) {
  return (
    <Card className="hover:border-primary/20 transition-colors">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-sm">{op.opportunity_name}</p>
            <div className="flex gap-1 mt-1 flex-wrap">
              <Badge variant="outline" className="text-xs capitalize">{op.revenue_type}</Badge>
              <Badge variant="outline" className={`text-xs ${op.risk_level === 'low' ? 'text-green-400' : op.risk_level === 'high' ? 'text-red-400' : 'text-yellow-400'}`}>{op.risk_level} risk</Badge>
            </div>
          </div>
          {op.estimated_value && <Badge className="bg-primary/10 text-primary text-xs shrink-0">{op.estimated_value}</Badge>}
        </div>
        {op.recommended_next_step && <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-2">Next: {op.recommended_next_step}</p>}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 gradient-gold-button border-0 text-xs" onClick={onApprove}><CheckCircle2 className="w-3 h-3 mr-1" />Approve</Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={onDismiss}><XCircle className="w-3 h-3 mr-1" />Dismiss</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value, icon: IconComp, color, bg }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`${bg} p-2 rounded-lg`}><IconComp className={`w-5 h-5 ${color}`} /></div>
        <div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ icon: EmptyIcon, message }) {
  return (
    <div className="text-center py-16 border border-dashed border-border rounded-xl">
      <EmptyIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}