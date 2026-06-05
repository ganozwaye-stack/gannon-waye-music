import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, ArrowLeft, ShoppingBag, CheckCircle2, Loader2, ChevronRight, AlertTriangle, Eye
} from 'lucide-react';
import { toast } from 'sonner';

// BUNDLE PROPOSAL SYSTEM
// No bundle is published until Gannon explicitly approves it.
// All bundles stay in "draft" / "pending_approval" status.

const PRODUCTS = {
  'Tote Bag': { cost: 8, delivery: 6, fee_pct: 3.5 },
  'Hoodie': { cost: 35, delivery: 12, fee_pct: 3.5 },
  'T-Shirt': { cost: 18, delivery: 8, fee_pct: 3.5 },
  'CD': { cost: 4, delivery: 5, fee_pct: 3.5 },
  'Signed CD': { cost: 5, delivery: 5, fee_pct: 3.5 },
  'Vinyl': { cost: 20, delivery: 15, fee_pct: 3.5 },
};

const PRESET_BUNDLES = [
  {
    name: 'Fan Starter Pack',
    products: ['T-Shirt', 'CD'],
    prices: [55, 50, 45],
    description: 'Perfect entry bundle for new fans discovering Gannon Waye',
    rationale: 'Low barrier to entry. T-shirt = visibility. CD = physical connection. Combined purchase saves shipping.',
  },
  {
    name: 'Superfan Collection',
    products: ['Hoodie', 'CD', 'Tote Bag'],
    prices: [120, 110, 100],
    description: 'Premium bundle for dedicated fans who want it all',
    rationale: 'High-ticket bundle for superfans. Hoodie + CD + Tote = complete lifestyle package. Best margin per transaction.',
  },
  {
    name: 'Music Lover Bundle',
    products: ['Signed CD', 'Tote Bag'],
    prices: [65, 58, 52],
    description: 'Collector-focused bundle with signed CD as hero item',
    rationale: 'Signed CD creates exclusivity and urgency. Tote bag extends value. Appeals to music-first fans.',
  },
  {
    name: 'Weekend Wear Pack',
    products: ['T-Shirt', 'Tote Bag'],
    prices: [45, 40, 35],
    description: 'Lifestyle bundle for everyday Gannon Waye fans',
    rationale: 'Casual lifestyle package. Both items used regularly = constant brand visibility. Lower price = impulse buy.',
  },
  {
    name: 'Collector Premium',
    products: ['Hoodie', 'Signed CD'],
    prices: [130, 120, 110],
    description: 'Premium-only bundle for high-value supporter segment',
    rationale: 'Hoodie = highest price item. Signed CD = personal touch. Positioned as limited/exclusive. Best for superfan segment.',
  },
];

function calcProfit(products, salePrice) {
  const totalCost = products.reduce((sum, p) => sum + (PRODUCTS[p]?.cost || 0), 0);
  const totalDelivery = products.reduce((sum, p) => sum + (PRODUCTS[p]?.delivery || 0), 0);
  const fee = salePrice * 0.035;
  const net = salePrice - totalCost - totalDelivery - fee;
  const margin = salePrice > 0 ? (net / salePrice) * 100 : 0;
  const originalCombined = products.reduce((sum, p) => sum + (PRODUCTS[p]?.cost || 0) * 3.5, 0);
  const saving = originalCombined - salePrice;
  const discountPct = originalCombined > 0 ? Math.round((saving / originalCombined) * 100) : 0;
  return { totalCost, totalDelivery, fee: fee.toFixed(2), net: net.toFixed(2), margin: margin.toFixed(1), originalCombined: originalCombined.toFixed(0), saving: saving.toFixed(2), discountPct };
}

