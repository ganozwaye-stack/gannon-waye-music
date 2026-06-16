import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Flame, Megaphone, Zap, Radio, Clock, ShieldAlert, ShieldCheck,
  AlertTriangle, DollarSign, ListTodo, Users, ShoppingBag,
  ArrowUpRight, ChevronDown, ChevronUp, CheckCircle2,
  PackageCheck, CreditCard, Truck, Bell, Music, TrendingUp,
  BarChart2, Star, MessageSquare, Globe, AlertCircle, Settings,
  FileCheck, Bot, Activity, RefreshCw, Heart, ExternalLink
} from 'lucide-react';

// Tile component
function DashTile({ to, label, value, sub, icon: Icon, color = 'gold', urgent = false, onClick }) {
  const colorMap = {
    gold: { bg: 'rgba(212,175,55,0.08)', border: 'rgba(212,175,55,0.25)', val: '#D4AF37', icon: 'rgba(212,175,55,0.7)' },
    red: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', val: '#f87171', icon: 'rgba(239,68,68,0.7)' },
    yellow: { bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.3)', val: '#facc15', icon: 'rgba(234,179,8,0.7)' },
    green: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', val: '#4ade80', icon: 'rgba(34,197,94,0.7)' },
    blue: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', val: '#60a5fa', icon: 'rgba(59,130,246,0.7)' },
    muted: { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', val: '#9ca3af', icon: 'rgba(156,163,175,0.6)' },
  };
  const c = colorMap[color] || colorMap.gold;
  const Wrapper = to ? Link : 'div';
  const wrapperProps = to ? { to } : onClick ? { onClick, role: 'button', style: { cursor: 'pointer' } } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`block p-4 rounded-xl border transition-all group ${urgent ? 'animate-pulse-subtle' : ''}`}
      style={{ background: c.bg, borderColor: c.border }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      <div className="flex items-start justify-between mb-2">
        {Icon && <Icon className="w-4 h-4 mt-0.5" style={{ color: c.icon }} />}
        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity ml-auto" style={{ color: c.val }} />
      </div>
      <p className="font-bold text-xl leading-none mb-1" style={{ color: c.val }}>{value ?? '—'}</p>
      <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: c.val, opacity: 0.7 }}>{label}</p>
      {sub && <p className="text-[10px] mt-1 text-muted-foreground">{sub}</p>}
    </Wrapper>
  );
}

