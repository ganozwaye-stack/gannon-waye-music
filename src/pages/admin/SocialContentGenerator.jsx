import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Copy, Check, RefreshCw, Film, Hash } from 'lucide-react';

const PLATFORMS = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram_reels', label: 'Instagram Reels' },
  { value: 'instagram_feed', label: 'Instagram Feed Post' },
  { value: 'facebook', label: 'Facebook' },
];

const TONES = [
  { value: 'cinematic', label: 'Cinematic / Emotional', desc: 'Cinematic mood, sweeping visuals, deep emotion' },
  { value: 'raw_confessional', label: 'Raw / Confessional', desc: 'Direct to camera, honest, vulnerable, no filter' },
  { value: 'behind_the_scenes', label: 'Behind the Scenes', desc: 'Studio moments, writing process, real life' },
  { value: 'merch_preorder', label: 'Merch / Pre-order', desc: 'CD, hoodie, bundle, pre-order interest CTA' },
  { value: 'community_supporter', label: 'Community / Supporter Love', desc: 'Thank the audience, celebrate the movement' },
  { value: 'gift_manual_review', label: 'Gift Offer (Manual Review)', desc: 'Social follow gift — with honest manual verification note' },
];

const GOALS = [
  { value: 'follows', label: 'Grow Follows' },
  { value: 'subscriptions', label: 'Email Sign-ups' },
  { value: 'preorder_interest', label: 'Pre-order Interest' },
  { value: 'support_contributions', label: 'Support Contributions' },
  { value: 'shares', label: 'Shares / Virality' },
  { value: 'community_engagement', label: 'Community Engagement' },
];

