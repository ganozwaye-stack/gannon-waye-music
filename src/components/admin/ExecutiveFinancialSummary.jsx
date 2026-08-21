import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Package, Percent, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const GOLD = '#D4AF37';
const TEAL = '#5B9EA6';

function formatCurrency(val) {
  return `$${(val || 0).toFixed(0)}`;
}

function formatTrendDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

export default function ExecutiveFinancialSummary({ orders, products, contributions, metrics, productMetrics }) {
  // Daily revenue trend (last 30 days)
  const revenueTrend = useMemo(() => {
    const now = new Date();
    const dailyMap = {};

    for (const order of orders) {
      const orderDate = new Date(order.created_date);
      const dateKey = orderDate.toISOString().split('T')[0];
      let dayRevenue = 0;
      for (const item of (order.items || [])) {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          const itemPrice = item.price || product.sale_price || product.price || 0;
          dayRevenue += itemPrice * (item.quantity || 1);
        }
      }
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + dayRevenue;
    }

    // Fill in all 30 days (including zero-revenue days) for a continuous chart
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().split('T')[0];
      result.push({
        date: dateKey,
        label: formatTrendDate(dateKey),
        revenue: dailyMap[dateKey] || 0,
      });
    }
    return result;
  }, [orders, products]);

  // Period comparison: last 7 days vs previous 7 days
  const trendData = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    let recentRevenue = 0;
    let previousRevenue = 0;

    for (const order of orders) {
      const orderDate = new Date(order.created_date);
      let orderRev = 0;
      for (const item of (order.items || [])) {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          const itemPrice = item.price || product.sale_price || product.price || 0;
          orderRev += itemPrice * (item.quantity || 1);
        }
      }
      if (orderDate >= sevenDaysAgo) recentRevenue += orderRev;
      else if (orderDate >= fourteenDaysAgo) previousRevenue += orderRev;
    }

    const change = previousRevenue > 0
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
      : (recentRevenue > 0 ? 100 : 0);
    return { recentRevenue, previousRevenue, change };
  }, [orders, products]);

  // Top 5 products by revenue
  const topProducts = useMemo(() => {
    return [...productMetrics]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(p => ({
        name: p.name?.length > 22 ? p.name.slice(0, 22) + '…' : p.name || 'Unknown',
        revenue: Math.round(p.revenue),
        units: p.units,
      }));
  }, [productMetrics]);

  // Revenue composition (merch vs support)
  const composition = useMemo(() => {
    const data = [];
    if (metrics.merchRevenue > 0) data.push({ name: 'Merch Sales', value: Math.round(metrics.merchRevenue), color: GOLD });
    if (metrics.supportRevenue > 0) data.push({ name: 'Support', value: Math.round(metrics.supportRevenue), color: TEAL });
    return data;
  }, [metrics]);

  const hasData = orders.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-card to-secondary/20 border border-primary/20 rounded-2xl p-6 space-y-6"
    >
      {/* Header with trend badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <p className="font-body text-xs tracking-widest uppercase text-primary">Executive Performance Summary</p>
        </div>
        {hasData && (
          <div className="flex items-center gap-2">
            {trendData.change > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" /> +{trendData.change.toFixed(0)}% vs last week
              </span>
            ) : trendData.change < 0 ? (
              <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded-full">
                <ArrowDownRight className="w-3 h-3" /> {trendData.change.toFixed(0)}% vs last week
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                <Minus className="w-3 h-3" /> No change vs last week
              </span>
            )}
          </div>
        )}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={DollarSign} label="Total Revenue" value={formatCurrency(metrics.totalGross)} subtext="All sources" />
        <KpiCard icon={DollarSign} label="Net Profit" value={formatCurrency(metrics.netProfit)} subtext="After costs & GST" positive={metrics.netProfit >= 0} />
        <KpiCard icon={Percent} label="Gross Margin" value={`${metrics.merchMarginPercent}%`} subtext="Merch profitability" />
        <KpiCard icon={Package} label="Units Sold" value={String(metrics.merchUnits)} subtext={`${productMetrics.length} products`} />
      </div>

      {hasData ? (
        <>
          {/* Charts row: trend (2 cols) + composition donut (1 col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-background/40 rounded-xl p-4 border border-border/20">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-4">Revenue Trend (30 Days)</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GOLD} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} interval={4} />
                  <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={formatCurrency} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(220 12% 9%)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(v) => [formatCurrency(v), 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2} fill="url(#revGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-background/40 rounded-xl p-4 border border-border/20">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-4">Revenue Mix</p>
              {composition.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={composition} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                        {composition.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: 'hsl(220 12% 9%)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', fontSize: '12px' }}
                        formatter={(v) => formatCurrency(v)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {composition.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                        <span className="text-xs text-muted-foreground">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">No revenue yet</div>
              )}
            </div>
          </div>

          {/* Top Products horizontal bar chart */}
          {topProducts.length > 0 && (
            <div className="bg-background/40 rounded-xl p-4 border border-border/20">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-4">Top Products by Revenue</p>
              <ResponsiveContainer width="100%" height={Math.max(140, topProducts.length * 40)}>
                <BarChart data={topProducts} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} width={130} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={formatCurrency} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(220 12% 9%)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(v) => [formatCurrency(v), 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill={GOLD} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="font-body text-sm text-muted-foreground">No sales data yet. Your performance story begins with your first order.</p>
        </div>
      )}
    </motion.div>
  );
}

function KpiCard({ icon: Icon, label, value, subtext, positive }) {
  const valueColor = positive === true ? 'text-green-400' : positive === false ? 'text-red-400' : 'text-foreground';
  return (
    <div className="bg-background/40 rounded-xl p-4 border border-border/20">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-primary" />
        <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      </div>
      <p className={`font-display text-xl ${valueColor}`}>{value}</p>
      {subtext && <p className="font-body text-xs text-muted-foreground/60 mt-1">{subtext}</p>}
    </div>
  );
}