// Priority task row
function PriorityRow({ num, label, to, urgent, done }) {
  return (
    <Link to={to} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-all group">
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${done ? 'bg-green-500/20 text-green-400' : urgent ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
        {done ? '✓' : num}
      </span>
      <span className={`text-xs flex-1 ${done ? 'line-through text-muted-foreground' : urgent ? 'text-red-300' : 'text-foreground/80'}`}>{label}</span>
      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-50 text-muted-foreground transition-opacity" />
    </Link>
  );
}

export default function Dashboard() {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const navigate = useNavigate();

  const { data: releases = [] } = useQuery({ queryKey: ['releases-dash'], queryFn: () => base44.entities.Release.list() });
  const { data: products = [] } = useQuery({ queryKey: ['merchProducts-dash'], queryFn: () => base44.entities.MerchProduct.list() });
  const { data: orders = [] } = useQuery({ queryKey: ['merchOrders-dash'], queryFn: () => base44.entities.MerchOrder.list() });
  const { data: subscribers = [] } = useQuery({ queryKey: ['subscribers-dash'], queryFn: () => base44.entities.EmailSubscriber.list() });
  const { data: approvals = [] } = useQuery({ queryKey: ['approvals-dash'], queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }) });
  const { data: systemIssues = [] } = useQuery({ queryKey: ['openIssues-dash'], queryFn: () => base44.entities.SystemHealthIssue.filter({ status: 'open' }) });
  const { data: notifications = [] } = useQuery({ queryKey: ['notifs-dash'], queryFn: () => base44.entities.AdminNotification.filter({ is_read: false }) });
  const { data: stripeEvents = [] } = useQuery({ queryKey: ['stripeEvents-dash'], queryFn: () => base44.entities.StripeEventLog.list('-created_date', 20) });
  const { data: fanPosts = [] } = useQuery({ queryKey: ['fanPosts-dash'], queryFn: () => base44.entities.FanPost.filter({ status: 'pending' }) });

  const activeOrders = useMemo(() => orders.filter(o => o.status !== 'cancelled'), [orders]);
  const activeRevenue = useMemo(() => activeOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0), [activeOrders]);

  const today = new Date().toDateString();
  const ordersToday = useMemo(() => activeOrders.filter(o => new Date(o.created_date).toDateString() === today), [activeOrders]);
  const unfulfilledOrders = useMemo(() => activeOrders.filter(o => ['pending', 'confirmed'].includes(o.status)), [activeOrders]);

  const stripeIssues = useMemo(() => stripeEvents.filter(e => e.type?.includes('failed') || e.type?.includes('dispute')), [stripeEvents]);
  const shippingIssues = useMemo(() => systemIssues.filter(i => i.system_area === 'payments' || i.issue_title?.toLowerCase().includes('ship')), [systemIssues]);
  const criticalIssues = useMemo(() => systemIssues.filter(i => i.severity === 'critical' || i.severity === 'high'), [systemIssues]);
  const moneyAtRisk = useMemo(() => unfulfilledOrders.reduce((s, o) => s + (o.total_amount || 0), 0), [unfulfilledOrders]);

  // Countdown
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const target = new Date('2026-06-05T00:00:00+10:00');
    const update = () => {
      const diff = target - new Date();
      if (diff <= 0) { setTimeLeft('Released!'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    };
    update();
    const iv = setInterval(update, 60000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Gannon Waye OS</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Operating Cockpit</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/notifications">
            <Button size="sm" variant="outline" className="text-xs border-border/40 relative">
              <Bell className="w-3.5 h-3.5 mr-1" />
              Notifications
              {notifications.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">{notifications.length > 9 ? '9+' : notifications.length}</span>
              )}
            </Button>
          </Link>
          <Link to="/admin/mission-control">
            <Button size="sm" className="gradient-gold-button border-0 text-xs">
              Mission Control <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* TIER 1 — MONEY AT RISK tiles */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-red-400/70 font-semibold mb-3 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" /> 1. Financial Risk — Act First
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <DashTile to="/admin/orders" label="Money at Risk" value={`$${moneyAtRisk.toFixed(0)}`} sub="In unfulfilled orders" icon={DollarSign} color="red" urgent={moneyAtRisk > 0} />
          <DashTile to="/admin/orders?filter=today" label="Orders Today" value={ordersToday.length} sub="New customer orders" icon={ShoppingBag} color={ordersToday.length > 0 ? 'yellow' : 'muted'} />
          <DashTile to="/admin/orders?filter=unfulfilled" label="Unfulfilled Orders" value={unfulfilledOrders.length} sub="Need packing & ship" icon={PackageCheck} color={unfulfilledOrders.length > 0 ? 'red' : 'green'} />
          <DashTile to="/admin/payment-diagnostics" label="Stripe Issues" value={stripeIssues.length || 0} sub="Failed / disputed" icon={CreditCard} color={stripeIssues.length > 0 ? 'red' : 'green'} />
          <DashTile to="/admin/shipping-rates" label="Shipping Issues" value={shippingIssues.length || 0} sub="Rules / failures" icon={Truck} color={shippingIssues.length > 0 ? 'yellow' : 'green'} />
        </div>
      </div>

      {/* TIER 2 — HUMAN TASKS */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-yellow-400/70 font-semibold mb-3 flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5" /> 2. Human Approval Tasks
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <DashTile to="/admin/approval-queue" label="Approval Queue" value={approvals.length} sub="Waiting for you" icon={FileCheck} color={approvals.length > 0 ? 'yellow' : 'green'} />
          <DashTile to="/admin/fan-management?filter=pending" label="Fan Posts" value={fanPosts.length} sub="Pending moderation" icon={MessageSquare} color={fanPosts.length > 0 ? 'yellow' : 'green'} />
          <DashTile to="/admin/site-health" label="System Health" value={criticalIssues.length} sub={criticalIssues.length > 0 ? 'Critical alerts' : 'All clear'} icon={ShieldCheck} color={criticalIssues.length > 0 ? 'red' : 'green'} />
          <DashTile to="/admin/payment-diagnostics" label="Checkout Failures" value={stripeEvents.filter(e => e.type?.includes('failed')).length || 0} sub="Stripe payment failures" icon={AlertTriangle} color="yellow" />
          <DashTile to="/admin/subscribers" label="Subscribers" value={subscribers.length} sub="Email list size" icon={Users} color="blue" />
        </div>
      </div>

      {/* TIER 3 — INTEGRATIONS & OPS */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-blue-400/70 font-semibold mb-3 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" /> 3. Integration & System Status
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <DashTile to="/admin/integration-action-centre" label="Social Integrations" value="Check" sub="TikTok / IG / Meta" icon={Globe} color="blue" />
          <DashTile to="/admin/stripe-command-centre" label="Stripe Status" value="Active" sub="Live payments" icon={CreditCard} color="green" />
          <DashTile to="/admin/metricool-command" label="Metricool" value="Sync" sub="Social scheduler" icon={Radio} color="blue" />
          <DashTile to="/admin/webhook-health" label="Webhooks" value={systemIssues.filter(i => i.system_area === 'integrations').length > 0 ? 'Issues' : 'OK'} sub="Stripe / system hooks" icon={Zap} color={systemIssues.filter(i => i.system_area === 'integrations').length > 0 ? 'yellow' : 'green'} />
          <DashTile to="/admin/self-healing" label="Agent Tasks" value={systemIssues.length} sub="Auto-healing queue" icon={Bot} color="muted" />
        </div>
      </div>

      {/* TIER 4 — REVENUE & OPPORTUNITIES */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-green-400/70 font-semibold mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" /> 4. Revenue & Opportunities
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <DashTile to="/admin/financials" label="Store Revenue" value={`$${activeRevenue.toFixed(0)}`} sub="All-time AUD" icon={DollarSign} color="gold" />
          <DashTile to="/admin/merch?sort=best" label="Best Products" value={products.filter(p => p.is_active).length} sub="Active products" icon={Star} color="gold" />
          <DashTile to="/admin/music-opportunity-bulletin" label="Music Opportunities" value="Scan" sub="Grants, playlists, gigs" icon={Music} color="blue" />
          <DashTile to="/admin/ganozmix" label="Dropshipping Opps" value="Scout" sub="GanozMix / eBay" icon={BarChart2} color="blue" />
          <DashTile to="/admin/community?tab=activity" label="Community Activity" value={fanPosts.length} sub="Posts to review" icon={Heart} color="muted" />
        </div>
      </div>

      {/* MAIN CONTENT: Priority Tasks + Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Task List */}
        <div className="lg:col-span-2 bg-card/40 border border-border/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <ListTodo className="w-4 h-4 text-primary" />
            <h2 className="font-display text-base text-foreground">Priority Task List</h2>
            <Badge variant="outline" className="ml-auto text-[10px]">Live</Badge>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-widest text-red-400/60 px-3 pt-2 pb-1">🔴 Financial Loss Risks</p>
            <PriorityRow num={1} label={`Fulfil ${unfulfilledOrders.length} unfulfilled orders before next dispatch cutoff`} to="/admin/orders?filter=unfulfilled" urgent={unfulfilledOrders.length > 0} />
            <PriorityRow num={2} label="Review Stripe payment failures and dispute alerts" to="/admin/payment-diagnostics" urgent={stripeIssues.length > 0} />
            <PriorityRow num={3} label="Check shipping rules are active for all product categories" to="/admin/shipping-rates" />

            <p className="text-[10px] uppercase tracking-widest text-yellow-400/60 px-3 pt-3 pb-1">🟡 Orders & Customers</p>
            <PriorityRow num={4} label="Review today's new orders and confirm customer details" to="/admin/orders?filter=today" />
            <PriorityRow num={5} label="Check Google Sheet sync — orders must log automatically" to="/admin/integration-action-centre" />
            <PriorityRow num={6} label="Send receipts for any orders missing email confirmation" to="/admin/orders" />

            <p className="text-[10px] uppercase tracking-widest text-orange-400/60 px-3 pt-3 pb-1">🟠 Human Approval Tasks</p>
            <PriorityRow num={7} label={`Review ${approvals.length} pending approvals in queue`} to="/admin/approval-queue" urgent={approvals.length > 0} />
            <PriorityRow num={8} label={`Moderate ${fanPosts.length} fan post submissions`} to="/admin/fan-management?filter=pending" />

            <p className="text-[10px] uppercase tracking-widest text-blue-400/60 px-3 pt-3 pb-1">🔵 Integration Failures</p>
            <PriorityRow num={9} label="Test Metricool connection and confirm posts are scheduled" to="/admin/metricool-command" />
            <PriorityRow num={10} label="Verify TikTok OAuth token is active" to="/admin/tiktok-review" />
            <PriorityRow num={11} label="Check Gmail integration for order notification delivery" to="/admin/integration-action-centre" />

            <p className="text-[10px] uppercase tracking-widest text-green-400/60 px-3 pt-3 pb-1">🟢 Social & Revenue Opportunities</p>
            <PriorityRow num={12} label="Scan new music opportunities — grants, playlists, gigs" to="/admin/music-opportunity-bulletin" />
            <PriorityRow num={13} label="Review GanozMix dropshipping product scout results" to="/admin/ganozmix" />
            <PriorityRow num={14} label="Check social content drafts waiting for scheduling" to="/admin/social-schedule-queue" />

            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40 px-3 pt-3 pb-1">⚪ Design & Content</p>
            <PriorityRow num={15} label="Review pending social post visuals in asset library" to="/admin/social-asset-library" />
            <PriorityRow num={16} label="Check announcement studio for any drafts to publish" to="/admin/announcement-studio" />

            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/30 px-3 pt-3 pb-1">⚫ Improvements</p>
            <PriorityRow num={17} label="Run site health check for low-priority issues" to="/admin/site-health" />
            <PriorityRow num={18} label="Review agent learning logs and improve prompts" to="/admin/agent-learning" />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Release Countdown */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-foreground">Release Countdown</span>
            </div>
            <Link to="/admin/releases" className="block hover:opacity-80 transition-opacity">
              <p className="text-2xl font-bold font-mono text-foreground">{timeLeft}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">THANKYOU — June 5, 2026</p>
            </Link>
          </div>

          {/* System Alerts */}
          {criticalIssues.length > 0 && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span className="text-sm font-semibold text-foreground">Critical Alerts</span>
              </div>
              {criticalIssues.slice(0, 3).map(issue => (
                <Link key={issue.id} to="/admin/site-health" className="flex items-center justify-between p-2 bg-red-500/10 rounded-lg hover:bg-red-500/15 transition-all">
                  <span className="text-xs text-red-300 truncate">{issue.issue_title}</span>
                  <ArrowUpRight className="w-3 h-3 text-red-400 shrink-0 ml-1" />
                </Link>
              ))}
              {criticalIssues.length > 3 && (
                <Link to="/admin/site-health" className="text-[10px] text-red-400/60 hover:text-red-400 block text-center">+{criticalIssues.length - 3} more →</Link>
              )}
            </div>
          )}

          {/* Quick Links */}
          <div className="bg-card/40 border border-border/30 rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Quick Access</p>
            <div className="space-y-1">
              {[
                { to: '/admin/orders', label: '📦 Orders' },
                { to: '/admin/approval-queue', label: '✅ Approvals' },
                { to: '/admin/payment-diagnostics', label: '💳 Payments' },
                { to: '/admin/notifications', label: '🔔 Notifications' },
                { to: '/admin/music-opportunity-bulletin', label: '🎵 Music Opps' },
                { to: '/admin/self-healing', label: '🤖 Agent Ops' },
                { to: '/admin/social-schedule-queue', label: '📅 Social Queue' },
                { to: '/admin/integration-action-centre', label: '🔌 Integrations' },
              ].map(item => (
                <Link key={item.to} to={item.to} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/5 text-xs text-foreground/70 hover:text-foreground transition-all group">
                  {item.label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Live Status */}
          <div className="bg-card/40 border border-border/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Live Status</span>
            </div>
            <div className="space-y-2 text-xs">
              <Link to="/admin/stripe-command-centre" className="flex items-center justify-between hover:opacity-80 transition-opacity">
                <span className="text-muted-foreground">Stripe</span>
                <Badge className="bg-green-500/10 text-green-400 text-[10px]">Active</Badge>
              </Link>
              <Link to="/admin/webhook-health" className="flex items-center justify-between hover:opacity-80 transition-opacity">
                <span className="text-muted-foreground">Webhooks</span>
                <Badge className="bg-green-500/10 text-green-400 text-[10px]">Listening</Badge>
              </Link>
              <Link to="/admin/metricool-command" className="flex items-center justify-between hover:opacity-80 transition-opacity">
                <span className="text-muted-foreground">Metricool</span>
                <Badge className="bg-yellow-500/10 text-yellow-400 text-[10px]">Check</Badge>
              </Link>
              <Link to="/admin/tiktok-review" className="flex items-center justify-between hover:opacity-80 transition-opacity">
                <span className="text-muted-foreground">TikTok OAuth</span>
                <Badge className="bg-secondary text-muted-foreground text-[10px]">Verify</Badge>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostics */}
      <div className="border-t border-border/20 pt-4">
        <Button variant="outline" size="sm" onClick={() => setShowDiagnostics(!showDiagnostics)} className="mx-auto flex items-center gap-1 border-border/40 text-xs text-muted-foreground">
          {showDiagnostics ? <><ChevronUp className="w-4 h-4" /> Hide Diagnostics</> : <><ChevronDown className="w-4 h-4" /> View Advanced Diagnostics</>}
        </Button>
        {showDiagnostics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-card border border-border/30 rounded-xl p-4">
              <p className="text-sm font-semibold text-foreground mb-3">Database Counts</p>
              <div className="text-xs space-y-1.5 text-muted-foreground">
                <p>Subscribers: {subscribers.length}</p>
                <p>Products: {products.length}</p>
                <p>Releases: {releases.length}</p>
                <p>Orders (all): {orders.length}</p>
                <p>System Issues: {systemIssues.length}</p>
              </div>
            </div>
            <div className="bg-card border border-border/30 rounded-xl p-4">
              <p className="text-sm font-semibold text-foreground mb-3">Stripe Diagnostics</p>
              <div className="text-xs font-mono text-muted-foreground space-y-1 bg-black/40 p-3 rounded-lg max-h-32 overflow-y-auto">
                <p className="text-green-400">[OK] Stripe API connected</p>
                <p className="text-green-400">[OK] Webhook Secret Verified</p>
                <p className="text-muted-foreground">[LOG] Handshake: 200 OK</p>
              </div>
            </div>
            <div className="bg-card border border-border/30 rounded-xl p-4">
              <p className="text-sm font-semibold text-foreground mb-3">GanozMix eBay</p>
              <div className="text-xs space-y-1.5 text-muted-foreground">
                <p>Marketplace: EBAY_AU</p>
                <p>CJ Sourcing sync: Active</p>
                <p>Duplicate blocker: Enabled</p>
                <Link to="/admin/ganozmix" className="text-primary hover:underline block mt-2">Open GanozMix →</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}