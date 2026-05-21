import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Users, Music, Mic, Radio, Handshake, Mail, ShoppingBag, Star, ExternalLink } from 'lucide-react';

const AGENTS = [
  { name: 'revenue_orchestrator', label: 'Revenue Orchestrator', icon: Star, color: 'text-yellow-400', desc: 'Master coordinator — daily action list' },
  { name: 'merch_sales_agent', label: 'Merch Sales', icon: ShoppingBag, color: 'text-blue-400', desc: 'Flash sales, stock alerts, bundles' },
  { name: 'pricing_optimiser', label: 'Pricing Optimiser', icon: DollarSign, color: 'text-green-400', desc: 'Margin analysis, price recommendations' },
  { name: 'superfan_converter', label: 'Superfan Converter', icon: Users, color: 'text-pink-400', desc: 'Turns fans into buyers' },
  { name: 'email_revenue_agent', label: 'Email Revenue', icon: Mail, color: 'text-purple-400', desc: 'Campaigns, upsells, win-backs' },
  { name: 'content_revenue_agent', label: 'Content → Cash', icon: TrendingUp, color: 'text-orange-400', desc: 'Viral content with purchase CTAs' },
  { name: 'booking_revenue_agent', label: 'Bookings', icon: Mic, color: 'text-red-400', desc: 'Gigs, venues, corporate events' },
  { name: 'sync_licensing_agent', label: 'Sync Licensing', icon: Music, color: 'text-cyan-400', desc: 'Film/TV/ad placements, royalties' },
  { name: 'partnership_agent', label: 'Partnerships', icon: Handshake, color: 'text-teal-400', desc: 'Brand deals, sponsorships' },
  { name: 'streaming_royalty_agent', label: 'Streaming Royalties', icon: Radio, color: 'text-indigo-400', desc: 'Playlist pitching, Spotify growth' },
];

export default function RevenueCommandCentre() {
  const [activeAgent, setActiveAgent] = useState(null);

  const { data: opportunities = [] } = useQuery({
    queryKey: ['revenue_opportunities'],
    queryFn: () => base44.entities.RevenueOpportunity.list('-created_date', 50),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['revenue_notifications'],
    queryFn: () => base44.entities.AdminNotification.filter({ is_read: false }, '-created_date', 20),
  });

  const newOpps = opportunities.filter(o => o.status === 'new').length;
  const reviewingOpps = opportunities.filter(o => o.status === 'reviewing').length;
  const inProgressOpps = opportunities.filter(o => o.status === 'in_progress').length;
  const liveOpps = opportunities.filter(o => o.status === 'live').length;

  const topOpps = opportunities.filter(o => o.status === 'new' || o.status === 'reviewing').slice(0, 5);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Revenue Command Centre</h1>
        <p className="text-muted-foreground text-sm mt-1">10 agents working 24/7 to put money in your pocket</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'New Opportunities', value: newOpps, color: 'text-yellow-400' },
          { label: 'Being Reviewed', value: reviewingOpps, color: 'text-blue-400' },
          { label: 'In Progress', value: inProgressOpps, color: 'text-green-400' },
          { label: 'Live & Earning', value: liveOpps, color: 'text-primary' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Actions Today */}
      {topOpps.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Star className="w-4 h-4" /> Today's Top Revenue Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topOpps.map((opp, i) => (
              <div key={opp.id} className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
                <span className="text-xl font-bold text-primary/50 w-6 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold">{opp.opportunity_name}</p>
                    <Badge variant="outline" className="text-xs">{opp.revenue_type}</Badge>
                    {opp.estimated_value && <Badge className="bg-green-500/10 text-green-400 text-xs">{opp.estimated_value}</Badge>}
                  </div>
                  {opp.recommended_next_step && <p className="text-xs text-muted-foreground mt-1">{opp.recommended_next_step}</p>}
                </div>
                <Button size="sm" variant="outline" className="shrink-0 text-xs" onClick={() => base44.entities.RevenueOpportunity.update(opp.id, { status: 'in_progress' })}>
                  Action
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Agent Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Your 10 Revenue Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AGENTS.map(agent => {
            const Icon = agent.icon;
            const agentOpps = opportunities.filter(o => o.source_agent === agent.name);
            return (
              <Card key={agent.name} className="hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setActiveAgent(activeAgent === agent.name ? null : agent.name)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Icon className={`w-5 h-5 ${agent.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{agent.label}</p>
                        {agentOpps.length > 0 && <Badge className="bg-primary/10 text-primary text-xs">{agentOpps.length} opps</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{agent.desc}</p>
                    </div>
                    <a href={`https://app.base44.com`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                      <Button size="sm" variant="ghost" className="text-xs gap-1">
                        Chat <ExternalLink className="w-3 h-3" />
                      </Button>
                    </a>
                  </div>

                  {activeAgent === agent.name && agentOpps.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-border pt-3">
                      {agentOpps.slice(0, 3).map(opp => (
                        <div key={opp.id} className="text-xs p-2 bg-secondary rounded flex items-center justify-between gap-2">
                          <span className="truncate">{opp.opportunity_name}</span>
                          {opp.estimated_value && <span className="text-green-400 shrink-0">{opp.estimated_value}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* All Opportunities */}
      {opportunities.length > 0 && (
        <Card>
          <CardHeader><CardTitle>All Revenue Opportunities ({opportunities.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {opportunities.map(opp => (
              <div key={opp.id} className="flex items-center gap-3 p-2 rounded border border-border text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{opp.opportunity_name}</p>
                  <p className="text-xs text-muted-foreground">{opp.source_agent} · {opp.revenue_type}</p>
                </div>
                {opp.estimated_value && <span className="text-green-400 text-xs shrink-0">{opp.estimated_value}</span>}
                <Badge variant="outline" className="text-xs shrink-0">{opp.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {opportunities.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <DollarSign className="w-12 h-12 text-primary/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Agents are warming up. Chat with any agent above to kick off revenue research.</p>
            <p className="text-xs text-muted-foreground mt-2">Start with <strong>Revenue Orchestrator</strong> — say "Find me money today"</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}