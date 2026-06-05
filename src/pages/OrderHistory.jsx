import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-primary/20 text-primary',
  shipped: 'bg-blue-500/20 text-blue-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-destructive/20 text-destructive',
};

export default function OrderHistory() {
  const [email, setEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [expanded, setExpanded] = useState(null);

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['myOrders', searchEmail],
    queryFn: () => searchEmail
      ? base44.entities.MerchOrder.filter({ customer_email: searchEmail }, '-created_date')
      : Promise.resolve([]),
    initialData: [],
    enabled: !!searchEmail,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (email.trim()) setSearchEmail(email.trim().toLowerCase());
  };

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Your Orders</p>
          <h1 className="font-display text-4xl text-foreground mb-4">Order History</h1>
          <p className="font-body text-sm text-muted-foreground">Enter your email address to view your orders.</p>
        </motion.div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-secondary/50 border-border/40 flex-1"
          />
          <Button type="submit" className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase px-6">
            <Search className="w-4 h-4 mr-2" /> Look Up
          </Button>
        </form>

        {isLoading && (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        )}

        {searchEmail && !isLoading && orders.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">No orders found for {searchEmail}</p>
            <p className="font-body text-xs text-muted-foreground/60 mt-2">Double-check the email you used when ordering.</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border/40 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">
                      {order.items?.map(i => i.product_name).join(', ')}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {order.created_date ? format(new Date(order.created_date), 'MMM d, yyyy') : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`text-[10px] tracking-widest uppercase ${STATUS_COLORS[order.status] || ''}`}>
                    {order.status}
                  </Badge>
                  <span className="font-display text-lg text-primary">${order.total_amount?.toFixed(2)}</span>
                  {expanded === order.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              {expanded === order.id && (
                <div className="px-5 pb-5 border-t border-border/30 pt-4 space-y-3">
                  <div>
                    <p className="font-body text-xs text-muted-foreground mb-2">Items</p>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1.5 border-b border-border/20 last:border-0">
                        <span className="font-body text-sm text-foreground">
                          {item.product_name}{item.size ? ` (${item.size})` : ''} × {item.quantity || 1}
                        </span>
                        <span className="font-body text-sm text-primary">${item.price?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Shipping to</span>
                    <span className="text-foreground text-right max-w-[60%]">{order.shipping_address}</span>
                  </div>
                  {order.tracking_number && (
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                      <p className="font-body text-xs text-muted-foreground mb-1">Tracking Number</p>
                      <p className="font-body text-sm font-bold gradient-gold-glow">{order.tracking_number}</p>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold font-body text-sm border-t border-border/30 pt-2">
                    <span className="text-foreground">Total</span>
                    <span className="gradient-gold-glow">${order.total_amount?.toFixed(2)} AUD</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}