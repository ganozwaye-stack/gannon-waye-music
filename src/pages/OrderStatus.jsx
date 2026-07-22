import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const STATUS_CONFIG = {
  pending:   { icon: Clock,         color: 'text-primary', bg: 'bg-primary/10 border-primary/30', label: 'Pending',   desc: 'Your order has been received and is being reviewed.' },
  confirmed: { icon: Package,       color: 'text-blue-400',   bg: 'bg-blue-400/10 border-blue-400/30',     label: 'Confirmed', desc: 'Your order is confirmed and being prepared.' },
  shipped:   { icon: Truck,         color: 'text-primary',    bg: 'bg-primary/10 border-primary/30',        label: 'Shipped',   desc: 'Your order is on its way!' },
  delivered: { icon: CheckCircle2,  color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/30',   label: 'Delivered', desc: 'Your order has been delivered. Enjoy!' },
  cancelled: { icon: XCircle,       color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/30', label: 'Cancelled', desc: 'This order has been cancelled. Contact us for help.' },
};

export default function OrderStatus() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim() && !email.trim()) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);

    try {
      // Search by email (most reliable) or order id
      let orders = [];
      if (email.trim()) {
        orders = await base44.entities.MerchOrder.filter({ customer_email: email.trim().toLowerCase() }, '-created_date', 5);
      }
      if (orders.length === 0 && orderNumber.trim()) {
        // Try matching by ID prefix
        const all = await base44.entities.MerchOrder.list('-created_date', 50);
        orders = all.filter(o => o.id?.startsWith(orderNumber.trim()) || o.id === orderNumber.trim());
      }

      if (orders.length === 0) {
        setNotFound(true);
      } else {
        setResult(orders[0]);
      }
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  };

  const cfg = result ? (STATUS_CONFIG[result.status] || STATUS_CONFIG.pending) : null;

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Track</p>
          <h1 className="font-display text-4xl text-foreground">Order Status</h1>
          <p className="font-body text-sm text-muted-foreground mt-3">Enter your email or order number to check your order.</p>
        </motion.div>

        <form onSubmit={handleSearch} className="bg-card border border-border/40 rounded-2xl p-6 space-y-4">
          <div>
            <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Email address</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-secondary/50 border-border/40"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/40" />
            <span className="font-body text-xs text-muted-foreground/50">or</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>
          <div>
            <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Order number</label>
            <Input
              placeholder="Order ID from confirmation email"
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              className="bg-secondary/50 border-border/40"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || (!email.trim() && !orderNumber.trim())}
            className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Searching...' : 'Check Status'}
          </Button>
        </form>

        {notFound && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 bg-card border border-border/40 rounded-2xl p-6 text-center">
            <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-body text-sm text-foreground/60">No order found. Double-check your email or order number, or contact us at <a href="mailto:hello@gannonwaye.com" className="text-primary hover:underline">hello@gannonwaye.com</a></p>
          </motion.div>
        )}

        {result && cfg && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
            {/* Status card */}
            <div className={`rounded-2xl border p-6 ${cfg.bg}`}>
              <div className="flex items-center gap-3 mb-3">
                <cfg.icon className={`w-6 h-6 ${cfg.color}`} />
                <div>
                  <p className={`font-display text-xl ${cfg.color}`}>{cfg.label}</p>
                  <p className="font-body text-xs text-foreground/60">{cfg.desc}</p>
                </div>
              </div>
              {result.tracking_number && (
                <p className="font-body text-xs text-foreground/60 mt-2">
                  Tracking: <span className="text-foreground font-medium">{result.tracking_number}</span>
                </p>
              )}
            </div>

            {/* Order details */}
            <div className="bg-card border border-border/40 rounded-2xl p-6">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-4">Order Details</p>
              <p className="font-body text-sm text-foreground mb-1"><span className="text-muted-foreground">Name:</span> {result.customer_name}</p>
              {result.items?.length > 0 && (
                <div className="mt-3 space-y-2">
                  {result.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm font-body">
                      <span className="text-foreground/70">{item.product_name} {item.size ? `(${item.size})` : ''} × {item.quantity}</span>
                      <span className="text-foreground">${item.price}</span>
                    </div>
                  ))}
                  <div className="border-t border-border/40 pt-2 flex justify-between font-body text-sm font-semibold">
                    <span>Total</span>
                    <span className="gradient-gold-glow">${result.total_amount?.toFixed(2)} AUD</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}