import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShoppingBag, Loader2, Shield, TrendingUp, Package, Star, Zap, Copy, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

const AGENTS = [
  { id: 'product_research', label: 'Product Research', icon: Package, color: 'text-blue-400', prompt: 'Generate 5 winning product research insights for a music artist merchandise store. Focus on: trending fan products, emotional connection items, limited edition ideas, bundle opportunities. Include: product concept, target fan, emotional hook, estimated margin, difficulty to source, viral potential score (1-10).' },
  { id: 'pricing_strategy', label: 'Pricing Strategy', icon: TrendingUp, color: 'text-green-400', prompt: 'Analyse optimal pricing strategy for a music artist merchandise store selling: t-shirts ($49), hoodies ($89), CDs ($22.95), accessories. Suggest: price anchoring tactics, bundle pricing, premium tier pricing, psychological price points, upsell sequences, scarcity pricing.' },
  { id: 'conversion', label: 'Conversion Optimizer', icon: Star, color: 'text-yellow-400', prompt: 'Identify 10 conversion optimization opportunities for a music artist ecommerce store. Focus on: checkout friction, trust signals, social proof, scarcity tactics, copy improvements, CTA optimization, mobile experience, abandoned cart recovery. Rate each by impact (1-10) and implementation difficulty (1-10).' },
  { id: 'upsell', label: 'Upsell & Bundle', icon: Zap, color: 'text-purple-400', prompt: 'Design a premium upsell and bundle strategy for a music artist merchandise store. Products include: CDs, t-shirts, hoodies, accessories. Create: bundle names, bundle pricing, upsell sequences, cross-sell triggers, post-purchase offers, loyalty rewards. Focus on increasing average order value.' },
  { id: 'retention', label: 'Retention System', icon: CheckCircle2, color: 'text-cyan-400', prompt: 'Design a customer retention and loyalty system for a music artist\'s fan store. Include: post-purchase email sequence, loyalty milestones, exclusive access tiers, VIP offers, win-back campaigns, community touchpoints, anniversary triggers. Focus on lifetime value and emotional connection.' },
  { id: 'hooks', label: 'Product Hooks & Copy', icon: TrendingUp, color: 'text-pink-400', prompt: 'Write 10 powerful product hook lines and ad copy angles for a music artist merchandise store. Style: authentic, emotional, premium, LGBTQIA+ inclusive. For each include: hook line, sub-copy, CTA, target emotion, estimated resonance score (1-10).' },
];

const RULE_BANNER = (
  <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
    <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
    <p className="text-yellow-300 text-xs">
      <strong>Safety Rule Active:</strong> No agent may order products, spend money, launch ads, change prices, issue refunds, or modify payment settings without explicit approval.
    </p>
  </div>
);

export default function EcommerceIntelligence() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(null);
  const [outputs, setOutputs] = useState({});
  const [copied, setCopied] = useState(null);

  const runAgent = async (agent) => {
    setLoading(agent.id);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: agent.prompt,
        add_context_from_internet: true,
      });
      setOutputs(prev => ({ ...prev, [agent.id]: result }));
    } catch (err) {
      toast({ title: 'Agent failed', description: err?.message, variant: 'destructive' });
    }
    setLoading(null);
  };

  const runAll = async () => {
    for (const agent of AGENTS) {
      await runAgent(agent);
    }
  };

  const copyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const saveToVault = async (agent, content) => {
    await base44.entities.KnowledgeVault.create({
      title: `Ecommerce Intelligence: ${agent.label}`,
      category: 'research',
      content,
      summary: content.slice(0, 200),
      source: 'Ecommerce Intelligence Agent',
      access_level: 'admin_only',
    });
    toast({ title: 'Saved to Knowledge Vault' });
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Ecommerce Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">AI-powered store optimization, product research, and conversion intelligence</p>
        </div>
        <Button onClick={runAll} disabled={!!loading} className="gradient-gold-button border-0">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
          Run All Agents
        </Button>
      </div>

      {RULE_BANNER}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AGENTS.map(agent => (
          <Card key={agent.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <agent.icon className={`w-5 h-5 ${agent.color}`} />
                {agent.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <p className="text-xs text-muted-foreground line-clamp-2">{agent.prompt.slice(0, 100)}...</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => runAgent(agent)}
                disabled={loading === agent.id}
                className="w-full"
              >
                {loading === agent.id ? <><Loader2 className="w-3 h-3 mr-2 animate-spin" />Running...</> : `Run ${agent.label}`}
              </Button>
              {outputs[agent.id] && (
                <div className="border border-border rounded-lg p-3 bg-card/50 max-h-80 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-green-500/10 text-green-400 text-xs">Complete</Badge>
                    <div className="flex gap-1">
                      <button onClick={() => copyText(agent.id, outputs[agent.id])} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                        {copied === agent.id ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <button onClick={() => saveToVault(agent, outputs[agent.id])} className="text-xs text-primary hover:underline ml-2">Save</button>
                    </div>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none text-xs">
                    <ReactMarkdown>{outputs[agent.id]}</ReactMarkdown>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats summary at bottom */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-3 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-primary" /> Quick Store Stats</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Products Active', link: '/admin/merch' },
              { label: 'Orders', link: '/admin/orders' },
              { label: 'Promo Codes', link: '/admin/promo-codes' },
              { label: 'Product Insights', link: '/admin/product-insights' },
            ].map(item => (
              <a key={item.label} href={item.link} className="border border-border rounded-lg p-3 hover:border-primary/40 transition-colors">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-xs text-primary mt-1">View →</p>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}