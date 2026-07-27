import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ArrowLeft, TrendingUp, Zap, Star, Activity, ChevronRight,
  RefreshCw, Loader2, BookOpen, ShoppingBag, Users, Music, Target,
  AlertTriangle, CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ENGINES = [
  { to: '/admin/revenue-actions', icon: Zap, label: 'Revenue Actions', desc: 'Agent proposals awaiting approval', color: 'text-yellow-400', key: 'proposals' },
  { to: '/admin/approval-queue', icon: CheckCircle2, label: 'Approval Queue', desc: 'All items requiring your decision', color: 'text-green-400', key: 'approvals' },
  { to: '/admin/business-attention-centre', icon: AlertTriangle, label: 'Business Attention Centre', desc: 'Critical alerts and actions', color: 'text-red-400', key: 'alerts' },
  { to: '/admin/growth-engine', icon: TrendingUp, label: 'Growth Engine', desc: 'TikTok, social, and audience growth', color: 'text-blue-400', key: 'growth' },
  { to: '/admin/fan-conversion-engine', icon: Users, label: 'Fan Conversion', desc: 'Turn fans into buyers and supporters', color: 'text-purple-400', key: 'fans' },
  { to: '/admin/offer-engine', icon: Star, label: 'Offer Engine', desc: 'Bundles, promos, and limited-time offers', color: 'text-primary', key: 'offers' },
  { to: '/admin/content-to-cash', icon: Music, label: 'Content to Cash', desc: 'TikTok and social content → revenue', color: 'text-cyan-400', key: 'content' },
  { to: '/admin/ecommerce-command', icon: ShoppingBag, label: 'Ecommerce Command', desc: 'Orders, stock, profit intelligence', color: 'text-orange-400', key: 'ecommerce' },
  { to: '/admin/weekly-money-report', icon: Activity, label: 'Weekly Money Report', desc: 'Revenue, costs, profit, and trends', color: 'text-emerald-400', key: 'weekly' },
];

const CYCLE_STEPS = [
  { step: 1, label: 'Observe', desc: 'Monitor store, fans, social, and payments', icon: Activity },
  { step: 2, label: 'Analyse', desc: 'Score every signal for revenue potential', icon: BookOpen },
  { step: 3, label: 'Prepare', desc: 'Draft offer, copy, and visual ideas', icon: Target },
  { step: 4, label: 'Notify', desc: 'Alert via Business Attention Centre', icon: AlertTriangle },
  { step: 5, label: 'Approval', desc: 'Gannon reviews and approves or rejects', icon: CheckCircle2 },
  { step: 6, label: 'Execute', desc: 'Publish approved action to store/email/social', icon: Zap },
  { step: 7, label: 'Track', desc: 'Measure result: sales, clicks, conversions', icon: TrendingUp },
  { step: 8, label: 'Learn', desc: 'Store outcome in agent memory for next cycle', icon: Star },
];

const INCOME_SOURCES = [
  { label: 'Merch Store Orders', value: 'Stripe + MerchOrder', route: '/admin/orders', color: 'text-green-400' },
  { label: 'Supporter Contributions', value: 'Back This + SupportContribution', route: '/admin/supporters', color: 'text-blue-400' },
  { label: 'Bookings / Sessions', value: 'BookingEnquiry', route: '/admin/mastering', color: 'text-purple-400' },
  { label: 'Mastering Projects', value: 'MasteringProject', route: '/admin/mastering', color: 'text-yellow-400' },
  { label: 'Bundle Offers', value: 'BundleOffer', route: '/admin/revenue-actions', color: 'text-orange-400' },
  { label: 'Promo Codes (Cost)', value: 'PromoCode usage', route: '/admin/promo-codes', color: 'text-red-400' },
  { label: 'Email Subscribers', value: 'EmailSubscriber', route: '/admin/subscribers', color: 'text-cyan-400' },
  { label: 'Digital Products (Future)', value: 'TBD — pending product setup', route: null, color: 'text-muted-foreground' },
  { label: 'Coaching (Staged)', value: 'LOCKED — not live', route: '/admin/coaching-command', color: 'text-muted-foreground' },
  { label: 'Sync / Publishing (Research)', value: 'Research pipeline', route: '/admin/sync-licensing-command', color: 'text-muted-foreground' },
];

