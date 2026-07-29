// @ts-nocheck
import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Shield, Loader2, Zap, TrendingUp, Users, Heart, Eye, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

const RULE = (
  <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
    <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
    <p className="text-yellow-300 text-xs"><strong>Platform Safety Rule:</strong> No automated engagement, mass following, DM spam, fake interactions, or paid follower purchases. All outreach suggestions require human approval before action.</p>
  </div>
);

const INTELLIGENCE_PROMPTS = {
  gaps: `Analyze the music creator space on TikTok and Instagram as of 2025-2026. Identify 8 underserved creator niches and emotional/content gaps that competitors are missing. Focus on: emotionally intelligent male artists, healing + music crossover, cinematic storytelling, vulnerability-driven content, LGBTQIA+ inclusive artist narratives, music documentary short form. For each gap: niche name, what's missing, why it matters emotionally, viral potential (1-10), monetization potential (1-10), difficulty (1-10), recommended angle. Return as a clear numbered list.`,
  audience: `Analyze the typical audience of an emotionally authentic, LGBTQIA+-inclusive music artist building a premium personal brand in Australia (2025). The artist creates music about resilience, identity, vulnerability, and connection. Identify 5 distinct audience segments with: audience type, core pain point, core desire, common language they use, content themes that resonate, emotional triggers, conversion potential (1-10), recommended content type, recommended offer or product.`,
  viral: `Identify 8 emerging viral content opportunities for a music artist on TikTok and Instagram in 2025. Focus on: trending emotional themes, underexplored storytelling formats, music + healing crossovers, behind-the-scenes authenticity, identity and resilience content. For each: trend name, platform, relevance to music artist (1-10), speed of growth (slow/steady/fast/explosive), competition level, recommended angle, recommended hook opening line, estimated trend lifespan.`,
  outreach: `Suggest 10 high-quality strategic creator collaboration and community engagement opportunities for a music artist focused on: emotional authenticity, LGBTQIA+ identity, healing, resilience, premium brand. Do NOT suggest spam or mass outreach. Focus on: aligned creators, complementary communities, meaningful conversations. For each: who to engage, platform, why they align, suggested approach, expected benefit, risk level (low/medium/high). All high-risk suggestions must be flagged for human review.`,
};

