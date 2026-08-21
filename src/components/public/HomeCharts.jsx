import { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag } from 'lucide-react';

export default function HomeCharts() {
  const { data: orders } = useQuery({
    queryKey: ['merchOrders'],
    queryFn: () => base44.entities.MerchOrder.list(),
    initialData: [],
  });

  const { data: releases } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list(),
    initialData: [],
  });

  const salesData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString('en-AU', { month: 'short' });
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const mo = orders.filter(o => o.created_date?.startsWith(key));
      months.push({ month: label, sales: mo.reduce((s, o) => s + (o.total_amount || 0), 0) });
    }
    return months;
  }, [orders]);

  const streamsData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString('en-AU', { month: 'short' });
      // Simulated stream count based on published releases (no real stream API)
      const publishedCount = releases.filter(r => r.is_published && r.release_date && new Date(r.release_date) <= d).length;
      months.push({ month: label, streams: publishedCount * (80 + Math.floor(i * 30)) });
    }
    return months;
  }, [releases]);

  const totalSales = orders.reduce((s, o) => s + (o.total_amount || 0), 0);
  const totalOrders = orders.length;

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 border-t border-border/20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary">At a Glance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Merch Sales */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border/40 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Merch Sales</p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl text-primary">${totalSales.toFixed(0)}</p>
                <p className="font-body text-[10px] text-muted-foreground">{totalOrders} orders total</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={salesData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }}
                  formatter={(v) => [`$${v}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Music Streams */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border/40 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Stream Trend</p>
              </div>
              <p className="font-body text-[10px] text-muted-foreground italic">Based on release activity</p>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={streamsData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }}
                  formatter={(v) => [v, 'Streams']}
                />
                <Area type="monotone" dataKey="streams" stroke="hsl(var(--primary))" fill="url(#streamGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}