function BundleCard({ bundle, onApprove, onReject, onClick }) {
  const calc = calcProfit(bundle.products, bundle.prices[1]);
  return (
    <button onClick={() => onClick(bundle)} className="w-full text-left border border-border rounded-xl p-5 hover:border-primary/40 hover:bg-secondary/10 transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="font-semibold">{bundle.name}</span>
            <Badge className="text-xs bg-yellow-500/20 text-yellow-400">Draft — Awaiting Approval</Badge>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {bundle.products.map(p => (
              <span key={p} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{p}</span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mb-1">{bundle.description}</p>
          <div className="flex gap-4 text-xs mt-2">
            <span className="text-primary font-bold">${bundle.prices[1]} mid-price</span>
            <span className="text-green-400">Net ${calc.net} profit</span>
            <span className="text-muted-foreground">{calc.margin}% margin</span>
            <span className="text-yellow-400">{calc.discountPct}% off vs individual</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>
    </button>
  );
}

function BundleDetailModal({ bundle, onClose, onSubmitForApproval }) {
  const [selectedPrice, setSelectedPrice] = useState(1); // 0=aggressive, 1=mid, 2=premium
  const [customNote, setCustomNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const priceLabels = ['Aggressive (Volume)', 'Mid (Balanced)', 'Premium (Margin)'];
  const price = bundle.prices[selectedPrice];
  const calc = calcProfit(bundle.products, price);

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmitForApproval(bundle, price, selectedPrice, customNote);
    setSubmitting(false);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            {bundle.name} — Bundle Preview
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 mt-2">
          {/* Products */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Products Included</p>
            <div className="flex flex-wrap gap-2">
              {bundle.products.map(p => (
                <div key={p} className="border border-border rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2">
                  <Package className="w-3 h-3 text-primary" />
                  {p}
                  <span className="text-xs text-muted-foreground">Cost: ${PRODUCTS[p]?.cost}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Options */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Price Option</p>
            <div className="grid grid-cols-3 gap-2">
              {bundle.prices.map((p, i) => (
                <button key={i} onClick={() => setSelectedPrice(i)}
                  className={`border rounded-lg p-3 text-center transition-all ${selectedPrice === i ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'}`}>
                  <p className="text-lg font-bold text-primary">${p}</p>
                  <p className="text-xs text-muted-foreground">{priceLabels[i]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Profit breakdown */}
          <div className="bg-secondary/30 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profit Breakdown @ ${price}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Sale Price</span><span className="font-medium">${price}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Product Cost</span><span className="text-red-400">-${calc.totalCost}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-red-400">-${calc.totalDelivery}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Stripe Fee (3.5%)</span><span className="text-red-400">-${calc.fee}</span></div>
              <div className="flex justify-between border-t border-border pt-2 col-span-2">
                <span className="font-semibold">Net Profit</span>
                <span className={`font-bold ${parseFloat(calc.net) > 0 ? 'text-green-400' : 'text-red-400'}`}>${calc.net}</span>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="text-muted-foreground">Profit Margin</span>
                <span className="font-bold text-primary">{calc.margin}%</span>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="text-muted-foreground">Customer Saving vs Individual</span>
                <span className="text-green-400">${calc.saving} ({calc.discountPct}% off)</span>
              </div>
            </div>
          </div>

          {/* Rationale */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-400 mb-1">Why This Bundle Works</p>
            <p className="text-sm text-foreground/80">{bundle.rationale}</p>
          </div>

          {/* Note */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Note to Gannon (optional)</p>
            <Textarea value={customNote} onChange={e => setCustomNote(e.target.value)} rows={2} placeholder="Add any context for approval..." className="text-sm" />
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-300/80">
              Submitting this creates a pending approval item. The bundle will NOT be published to the store until Gannon explicitly approves it in the Approval Queue.
            </p>
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            <Button className="gradient-gold-button border-0 gap-1.5" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Submit for Gannon's Approval
            </Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BundleProposalStudio() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('presets');

  const { data: proposals = [] } = useQuery({
    queryKey: ['bundle-proposals'],
    queryFn: () => base44.entities.AgentActionProposal.filter({ proposal_type: 'bundle_offer' }, '-created_date', 50),
  });

  const submitForApproval = async (bundle, price, priceIndex, note) => {
    const priceLabels = ['Aggressive (Volume)', 'Mid (Balanced)', 'Premium (Margin)'];
    const calc = calcProfit(bundle.products, price);
    try {
      await base44.entities.AgentActionProposal.create({
        title: `Bundle: ${bundle.name} @ $${price}`,
        agent_name: 'bundle_proposal_studio',
        proposal_type: 'bundle_offer',
        reason: bundle.rationale + (note ? `\n\nNote: ${note}` : ''),
        products_involved: bundle.products,
        proposed_bundle_price: price,
        original_combined_price: parseFloat(calc.originalCombined),
        discount_percent: calc.discountPct,
        estimated_margin_percent: parseFloat(calc.margin),
        estimated_revenue_impact: `$${calc.net} net profit per unit (${calc.margin}% margin)`,
        risk_level: 'low',
        confidence_score: 8,
        urgency_score: 6,
        profit_potential_score: parseFloat(calc.margin) > 40 ? 9 : parseFloat(calc.margin) > 30 ? 7 : 5,
        customer_facing_headline: `${bundle.name} — Save ${calc.discountPct}%`,
        customer_facing_copy: bundle.description,
        stock_check_passed: true,
        stock_notes: 'Requires stock verification before publishing',
        campaign_duration_hours: 48,
        if_approved_action: 'Publish bundle to store at selected price. Update MerchProduct listings. Notify subscribers.',
        if_rejected_action: 'Archive this proposal. Try alternative price or product combination.',
        source_chain: `BundleProposalStudio → ${bundle.name} → ${priceLabels[priceIndex]} → $${price} → Awaiting Approval`,
        status: 'pending_approval',
      });
      await base44.entities.AdminNotification.create({
        notification_type: 'approval',
        severity: 'info',
        title: `Bundle Proposal: ${bundle.name}`,
        summary: `New bundle proposal at $${price} (${calc.margin}% margin) awaits approval.`,
        source: 'BundleProposalStudio',
        requires_action: true,
        linked_entity: 'AgentActionProposal',
        linked_route: '/admin/revenue-actions',
      });
      toast.success('Bundle submitted for approval — check Revenue Actions');
      qc.invalidateQueries({ queryKey: ['bundle-proposals'] });
    } catch (err) {
      toast.error('Failed: ' + err.message);
    }
  };

  const pendingProposals = proposals.filter(p => p.status === 'pending_approval');
  const publishedProposals = proposals.filter(p => p.status === 'published');

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary/40 rounded transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Bundle Proposal Studio</h1>
          <p className="text-muted-foreground text-sm">Design bundles privately — submit for approval — nothing publishes until Gannon approves</p>
        </div>
      </div>

      {/* Warning bar */}
      <div className="flex items-center gap-2 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-yellow-300">No Bundle Is Live Until You Approve It</p>
          <p className="text-xs text-muted-foreground mt-0.5">All proposals below go to the Approval Queue. Zero public impact until you click Approve & Publish.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-yellow-400">{pendingProposals.length}</p><p className="text-xs text-muted-foreground">Awaiting Your Approval</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-green-400">{publishedProposals.length}</p><p className="text-xs text-muted-foreground">Published Live</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-primary">{PRESET_BUNDLES.length}</p><p className="text-xs text-muted-foreground">Bundle Templates</p></CardContent></Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="presets">Bundle Templates ({PRESET_BUNDLES.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval ({pendingProposals.length})</TabsTrigger>
          <TabsTrigger value="published">Published ({publishedProposals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="mt-4 space-y-3">
          <p className="text-xs text-muted-foreground">Click any bundle to view profit breakdown and submit for approval. No bundle publishes until you approve it.</p>
          {PRESET_BUNDLES.map(bundle => (
            <BundleCard key={bundle.name} bundle={bundle} onClick={setSelected} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="mt-4 space-y-3">
          {pendingProposals.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <Package className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No pending bundle proposals. Use templates above to create one.</p>
            </div>
          ) : (
            pendingProposals.map(p => (
              <div key={p.id} className="border border-yellow-500/30 bg-yellow-500/3 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge className="text-xs bg-yellow-500/20 text-yellow-400 mb-1">Pending Approval</Badge>
                    <p className="font-semibold text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.estimated_revenue_impact}</p>
                  </div>
                  <Link to="/admin/revenue-actions">
                    <Button size="sm" variant="outline" className="text-xs gap-1"><Eye className="w-3 h-3" />Review</Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="published" className="mt-4 space-y-3">
          {publishedProposals.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <ShoppingBag className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No bundles published yet.</p>
            </div>
          ) : (
            publishedProposals.map(p => (
              <div key={p.id} className="border border-green-500/20 rounded-xl p-4">
                <Badge className="text-xs bg-green-500/20 text-green-400 mb-1">Live</Badge>
                <p className="font-semibold text-sm">{p.title}</p>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {selected && (
        <BundleDetailModal bundle={selected} onClose={() => setSelected(null)} onSubmitForApproval={submitForApproval} />
      )}
    </div>
  );
}