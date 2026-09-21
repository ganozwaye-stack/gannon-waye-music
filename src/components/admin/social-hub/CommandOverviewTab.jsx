import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Loader2, Copy, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

// Lifted from src/pages/admin/SocialCommand.jsx — PLATFORMS and CONTENT_TYPES
// configs, campaign strategy and caption/hashtag generators, plus a per-channel
// overview of what is already sitting in the schedule.
const PLATFORMS = [
  { id: 'tiktok', label: 'TikTok', color: 'text-pink-400' },
  { id: 'instagram', label: 'Instagram', color: 'text-purple-400' },
  { id: 'youtube', label: 'YouTube', color: 'text-red-400' },
  { id: 'facebook', label: 'Facebook', color: 'text-blue-400' },
  { id: 'all', label: 'All Platforms', color: 'text-primary' },
];

const CONTENT_TYPES = ['Strategy & Growth Plan', 'Caption Pack (7 days)', 'Hashtag Research', 'Trending Sounds/Ideas', 'Community Response Templates', 'Bio Optimization'];

export default function CommandOverviewTab() {
  const [platform, setPlatform] = useState('tiktok');
  const [contentType, setContentType] = useState('Strategy & Growth Plan');
  const [context, setContext] = useState('');
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);

  const { data: posts = [] } = useQuery({
    queryKey: ['schedule-queue'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({}, 'scheduled_date', 200),
  });

  // Channel schedule overview — what is queued per platform right now.
  const channels = posts.reduce((acc, p) => {
    const key = p.platform || 'unassigned';
    if (!acc[key]) acc[key] = { total: 0, scheduled: 0, posted: 0 };
    acc[key].total += 1;
    if (p.status === 'scheduled') acc[key].scheduled += 1;
    if (p.status === 'posted') acc[key].posted += 1;
    return acc;
  }, {});

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
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-xl font-display font-bold gradient-gold-text">Schedule Queue &amp; Command Overview</h2>
        <p className="text-muted-foreground text-sm">Strategy, captions, hashtags, and growth plans for all social channels</p>
      </div>

      {/* Channel schedule overview */}
      <div>
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
          <Calendar className="w-3 h-3" /> Channel schedule overview
        </p>
        {Object.keys(channels).length === 0 ? (
          <p className="font-body text-xs text-muted-foreground">Nothing queued yet. Generate briefs in the Factory tab.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(channels).map(([key, c]) => (
              <Card key={key}>
                <CardContent className="p-3">
                  <p className="font-body text-xs font-semibold text-foreground capitalize">{key.replace(/_/g, ' ')}</p>
                  <p className="font-display text-xl text-primary mt-0.5">{c.total}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{c.scheduled} scheduled · {c.posted} posted</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map(p => (
          <button type="button" key={p.id} onClick={() => setPlatform(p.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${platform === p.id ? `border-primary bg-primary/10 ${p.color}` : 'border-border text-muted-foreground hover:border-primary/40'}`}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {CONTENT_TYPES.map(t => (
          <button type="button" key={t} onClick={() => setContentType(t)}
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
        <Button type="button" onClick={generate} disabled={generating} className="gradient-gold-button">
          {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Users className="w-4 h-4 mr-2" />Generate</>}
        </Button>
      </div>

      {result && (
        <Card className="border-teal-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-teal-500/10 text-teal-400">{PLATFORMS.find(p => p.id === platform)?.label} · {contentType}</Badge>
              <Button type="button" size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied'); }}>
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