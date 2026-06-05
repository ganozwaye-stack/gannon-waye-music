import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, ChevronRight } from 'lucide-react';
import { startOfWeek, endOfWeek, subWeeks, isWithinInterval, parseISO } from 'date-fns';

function calcNetProfit(order) {
  const gross = order.total_amount || 0;
  const itemsCost = (order.items || []).reduce((s, i) => s + (i.cost_price || 0) * (i.quantity || 1), 0);
  const deliveryCost = (order.items || []).reduce((s, i) => s + (i.delivery_cost || 0) * (i.quantity || 1), 0);
  const fees = gross * 0.035;
  return gross - itemsCost - deliveryCost - fees;
}

function isActive(o) { return !['cancelled', 'refunded', 'deleted'].includes(o.status); }

export default function WeeklyMoneyReport() {
  const navigate = useNavigate();
  const now = new Date();
  const thisWeek = { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
  const lastWeek = { start: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }), end: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }) };

  const inRange = (date, range) => {
    try { return isWithinInterval(typeof date === 'string' ? parseISO(date) : date, range); }
    catch { return false; }
  };

  const { data: orders = [], refetch } = useQuery({
    queryKey: ['weekly-orders'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 500),
  });
  const { data: supporters = [] } = useQuery({
    queryKey: ['weekly-supporters'],
    queryFn: () => base44.entities.SupportContribution.list('-created_date', 100),
  });
  const { data: subscribers = [] } = useQuery({
    queryKey: ['weekly-subs'],
    queryFn: () => base44.entities.EmailSubscriber.list('-created_date', 200),
  });

  const thisOrders = orders.filter(o => isActive(o) && inRange(o.created_date, thisWeek));
  const lastOrders = orders.filter(o => isActive(o) && inRange(o.created_date, lastWeek));
  const thisRevenue = thisOrders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + (o.total_amount || 0), 0);
  const lastRevenue = lastOrders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + (o.total_amount || 0), 0);
  const thisProfit = thisOrders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + calcNetProfit(o), 0);
  const lastProfit = lastOrders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + calcNetProfit(o), 0);
  const thisSupport = supporters.filter(s => inRange(s.created_date, thisWeek)).reduce((sum, s) => sum + (s.amount || 0), 0);
  const thisSubs = subscribers.filter(s => inRange(s.created_date, thisWeek)).length;
  const cancelledThis = orders.filter(o => o.status === 'cancelled' && inRange(o.created_date, thisWeek));
  const lostRevenue = cancelledThis.reduce((s, o) => s + (o.total_amount || 0), 0);

  const revenueDelta = lastRevenue > 0 ? ((thisRevenue - lastRevenue) / lastRevenue) * 100 : 0;
  const profitDelta = lastProfit > 0 ? ((thisProfit - lastProfit) / lastProfit) * 100 : 0;

  const Delta = ({ val }) => (
    <span className={`text-xs flex items-center gap-0.5 ${val >= 0 ? 'text-green-400' : 'text-red-400'}`}>
      {val >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {val >= 0 ? '+' : ''}{val.toFixed(1)}% vs last week
    </span>
  );

  const Metric = ({ label, value, sub, delta, route, color }) => (
    <Link to={route || '#'}>
      <Card className="hover:border-primary/40 cursor-pointer">
        <CardContent className="p-4">
          <p className={`text-2xl font-bold ${color || 'text-foreground'}`}>{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
          {delta !== undefined && <Delta val={delta} />}
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary/40 rounded"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Weekly Money Report</h1>
            <p className="text-sm text-muted-foreground mt-1">Revenue, profit, and growth — this week vs last week</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1"><RefreshCw className="w-3 h-3" />Refresh</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric label="Revenue This Week" value={`$${thisRevenue.toFixed(0)}`} sub="Paid orders only" delta={revenueDelta} route="/admin/order-profit-intelligence" color="text-green-400" />
        <Metric label="Net Profit This Week" value={`$${thisProfit.toFixed(0)}`} sub="After costs + fees" delta={profitDelta} route="/admin/order-profit-intelligence" color="text-primary" />
        <Metric label="Orders This Week" value={thisOrders.length} sub={`${lastOrders.length} last week`} route="/admin/order-profit-intelligence" />
        <Metric label="New Subscribers" value={thisSubs} sub="Email list growth" route="/admin/subscribers" color="text-blue-400" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Metric label="Supporter Contributions" value={`$${thisSupport.toFixed(0)}`} sub="This week" route="/admin/supporters" color="text-yellow-400" />
        <Metric label="Lost Revenue (Cancelled)" value={`$${lostRevenue.toFixed(0)}`} sub={`${cancelledThis.length} cancelled this week`} route="/admin/order-profit-intelligence" color="text-red-400" />
        <Metric label="Last Week Revenue" value={`$${lastRevenue.toFixed(0)}`} sub="Comparison baseline" route="/admin/order-profit-intelligence" color="text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Top Actions This Week</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'Review pending agent proposals', route: '/admin/revenue-actions', urgent: true },
              { label: 'Check payment diagnostics', route: '/admin/payment-diagnostics', urgent: false },
              { label: 'Review unread notifications', route: '/admin/notifications', urgent: false },
              { label: 'Approve/reject approval queue items', route: '/admin/approval-queue', urgent: false },
              { label: 'Check shipping for packed orders', route: '/admin/orders', urgent: false },
            ].map(item => (
              <Link key={item.route} to={item.route}>
                <div className={`flex items-center justify-between border rounded-lg px-3 py-2.5 hover:border-primary/40 transition-colors ${item.urgent ? 'border-yellow-500/30 bg-yellow-500/3' : 'border-border'}`}>
                  <p className="text-sm">{item.label}</p>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Income Source Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Merch Sales', value: `$${thisRevenue.toFixed(0)}`, color: 'text-green-400', route: '/admin/orders' },
              { label: 'Supporter Contributions', value: `$${thisSupport.toFixed(0)}`, color: 'text-yellow-400', route: '/admin/supporters' },
              { label: 'Mastering / Bookings', value: 'Check manually', color: 'text-purple-400', route: '/admin/mastering' },
              { label: 'Total Active Revenue', value: `$${(thisRevenue + thisSupport).toFixed(0)}`, color: 'text-primary', route: '/admin/financials' },
            ].map(item => (
              <Link key={item.label} to={item.route}>
                <div className="flex items-center justify-between border border-border rounded-lg px-3 py-2.5 hover:border-primary/40 transition-colors">
                  <p className="text-sm font-medium">{item.label}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}