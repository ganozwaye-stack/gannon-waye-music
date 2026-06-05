import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import {
  DollarSign, ArrowLeft, Zap, Package, Users, Activity, Music,
  ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';

const TODAY_MOVES = [
  {
    rank: 1,
    category: 'Commerce',
    action: 'Review pending bundle proposals in Revenue Actions',
    why: 'Agent-prepared bundle proposals are awaiting approval. Each approved bundle can generate $40-90 net profit per order.',
    effort: 'low', potential: 'high',
    route: '/admin/revenue-actions',
    icon: Package,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    rank: 2,
    category: 'Commerce',
    action: 'Check Order Profit Intelligence for today\'s margin summary',
    why: 'Real profit after costs — not just revenue. See which products make money and which ones don\'t.',
    effort: 'low', potential: 'high',
    route: '/admin/order-profit-intelligence',
    icon: DollarSign,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    rank: 3,
    category: 'Sync Licensing',
    action: 'Review today\'s sync licensing opportunities',
    why: 'Sync licensing is the highest per-song income stream. One placement can generate thousands. Prep pipeline now.',
    effort: 'medium', potential: 'very_high',
    route: '/admin/sync-licensing-command',
    icon: Music,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    rank: 4,
    category: 'Fan Conversion',
    action: 'Check Fan Conversion Engine for upgrade opportunities',
    why: 'Converting existing fans to higher tiers costs nothing. Superfans generate 10x more revenue than casual fans.',
    effort: 'low', potential: 'high',
    route: '/admin/fan-conversion-engine',
    icon: Users,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    rank: 5,
    category: 'TikTok',
    action: 'Prepare a TikTok draft for content-to-cash pipeline',
    why: 'TikTok drafts go through approval. One viral video drives merch sales. Start the draft pipeline today.',
    effort: 'medium', potential: 'high',
    route: '/tiktok-platform-review',
    icon: Zap,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
  {
    rank: 6,
    category: 'Intelligence',
    action: 'Review this week\'s money report',
    why: 'Weekly snapshot of all income streams, profit trends, and what is or isn\'t working. 5 minutes max.',
    effort: 'low', potential: 'medium',
    route: '/admin/weekly-money-report',
    icon: Activity,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
];

const EFFORT_COLOR = { low: 'text-green-400', medium: 'text-yellow-400', high: 'text-red-400' };
const POTENTIAL_COLOR = { very_high: 'text-purple-400', high: 'text-green-400', medium: 'text-yellow-400', low: 'text-muted-foreground' };

export default function TodaysMoneymoves() {
  const navigate = useNavigate();

  const { data: orders = [] } = useQuery({
    queryKey: ['orders-today'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 20),
  });
  const { data: proposals = [] } = useQuery({
    queryKey: ['proposals-today'],
    queryFn: () => base44.entities.AgentActionProposal.filter({ status: 'pending_approval' }, '-created_date', 20),
  });
  const { data: notifications = [] } = useQuery({
    queryKey: ['notif-today'],
    queryFn: () => base44.entities.AdminNotification.filter({ is_read: false, requires_action: true }, '-created_date', 20),
  });

  const today = new Date();
  const todayStr = format(today, 'EEEE, d MMMM yyyy');

  const activeOrders = orders.filter(o => !['cancelled','refunded','deleted'].includes(o.status));
  const todayRevenue = activeOrders
    .filter(o => o.created_date && new Date(o.created_date).toDateString() === today.toDateString())
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary/40 rounded transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Today's Money Moves</h1>
          <p className="text-muted-foreground text-sm">{todayStr} — Ranked actions to make money today</p>
        </div>
      </div>

      {/* Pulse KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-primary/30">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-primary">${todayRevenue.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Today's Revenue</p>
          </CardContent>
        </Card>
        <Card className={proposals.length > 0 ? 'border-yellow-500/30' : ''}>
          <CardContent className="p-4">
            <p className={`text-2xl font-bold ${proposals.length > 0 ? 'text-yellow-400' : 'text-foreground'}`}>{proposals.length}</p>
            <p className="text-xs text-muted-foreground">Proposals Awaiting You</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{activeOrders.length}</p>
            <p className="text-xs text-muted-foreground">Active Orders</p>
          </CardContent>
        </Card>
        <Card className={notifications.length > 0 ? 'border-red-500/30' : ''}>
          <CardContent className="p-4">
            <p className={`text-2xl font-bold ${notifications.length > 0 ? 'text-red-400' : 'text-foreground'}`}>{notifications.length}</p>
            <p className="text-xs text-muted-foreground">Actions Needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Ranked moves */}
      <div>
        <h2 className="text-lg font-display font-semibold mb-3">Ranked Money Moves</h2>
        <div className="space-y-3">
          {TODAY_MOVES.map(move => {
            const Icon = move.icon;
            return (
              <Link key={move.rank} to={move.route}>
                <div className="border border-border rounded-xl p-4 hover:border-primary/40 hover:bg-secondary/10 transition-all group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className={`${move.bg} p-2.5 rounded-lg shrink-0`}>
                      <Icon className={`w-5 h-5 ${move.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-muted-foreground/50">#{move.rank}</span>
                        <Badge className="text-xs bg-secondary text-secondary-foreground">{move.category}</Badge>
                        <span className={`text-xs ${EFFORT_COLOR[move.effort]}`}>Effort: {move.effort}</span>
                        <span className={`text-xs ${POTENTIAL_COLOR[move.potential]}`}>Potential: {move.potential.replace('_', ' ')}</span>
                      </div>
                      <p className="font-semibold text-sm mb-0.5">{move.action}</p>
                      <p className="text-xs text-muted-foreground">{move.why}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Approval Queue', route: '/admin/approval-queue', desc: 'Everything awaiting your decision' },
          { label: 'Intelligence to Income', route: '/admin/intelligence-to-income', desc: 'Full income cycle view' },
          { label: 'Business Attention Centre', route: '/admin/notifications', desc: 'All alerts and actions' },
          { label: 'Agent Capability Matrix', route: '/admin/agent-capability-matrix', desc: 'What agents are doing' },
          { label: 'Bundle Studio', route: '/admin/bundle-proposal-studio', desc: 'Design and submit bundles' },
          { label: 'Weekly Money Report', route: '/admin/weekly-money-report', desc: 'Full weekly breakdown' },
        ].map(l => (
          <Link key={l.route} to={l.route}>
            <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">{l.label}</p>
                <p className="text-xs text-muted-foreground">{l.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}