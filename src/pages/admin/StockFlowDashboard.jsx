import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Boxes, TrendingUp, AlertTriangle, DollarSign, Package, BarChart3, ArrowRight } from 'lucide-react';

export default function StockFlowDashboard() {
  const { data: batches = [] } = useQuery({
    queryKey: ['stock-flow-batches'],
    queryFn: () => base44.entities.InventoryBatch.list('-created_date', 100),
  });
  const { data: products = [] } = useQuery({
    queryKey: ['stock-flow-products'],
    queryFn: () => base44.entities.MerchProduct.list(),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ['stock-flow-pos'],
    queryFn: () => base44.entities.PurchaseOrder.list('-created_date', 20),
  });

  const totalValue = batches.reduce((s, b) => s + (b.stock_value_aud || 0), 0);
  const totalOrdered = batches.reduce((s, b) => s + (b.qty_ordered || 0), 0);
  const totalReceived = batches.reduce((s, b) => s + (b.qty_received || 0), 0);
  const totalAvailable = batches.reduce((s, b) => s + (b.qty_available || 0), 0);
  const totalSold = batches.reduce((s, b) => s + (b.qty_sold || 0), 0);
  const totalDamaged = batches.reduce((s, b) => s + (b.qty_damaged || 0), 0);
  const prelimCount = batches.filter(b => b.is_preliminary_cost).length;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Commerce</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Stock Flow Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Complete inventory view — ordered, received, available, sold, damaged</p>
      </div>

      {prelimCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300">{prelimCount} batch(es) have PRELIMINARY costs — enter shipping/fees to finalise</p>
          <Link to="/admin/purchase-orders" className="ml-auto">
            <Button size="sm" variant="outline" className="text-xs">Update POs</Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Stock Value', value: `$${totalValue.toFixed(2)}`, icon: DollarSign, color: 'text-primary' },
          { label: 'Total Ordered', value: totalOrdered, icon: Package, color: 'text-blue-400' },
          { label: 'Total Received', value: totalReceived, icon: Boxes, color: 'text-green-400' },
          { label: 'Available', value: totalAvailable, icon: TrendingUp, color: 'text-purple-400' },
          { label: 'Total Sold', value: totalSold, icon: BarChart3, color: 'text-amber-400' },
          { label: 'Damaged/Lost', value: totalDamaged, icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Active Products', value: products.filter(p => p.is_active).length, icon: Package, color: 'text-blue-400' },
          { label: 'In Transit', value: batches.filter(b => b.status === 'in_transit').length, icon: ArrowRight, color: 'text-orange-400' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Inventory batches table */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Inventory Batches</CardTitle></CardHeader>
        <CardContent className="pt-0">
          {batches.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">No inventory batches. Create a purchase order to start tracking.</p>}
          <div className="space-y-2">
            {batches.map(b => (
              <div key={b.id} className="p-3 rounded-lg bg-secondary/30 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{b.product_name}</p>
                  <div className="flex items-center gap-2">
                    {b.is_preliminary_cost && <Badge className="text-[10px] bg-amber-500/20 text-amber-300 border-amber-500/30">PRELIMINARY</Badge>}
                    <Badge className="text-[10px] bg-secondary border-border">{b.status}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2 text-xs text-muted-foreground">
                  <span>Ordered: <strong className="text-foreground">{b.qty_ordered}</strong></span>
                  <span>Received: <strong className="text-foreground">{b.qty_received}</strong></span>
                  <span>Available: <strong className="text-green-400">{b.qty_available}</strong></span>
                  <span>Sold: <strong className="text-amber-400">{b.qty_sold}</strong></span>
                  <span>Reserved: <strong className="text-blue-400">{b.qty_reserved}</strong></span>
                  <span>Damaged: <strong className="text-red-400">{b.qty_damaged}</strong></span>
                  <span>$/unit: <strong className="text-primary">${(b.landed_cost_per_unit_aud || 0).toFixed(2)}</strong></span>
                </div>
                <p className="text-xs text-muted-foreground">Stock Value: <strong className="text-primary">${(b.stock_value_aud || 0).toFixed(2)}</strong></p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products with stock */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Products — Cost & Margin</CardTitle></CardHeader>
        <CardContent className="pt-0 space-y-2">
          {products.length === 0 && <p className="text-xs text-muted-foreground py-4 text-center">No products yet.</p>}
          {products.map(p => {
            const margin = p.sale_price && p.cost_price ? ((p.sale_price - p.cost_price) / p.sale_price * 100) : null;
            return (
              <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-secondary/30">
                <div className="flex-1">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Cost: ${(p.cost_price || 0).toFixed(2)} · Sale: ${(p.sale_price || 0).toFixed(2)} · Stock: {p.stock_quantity}
                    {margin !== null && ` · Margin: ${margin.toFixed(1)}%`}
                  </p>
                </div>
                <Badge className={`text-[10px] ${p.is_active ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-secondary border-border text-muted-foreground'}`}>
                  {p.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}