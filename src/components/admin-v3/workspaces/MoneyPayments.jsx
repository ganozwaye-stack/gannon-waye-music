import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DollarSign, AlertTriangle, RefreshCw, Heart, Package } from 'lucide-react';
import { SectionCard, RowItem, LoadingState, EmptyState, StatusBadge, KpiCard, InfoTooltip } from '@/components/admin-v3/shared/SharedComponents';
import { calcVerifiedRevenue, calcOrdersAwaitingFulfilment, calcPaymentExceptions, calcDuplicateExcluded, calcProductCostCompleteness } from '@/lib/adminV3Metrics';

export default function MoneyPayments() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['v3-ws-money-orders'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 200),
    staleTime: 60_000,
  });
  const { data: diagnostics = [] } = useQuery({
    queryKey: ['v3-ws-money-diag'],
    queryFn: () => base44.entities.PaymentDiagnostic.list('-created_date', 50),
    staleTime: 60_000,
  });
  const { data: stripeEvents = [] } = useQuery({
    queryKey: ['v3-ws-stripe-events'],
    queryFn: () => base44.entities.StripeEventLog.list('-created_date', 30),
    staleTime: 60_000,
  });
  const { data: contributions = [] } = useQuery({
    queryKey: ['v3-ws-money-contributions'],
    queryFn: () => base44.entities.SupportContribution.list('-created_date', 50),
    staleTime: 60_000,
  });
  const { data: charity = [] } = useQuery({
    queryKey: ['v3-ws-charity'],
    queryFn: () => base44.entities.CharityDonationTracker.list('-created_date', 20),
    staleTime: 60_000,
  });
  const { data: products = [] } = useQuery({
    queryKey: ['v3-ws-money-products'],
    queryFn: () => base44.entities.MerchProduct.list('-updated_date', 50),
    staleTime: 60_000,
  });
  const { data: landedCosts = [] } = useQuery({
    queryKey: ['v3-ws-landed-costs'],
    queryFn: () => base44.entities.LandedCostCalculation.list('-created_date', 20),
    staleTime: 60_000,
  });

  const revenue = calcVerifiedRevenue(orders);
  const awaiting = calcOrdersAwaitingFulfilment(orders);
  const exceptions = calcPaymentExceptions(orders, diagnostics);
  const dupExcluded = calcDuplicateExcluded(orders);
  const contributionTotal = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const productsWithMissingCosts = products.filter(p => !calcProductCostCompleteness(p).isComplete);

  return (
    <div className="space-y-6">
      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={DollarSign} label="Verified Revenue" value={`$${revenue.total.toLocaleString('en-AU')}`} sublabel={`${revenue.count} paid orders`} path="/admin/orders" tooltip={revenue.formula} level="green" />
        <KpiCard icon={AlertTriangle} label="Payment Exceptions" value={exceptions.count} sublabel="Needs resolution" path="/admin/payment-diagnostics" tooltip={exceptions.formula} level={exceptions.count > 0 ? 'red' : 'green'} />
        <KpiCard icon={RefreshCw} label="Awaiting Fulfilment" value={awaiting.count} sublabel="Paid, not shipped" path="/admin/orders" tooltip={awaiting.formula} level={awaiting.count > 0 ? 'orange' : 'green'} />
        <KpiCard icon={Heart} label="Support Contributions" value={`$${contributionTotal.toLocaleString('en-AU')}`} sublabel={`${contributions.length} contributions`} path="/admin/supporters" level="green" />
      </div>

      {/* ── Verified Revenue Detail ── */}
      <SectionCard title="Verified Revenue" count={revenue.count} actionLabel="Orders" actionPath="/admin/orders">
        {isLoading ? <LoadingState /> : revenue.count === 0 ? <EmptyState message="No verified paid orders." /> : revenue.orders.slice(0, 10).map(o => (
          <RowItem key={o.id} title={o.customer_name || 'Customer'} subtitle={`$${o.total_amount || 0} · ${new Date(o.created_date).toLocaleDateString('en-AU')}`} status="Paid" statusLevel="green" path="/admin/orders" />
        ))}
        {revenue.count > 10 && <p className="text-[10px] text-muted-foreground/40 px-3">+{revenue.count - 10} more</p>}
      </SectionCard>

      {/* ── Exceptions & Duplicates ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Payment Exceptions" count={exceptions.count} actionLabel="Diagnostics" actionPath="/admin/payment-diagnostics">
          {exceptions.count === 0 ? <EmptyState message="No payment exceptions." /> : (
            <>
              {exceptions.failedOrders.slice(0, 5).map(o => (
                <RowItem key={o.id} title={o.customer_name || 'Customer'} subtitle={`$${o.total_amount || 0}`} status={o.payment_status} statusLevel="red" path="/admin/payment-diagnostics" />
              ))}
              {exceptions.openDiagnostics.slice(0, 5).map(d => (
                <RowItem key={d.id} title={d.title || d.issue_type || 'Diagnostic'} subtitle={d.description || ''} status="Open" statusLevel="orange" path="/admin/payment-diagnostics" />
              ))}
            </>
          )}
        </SectionCard>

        <SectionCard title="Duplicate & Excluded Orders" count={dupExcluded.count} actionLabel="View" actionPath="/admin/orders">
          {dupExcluded.count === 0 ? <EmptyState message="No duplicate or excluded orders." /> : dupExcluded.orders.slice(0, 8).map(o => (
            <RowItem key={o.id} title={o.customer_name || 'Customer'} subtitle={`$${o.total_amount || 0} · ${o.status}`} status={o.status} statusLevel="red" path="/admin/orders" />
          ))}
        </SectionCard>
      </div>

      {/* ── Product Cost Completeness ── */}
      <SectionCard title="Product Costs & True Margin" count={products.length} actionLabel="Products" actionPath="/admin/merch">
        {products.length === 0 ? <EmptyState message="No products." /> : products.slice(0, 15).map(p => {
          const completeness = calcProductCostCompleteness(p);
          return (
            <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/30">
              <Package className="w-3.5 h-3.5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground/80 truncate">{p.name}</p>
                <p className="text-[10px] text-muted-foreground/50">Sale: ${(p.sale_price || 0).toFixed(2)} · Cost: ${completeness.isComplete ? (p.cost_price || 0).toFixed(2) : '—'}</p>
              </div>
              {completeness.isComplete ? (
                <StatusBadge label="Cost complete" level="green" />
              ) : (
                <div className="flex items-center gap-1.5">
                  <InfoTooltip text={completeness.formula} />
                  <StatusBadge label={`Missing: ${completeness.missing.join(', ')}`} level="orange" />
                </div>
              )}
            </div>
          );
        })}
        {productsWithMissingCosts.length > 0 && (
          <p className="text-[10px] text-orange-400/70 px-3 pt-2">{productsWithMissingCosts.length} product(s) have missing cost data — profit figures are not shown for these.</p>
        )}
      </SectionCard>

      {/* ── Charity & Contributions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Support Contributions" count={contributions.length} actionLabel="View" actionPath="/admin/supporters">
          {contributions.length === 0 ? <EmptyState message="No contributions." /> : contributions.slice(0, 8).map(c => (
            <RowItem key={c.id} title={c.supporter_name || c.customer_name || 'Supporter'} subtitle={`$${c.amount || 0}`} status="Contributed" statusLevel="green" path="/admin/supporters" />
          ))}
        </SectionCard>

        <SectionCard title="Charity Obligations" count={charity.length} actionLabel="Charity tracking" actionPath="/admin/charity-tracking">
          {charity.length === 0 ? <EmptyState message="No charity records." /> : charity.slice(0, 8).map(c => (
            <RowItem key={c.id} title={c.description || c.recipient || 'Charity'} subtitle={`$${c.amount || 0}`} status={c.status || 'pending'} statusLevel={c.status === 'donated' || c.status === 'paid' ? 'green' : 'orange'} path="/admin/charity-tracking" />
          ))}
        </SectionCard>
      </div>

      {/* ── Data Completeness ── */}
      <SectionCard title="Financial Data Completeness" count={products.length}>
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground/70">Products with complete cost data</span>
            <span className="text-xs text-foreground">{products.length - productsWithMissingCosts.length}/{products.length}</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary/40 overflow-hidden">
            <div className="h-full rounded-full bg-green-500/60" style={{ width: `${products.length > 0 ? ((products.length - productsWithMissingCosts.length) / products.length) * 100 : 0}%` }} />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-foreground/70">Stripe events logged (recent)</span>
            <span className="text-xs text-foreground">{stripeEvents.length}</span>
          </div>
          <p className="text-[10px] text-muted-foreground/50 italic mt-2">Projections, opportunities, and potential value are never labeled as revenue. Only verified paid orders with reconciled payment references are included in verified revenue.</p>
        </div>
      </SectionCard>
    </div>
  );
}