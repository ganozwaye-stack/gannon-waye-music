import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Lightbulb, Zap, Loader2, Shield, TrendingUp, CheckCircle2, Archive, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

const CATEGORIES = ['business', 'ecommerce', 'saas', 'content', 'automation', 'customer_experience', 'social', 'marketing', 'product'];

const CAT_COLORS = {
  business: 'bg-purple-500/10 text-purple-400',
  ecommerce: 'bg-green-500/10 text-green-400',
  saas: 'bg-blue-500/10 text-blue-400',
  content: 'bg-pink-500/10 text-pink-400',
  automation: 'bg-cyan-500/10 text-cyan-400',
  customer_experience: 'bg-amber-500/10 text-amber-400',
  social: 'bg-rose-500/10 text-rose-400',
  marketing: 'bg-indigo-500/10 text-indigo-400',
  product: 'bg-lime-500/10 text-lime-400',
  other: 'bg-slate-500/10 text-slate-400',
};

const STATUS_COLORS = {
  new: 'bg-blue-500/10 text-blue-400',
  reviewing: 'bg-yellow-500/10 text-yellow-400',
  approved: 'bg-green-500/10 text-green-400',
  in_progress: 'bg-purple-500/10 text-purple-400',
  implemented: 'bg-emerald-500/10 text-emerald-400',
  rejected: 'bg-red-500/10 text-red-400',
  archived: 'bg-slate-500/10 text-slate-400',
};

const GENERATION_PROMPTS = {
  business: `Generate 5 premium business ideas for a music artist who is building a personal brand empire. 
Focus on: scalability, passive income, automation potential, premium experience. 
For each idea include: title, description, target_customer, problem_solved, premium_angle, revenue_potential_score (1-10), automation_potential_score (1-10), difficulty_score (1-10, 1=easy), risk_score (1-10), opportunity_score (1-100), estimated_monthly_value, recommended_next_step.`,

  ecommerce: `Generate 5 premium ecommerce product ideas for a music artist's online store.
Focus on: high margin, limited editions, bundles, emotional connection, scarcity, fan loyalty.
For each idea include: title, description, target_customer, problem_solved, premium_angle, revenue_potential_score (1-10), automation_potential_score (1-10), difficulty_score (1-10), risk_score (1-10), opportunity_score (1-100), estimated_monthly_value, recommended_next_step.`,

  saas: `Generate 5 SaaS product opportunities that could be built from this music artist's existing tech stack (AI agents, approvals, content management, fan CRM, mastering tools).
Focus on: niche markets, creator economy, recurring revenue, low cost to build.
For each idea include: title, description, target_customer, problem_solved, premium_angle, revenue_potential_score (1-10), automation_potential_score (1-10), difficulty_score (1-10), risk_score (1-10), opportunity_score (1-100), estimated_monthly_value, recommended_next_step.`,

  content: `Generate 10 viral content hooks and social media content ideas for a music artist with an authentic, emotional, LGBTQIA+ aligned brand.
For each include: title, description, premium_angle, opportunity_score (1-100), recommended_next_step.`,

  automation: `Generate 5 automation opportunities that could save time and increase revenue for a music artist's business operations.
Focus on: fan management, order processing, content scheduling, email automation, reporting.
For each idea include: title, description, problem_solved, automation_potential_score (1-10), difficulty_score (1-10), risk_score (1-10), opportunity_score (1-100), estimated_monthly_value, recommended_next_step.`,
};

