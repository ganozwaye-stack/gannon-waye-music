import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Loader2, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const PLATFORMS = [
  { id: 'tiktok', label: 'TikTok', color: 'text-pink-400' },
  { id: 'instagram', label: 'Instagram', color: 'text-purple-400' },
  { id: 'youtube', label: 'YouTube', color: 'text-red-400' },
  { id: 'facebook', label: 'Facebook', color: 'text-blue-400' },
  { id: 'all', label: 'All Platforms', color: 'text-primary' },
];

const CONTENT_TYPES = ['Strategy & Growth Plan','Caption Pack (7 days)','Hashtag Research','Trending Sounds/Ideas','Community Response Templates','Bio Optimization'];

export default function SocialCommand() {
  const [platform, setPlatform] = useState('tiktok');
  const [contentType, setContentType] = useState('Strategy & Growth Plan');
  const [context, setContext] = useState('');
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    setResult(null);
    const platformLabel = PLATFORMS.find(p => p.id === platform)?.label || platform;
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a social media strategist for Gannon Waye, an Australian artist. Brand: authentic, emotionally honest, safe-space, LGBTQIA+ affirming, anti-bullying, warm and vulnerable.\n\nCreate: ${contentType} for ${platformLabel}.\nContext: ${context || 'Focus on the debut single Thank You and building genuine fan connection.'}\n\nAll content should be organic (no paid spend). Flag anything that would require budget with "APPROVAL REQUIRED". Be specific, practical, and brand-aligned.`,
      add_context_from_internet: true,
    });
    setResult(res);
    setGenerating(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-gold-text">Social Command</h1>
        <p className="text-muted-foreground text-sm">Strategy, captions, hashtags, and growth plans for all social channels</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map(p => (
          <button key={p.id} onClick={() => setPlatform(p.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${platform === p.id ? `border-primary bg-primary/10 ${p.color}` : 'border-border text-muted-foreground hover:border-primary/40'}`}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {CONTENT_TYPES.map(t => (
          <button key={t} onClick={() => setContentType(t)}
            className={`p-2 rounded-lg border text-xs text-left transition-all ${contentType === t ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <Textarea
          placeholder="Additional context (optional)..."
          value={context}
          onChange={e => setContext(e.target.value)}
          rows={2}
        />
        <Button onClick={generate} disabled={generating} className="gradient-gold-button">
          {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Users className="w-4 h-4 mr-2" />Generate</>}
        </Button>
      </div>

      {result && (
        <Card className="border-teal-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-teal-500/10 text-teal-400">{PLATFORMS.find(p=>p.id===platform)?.label} · {contentType}</Badge>
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