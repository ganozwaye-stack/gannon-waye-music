import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Package, Plus, DollarSign, TrendingUp, AlertTriangle,
  CheckCircle2, Clock, Truck, RefreshCw, ExternalLink, ChevronRight,
  ShoppingCart, BarChart3, Boxes, Calculator
} from 'lucide-react';

export default function ProcurementCommand() {
  const [showNewPO, setShowNewPO] = useState(false);
  const [newPO, setNewPO] = useState({
    supplier_name: '', product_name: '', qty_ordered: '', product_total_aud: '',
    shipping_cost_aud: '', currency: 'USD', exchange_rate: '1.55',
    alibaba_order_number: '', expected_arrival: '', notes: '',
    taxes_duties_aud: '0', platform_fees_aud: '0', payment_processing_fee_aud: '0', currency_conversion_fee_aud: '0',
  });
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: () => base44.entities.PurchaseOrder.list('-created_date', 50),
  });
  const { data: batches = [] } = useQuery({
    queryKey: ['inventory-batches'],
    queryFn: () => base44.entities.InventoryBatch.list('-created_date', 50),
  });
  const { data: calcs = [] } = useQuery({
    queryKey: ['landed-cost-calcs'],
    queryFn: () => base44.entities.LandedCostCalculation.list('-created_date', 20),
  });

  const calcLanded = () => {
    const qty = parseFloat(newPO.qty_ordered) || 1;
    const productCost = parseFloat(newPO.product_total_aud) || 0;
    const shipping = parseFloat(newPO.shipping_cost_aud) || 0;
    const taxes = parseFloat(newPO.taxes_duties_aud) || 0;
    const platformFees = parseFloat(newPO.platform_fees_aud) || 0;
    const payFee = parseFloat(newPO.payment_processing_fee_aud) || 0;
    const currFee = parseFloat(newPO.currency_conversion_fee_aud) || 0;
    const total = productCost + shipping + taxes + platformFees + payFee + currFee;
    const perUnit = qty > 0 ? total / qty : 0;
    return { total, perUnit, qty };
  };

  const lc = calcLanded();

  const handleCreate = async () => {
    if (!newPO.supplier_name || !newPO.product_name || !newPO.qty_ordered || !newPO.product_total_aud) {
      toast.error('Fill in supplier, product, quantity, and product total');
      return;
    }
    setSaving(true);
    const { total, perUnit, qty } = calcLanded();
    const isMissingShipping = !parseFloat(newPO.shipping_cost_aud);
    const poNumber = `PO-${Date.now().toString().slice(-6)}`;

    const po = await base44.entities.PurchaseOrder.create({
      po_number: poNumber,
      supplier_name: newPO.supplier_name,
      platform: 'alibaba',
      alibaba_order_number: newPO.alibaba_order_number,
      currency: newPO.currency,
      exchange_rate: parseFloat(newPO.exchange_rate) || 1.55,
      product_total_aud: parseFloat(newPO.product_total_aud),
      shipping_cost_aud: parseFloat(newPO.shipping_cost_aud) || 0,
      taxes_duties_aud: parseFloat(newPO.taxes_duties_aud) || 0,
      platform_fees_aud: parseFloat(newPO.platform_fees_aud) || 0,
      payment_processing_fee_aud: parseFloat(newPO.payment_processing_fee_aud) || 0,
      currency_conversion_fee_aud: parseFloat(newPO.currency_conversion_fee_aud) || 0,
      total_landed_cost_aud: total,
      expected_arrival: newPO.expected_arrival || null,
      notes: newPO.notes,
      status: 'pending_approval',
      is_preliminary: isMissingShipping,
      source_chain: `ProcurementCommand → ${new Date().toISOString()}`,
    });

    await base44.entities.LandedCostCalculation.create({
      purchase_order_id: po.id,
      product_name: newPO.product_name,
      calculation_type: isMissingShipping ? 'preliminary' : 'final',
      qty_ordered: qty,
      product_cost_aud: parseFloat(newPO.product_total_aud),
      shipping_cost_aud: parseFloat(newPO.shipping_cost_aud) || 0,
      taxes_duties_aud: parseFloat(newPO.taxes_duties_aud) || 0,
      platform_fees_aud: parseFloat(newPO.platform_fees_aud) || 0,
      payment_fee_aud: parseFloat(newPO.payment_processing_fee_aud) || 0,
      currency_fee_aud: parseFloat(newPO.currency_conversion_fee_aud) || 0,
      total_order_cost_aud: total,
      landed_cost_per_unit_aud: perUnit,
      allocation_method: 'proportional_cost',
      formula_notes: `Total ($${total.toFixed(2)}) ÷ ${qty} units = $${perUnit.toFixed(2)}/unit`,
      source_chain: `ProcurementCommand → PO ${poNumber}`,
      calculated_by: 'ProcurementCommand',
    });

    await base44.entities.InventoryBatch.create({
      purchase_order_id: po.id,
      product_name: newPO.product_name,
      qty_ordered: qty,
      qty_received: 0,
      qty_available: 0,
      landed_cost_per_unit_aud: perUnit,
      total_batch_cost_aud: total,
      stock_value_aud: total,
      status: 'ordered',
      is_preliminary_cost: isMissingShipping,
      source_chain: `ProcurementCommand → PO ${poNumber}`,
    });

    if (isMissingShipping) {
      await base44.entities.AdminNotification.create({
        notification_type: 'approval',
        severity: 'warning',
        title: `⚠️ Action Required: Enter shipping cost for ${newPO.product_name}`,
        summary: `PO ${poNumber} — landed cost is PRELIMINARY ($${perUnit.toFixed(2)}/unit) because shipping/fees were not entered. Update PO to finalise.`,
        source: 'ProcurementCommand',
        requires_action: true,
        linked_entity: 'PurchaseOrder',
        linked_id: po.id,
        linked_route: '/admin/purchase-orders',
      });
    }

    toast.success(`PO ${poNumber} created — landed cost $${perUnit.toFixed(2)}/unit${isMissingShipping ? ' (PRELIMINARY — shipping missing)' : ''}`);
    setShowNewPO(false);
    setNewPO({ supplier_name: '', product_name: '', qty_ordered: '', product_total_aud: '', shipping_cost_aud: '', currency: 'USD', exchange_rate: '1.55', alibaba_order_number: '', expected_arrival: '', notes: '', taxes_duties_aud: '0', platform_fees_aud: '0', payment_processing_fee_aud: '0', currency_conversion_fee_aud: '0' });
    qc.invalidateQueries();
    setSaving(false);
  };

  const statusColors = {
    draft: 'bg-secondary text-muted-foreground border-border',
    pending_approval: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    approved: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    ordered: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    paid: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    shipped: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    received: 'bg-green-500/20 text-green-300 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  const totalStockValue = batches.reduce((s, b) => s + (b.stock_value_aud || 0), 0);
  const totalOrdered = batches.reduce((s, b) => s + (b.qty_ordered || 0), 0);
  const totalReceived = batches.reduce((s, b) => s + (b.qty_received || 0), 0);
  const totalAvailable = batches.reduce((s, b) => s + (b.qty_available || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Commerce</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Procurement Command</h1>
          <p className="text-muted-foreground text-sm mt-1">Alibaba · Suppliers · Purchase Orders · Landed Cost · Inventory</p>
        </div>
        <Button onClick={() => setShowNewPO(true)} className="gap-2"><Plus className="w-4 h-4" /> New Purchase Order</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Stock Value (AUD)', value: `$${totalStockValue.toFixed(2)}`, icon: DollarSign, color: 'text-primary' },
          { label: 'Total Ordered', value: totalOrdered, icon: Package, color: 'text-blue-400' },
          { label: 'Total Received', value: totalReceived, icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Available Stock', value: totalAvailable, icon: Boxes, color: 'text-purple-400' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Quick nav */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Purchase Orders', path: '/admin/purchase-orders', icon: ShoppingCart },
          { label: 'Landed Cost Calculator', path: '/admin/landed-cost-calculator', icon: Calculator },
          { label: 'Stock Flow', path: '/admin/stock-flow-dashboard', icon: BarChart3 },
          { label: 'Supplier Products', path: '/admin/supplier-products', icon: Package },
          { label: 'Inventory Batches', path: '/admin/inventory-batches', icon: Boxes },
        ].map(n => (
          <Link key={n.path} to={n.path}>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <n.icon className="w-3 h-3" /> {n.label}
            </Button>
          </Link>
        ))}
      </div>

      {/* Alibaba integration level */}
      <Card className="border-amber-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-amber-400" /> Alibaba Integration Level
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-400 mb-1">✅ Level 1 — Manual (ACTIVE)</p>
              <p className="text-xs text-muted-foreground">Enter orders, costs, tracking manually. Works now with no API access.</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-400 mb-1">⚡ Level 2 — CSV Import (READY)</p>
              <p className="text-xs text-muted-foreground">Upload Alibaba order export CSV. System parses supplier, products, costs.</p>
              <Button size="sm" variant="outline" className="mt-2 text-xs gap-1">
                <Plus className="w-3 h-3" /> Upload CSV
              </Button>
            </div>
            <div className="bg-secondary border border-border/40 rounded-lg p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">🔒 Level 3 — API (NOT CONNECTED)</p>
              <p className="text-xs text-muted-foreground">Alibaba API requires seller/buyer credentials. Manual login required.</p>
              <a href="https://open.alibaba.com/" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="mt-2 text-xs gap-1">
                  <ExternalLink className="w-3 h-3" /> Alibaba Open Platform
                </Button>
              </a>
            </div>
          </div>
          <p className="text-xs text-amber-400">⚠️ Orders/payments through Alibaba require Gannon's manual approval. System prepares purchase proposals only.</p>
        </CardContent>
      </Card>

      {/* New PO form */}
      {showNewPO && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-sm">Create Purchase Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Supplier Name *</Label>
                <Input value={newPO.supplier_name} onChange={e => setNewPO(p => ({ ...p, supplier_name: e.target.value }))} placeholder="e.g. Alibaba Supplier Co." className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Product Name *</Label>
                <Input value={newPO.product_name} onChange={e => setNewPO(p => ({ ...p, product_name: e.target.value }))} placeholder="e.g. Coffee Mug" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Quantity Ordered *</Label>
                <Input type="number" value={newPO.qty_ordered} onChange={e => setNewPO(p => ({ ...p, qty_ordered: e.target.value }))} placeholder="36" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Product Total (AUD) *</Label>
                <Input type="number" value={newPO.product_total_aud} onChange={e => setNewPO(p => ({ ...p, product_total_aud: e.target.value }))} placeholder="139.26" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Shipping Cost (AUD) — leave 0 if unknown</Label>
                <Input type="number" value={newPO.shipping_cost_aud} onChange={e => setNewPO(p => ({ ...p, shipping_cost_aud: e.target.value }))} placeholder="0" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Taxes/Duties (AUD)</Label>
                <Input type="number" value={newPO.taxes_duties_aud} onChange={e => setNewPO(p => ({ ...p, taxes_duties_aud: e.target.value }))} placeholder="0" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Platform Fees (AUD)</Label>
                <Input type="number" value={newPO.platform_fees_aud} onChange={e => setNewPO(p => ({ ...p, platform_fees_aud: e.target.value }))} placeholder="0" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Alibaba Order Number</Label>
                <Input value={newPO.alibaba_order_number} onChange={e => setNewPO(p => ({ ...p, alibaba_order_number: e.target.value }))} placeholder="Optional" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Expected Arrival</Label>
                <Input type="date" value={newPO.expected_arrival} onChange={e => setNewPO(p => ({ ...p, expected_arrival: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Notes</Label>
                <Input value={newPO.notes} onChange={e => setNewPO(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes" className="mt-1" />
              </div>
            </div>

            {/* Live landed cost preview */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-primary mb-2">Live Landed Cost Preview</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Total Cost</p>
                  <p className="text-lg font-bold text-primary">${lc.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Units</p>
                  <p className="text-lg font-bold">{lc.qty}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Per Unit</p>
                  <p className="text-lg font-bold text-green-400">${lc.perUnit.toFixed(2)}</p>
                </div>
              </div>
              {!parseFloat(newPO.shipping_cost_aud) && (
                <p className="text-xs text-amber-400 mt-2">⚠️ Shipping not entered — this will be marked PRELIMINARY</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={saving} className="gap-2">
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Create PO + Landed Cost
              </Button>
              <Button variant="outline" onClick={() => setShowNewPO(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent POs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Recent Purchase Orders ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {orders.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No purchase orders yet. Create one above.</p>}
          {orders.slice(0, 10).map(o => (
            <div key={o.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{o.po_number} — {o.supplier_name}</p>
                <p className="text-xs text-muted-foreground">
                  Landed: ${(o.total_landed_cost_aud || 0).toFixed(2)} AUD
                  {o.is_preliminary && ' ⚠️ PRELIMINARY'}
                </p>
              </div>
              <Badge className={`text-[10px] border ${statusColors[o.status] || 'bg-secondary'}`}>{o.status}</Badge>
            </div>
          ))}
          <Link to="/admin/purchase-orders">
            <Button size="sm" variant="outline" className="w-full mt-1 gap-1">View All <ChevronRight className="w-3 h-3" /></Button>
          </Link>
        </CardContent>
      </Card>

      {/* Inventory batches */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Boxes className="w-4 h-4" /> Inventory Batches ({batches.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {batches.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No inventory batches yet.</p>}
          {batches.slice(0, 10).map(b => (
            <div key={b.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-secondary/30">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{b.product_name}</p>
                <p className="text-xs text-muted-foreground">
                  Ordered: {b.qty_ordered} · Received: {b.qty_received} · Available: {b.qty_available} · Cost/unit: ${(b.landed_cost_per_unit_aud || 0).toFixed(2)}
                  {b.is_preliminary_cost && ' ⚠️ PRELIM'}
                </p>
              </div>
              <Badge className={`text-[10px] border ${statusColors[b.status] || 'bg-secondary'}`}>{b.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}