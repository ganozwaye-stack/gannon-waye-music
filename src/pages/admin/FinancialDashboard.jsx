import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Package, Percent, Plus, Edit2, ArrowRight, ShoppingCart, CreditCard, Calculator } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const GST_RATE = 0.1;

function MetricCard({ icon: Icon, label, value, subtext, color = 'primary', onClick, linkTo }) {
  const CardComponent = linkTo ? Link : 'div';
  const props = linkTo ? { to: linkTo, className: 'cursor-pointer hover:border-primary/40 transition-colors' } : { onClick, className: onClick ? 'cursor-pointer hover:border-primary/40 transition-colors' : '' };
  
  return (
    <CardComponent {...props}>
      <div className="bg-card border border-border/40 rounded-2xl p-5 relative group">
        <Icon className={`w-4 h-4 text-${color} mb-2`} />
        <p className={`font-display text-2xl text-foreground`}>{value}</p>
        <p className="font-body text-xs text-muted-foreground tracking-wider uppercase mt-1">{label}</p>
        {subtext && <p className="font-body text-xs text-muted-foreground/60 mt-2">{subtext}</p>}
        {(onClick || linkTo) && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
    </CardComponent>
  );
}

export default function FinancialDashboard() {
  const [scenarioMode, setScenarioMode] = useState('actual');

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

  const productsMissingCosts = products.filter(p => !p.cost_price || !p.delivery_cost);

  const metrics = useMemo(() => {
    let merchRevenue = 0;
    let merchUnits = 0;
    const productCosts = {};

    for (const order of orders) {
      for (const item of (order.items || [])) {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          const itemPrice = item.price || product.sale_price || product.price;
          const itemCost = product.cost_price || (product.sale_price || product.price || 0) * 0.4;
          
          merchRevenue += itemPrice * (item.quantity || 1);
          productCosts[item.product_id] = (productCosts[item.product_id] || 0) + itemCost * (item.quantity || 1);
          merchUnits += (item.quantity || 1);
        }
      }
    }

    const totalMerchCost = Object.values(productCosts).reduce((a, b) => a + b, 0);
    const merchGross = merchRevenue - totalMerchCost;
    const merchMarginPercent = merchRevenue > 0 ? Math.round((merchGross / merchRevenue) * 100) : 0;
    const merchGST = merchRevenue * GST_RATE;

    let supportRevenue = contributions.reduce((sum, c) => sum + (c.total_charged || 0), 0);
    const supportGST = supportRevenue * GST_RATE;

    const totalGross = merchRevenue + supportRevenue;
    const totalCost = totalMerchCost;
    const totalGST = merchGST + supportGST;
    const netProfit = (merchRevenue + supportRevenue) - totalMerchCost - totalGST;

    return {
      merchRevenue, merchUnits, totalMerchCost, merchGross, merchMarginPercent, merchGST,
      supportRevenue, supportGST, totalGross, totalCost, totalGST, netProfit,
    };
  }, [orders, products, contributions]);

  const productMetrics = useMemo(() => {
    const breakdown = {};
    
    for (const order of orders) {
      for (const item of (order.items || [])) {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          const itemPrice = item.price || product.sale_price || product.price;
          const itemCost = product.cost_price || (product.sale_price || product.price || 0) * 0.4;
          
          if (!breakdown[item.product_id]) {
            breakdown[item.product_id] = { name: product.name, units: 0, revenue: 0, cost: 0, salePrice: product.sale_price || product.price || 0 };
          }
          breakdown[item.product_id].units += (item.quantity || 1);
          breakdown[item.product_id].revenue += itemPrice * (item.quantity || 1);
          breakdown[item.product_id].cost += itemCost * (item.quantity || 1);
        }
      }
    }

    return Object.entries(breakdown).map(([id, data]) => ({
      id, ...data, gross: data.revenue - data.cost, margin: data.revenue > 0 ? Math.round((data.gross / data.revenue) * 100) : 0,
    }));
  }, [orders, products]);

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground mb-2">Financial Dashboard</h1>
          <p className="font-body text-sm text-muted-foreground">
            Revenue, costs, margins, GST, and profitability analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/merch-financials">
            <Button className="gap-2 rounded-full">
              <Calculator className="w-4 h-4" /> Product Costing
            </Button>
          </Link>
          <Link to="/admin/merch">
            <Button variant="outline" className="gap-2 rounded-full">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="outline" className="gap-2 rounded-full">
              <ShoppingCart className="w-4 h-4" /> View Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* Alert: Products Missing Costs */}
      {productsMissingCosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-900/20 border border-amber-600/30 rounded-2xl p-5"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-body text-sm font-semibold text-amber-100 mb-2">
                {productsMissingCosts.length} Product{productsMissingCosts.length > 1 ? 's' : ''} Missing Cost Data
              </p>
              <p className="font-body text-xs text-amber-200/70 mb-3">
                Add cost prices and delivery costs to enable accurate profit calculations.
              </p>
              <Link to="/admin/merch-financials">
                <Button size="sm" className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                  <Edit2 className="w-3 h-3" /> Add Cost Data Now
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard 
          icon={DollarSign} 
          label="Merch Revenue" 
          value={`$${metrics.merchRevenue.toFixed(2)}`} 
          subtext={`${metrics.merchUnits} units sold`}
          linkTo="/admin/orders"
        />
        <MetricCard 
          icon={TrendingDown} 
          label="Cost of Goods" 
          value={`$${metrics.totalMerchCost.toFixed(2)}`} 
          subtext="Production + sourcing"
          color="destructive"
          linkTo="/admin/merch-financials"
        />
        <MetricCard 
          icon={TrendingUp} 
          label="Gross Profit" 
          value={`$${metrics.merchGross.toFixed(2)}`} 
          subtext={`${metrics.merchMarginPercent}% margin`}
          linkTo="/admin/financials"
        />
        <MetricCard 
          icon={DollarSign} 
          label="GST Collected" 
          value={`$${metrics.totalGST.toFixed(2)}`} 
          subtext="To remit to ATO"
          linkTo="/admin/financials"
        />
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/merch">
          <Card className="cursor-pointer hover:border-primary/40 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-display text-sm text-foreground">Add New Product</p>
                  <p className="font-body text-xs text-muted-foreground">Create merch item</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/merch-financials">
          <Card className="cursor-pointer hover:border-primary/40 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-display text-sm text-foreground">Enter Product Costs</p>
                  <p className="font-body text-xs text-muted-foreground">Set cost prices & margins</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/orders">
          <Card className="cursor-pointer hover:border-primary/40 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-display text-sm text-foreground">Manage Orders</p>
                  <p className="font-body text-xs text-muted-foreground">Process & track</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="actual" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="actual">Actual Performance</TabsTrigger>
          <TabsTrigger value="breakdown">Product Breakdown</TabsTrigger>
          <TabsTrigger value="support">Support Revenue</TabsTrigger>
        </TabsList>

        {/* Actual Performance */}
        <TabsContent value="actual" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-4">
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
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
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
              </CardContent>
            </Card>
          </div>

          <div className="bg-green-900/20 border border-green-600/30 rounded-2xl p-6">
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">Net Profit</p>
            <p className="font-display text-4xl text-green-400">${metrics.netProfit.toFixed(2)}</p>
            <p className="font-body text-sm text-muted-foreground mt-2">
              After all costs, GST, and expenses. This is what you keep.
            </p>
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
              >
                <Card>
                  <CardContent className="p-5">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                      <div className="md:col-span-2">
                        <p className="font-display text-sm text-foreground">{p.name}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Units</p>
                        <p className="font-display text-sm">${p.units}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Revenue</p>
                        <p className="font-display text-sm">${p.revenue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Cost</p>
                        <p className="font-display text-sm text-destructive">${p.cost.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to="/admin/merch-financials">
                          <Button size="sm" variant="outline" className="gap-1">
                            <Edit2 className="w-3 h-3" /> Edit Costs
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="font-body text-muted-foreground mb-4">No sales data yet.</p>
              <Link to="/admin/merch">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" /> Add Products to Start Selling
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        {/* Support Revenue */}
        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-display text-lg text-foreground">Support Contributions</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="font-body text-sm">Total Support Revenue</p>
                  <p className="font-display text-lg text-primary">${metrics.supportRevenue.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-body text-sm">GST Collected</p>
                  <p className="font-display text-sm text-destructive">${metrics.supportGST.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/30">
                <Link to="/back-this">
                  <Button className="gap-2 w-full">
                    <CreditCard className="w-4 h-4" /> View Support Page
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}