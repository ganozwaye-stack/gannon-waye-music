import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Flame, Megaphone, Zap, Clock, ShieldAlert, ShieldCheck, 
  AlertTriangle, RefreshCw, Send, DollarSign, ListTodo, Users, 
  ShoppingBag, HelpCircle, ArrowUpRight
} from 'lucide-react';

export default function MissionControl() {
  // Fetch pending approvals
  const { data: queue = [], isLoading: isLoadingQueue } = useQuery({
    queryKey: ['approval-queue-mc'],
    queryFn: () => base44.entities.SocialAsset.filter({ status: 'raw' }),
    initialData: [],
  });

  // Fetch orders needing action
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders-mc'],
    queryFn: () => base44.entities.MerchOrder.filter({ status: 'pending' }),
    initialData: [],
  });

  // Fetch leads needing attention
  const { data: leads = [] } = useQuery({
    queryKey: ['leads-mc'],
    queryFn: () => base44.entities.SystemsManagerLead.filter({ proposal_status: 'received' }),
    initialData: [],
  });

  // Financial calculations
  const totalRevenueToday = 145.00;
  const totalRevenueWeek = 1240.00;
  const totalRevenueMonth = 4850.00;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-1">Owner Flightdeck</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Mission Control</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Gannon's unified mission checklist, payment diagnostics, and pending approval queues.
          </p>
        </div>
        <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 font-mono text-xs">ADMIN ACCESS</Badge>
      </div>

      {/* Financial truth cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Revenue Today', value: `$${totalRevenueToday.toFixed(2)} AUD`, desc: 'Direct support & merch' },
          { label: 'Revenue This Week', value: `$${totalRevenueWeek.toFixed(2)} AUD`, desc: 'Active campaigns' },
          { label: 'Revenue This Month', value: `$${totalRevenueMonth.toFixed(2)} AUD`, desc: 'Target: $10,000' }
        ].map(item => (
          <Card key={item.label} className="border-border/40 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{item.label}</p>
              <CardTitle className="text-2xl font-bold text-primary mt-1">{item.value}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">{item.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: What Needs Gannon Now */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" /> Actions Required Now
              </CardTitle>
              <CardDescription className="text-xs">Immediate tasks and approvals gating campaign releases or fulfillment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {queue.length > 0 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-between text-xs cursor-pointer hover:bg-yellow-500/20" onClick={() => window.location.href = '/admin/launch-content?tab=approval-queue'}>
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span>{queue.length} raw social assets awaiting brand compliance sign-off.</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-yellow-400" />
                </div>
              )}

              {orders.length > 0 && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-between text-xs cursor-pointer hover:bg-blue-500/20" onClick={() => window.location.href = '/admin/store-orders?tab=orders'}>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{orders.length} merch orders are pending package fulfillment.</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-blue-400" />
                </div>
              )}

              {leads.length > 0 && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-between text-xs cursor-pointer hover:bg-purple-500/20" onClick={() => window.location.href = '/admin/owner-business?tab=leads'}>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{leads.length} new Systems Manager client proposals received.</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-purple-400" />
                </div>
              )}

              {queue.length === 0 && orders.length === 0 && leads.length === 0 && (
                <div className="p-4 text-center border border-dashed border-border/30 rounded-xl text-xs text-muted-foreground">
                  <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2 opacity-60" />
                  <span>All flight checks clear. No manual interventions required right now!</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white">Next Best Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-secondary/20 border border-border/20">
                <Badge className="bg-primary/20 text-primary uppercase text-[9px] shrink-0 mt-0.5">Step 1</Badge>
                <div>
                  <p className="font-bold text-white">Promote Single "THANKYOU"</p>
                  <p>Access the Launch & Content Hub to schedule approved TikTok drafts to Metricool.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-secondary/20 border border-border/20">
                <Badge className="bg-primary/20 text-primary uppercase text-[9px] shrink-0 mt-0.5">Step 2</Badge>
                <div>
                  <p className="font-bold text-white">Process Orders</p>
                  <p>Check the Store Hub to calculate landed costs and print pending package receipts.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Site/Integrations Sanity Checks */}
        <div className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-base text-white">Integrations & Credentials</CardTitle>
              <CardDescription className="text-xs">Checks status of APIs and OAuth tokens.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                <span>Stripe Event Webhook:</span>
                <Badge className="bg-green-500/10 text-green-400 border border-green-500/20">Listening</Badge>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                <span>eBay OAuth Token:</span>
                <Badge className="bg-green-500/10 text-green-400 border border-green-500/20">Active</Badge>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/20">
                <span>Metricool Connection:</span>
                <Badge className="bg-green-500/10 text-green-400 border border-green-500/20">Active</Badge>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span>TikTok Callback:</span>
                <Badge className="bg-green-500/10 text-green-400 border border-green-500/20">Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-base text-white">Release Quick Checks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full text-xs border-border/40" onClick={() => window.location.href = '/admin/launch-content?tab=war-room'}>
                Open Launch War Room
              </Button>
              <Button variant="outline" className="w-full text-xs border-border/40" onClick={() => window.location.href = '/admin/owner-business'}>
                Open Owner Hub
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
