import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, Zap, Eye, TrendingUp, Lightbulb, Archive } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

const GENERATE_PROMPT = `You are the Gannon Core Creator Intelligence Agent. Generate a comprehensive creator insights brief for a music artist in 2025-2026.

The artist profile:
- Genre: Emotional pop/contemporary
- Brand values: Authenticity, vulnerability, healing, resilience, LGBTQIA+ inclusion
- Platform focus: TikTok, Instagram, YouTube
- Market: Australia + global

Generate insights across these 8 categories:

1. EMERGING CREATOR GAPS (3 gaps competitors are missing)
2. UNDERSERVED AUDIENCE NEEDS (3 audience needs not being met)
3. TRENDING EMOTIONAL THEMES (5 themes gaining momentum)
4. HIGH-PERFORMING CONTENT STYLES (3 formats performing well for similar artists)
5. PLATFORM OPPORTUNITIES (2 platform-specific opportunities)
6. SUGGESTED COLLABORATIONS (3 creator types to collaborate with — no specific names, describe the archetype)
7. SUGGESTED STORYTELLING ANGLES (5 unique story angles)
8. FUTURE NICHE OPPORTUNITIES (3 niches to own before they're saturated)

Format clearly with headers. Be specific and actionable. Focus on 2025-2026 landscape.`;

export default function CreatorInsights() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [insights, setInsights] = useState('');

  const { data: gaps = [], isLoading: gapsLoading } = useQuery({
    queryKey: ['creator-gaps'],
    queryFn: () => base44.entities.CreatorGapInsight.list('-created_date', 50),
  });

  const { data: audienceInsights = [] } = useQuery({
    queryKey: ['audience-insights'],
    queryFn: () => base44.entities.AudienceInsight.list('-created_date', 20),
  });

  const updateGapMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CreatorGapInsight.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['creator-gaps'] }),
  });

  const generateInsights = async () => {
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: GENERATE_PROMPT,
        add_context_from_internet: true,
      });
      setInsights(result);

      // Save to vault
      await base44.entities.KnowledgeVault.create({
        title: `Creator Insights Brief — ${new Date().toLocaleDateString('en-AU')}`,
        category: 'research',
        content: result,
        summary: 'AI-generated creator intelligence covering gaps, audience, trends, and opportunities',
        source: 'Creator Insights Agent',
        access_level: 'admin_only',
        tags: ['creator', 'insights', 'intelligence'],
      });

      // Try to extract and save structured gap insights
      try {
        const structured = await base44.integrations.Core.InvokeLLM({
          prompt: `From this creator insight report, extract exactly 3 creator gaps as JSON:\n\n${result}\n\nReturn JSON array with fields: niche (string), gap_detected (string), why_it_matters (string), viral_potential (number 1-10), monetization_potential (number 1-10), difficulty (number 1-10), recommended_action (string), platform (one of: tiktok, instagram, youtube, all)`,
          response_json_schema: {
            type: 'object',
            properties: {
              gaps: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    niche: { type: 'string' }, gap_detected: { type: 'string' },
                    why_it_matters: { type: 'string' }, viral_potential: { type: 'number' },
                    monetization_potential: { type: 'number' }, difficulty: { type: 'number' },
                    recommended_action: { type: 'string' }, platform: { type: 'string' },
                  }
                }
              }
            }
          }
        });
        if (structured?.gaps?.length) {
          await Promise.all(structured.gaps.map(g =>
            base44.entities.CreatorGapInsight.create({ ...g, status: 'new' })
          ));
          queryClient.invalidateQueries({ queryKey: ['creator-gaps'] });
        }
      } catch {}

      toast({ title: 'Insights generated and saved' });
    } catch (err) {
      toast({ title: 'Generation failed', description: err?.message, variant: 'destructive' });
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Creator Insights</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">Emerging gaps, audience intelligence, and content opportunity feed</p>
        </div>
        <Button onClick={generateInsights} disabled={generating} className="gradient-gold-button border-0">
          {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Researching...</> : <><Zap className="w-4 h-4 mr-2" />Generate Insights</>}
        </Button>
      </div>

      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
        <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
        <p className="text-yellow-300 text-xs"><strong>Platform Safety:</strong> All outreach and content suggestions require human review. No automated posting, engagement, or DMs from this system.</p>
      </div>

      {generating && (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Analysing creator landscape with live web search...</p>
          </CardContent>
        </Card>
      )}

      {insights && (
        <Card className="border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Eye className="w-4 h-4 text-primary" />Latest Intelligence Brief</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{insights}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Creator Gap Library */}
      {gaps.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />Creator Gap Library ({gaps.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gaps.map(gap => (
              <Card key={gap.id} className="border-border hover:border-primary/30 transition-all">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{gap.niche}</p>
                      <Badge variant="outline" className="text-xs mt-1">{gap.platform}</Badge>
                    </div>
                    <div className="text-right shrink-0">
                      {gap.viral_potential && <p className="text-xs text-green-400">Viral: {gap.viral_potential}/10</p>}
                      {gap.monetization_potential && <p className="text-xs text-blue-400">Revenue: {gap.monetization_potential}/10</p>}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{gap.gap_detected}</p>
                  {gap.recommended_action && <p className="text-xs text-primary">→ {gap.recommended_action}</p>}
                  <div className="flex gap-1 pt-1">
                    <Button size="sm" variant="outline" className="text-xs h-6" onClick={() => updateGapMutation.mutate({ id: gap.id, data: { status: 'actioning' } })}>Action</Button>
                    <Button size="sm" variant="ghost" className="text-xs h-6" onClick={() => updateGapMutation.mutate({ id: gap.id, data: { status: 'archived' } })}>
                      <Archive className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Audience Insights */}
      {audienceInsights.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />Audience Intelligence ({audienceInsights.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {audienceInsights.map(insight => (
              <Card key={insight.id}>
                <CardContent className="p-4">
                  <p className="font-medium text-sm">{insight.audience_type}</p>
                  {insight.pain_point && <p className="text-xs text-red-400 mt-1">Pain: {insight.pain_point.slice(0, 80)}...</p>}
                  {insight.desire && <p className="text-xs text-green-400 mt-0.5">Desire: {insight.desire.slice(0, 80)}...</p>}
                  {insight.recommended_content && <p className="text-xs text-primary mt-1">→ {insight.recommended_content.slice(0, 80)}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {gaps.length === 0 && !insights && !generating && (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Eye className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">No creator insights yet.</p>
          <p className="text-sm text-muted-foreground">Click "Generate Insights" to run a live creator intelligence scan.</p>
        </div>
      )}
    </div>
  );
}