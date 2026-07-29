import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, TrendingUp, DollarSign } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/40 rounded-2xl p-6 flex items-start gap-4"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">{label}</p>
        <p className="font-display text-3xl text-foreground">{value}</p>
        {sub && <p className="font-body text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

const CustomTooltip = (props = {}) => {
  const { active, payload, label } = /** @type {any} */ (props);
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/40 rounded-xl px-4 py-3 shadow-xl">
      <p className="font-body text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-display text-lg gradient-gold-glow">${payload[0].value.toFixed(2)}</p>
      <p className="font-body text-xs text-muted-foreground">{payload[1]?.value} orders</p>
    </div>
  );
};

export default function Summary() {
  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date'),
    initialData: [],
  });

  const { data: subscribers } = useQuery({
    queryKey: ['emailSubscribers'],
    queryFn: () => base44.entities.EmailSubscriber.list(),
    initialData: [],
  });

  // Build last 6 months of sales data
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const monthOrders = orders.filter(o =>
      isWithinInterval(new Date(o.created_date), { start, end })
    );
    return {
      month: format(date, 'MMM'),
      revenue: monthOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
      orders: monthOrders.length,
    };
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen py-24 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Overview</p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground">Summary</h1>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={DollarSign} label="Total Revenue" value={`$${totalRevenue.toFixed(0)}`} sub="All time" />
          <StatCard icon={ShoppingBag} label="Total Orders" value={orders.length} sub={`${pendingOrders} pending`} />
          <StatCard icon={Users} label="Email Subscribers" value={subscribers.length} sub="All time sign-ups" />
          <StatCard icon={TrendingUp} label="This Month" value={`$${months[5].revenue.toFixed(0)}`} sub={`${months[5].orders} orders`} />
        </div>

        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border/40 rounded-2xl p-6 md:p-8"
        >
          <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow mb-1">Store Sales</p>
          <h2 className="font-display text-2xl text-foreground mb-8">Revenue — Last 6 Months</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={months} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontFamily: 'var(--font-body)', fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'var(--font-body)', fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revenueGrad)" />
              <Area type="monotone" dataKey="orders" stroke="transparent" fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