export default function SocialIntelligence() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(null);
  const [outputs, setOutputs] = useState({});
  const [showSuperfanForm, setShowSuperfanForm] = useState(false);
  const [superfanForm, setSuperfanForm] = useState({ username: '', platform: 'instagram', engagement_score: 50, support_level: 'engaged', notes: '' });

  const { data: superfans = [] } = useQuery({
    queryKey: ['superfans'],
    queryFn: () => base44.entities.SuperfanProfile.list('-created_date', 50),
  });

  const { data: viralOps = [] } = useQuery({
    queryKey: ['viral-ops'],
    queryFn: () => base44.entities.ViralOpportunity.list('-created_date', 20),
  });

  const createSuperfanMutation = useMutation({
    mutationFn: (data) => base44.entities.SuperfanProfile.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['superfans'] }); setShowSuperfanForm(false); toast({ title: 'Superfan profile saved' }); },
  });

  const runAnalysis = async (key) => {
    setLoading(key);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: INTELLIGENCE_PROMPTS[key],
        add_context_from_internet: true,
      });
      setOutputs(prev => ({ ...prev, [key]: result }));

      // Save to vault
      const titles = { gaps: 'Creator Gap Analysis', audience: 'Audience Intelligence Report', viral: 'Viral Opportunity Scan', outreach: 'Strategic Outreach Suggestions' };
      await base44.entities.KnowledgeVault.create({
        title: `Social Intelligence: ${titles[key]} — ${new Date().toLocaleDateString('en-AU')}`,
        category: 'research',
        content: result,
        summary: result.slice(0, 200),
        source: 'Social Intelligence Agent',
        access_level: 'admin_only',
        tags: ['social', 'intelligence', key],
      });
      toast({ title: 'Saved to Knowledge Vault' });
    } catch (err) {
      toast({ title: 'Analysis failed', description: err?.message, variant: 'destructive' });
    }
    setLoading(null);
  };

  const ANALYSIS_CARDS = [
    { key: 'gaps', label: 'Creator Gap Analysis', icon: Eye, color: 'text-purple-400', desc: 'Find underserved niches competitors are missing' },
    { key: 'audience', label: 'Audience Intelligence', icon: Users, color: 'text-blue-400', desc: 'Deep profile of your ideal audience segments' },
    { key: 'viral', label: 'Viral Opportunity Scan', icon: TrendingUp, color: 'text-green-400', desc: 'Identify emerging trends before saturation' },
    { key: 'outreach', label: 'Strategic Outreach', icon: Heart, color: 'text-pink-400', desc: 'High-quality collaboration opportunities' },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Social Intelligence</h1>
        <p className="text-muted-foreground text-sm mt-1 font-body">AI-powered audience growth, creator gap analysis, and viral opportunity detection</p>
      </div>

      {RULE}

      <Tabs defaultValue="analysis">
        <TabsList>
          <TabsTrigger value="analysis">Intelligence Analysis</TabsTrigger>
          <TabsTrigger value="superfans">Superfan Tracker ({superfans.length})</TabsTrigger>
          <TabsTrigger value="viral">Viral Ops ({viralOps.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ANALYSIS_CARDS.map(card => (
              <Card key={card.key}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                    {card.label}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{card.desc}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button size="sm" variant="outline" className="w-full" onClick={() => runAnalysis(card.key)} disabled={loading === card.key}>
                    {loading === card.key ? <><Loader2 className="w-3 h-3 mr-2 animate-spin" />Analysing with web search...</> : <><Zap className="w-3 h-3 mr-2" />Run Analysis</>}
                  </Button>
                  {outputs[card.key] && (
                    <div className="border border-border rounded-lg p-3 bg-card/50 max-h-72 overflow-y-auto">
                      <Badge className="bg-green-500/10 text-green-400 text-xs mb-2">Complete</Badge>
                      <div className="prose prose-sm prose-invert max-w-none text-xs">
                        <ReactMarkdown>{outputs[card.key]}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="superfans" className="mt-4 space-y-4">
          <Button onClick={() => setShowSuperfanForm(true)} size="sm" className="gradient-gold-button border-0"><Plus className="w-4 h-4 mr-1" />Add Superfan</Button>
          {superfans.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl text-muted-foreground">No superfan profiles yet. Add high-value supporters manually.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {superfans.map(fan => (
                <Card key={fan.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">@{fan.username}</p>
                        <p className="text-xs text-muted-foreground capitalize">{fan.platform}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-primary/10 text-primary text-xs">{fan.support_level}</Badge>
                        {fan.engagement_score && <p className="text-xs text-muted-foreground mt-1">{fan.engagement_score}/100</p>}
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {fan.shared_content && <Badge variant="outline" className="text-xs">Shared content</Badge>}
                      {fan.purchase_interest && <Badge variant="outline" className="text-xs">Purchase intent</Badge>}
                      {fan.collaboration_potential && <Badge variant="outline" className="text-xs">Collab potential</Badge>}
                    </div>
                    {fan.notes && <p className="text-xs text-muted-foreground mt-2">{fan.notes}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Dialog open={showSuperfanForm} onOpenChange={setShowSuperfanForm}>
            <DialogContent className="max-w-sm">
              <DialogHeader><DialogTitle>Add Superfan Profile</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label className="text-xs">Username *</Label><Input value={superfanForm.username} onChange={e => setSuperfanForm(f => ({ ...f, username: e.target.value }))} placeholder="@username" /></div>
                <div>
                  <Label className="text-xs">Platform</Label>
                  <Select value={superfanForm.platform} onValueChange={v => setSuperfanForm(f => ({ ...f, platform: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['instagram', 'tiktok', 'youtube', 'twitter', 'email', 'other'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Support Level</Label>
                  <Select value={superfanForm.support_level} onValueChange={v => setSuperfanForm(f => ({ ...f, support_level: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['follower', 'engaged', 'superfan', 'collaborator', 'vip'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Notes</Label><Input value={superfanForm.notes} onChange={e => setSuperfanForm(f => ({ ...f, notes: e.target.value }))} placeholder="Interaction history, context..." /></div>
                <Button className="w-full gradient-gold-button border-0" disabled={!superfanForm.username} onClick={() => createSuperfanMutation.mutate(superfanForm)}>Save Profile</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="viral" className="mt-4">
          {viralOps.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Run "Viral Opportunity Scan" in the Analysis tab to populate this feed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {viralOps.map(op => (
                <Card key={op.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{op.trend}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">{op.platform}</Badge>
                          {op.speed_of_growth && <Badge variant="outline" className="text-xs">{op.speed_of_growth}</Badge>}
                          {op.competition_level && <Badge variant="outline" className="text-xs">{op.competition_level} competition</Badge>}
                        </div>
                        {op.recommended_hook && <p className="text-xs text-primary mt-2 italic">Hook: "{op.recommended_hook}"</p>}
                      </div>
                      {op.relevance_score && <Badge className="bg-green-500/10 text-green-400 shrink-0">{op.relevance_score}/10</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}