const FOOTAGE_TYPES = [
  { value: 'none', label: 'No footage — generate concept only' },
  { value: 'selfie_direct', label: 'Direct-to-camera selfie footage' },
  { value: 'performance', label: 'Performance / singing footage' },
  { value: 'lifestyle', label: 'Lifestyle / daily life B-roll' },
  { value: 'studio', label: 'Studio / behind the scenes' },
  { value: 'product', label: 'Merch / product footage' },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
      {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function OutputSection({ title, content }) {
  if (!content) return null;
  return (
    <div className="bg-secondary/30 border border-border/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{title}</p>
        <CopyButton text={content} />
      </div>
      <p className="font-body text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}

export default function SocialContentGenerator() {
  const { toast } = useToast();
  const [platform, setPlatform] = useState('tiktok');
  const [tone, setTone] = useState('cinematic');
  const [goal, setGoal] = useState('follows');
  const [footage, setFootage] = useState('none');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generate = async () => {
    setLoading(true);
    setResult(null);

    const platformLabel = PLATFORMS.find(p => p.value === platform)?.label;
    const toneObj = TONES.find(t => t.value === tone);
    const goalLabel = GOALS.find(g => g.value === goal)?.label;
    const footageLabel = FOOTAGE_TYPES.find(f => f.value === footage)?.label;

    const giftNote = tone === 'gift_manual_review'
      ? `IMPORTANT: The gift offer requires manual review. Do not claim automatic Instagram or TikTok verification. Copy must clearly state that each entry is reviewed personally.`
      : '';

    const releaseNote = `The song has not yet been released. Release date is 05 June 2026 on all leading platforms. Never say 'Out Now', 'Listen Now', or 'Available Now' before that date.`;

    const prompt = `You are a premium music marketing strategist writing social content for Gannon Waye, an Australian singer-songwriter releasing his debut single "Thank You" on 05 June 2026.

The song is about gratitude born from heartbreak — when the rose-coloured glasses fell away and the hard truths became clear. It is powerful, emotional, and real. Gannon's brand values: authenticity, vulnerability, community, warmth, respect, and safe spaces.

Platform: ${platformLabel}
Tone/Style: ${toneObj?.label} — ${toneObj?.desc}
Primary Goal: ${goalLabel}
Available Footage: ${footageLabel}
${giftNote}
${releaseNote}

Generate a complete content brief. Avoid generic phrases, spammy language, fake guarantees, AI-sounding filler, or cheap hooks. Write like a human who knows this artist and this story deeply.

Return JSON with these exact fields:
{
  "hook": "First 1-3 seconds on-screen text or spoken hook. Must stop the scroll immediately.",
  "caption": "Full platform-appropriate caption (with line breaks). Personal, specific, campaign-aware. Include relevant CTA. Include release date where appropriate.",
  "on_screen_text": "Sequence of text overlays to appear during the video, listed in order with rough timing cues.",
  "shot_list": "Ordered list of specific shots or visual moments. Include framing, lighting mood, and what Gannon is doing in each.",
  "edit_rhythm": "Recommended edit pace, cut timing, transition style, music sync points. This is a brief for a human editor.",
  "broll_ideas": "Specific B-roll suggestions that match the tone and story — no generic 'lifestyle' placeholders.",
  "cta": "The final call to action for this platform. One clear action. No multiple CTAs.",
  "hashtags": "15-25 targeted hashtags for this platform. Mix of niche, mid, and broad. No spam.",
  "content_notes": "Any production or posting notes the creator or editor should know."
}`;

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            hook: { type: 'string' },
            caption: { type: 'string' },
            on_screen_text: { type: 'string' },
            shot_list: { type: 'string' },
            edit_rhythm: { type: 'string' },
            broll_ideas: { type: 'string' },
            cta: { type: 'string' },
            hashtags: { type: 'string' },
            content_notes: { type: 'string' },
          }
        }
      });
      setResult(res);
    } catch (e) {
      toast({ title: 'Generation failed. Try again.', variant: 'destructive' });
    }
    setLoading(false);
  };

  const copyAll = () => {
    if (!result) return;
    const text = Object.entries(result)
      .map(([k, v]) => `--- ${k.toUpperCase().replace(/_/g, ' ')} ---\n${v}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    toast({ title: 'Full brief copied to clipboard' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Campaign Tools</p>
        <h1 className="font-display text-2xl text-foreground">Social Content Generator</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Premium campaign-aware content briefs for the <em>Thank You</em> rollout — 05 June 2026
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-secondary/30 border border-border/40 rounded-xl p-4">
        <p className="font-body text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">How this works:</strong> This tool generates detailed content briefs — hooks, captions, shot lists, edit rhythm notes, and hashtags — that you or your editor can use to produce and post content. It does not automatically edit footage. All video editing is done by you using the brief as a guide.
        </p>
      </div>

      {/* Config */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Platform</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="bg-secondary/50 border-border/40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PLATFORMS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Campaign Goal</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger className="bg-secondary/50 border-border/40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {GOALS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Content Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="bg-secondary/50 border-border/40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TONES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {tone && (
            <p className="font-body text-[11px] text-muted-foreground mt-1">
              {TONES.find(t => t.value === tone)?.desc}
            </p>
          )}
        </div>
        <div>
          <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Available Footage</Label>
          <Select value={footage} onValueChange={setFootage}>
            <SelectTrigger className="bg-secondary/50 border-border/40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FOOTAGE_TYPES.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {tone === 'gift_manual_review' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <p className="font-body text-xs text-amber-400 leading-relaxed">
            <strong>Manual review note:</strong> Gift offer content will include clear language that each entry is personally reviewed. No automatic social verification will be implied.
          </p>
        </div>
      )}

      <Button
        onClick={generate}
        disabled={loading}
        className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2"
      >
        {loading
          ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating brief...</>
          : <><Sparkles className="w-4 h-4" /> Generate Content Brief</>
        }
      </Button>

      {/* Output */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-0 font-body text-[10px] tracking-wider uppercase">
                {PLATFORMS.find(p => p.value === platform)?.label}
              </Badge>
              <Badge className="bg-secondary text-muted-foreground border-0 font-body text-[10px] tracking-wider uppercase">
                {TONES.find(t => t.value === tone)?.label}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={copyAll} className="rounded-full font-body text-xs gap-1.5">
              <Copy className="w-3 h-3" /> Copy Full Brief
            </Button>
          </div>

          <OutputSection title="Hook (first 1-3 seconds)" content={result.hook} />
          <OutputSection title="Caption" content={result.caption} />
          <OutputSection title="On-Screen Text Sequence" content={result.on_screen_text} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-secondary/30 border border-border/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Shot List</p>
                </div>
                <CopyButton text={result.shot_list} />
              </div>
              <p className="font-body text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">{result.shot_list}</p>
            </div>
            <div className="bg-secondary/30 border border-border/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Edit Rhythm</p>
                <CopyButton text={result.edit_rhythm} />
              </div>
              <p className="font-body text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">{result.edit_rhythm}</p>
            </div>
          </div>

          <OutputSection title="B-Roll Ideas" content={result.broll_ideas} />
          <OutputSection title="Call to Action" content={result.cta} />

          <div className="bg-secondary/30 border border-border/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Hashtags</p>
              </div>
              <CopyButton text={result.hashtags} />
            </div>
            <p className="font-body text-sm text-foreground/85 leading-relaxed">{result.hashtags}</p>
          </div>

          {result.content_notes && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary mb-2">Production Notes</p>
              <p className="font-body text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">{result.content_notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}