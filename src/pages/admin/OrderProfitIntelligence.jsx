import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  ArrowLeft, Package,
  ChevronRight, Loader2, RefreshCw, ShoppingBag, XCircle, CheckCircle2,
  Clock, Truck, RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';

const STATUS_MAP = {
  new: { label: 'New Order', color: 'bg-blue-500/20 text-blue-400', group: 'active' },
  pending: { label: 'Pending Payment', color: 'bg-yellow-500/20 text-yellow-400', group: 'active' },
  paid: { label: 'Paid', color: 'bg-green-500/20 text-green-400', group: 'active' },
  processing: { label: 'Processing', color: 'bg-cyan-500/20 text-cyan-400', group: 'active' },
  packed: { label: 'Ready to Pack', color: 'bg-purple-500/20 text-purple-400', group: 'active' },
  shipped: { label: 'Shipped', color: 'bg-indigo-500/20 text-indigo-400', group: 'active' },
  completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-400', group: 'active' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-400', group: 'inactive' },
  refunded: { label: 'Refunded', color: 'bg-orange-500/20 text-orange-400', group: 'inactive' },
  deleted: { label: 'Deleted', color: 'bg-slate-500/20 text-slate-400', group: 'inactive' },
};

function calcProfit(order) {
  const gross = order.total_amount || 0;
  const discount = order.discount_amount || 0;
  const shipping = order.shipping_amount || 0;
  const itemsCost = (order.items || []).reduce((sum, item) => sum + (item.cost_price || 0) * (item.quantity || 1), 0);
  const deliveryCost = (order.items || []).reduce((sum, item) => sum + (item.delivery_cost || 0) * (item.quantity || 1), 0);
  const feePercent = 3.5;
  const stripeFee = gross * (feePercent / 100);
  const totalCost = itemsCost + deliveryCost + stripeFee;
  const netProfit = gross - discount - totalCost;
  const marginPct = gross > 0 ? ((netProfit / gross) * 100) : 0;
  return { gross, discount, shipping, itemsCost, deliveryCost, stripeFee, totalCost, netProfit, marginPct };
}

