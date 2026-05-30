import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Package, Send, Mail, FileText, MapPin, User, DollarSign, Calendar, TrendingUp, ShoppingBag, Printer, Download, Eye, Pencil, CheckCircle, Clock, Truck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { emitEvent, EVENT_TYPES } from '@/lib/eventAutomation';

const STATUS_COLORS = {
  pending: 'bg-chart-4/20 text-chart-4',
  confirmed: 'bg-primary/20 text-primary',
  shipped: 'bg-chart-2/20 text-chart-2',
  delivered: 'bg-chart-2/30 text-chart-2',
  cancelled: 'bg-destructive/20 text-destructive',
  duplicate: 'bg-gray-500/20 text-gray-400',
  needs_admin_review: 'bg-orange-500/20 text-orange-400',
};

const isDuplicate = (order) => order.status === 'duplicate' || order.financial_status === 'duplicate_void';

const STATUS_ICONS = {
  pending: Clock,
  confirmed: CheckCircle,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: Package,
};

export default function Orders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['merchOrders'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date'),
    initialData: [],
  });

  const { data: products } = useQuery({
    queryKey: ['merchProducts'],
    queryFn: () => base44.entities.MerchProduct.list(),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const oldOrder = orders.find(o => o.id === id);
      const result = await base44.entities.MerchOrder.update(id, data);
      
      // Emit event for status changes
      if (data.status && data.status !== oldOrder?.status) {
        if (data.status === 'shipped') {
          await emitEvent(EVENT_TYPES.ORDER_SHIPPED, { ...oldOrder, ...data, id });
        }
        await emitEvent(EVENT_TYPES.ORDER_UPDATED, { ...oldOrder, ...data, id });
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchOrders'] });
      toast({ title: 'Order updated successfully' });
    },
  });

  const sendReceiptEmail = async (order) => {
    if (!order?.customer_email) return;
    setSendingEmail(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: order.customer_email,
        subject: `Your Order Receipt #${order.id.slice(-6)}`,
        body: buildReceiptBody(order),
      });
      toast({ title: 'Receipt sent!', description: `Email sent to ${order.customer_email}` });
    } catch (e) {
      toast({ title: 'Failed to send', variant: 'destructive' });
    }
    setSendingEmail(false);
  };

  const sendTrackingEmail = async () => {
    if (!selected?.customer_email || !selected?.tracking_number) return;
    setSendingEmail(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: selected.customer_email,
        subject: `Your order has shipped! Tracking: ${selected.tracking_number}`,
        body: `Hi ${selected.customer_name},\n\nGreat news — your Gannon Waye merch is on its way!\n\nTracking number: ${selected.tracking_number}\n\nYou can use this number to track your package with the carrier.\n\nThank you for your support!\n\nGannon Waye`,
      });
      toast({ title: 'Tracking email sent!', description: `Email sent to ${selected.customer_email}` });
    } catch (e) {
      toast({ title: 'Failed to send', variant: 'destructive' });
    }
    setSendingEmail(false);
  };

  const buildReceiptBody = (order) => {
    const itemsText = order.items?.map(i => `${i.product_name}${i.size ? ` (${i.size})` : ''} x${i.quantity} - $${i.price?.toFixed(2)}`).join('\n');
    return `ORDER RECEIPT\n\nOrder #${order.id.slice(-6)}\nDate: ${order.created_date ? format(new Date(order.created_date), 'PPP') : ''}\n\nCustomer: ${order.customer_name}\nEmail: ${order.customer_email}\nShipping: ${order.shipping_address}\n\nItems:\n${itemsText}\n\nTotal: $${order.total_amount?.toFixed(2)} AUD\nStatus: ${order.status}\n\nThank you for your support!`;
  };

  // Separate active vs duplicate orders
  const activeOrders = useMemo(() => orders.filter(o => !isDuplicate(o)), [orders]);
  const duplicateOrders = useMemo(() => orders.filter(o => isDuplicate(o)), [orders]);

  // Advanced filtering — duplicates only shown in 'duplicates' filter
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
        const orderDate = new Date(order.created_date);
        const now = new Date();
        if (dateRange === 'today') {
          dateMatch = orderDate.toDateString() === now.toDateString();
        } else if (dateRange === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateMatch = orderDate >= weekAgo;
        } else if (dateRange === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          dateMatch = orderDate >= monthAgo;
        }
      }
      
      return statusMatch && searchMatch && dateMatch;
    });
  }, [orders, activeOrders, duplicateOrders, statusFilter, searchTerm, dateRange]);

  // Analytics — ONLY from active (non-duplicate) orders
  const analytics = useMemo(() => {
    const total = activeOrders.length;
    const revenue = activeOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const pending = activeOrders.filter(o => o.status === 'pending').length;
    const shipped = activeOrders.filter(o => o.status === 'shipped' || o.status === 'delivered').length;
    const avgOrderValue = total > 0 ? revenue / total : 0;
    const duplicateCount = duplicateOrders.length;
    const duplicateRevenue = duplicateOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    
    return { total, revenue, pending, shipped, avgOrderValue, duplicateCount, duplicateRevenue };
  }, [activeOrders, duplicateOrders]);

  // Get product details
  const getProductDetails = (productId) => {
    return products.find(p => p.id === productId);
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Order Management</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            {analytics.total} active orders · ${analytics.revenue.toFixed(2)} revenue · {analytics.pending} pending
            {analytics.duplicateCount > 0 && (
              <span className="ml-2 text-orange-400/70">· {analytics.duplicateCount} duplicate void excluded</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Orders', value: analytics.total, icon: Package, color: 'text-blue-500' },
          { label: 'Revenue', value: `$${analytics.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-primary' },
          { label: 'Pending', value: analytics.pending, icon: Clock, color: 'text-yellow-500' },
          { label: 'Shipped', value: analytics.shipped, icon: Truck, color: 'text-green-500' },
          { label: 'Avg Order', value: `$${analytics.avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: 'text-green-500' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border/40 rounded-xl p-4"
            >
              <Icon className={`w-4 h-4 ${stat.color} mb-2`} />
              <p className="font-display text-2xl text-foreground">{stat.value}</p>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by name, email, or order ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-secondary/50"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active Orders</SelectItem>
            <SelectItem value="all">All Active Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="duplicates">⚠ Duplicates / Voids</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Date Range" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Duplicate warning banner */}
      {analytics.duplicateCount > 0 && statusFilter !== 'duplicates' && (
        <div className="border border-orange-500/40 bg-orange-500/10 rounded-xl p-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
          <p className="text-sm text-orange-300">
            {analytics.duplicateCount} duplicate void order{analytics.duplicateCount > 1 ? 's' : ''} excluded from totals (${analytics.duplicateRevenue.toFixed(2)} AUD). 
            <button className="underline ml-1" onClick={() => setStatusFilter('duplicates')}>View duplicates</button>
          </p>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.map((order, i) => {
          const isVoid = isDuplicate(order);
          const StatusIcon = isVoid ? AlertTriangle : (STATUS_ICONS[order.status] || Package);
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`bg-card border rounded-xl p-4 hover:border-primary/20 transition-colors cursor-pointer ${isVoid ? 'border-orange-500/30 opacity-70' : 'border-border/40'}`}
              onClick={() => setSelected(order)}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${STATUS_COLORS[order.status].split(' ')[0]}`}>
                    <StatusIcon className={`w-5 h-5 ${STATUS_COLORS[order.status].split(' ')[1]}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-body text-sm font-medium text-foreground">{order.customer_name}</p>
                      <Badge variant="outline" className="text-[10px]">#{order.id.slice(-6)}</Badge>
                    </div>
                    <p className="font-body text-xs text-muted-foreground">{order.customer_email}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
                        <Package className="w-3 h-3" /> {order.items?.length || 0} items
                      </p>
                      <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {order.created_date ? format(new Date(order.created_date), 'MMM d') : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                {isDuplicate(order) && (
                  <Badge className="text-[10px] tracking-widest uppercase bg-orange-500/20 text-orange-400">DUPLICATE VOID</Badge>
                )}
                <Badge className={`text-[10px] tracking-widest uppercase ${STATUS_COLORS[order.status] || 'bg-secondary text-muted-foreground'}`}>
                  {order.status}
                </Badge>
                  <p className="font-display text-xl text-primary">${order.total_amount?.toFixed(2)}</p>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Eye className="w-3 h-3" /> View
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-24 bg-card border border-border/40 rounded-2xl">
            <Package className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">No orders found with current filters.</p>
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-card border-border/40 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="font-display text-2xl">Order Details</DialogTitle>
              <Badge className={`text-[10px] tracking-widest uppercase ${STATUS_COLORS[selected?.status || 'pending']}`}>
                {selected?.status}
              </Badge>
            </div>
            <DialogDescription>
              Order #{selected?.id?.slice(-6)} · {selected?.created_date ? format(new Date(selected.created_date), 'PPP p') : ''}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-6 mt-4">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-primary" />
                    <p className="font-display text-sm text-primary">Customer Details</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Name</p>
                      <p className="font-medium">{selected.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Email</p>
                      <p className="font-medium">{selected.customer_email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <p className="font-display text-sm text-primary">Shipping Address</p>
                  </div>
                  <p className="text-sm">{selected.shipping_address}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  <p className="font-display text-sm text-primary">Order Items</p>
                </div>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => {
                    const product = getProductDetails(item.product_id);
                    return (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-border/30 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-secondary/50 overflow-hidden">
                            {product?.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-muted-foreground/20" />
                              </div>
                            )}
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
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <p className="font-display text-lg text-primary">Total: ${selected.total_amount?.toFixed(2)} AUD</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => sendReceiptEmail(selected)} className="gap-2">
                      <Mail className="w-3 h-3" /> Send Receipt
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Printer className="w-3 h-3" /> Print
                    </Button>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <Label className="font-body text-xs tracking-wider uppercase mb-2 block">Order Status</Label>
                <Select
                  value={selected.status}
                  onValueChange={v => {
                    updateMutation.mutate({ id: selected.id, data: { status: v } });
                    setSelected({ ...selected, status: v });
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tracking */}
              <div>
                <Label className="font-body text-xs tracking-wider uppercase mb-2 block">Tracking Number</Label>
                <div className="flex gap-2">
                  <Input
                    value={selected.tracking_number || ''}
                    onChange={e => setSelected({ ...selected, tracking_number: e.target.value })}
                    onBlur={() => updateMutation.mutate({ id: selected.id, data: { tracking_number: selected.tracking_number } })}
                    placeholder="Enter tracking number"
                    className="flex-1"
                  />
                  <Button
                    onClick={sendTrackingEmail}
                    disabled={!selected.tracking_number || sendingEmail}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {sendingEmail ? 'Sending…' : 'Email'}
                  </Button>
                </div>
                {selected.tracking_number && (
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    Tracking: <span className="font-mono">{selected.tracking_number}</span>
                  </p>
                )}
              </div>

              {/* Notes */}
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
                      <Button size="sm" onClick={() => {
                        updateMutation.mutate({ id: selected.id, data: { notes: notesText } });
                        setSelected({ ...selected, notes: notesText });
                        setEditingNotes(false);
                      }}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingNotes(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-secondary/30 rounded-lg p-3 min-h-[60px]">
                    <p className="text-sm">{selected.notes || 'No notes'}</p>
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