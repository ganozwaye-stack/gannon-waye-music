import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  DollarSign, Package, AlertTriangle, Clock, CheckCircle2,
  TrendingUp, Zap, ShoppingCart, Truck, Shield, BarChart3,
  ExternalLink, ChevronRight, RefreshCw, Boxes
} from 'lucide-react';

export default function BusinessProcessCommand() {
  const { data: notifications = [], isLoading: loadN } = useQuery({
    queryKey: ['bpc-notifications'],
    queryFn: () => base44.entities.AdminNotification.filter({ is_read: false }, '-created_date', 20),
  });
  const { data: approvals = [] } = useQuery({
    queryKey: ['bpc-approvals'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 10),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ['bpc-orders'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 20),
  });
  const { data: pos = [] } = useQuery({
    queryKey: ['bpc-pos'],
    queryFn: () => base44.entities.PurchaseOrder.list('-created_date', 10),
  });
  const { data: batches = [] } = useQuery({
    queryKey: ['bpc-batches'],
    queryFn: () => base44.entities.InventoryBatch.list('-created_date', 20),
  });
  const { data: products = [] } = useQuery({
    queryKey: ['bpc-products'],
    queryFn: () => base44.entities.MerchProduct.list(),
  });

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');
  const activePOs = pos.filter(p => ['pending_approval', 'approved', 'ordered', 'shipped'].includes(p.status));
  const prelimBatches = batches.filter(b => b.is_preliminary_cost);
  const stockValue = batches.reduce((s, b) => s + (b.stock_value_aud || 0), 0);
  const noImageProducts = products.filter(p => p.is_active && !p.image_url);

  const criticalAlerts = notifications.filter(n => n.severity === 'critical' || n.severity === 'high');

  const commandLinks = [
    { label: 'Procurement Command', path: '/admin/procurement-command', icon: ShoppingCart, desc: 'Alibaba · Purchase Orders · Landed Cost' },
    { label: 'Landed Cost Calculator', path: '/admin/landed-cost-calculator', icon: DollarSign, desc: 'Calculate per-unit costs' },
    { label: 'Stock Flow Dashboard', path: '/admin/stock-flow-dashboard', icon: Boxes, desc: 'Inventory · Ordered · Available · Sold' },
    { label: 'Purchase Orders', path: '/admin/purchase-orders', icon: Package, desc: 'All POs · Tracking · Status' },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart, desc: 'Customer orders · Fulfillment' },
    { label: 'Merch Management', path: '/admin/merch', icon: Package, desc: 'Products · Prices · Stock' },
    { label: 'Merch Financials', path: '/admin/merch-financials', icon: BarChart3, desc: 'Profit · Margins · Revenue' },
    { label: 'Stripe Command Centre', path: '/admin/stripe-command-centre', icon: Shield, desc: 'Payments · Webhooks' },
    { label: 'Approval Queue', path: '/admin/approval-queue', icon: CheckCircle2, desc: 'Pending approvals' },
    { label: 'Business Attention Centre', path: '/admin/business-attention-centre', icon: AlertTriangle, desc: 'All blockers' },
    { label: 'Discount Guard', path: '/admin/discount-guard', icon: Shield, desc: 'Promo code rules' },
    { label: 'Shipping Rates', path: '/admin/shipping-rates', icon: Truck, desc: 'Postage rules' },
    { label: 'Promo Code Audit', path: '/admin/promo-code-audit', icon: Zap, desc: 'Code audit' },
    { label: 'Agent Workbench', path: '/admin/agent-workbench', icon: Zap, desc: 'Run agents' },
    { label: 'Executive Feed', path: '/admin/executive-feed', icon: TrendingUp, desc: 'Daily summary' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Operations</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Business Process Command</h1>
        <p className="text-muted-foreground text-sm mt-1">Everything happening in the business — cash, stock, orders, suppliers, agents, content</p>
      </div>

      {criticalAlerts.length > 0 && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-sm font-semibold text-red-300">{criticalAlerts.length} Critical Alert(s) Require Attention</p>
            </div>
            {criticalAlerts.slice(0, 3).map(a => (
              <p key={a.id} className="text-xs text-muted-foreground">• {a.title}</p>
            ))}
            <Link to="/admin/notifications">
              <Button size="sm" variant="outline" className="mt-2 text-xs gap-1">View All <ChevronRight className="w-3 h-3" /></Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending Approvals', value: approvals.length, color: 'text-amber-400', path: '/admin/approval-queue' },
          { label: 'Active POs', value: activePOs.length, color: 'text-blue-400', path: '/admin/purchase-orders' },
          { label: 'Stock Value (AUD)', value: `$${stockValue.toFixed(2)}`, color: 'text-primary', path: '/admin/stock-flow-dashboard' },
          { label: 'Preliminary Costs', value: prelimBatches.length, color: 'text-amber-400', path: '/admin/purchase-orders' },
          { label: 'Unread Alerts', value: notifications.length, color: 'text-red-400', path: '/admin/notifications' },
          { label: 'Customer Orders', value: pendingOrders.length, color: 'text-green-400', path: '/admin/orders' },
          { label: 'Products Needing Images', value: noImageProducts.length, color: 'text-orange-400', path: '/admin/merch' },
          { label: 'Active Products', value: products.filter(p => p.is_active).length, color: 'text-green-400', path: '/admin/merch' },
        ].map(s => (
          <Link key={s.label} to={s.path}>
            <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Alibaba/supplier blocker */}
      <Card className="border-amber-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ExternalLink className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-300">Alibaba — Manual Login Required</p>
              <p className="text-xs text-muted-foreground mt-1">
                To import or view Alibaba orders, log into Alibaba.com manually. The system supports manual entry and CSV import.
                No automatic ordering or payment will occur without your approval.
              </p>
              <div className="flex gap-2 mt-2">
                <a href="https://www.alibaba.com/trade/ManageOrders/order_list.htm" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="text-xs gap-1"><ExternalLink className="w-3 h-3" /> Open Alibaba Orders</Button>
                </a>
                <Link to="/admin/procurement-command">
                  <Button size="sm" className="text-xs gap-1"><Package className="w-3 h-3" /> Enter Order Manually</Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Command grid */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Command Sections</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {commandLinks.map(l => (
            <Link key={l.path} to={l.path}>
              <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 flex items-start gap-3">
                  <l.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{l.label}</p>
                    <p className="text-xs text-muted-foreground">{l.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}