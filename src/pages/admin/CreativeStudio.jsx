import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Loader2, Copy, Save, Sparkles, ShieldAlert, Palette, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const CREATIVE_TOOLS = [
  { id: 'social_caption', label: 'Social Caption', prompt: (input) => `Write 3 highly engaging social media captions for Gannon Waye's debut single 'Thank You'. Brand tone: authentic, emotionally honest, safe-space, LGBTQIA+ affirming, anti-bullying, warm and vulnerable. Context: ${input}\n\nFor each caption provide: caption text, 3-5 hashtags, best platform (TikTok/Instagram/both). Make them feel real, not corporate.` },
  { id: 'hook', label: 'Content Hook', prompt: (input) => `Write 5 powerful content hooks for Gannon Waye. The hook should stop the scroll and make someone feel seen. Context/theme: ${input}\n\nMake them authentic, emotional, and real. No corporate speak.` },
  { id: 'release_strategy', label: 'Release Strategy', prompt: (input) => `Create a music release strategy for Gannon Waye. Context: ${input}\n\nInclude: pre-release timeline, content plan, playlist pitching, community activation, social media rollout, email campaign timing. Budget assumption: minimal/organic only. Flag anything that would cost money for approval.` },
  { id: 'storytelling', label: 'Storytelling Content', prompt: (input) => `Write a storytelling social media post for Gannon Waye using the "This Is My Life" series format. Make it personal, vulnerable, real, and brand-aligned. Context: ${input}\n\nTone: warm, honest, safe-space. Format for Instagram caption.` },
  { id: 'merch_copy', label: 'Merch Copy', prompt: (input) => `Write compelling product description copy for Gannon Waye merch. Make it emotional and brand-aligned. Context: ${input}\n\nTone: authentic, personal, fan-connected. 2-3 versions: short (50 words), medium (100 words), long (200 words).` },
  { id: 'video_concept', label: 'Video Concept', prompt: (input) => `Create a video concept for Gannon Waye. Context: ${input}\n\nInclude: concept overview, visual direction, music/audio, location/setting, key moments, intended platform, organic budget approach. Flag if any element would cost money.` },
];

const NOVA_PROMPTS = [
  { title: 'Cinematic Garden Backdrops', prompt: 'Cinematic photography of a lush gold and green garden, soft candle flickers in the background, dark moody atmosphere, gold sparkles in the breeze, shallow depth of field, 8k resolution, photorealistic.' },
  { title: 'THANKYOU Hoodie Showcase', prompt: 'Product mockup of a premium heavyweight black hoodie with "THANKYOU" printed in gold embroidery across the chest, clean dark gray marble surface background, soft dramatic spotlighting.' },
  { title: 'Tote Bag Mockup', prompt: 'Organic cotton tote bag lying flat, minimalist design with Sonia memorial graphic, neutral background, natural linen texture, soft morning shadows.' },
  { title: 'Album Cover Mockup (will you even listen)', prompt: 'Square album vinyl cover standing upright, featuring gold text overlay "will you even listen" over a textured dark abstract watercolor backdrop, ambient warm studio backlighting.' }
];