export default function IdeasEngine() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('new');

  const { data: ideas = [], isLoading } = useQuery({
    queryKey: ['ideas'],
    queryFn: () => base44.entities.IdeaOpportunity.list('-created_date', 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.IdeaOpportunity.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ideas'] }),
  });

  const generateIdeas = async (category) => {
    setGenerating(true);
    setGeneratedText('');
    const prompt = GENERATION_PROMPTS[category] || GENERATION_PROMPTS.business;
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt + '\n\nReturn as a clean markdown list with clear sections for each idea.',
        add_context_from_internet: false,
      });
      setGeneratedText(result);
      // Also try to save structured versions
      try {
        const structured = await base44.integrations.Core.InvokeLLM({
          prompt: prompt + '\n\nReturn ONLY valid JSON array. Each object must have exactly these fields: title (string), description (string), target_customer (string), problem_solved (string), premium_angle (string), revenue_potential_score (number 1-10), automation_potential_score (number 1-10), difficulty_score (number 1-10), risk_score (number 1-10), opportunity_score (number 1-100), estimated_monthly_value (string), recommended_next_step (string).',
          response_json_schema: {
            type: 'object',
            properties: {
              ideas: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    target_customer: { type: 'string' },
                    problem_solved: { type: 'string' },
                    premium_angle: { type: 'string' },
                    revenue_potential_score: { type: 'number' },
                    automation_potential_score: { type: 'number' },
                    difficulty_score: { type: 'number' },
                    risk_score: { type: 'number' },
                    opportunity_score: { type: 'number' },
                    estimated_monthly_value: { type: 'string' },
                    recommended_next_step: { type: 'string' },
                  }
                }
              }
            }
          }
        });
        if (structured?.ideas?.length) {
          await Promise.all(structured.ideas.map(idea =>
            base44.entities.IdeaOpportunity.create({ ...idea, category, status: 'new', source_agent: 'Ideas Engine' })
          ));
          queryClient.invalidateQueries({ queryKey: ['ideas'] });
          toast({ title: `${structured.ideas.length} ideas saved to database` });
        }
      } catch {}
    } catch (err) {
      toast({ title: 'Generation failed', description: err?.message, variant: 'destructive' });
    }
    setGenerating(false);
  };

  const filteredIdeas = ideas.filter(i =>
    (activeCategory === 'all' || i.category === activeCategory) &&
    (activeStatus === 'all' || i.status === activeStatus)
  );

  const topIdeas = [...ideas].sort((a, b) => (b.opportunity_score || 0) - (a.opportunity_score || 0)).slice(0, 5);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Ideas Engine</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">AI-generated opportunities, innovations, and revenue ideas</p>
        </div>
        <div className="flex items-center gap-2 border border-yellow-500/30 bg-yellow-500/5 rounded-lg px-3 py-2">
          <Shield className="w-3 h-3 text-yellow-400" />
          <span className="text-xs text-yellow-300">Approval required before action</span>
        </div>
      </div>

      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate">Generate Ideas</TabsTrigger>
          <TabsTrigger value="library">Idea Library ({ideas.length})</TabsTrigger>
          <TabsTrigger value="top">Top Opportunities</TabsTrigger>
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generate New Ideas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Select a category to generate AI-powered ideas. Ideas are saved automatically.</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.keys(GENERATION_PROMPTS).map(cat => (
                  <Button
                    key={cat}
                    variant="outline"
                    size="sm"
                    onClick={() => generateIdeas(cat)}
                    disabled={generating}
                    className="capitalize text-xs"
                  >
                    {generating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Lightbulb className="w-3 h-3 mr-1" />}
                    {cat.replace('_', ' ')}
                  </Button>
                ))}
              </div>
              {generating && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  Generating ideas via AI...
                </div>
              )}
              {generatedText && (
                <div className="border border-border rounded-lg p-4 bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-green-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Generated</p>
                    <Button variant="ghost" size="sm" onClick={() => setGeneratedText('')} className="text-xs">Clear</Button>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none text-sm">
                    <ReactMarkdown>{generatedText}</ReactMarkdown>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Library Tab */}
        <TabsContent value="library" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={activeCategory === 'all' ? 'default' : 'outline'} onClick={() => setActiveCategory('all')} className="text-xs">All Categories</Button>
            {CATEGORIES.map(c => (
              <Button key={c} size="sm" variant={activeCategory === c ? 'default' : 'outline'} onClick={() => setActiveCategory(c)} className="text-xs capitalize">{c.replace('_', ' ')}</Button>
            ))}
          </div>
          <div className="flex gap-2">
            {['all', 'new', 'reviewing', 'approved', 'rejected'].map(s => (
              <Button key={s} size="sm" variant={activeStatus === s ? 'default' : 'ghost'} onClick={() => setActiveStatus(s)} className="text-xs capitalize">{s}</Button>
            ))}
          </div>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
          ) : filteredIdeas.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <Lightbulb className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No ideas found. Generate some above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIdeas.map(idea => <IdeaCard key={idea.id} idea={idea} onUpdate={(data) => updateMutation.mutate({ id: idea.id, data })} />)}
            </div>
          )}
        </TabsContent>

        {/* Top Tab */}
        <TabsContent value="top" className="mt-4">
          {topIdeas.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No ideas scored yet. Generate some first.</div>
          ) : (
            <div className="space-y-3">
              {topIdeas.map((idea, i) => (
                <div key={idea.id} className="border border-border rounded-lg p-4 flex items-start gap-4">
                  <span className="font-display text-3xl text-primary/20 leading-none mt-1">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{idea.title}</p>
                      {idea.opportunity_score && <Badge variant="outline" className="shrink-0">{idea.opportunity_score}/100</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{idea.description?.slice(0, 120)}...</p>
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      {idea.revenue_potential_score && <span>Revenue: {idea.revenue_potential_score}/10</span>}
                      {idea.automation_potential_score && <span>Automation: {idea.automation_potential_score}/10</span>}
                      {idea.difficulty_score && <span>Difficulty: {idea.difficulty_score}/10</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function IdeaCard({ idea, onUpdate }) {
  return (
    <Card className="h-full">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm leading-tight">{idea.title}</p>
          <div className="flex gap-1 shrink-0">
            {idea.opportunity_score && <Badge variant="outline" className="text-xs">{idea.opportunity_score}</Badge>}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge className={`text-xs ${CAT_COLORS[idea.category] || CAT_COLORS.other}`}>{idea.category?.replace('_', ' ')}</Badge>
          <Badge className={`text-xs ${STATUS_COLORS[idea.status] || ''}`}>{idea.status}</Badge>
        </div>
        {idea.description && <p className="text-xs text-muted-foreground line-clamp-3">{idea.description}</p>}
        {idea.estimated_monthly_value && <p className="text-xs text-green-400">Est. {idea.estimated_monthly_value}/mo</p>}
        {idea.recommended_next_step && (
          <div className="border-t border-border pt-2">
            <p className="text-xs text-muted-foreground"><strong className="text-foreground">Next:</strong> {idea.recommended_next_step}</p>
          </div>
        )}
        <div className="flex gap-1 pt-1">
          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => onUpdate({ status: 'approved' })}>Approve</Button>
          <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => onUpdate({ status: 'reviewing' })}>Review</Button>
          <Button size="sm" variant="ghost" className="text-xs h-7 text-muted-foreground" onClick={() => onUpdate({ status: 'archived' })}>
            <Archive className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}