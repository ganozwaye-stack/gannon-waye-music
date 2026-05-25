import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, ArrowLeft, DollarSign, Tag, Package, ChevronRight, ArrowUpRight,
  Clock, CheckCircle2, XCircle, AlertTriangle, Loader2, Star, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const OFFER_TYPES = [
  {
    type: 'flash_sale',
    label: 'Flash Sale',
    desc: 'Time-limited discount on a single product. Creates urgency. High conversion.',
    effort: 'Very Low', risk: 'Low', potential: 'High',
    approval_required: true,
  },
  {
    type: 'bundle_deal',
    label: 'Bundle Deal',
    desc: 'Two or more products at a combined discount. Increases average order value.',
    effort: 'Low', risk: 'Low', potential: 'Very High',
    approval_required: true,
  },
  {
    type: 'free_shipping',
    label: 'Free Shipping Threshold',
    desc: 'Free shipping above a spend threshold. Reduces cart abandonment.',
    effort: 'Very Low', risk: 'Medium', potential: 'High',
    approval_required: true,
  },
  {
    type: 'promo_code',
    label: 'Promo Code Campaign',
    desc: 'Targeted discount code for specific fans, events, or segments.',
    effort: 'Low', risk: 'Low', potential: 'High',
    approval_required: true,
  },
  {
    type: 'fan_exclusive',
    label: 'Fan Exclusive Offer',
    desc: 'Private offer for email subscribers only. Builds list loyalty.',
    effort: 'Medium', risk: 'Low', potential: 'High',
    approval_required: true,
  },
];

