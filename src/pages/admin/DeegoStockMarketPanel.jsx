import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, TrendingUp, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';

// Deego-managed reporting panel: live merchandise stock levels on one side,
// the latest Deego owner report's market evidence on the other, so the owner
// can compare what is on the shelf against what the market is doing.
const stockUnits = (product) => {
  const variantStock = product.stock_by_variant && typeof product.stock_by_variant === 'object'
    ? Object.values(product.stock_by_variant).reduce((sum, value) => sum + (value || 0), 0)
    : null;
  return variantStock !== null ? variantStock : (product.stock_quantity || 0);
};

const StatCard = ({ label, value, tone }) => (
  <div className="rounded-2xl border border-border/40 bg-card/70 p-4">
    <p className="font-body text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">{label}</p>
    <p className={`font-body text-2xl ${tone || 'text-foreground'}`}>{value}</p>
  </div>
);

export default function DeegoStockMarketPanel() {
  const productsQuery = useQuery({
    queryKey: ['deego-stock-market-products'],
    queryFn: () => base44.entities.MerchProduct.list(),
  });
  const reportsQuery = useQuery({
    queryKey: ['deego-stock-market-reports'],
    queryFn: () => base44.entities.DeegoOwnerReport.list('-generated_at', 10),
  });

  if (productsQuery.isLoading || reportsQuery.isLoading) {
    return (
      <div className="p-6">
        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Loading Deego stock and market report...</p>
      </div>
    );
  }

  const products = (productsQuery.data || []).filter((p) => p.publication_status === 'live' || p.is_active === true);
  const report = (reportsQuery.data || [])[0] || null;

  const totalUnits = products.reduce((sum, p) => sum + stockUnits(p), 0);
  const lowStock = products.filter((p) => stockUnits(p) > 0 && stockUnits(p) < 5);
  const outOfStock = products.filter((p) => stockUnits(p) <= 0);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-2 flex items-center gap-2">
          <Package className="w-3.5 h-3.5" /> Deego Intelligence
        </p>
        <h1 className="font-display text-3xl text-foreground">Stock vs Market</h1>
        <p className="font-body text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          Your live merchandise stock levels in one column, the latest Deego market evidence in the other, so restock and pricing calls can be made from one screen.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Live products" value={products.length} />
        <StatCard label="Units in stock" value={totalUnits} />
        <StatCard label="Low stock (under 5)" value={lowStock.length} tone={lowStock.length ? 'text-orange-400' : undefined} />
        <StatCard label="Out of stock" value={outOfStock.length} tone={outOfStock.length ? 'text-destructive' : undefined} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Live stock */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-border/40 bg-card/60 p-5">
          <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary/70" /> Live Merchandise Stock
          </h2>
          {products.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No live merchandise yet.</p>
          ) : (
            <div className="space-y-2.5">
              {products.map((product) => {
                const units = stockUnits(product);
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/30 bg-background/40 px-4 py-3">
                    <div className="min-w-0">
                      <p className="font-body text-sm text-foreground truncate">{product.name}</p>
                      <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                        {product.category} · {product.inventory_source}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <p className="font-body text-sm text-foreground/80">${Number(product.sale_price || 0).toFixed(2)}</p>
                      <Badge variant={units <= 0 ? 'destructive' : units < 5 ? 'outline' : 'default'}>
                        {units <= 0 ? 'Out' : `${units} in stock`}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* Market trends */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border border-border/40 bg-card/60 p-5">
          <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary/70" /> Market Trends
          </h2>
          {!report ? (
            <p className="font-body text-sm text-muted-foreground">
              No Deego owner report has been generated yet. Once Deego delivers a report, its market comparison lands here beside your stock.
            </p>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Latest report: {report.title} · v{report.version}
                </p>
                {(report.offers || []).slice(0, 6).map((offer, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 rounded-xl border border-border/30 bg-background/40 px-4 py-3 mb-2">
                    <div className="min-w-0">
                      <p className="font-body text-sm text-foreground truncate">{offer.name}</p>
                      <p className="font-body text-[10px] text-muted-foreground mt-0.5">
                        {offer.market || 'Market data pending'}{offer.margin ? ` · Margin ${offer.margin}` : ''}
                      </p>
                      {offer.recommendation && (
                        <p className="font-body text-[10px] text-primary/80 mt-1">{offer.recommendation}</p>
                      )}
                    </div>
                    <p className="font-body text-sm text-foreground/80 shrink-0">${Number(offer.price || 0).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {(report.comparison || []).length > 0 && (
                <div>
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Marketplace comparison</p>
                  {(report.comparison || []).slice(0, 6).map((row, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 border-b border-border/20 py-2">
                      <div className="min-w-0">
                        <p className="font-body text-xs text-foreground truncate">{row.seller}{row.category ? ` · ${row.category}` : ''}</p>
                        {row.qualification && (
                          <p className="font-body text-[10px] text-muted-foreground truncate">{row.qualification}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <p className="font-body text-xs text-foreground/80">{row.price}</p>
                        {row.url && (
                          <a
                            href={row.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${row.seller} listing`}
                            className="text-muted-foreground hover:text-primary transition-colors">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {report.decision_requested && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                  <p className="font-body text-[9px] uppercase tracking-[0.25em] gradient-gold-text mb-1">Owner decision required</p>
                  <p className="font-body text-xs text-foreground/80 leading-relaxed">{report.decision_requested}</p>
                </div>
              )}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}