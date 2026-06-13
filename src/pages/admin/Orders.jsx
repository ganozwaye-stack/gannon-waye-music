import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  Package, Send, Mail, MapPin, User, DollarSign, Calendar,
  TrendingUp, ShoppingBag, Printer, Download, Eye, Pencil,
  CheckCircle, Clock, Truck, AlertTriangle, AlertCircle, Archive, RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { emitEvent, EVENT_TYPES } from '@/lib/eventAutomation';

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', icon: Clock,        label: 'Pending',   next: 'confirmed' },
  confirmed: { color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',       icon: CheckCircle,  label: 'Confirmed', next: 'shipped' },
  shipped:   { color: 'bg-green-500/15 text-green-400 border-green-500/30',    icon: Truck,        label: 'Shipped',   next: 'delivered' },
  delivered: { color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: CheckCircle, label: 'Delivered', next: null },
  cancelled: { color: 'bg-red-500/15 text-red-400 border-red-500/30',          icon: AlertCircle,  label: 'Cancelled', next: null },
  duplicate: { color: 'bg-orange-500/15 text-orange-400 border-orange-500/30', icon: AlertTriangle, label: 'Void',     next: null },
};

const FLOW_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

const isDuplicate = o => o.status === 'duplicate' || o.financial_status === 'duplicate_void';