export default function OfferEngine() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState('active');
  const [scanning, setScanning] = useState(false);

  const { data: proposals = [], refetch } = useQuery({
    queryKey: ['offer-proposals'],
    queryFn: () => base44.entities.AgentActionProposal.list('-created_date', 100),
  });
  const { data: bundles = [] } = useQuery({
    queryKey: ['bundles-offer'],
    queryFn: () => base44.entities.BundleOffer.list('-created_date', 50),
  });
  const { data: promos = [] } = useQuery({
    queryKey: ['promos-offer'],
    queryFn: () => base44.entities.PromoCode.filter({ is_active: true }, '-created_date', 50),
  });

  const scan = async () => {
    setScanning(true);
    try {
      const res = await base44.functions.invoke('agentProposalScanner', {});
      toast.success(res.data?.message || 'Scan complete — new proposals created');
      refetch();
      qc.invalidateQueries({ queryKey: ['offer-proposals'] });
    } catch (err) {
      toast.error('Scan failed: ' + err.message);
    }
    setScanning(false);
  };

  const pending = proposals.filter(p => p.status === 'pending_approval');
  const published = proposals.filter(p => p.status === 'published');
  const activeBundles = bundles.filter(b => b.status === 'active');

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary/40 rounded transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Offer Engine</h1>
          <p className="text-muted-foreground text-sm">All live offers, pending proposals, and offer types — nothing publishes without approval</p>
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-center gap-2 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
        <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
        <p className="text-xs text-yellow-300/80">No offer goes live without Gannon's explicit approval. All proposals are staged in the Approval Queue.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className={pending.length > 0 ? 'border-yellow-500/30' : ''}>
          <CardContent className="p-4"><p className={`text-2xl font-bold ${pending.length > 0 ? 'text-yellow-400' : ''}`}>{pending.length}</p><p className="text-xs text-muted-foreground">Pending Approval</p></CardContent>
        </Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-green-400">{activeBundles.length}</p><p className="text-xs text-muted-foreground">Active Bundles</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-cyan-400">{promos.length}</p><p className="text-xs text-muted-foreground">Active Promo Codes</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-primary">{published.length}</p><p className="text-xs text-muted-foreground">Total Published</p></CardContent></Card>
      </div>

      <div className="flex gap-2">
        <Button className="gradient-gold-button border-0 gap-2 text-sm" onClick={scan} disabled={scanning}>
          {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {scanning ? 'Scanning...' : 'Scan for Opportunities'}
        </Button>
        <Link to="/admin/bundle-proposal-studio">
          <Button variant="outline" className="gap-2 text-sm"><Package className="w-4 h-4" />Bundle Studio</Button>
        </Link>
        <Link to="/admin/promo-codes">
          <Button variant="outline" className="gap-2 text-sm"><Tag className="w-4 h-4" />Promo Codes</Button>
        </Link>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="active">Active ({activeBundles.length + promos.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="types">Offer Types</TabsTrigger>
          <TabsTrigger value="history">All Proposals ({proposals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-3">
          {activeBundles.length === 0 && promos.length === 0 && (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <Zap className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No active offers. Scan for opportunities or build a bundle.</p>
            </div>
          )}
          {activeBundles.map(b => (
            <div key={b.id} className="border border-green-500/20 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge className="text-xs bg-green-500/20 text-green-400 mb-1">LIVE Bundle</Badge>
                  <p className="font-semibold text-sm">{b.bundle_name}</p>
                  <p className="text-xs text-muted-foreground">{b.products_included?.join(' + ')}</p>
                  <p className="text-xs text-green-400 mt-0.5">${b.bundle_price} — {b.discount_percent}% off</p>
                  {b.end_date && <p className="text-xs text-muted-foreground">Ends {format(new Date(b.end_date), 'dd MMM, h:mm a')}</p>}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{b.orders_generated || 0}</p>
                  <p className="text-xs text-muted-foreground">orders</p>
                </div>
              </div>
            </div>
          ))}
          {promos.map(p => (
            <div key={p.id} className="border border-cyan-500/20 rounded-xl p-4">
              <Badge className="text-xs bg-cyan-500/20 text-cyan-400 mb-1">Active Promo Code</Badge>
              <p className="font-semibold text-sm font-mono">{p.code}</p>
              <p className="text-xs text-cyan-400">{p.discount_percent}% off</p>
              {p.expires_at && <p className="text-xs text-muted-foreground">Expires {format(new Date(p.expires_at), 'dd MMM yyyy')}</p>}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="mt-4 space-y-3">
          {pending.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <Clock className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No pending proposals. Run a scan or create a bundle to generate one.</p>
            </div>
          ) : (
            pending.map(p => (
              <Link key={p.id} to="/admin/revenue-actions">
                <div className="border border-yellow-500/30 bg-yellow-500/3 rounded-xl p-4 hover:border-yellow-400/50 transition-all group">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge className="text-xs bg-yellow-500/20 text-yellow-400 mb-1 animate-pulse">Awaiting Your Approval</Badge>
                      <p className="font-semibold text-sm">{p.title}</p>
                      {p.estimated_revenue_impact && <p className="text-xs text-green-400 mt-0.5">💰 {p.estimated_revenue_impact}</p>}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="types" className="mt-4 space-y-3">
          {OFFER_TYPES.map(ot => (
            <div key={ot.type} className="border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm mb-1">{ot.label}</p>
                  <p className="text-xs text-muted-foreground mb-2">{ot.desc}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-green-400">Potential: {ot.potential}</span>
                    <span className="text-muted-foreground">Effort: {ot.effort}</span>
                    <span className="text-muted-foreground">Risk: {ot.risk}</span>
                    {ot.approval_required && <span className="text-yellow-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Approval required</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-2">
          {proposals.map(p => (
            <Link key={p.id} to="/admin/revenue-actions">
              <div className="border border-border rounded-xl p-3 hover:border-primary/30 hover:bg-secondary/10 transition-all flex items-center gap-3 group">
                <Badge className={`text-xs shrink-0 ${p.status === 'published' ? 'bg-green-500/20 text-green-400' : p.status === 'pending_approval' ? 'bg-yellow-500/20 text-yellow-400' : p.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-secondary text-secondary-foreground'}`}>
                  {p.status?.replace(/_/g,' ')}
                </Badge>
                <span className="text-sm flex-1 truncate">{p.title}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}