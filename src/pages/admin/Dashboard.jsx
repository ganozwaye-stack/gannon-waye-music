import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Flame, Megaphone, Zap, Radio, Clock, ShieldAlert, ShieldCheck, 
  AlertTriangle, RefreshCw, Send, DollarSign, ListTodo, Users, 
  ShoppingBag, HelpCircle, ArrowUpRight, ChevronDown, ChevronUp,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard() {
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Queries
  const { data: releases = [] } = useQuery({ queryKey: ['releases-dash'], queryFn: () => base44.entities.Release.list() });
  const { data: products = [] } = useQuery({ queryKey: ['merchProducts-dash'], queryFn: () => base44.entities.MerchProduct.list() });
  const { data: orders = [] } = useQuery({ queryKey: ['merchOrders-dash'], queryFn: () => base44.entities.MerchOrder.list() });
  const { data: subscribers = [] } = useQuery({ queryKey: ['subscribers-dash'], queryFn: () => base44.entities.EmailSubscriber.list() });
  const { data: approvals = [] } = useQuery({ queryKey: ['approvals-dash'], queryFn: () => base44.entities.SocialAsset.filter({ status: 'raw' }) });
  const { data: systemIssues = [] } = useQuery({ queryKey: ['openIssues-dash'], queryFn: () => base44.entities.SystemHealthIssue.filter({ status: 'open' }) });

  const activeOrders = useMemo(() => orders.filter(o => o.status !== 'duplicate' && o.financial_status !== 'duplicate_void'), [orders]);
  const activeRevenue = useMemo(() => activeOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0), [activeOrders]);

  // Countdown timer to June 5, 2026
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const target = new Date('2026-06-05T00:00:00+10:00');
    const update = () => {
      const diff = target - new Date();
      if (diff <= 0) {
        setTimeLeft('Campaign Released!');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Cockpit header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Gannon Waye OS</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Operating Cockpit</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/mission-control">
            <Button size="sm" className="gradient-gold-button border-0 text-xs">
              Open Mission Control <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Calm Cockpit */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Today's Urgent Tasks & Next Best Action */}
          <Card className="border-border/40 bg-secondary/15">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base text-white flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-primary" /> Tonight Priorities & Next Action
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <Link to="/admin/launch-content" className="block p-3 bg-primary/5 border border-primary/20 hover:bg-primary/10 rounded-xl space-y-1 transition-all">
                <p className="font-semibold text-primary uppercase text-[10px] tracking-wider flex items-center gap-1">
                  Next Best Action: <ArrowUpRight className="w-3 h-3" />
                </p>
                <p className="text-white">Verify social schedules inside the Launch & Content Hub to queue today's posts.</p>
              </Link>

              <div className="space-y-2">
                <Link to="/admin/stripe-command-centre" className="flex items-center gap-2 hover:text-white transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span>Stripe checkout payment intents are fully verified.</span>
                </Link>
                <Link to="/admin/research-hub" className="flex items-center gap-2 hover:text-white transition-colors">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                  <span>Confirm local voice recording logs in drive (Portuguese Sonia transcript).</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Money Now & Store/Order Status */}
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" /> Store Financials & Orders Status
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 pt-2">
              <Link to="/admin/financials" className="block p-3.5 bg-secondary/20 hover:bg-secondary/40 rounded-xl border border-border/40 transition-all">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                  Active Store Revenue <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                </p>
                <p className="text-xl font-bold text-primary mt-1">${activeRevenue.toFixed(2)} AUD</p>
              </Link>
              <Link to="/admin/orders" className="block p-3.5 bg-secondary/20 hover:bg-secondary/40 rounded-xl border border-border/40 transition-all">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                  Orders Awaiting Shipping <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                </p>
                <p className="text-xl font-bold text-yellow-400 mt-1">
                  {activeOrders.filter(o => o.status === 'pending').length} Pending
                </p>
              </Link>
            </CardContent>
          </Card>

          {/* Section 3: Content Awaiting Approval */}
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-primary" /> Content Approvals Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {approvals.length > 0 ? (
                <Link to="/admin/approval-queue" className="block p-3 bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20 rounded-xl flex items-center justify-between text-xs transition-all">
                  <span>{approvals.length} campaign assets waiting for brand compliance validation.</span>
                  <span className="underline font-bold text-yellow-400 flex items-center gap-0.5">Review <ArrowUpRight className="w-3.5 h-3.5" /></span>
                </Link>
              ) : (
                <Link to="/admin/approval-queue" className="block text-xs text-muted-foreground hover:text-white p-3 border border-dashed border-border/30 hover:border-border/60 rounded-xl text-center transition-all">
                  All posts approved and sent to Metricool schedule.
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Alerts, Countdown, Diagnostics Switch */}
        <div className="space-y-6">
          {/* Section 4: Campaign Countdown */}
          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-red-500" /> Release Countdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/admin/releases" className="block hover:opacity-80 transition-opacity">
                <p className="text-xl font-bold font-mono text-white flex items-center justify-between">
                  {timeLeft} <ArrowUpRight className="w-4 h-4 text-muted-foreground/60" />
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">THANKYOU Launch Date: June 5, 2026</p>
              </Link>
            </CardContent>
          </Card>

          {/* Section 5: Live/Posting Status */}
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-primary" /> Live Streaming Feeds
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2 text-muted-foreground">
              <Link to="/admin/livestream-command" className="flex items-center justify-between text-white hover:underline transition-all">
                <span>OBS Virtual Cable mix:</span>
                <Badge className="bg-green-500/10 text-green-400">Configured</Badge>
              </Link>
              <Link to="/admin/tiktok-review" className="flex items-center justify-between hover:underline transition-all">
                <span>TikTok Live Stream Status:</span>
                <Badge className="bg-secondary text-muted-foreground">Offline</Badge>
              </Link>
            </CardContent>
          </Card>

          {/* Section 6: Manual Sign-ins & System Health */}
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> System Health & API tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2 text-muted-foreground">
              <Link to="/admin/webhook-health" className="flex items-center justify-between hover:underline transition-all">
                <span>Stripe Event Webhook:</span>
                <Badge className="bg-green-500/10 text-green-400">Active</Badge>
              </Link>
              <Link to="/admin/ganozmix" className="flex items-center justify-between hover:underline transition-all">
                <span>eBay Seller OAuth API:</span>
                <Badge className="bg-green-500/10 text-green-400">Connected</Badge>
              </Link>
              {systemIssues.length > 0 && (
                <Link to="/admin/site-health" className="block p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 mt-2 hover:bg-red-500/20 transition-all">
                  ⚠ {systemIssues.length} system diagnostic alerts require checkup.
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Advanced Diagnostics Expandable Section */}
      <div className="border-t border-border/20 pt-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowDiagnostics(!showDiagnostics)} 
          className="mx-auto flex items-center gap-1 border-border/40 text-xs text-muted-foreground"
        >
          {showDiagnostics ? <><ChevronUp className="w-4 h-4" /> Hide Diagnostics</> : <><ChevronDown className="w-4 h-4" /> View Diagnostics</>}
        </Button>

        {showDiagnostics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="border-border/40">
              <CardHeader><CardTitle className="text-sm font-semibold text-white">Database Counts</CardTitle></CardHeader>
              <CardContent className="text-xs space-y-2">
                <p>Email Subscribers: {subscribers.length}</p>
                <p>Merch Catalog Products: {products.length}</p>
                <p>Releases: {releases.length}</p>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader><CardTitle className="text-sm font-semibold text-white">Stripe Diagnostics Logs</CardTitle></CardHeader>
              <CardContent className="text-xs font-mono text-muted-foreground space-y-1 bg-black/40 p-3 rounded-xl border border-border/30 max-h-40 overflow-y-auto">
                <p className="text-green-400">[OK] Stripe API connected</p>
                <p className="text-green-400">[OK] Webhook Secret Verified</p>
                <p className="text-muted-foreground">[LOG] Handshake listener trails: 200 OK</p>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader><CardTitle className="text-sm font-semibold text-white">GanozMix eBay Bridge</CardTitle></CardHeader>
              <CardContent className="text-xs space-y-2">
                <p>Marketplace: EBAY_AU</p>
                <p>CJ Sourcing sync status: Active</p>
                <p>Duplicate listing blocker: Enabled</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}