function OrderDetailModal({ order, onClose }) {
  const p = calcProfit(order);
  const sm = STATUS_MAP[order.status] || { label: order.status, color: 'bg-secondary text-muted-foreground' };
  const isInactive = sm.group === 'inactive';

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Order #{order.id?.slice(-8)}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge className={sm.color}>{sm.label}</Badge>
            {order.payment_status && <Badge className="bg-secondary text-muted-foreground">Payment: {order.payment_status}</Badge>}
            {isInactive && <Badge className="bg-red-500/20 text-red-300">⚠️ Excluded from active revenue</Badge>}
          </div>

          {/* Customer */}
          <div className="bg-secondary/30 rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Customer</p>
            <p className="font-medium">{order.customer_name || 'Unknown'}</p>
            {order.customer_email && <p className="text-xs text-muted-foreground">{order.customer_email}</p>}
            {order.shipping_address && <p className="text-xs text-muted-foreground mt-1">{order.shipping_address}</p>}
          </div>

          {/* Items */}
          {order.items?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Items</p>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between border border-border rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">{item.name || item.product_name}</p>
                      {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm">x{item.quantity || 1}</p>
                      <p className="text-xs text-muted-foreground">${(item.price || 0) * (item.quantity || 1)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial breakdown */}
          <div className="bg-secondary/20 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Financial Breakdown</p>
            <Row label="Gross Revenue" value={`$${p.gross.toFixed(2)}`} />
            {p.discount > 0 && <Row label="Discount Applied" value={`-$${p.discount.toFixed(2)}`} red />}
            <Row label="Shipping Collected" value={`$${p.shipping.toFixed(2)}`} />
            <div className="border-t border-border/50 my-1" />
            <Row label="Cost of Goods" value={`-$${p.itemsCost.toFixed(2)}`} red />
            <Row label="Delivery Cost" value={`-$${p.deliveryCost.toFixed(2)}`} red />
            <Row label="Payment Fees (~3.5%)" value={`-$${p.stripeFee.toFixed(2)}`} red />
            <div className="border-t border-border/50 my-1" />
            <div className="flex items-center justify-between">
              <span className="font-bold">Net Profit</span>
              <span className={`font-bold text-base ${p.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>${p.netProfit.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Profit Margin</span>
              <span className={`font-medium ${p.marginPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>{p.marginPct.toFixed(1)}%</span>
            </div>
          </div>

          {isInactive && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-red-400 mb-1">⚠️ Loss / Reversal</p>
              <p className="text-xs text-foreground/70">This order is {order.status} and is excluded from active sales totals. Lost potential revenue: ${p.gross.toFixed(2)}. Consider:</p>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li>• Send follow-up offer or alternative recommendation</li>
                <li>• Add to email nurture sequence</li>
                <li>• Offer limited-time re-engagement discount</li>
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div><span className="font-semibold text-foreground">Created:</span> {order.created_date ? format(new Date(order.created_date), 'dd MMM yyyy, h:mm a') : 'N/A'}</div>
            <div><span className="font-semibold text-foreground">Updated:</span> {order.updated_date ? format(new Date(order.updated_date), 'dd MMM yyyy, h:mm a') : 'N/A'}</div>
            {order.source_chain && <div className="col-span-2"><span className="font-semibold text-foreground">Source:</span> {order.source_chain}</div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, red }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={red ? 'text-red-400' : ''}>{value}</span>
    </div>
  );
}

export default function OrderProfitIntelligence() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('active');

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['all-orders-profit'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 200),
  });

  const active = orders.filter(o => STATUS_MAP[o.status]?.group === 'active');
  const inactive = orders.filter(o => STATUS_MAP[o.status]?.group === 'inactive');

  const byStatus = {};
  Object.keys(STATUS_MAP).forEach(s => { byStatus[s] = orders.filter(o => o.status === s); });

  const activeRevenue = active.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const lostRevenue = inactive.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const avgProfit = active.length > 0 ? active.reduce((sum, o) => sum + calcProfit(o).netProfit, 0) / active.length : 0;

  const statGroups = [
    { status: 'new', icon: Package, label: 'New Orders' },
    { status: 'pending', icon: Clock, label: 'Pending Payment' },
    { status: 'paid', icon: CheckCircle2, label: 'Paid' },
    { status: 'packed', icon: ShoppingBag, label: 'Ready to Pack' },
    { status: 'shipped', icon: Truck, label: 'Shipped' },
    { status: 'completed', icon: CheckCircle2, label: 'Completed' },
  ];
  const inactiveGroups = [
    { status: 'cancelled', icon: XCircle, label: 'Cancelled' },
    { status: 'refunded', icon: RotateCcw, label: 'Refunded' },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary/40 rounded"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Order Profit Intelligence</h1>
            <p className="text-sm text-muted-foreground mt-1">Every order separated, profit calculated, losses tracked</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1">
          <RefreshCw className="w-3 h-3" />Refresh
        </Button>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-green-500/20">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-400">${activeRevenue.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Active Revenue (AUD)</p>
            <p className="text-xs text-muted-foreground mt-1">Paid, active orders only</p>
          </CardContent>
        </Card>
        <Card className="border-red-500/20">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-red-400">${lostRevenue.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Lost / Reversed (AUD)</p>
            <p className="text-xs text-muted-foreground mt-1">Cancelled + refunded</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-primary">{active.length}</p>
            <p className="text-xs text-muted-foreground">Active Orders</p>
            <p className="text-xs text-muted-foreground mt-1">Excludes cancelled/refunded</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className={`text-2xl font-bold ${avgProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>${avgProfit.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Avg Net Profit/Order</p>
          </CardContent>
        </Card>
      </div>

      {/* Status breakdown */}
      <Card>
        <CardHeader><CardTitle className="text-base">Active Orders by Status</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {statGroups.map(({ status, icon: Icon, label }) => (
            <button key={status} onClick={() => setTab('active')} className="text-left border border-border rounded-xl p-3 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-primary" />
                <Badge className={STATUS_MAP[status]?.color}>{STATUS_MAP[status]?.label}</Badge>
              </div>
              <p className="text-2xl font-bold">{byStatus[status]?.length || 0}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="border-red-500/20">
        <CardHeader><CardTitle className="text-base text-red-400">Inactive Orders (excluded from active totals)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {inactiveGroups.map(({ status, icon: Icon, label }) => (
            <button key={status} onClick={() => setTab('inactive')} className="text-left border border-border rounded-xl p-3 hover:border-red-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-red-400" />
                <Badge className={STATUS_MAP[status]?.color}>{STATUS_MAP[status]?.label}</Badge>
              </div>
              <p className="text-2xl font-bold text-red-400">{byStatus[status]?.length || 0}</p>
              <p className="text-xs text-muted-foreground">{label} — internally auditable</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="inactive">Cancelled/Refunded ({inactive.length})</TabsTrigger>
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
        </TabsList>

        {['active', 'inactive', 'all'].map(t => (
          <TabsContent key={t} value={t} className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : (
              <div className="space-y-2">
                {(t === 'active' ? active : t === 'inactive' ? inactive : orders).map(order => {
                  const sm = STATUS_MAP[order.status] || { label: order.status, color: 'bg-secondary text-muted-foreground' };
                  const p = calcProfit(order);
                  return (
                    <button key={order.id} onClick={() => setSelected(order)} className="w-full text-left border border-border rounded-xl p-4 hover:border-primary/40 hover:bg-secondary/20 transition-all group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-1.5 mb-1">
                            <Badge className={`text-xs ${sm.color}`}>{sm.label}</Badge>
                            {order.payment_status && <Badge className="text-xs bg-secondary text-muted-foreground">{order.payment_status}</Badge>}
                          </div>
                          <p className="font-semibold text-sm">{order.customer_name || 'Unknown Customer'}</p>
                          <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                          {order.created_date && <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(order.created_date), 'dd MMM yyyy')}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-sm">${(order.total_amount || 0).toFixed(2)}</p>
                          <p className={`text-xs ${p.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>Profit: ${p.netProfit.toFixed(2)}</p>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto mt-1" />
                        </div>
                      </div>
                    </button>
                  );
                })}
                {(t === 'active' ? active : t === 'inactive' ? inactive : orders).length === 0 && (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <Package className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">No orders in this category</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {selected && <OrderDetailModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}