export default function CreativeStudio() {
  const [activeTab, setActiveTab] = useState('ai-generator');
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
    try {
      const res = await base44.integrations.Core.InvokeLLM({ prompt: selectedTool.prompt(input) });
      setResult(res);
    } catch (e) {
      toast.error('AI invocation failed. Check API configuration.');
    }
    setGenerating(false);
  };

  const saveToVault = useMutation({
    mutationFn: () => base44.entities.KnowledgeVault.create({ 
      title: `${selectedTool?.label}: ${input.substring(0,50)}`, 
      category: 'creative', 
      content: result, 
      summary: input, 
      tags: ['creative', tool, 'ai-generated'] 
    }),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['knowledge-vault'] }); 
      toast.success('Saved to Knowledge Vault'); 
    },
  });

  const { data: saved = [] } = useQuery({
    queryKey: ['creative-vault'],
    queryFn: () => base44.entities.KnowledgeVault.filter({ category: 'creative' }, '-created_date', 20),
  });

  return (
    <div className="p-6 space-y-6 pb-12">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Creative Suite</p>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Creative Studio Hub</h1>
        <p className="text-muted-foreground text-sm">Design visual mockups, construct copywriting, and audit brand aesthetics.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary/40 border border-border/40 grid grid-cols-2 md:grid-cols-4 gap-1.5 p-1 h-auto">
          <TabsTrigger value="ai-generator" className="text-xs py-2"><Sparkles className="w-3.5 h-3.5 mr-1 text-primary" /> AI Generator</TabsTrigger>
          <TabsTrigger value="nova-prompts" className="text-xs py-2"><Cpu className="w-3.5 h-3.5 mr-1 text-yellow-400" /> Nova Prompt Bank</TabsTrigger>
          <TabsTrigger value="governance" className="text-xs py-2"><ShieldAlert className="w-3.5 h-3.5 mr-1 text-red-500" /> Identity Rules</TabsTrigger>
          <TabsTrigger value="quick-links" className="text-xs py-2"><Palette className="w-3.5 h-3.5 mr-1" /> Studio Tools</TabsTrigger>
        </TabsList>

        {/* ─── TAB: AI GENERATOR ──────────────────────────────────────── */}
        <TabsContent value="ai-generator" className="space-y-6">
          <div className="bg-pink-500/5 border border-pink-500/20 rounded-lg p-3 text-xs text-muted-foreground">
            Creative copywriting drafts are generated using your brand parameters. Approvals are still required before publishing.
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
              className="bg-secondary/30"
            />
            <Button onClick={generate} disabled={generating || !input.trim()} className="gradient-gold-button border-0">
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
        </TabsContent>

        {/* ─── TAB: NOVA PROMPTS ──────────────────────────────────────── */}
        <TabsContent value="nova-prompts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NOVA_PROMPTS.map(p => (
              <Card key={p.title} className="border-border/40">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-white">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-secondary/30 rounded-lg text-xs font-mono text-muted-foreground border border-border/20">
                    {p.prompt}
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { navigator.clipboard.writeText(p.prompt); toast.success('Copied Prompt!'); }}>
                    Copy Prompt for Nova AI
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── TAB: IDENTITY GOVERNANCE ───────────────────────────────── */}
        <TabsContent value="governance" className="space-y-6">
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-destructive" /> Media & Identity Governance System
              </CardTitle>
              <CardDescription className="text-xs">Rule list to prevent identity distortion or product misrepresentation during AI-assisted creation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground">
              <div className="p-3 bg-secondary/30 rounded-xl space-y-2 border border-border/30">
                <p className="font-bold text-white uppercase tracking-wider">1. Gannon's Face & Persona</p>
                <p>• Do not generate fake or altered versions of Gannon's face using general prompts. All campaign posts must rely on approved real photos from the Brand Asset Vault.</p>
              </div>

              <div className="p-3 bg-secondary/30 rounded-xl space-y-2 border border-border/30">
                <p className="font-bold text-white uppercase tracking-wider">2. Memorial Wording & Sonia's Identity</p>
                <p>• Do not synthesize or fake images representing Sonia. Honor Sonia by preserving real, unaltered photographs. The AI Memorial Companion is a reflective, comforting chat guide, not Sonia herself.</p>
              </div>

              <div className="p-3 bg-secondary/30 rounded-xl space-y-2 border border-border/30">
                <p className="font-bold text-white uppercase tracking-wider">3. Exact Products Accuracy</p>
                <p>• Album covers, hoodies, mugs, and CD designs must correspond precisely to supplier specifications. Never generate modified design proofs that deviate from the production files.</p>
              </div>

              <div className="p-3 bg-secondary/30 rounded-xl space-y-2 border border-border/30">
                <p className="font-bold text-white uppercase tracking-wider">4. Drive Assets Structure</p>
                <p className="font-mono">
                  01 Brand Assets<br />
                  02 Campaign Assets<br />
                  03 Product Images<br />
                  04 Videos Raw<br />
                  05 Videos Edited<br />
                  06 TikTok Reviews<br />
                  07 Live Recordings<br />
                  08 Captions & Scripts<br />
                  09 Orders & Finance<br />
                  10 Systems Manager Clients<br />
                  11 Mum Memorial<br />
                  12 Story Vault
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB: QUICK LINKS ────────────────────────────────────────── */}
        <TabsContent value="quick-links" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Image Editor & Resizer', desc: 'Crop or adjust visual sizing for TikTok/Insta format.', link: '/admin/image-editor' },
              { title: 'Merch Visual Lab', desc: 'Mockup designs and layout overlays.', link: '/admin/merch-visual-lab' },
              { title: 'Social Asset Library', desc: 'View raw footage, templates, and thumbnails.', link: '/admin/social-asset-library' },
              { title: 'Merch Designs List', desc: 'Manage your primary merchandise vectors.', link: '/admin/merch-designs' }
            ].map(item => (
              <Card key={item.title} className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => window.location.href = item.link}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                    {item.title} <Palette className="w-3.5 h-3.5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}