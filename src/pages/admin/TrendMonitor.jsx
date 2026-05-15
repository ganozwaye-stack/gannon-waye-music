import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Loader2, Copy, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const TREND_CATEGORIES = [
  { id: 'music', label: 'Music & Artist Trends', color: 'text-pink-400' },
  { id: 'social', label: 'Social Media Trends', color: 'text-purple-400' },
  { id: 'merch', label: 'Merch & E-commerce', color: 'text-blue-400' },
  { id: 'marketing', label: 'Marketing Trends', color: 'text-indigo-400' },
  { id: 'wealth', label: 'Wealth Building Trends', color: 'text-green-400' },
  { id: 'legal', label: 'Legal/Regulatory Changes', color: 'text-orange-400' },
];

export default function TrendMonitor() {
  const [activeCategory, setActiveCategory] = useState('music');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scan = async () => {
    setLoading(true);
    setResult(null);
    const cat = TREND_CATEGORIES.find(c => c.id === activeCategory);
    const prompts = {
      music: 'What are the most important music industry trends right now in 2026? Focus on independent artists, streaming, playlist strategy, TikTok music, and audience building. What should Gannon Waye act on immediately? What should be avoided?',
      social: 'What are the top TikTok, Instagram Reels, and YouTube Shorts trends right now in 2026 for artists and creators? What content formats are rising? What hashtags are trending in music/artist spaces? What should be acted on now?',
      merch: 'What are the current merchandise and e-commerce trends for artists and musicians in 2026? What products are selling? What strategies are working for independent artists? Flag anything requiring money to implement.',
      marketing: 'What are the most effective organic marketing strategies for independent artists in 2026? Email, community, social, PR. What is working? What is declining? What should Gannon Waye prioritize?',
      wealth: 'What are the most promising and safe wealth-building opportunities for independent artists in 2026? Focus on income diversification, passive income, community monetization. Flag anything that requires spending or risk.',
      legal: 'What legal and regulatory changes in 2026 are most relevant for independent Australian artists? Music rights, AI content, privacy laws, consumer law, digital contracts. What should be monitored?',
    };
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a trend intelligence agent for Gannon Waye, an Australian artist.\n\n${prompts[activeCategory]}\n\nProvide:\n1. Top 5 rising trends\n2. Opportunities aligned with Gannon's brand\n3. Trends to avoid\n4. Immediate action items (organic/free)\n5. Items requiring approval (cost or risk)\n6. What to watch in next 30 days`,
      add_context_from_internet: true,
    });
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-gold-text">Trend Monitor</h1>
        <p className="text-muted-foreground text-sm">Real-time intelligence on trends that affect your music, business, and growth</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {TREND_CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`p-3 rounded-lg border text-sm text-left transition-all ${activeCategory === cat.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'}`}>
            <TrendingUp className={`w-4 h-4 ${cat.color} mb-1`} />
            <span className={activeCategory === cat.id ? 'text-primary font-medium' : 'text-muted-foreground'}>{cat.label}</span>
          </button>
        ))}
      </div>

      <Button onClick={scan} disabled={loading} className="gradient-gold-button">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Scanning trends...</> : <><RefreshCw className="w-4 h-4 mr-2" />Scan {TREND_CATEGORIES.find(c=>c.id===activeCategory)?.label}</>}
      </Button>
      <p className="text-xs text-muted-foreground">Uses live internet data. Automatic — no approval required to view insights.</p>

      {result && (
        <Card className="border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-amber-500/10 text-amber-400">{TREND_CATEGORIES.find(c=>c.id===activeCategory)?.label} — Live Intelligence</Badge>
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied'); }}>
                <Copy className="w-3 h-3 mr-1" /> Copy
              </Button>
            </div>
            <ReactMarkdown className="text-sm prose prose-sm prose-invert max-w-none">{result}</ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
}