import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Package, Send } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_COLORS = {
  pending: 'bg-chart-4/20 text-chart-4',
  confirmed: 'bg-primary/20 text-primary',
  shipped: 'bg-chart-2/20 text-chart-2',
  delivered: 'bg-chart-2/30 text-chart-2',
  cancelled: 'bg-destructive/20 text-destructive',
};

export default function Orders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sendingEmail, setSendingEmail] = useState(false);

  const sendTrackingEmail = async () => {
    if (!selected?.customer_email || !selected?.tracking_number) return;
    setSendingEmail(true);
    await base44.integrations.Core.SendEmail({
      to: selected.customer_email,
      subject: `Your order has shipped! Tracking: ${selected.tracking_number}`,
      body: `Hi ${selected.customer_name},\n\nGreat news — your Gannon Waye merch is on its way!\n\nTracking number: ${selected.tracking_number}\n\nYou can use this number to track your package with the carrier.\n\nThank you for your support!\n\nGannon Waye`,
    });
    setSendingEmail(false);
    toast({ title: 'Tracking email sent!', description: `Email sent to ${selected.customer_email}` });
  };

  const { data: orders } = useQuery({
    queryKey: ['merchOrders'], queryFn: () => base44.entities.MerchOrder.list('-created_date'), initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MerchOrder.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchOrders'] });
      toast({ title: 'Order updated' });
    },
  });

  const filtered = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="font-display text-3xl text-foreground">Orders</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map(order => (
          <Card key={order.id} className="bg-card border-border/40 cursor-pointer hover:border-primary/20 transition-colors" onClick={() => setSelected(order)}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{order.customer_name}</p>
                  <p className="font-body text-xs text-muted-foreground">{order.customer_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={`text-[10px] tracking-widest uppercase ${STATUS_COLORS[order.status] || 'bg-secondary text-muted-foreground'}`}>
                  {order.status}
                </Badge>
                <p className="font-display text-lg text-primary">${order.total_amount?.toFixed(2)}</p>
                <p className="font-body text-xs text-muted-foreground hidden sm:block">
                  {order.created_date ? format(new Date(order.created_date), 'MMM d, yyyy') : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-12 font-body text-muted-foreground">No orders found.</p>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-card border-border/40 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Order Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-body text-xs text-muted-foreground">Customer</p>
                  <p className="font-body text-sm text-foreground">{selected.customer_name}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">Email</p>
                  <p className="font-body text-sm text-foreground">{selected.customer_email}</p>
                </div>
              </div>
              <div>
                <p className="font-body text-xs text-muted-foreground">Shipping Address</p>
                <p className="font-body text-sm text-foreground">{selected.shipping_address}</p>
              </div>
              <div>
                <p className="font-body text-xs text-muted-foreground mb-2">Items</p>
                {selected.items?.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-border/30 last:border-0">
                    <div>
                      <p className="font-body text-sm text-foreground">{item.product_name}</p>
                      {item.size && <p className="font-body text-xs text-muted-foreground">Size: {item.size}</p>}
                    </div>
                    <p className="font-body text-sm text-foreground">x{item.quantity} — ${item.price?.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <p className="font-display text-xl text-primary text-right">Total: ${selected.total_amount?.toFixed(2)}</p>

              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Status</Label>
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
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Tracking Number</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={selected.tracking_number || ''}
                    onChange={e => setSelected({ ...selected, tracking_number: e.target.value })}
                    onBlur={() => updateMutation.mutate({ id: selected.id, data: { tracking_number: selected.tracking_number } })}
                    placeholder="Enter tracking number"
                  />
                  <Button
                    onClick={sendTrackingEmail}
                    disabled={!selected.tracking_number || sendingEmail}
                    className="gap-2 shrink-0"
                    title="Send tracking email to customer"
                  >
                    <Send className="w-4 h-4" />
                    {sendingEmail ? 'Sending…' : 'Email'}
                  </Button>
                </div>
                <p className="font-body text-[10px] text-muted-foreground mt-1">Sends tracking number to {selected.customer_email}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}