// ─── Order Flow Progress bar ───────────────────────────────────────────────────
function OrderFlowBar({ status }) {
  const idx = FLOW_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1 w-full">
      {FLOW_STEPS.map((s, i) => {
        const cfg = STATUS_CONFIG[s];
        const Icon = cfg.icon;
        const done = i <= idx;
        const active = i === idx;
        return (
          <React.Fragment key={s}>
            <div className={`flex flex-col items-center gap-1 ${active ? 'opacity-100' : done ? 'opacity-70' : 'opacity-25'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${active ? 'border-primary bg-primary/15' : done ? 'border-green-500/40 bg-green-500/10' : 'border-border/40 bg-secondary/30'}`}>
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-primary' : done ? 'text-green-400' : 'text-muted-foreground'}`} />
              </div>
              <p className="font-body text-[8px] uppercase tracking-wider text-muted-foreground">{cfg.label}</p>
            </div>
            {i < FLOW_STEPS.length - 1 && (
              <div className={`flex-1 h-px mt-[-12px] transition-all ${i < idx ? 'bg-green-500/40' : 'bg-border/30'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Tracking gate — blocks "shipped" without tracking number ─────────────────
function ShippingGate({ order, onConfirm, onCancel }) {
  const [tracking, setTracking] = useState(order.tracking_number || '');
  const valid = tracking.trim().length >= 4;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border/40 rounded-2xl p-6 max-w-sm w-full space-y-4">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg text-foreground">Mark as Shipped</h3>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'rgba(245,200,66,0.06)', border: '1px solid rgba(245,200,66,0.18)' }}>
          <p className="font-body text-xs text-yellow-300">
            ⚠ A tracking number is required before marking as shipped. The customer will be notified by email.
          </p>
        </div>
        <div>
          <Label className="font-body text-xs tracking-wider uppercase mb-2 block">Tracking Number *</Label>
          <Input
            value={tracking}
            onChange={e => setTracking(e.target.value)}
            placeholder="e.g. EP123456789AU"
            autoFocus
            className="font-mono"
          />
          {!valid && tracking.length > 0 && (
            <p className="text-xs text-destructive mt-1">Enter a valid tracking number</p>
          )}
        </div>
        <p className="font-body text-xs text-muted-foreground">
          Customer: <strong className="text-foreground">{order.customer_name}</strong> · {order.customer_email}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
          <Button disabled={!valid} onClick={() => onConfirm(tracking.trim())} className="flex-1 gap-2">
            <Truck className="w-4 h-4" /> Confirm Shipped
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Orders page ──────────────────────────────────────────────────────────
export default function Orders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [shippingGate, setShippingGate] = useState(null); // order that triggered gate

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['merchOrders'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date'),
    initialData: [],
  });

  const { data: products = [] } = useQuery({
    queryKey: ['merchProducts'],
    queryFn: () => base44.entities.MerchProduct.list(),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const oldOrder = orders.find(o => o.id === id);
      const result = await base44.entities.MerchOrder.update(id, data);
      if (data.status && data.status !== oldOrder?.status) {
        if (data.status === 'shipped') await emitEvent(EVENT_TYPES.ORDER_SHIPPED, { ...oldOrder, ...data, id });
        await emitEvent(EVENT_TYPES.ORDER_UPDATED, { ...oldOrder, ...data, id });
      }
      return result;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['merchOrders'] });
      // Update selected in place
      if (selected?.id === vars.id) setSelected(prev => ({ ...prev, ...vars.data }));
      toast({ title: 'Order updated' });
    },
  });

  // Status change handler — intercepts "shipped" to require tracking
  const handleStatusChange = (order, newStatus) => {
    if (newStatus === 'shipped' && !order.tracking_number) {
      setShippingGate(order);
      return;
    }
    updateMutation.mutate({ id: order.id, data: { status: newStatus } });
    if (selected?.id === order.id) setSelected(prev => ({ ...prev, status: newStatus }));
  };

  const confirmShipping = async (order, trackingNumber) => {
    await updateMutation.mutateAsync({ id: order.id, data: { status: 'shipped', tracking_number: trackingNumber } });
    setShippingGate(null);
    if (selected?.id === order.id) setSelected(prev => ({ ...prev, status: 'shipped', tracking_number: trackingNumber }));
    // Auto-send tracking email
    sendShippingEmail({ ...order, tracking_number: trackingNumber });
  };

  const sendReceiptEmail = async (order) => {
    if (!order?.customer_email) return;
    setSendingEmail(true);
    try {
      const itemsText = order.items?.map(i => `${i.product_name}${i.size ? ` (${i.size})` : ''} x${i.quantity} — $${i.price?.toFixed(2)}`).join('\n');
      await base44.integrations.Core.SendEmail({
        to: order.customer_email,
        subject: `Your Order Receipt — Gannon Waye Merch #${order.id.slice(-6)}`,
        body: `Hi ${order.customer_name},\n\nThank you for your order!\n\nOrder #${order.id.slice(-6)}\nDate: ${order.created_date ? format(new Date(order.created_date), 'PPP') : ''}\n\nItems:\n${itemsText}\n\nTotal: $${order.total_amount?.toFixed(2)} AUD\n\nShipping to: ${order.shipping_address}\n\nWe'll be in touch once your order ships.\n\nWith love,\nGannon Waye\ngannonwaye.com`,
      });
      toast({ title: 'Receipt sent!', description: order.customer_email });
    } catch { toast({ title: 'Failed to send', variant: 'destructive' }); }
    setSendingEmail(false);
  };

  const sendShippingEmail = async (order) => {
    if (!order?.customer_email) return;
    try {
      await base44.integrations.Core.SendEmail({
        to: order.customer_email,
        subject: `Your order is on its way! 🚚 — Gannon Waye Merch`,
        body: `Hi ${order.customer_name},\n\nGreat news — your order has been shipped!\n\nTracking number: ${order.tracking_number}\n\nYou can use this number to track your parcel with Australia Post or your carrier.\n\nOrder #${order.id.slice(-6)}\nShipping to: ${order.shipping_address}\n\nThank you for supporting the Thankyou campaign. It means everything.\n\nGannon Waye\ngannonwaye.com`,
      });
      toast({ title: '📦 Shipping email sent to customer!' });
    } catch { toast({ title: 'Could not send shipping email', variant: 'destructive' }); }
  };

  const sendStatusUpdateEmail = async (order, newStatus) => {
    if (!order?.customer_email) return;
    const messages = {
      confirmed: `Your order has been confirmed and is being prepared for dispatch.`,
      delivered: `We hope you love your order! It's been marked as delivered. Please reach out if there's anything wrong.`,
    };
    if (!messages[newStatus]) return;
    try {
      await base44.integrations.Core.SendEmail({
        to: order.customer_email,
        subject: `Order Update — ${STATUS_CONFIG[newStatus]?.label} · Gannon Waye`,
        body: `Hi ${order.customer_name},\n\n${messages[newStatus]}\n\nOrder #${order.id.slice(-6)}\n\nGannon Waye\ngannonwaye.com`,
      });
      toast({ title: `Customer notified: ${STATUS_CONFIG[newStatus]?.label}` });
    } catch {}
  };

  const activeOrders = useMemo(() => orders.filter(o => !isDuplicate(o)), [orders]);
  const duplicateOrders = useMemo(() => orders.filter(o => isDuplicate(o)), [orders]);

  const filtered = useMemo(() => {
    const pool = statusFilter === 'duplicates' ? duplicateOrders : activeOrders;
    return pool.filter(order => {
      const statusMatch = statusFilter === 'all' || statusFilter === 'duplicates' || order.status === statusFilter;
      const searchMatch = !searchTerm ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchTerm.toLowerCase());
      let dateMatch = true;
      if (dateRange !== 'all' && order.created_date) {
        const od = new Date(order.created_date); const now = new Date();
        if (dateRange === 'today') dateMatch = od.toDateString() === now.toDateString();
        else if (dateRange === 'week') dateMatch = od >= new Date(now - 7 * 864e5);
        else if (dateRange === 'month') dateMatch = od >= new Date(now - 30 * 864e5);
      }
      return statusMatch && searchMatch && dateMatch;
    });
  }, [orders, activeOrders, duplicateOrders, statusFilter, searchTerm, dateRange]);

  const analytics = useMemo(() => {
    const total = activeOrders.length;
    const revenue = activeOrders.reduce((s, o) => s + (o.total_amount || 0), 0);
    const pending = activeOrders.filter(o => o.status === 'pending').length;
    const confirmed = activeOrders.filter(o => o.status === 'confirmed').length;
    const shipped = activeOrders.filter(o => o.status === 'shipped').length;
    const delivered = activeOrders.filter(o => o.status === 'delivered').length;
    const cancelled = activeOrders.filter(o => o.status === 'cancelled').length;
    const duplicateCount = duplicateOrders.length;
    const duplicateRevenue = duplicateOrders.reduce((s, o) => s + (o.total_amount || 0), 0);
    return { total, revenue, pending, confirmed, shipped, delivered, cancelled, duplicateCount, duplicateRevenue };
  }, [activeOrders, duplicateOrders]);

  return (
    <div className="space-y-6">
      {/* Shipping gate overlay */}
      <AnimatePresence>
        {shippingGate && (
          <ShippingGate
            order={shippingGate}
            onConfirm={(tracking) => confirmShipping(shippingGate, tracking)}
            onCancel={() => setShippingGate(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Orders</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            {analytics.total} orders · ${analytics.revenue.toFixed(2)} revenue · {analytics.pending} pending · {analytics.shipped} in transit
            {analytics.duplicateCount > 0 && <span className="ml-2 text-orange-400/70">· {analytics.duplicateCount} void excluded</span>}
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" /> Export
        </Button>
      </div>

      {/* Order Pipeline — visual flow overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Pending',   value: analytics.pending,   icon: Clock,         color: 'text-yellow-400', filter: 'pending' },
          { label: 'Confirmed', value: analytics.confirmed, icon: CheckCircle,   color: 'text-blue-400',   filter: 'confirmed' },
          { label: 'Shipped',   value: analytics.shipped,   icon: Truck,         color: 'text-green-400',  filter: 'shipped' },
          { label: 'Delivered', value: analytics.delivered, icon: Package,       color: 'text-emerald-400',filter: 'delivered' },
          { label: 'Revenue',   value: `$${analytics.revenue.toFixed(0)}`, icon: DollarSign, color: 'text-primary', filter: null, route: '/admin/financials' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => stat.route ? navigate(stat.route) : stat.filter && setStatusFilter(stat.filter)}
              role="button" tabIndex={0}
              className="bg-card border border-border/40 rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-all">
              <Icon className={`w-4 h-4 ${stat.color} mb-2`} />
              <p className="font-display text-2xl text-foreground">{stat.value}</p>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Input placeholder="Search name, email, order ID…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && e.preventDefault()} className="flex-1 min-w-[200px] bg-secondary/50" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active Orders</SelectItem>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="duplicates">⚠ Void / Duplicates</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Duplicate warning */}
      {analytics.duplicateCount > 0 && statusFilter !== 'duplicates' && (
        <div className="border border-orange-500/30 bg-orange-500/08 rounded-xl p-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
          <p className="text-sm text-orange-300">
            {analytics.duplicateCount} void order{analytics.duplicateCount > 1 ? 's' : ''} excluded (${analytics.duplicateRevenue.toFixed(2)} AUD).
            <button className="underline ml-1" onClick={() => setStatusFilter('duplicates')}>View</button>
          </p>
        </div>
      )}

      {/* Order list */}
      <div className="space-y-2">
        {filtered.map((order, i) => {
          const isVoid = isDuplicate(order);
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
          const Icon = cfg.icon;
          const needsTracking = order.status === 'confirmed';

          return (
            <motion.div key={order.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
              className={`bg-card border rounded-xl p-4 hover:border-primary/20 transition-all cursor-pointer ${isVoid ? 'border-orange-500/30 opacity-60' : 'border-border/30'}`}
              onClick={() => setSelected(order)}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${cfg.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-body text-sm font-medium text-foreground">{order.customer_name}</p>
                      <Badge variant="outline" className="text-[9px]">#{order.id.slice(-6)}</Badge>
                      {needsTracking && !order.tracking_number && (
                        <span className="font-body text-[9px] text-yellow-400 border border-yellow-500/30 rounded-full px-2 py-0.5">needs tracking</span>
                      )}
                    </div>
                    <p className="font-body text-xs text-muted-foreground">{order.customer_email}</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      {order.items?.length || 0} items · {order.created_date ? format(new Date(order.created_date), 'MMM d') : ''}
                      {order.tracking_number && <span className="ml-2 font-mono text-[9px] text-muted-foreground/50">{order.tracking_number}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isVoid && <Badge className="text-[9px] bg-orange-500/15 text-orange-400">VOID</Badge>}
                  <Badge className={`text-[9px] tracking-widest uppercase border ${cfg.color}`}>{cfg.label}</Badge>
                  <p className="font-display text-lg text-primary">${order.total_amount?.toFixed(2)}</p>
                  <Button size="sm" variant="outline" className="gap-1 text-xs">
                    <Eye className="w-3 h-3" /> View
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-24 bg-card border border-border/30 rounded-2xl">
            <Package className="w-16 h-16 text-muted-foreground/15 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">No orders found.</p>
          </div>
        )}
      </div>

      {/* Order detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setEditingNotes(false); }}>
        <DialogContent className="bg-card border-border/40 max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="font-display text-2xl">Order #{selected?.id?.slice(-6)}</DialogTitle>
              {selected && (
                <Badge className={`text-[10px] tracking-widest uppercase border ${STATUS_CONFIG[selected.status]?.color}`}>
                  {STATUS_CONFIG[selected.status]?.label}
                </Badge>
              )}
            </div>
            <DialogDescription>
              {selected?.created_date ? format(new Date(selected.created_date), 'PPP p') : ''}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-6 mt-4">

              {/* Flow bar */}
              {!isDuplicate(selected) && (
                <div className="bg-secondary/20 rounded-xl p-4">
                  <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground mb-4">Order Progress</p>
                  <OrderFlowBar status={selected.status} />
                </div>
              )}

              {/* Customer + shipping */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3"><User className="w-4 h-4 text-primary" /><p className="font-display text-sm text-primary">Customer</p></div>
                  <p className="font-medium text-sm">{selected.customer_name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{selected.customer_email}</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3"><MapPin className="w-4 h-4 text-primary" /><p className="font-display text-sm text-primary">Shipping To</p></div>
                  <p className="text-sm">{selected.shipping_address}</p>
                </div>
              </div>

              {/* Items */}
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3"><ShoppingBag className="w-4 h-4 text-primary" /><p className="font-display text-sm text-primary">Items Ordered</p></div>
                <div className="space-y-3">
                  {selected.items?.map((item, i) => {
                    const product = products.find(p => p.id === item.product_id);
                    return (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-secondary/50 overflow-hidden shrink-0">
                            {product?.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-5 h-5 text-muted-foreground/20 m-3" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.product_name}</p>
                            {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-display text-primary">${item.price?.toFixed(2)}</p>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center pt-2">
                    <p className="font-body text-sm text-muted-foreground">Total</p>
                    <p className="font-display text-xl gradient-gold-glow">${selected.total_amount?.toFixed(2)} AUD</p>
                  </div>
                </div>
              </div>

              {/* ── Status Update ── */}
              <div className="bg-secondary/20 rounded-lg p-4 space-y-3">
                <p className="font-display text-sm text-primary flex items-center gap-2"><Package className="w-4 h-4" /> Update Status</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FLOW_STEPS.concat(['cancelled']).map(s => {
                    const cfg = STATUS_CONFIG[s];
                    const Icon = cfg.icon;
                    const isActive = selected.status === s;
                    return (
                      <button key={s} onClick={() => {
                        if (s === selected.status) return;
                        handleStatusChange(selected, s);
                        // Auto-send email for confirm/deliver
                        if (s === 'confirmed' || s === 'delivered') sendStatusUpdateEmail(selected, s);
                      }}
                        className={`rounded-xl p-3 flex flex-col items-center gap-1 border transition-all ${isActive ? `${cfg.color} border-current` : 'border-border/30 bg-secondary/20 hover:border-primary/30'}`}>
                        <Icon className="w-4 h-4" />
                        <span className="font-body text-[9px] uppercase tracking-wider">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
                {selected.status === 'confirmed' && !selected.tracking_number && (
                  <div className="rounded-lg p-2 flex items-center gap-2" style={{ background: 'rgba(245,200,66,0.06)', border: '1px solid rgba(245,200,66,0.18)' }}>
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    <p className="font-body text-xs text-yellow-300">Add a tracking number before marking as shipped</p>
                  </div>
                )}
              </div>

              {/* ── Tracking ── */}
              <div className="bg-secondary/20 rounded-lg p-4">
                <p className="font-display text-sm text-primary flex items-center gap-2 mb-3"><Truck className="w-4 h-4" /> Tracking Number</p>
                <div className="flex gap-2">
                  <Input
                    value={selected.tracking_number || ''}
                    onChange={e => setSelected({ ...selected, tracking_number: e.target.value })}
                    onBlur={() => updateMutation.mutate({ id: selected.id, data: { tracking_number: selected.tracking_number } })}
                    placeholder="e.g. EP123456789AU"
                    className="flex-1 font-mono"
                  />
                  <Button onClick={() => sendShippingEmail(selected)} disabled={!selected.tracking_number || sendingEmail} className="gap-2 shrink-0">
                    <Send className="w-4 h-4" /> {sendingEmail ? '…' : 'Email Customer'}
                  </Button>
                </div>
                {selected.tracking_number && (
                  <p className="font-body text-xs text-green-400 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Tracking: <span className="font-mono">{selected.tracking_number}</span>
                  </p>
                )}
              </div>

              {/* ── Email actions ── */}
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => sendReceiptEmail(selected)} disabled={sendingEmail} className="gap-2">
                  <Mail className="w-3.5 h-3.5" /> Resend Receipt
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Printer className="w-3.5 h-3.5" /> Print Order
                </Button>
              </div>

              {/* ── Notes ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-body text-xs tracking-wider uppercase">Internal Notes</Label>
                  <Button size="sm" variant="ghost" onClick={() => { setNotesText(selected.notes || ''); setEditingNotes(true); }} className="gap-1">
                    <Pencil className="w-3 h-3" /> Edit
                  </Button>
                </div>
                {editingNotes ? (
                  <div className="space-y-2">
                    <Textarea value={notesText} onChange={e => setNotesText(e.target.value)} rows={3} />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { updateMutation.mutate({ id: selected.id, data: { notes: notesText } }); setSelected({ ...selected, notes: notesText }); setEditingNotes(false); }}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingNotes(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-secondary/30 rounded-lg p-3 min-h-[56px]">
                    <p className="text-sm text-muted-foreground">{selected.notes || 'No notes'}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}