import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, BookOpen, Eye, Zap, Globe, ShoppingBag, Brain, Loader2, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const FEED_CATEGORIES = [
  { id: 'all', label: 'All', icon: Globe, color: 'text-foreground' },
  { id: 'research', label: 'Research', icon: BookOpen, color: 'text-cyan-400' },
  { id: 'financial', label: 'Financial', icon: TrendingUp, color: 'text-green-400' },
  { id: 'creative', label: 'Creative', icon: Brain, color: 'text-purple-400' },
  { id: 'brand_profile', label: 'Brand', icon: Eye, color: 'text-pink-400' },
  { id: 'other', label: 'Other', icon: Zap, color: 'text-amber-400' },
];

const LIVE_SCAN_TOPICS = [
  'viral ecommerce products 2026',
  'TikTok algorithm changes May 2026',
  'AI tools for creators 2026',
  'luxury brand strategies emerging markets',
  'SaaS automation opportunities 2026',
  'music industry shifts streaming',
  'competitor indie artist strategies',
  'high-converting product offer frameworks',
];

export default function ResearchGrid() {
  const [category, setCategory] = useState('all');
  const [scanning, setScanning] = useState(false);
  const [scanTopic, setScanTopic] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const { data: entries = [], isLoading, refetch } = useQuery({
    queryKey: ['research-grid', category],
    queryFn: () => category === 'all'
      ? base44.entities.KnowledgeVault.list('-created_date', 100)
      : base44.entities.KnowledgeVault.filter({ category }, '-created_date', 60),
    refetchInterval: 60000,
  });

  const { data: viral = [] } = useQuery({
    queryKey: ['viral-opps'],
    queryFn: () => base44.entities.ViralOpportunity.filter({ status: 'new' }, '-created_date', 10),
  });

  const { data: gaps = [] } = useQuery({
    queryKey: ['creator-gaps'],
    queryFn: () => base44.entities.CreatorGapInsight.filter({ status: 'new' }, '-created_date', 10),
  });

  const runLiveScan = async (topic) => {
    setScanning(true);
    setScanTopic(topic);
    setScanResult(null);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a live market intelligence agent. Research this topic right now and provide:
1. WHAT'S HAPPENING NOW (3-5 specific current developments)
2. TOP OPPORTUNITIES (3 ranked by ROI potential with scores 1-10)
3. RISK FLAGS (2-3 risks to watch)
4. WHAT TO DO THIS WEEK (1 concrete action)
5. TREND VELOCITY: rising/stable/falling

Topic: ${topic}

Be specific with numbers, names, and percentages. No vague generalities.`,
        add_context_from_internet: true,
        model: 'gemini_3_flash',
      });
      setScanResult({ topic, content: result, timestamp: new Date() });
      toast.success('Live scan complete');
    } catch {
      toast.error('Scan failed');
    }
    setScanning(false);
    setScanTopic('');
  };

  const tagColors = {
    'auto-research': 'bg-blue-500/10 text-blue-400',
    'autonomous': 'bg-purple-500/10 text-purple-400',
    'ai': 'bg-cyan-500/10 text-cyan-400',
    'trends': 'bg-green-500/10 text-green-400',
    'music': 'bg-pink-500/10 text-pink-400',
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Research Grid</h1>
          <p className="text-muted-foreground text-sm mt-1">Live feeds — opportunity detection, trend monitoring, market intelligence</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="gap-2 text-xs">
          <RefreshCw className="w-3 h-3" />Refresh
        </Button>
      </div>

      {/* Live Scan Buttons */}
      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Zap className="w-4 h-4 text-primary" />Live Intelligence Scan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {LIVE_SCAN_TOPICS.map(t => (
              <button key={t} disabled={scanning}
                onClick={() => runLiveScan(t)}
                className="text-xs px-2.5 py-1 border border-border rounded-full text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all disabled:opacity-50">
                {scanning && scanTopic === t ? <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />{t}</span> : t}
              </button>
            ))}
          </div>
          {scanResult && (
            <div className="border border-primary/20 bg-primary/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-primary">{scanResult.topic}</p>
                <span className="text-xs text-muted-foreground">{scanResult.timestamp.toLocaleTimeString('en-AU')}</span>
              </div>
              <div className="prose prose-sm prose-invert max-w-none text-xs max-h-64 overflow-y-auto">
                <ReactMarkdown>{scanResult.content}</ReactMarkdown>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Viral Opportunities */}
      {viral.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />Active Viral Opportunities
              <Badge className="ml-auto bg-green-500/10 text-green-400 text-xs">{viral.length} new</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {viral.map(v => (
                <div key={v.id} className="border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="text-xs bg-green-500/10 text-green-400">{v.platform}</Badge>
                    <Badge variant="outline" className="text-xs">{v.speed_of_growth}</Badge>
                    {v.relevance_score && <span className="text-xs text-muted-foreground ml-auto">relevance: {v.relevance_score}/10</span>}
                  </div>
                  <p className="text-sm font-medium">{v.trend}</p>
                  {v.recommended_angle && <p className="text-xs text-primary mt-1">→ {v.recommended_angle}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Creator Gap Insights */}
      {gaps.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" />Creator Gap Insights
              <Badge className="ml-auto bg-purple-500/10 text-purple-400 text-xs">{gaps.length} new</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gaps.slice(0, 5).map(g => (
                <div key={g.id} className="border border-purple-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className="text-xs bg-purple-500/10 text-purple-400">{g.platform}</Badge>
                    {g.viral_potential && <Badge variant="outline" className="text-xs">viral: {g.viral_potential}/10</Badge>}
                    {g.monetization_potential && <Badge variant="outline" className="text-xs">$$: {g.monetization_potential}/10</Badge>}
                  </div>
                  <p className="text-sm font-medium">{g.niche}</p>
                  <p className="text-xs text-muted-foreground mt-1">{g.gap_detected?.substring(0, 120)}...</p>
                  {g.recommended_action && <p className="text-xs text-primary mt-1">→ {g.recommended_action}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {FEED_CATEGORIES.map(c => {
          const Icon = c.icon;
          return (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${category === c.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
              <Icon className="w-3 h-3" />{c.label}
            </button>
          );
        })}
        <Badge variant="outline" className="text-xs self-center">{entries.length} entries</Badge>
      </div>

      {/* Research Feed Grid */}
      {isLoading ? (
        <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {entries.map(item => (
            <Card key={item.id} className="hover:border-primary/30 transition-all cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-xs capitalize">{item.category?.replace('_', ' ')}</Badge>
                      {item.tags?.slice(0, 2).map(t => (
                        <span key={t} className={`text-xs px-1.5 py-0.5 rounded ${tagColors[t] || 'bg-secondary text-muted-foreground'}`}>{t}</span>
                      ))}
                      <span className="text-xs text-muted-foreground ml-auto shrink-0">{new Date(item.created_date).toLocaleDateString('en-AU')}</span>
                    </div>
                  </div>
                </div>
                {item.summary && <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>}
                {expandedId === item.id && item.content && (
                  <div className="mt-3 pt-3 border-t border-border max-h-60 overflow-y-auto">
                    <div className="prose prose-sm prose-invert max-w-none text-xs">
                      <ReactMarkdown>{item.content}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {entries.length === 0 && (
            <div className="col-span-2 text-center py-16 border border-dashed border-border rounded-xl">
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No research entries found.</p>
              <p className="text-xs text-muted-foreground mt-1">Research runs automatically every 4 hours.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}