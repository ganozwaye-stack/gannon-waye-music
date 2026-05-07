import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Package, Percent } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GST_RATE = 0.1; // 10% GST in Australia
const DISCOUNT_RATE = 0.2; // 20% discount until Jun 30

function MetricCard({ icon: Icon, label, value, subtext, color = 'primary' }) {
  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <Icon className={`w-4 h-4 text-${color} mb-2`} />
      <p className={`font-display text-2xl text-foreground`}>{value}</p>
      <p className="font-body text-xs text-muted-foreground tracking-wider uppercase mt-1">{label}</p>
      {subtext && <p className="font-body text-xs text-muted-foreground/60 mt-2">{subtext}</p>}
    </div>
  );
}

export default function FinancialDashboard() {
  const [scenarioMode, setScenarioMode] = useState('actual'); // 'actual' or 'projected'

  const { data: products } = useQuery({
    queryKey: ['merchProducts'],
    queryFn: () => base44.entities.MerchProduct.list(),
    initialData: [],
  });

  const { data: orders } = useQuery({
    queryKey: ['allOrders'],
    queryFn: () => base44.entities.MerchOrder.list(),
    initialData: [],
  });

  const { data: contributions } = useQuery({
    queryKey: ['supportContributions'],
    queryFn: () => base44.entities.SupportContribution.list(),
    initialData: [],
  });

  // Calculate metrics
  const metrics = useMemo(() => {
    // Merch revenue & costs
    let merchRevenue = 0;
    let merchUnits = 0;
    const productCosts = {};

    for (const order of orders) {
      for (const item of (order.items || [])) {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          const itemPrice = item.price || product.price;
          const itemCost = product.cost_price || (product.price * 0.4); // Assume 40% cost if not specified
          
          merchRevenue += itemPrice * (item.quantity || 1);
          productCosts[item.product_id] = (productCosts[item.product_id] || 0) + itemCost * (item.quantity || 1);
          merchUnits += (item.quantity || 1);
        }
      }
    }

    const totalMerchCost = Object.values(productCosts).reduce((a, b) => a + b, 0);
    const merchGross = merchRevenue - totalMerchCost;
    const merchMarginPercent = merchRevenue > 0 ? Math.round((merchGross / merchRevenue) * 100) : 0;

    // GST on merch (collected)
    const merchGST = merchRevenue * GST_RATE;

    // Support/donations revenue (not GST-exempt if goods/services)
    let supportRevenue = contributions.reduce((sum, c) => sum + (c.total_charged || 0), 0);
    const supportGST = supportRevenue * GST_RATE;

    // Combined totals
    const totalGross = merchRevenue + supportRevenue;
    const totalCost = totalMerchCost;
    const totalGST = merchGST + supportGST;
    const netProfit = (merchRevenue + supportRevenue) - totalMerchCost - totalGST;

    // Discount impact simulation (20% off)
    const discountedMerchRevenue = merchRevenue * (1 - DISCOUNT_RATE);
    const discountedGross = discountedMerchRevenue - totalMerchCost;
    const discountedGST = discountedMerchRevenue * GST_RATE;
    const discountedProfit = discountedMerchRevenue - totalMerchCost - discountedGST;
    const discountImpact = netProfit - discountedProfit;

    return {
      // Actual
      merchRevenue,
      merchUnits,
      totalMerchCost,
      merchGross,
      merchMarginPercent,
      merchGST,
      supportRevenue,
      supportGST,
      totalGross,
      totalCost,
      totalGST,
      netProfit,
      // Discount scenario
      discountedMerchRevenue,
      discountedGross,
      discountedGST,
      discountedProfit,
      discountImpact,
    };
  }, [orders, products, contributions]);

  // Breakdown by product
  const productMetrics = useMemo(() => {
    const breakdown = {};
    
    for (const order of orders) {
      for (const item of (order.items || [])) {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          const itemPrice = item.price || product.price;
          const itemCost = product.cost_price || (product.price * 0.4);
          
          if (!breakdown[item.product_id]) {
            breakdown[item.product_id] = {
              name: product.name,
              units: 0,
              revenue: 0,
              cost: 0,
            };
          }
          breakdown[item.product_id].units += (item.quantity || 1);
          breakdown[item.product_id].revenue += itemPrice * (item.quantity || 1);
          breakdown[item.product_id].cost += itemCost * (item.quantity || 1);
        }
      }
    }

    return Object.entries(breakdown).map(([id, data]) => ({
      id,
      ...data,
      gross: data.revenue - data.cost,
      margin: data.revenue > 0 ? Math.round((data.gross / data.revenue) * 100) : 0,
    }));
  }, [orders, products]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-foreground mb-2">Financial Dashboard</h1>
        <p className="font-body text-sm text-muted-foreground">
          Revenue, costs, margins, GST, and discount impact analysis
        </p>
      </div>

      {/* Summary cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard icon={DollarSign} label="Merch Revenue" value={`$${metrics.merchRevenue.toFixed(2)}`} subtext={`${metrics.merchUnits} units`} />
        <MetricCard icon={TrendingDown} label="Cost of Goods" value={`$${metrics.totalMerchCost.toFixed(2)}`} subtext="Production + sourcing" color="destructive" />
        <MetricCard icon={TrendingUp} label="Gross Profit" value={`$${metrics.merchGross.toFixed(2)}`} subtext={`${metrics.merchMarginPercent}% margin`} />
        <MetricCard icon={DollarSign} label="GST Collected" value={`$${metrics.totalGST.toFixed(2)}`} subtext="To remit to ATO" />
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="actual" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="actual">Actual Performance</TabsTrigger>
          <TabsTrigger value="discount">Discount Impact</TabsTrigger>
          <TabsTrigger value="breakdown">Product Breakdown</TabsTrigger>
        </TabsList>

        {/* Actual Performance */}
        <TabsContent value="actual" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income statement */}
            <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-4">
              <h3 className="font-display text-lg text-foreground">Income Statement</h3>
              <div className="space-y-3 border-b border-border/30 pb-4">
                <div className="flex justify-between">
                  <p className="font-body text-sm">Merch Sales</p>
                  <p className="font-display text-sm text-foreground">${metrics.merchRevenue.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-body text-sm">Support Contributions</p>
                  <p className="font-display text-sm text-foreground">${metrics.supportRevenue.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex justify-between font-semibold">
                <p className="font-body text-sm">Total Revenue</p>
                <p className="font-display text-lg text-primary">${metrics.totalGross.toFixed(2)}</p>
              </div>
            </div>

            {/* Expenses */}
            <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-4">
              <h3 className="font-display text-lg text-foreground">Operating Expenses</h3>
              <div className="space-y-3 border-b border-border/30 pb-4">
                <div className="flex justify-between">
                  <p className="font-body text-sm">Cost of Goods Sold</p>
                  <p className="font-display text-sm text-destructive">${metrics.totalMerchCost.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-body text-sm">GST to Remit (ATO)</p>
                  <p className="font-display text-sm text-destructive">${metrics.totalGST.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex justify-between font-semibold">
                <p className="font-body text-sm">Total Expenses</p>
                <p className="font-display text-lg text-destructive">${(metrics.totalMerchCost + metrics.totalGST).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Net profit */}
          <div className="bg-green-900/20 border border-green-600/30 rounded-2xl p-6">
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">Net Profit</p>
            <p className="font-display text-4xl text-green-400">${metrics.netProfit.toFixed(2)}</p>
            <p className="font-body text-sm text-muted-foreground mt-2">
              After all costs, GST, and expenses. This is what you keep.
            </p>
          </div>
        </TabsContent>

        {/* Discount Impact */}
        <TabsContent value="discount" className="space-y-6">
          <div className="bg-amber-900/20 border border-amber-600/30 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-body text-sm font-semibold text-amber-100">20% Discount Scenario (until Jun 30)</p>
                <p className="font-body text-xs text-amber-200/70 mt-1">If all sales occur at 20% discount</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* With discount */}
            <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-4">
              <h3 className="font-display text-lg text-foreground">With 20% Discount</h3>
              <div className="space-y-3 border-b border-border/30 pb-4">
                <div className="flex justify-between">
                  <p className="font-body text-sm">Revenue (20% off)</p>
                  <p className="font-display text-sm text-foreground">${metrics.discountedMerchRevenue.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-body text-sm">COGS (unchanged)</p>
                  <p className="font-display text-sm text-destructive">${metrics.totalMerchCost.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-body text-sm">GST (on lower revenue)</p>
                  <p className="font-display text-sm text-destructive">${metrics.discountedGST.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex justify-between font-semibold">
                <p className="font-body text-sm">Net Profit</p>
                <p className="font-display text-lg text-foreground">${metrics.discountedProfit.toFixed(2)}</p>
              </div>
            </div>

            {/* Impact */}
            <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 space-y-4">
              <h3 className="font-display text-lg text-foreground">Financial Impact</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Revenue Lost</p>
                  <p className="font-display text-2xl text-destructive">${(metrics.merchRevenue - metrics.discountedMerchRevenue).toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Profit Reduction</p>
                  <p className="font-display text-2xl text-destructive">${metrics.discountImpact.toFixed(2)}</p>
                </div>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-4 italic">
                You lose ${metrics.discountImpact.toFixed(2)} in net profit if all sales are at 20% discount.
              </p>
            </div>
          </div>

          {/* Breakeven analysis */}
          <div className="bg-card border border-border/40 rounded-2xl p-6">
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-4">Discount Strategy Notes</p>
            <ul className="space-y-2 font-body text-sm text-foreground/70">
              <li>✓ 20% discount is legal in Australia if prices are honest and GST calculated correctly</li>
              <li>✓ GST must be calculated on the final discounted price, not the original</li>
              <li>✓ Don't inflate prices before discount (illegal misleading conduct)</li>
              <li>✓ Consider limiting discount to specific products (e.g., hoodie only) to reduce impact</li>
              <li>✓ Expiry date (Jun 30) creates urgency and protects long-term margins</li>
            </ul>
          </div>
        </TabsContent>

        {/* Product Breakdown */}
        <TabsContent value="breakdown" className="space-y-4">
          {productMetrics.length > 0 ? (
            productMetrics.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border/40 rounded-2xl p-5"
              >
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Product</p>
                    <p className="font-display text-base text-foreground">{p.name}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Units</p>
                    <p className="font-display text-base text-foreground">{p.units}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Revenue</p>
                    <p className="font-display text-base text-foreground">${p.revenue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Cost</p>
                    <p className="font-display text-base text-destructive">${p.cost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Margin</p>
                    <p className={`font-display text-base ${p.margin >= 50 ? 'text-green-400' : p.margin >= 25 ? 'text-primary' : 'text-destructive'}`}>
                      {p.margin}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="font-body text-muted-foreground">No sales data yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}