import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import {
  DollarSign, ArrowLeft, TrendingUp, Star, Building2, Music,
  Users, Package, Zap, ChevronRight, ArrowUpRight, Activity, Shield
} from 'lucide-react';

const INCOME_STREAMS = [
  { name: 'Merch Sales', status: 'live', monthly_est: '$200-800', category: 'Commerce', route: '/admin/orders', maturity: 'active' },
  { name: 'Music Streaming Royalties', status: 'live', monthly_est: '$50-300', category: 'Music', route: '/admin/music-command', maturity: 'active' },
  { name: 'Digital Downloads', status: 'live', monthly_est: '$20-100', category: 'Music', route: '/admin/music-command', maturity: 'active' },
  { name: 'Fan Support (Back This)', status: 'live', monthly_est: '$100-500', category: 'Community', route: '/admin/supporters', maturity: 'active' },
  { name: 'Live Performance', status: 'pipeline', monthly_est: '$500-5,000 per gig', category: 'Bookings', route: '/admin/mastering', maturity: 'pipeline' },
  { name: 'Sync Licensing', status: 'pipeline', monthly_est: '$500-10,000 per placement', category: 'Music', route: '/admin/sync-licensing-command', maturity: 'high_potential' },
  { name: 'YouTube AdSense', status: 'pipeline', monthly_est: '$20-200', category: 'Social', route: '/admin/videos', maturity: 'pipeline' },
  { name: 'TikTok Creator Fund', status: 'blocked', monthly_est: '$10-100', category: 'Social', route: '/tiktok-platform-review', maturity: 'blocked' },
  { name: 'Email List Monetisation', status: 'pipeline', monthly_est: '$100-2,000 per campaign', category: 'Community', route: '/admin/subscribers', maturity: 'pipeline' },
  { name: 'Artist Management Services', status: 'staging', monthly_est: '$2,000-10,000/month', category: 'Business', route: '/admin/artist-business-setup', maturity: 'staging' },
  { name: 'Life Coaching / Mindset', status: 'staging', monthly_est: '$3,000-15,000/month', category: 'Coaching', route: '/admin/coaching-command', maturity: 'staging' },
  { name: 'Music Production Sessions', status: 'pipeline', monthly_est: '$200-1,000 per session', category: 'Music', route: '/admin/sync-licensing-command', maturity: 'pipeline' },
  { name: 'Merchandise Licensing', status: 'idea', monthly_est: 'Unknown', category: 'Commerce', route: '/admin/merch', maturity: 'idea' },
  { name: 'Partnership / Brand Deals', status: 'idea', monthly_est: '$500-10,000 per deal', category: 'Business', route: '/admin/marketing-centre', maturity: 'idea' },
  { name: 'Affiliate / Referral Income', status: 'idea', monthly_est: '$50-500', category: 'Commerce', route: '/admin/revenue-actions', maturity: 'idea' },
];

const ASSET_VALUATIONS = [
  { asset: 'Email Subscriber List', value_driver: 'Size × $1-5 per subscriber/month potential', importance: 'high' },
  { asset: 'Song Catalogue (Publishing Rights)', value_driver: 'Each song = potential recurring sync/streaming royalties. Lifetime asset.', importance: 'critical' },
  { asset: 'Social Media Audience', value_driver: 'TikTok + Instagram followers × engagement rate = brand/deal leverage', importance: 'high' },
  { asset: 'Merch Brand Recognition', value_driver: 'Repeat buyers + brand loyalty = predictable revenue floor', importance: 'medium' },
  { asset: 'Booking History / Reputation', value_driver: 'Live performance track record = agent leverage', importance: 'medium' },
  { asset: 'Master Recordings', value_driver: 'Licensing potential — streaming, sync, TV, film', importance: 'critical' },
  { asset: 'Website + Domain (gannonwaye.com)', value_driver: 'Direct-to-fan revenue channel — no algorithm dependency', importance: 'high' },
  { asset: 'Fan Community (Superfan Base)', value_driver: 'Superfans × average spend = predictable high-LTV revenue', importance: 'critical' },
];

const STATUS_COLOR = {
  live: 'bg-green-500/20 text-green-400',
  pipeline: 'bg-blue-500/20 text-blue-400',
  staging: 'bg-yellow-500/20 text-yellow-400',
  blocked: 'bg-red-500/20 text-red-400',
  idea: 'bg-slate-500/20 text-slate-400',
};

