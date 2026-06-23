import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { ShoppingBag, DollarSign, FileText, Music, Package, ArrowRight } from 'lucide-react';

export default function OwnerDashboard() {
  const { data: orders = [] } = useQuery({
    queryKey: ['orders-owner'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 50),
  });
  const { data: approvals = [] } = useQuery({
    queryKey: ['pending-approvals-owner'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }),
  });
  const { data: releases = [] } = useQuery({
    queryKey: ['releases-owner'],
    queryFn: () => base44.entities.Release.list('-release_date'),
  });
  const { data: products = [] } = useQuery({
    queryKey: ['products-owner'],
    queryFn: () => base44.entities.MerchProduct.list(),
  });

  const today = new Date().toDateString();
  const todaysOrders = orders.filter(o => new Date(o.created_date).toDateString() === today);
  const todaysRevenue = todaysOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingApprovals = approvals.length;
  const unpublishedReleases = releases.filter(r => !r.is_published);
  const outOfStock = products.filter(p => p.stock_quantity === 0 && p.is_active);

  const attentionItems = [
    ...(pendingApprovals > 0 ? [{ count: pendingApprovals, label: 'Content waiting for approval', link: '/admin/approval-queue' }] : []),
    ...(outOfStock.length > 0 ? [{ count: outOfStock.length, label: 'Products out of stock', link: '/admin/merch' }] : []),
    ...(unpublishedReleases.length > 0 ? [{ count: unpublishedReleases.length, label: 'Unpublished releases', link: '/admin/releases' }] : []),
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-foreground">Good morning, Gannon</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Here is what needs your attention today.</p>
      </div>

      {attentionItems.length > 0 && (
        <div className="mb-6">
          <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-3">Needs Your Attention</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {attentionItems.map((item, i) => (
              <Link key={i} to={item.link} className="bg-card/50 border border-border/40 hover:border-primary/40 rounded-xl p-4 transition-all group">
                <p className="font-display text-2xl text-primary">{item.count}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card/50 border border-border/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Orders Today</p>
          </div>
          <p className="font-display text-3xl text-foreground">{todaysOrders.length}</p>
        </div>
        <div className="bg-card/50 border border-border/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Money Today</p>
          </div>
          <p className="font-display text-3xl text-foreground">${todaysRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-card/50 border border-border/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary" />
            <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Pending Approvals</p>
          </div>
          <p className="font-display text-3xl text-foreground">{pendingApprovals}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-3">Release Tasks</p>
        <div className="space-y-2">
          {unpublishedReleases.map(release => (
            <Link key={release.id} to="/admin/releases" className="flex items-center justify-between bg-card/50 border border-border/40 hover:border-primary/40 rounded-lg p-3 transition-all">
              <div className="flex items-center gap-3">
                {release.artwork_url ? <img src={release.artwork_url} alt="" className="w-10 h-10 rounded object-cover" /> : <Music className="w-5 h-5 text-muted-foreground" />}
                <div>
                  <p className="font-body text-sm text-foreground">{release.title}</p>
                  <p className="font-body text-xs text-muted-foreground">{release.release_date ? new Date(release.release_date).toLocaleDateString('en-AU') : 'No date set'}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
          {unpublishedReleases.length === 0 && <p className="font-body text-xs text-muted-foreground">No pending releases.</p>}
        </div>
      </div>

      <div className="mb-6">
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-3">Store Tasks</p>
        <div className="space-y-2">
          {outOfStock.map(product => (
            <Link key={product.id} to="/admin/merch" className="flex items-center justify-between bg-card/50 border border-border/40 hover:border-primary/40 rounded-lg p-3 transition-all">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-body text-sm text-foreground">{product.name}</p>
                  <p className="font-body text-xs text-yellow-500">Out of stock</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
          {outOfStock.length === 0 && <p className="font-body text-xs text-muted-foreground">All products in stock.</p>}
        </div>
      </div>

      <div>
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-3">Next Best Actions</p>
        <div className="space-y-2">
          <Link to="/admin/approval-queue" className="flex items-center justify-between bg-card/50 border border-border/40 hover:border-primary/40 rounded-lg p-3 transition-all">
            <span className="font-body text-sm text-foreground">Review pending content approvals</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Link>
          <Link to="/admin/releases" className="flex items-center justify-between bg-card/50 border border-border/40 hover:border-primary/40 rounded-lg p-3 transition-all">
            <span className="font-body text-sm text-foreground">Review Without You Here release</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Link>
          <Link to="/admin/press-kit" className="flex items-center justify-between bg-card/50 border border-border/40 hover:border-primary/40 rounded-lg p-3 transition-all">
            <span className="font-body text-sm text-foreground">Review press kit</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Link>
          <Link to="/admin/site-health" className="flex items-center justify-between bg-card/50 border border-border/40 hover:border-primary/40 rounded-lg p-3 transition-all">
            <span className="font-body text-sm text-foreground">Check system health</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}