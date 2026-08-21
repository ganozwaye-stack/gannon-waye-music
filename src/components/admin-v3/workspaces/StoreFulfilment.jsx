import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ShoppingBag, Package, Truck } from 'lucide-react';
import { SectionCard, RowItem, LoadingState, EmptyState, StatusBadge } from '@/components/admin-v3/shared/SharedComponents';
import { calcProductCostCompleteness, calcTrueProfit, calcOrdersAwaitingFulfilment, calcDuplicateExcluded } from '@/lib/adminV3Metrics';

export default function StoreFulfilment() {
  const { data: products = [], isLoading: pLoading } = useQuery({
    queryKey: ['v3-ws-products'],
    queryFn: () => base44.entities.MerchProduct.list('-updated_date', 50),
    staleTime: 30_000,
  });
  const { data: orders = [] } = useQuery({
    queryKey: ['v3-ws-orders'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 100),
    staleTime: 60_000,
  });
  const { data: suppliers = [] } = useQuery({
    queryKey: ['v3-ws-suppliers'],
    queryFn: () => base44.entities.Supplier.list('-updated_date', 50),
    staleTime: 60_000,
  });
  const { data: reviews = [] } = useQuery({
    queryKey: ['v3-ws-reviews'],
    queryFn: () => base44.entities.ProductReview.list('-created_date', 20),
    staleTime: 60_000,
  });
  const { data: feedback = [] } = useQuery({
    queryKey: ['v3-ws-merch-feedback'],
    queryFn: () => base44.entities.MerchFeedback.list('-created_date', 20),
    staleTime: 60_000,
  });
  const { data: shippingRules = [] } = useQuery({
    queryKey: ['v3-ws-shipping-rules'],
    queryFn: () => base44.entities.ShippingRateRule.list('-updated_date', 20),
    staleTime: 60_000,
  });

  const awaiting = calcOrdersAwaitingFulfilment(orders);
  const dupExcluded = calcDuplicateExcluded(orders);

  return (
    <div className="space-y-6">
      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="Products" value={products.length} icon={Package} />
        <StatBox label="Orders" value={orders.length} icon={ShoppingBag} />
        <StatBox label="Awaiting Fulfilment" value={awaiting.count} icon={Truck} level={awaiting.count > 0 ? 'orange' : 'green'} />
        <StatBox label="Suppliers" value={suppliers.length} icon={Package} />
      </div>

      {/* ── Products ── */}
      <SectionCard title="Products" count={products.length} actionLabel="Merch management" actionPath="/admin/merch">
        {pLoading ? <LoadingState /> : products.length === 0 ? <EmptyState message="No products." /> : products.slice(0, 15).map(p => {
          const completeness = calcProductCostCompleteness(p);
          const profit = calcTrueProfit(p);
          return (
            <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/30">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground/80 truncate">{p.name}</p>
                <p className="text-[10px] text-muted-foreground/50">{p.category} · ${(p.sale_price || 0).toFixed(2)}</p>
              </div>
              {completeness.isComplete ? (
                <div className="text-right">
                  <p className="text-xs text-green-400">${profit.profit.toFixed(2)}</p>
                  <p className="text-[9px] text-muted-foreground/50">{profit.margin}% margin</p>
                </div>
              ) : (
                <StatusBadge label={`Missing: ${completeness.missing.join(', ')}`} level="orange" />
              )}
              <span className={`text-[9px] px-1.5 py-0.5 rounded ${p.stock_quantity > 0 ? 'text-green-400 bg-green-500/5' : 'text-red-400 bg-red-500/5'}`}>
                {p.stock_quantity} in stock
              </span>
            </div>
          );
        })}
      </SectionCard>

      {/* ── Orders & Fulfilment ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Orders Awaiting Fulfilment" count={awaiting.count} actionLabel="All orders" actionPath="/admin/orders">
          {awaiting.count === 0 ? <EmptyState message="No orders awaiting fulfilment." /> : awaiting.orders.slice(0, 8).map(o => (
            <RowItem key={o.id} title={o.customer_name || 'Unknown customer'} subtitle={`$${o.total_amount || 0} · ${o.status || 'pending'}`} status={o.status || 'pending'} statusLevel="orange" path="/admin/orders" />
          ))}
        </SectionCard>

        <SectionCard title="Returns, Duplicates & Exceptions" count={dupExcluded.count} actionLabel="View" actionPath="/admin/orders">
          {dupExcluded.count === 0 ? <EmptyState message="No duplicate or excluded orders." /> : dupExcluded.orders.slice(0, 8).map(o => (
            <RowItem key={o.id} title={o.customer_name || 'Unknown'} subtitle={`$${o.total_amount || 0} · ${o.status}`} status={o.status} statusLevel="red" path="/admin/orders" />
          ))}
        </SectionCard>
      </div>

      {/* ── Suppliers & Shipping ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Suppliers" count={suppliers.length} actionLabel="Procurement" actionPath="/admin/procurement-command">
          {suppliers.length === 0 ? <EmptyState message="No suppliers configured." /> : suppliers.slice(0, 8).map(s => (
            <RowItem key={s.id} title={s.name || s.supplier_name || 'Supplier'} subtitle={s.category || 'General'} status={s.status || 'active'} statusLevel={s.status === 'active' ? 'green' : 'grey'} path="/admin/procurement-command" />
          ))}
        </SectionCard>

        <SectionCard title="Shipping Rate Rules" count={shippingRules.length} actionLabel="Manage" actionPath="/admin/shipping-rates">
          {shippingRules.length === 0 ? <EmptyState message="No shipping rules." /> : shippingRules.slice(0, 8).map(r => (
            <RowItem key={r.id} title={r.rule_name || r.name || 'Shipping rule'} subtitle={r.description || ''} status="Active" statusLevel="green" path="/admin/shipping-rates" />
          ))}
        </SectionCard>
      </div>

      {/* ── Feedback ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Product Reviews" count={reviews.length} actionLabel="View" actionPath="/admin/product-insights">
          {reviews.length === 0 ? <EmptyState message="No product reviews." /> : reviews.slice(0, 5).map(r => (
            <RowItem key={r.id} title={r.customer_name || 'Customer'} subtitle={r.product_name || ''} status={`${r.rating || 0}★`} statusLevel={r.rating >= 4 ? 'green' : r.rating >= 3 ? 'orange' : 'red'} path="/admin/product-insights" />
          ))}
        </SectionCard>

        <SectionCard title="Merch Feedback" count={feedback.length} actionLabel="View" actionPath="/admin/merch-feedback">
          {feedback.length === 0 ? <EmptyState message="No feedback." /> : feedback.slice(0, 5).map(f => (
            <RowItem key={f.id} title={f.customer_name || 'Customer'} subtitle={f.product_name || ''} status={f.rating ? `${f.rating}★` : 'New'} statusLevel="grey" path="/admin/merch-feedback" />
          ))}
        </SectionCard>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, level }) {
  const colorClass = level === 'orange' ? 'text-orange-400' : level === 'red' ? 'text-red-400' : level === 'green' ? 'text-green-400' : 'text-foreground';
  return (
    <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30 flex items-center gap-3">
      <Icon className="w-4 h-4 text-muted-foreground/60" />
      <div>
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={`text-xl font-semibold ${colorClass}`}>{value}</p>
      </div>
    </div>
  );
}