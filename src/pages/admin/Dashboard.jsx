import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DollarSign, Package, Users, AlertTriangle, CheckCircle2, Clock,
  TrendingUp, Zap, Music, ShoppingBag, Bell, BarChart2,
  Heart, ExternalLink, ChevronRight, XCircle, RefreshCw
} from 'lucide-react';

function StatCard({ label, value, sublabel, color, to, icon: IconComp }) {
  const Icon = IconComp;
  const inner = (
    <Card className={`hover:border-primary/40 transition-all cursor-pointer ${to ? 'cursor-pointer' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Icon className={`w-4 h-4 ${color}`} />
          {to && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
        </div>
        <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
        <p className="text-xs font-body text-foreground font-medium mt-0.5">{label}</p>
        {sublabel && <p className="text-[10px] text-muted-foreground mt-0.5">{sublabel}</p>}
      </CardContent>
    </Card>
  );
  if (to) return <Link to={to}>{inner}</Link>;
  return inner;
}

function OrderStatusRow({ label, count, status, color }) {
  const statusParam = encodeURIComponent(status);
  return (
    <Link to={`/admin/orders?status=${statusParam}`}>
      <div className="flex items-center justify-between py-2 px-2 rounded hover:bg-secondary/30 transition-colors cursor-pointer">
        <span className="font-body text-sm text-muted-foreground">{label}</span>
        <Badge className={`font-mono text-xs ${color}`}>{count}</Badge>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { data: releases = [] } = useQuery({ queryKey: ['releases'], queryFn: () => base44.entities.Release.list() });
  const { data: products = [] } = useQuery({ queryKey: ['merchProducts'], queryFn: () => base44.entities.MerchProduct.list() });
  const { data: orders = [] } = useQuery({ queryKey: ['merchantOrders'], queryFn: () => base44.entities.MerchOrder.list() });
  const { data: subscribers = [] } = useQuery({ queryKey: ['subscribers'], queryFn: () => base44.entities.EmailSubscriber.list() });
  const { data: approvals = [] } = useQuery({ queryKey: ['pendingApprovals'], queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 100) });
  const { data: notifications = [] } = useQuery({ queryKey: ['unreadNotifs'], queryFn: () => base44.entities.AdminNotification.filter({ is_read: false }, '-created_date', 50) });
  const { data: systemIssues = [] } = useQuery({ queryKey: ['openIssues'], queryFn: () => base44.entities.SystemHealthIssue.filter({ status: 'open' }, '-created_date', 50) });
  const { data: calendarPosts = [] } = useQuery({ queryKey: ['calendarPosts'], queryFn: () => base44.entities.ContentCalendarPost.filter({ campaign: 'thank_you_june5_sprint' }, 'sprint_day', 200) });

  // Order breakdowns
  const orderStats = useMemo(() => ({
    new: orders.filter(o => o.status === 'new' || o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    packed: orders.filter(o => o.status === 'packed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled' || o.status === 'refunded').length,
    activeTotal: orders.filter(o => !['cancelled', 'refunded', 'deleted'].includes(o.status)).length,
  }), [orders]);

  const activeRevenue = useMemo(() =>
    orders
      .filter(o => !['cancelled', 'refunded', 'deleted'].includes(o.status))
      .reduce((s, o) => s + (o.total_amount || 0), 0),
    [orders]
  );

  // Social/content
  const postStats = useMemo(() => ({
    approved: calendarPosts.filter(p => p.status === 'approved').length,
    scheduled: calendarPosts.filter(p => p.status === 'scheduled').length,
    posted: calendarPosts.filter(p => p.status === 'posted').length,
    pending: calendarPosts.filter(p => p.status === 'pending_approval').length,
  }), [calendarPosts]);

  // Notification breakdown
  const criticalNotifs = notifications.filter(n => n.severity === 'critical' || n.severity === 'high');
  const criticalIssues = systemIssues.filter(s => s.severity === 'critical' || s.severity === 'high');

  // Releases
  const currentSingle = releases.find(r => r.is_current_single);
  const inProgressReleases = releases.filter(r => r.status !== 'released');

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Gannon Waye OS</p>
          <h1 className="font-display text-3xl text-foreground">Dashboard</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/store" target="_blank">
            <Button size="sm" variant="outline" className="gap-2">
              <ShoppingBag className="w-3.5 h-3.5" /> View Store
            </Button>
          </Link>
          <Link to="/admin/notifications">
            <Button size="sm" variant={criticalNotifs.length > 0 ? 'destructive' : 'outline'} className="gap-2">
              <Bell className="w-3.5 h-3.5" />
              {notifications.length > 0 ? notifications.length : 'Notifications'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Critical alerts */}
      {(criticalNotifs.length > 0 || criticalIssues.length > 0) && (
        <div className="space-y-2">
          {criticalIssues.slice(0, 2).map(issue => (
            <Link key={issue.id} to="/admin/site-health">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-3 hover:border-red-400/50 transition-colors">
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-red-400 font-semibold">{issue.issue_title}</p>
                  <p className="font-body text-xs text-muted-foreground truncate">{issue.recommended_fix}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </Link>
          ))}
          {criticalNotifs.slice(0, 2).map(n => (
            <Link key={n.id} to="/admin/notifications">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3 hover:border-amber-400/50 transition-colors">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-amber-400 font-semibold">{n.title}</p>
                  <p className="font-body text-xs text-muted-foreground truncate">{n.summary}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Primary KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Active Revenue"
          value={`$${activeRevenue.toFixed(0)}`}
          sublabel="Excl. cancelled/refunded"
          color="text-primary"
          to="/admin/orders"
          icon={DollarSign}
        />
        <StatCard
          label="Pending Approvals"
          value={approvals.length}
          sublabel="Needs your sign-off"
          color={approvals.length > 0 ? 'text-amber-400' : 'text-muted-foreground'}
          to="/admin/approval-queue"
          icon={CheckCircle2}
        />
        <StatCard
          label="Unread Alerts"
          value={notifications.length}
          sublabel={`${criticalNotifs.length} critical`}
          color={criticalNotifs.length > 0 ? 'text-red-400' : 'text-muted-foreground'}
          to="/admin/notifications"
          icon={Bell}
        />
        <StatCard
          label="Subscribers"
          value={subscribers.length}
          sublabel="Email list"
          color="text-chart-2"
          to="/admin/subscribers"
          icon={Users}
        />
      </div>

      {/* Order status breakdown */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" /> Order Status Breakdown
          </CardTitle>
          <Link to="/admin/orders">
            <Button size="sm" variant="ghost" className="text-xs gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            <OrderStatusRow label="New / Pending payment" count={orderStats.new} status="pending" color="bg-amber-500/10 text-amber-400 border-amber-500/30" />
            <OrderStatusRow label="Paid / Active" count={orderStats.paid} status="paid" color="bg-blue-500/10 text-blue-400 border-blue-500/30" />
            <OrderStatusRow label="Packed" count={orderStats.packed} status="packed" color="bg-purple-500/10 text-purple-400 border-purple-500/30" />
            <OrderStatusRow label="Shipped" count={orderStats.shipped} status="shipped" color="bg-cyan-500/10 text-cyan-400 border-cyan-500/30" />
            <OrderStatusRow label="Completed" count={orderStats.completed} status="completed" color="bg-green-500/10 text-green-400 border-green-500/30" />
            <OrderStatusRow label="Cancelled / Refunded" count={orderStats.cancelled} status="cancelled" color="bg-red-500/10 text-red-400 border-red-500/30" />
          </div>
          <div className="border-t border-border/30 mt-2 pt-2 flex items-center justify-between px-2">
            <span className="font-body text-xs text-muted-foreground">Active total (excl. cancelled)</span>
            <span className="font-body text-sm font-semibold text-foreground">{orderStats.activeTotal} orders</span>
          </div>
        </CardContent>
      </Card>

      {/* Content + system row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Social / Metricool */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Social Content Status
            </CardTitle>
            <Link to="/admin/metricool-command">
              <Button size="sm" variant="ghost" className="text-xs gap-1">Metricool <ChevronRight className="w-3 h-3" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            {[
              { label: 'Pending review', value: postStats.pending, color: 'text-amber-400', to: '/admin/approval-queue' },
              { label: 'Approved / ready', value: postStats.approved, color: 'text-green-400', to: '/admin/social-schedule-queue' },
              { label: 'Sent to Metricool', value: postStats.scheduled, color: 'text-blue-400', to: '/admin/metricool-scheduler-queue' },
              { label: 'Posted live', value: postStats.posted, color: 'text-primary', to: '/admin/content-performance' },
            ].map(s => (
              <Link key={s.label} to={s.to}>
                <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-secondary/30 transition-colors">
                  <span className="font-body text-sm text-muted-foreground">{s.label}</span>
                  <span className={`font-body text-sm font-semibold ${s.color}`}>{s.value}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* System health */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" /> System Health
            </CardTitle>
            <Link to="/admin/site-health">
              <Button size="sm" variant="ghost" className="text-xs gap-1">Details <ChevronRight className="w-3 h-3" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            {[
              { label: 'Open system issues', value: systemIssues.filter(s => s.status === 'open').length, color: systemIssues.filter(s => s.status === 'open').length > 0 ? 'text-red-400' : 'text-green-400', to: '/admin/site-health' },
              { label: 'Unread notifications', value: notifications.length, color: notifications.length > 0 ? 'text-amber-400' : 'text-green-400', to: '/admin/notifications' },
              { label: 'Pending approvals', value: approvals.length, color: approvals.length > 0 ? 'text-amber-400' : 'text-green-400', to: '/admin/approval-queue' },
              { label: 'Active products', value: products.filter(p => p.is_active).length, color: 'text-foreground', to: '/admin/merch' },
            ].map(s => (
              <Link key={s.label} to={s.to}>
                <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-secondary/30 transition-colors">
                  <span className="font-body text-sm text-muted-foreground">{s.label}</span>
                  <span className={`font-body text-sm font-semibold ${s.color}`}>{s.value}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Releases + quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Releases */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" /> Releases
            </CardTitle>
            <Link to="/admin/releases">
              <Button size="sm" variant="ghost" className="text-xs gap-1">All releases <ChevronRight className="w-3 h-3" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            {currentSingle && (
              <Link to="/admin/releases">
                <div className="flex items-center gap-2 py-2 px-2 rounded bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors mb-2">
                  <Badge className="bg-primary/20 text-primary border-0 text-xs">Current Single</Badge>
                  <span className="font-body text-sm text-foreground font-medium">{currentSingle.title}</span>
                </div>
              </Link>
            )}
            {inProgressReleases.slice(0, 4).map(r => (
              <Link key={r.id} to="/admin/releases">
                <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-secondary/30 transition-colors">
                  <span className="font-body text-sm text-foreground">{r.title}</span>
                  <Badge variant="outline" className="text-xs capitalize">{r.status?.replace(/_/g, ' ')}</Badge>
                </div>
              </Link>
            ))}
            {inProgressReleases.length === 0 && !currentSingle && (
              <p className="font-body text-sm text-muted-foreground py-2 px-2">No in-progress releases</p>
            )}
          </CardContent>
        </Card>

        {/* Quick action links */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Approval Queue', to: '/admin/approval-queue', color: 'text-amber-400', count: approvals.length },
                { label: 'Today\'s Money', to: '/admin/todays-money-moves', color: 'text-primary' },
                { label: 'Content Queue', to: '/admin/social-schedule-queue', color: 'text-blue-400' },
                { label: 'Orders', to: '/admin/orders', color: 'text-foreground', count: orderStats.activeTotal },
                { label: 'Metricool', to: '/admin/metricool-command', color: 'text-green-400' },
                { label: 'Revenue Actions', to: '/admin/revenue-actions', color: 'text-primary' },
                { label: 'Agent Intel', to: '/admin/agent-intelligence', color: 'text-chart-2' },
                { label: 'Go-Live Check', to: '/admin/go-live', color: 'text-muted-foreground' },
              ].map(item => (
                <Link key={item.label} to={item.to}>
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-secondary/30 transition-all">
                    <span className={`font-body text-xs font-medium ${item.color}`}>{item.label}</span>
                    {item.count !== undefined && (
                      <Badge className="bg-secondary text-foreground border-0 text-[10px]">{item.count}</Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration status strip */}
      <Card className="border-border/30">
        <CardContent className="p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-3">Integration Status</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Stripe', status: 'live', to: '/admin/stripe-command-centre' },
              { label: 'Metricool', status: 'live', to: '/admin/metricool-api-setup' },
              { label: 'Gmail', status: 'live', to: '/admin/api-setup' },
              { label: 'Google Sheets', status: 'live', to: '/admin/api-setup' },
              { label: 'TikTok', status: 'needs_action', to: '/admin/tiktok-review' },
              { label: 'PostHog', status: 'live', to: '/admin/api-setup' },
              { label: 'Slack', status: 'live', to: '/admin/api-setup' },
            ].map(i => (
              <Link key={i.label} to={i.to}>
                <Badge className={`text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                  i.status === 'live' ? 'bg-green-500/10 text-green-400 border-green-500/30 border' :
                  i.status === 'needs_action' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 border' :
                  'bg-red-500/10 text-red-400 border-red-500/30 border'
                }`}>
                  {i.status === 'live' ? '✓' : '⚠'} {i.label}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}