export default function BusinessWorthCommand() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('income_streams');

  const { data: orders = [] } = useQuery({
    queryKey: ['bwc-orders'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 200),
  });
  const { data: subscribers = [] } = useQuery({
    queryKey: ['bwc-subs'],
    queryFn: () => base44.entities.EmailSubscriber.list(),
  });
  const { data: supporters = [] } = useQuery({
    queryKey: ['bwc-supporters'],
    queryFn: () => base44.entities.SupporterProfile.list(),
  });

  const activeOrders = orders.filter(o => !['cancelled','refunded','deleted'].includes(o.status));
  const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const liveStreams = INCOME_STREAMS.filter(s => s.status === 'live');
  const stagingStreams = INCOME_STREAMS.filter(s => s.status === 'staging');
  const pipelineStreams = INCOME_STREAMS.filter(s => s.status === 'pipeline');

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary/40 rounded transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Business Worth Command</h1>
          <p className="text-muted-foreground text-sm">Every income stream, asset, and value driver — live, pipeline, and staging</p>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-primary/30">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-primary">${totalRevenue.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Total Revenue (All Time)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-400">{liveStreams.length}</p>
            <p className="text-xs text-muted-foreground">Live Income Streams</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-400">{subscribers.length}</p>
            <p className="text-xs text-muted-foreground">Email Subscribers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-yellow-400">{stagingStreams.length}</p>
            <p className="text-xs text-muted-foreground">Staging (Not Yet Live)</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="income_streams">Income Streams ({INCOME_STREAMS.length})</TabsTrigger>
          <TabsTrigger value="assets">Assets & Value</TabsTrigger>
          <TabsTrigger value="ranking">Revenue Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="income_streams" className="mt-4 space-y-3">
          {INCOME_STREAMS.map(stream => (
            <Link key={stream.name} to={stream.route}>
              <div className="border border-border rounded-xl p-4 hover:border-primary/40 hover:bg-secondary/10 transition-all group">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs ${STATUS_COLOR[stream.status]}`}>{stream.status}</Badge>
                      <Badge className="text-xs bg-secondary text-secondary-foreground">{stream.category}</Badge>
                    </div>
                    <p className="font-semibold text-sm">{stream.name}</p>
                    <p className="text-xs text-green-400 mt-0.5">Est. {stream.monthly_est}/month</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </TabsContent>

        <TabsContent value="assets" className="mt-4 space-y-3">
          {ASSET_VALUATIONS.map(asset => (
            <div key={asset.asset} className={`border rounded-xl p-4 ${asset.importance === 'critical' ? 'border-primary/30' : 'border-border'}`}>
              <div className="flex items-start gap-3">
                <Star className={`w-4 h-4 shrink-0 mt-0.5 ${asset.importance === 'critical' ? 'text-primary' : asset.importance === 'high' ? 'text-yellow-400' : 'text-muted-foreground'}`} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{asset.asset}</p>
                    <Badge className={`text-xs ${asset.importance === 'critical' ? 'bg-primary/20 text-primary' : asset.importance === 'high' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-secondary text-secondary-foreground'}`}>
                      {asset.importance}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{asset.value_driver}</p>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="ranking" className="mt-4 space-y-3">
          <p className="text-xs text-muted-foreground mb-2">Ranked by potential monthly value — highest to lowest</p>
          {[...INCOME_STREAMS]
            .sort((a, b) => {
              const priority = { live: 0, staging: 1, pipeline: 2, blocked: 3, idea: 4 };
              return (priority[a.status] || 5) - (priority[b.status] || 5);
            })
            .map((stream, i) => (
              <Link key={stream.name} to={stream.route}>
                <div className="border border-border rounded-xl p-4 hover:border-primary/40 hover:bg-secondary/10 transition-all group flex items-center gap-4">
                  <span className="text-2xl font-bold text-muted-foreground/30 w-8 shrink-0">#{i+1}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge className={`text-xs ${STATUS_COLOR[stream.status]}`}>{stream.status}</Badge>
                      <p className="font-semibold text-sm">{stream.name}</p>
                    </div>
                    <p className="text-xs text-green-400">{stream.monthly_est}/month potential</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Intelligence to Income', route: '/admin/intelligence-to-income' },
          { label: 'Weekly Money Report', route: '/admin/weekly-money-report' },
          { label: 'Financial Dashboard', route: '/admin/financials' },
          { label: 'Sync Licensing', route: '/admin/sync-licensing-command' },
          { label: 'Artist Business Setup', route: '/admin/artist-business-setup' },
          { label: 'Order Profit Intelligence', route: '/admin/order-profit-intelligence' },
        ].map(l => (
          <Link key={l.route} to={l.route}>
            <Card className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <p className="font-semibold text-sm">{l.label}</p>
                <ArrowUpRight className="w-3 h-3 text-muted-foreground mt-1" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}