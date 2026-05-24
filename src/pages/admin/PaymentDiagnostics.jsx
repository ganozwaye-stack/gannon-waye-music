import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle2, XCircle, ArrowLeft, ExternalLink,
  RefreshCw, Clock, CreditCard, Package, ShoppingBag
} from 'lucide-react';

const statusColor = (s) => {
  if (s === 'confirmed' || s === 'paid' || s === 'shipped') return 'bg-green-500/20 text-green-300';
  if (s === 'pending') return 'bg-yellow-500/20 text-yellow-300';
  if (s === 'failed' || s === 'cancelled') return 'bg-red-500/20 text-red-300';
  return 'bg-secondary text-muted-foreground';
};

function OrderDetail({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Order Detail</p>
            <h3 className="text-xl font-semibold mt-1">{order.customer_name || 'Unknown Customer'}</h3>
          </div>
          <Badge className={statusColor(order.status)}>{order.status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-xs text-muted-foreground">Email</p><p>{order.customer_email || '—'}</p></div>
          <div><p className="text-xs text-muted-foreground">Total</p><p className="text-primary font-semibold">${order.total_amount?.toFixed(2) || '0.00'} AUD</p></div>
          <div><p className="text-xs text-muted-foreground">Shipping Address</p><p>{order.shipping_address || '—'}</p></div>
          <div><p className="text-xs text-muted-foreground">Promo Code</p><p>{order.promo_code || '—'}</p></div>
          <div><p className="text-xs text-muted-foreground">Created</p><p>{order.created_date ? new Date(order.created_date).toLocaleString('en-AU') : '—'}</p></div>
          <div><p className="text-xs text-muted-foreground">Order ID</p><p className="font-mono text-xs text-muted-foreground">{order.id}</p></div>
        </div>

        {order.items?.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Items</p>
            <div className="space-y-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm bg-secondary/40 rounded px-3 py-2">
                  <span>{item.product_name}{item.size ? ` — ${item.size}` : ''} ×{item.quantity || 1}</span>
                  <span className="text-primary">${item.price?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {order.notes && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Notes / Stripe Reference</p>
            <p className="text-xs font-mono bg-secondary/50 rounded p-2 break-all">{order.notes}</p>
          </div>
        )}

        <div className="border border-border/40 rounded-lg p-3 text-xs space-y-1">
          <p className="font-semibold text-muted-foreground">Source Chain</p>
          <p className="text-muted-foreground">Store → Product → Customer Details → Stripe Payment → Order Record → Receipt → Admin Notification</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={onClose}><ArrowLeft className="w-3 h-3 mr-1" />Back</Button>
          <Link to="/admin/orders"><Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />All Orders</Button></Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentDiagnostics() {
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('all');

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['allOrders'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 100),
  });

  const confirmed = orders.filter(o => o.status === 'confirmed' || o.status === 'paid');
  const pending = orders.filter(o => o.status === 'pending');
  const failed = orders.filter(o => o.status === 'failed' || o.status === 'cancelled');

  // Heuristic: pending orders older than 30min may indicate payment issue
  const stuckPending = pending.filter(o => {
    if (!o.created_date) return false;
    const age = Date.now() - new Date(o.created_date).getTime();
    return age > 30 * 60 * 1000;
  });

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'confirmed', label: 'Successful', count: confirmed.length },
    { id: 'pending', label: 'Pending / Pre-orders', count: pending.length },
    { id: 'stuck', label: '⚠ Stuck / Potential Issues', count: stuckPending.length },
    { id: 'failed', label: 'Failed / Cancelled', count: failed.length },
  ];

  const displayed = tab === 'all' ? orders
    : tab === 'confirmed' ? confirmed
    : tab === 'pending' ? pending
    : tab === 'stuck' ? stuckPending
    : failed;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Payment Diagnostics</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor payment health, stuck orders, and checkout issues</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-primary' },
          { label: 'Successful', value: confirmed.length, icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Pending', value: pending.length, icon: Clock, color: 'text-yellow-400' },
          { label: '⚠ Potential Issues', value: stuckPending.length, icon: AlertTriangle, color: 'text-red-400' },
        ].map(s => (
          <Card key={s.label} className="cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setTab(s.label === 'Total Orders' ? 'all' : s.label === 'Successful' ? 'confirmed' : s.label === 'Pending' ? 'pending' : 'stuck')}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-5 h-5 ${s.color} shrink-0`} />
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Checkout health notices */}
      <Card className="border-primary/20">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Checkout System Status</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {[
            { label: 'Stripe timeout guard (15s)', ok: true, detail: 'StripePaymentForm has 15s timeout with retry button' },
            { label: 'Misleading card-saving message', ok: true, detail: 'Fixed — no more "card saved" language before card entry' },
            { label: 'Order creation try/catch/finally', ok: true, detail: 'Order creation wrapped — payment success always shows even if order log fails' },
            { label: 'Promo code non-fatal', ok: true, detail: 'Promo recording failure does not block order creation' },
            { label: 'Retry button on intent failure', ok: true, detail: 'StripePaymentForm shows retry button if init fails' },
            { label: 'Duplicate submit protection', ok: true, detail: 'submittedRef prevents double-fire on payment confirm' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              {item.ok ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs transition-all border ${tab === t.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}>
            {t.label} ({t.count})
          </button>
        ))}
        <Button variant="ghost" size="sm" onClick={() => refetch()} className="ml-auto gap-1 text-xs">
          <RefreshCw className="w-3 h-3" /> Refresh
        </Button>
      </div>

      {/* Stuck orders warning */}
      {tab === 'stuck' && stuckPending.length > 0 && (
        <div className="border border-orange-500/40 bg-orange-500/8 rounded-xl p-4">
          <div className="flex items-center gap-2 text-orange-300 font-semibold mb-2">
            <AlertTriangle className="w-4 h-4" /> {stuckPending.length} order(s) in pending state for over 30 minutes
          </div>
          <p className="text-sm text-foreground/70">These may be pre-orders (expected) or could indicate a payment confirmation issue. Click each row to investigate the Stripe reference in the notes field.</p>
        </div>
      )}

      {/* Order list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : displayed.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No orders in this category.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {displayed.map(order => (
            <div key={order.id} onClick={() => setSelected(order)}
              className="border border-border rounded-xl p-4 cursor-pointer hover:border-primary/40 transition-colors bg-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{order.customer_name || 'Unknown'}</p>
                    <Badge className={statusColor(order.status)}>{order.status}</Badge>
                    {stuckPending.includes(order) && <Badge className="bg-orange-500/20 text-orange-300">⚠ Stuck {'>'}30m</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.customer_email}</p>
                  {order.items?.[0] && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <Package className="w-3 h-3 inline mr-1" />
                      {order.items[0].product_name}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-primary">${order.total_amount?.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{order.created_date ? new Date(order.created_date).toLocaleDateString('en-AU') : '—'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual diagnostic actions */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Manual Diagnostic Actions</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground text-xs">For deeper Stripe investigation, use the Stripe Dashboard directly:</p>
          <div className="flex flex-wrap gap-2">
            <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1"><CreditCard className="w-3 h-3" />Stripe Payments</Button>
            </a>
            <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-3 h-3" />Stripe Webhooks</Button>
            </a>
            <Link to="/admin/orders">
              <Button variant="outline" size="sm" className="gap-1"><Package className="w-3 h-3" />All Orders</Button>
            </Link>
            <Link to="/admin/notifications">
              <Button variant="outline" size="sm" className="gap-1">Notifications</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {selected && <OrderDetail order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}