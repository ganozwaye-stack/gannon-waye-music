import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Music, TrendingUp, Users, Bell, CheckCircle2, Clock, AlertTriangle, 
  Play, Star, Zap, Calendar, DollarSign, Heart, Radio, Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RELEASE_DATE = new Date('2026-06-05T00:00:00+10:00');

function CountdownBadge() {
  const now = new Date();
  const days = Math.max(0, Math.ceil((RELEASE_DATE - now) / (1000 * 60 * 60 * 24)));
  const urgent = days <= 14;
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-body font-semibold ${urgent ? 'border-yellow-500/60 bg-yellow-500/10 text-yellow-400' : 'border-primary/40 bg-primary/10 text-primary'}`}>
      <Calendar className="w-4 h-4" />
      <span>{days} days until "Thank You" releases — June 5, 2026</span>
      {urgent && <span className="animate-pulse">⚡</span>}
    </div>
  );
}

const AGENTS = [
  { name: 'Music Orchestrator', icon: Zap, color: 'text-yellow-400', desc: 'Master coordinator — daily top action', path: '/admin/orchestrator-chat' },
  { name: 'Release Launch Agent', icon: Play, color: 'text-green-400', desc: 'Thankyou single launch plan', path: '/admin/command-centre' },
  { name: 'Fan Engagement', icon: Heart, color: 'text-pink-400', desc: 'Community health & superfans', path: '/admin/fans' },
  { name: 'Revenue Orchestrator', icon: DollarSign, color: 'text-emerald-400', desc: 'Daily money opportunities', path: '/admin/revenue-command' },
  { name: 'Merch Sales Agent', icon: Star, color: 'text-orange-400', desc: 'Flash sales, bundles, stock', path: '/admin/merch' },
  { name: 'Social Intelligence', icon: TrendingUp, color: 'text-blue-400', desc: 'Viral trends & creator gaps', path: '/admin/social-intelligence' },
  { name: 'Growth Engine', icon: Radio, color: 'text-purple-400', desc: 'Audience & playlist growth', path: '/admin/growth-engine' },
  { name: 'Content Automate', icon: Share2, color: 'text-cyan-400', desc: 'Social post automation', path: '/admin/content-automate' },
  { name: 'Release Sprint', icon: Calendar, color: 'text-yellow-400', desc: '10-day Metricool content engine', path: '/admin/release-sprint' },
];

export default function MusicCommandCentre() {
  const qc = useQueryClient();
  const [generating, setGenerating] = useState(false);

  const { data: notifications = [] } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: () => base44.entities.AdminNotification.filter({ is_read: false }, '-created_date', 20),
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ['pendingApprovals'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 10),
  });

  const { data: opportunities = [] } = useQuery({
    queryKey: ['growthOpps'],
    queryFn: () => base44.entities.GrowthOpportunity.filter({ status: 'new' }, '-created_date', 10),
  });

  const { data: memories = [] } = useQuery({
    queryKey: ['musicMemory'],
    queryFn: () => base44.entities.MusicAgentMemory.list('-created_date', 5),
  });

  const { data: subscribers = [] } = useQuery({
    queryKey: ['subscribers'],
    queryFn: () => base44.entities.EmailSubscriber.list('-created_date', 1000),
  });

  const markRead = useMutation({
    mutationFn: (id) => base44.entities.AdminNotification.update(id, { is_read: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminNotifications'] }),
  });

  const generatePosts = async () => {
    setGenerating(true);
    await base44.functions.invoke('scheduledSocialPost', {});
    qc.invalidateQueries({ queryKey: ['pendingApprovals'] });
    qc.invalidateQueries({ queryKey: ['adminNotifications'] });
    setGenerating(false);
  };

  const daysLeft = Math.max(0, Math.ceil((RELEASE_DATE - new Date()) / (1000 * 60 * 60 * 24)));
  const recentSubs = subscribers.filter(s => (new Date() - new Date(s.created_date)) < 7 * 24 * 60 * 60 * 1000).length;

  const criticalNotifs = notifications.filter(n => n.severity === 'critical' || n.severity === 'high');
  const infoNotifs = notifications.filter(n => n.severity !== 'critical' && n.severity !== 'high');

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Music Command Centre</h1>
        <p className="text-muted-foreground text-sm">Autonomous music empire — daily overview & social automation</p>
        <CountdownBadge />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Days to Release', value: daysLeft, icon: Calendar, color: 'text-yellow-400', urgent: daysLeft <= 14 },
          { label: 'Total Subscribers', value: subscribers.length, icon: Users, color: 'text-blue-400' },
          { label: 'New This Week', value: recentSubs, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Pending Approvals', value: approvals.length, icon: Clock, color: 'text-orange-400' },
        ].map(stat => (
          <Card key={stat.label} className={stat.urgent ? 'border-yellow-500/40' : ''}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold font-display">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Critical alerts */}
      {criticalNotifs.length > 0 && (
        <Card className="border-red-500/40 bg-red-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" /> Urgent Actions ({criticalNotifs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {criticalNotifs.map(n => (
              <div key={n.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.summary}</p>
                  {n.linked_route && <Link to={n.linked_route} className="text-xs text-primary hover:underline">→ Take action</Link>}
                </div>
                <Button size="sm" variant="ghost" className="shrink-0 h-7 text-xs" onClick={() => markRead.mutate(n.id)}>
                  <CheckCircle2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Social post automation */}
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Share2 className="w-5 h-5 text-primary" /> Social Post Automation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">AI generates 3 daily post drafts (TikTok, Instagram, Twitter). All go to Approval Queue — nothing posts without your approval.</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={generatePosts} disabled={generating} className="gradient-gold-button border-0 gap-2">
              <Zap className="w-4 h-4" />
              {generating ? 'Generating...' : 'Generate Today\'s Posts Now'}
            </Button>
            <Link to="/admin/approval-queue">
              <Button variant="outline" className="gap-2">
                <Clock className="w-4 h-4" />
                Review Queue ({approvals.length})
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">⏰ Auto-generates daily at 9am AEST. Themes rotate: release countdown, personal story, merch, community, behind-the-scenes.</p>
        </CardContent>
      </Card>

      {/* Agents grid */}
      <div>
        <h2 className="font-display text-xl text-foreground mb-3">Active Agents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AGENTS.map(agent => (
            <Link key={agent.name} to={agent.path}>
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardContent className="p-4 flex items-start gap-3">
                  <agent.icon className={`w-6 h-6 shrink-0 mt-0.5 ${agent.color}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">{agent.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{agent.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Growth opportunities */}
      {opportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" /> Open Growth Opportunities ({opportunities.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {opportunities.slice(0, 5).map(opp => (
              <div key={opp.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{opp.trend_name || opp.opportunity_type}</p>
                  <p className="text-xs text-muted-foreground">{opp.platform} · Viral potential: {opp.viral_probability}/10</p>
                </div>
                <Badge variant="outline" className="text-xs shrink-0 ml-2">{opp.status}</Badge>
              </div>
            ))}
            <Link to="/admin/growth-engine">
              <Button variant="ghost" size="sm" className="w-full text-xs">View all opportunities →</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Recent memory */}
      {memories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-400" /> Recent Agent Learnings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {memories.map(m => (
              <div key={m.id} className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{m.memory_type}</Badge>
                  <span className="text-xs text-muted-foreground">{m.agent_name}</span>
                </div>
                <p className="text-xs text-foreground/80 line-clamp-2">{m.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Info notifications */}
      {infoNotifs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" /> Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {infoNotifs.slice(0, 5).map(n => (
              <div key={n.id} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-secondary/30">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.summary}</p>
                </div>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 shrink-0" onClick={() => markRead.mutate(n.id)}>
                  <CheckCircle2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}