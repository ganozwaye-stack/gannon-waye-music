import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Loader2, Copy, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CREATIVE_TOOLS = [
  { id: 'social_caption', label: 'Social Caption', prompt: (input) => `Write 3 highly engaging social media captions for Gannon Waye's debut single 'Thank You'. Brand tone: authentic, emotionally honest, safe-space, LGBTQIA+ affirming, anti-bullying, warm and vulnerable. Context: ${input}\n\nFor each caption provide: caption text, 3-5 hashtags, best platform (TikTok/Instagram/both). Make them feel real, not corporate.` },
  { id: 'hook', label: 'Content Hook', prompt: (input) => `Write 5 powerful content hooks for Gannon Waye. The hook should stop the scroll and make someone feel seen. Context/theme: ${input}\n\nMake them authentic, emotional, and real. No corporate speak.` },
  { id: 'release_strategy', label: 'Release Strategy', prompt: (input) => `Create a music release strategy for Gannon Waye. Context: ${input}\n\nInclude: pre-release timeline, content plan, playlist pitching, community activation, social media rollout, email campaign timing. Budget assumption: minimal/organic only. Flag anything that would cost money for approval.` },
  { id: 'storytelling', label: 'Storytelling Content', prompt: (input) => `Write a storytelling social media post for Gannon Waye using the "This Is My Life" series format. Make it personal, vulnerable, real, and brand-aligned. Context: ${input}\n\nTone: warm, honest, safe-space. Format for Instagram caption.` },
  { id: 'merch_copy', label: 'Merch Copy', prompt: (input) => `Write compelling product description copy for Gannon Waye merch. Make it emotional and brand-aligned. Context: ${input}\n\nTone: authentic, personal, fan-connected. 2-3 versions: short (50 words), medium (100 words), long (200 words).` },
  { id: 'video_concept', label: 'Video Concept', prompt: (input) => `Create a video concept for Gannon Waye. Context: ${input}\n\nInclude: concept overview, visual direction, music/audio, location/setting, key moments, intended platform, organic budget approach. Flag if any element would cost money.` },
];

export default function CreativeStudio() {
  const [tool, setTool] = useState('social_caption');
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const qc = useQueryClient();

  const selectedTool = CREATIVE_TOOLS.find(t => t.id === tool);

  const generate = async () => {
    if (!input.trim()) return;
    setGenerating(true);
    setResult(null);
    const res = await base44.integrations.Core.InvokeLLM({ prompt: selectedTool.prompt(input) });
    setResult(res);
    setGenerating(false);
  };

  const saveToVault = useMutation({
    mutationFn: () => base44.entities.KnowledgeVault.create({ title: `${selectedTool.label}: ${input.substring(0,50)}`, category: 'creative', content: result, summary: input, tags: ['creative', tool, 'ai-generated'] }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['knowledge-vault'] }); toast.success('Saved to Creative Vault'); },
  });

  const { data: saved = [] } = useQuery({
    queryKey: ['creative-vault'],
    queryFn: () => base44.entities.KnowledgeVault.filter({ category: 'creative' }, '-created_date', 20),
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-gold-text">Creative Studio</h1>
        <p className="text-muted-foreground text-sm">Music, content, captions, hooks, strategy — auto-generated in your brand voice</p>
      </div>

      <div className="bg-pink-500/5 border border-pink-500/20 rounded-lg p-3 text-xs text-muted-foreground">
        Creative content is drafted automatically. Approval required only before publishing anything that creates legal, financial, or reputation risk.
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {CREATIVE_TOOLS.map(t => (
          <button key={t.id} onClick={() => setTool(t.id)}
            className={`p-3 rounded-lg border text-left text-sm transition-all ${tool === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <Textarea
          placeholder={`What's the context for your ${selectedTool?.label}? Be specific...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={3}
        />
        <Button onClick={generate} disabled={generating || !input.trim()} className="gradient-gold-button">
          {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Music className="w-4 h-4 mr-2" /> Generate</>}
        </Button>
      </div>

      {result && (
        <Card className="border-pink-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-pink-500/10 text-pink-400">{selectedTool?.label}</Badge>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied'); }}>
                  <Copy className="w-3 h-3 mr-1" /> Copy
                </Button>
                <Button size="sm" variant="outline" onClick={() => saveToVault.mutate()} disabled={saveToVault.isPending}>
                  <Save className="w-3 h-3 mr-1" /> Save
                </Button>
              </div>
            </div>
            <ReactMarkdown className="text-sm prose prose-sm prose-invert max-w-none">
              {result}
            </ReactMarkdown>
          </CardContent>
        </Card>
      )}

      {saved.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Saved Creative Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {saved.slice(0,6).map(item => (
              <Card key={item.id} className="hover:border-primary/30 transition-all">
                <CardContent className="p-3">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
                  <div className="flex gap-1 mt-2">{item.tags?.slice(0,3).map(t => <Badge key={t} className="bg-pink-500/10 text-pink-400 text-xs">{t}</Badge>)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}