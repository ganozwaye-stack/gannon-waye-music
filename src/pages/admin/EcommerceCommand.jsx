import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, DollarSign, AlertTriangle, Zap, Star, Package, Loader2, Shield, Eye, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const COMMAND_SCANS = [
  { id: 'top_money', label: 'Top Money Opportunity', icon: DollarSign, color: 'text-green-400', prompt: 'What is the single highest-ROI money opportunity available right now for a music artist merchandise store selling physical products online in Australia? Be specific: product type, price point, expected margin, why it converts, and what to do this week.' },
  { id: 'viral_products', label: 'Viral Products Now', icon: TrendingUp, color: 'text-pink-400', prompt: 'What physical products are going viral in fan/artist merchandise stores RIGHT NOW in 2026? List 5 with: product name, why it\'s viral, estimated demand level, margin potential, supplier type needed, risk level.' },
  { id: 'best_upsells', label: 'Best Upsell Sequences', icon: Zap, color: 'text-purple-400', prompt: 'Design 3 premium upsell sequences for a music artist store. Include: trigger (what was purchased), upsell offer, upsell price, copy hook, expected conversion rate, emotional reason it works. Products available: CDs $22.95, T-shirts $49, Hoodies $89.' },
  { id: 'best_bundles', label: 'Highest Margin Bundles', icon: Package, color: 'text-cyan-400', prompt: 'Design 5 high-margin product bundles for a music artist merchandise store. For each: bundle name, included products, bundle price, individual total price, saving shown to customer, expected margin %, emotional story angle, luxury positioning.' },
  { id: 'supplier_risk', label: 'Supplier Risk Scan', icon: AlertTriangle, color: 'text-orange-400', prompt: 'What are the top 5 supplier and logistics risks for a small Australian music artist merchandise store in 2026? For each: risk type, likelihood (1-10), impact (1-10), mitigation strategy, red flags to watch for.' },
  { id: 'competitor_gaps', label: 'Competitor Weaknesses', icon: Eye, color: 'text-yellow-400', prompt: 'What are the typical weaknesses and blind spots of independent Australian music artist online stores in 2026? Identify 5 gaps that represent opportunities to differentiate. For each: gap, why competitors fail here, how to exploit it, expected advantage.' },
];

export default function EcommerceCommand() {
  const [outputs, setOutputs] = useState({});
  const [loading, setLoading] = useState(null);

  const { data: products = [] } = useQuery({
    queryKey: ['merch-products'],
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true }),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['recent-orders-ecom'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 10),
  });

  const { data: ideas = [] } = useQuery({
    queryKey: ['ecom-ideas'],
    queryFn: () => base44.entities.IdeaOpportunity.filter({ status: 'new' }, '-created_date', 5),
  });

  const runScan = async (scan) => {
    setLoading(scan.id);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: scan.prompt,
        add_context_from_internet: true,
        model: 'gemini_3_flash',
      });
      setOutputs(prev => ({ ...prev, [scan.id]: result }));
    } catch {
      toast.error('Scan failed');
    }
    setLoading(null);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Ecommerce Command</h1>
          <p className="text-muted-foreground text-sm mt-1">Top opportunities · viral products · supplier risks · upsells · bundles</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/ecommerce-intelligence"><Button variant="outline" className="text-xs gap-2"><Zap className="w-3 h-3" />Full Intelligence</Button></Link>
          <Link to="/admin/merch"><Button variant="outline" className="text-xs gap-2"><Package className="w-3 h-3" />Products</Button></Link>
        </div>
      </div>

      {/* Safety Rule */}
      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
        <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
        <p className="text-yellow-300 text-xs"><strong>Safety Rule Active:</strong> No agent may order products, change prices, launch ads, or issue refunds without explicit approval.</p>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Products', value: products.length, icon: Package, color: 'text-primary', bg: 'bg-primary/10', link: '/admin/merch' },
          { label: 'Recent Orders', value: orders.length, icon: ShoppingBag, color: 'text-green-400', bg: 'bg-green-500/10', link: '/admin/orders' },
          { label: 'New Opportunities', value: ideas.length, icon: Star, color: 'text-cyan-400', bg: 'bg-cyan-500/10', link: '/admin/ideas-engine' },
          { label: 'Est. Recent Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10', link: '/admin/financials' },
        ].map(s => (
          <Link key={s.label} to={s.link}>
            <Card className="hover:border-primary/30 transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`${s.bg} p-2 rounded-lg`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                <div>
                  <p className="text-xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Today's Best Actions from Ideas */}
      {ideas.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Star className="w-4 h-4 text-primary" />Today's Best Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ideas.slice(0, 3).map(idea => (
              <div key={idea.id} className="flex items-center gap-3 p-2 border border-border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{idea.title}</p>
                  <p className="text-xs text-muted-foreground">{idea.recommended_next_step || idea.description?.substring(0, 80)}</p>
                </div>
                {idea.opportunity_score && <Badge variant="outline" className="text-xs shrink-0">{idea.opportunity_score}/100</Badge>}
              </div>
            ))}
            <Link to="/admin/ideas-engine" className="text-xs text-primary flex items-center gap-1 pt-1">View all ideas <ArrowRight className="w-3 h-3" /></Link>
          </CardContent>
        </Card>
      )}

      {/* Intelligence Scan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COMMAND_SCANS.map(scan => {
          const Icon = scan.icon;
          return (
            <Card key={scan.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${scan.color}`} />{scan.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button size="sm" variant="outline" className="w-full" onClick={() => runScan(scan)} disabled={loading === scan.id}>
                  {loading === scan.id ? <><Loader2 className="w-3 h-3 mr-2 animate-spin" />Scanning...</> : <><Zap className="w-3 h-3 mr-2" />Run Scan</>}
                </Button>
                {outputs[scan.id] && (
                  <div className="border border-border rounded-lg p-3 bg-card/50 max-h-72 overflow-y-auto">
                    <div className="prose prose-sm prose-invert max-w-none text-xs">
                      <ReactMarkdown>{outputs[scan.id]}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: 'Product Insights', path: '/admin/product-insights' },
          { label: 'Merch Financials', path: '/admin/merch-financials' },
          { label: 'Promo Codes', path: '/admin/promo-codes' },
          { label: 'Orders & Shipping', path: '/admin/orders' },
        ].map(l => (
          <Link key={l.path} to={l.path}>
            <div className="border border-border rounded-lg p-3 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all text-center">{l.label} →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}