import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TrendingUp, BookOpen, Eye, Zap, Globe, Brain, Loader2, RefreshCw, Archive, Plus, ChevronRight, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

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

function ResearchDetailModal({ item, onClose, onSaveToVault, onCreateApproval: createApproval, onArchive }) {
  const qc = useQueryClient();
  const [assignedAgent, setAssignedAgent] = useState(item.linked_agent || '');
  const [assigning, setAssigning] = useState(false);

  const { data: agents = [] } = useQuery({
    queryKey: ['agent-registry-list'],
    queryFn: () => base44.entities.AgentRegistry.list(),
  });

  const { data: related = [] } = useQuery({
    queryKey: ['related-vault-items', item.category],
    queryFn: () => base44.entities.KnowledgeVault.filter({ category: item.category }, '-created_date', 10),
    enabled: !!item.category,
  });

  if (!item) return null;

  const filteredRelated = related.filter(r => r.id !== item.id).slice(0, 3);

  // Generate fallback recommended actions based on category if not defined
  const recommendedAction = item.recommended_action || (
    item.category === 'social_archive' || item.category === 'research'
      ? 'Feed this trend insight into the Creative Studio to draft social posts.'
      : item.category === 'financial'
      ? 'Perform a pricing sensitivity check in the Revenue Command Centre.'
      : 'Verify integration parameters and alert operations queue if discrepancies exist.'
  );

  const handleAssignAgent = async () => {
    setAssigning(true);
    try {
      await base44.entities.KnowledgeVault.update(item.id, { linked_agent: assignedAgent });
      toast.success(`Assigned research item to ${assignedAgent}`);
      qc.invalidateQueries({ queryKey: ['research-grid'] });
    } catch (err) {
      toast.error('Failed to assign agent: ' + err.message);
    }
    setAssigning(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{item.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs capitalize">{item.category?.replace('_', ' ')}</Badge>
            {item.tags?.map(t => <Badge key={t} className="text-xs bg-secondary text-secondary-foreground">{t}</Badge>)}
            <span className="text-xs text-muted-foreground ml-auto">{new Date(item.created_date).toLocaleString('en-AU')}</span>
          </div>

          {item.summary && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Summary</p>
              <p className="text-sm text-foreground/80 leading-relaxed bg-secondary/30 rounded-lg p-3">{item.summary}</p>
            </div>
          )}

          {item.content && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Full Content</p>
              <div className="prose prose-sm prose-invert max-w-none text-sm bg-secondary/20 rounded-lg p-4 max-h-64 overflow-y-auto">
                <ReactMarkdown>{item.content}</ReactMarkdown>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {item.source && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Source</p>
                <p className="text-xs text-foreground/70">{item.source}</p>
              </div>
            )}
            {(item.created_by_agent || item.linked_agent) && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Creating Agent</p>
                <p className="text-xs text-foreground/70">{item.created_by_agent || item.linked_agent || 'Unknown Agent'}</p>
              </div>
            )}
          </div>

          {/* Recommended Action */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">💡 Recommended Action</p>
            <p className="text-xs text-foreground/90">{recommendedAction}</p>
          </div>

          {/* Related Records */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Related Records</p>
            {filteredRelated.length > 0 ? (
              <ul className="space-y-1">
                {filteredRelated.map(r => (
                  <li key={r.id} className="text-xs text-foreground/75 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                    <span className="truncate">{r.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground italic">No related records found in this category.</p>
            )}
          </div>

          {/* Assign Agent Controls */}
          <div className="border-t border-border pt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Assign to AI Agent</p>
            <div className="flex gap-2 max-w-md">
              <select
                value={assignedAgent}
                onChange={e => setAssignedAgent(e.target.value)}
                className="flex-1 bg-background border border-input rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Select Agent...</option>
                {agents.map(a => (
                  <option key={a.id || a.agent_name} value={a.agent_name}>{a.agent_name}</option>
                ))}
              </select>
              <Button size="sm" onClick={handleAssignAgent} disabled={assigning || !assignedAgent} className="text-xs">
                {assigning ? 'Assigning...' : 'Assign Agent'}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => { onSaveToVault(item); onClose(); }}>
              <Save className="w-3 h-3" /> Save to Vault
            </Button>
            <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => { createApproval(item); onClose(); }}>
              <Plus className="w-3 h-3" /> Create Approval Item
            </Button>
            <Link to="/admin/knowledge-vault" onClick={onClose}>
              <Button size="sm" variant="outline" className="gap-1 text-xs">
                <BookOpen className="w-3 h-3" /> Knowledge Vault
              </Button>
            </Link>
            <Button size="sm" variant="ghost" className="gap-1 text-xs text-red-400 hover:text-red-300" onClick={() => { onArchive(item); onClose(); }}>
              <Archive className="w-3 h-3" /> Archive
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ResearchGrid() {
  const [category, setCategory] = useState('all');
  const [scanning, setScanning] = useState(false);
  const [scanTopic, setScanTopic] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedViral, setSelectedViral] = useState(null);
  const [selectedGap, setSelectedGap] = useState(null);
  const qc = useQueryClient();

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

  const saveToVault = async (item) => {
    try {
      await base44.entities.KnowledgeVault.create({
        title: `[Research] ${item.title}`,
        category: item.category || 'research',
        content: item.content || item.summary,
        summary: item.summary,
        tags: [...(item.tags || []), 'from-research-grid'],
        sensitivity_level: 'internal',
      });
      qc.invalidateQueries({ queryKey: ['research-grid'] });
      toast.success('Saved to Knowledge Vault');
    } catch { toast.error('Save failed'); }
  };

  const createApproval = async (item) => {
    try {
      await base44.entities.ApprovalQueue.create({
        action_title: `Research Finding: ${item.title}`,
        description: item.summary || item.content?.substring(0, 500),
        agent_name: item.created_by_agent || 'Research Grid',
        risk_level: 'low',
        status: 'pending',
      });
      toast.success('Approval item created');
    } catch { toast.error('Failed to create approval'); }
  };

  const archiveItem = async (item) => {
    try {
      await base44.entities.KnowledgeVault.update(item.id, { tags: [...(item.tags || []), 'archived'] });
      qc.invalidateQueries({ queryKey: ['research-grid'] });
      toast.success('Item archived');
    } catch { toast.error('Archive failed'); }
  };

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

      {/* Viral Opportunity Detail Modal */}
      {selectedViral && (
        <Dialog open onOpenChange={() => setSelectedViral(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="font-display text-lg">{selectedViral.trend}</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="flex flex-wrap gap-2">
                <Badge className="text-xs bg-green-500/10 text-green-400">{selectedViral.platform}</Badge>
                <Badge variant="outline" className="text-xs">{selectedViral.speed_of_growth}</Badge>
                <Badge variant="outline" className="text-xs">{selectedViral.competition_level} competition</Badge>
                {selectedViral.relevance_score && <Badge className="text-xs bg-primary/10 text-primary">relevance: {selectedViral.relevance_score}/10</Badge>}
              </div>
              {selectedViral.recommended_angle && <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Recommended Angle</p><p className="text-sm text-foreground/80 bg-secondary/30 rounded-lg p-2">{selectedViral.recommended_angle}</p></div>}
              {selectedViral.recommended_hook && <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Hook</p><p className="text-sm text-foreground/80">{selectedViral.recommended_hook}</p></div>}
              {selectedViral.estimated_lifespan && <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Estimated Lifespan</p><p className="text-sm text-foreground/70">{selectedViral.estimated_lifespan}</p></div>}
              <div className="flex gap-2 pt-2 border-t border-border flex-wrap">
                <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => { saveToVault({ title: selectedViral.trend, category: 'research', summary: selectedViral.recommended_angle, content: selectedViral.recommended_hook }); setSelectedViral(null); }}><Save className="w-3 h-3" />Save to Vault</Button>
                <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => { createApproval({ title: selectedViral.trend, summary: selectedViral.recommended_angle, category: 'research' }); setSelectedViral(null); }}><Plus className="w-3 h-3" />Create Approval</Button>
              </div>
              <p className="text-xs text-muted-foreground">Created: {selectedViral.created_date ? new Date(selectedViral.created_date).toLocaleDateString('en-AU') : '—'} · Source: Autonomous Trend Engine</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

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
                <button key={v.id} onClick={() => setSelectedViral(v)} className="border border-green-500/20 rounded-lg p-3 text-left hover:border-green-500/50 hover:bg-green-500/5 transition-all group">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="text-xs bg-green-500/10 text-green-400">{v.platform}</Badge>
                    <Badge variant="outline" className="text-xs">{v.speed_of_growth}</Badge>
                    {v.relevance_score && <span className="text-xs text-muted-foreground ml-auto">relevance: {v.relevance_score}/10</span>}
                    <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-green-400" />
                  </div>
                  <p className="text-sm font-medium">{v.trend}</p>
                  {v.recommended_angle && <p className="text-xs text-primary mt-1">→ {v.recommended_angle}</p>}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Creator Gap Detail Modal */}
      {selectedGap && (
        <Dialog open onOpenChange={() => setSelectedGap(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="font-display text-lg">{selectedGap.niche}</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="flex flex-wrap gap-2">
                <Badge className="text-xs bg-purple-500/10 text-purple-400">{selectedGap.platform}</Badge>
                {selectedGap.viral_potential && <Badge variant="outline" className="text-xs">viral: {selectedGap.viral_potential}/10</Badge>}
                {selectedGap.monetization_potential && <Badge variant="outline" className="text-xs">monetisation: {selectedGap.monetization_potential}/10</Badge>}
              </div>
              {selectedGap.gap_detected && <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Gap Detected</p><p className="text-sm text-foreground/80 bg-secondary/30 rounded-lg p-2">{selectedGap.gap_detected}</p></div>}
              {selectedGap.content_opportunity && <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Content Opportunity</p><p className="text-sm text-foreground/80">{selectedGap.content_opportunity}</p></div>}
              {selectedGap.recommended_action && <div><p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">→ Recommended Action</p><p className="text-sm text-foreground/80 bg-primary/5 border border-primary/20 rounded-lg p-2">{selectedGap.recommended_action}</p></div>}
              <div className="flex gap-2 pt-2 border-t border-border flex-wrap">
                <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => { saveToVault({ title: selectedGap.niche, category: 'research', summary: selectedGap.gap_detected, content: selectedGap.recommended_action }); setSelectedGap(null); }}><Save className="w-3 h-3" />Save to Vault</Button>
                <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => { createApproval({ title: selectedGap.niche, summary: selectedGap.recommended_action, category: 'research' }); setSelectedGap(null); }}><Plus className="w-3 h-3" />Create Approval</Button>
              </div>
              <p className="text-xs text-muted-foreground">Created: {selectedGap.created_date ? new Date(selectedGap.created_date).toLocaleDateString('en-AU') : '—'} · Source: Creator Gap Scanner</p>
            </div>
          </DialogContent>
        </Dialog>
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
                <button key={g.id} onClick={() => setSelectedGap(g)} className="w-full text-left border border-purple-500/20 rounded-lg p-3 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className="text-xs bg-purple-500/10 text-purple-400">{g.platform}</Badge>
                    {g.viral_potential && <Badge variant="outline" className="text-xs">viral: {g.viral_potential}/10</Badge>}
                    {g.monetization_potential && <Badge variant="outline" className="text-xs">$$: {g.monetization_potential}/10</Badge>}
                    <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-purple-400 ml-auto" />
                  </div>
                  <p className="text-sm font-medium">{g.niche}</p>
                  <p className="text-xs text-muted-foreground mt-1">{g.gap_detected?.substring(0, 120)}...</p>
                  {g.recommended_action && <p className="text-xs text-primary mt-1">→ {g.recommended_action}</p>}
                </button>
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
            <Card key={item.id} className="hover:border-primary/30 transition-all cursor-pointer group" onClick={() => setSelectedItem(item)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-sm font-medium leading-snug">{item.title}</p>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                    </div>
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

      {selectedItem && (
        <ResearchDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSaveToVault={saveToVault}
          onCreateApproval={createApproval}
          onArchive={archiveItem}
        />
      )}
    </div>
  );
}