function OpportunityCard({ opp, onClick }) {
  return (
    <button onClick={onClick} className="w-full text-left border border-border rounded-xl p-4 hover:border-primary/40 hover:bg-secondary/20 transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <Badge className="text-xs bg-secondary text-muted-foreground">{opp.platform}</Badge>
            <Badge className="text-xs bg-blue-500/10 text-blue-400">{opp.opportunity_type?.replace(/_/g, ' ')}</Badge>
          </div>
          <p className="font-semibold text-sm">{opp.trend_name}</p>
          {opp.estimated_growth_impact && <p className="text-xs text-green-400 mt-0.5">📈 {opp.estimated_growth_impact}</p>}
          {opp.estimated_revenue_impact && <p className="text-xs text-primary mt-0.5">💰 {opp.estimated_revenue_impact}</p>}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {opp.viral_probability && <span className="text-xs text-yellow-400">Viral: {opp.viral_probability}/10</span>}
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
        </div>
      </div>
    </button>
  );
}

function OpportunityDetail({ opp, onClose }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{opp.trend_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-secondary text-muted-foreground">{opp.platform}</Badge>
            <Badge className="bg-blue-500/10 text-blue-400">{opp.opportunity_type?.replace(/_/g, ' ')}</Badge>
            <Badge className={`${opp.status === 'new' ? 'bg-green-500/20 text-green-400' : 'bg-secondary text-muted-foreground'}`}>{opp.status}</Badge>
          </div>
          {opp.recommended_hook && <div><p className="text-xs font-semibold text-muted-foreground mb-1">Recommended Hook</p><p className="bg-secondary/30 rounded-lg p-3">{opp.recommended_hook}</p></div>}
          {opp.recommended_format && <div><p className="text-xs font-semibold text-muted-foreground mb-1">Format</p><p>{opp.recommended_format}</p></div>}
          {opp.emotional_trigger && <div><p className="text-xs font-semibold text-muted-foreground mb-1">Emotional Trigger</p><p>{opp.emotional_trigger}</p></div>}
          {opp.cta_strategy && <div><p className="text-xs font-semibold text-muted-foreground mb-1">CTA Strategy</p><p>{opp.cta_strategy}</p></div>}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/30 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-yellow-400">{opp.viral_probability}/10</p>
              <p className="text-xs text-muted-foreground">Viral Probability</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-blue-400">{opp.engagement_potential}/10</p>
              <p className="text-xs text-muted-foreground">Engagement Potential</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-green-400">{opp.audience_match_score}/10</p>
              <p className="text-xs text-muted-foreground">Audience Match</p>
            </div>
          </div>
          {opp.estimated_revenue_impact && <div><p className="text-xs font-semibold text-muted-foreground mb-1">Revenue Impact</p><p className="text-green-400 font-medium">{opp.estimated_revenue_impact}</p></div>}
          {opp.recommended_posting_time && <div><p className="text-xs font-semibold text-muted-foreground mb-1">Best Posting Time</p><p>{opp.recommended_posting_time}</p></div>}
          {opp.tags?.length > 0 && <div className="flex flex-wrap gap-1.5">{opp.tags.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div>}
          <p className="text-xs text-muted-foreground">Source: {opp.source_agent} · {opp.created_date ? format(new Date(opp.created_date), 'dd MMM yyyy, h:mm a') : ''}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function IntelligenceToIncome() {
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [scanning, setScanning] = useState(false);

  const { data: opportunities = [], refetch: refetchOpps } = useQuery({
    queryKey: ['growth-opps'],
    queryFn: () => base44.entities.GrowthOpportunity.filter({ status: 'new' }, '-created_date', 20),
  });
  const { data: proposals = [] } = useQuery({
    queryKey: ['pending-proposals'],
    queryFn: () => base44.entities.AgentActionProposal.filter({ status: 'pending_approval' }, '-created_date', 10),
  });
  const { data: notifications = [] } = useQuery({
    queryKey: ['unread-notifs'],
    queryFn: () => base44.entities.AdminNotification.filter({ is_read: false }, '-created_date', 10),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ['recent-orders-engine'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 10),
  });

  const triggerResearch = async () => {
    setScanning(true);
    try {
      await base44.functions.invoke('growthOpportunityScanner', {});
      toast.success('Opportunity scan complete');
      refetchOpps();
    } catch {
      toast.error('Scan failed');
    }
    setScanning(false);
  };

  const activeOrders = orders.filter(o => !['cancelled', 'refunded', 'deleted'].includes(o.status));
  const revenueOrders = activeOrders.filter(o => o.payment_status === 'paid');
  const totalRevenue = revenueOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Intelligence to Income</h1>
            <p className="text-sm text-muted-foreground mt-1">The full revenue cycle — observe, analyse, prepare, approve, execute, track, learn</p>
          </div>
        </div>
        <Button variant="outline" onClick={triggerResearch} disabled={scanning} className="gap-2">
          {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Scan for Opportunities
        </Button>
      </div>

      {/* Live KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to="/admin/revenue-actions">
          <Card className="hover:border-primary/40 cursor-pointer">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-yellow-400">{proposals.length}</p>
              <p className="text-xs text-muted-foreground">Pending Revenue Actions</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/notifications">
          <Card className="hover:border-primary/40 cursor-pointer">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-red-400">{notifications.length}</p>
              <p className="text-xs text-muted-foreground">Unread Alerts</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/orders">
          <Card className="hover:border-primary/40 cursor-pointer">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-400">{revenueOrders.length}</p>
              <p className="text-xs text-muted-foreground">Paid Orders (Active)</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/financials">
          <Card className="hover:border-primary/40 cursor-pointer">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-primary">${totalRevenue.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Active Revenue (AUD)</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Revenue Cycle */}
      <Card>
        <CardHeader><CardTitle className="text-base">The Intelligence-to-Income Cycle</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CYCLE_STEPS.map(({ step, label, desc, icon: Icon }) => (
              <div key={step} className="bg-secondary/20 rounded-xl p-3 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{step}</span>
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engine links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {ENGINES.map(({ to, icon: Icon, label, desc, color }) => (
          <Link key={to} to={to}>
            <Card className="hover:border-primary/40 cursor-pointer transition-colors h-full">
              <CardContent className="p-4 flex items-start gap-3">
                <Icon className={`w-5 h-5 ${color} shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Income Sources Map */}
      <Card>
        <CardHeader><CardTitle className="text-base">Income Source Map</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {INCOME_SOURCES.map(s => (
            <div key={s.label} className={`flex items-center justify-between gap-3 border border-border rounded-lg px-4 py-3 ${s.route ? 'hover:border-primary/40 transition-colors' : 'opacity-60'}`}>
              <div>
                <p className={`text-sm font-medium ${s.color}`}>{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.value}</p>
              </div>
              {s.route && <Link to={s.route}><Button variant="ghost" size="sm"><ChevronRight className="w-4 h-4" /></Button></Link>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Live Opportunities */}
      {opportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Live Opportunities ({opportunities.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {opportunities.slice(0, 8).map(o => (
              <OpportunityCard key={o.id} opp={o} onClick={() => setSelectedOpp(o)} />
            ))}
            {opportunities.length > 8 && <Link to="/admin/growth-engine"><Button variant="outline" size="sm" className="w-full">View all {opportunities.length} opportunities</Button></Link>}
          </CardContent>
        </Card>
      )}

      {/* What can make money fastest */}
      <Card className="border-primary/20 bg-primary/3">
        <CardHeader><CardTitle className="text-base text-primary">What Can Make Money Fastest</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[
            { rank: 1, action: 'Approve pending bundle offer proposals', where: 'Revenue Actions', route: '/admin/revenue-actions', speed: 'Today', income: 'Direct sales' },
            { rank: 2, action: 'Upload TikTok draft → creator publishes → viral discovery', where: 'TikTok Platform Review', route: '/tiktok-platform-review', speed: 'This week', income: 'Store traffic + sales' },
            { rank: 3, action: 'Activate a limited-time merch offer for email list', where: 'Subscriber Newsletter', route: '/admin/newsletter', speed: 'This week', income: 'Existing list conversion' },
            { rank: 4, action: 'Fix abandoned checkout recovery email', where: 'Payment Diagnostics', route: '/admin/payment-diagnostics', speed: 'This week', income: 'Recover lost carts' },
            { rank: 5, action: 'Pitch current single for sync/playlist placement', where: 'Sync Licensing', route: '/admin/sync-licensing-command', speed: 'This month', income: 'Licensing fees' },
          ].map(item => (
            <div key={item.rank} className="flex items-start gap-3 border border-border rounded-lg p-3">
              <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">{item.rank}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.action}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge className="text-xs bg-secondary text-muted-foreground">{item.speed}</Badge>
                  <Badge className="text-xs bg-green-500/10 text-green-400">{item.income}</Badge>
                </div>
              </div>
              <Link to={item.route}><Button variant="outline" size="sm">Go</Button></Link>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedOpp && <OpportunityDetail opp={selectedOpp} onClose={() => setSelectedOpp(null)} />}
    </div>
  );
}
