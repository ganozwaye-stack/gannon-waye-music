import { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Package, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function MarginBar({ percent }) {
  const color = percent >= 50 ? '#22c55e' : percent >= 25 ? '#f5d06e' : '#ef4444';
  return (
    <div className="w-full bg-secondary/60 rounded-full h-1.5 mt-1">
      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${Math.min(percent, 100)}%`, background: color }} />
    </div>
  );
}

export default function ProductInsights() {
  const { toast } = useToast();
  const [insights, setInsights] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

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

  // Build per-product stats from orders
  const productStats = useMemo(() => {
    const stats = {};
    for (const order of orders) {
      for (const item of (order.items || [])) {
        if (!stats[item.product_id]) {
          stats[item.product_id] = { units: 0, revenue: 0 };
        }
        stats[item.product_id].units += (item.quantity || 1);
        stats[item.product_id].revenue += (item.price || 0) * (item.quantity || 1);
      }
    }
    return stats;
  }, [orders]);

  const generateInsight = async (product) => {
    setLoadingId(product.id);
    try {
      const stats = productStats[product.id] || { units: 0, revenue: 0 };
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a creative music merchandise strategist for Gannon Waye, an indie singer-songwriter whose debut single is called "Thank You" — a deeply emotional song about grief, self-discovery, and gratitude.

Product: "${product.name}"
Category: ${product.category}
Sale price: $${product.price}
Units sold: ${stats.units}
Revenue: $${stats.revenue.toFixed(2)}

Generate:
1. A short emotional product description (2 sentences) connecting this item to the "Thank You" theme
2. The best selling angle (1 sentence — why fans will want this emotionally)
3. The ideal audience type for this product
4. A suggested social media caption (Instagram/TikTok, under 100 chars, no hashtags)
5. One performance insight based on category and sales data

Return JSON only.`,
        response_json_schema: {
          type: 'object',
          properties: {
            description: { type: 'string' },
            selling_angle: { type: 'string' },
            audience: { type: 'string' },
            caption: { type: 'string' },
            performance_insight: { type: 'string' },
          }
        }
      });
      setInsights(prev => ({ ...prev, [product.id]: res }));
      setExpandedId(product.id);
    } catch {
      toast({ title: 'Could not generate insight', variant: 'destructive' });
    }
    setLoadingId(null);
  };

  const totalRevenue = Object.values(productStats).reduce((s, p) => s + p.revenue, 0);
  const totalUnits = Object.values(productStats).reduce((s, p) => s + p.units, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-foreground">Product Intelligence</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Real-time performance data + AI-generated insights for each product
        </p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign },
          { label: 'Units Sold', value: totalUnits, icon: Package },
          { label: 'Active Products', value: products.filter(p => p.is_active).length, icon: TrendingUp },
          { label: 'Total Orders', value: orders.length, icon: TrendingUp },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/40 rounded-2xl p-5">
            <s.icon className="w-4 h-4 text-primary mb-2" />
            <p className="font-display text-2xl text-foreground">{s.value}</p>
            <p className="font-body text-xs text-muted-foreground tracking-wider uppercase mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Product cards */}
      <div className="space-y-4">
        {products.map((product, i) => {
          const stats = productStats[product.id] || { units: 0, revenue: 0 };
          const insight = insights[product.id];
          const isExpanded = expandedId === product.id;
          const isLoading = loadingId === product.id;

          // Margin % based on a rough 40% cost assumption if no cost_price field
          const costEstimate = product.cost_price || (product.price * 0.4);
          const marginPercent = product.price > 0
            ? Math.round(((product.price - costEstimate) / product.price) * 100)
            : 0;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border/40 rounded-2xl overflow-hidden"
            >
              {/* Main row */}
              <div className="p-5 flex flex-wrap items-center gap-4">
                {/* Image */}
                <div className="w-14 h-14 rounded-xl bg-secondary/50 overflow-hidden flex-shrink-0">
                  {product.image_url
                    ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-muted-foreground/30" /></div>
                  }
                </div>

                {/* Name + category */}
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base text-foreground leading-tight">{product.name}</p>
                  <p className="font-body text-xs text-muted-foreground capitalize mt-0.5">{product.category}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="font-display text-lg text-primary">${product.price?.toFixed(2)}</p>
                    <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Sale Price</p>
                  </div>
                  <div>
                    <p className="font-display text-lg text-foreground">{stats.units}</p>
                    <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Units Sold</p>
                  </div>
                  <div>
                    <p className="font-display text-lg text-foreground">${stats.revenue.toFixed(0)}</p>
                    <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Revenue</p>
                  </div>
                  <div>
                    <p className={`font-display text-lg ${marginPercent >= 50 ? 'text-green-400' : marginPercent >= 25 ? 'text-primary' : 'text-destructive'}`}>
                      {marginPercent}%
                    </p>
                    <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Est. Margin</p>
                    <MarginBar percent={marginPercent} />
                  </div>
                </div>

                {/* AI button */}
                <Button
                  size="sm"
                  variant={insight ? 'default' : 'outline'}
                  onClick={() => insight ? setExpandedId(isExpanded ? null : product.id) : generateInsight(product)}
                  disabled={isLoading}
                  className="rounded-full font-body text-xs tracking-wider uppercase gap-1.5 flex-shrink-0"
                >
                  {isLoading ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Analysing…</>
                  ) : insight ? (
                    <>{isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />} View Insight</>
                  ) : (
                    <><Sparkles className="w-3 h-3" /> Generate AI Insight</>
                  )}
                </Button>
              </div>

              {/* AI Insight panel */}
              {insight && isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-border/40 bg-secondary/20 px-5 py-5"
                >
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary mb-4 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> AI Intelligence Report
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="font-body text-[10px] tracking-wider uppercase text-muted-foreground mb-1">Emotional Description</p>
                        <p className="font-body text-sm text-foreground/80 leading-relaxed">{insight.description}</p>
                      </div>
                      <div>
                        <p className="font-body text-[10px] tracking-wider uppercase text-muted-foreground mb-1">Selling Angle</p>
                        <p className="font-body text-sm text-foreground/80 leading-relaxed">{insight.selling_angle}</p>
                      </div>
                      <div>
                        <p className="font-body text-[10px] tracking-wider uppercase text-muted-foreground mb-1">Ideal Audience</p>
                        <p className="font-body text-sm text-foreground/80">{insight.audience}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="font-body text-[10px] tracking-wider uppercase text-muted-foreground mb-1">Suggested Caption</p>
                        <div className="bg-card border border-border/40 rounded-xl p-3">
                          <p className="font-body text-sm text-primary italic">"{insight.caption}"</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-body text-[10px] tracking-wider uppercase text-muted-foreground mb-1">Performance Insight</p>
                        <p className="font-body text-sm text-foreground/80 leading-relaxed">{insight.performance_insight}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {products.length === 0 && (
          <div className="text-center py-24">
            <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">No products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}