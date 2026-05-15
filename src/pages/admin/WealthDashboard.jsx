import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Shield, AlertTriangle, Package, Users, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WealthDashboard() {
  const { data: orders = [] } = useQuery({ queryKey: ['orders-wealth'], queryFn: () => base44.entities.MerchOrder.list('-created_date', 100) });
  const { data: contributions = [] } = useQuery({ queryKey: ['contributions-wealth'], queryFn: () => base44.entities.SupportContribution.list('-created_date', 100) });
  const { data: subscribers = [] } = useQuery({ queryKey: ['subscribers-wealth'], queryFn: () => base44.entities.EmailSubscriber.list() });
  const { data: vaultFinancial = [] } = useQuery({ queryKey: ['vault-financial'], queryFn: () => base44.entities.KnowledgeVault.filter({ category: 'financial' }) });

  const totalOrders = orders.reduce((s, o) => s + (o.total_amount || 0), 0);
  const totalSupport = contributions.reduce((s, c) => s + (c.total_charged || c.amount || 0), 0);
  const totalRevenue = totalOrders + totalSupport;

  const PRINCIPLES = [
    'Never spend without approval',
    'Never subscribe to paid tools without approval',
    'Never launch paid ads without approval',
    'Never issue refunds without approval',
    'Never reduce prices or discount without approval',
    'Never change payment settings without approval',
    'Protect every revenue stream',
    'Stewardship: grow blessed to be a blessing',
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-gold-text">Wealth Dashboard</h1>
        <p className="text-muted-foreground text-sm">Revenue tracking, protection, and stewardship — Do-Not-Spend-Or-Lose always enforced</p>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-green-500/10 p-2 rounded-lg"><DollarSign className="w-5 h-5 text-green-400" /></div>
            <div><p className="text-xl font-bold">${totalRevenue.toFixed(2)}</p><p className="text-xs text-muted-foreground">Total Revenue</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg"><Package className="w-5 h-5 text-blue-400" /></div>
            <div><p className="text-xl font-bold">${totalOrders.toFixed(2)}</p><p className="text-xs text-muted-foreground">Merch Revenue</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-pink-500/10 p-2 rounded-lg"><Music className="w-5 h-5 text-pink-400" /></div>
            <div><p className="text-xl font-bold">${totalSupport.toFixed(2)}</p><p className="text-xs text-muted-foreground">Supporter Revenue</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-amber-500/10 p-2 rounded-lg"><Users className="w-5 h-5 text-amber-400" /></div>
            <div><p className="text-xl font-bold">{subscribers.length}</p><p className="text-xs text-muted-foreground">Email Subscribers</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Stewardship Principles */}
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4 text-green-400" /> Wealth Stewardship Principles</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {PRINCIPLES.map((p, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
              <span className="text-muted-foreground">{p}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Revenue Streams */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Revenue Streams</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Merch Store', value: `$${totalOrders.toFixed(2)}`, count: `${orders.length} orders`, color: 'text-blue-400', link: '/admin/merch-financials' },
            { label: 'Supporter Contributions', value: `$${totalSupport.toFixed(2)}`, count: `${contributions.length} contributors`, color: 'text-pink-400', link: '/admin/supporters' },
            { label: 'Email List Asset', value: `${subscribers.length} subscribers`, count: 'Untapped revenue channel', color: 'text-amber-400', link: '/admin/subscribers' },
          ].map(stream => (
            <Link key={stream.label} to={stream.link}>
              <Card className="hover:border-primary/30 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <TrendingUp className={`w-5 h-5 ${stream.color} mb-2`} />
                  <p className="font-semibold text-sm">{stream.label}</p>
                  <p className={`text-lg font-bold ${stream.color}`}>{stream.value}</p>
                  <p className="text-xs text-muted-foreground">{stream.count}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Financial Vault Docs */}
      {vaultFinancial.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Financial Planning Records</h2>
          <div className="space-y-2">
            {vaultFinancial.map(doc => (
              <div key={doc.id} className="border border-border rounded-lg p-3 flex items-center justify-between">
                <p className="text-sm font-medium">{doc.title}</p>
                <Badge className="bg-green-500/10 text-green-400 text-xs">financial</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}