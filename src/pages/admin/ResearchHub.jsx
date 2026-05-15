import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Search, Plus, BookOpen, TrendingUp, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

export default function ResearchHub() {
  const [query, setQuery] = useState('');
  const [researchResult, setResearchResult] = useState(null);
  const [researching, setResearching] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const qc = useQueryClient();

  const { data: saved = [] } = useQuery({
    queryKey: ['research-vault'],
    queryFn: () => base44.entities.KnowledgeVault.filter({ category: 'research' }, '-created_date', 50),
  });

  const runResearch = async () => {
    if (!query.trim()) return;
    setResearching(true);
    setResearchResult(null);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a deep research intelligence agent for Gannon Waye, an Australian artist. Research the following topic thoroughly. Provide:\n1. Key findings with sources/references where possible\n2. Themes and patterns\n3. Agreements and contradictions across sources\n4. Actionable insights for Gannon\n5. Risk flags\n6. Opportunities\n7. What to watch\n\nTopic: ${query}\n\nBe thorough, specific, and actionable. Format with clear headers.`,
      add_context_from_internet: true,
    });
    setResearchResult(res);
    setResearching(false);
  };

  const saveResearch = useMutation({
    mutationFn: () => base44.entities.KnowledgeVault.create({ title: query, category: 'research', content: researchResult, summary: `Research: ${query}`, tags: ['research', 'ai-generated'] }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['research-vault'] }); toast.success('Research saved to vault'); setShowSave(false); },
  });

  const SUGGESTIONS = ['Current music industry trends 2026','TikTok algorithm changes for artists','Best merchandise strategies for indie artists','Australian music streaming landscape','How to grow an email list as a musician','Safe legal steps for independent artists'];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-gold-text">Research Hub</h1>
        <p className="text-muted-foreground text-sm">Deep intelligence — gather, synthesize, and extract insights automatically</p>
      </div>

      {/* Research Input */}
      <Card className="border-cyan-500/20">
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-2">
            <Textarea
              placeholder="What do you want to research? Be specific..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              rows={2}
              className="flex-1"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => setQuery(s)} className="text-xs px-2 py-1 border border-border rounded-full text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors">{s}</button>
            ))}
          </div>
          <Button onClick={runResearch} disabled={researching || !query.trim()} className="gradient-gold-button">
            {researching ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Researching...</> : <><Eye className="w-4 h-4 mr-2" /> Run Deep Research</>}
          </Button>
          <p className="text-xs text-muted-foreground">Uses live internet context. Results automatically logged. No approval required unless action could cost money.</p>
        </CardContent>
      </Card>

      {/* Result */}
      {researchResult && (
        <Card className="border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm text-cyan-400">Research Complete: {query}</p>
              <Button size="sm" variant="outline" onClick={() => saveResearch.mutate()} disabled={saveResearch.isPending}>
                {saveResearch.isPending ? 'Saving...' : 'Save to Vault'}
              </Button>
            </div>
            <ReactMarkdown className="text-sm prose prose-sm prose-invert max-w-none">
              {researchResult}
            </ReactMarkdown>
          </CardContent>
        </Card>
      )}

      {/* Saved Research */}
      {saved.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Saved Research</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {saved.map(item => (
              <Card key={item.id} className="hover:border-primary/30 transition-all">
                <CardContent className="p-4">
                  <BookOpen className="w-4 h-4 text-cyan-400 mb-2" />
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(item.created_date).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}