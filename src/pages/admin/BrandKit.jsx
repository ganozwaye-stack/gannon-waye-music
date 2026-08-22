import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, Palette, Type, Image as ImageIcon, Mic, Loader2, CheckCircle2, ExternalLink, Copy, Check } from 'lucide-react';

const BRAND_COLORS = [
  { name: 'Primary Gold', hex: '#F5D06E', token: '--primary', usage: 'CTAs, highlights, accents' },
  { name: 'Deep Gold', hex: '#C9A84C', token: '--accent', usage: 'Gradient pairs, hover states' },
  { name: 'Warm Gold', hex: '#FFE08A', token: '--chart-4', usage: 'Highlights, glows' },
  { name: 'Background Dark', hex: '#0F1116', token: '--background', usage: 'Page backgrounds' },
  { name: 'Card Dark', hex: '#161920', token: '--card', usage: 'Cards, panels' },
  { name: 'Foreground', hex: '#EBE4D4', token: '--foreground', usage: 'Body text' },
  { name: 'Muted Text', hex: '#7A7E88', token: '--muted-foreground', usage: 'Secondary text' },
  { name: 'Border', hex: '#262A33', token: '--border', usage: 'Borders, dividers' },
];

const TYPOGRAPHY = [
  { name: 'Playfair Display', role: 'Display / Headings', cssValue: "'Playfair Display', serif", sample: 'Gannon Waye' },
  { name: 'Poppins', role: 'Body / UI', cssValue: "'Poppins', sans-serif", sample: 'The language of choosing yourself.' },
];

const VOICE_GUIDELINES = [
  { label: 'Tone', value: 'Warm, authentic, vulnerable, hopeful. Never salesy.' },
  { label: 'Core Themes', value: 'Self-worth, boundaries, grief, courage, choosing yourself.' },
  { label: 'Signature Phrases', value: '"This is choosing yourself." · "More than music." · "I made it through."' },
  { label: 'Avoid', value: 'Hype, urgency tactics, false promises, toxic positivity.' },
  { label: 'Emoji', value: '🤍 sparingly for warmth. Never in headlines.' },
];

export default function BrandKit() {
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);
  const [copied, setCopied] = useState(null);
  const { toast } = { toast: () => {} };

  const { data: galleryImages = [] } = useQuery({
    queryKey: ['brandKitLogos'],
    queryFn: () => base44.entities.GalleryImage.filter({ category: 'professional_photo' }, '-image_date', 5),
  });

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePublishToGithub = async () => {
    setPublishing(true);
    setPublishResult(null);
    try {
      const response = await base44.functions.invoke('publishBrandKitToGithub', {});
      if (response.data?.status === 'success') {
        setPublishResult(response.data);
      } else {
        setPublishResult({ error: response.data?.error || 'Failed to publish' });
      }
    } catch (err) {
      setPublishResult({ error: err.message });
    }
    setPublishing(false);
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-1">Admin · Distribution</p>
          <h1 className="font-display text-3xl text-foreground">Brand Kit</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Brand assets, colors, typography, and voice guidelines — publishable to GitHub for Codex, Pressmaster, and HeyGen</p>
        </div>
        <Button onClick={handlePublishToGithub} disabled={publishing} className="gap-2">
          {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
          {publishing ? 'Publishing...' : 'Publish to GitHub'}
        </Button>
      </div>

      {/* Publish result */}
      {publishResult && !publishResult.error && (
        <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <div className="flex-1">
            <p className="font-body text-sm font-semibold text-foreground">Brand kit published to GitHub!</p>
            <p className="font-body text-xs text-muted-foreground">{publishResult.message}</p>
            {publishResult.repo_url && (
              <a href={publishResult.repo_url} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> {publishResult.repo_url}
              </a>
            )}
          </div>
        </div>
      )}
      {publishResult?.error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 flex items-center gap-3">
          <span className="text-red-400">⚠</span>
          <p className="font-body text-sm text-red-400">{publishResult.error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Colors */}
        <section className="bg-card/50 border border-border/40 rounded-xl p-6">
          <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2"><Palette className="w-5 h-5 text-primary" /> Brand Colors</h2>
          <div className="grid grid-cols-2 gap-3">
            {BRAND_COLORS.map(color => (
              <div key={color.name} className="bg-secondary/20 rounded-lg p-3">
                <div className="w-full h-16 rounded-md mb-2 border border-border/40" style={{ backgroundColor: color.hex }} />
                <p className="font-body text-xs font-semibold text-foreground">{color.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <code className="font-body text-[10px] text-muted-foreground">{color.hex}</code>
                  <button onClick={() => copyToClipboard(color.hex, color.name)} className="text-muted-foreground hover:text-primary">
                    {copied === color.name ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="font-body text-[9px] text-muted-foreground/60 mt-1">{color.usage}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="bg-card/50 border border-border/40 rounded-xl p-6">
          <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2"><Type className="w-5 h-5 text-primary" /> Typography</h2>
          <div className="space-y-4">
            {TYPOGRAPHY.map(font => (
              <div key={font.name} className="bg-secondary/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-body text-sm font-semibold text-foreground">{font.name}</p>
                  <Badge variant="secondary" className="text-[9px]">{font.role}</Badge>
                </div>
                <p className="text-foreground" style={{ fontFamily: font.cssValue, fontSize: '1.5rem' }}>{font.sample}</p>
                <code className="font-body text-[10px] text-muted-foreground mt-2 block">{font.cssValue}</code>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-secondary/10 rounded-lg">
            <p className="font-body text-[10px] text-muted-foreground">Google Fonts import:</p>
            <code className="font-body text-[9px] text-primary/70 block mt-1 break-all">@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700&family=Poppins:wght@300;400;500;600;700&display=swap');</code>
          </div>
        </section>

        {/* Voice & Tone */}
        <section className="bg-card/50 border border-border/40 rounded-xl p-6 lg:col-span-2">
          <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2"><Mic className="w-5 h-5 text-primary" /> Voice & Tone Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VOICE_GUIDELINES.map(g => (
              <div key={g.label} className="bg-secondary/20 rounded-lg p-4">
                <p className="font-body text-xs uppercase tracking-wider text-primary mb-1">{g.label}</p>
                <p className="font-body text-sm text-foreground/80">{g.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Logo / Reference Images */}
        <section className="bg-card/50 border border-border/40 rounded-xl p-6 lg:col-span-2">
          <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-primary" /> Logo & Reference Images</h2>
          {galleryImages.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No reference images yet. Upload professional photos in the Gallery admin.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {galleryImages.map(img => (
                <div key={img.id} className="rounded-lg overflow-hidden border border-border/40">
                  <img src={img.image_url} alt={img.title} className="w-full aspect-square object-cover" />
                  <p className="font-body text-[10px] text-muted-foreground p-2 truncate">{img.title}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* GitHub distribution info */}
      <section className="bg-card/50 border border-border/40 rounded-xl p-6">
        <h2 className="font-display text-xl text-foreground mb-3 flex items-center gap-2"><Github className="w-5 h-5 text-primary" /> GitHub Distribution</h2>
        <p className="font-body text-sm text-muted-foreground mb-3">Publishing creates a public repository <code className="text-primary">gannonwaye-brand-kit</code> with structured brand assets consumable by:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-secondary/20 rounded-lg p-4">
            <p className="font-body text-sm font-semibold text-foreground">Codex / AI Builders</p>
            <p className="font-body text-xs text-muted-foreground mt-1">Structured JSON brand tokens for consistent AI-generated content</p>
          </div>
          <div className="bg-secondary/20 rounded-lg p-4">
            <p className="font-body text-sm font-semibold text-foreground">Pressmaster Twin</p>
            <p className="font-body text-xs text-muted-foreground mt-1">Voice guidelines and bio for press release generation</p>
          </div>
          <div className="bg-secondary/20 rounded-lg p-4">
            <p className="font-body text-sm font-semibold text-foreground">HeyGen Avatars</p>
            <p className="font-body text-xs text-muted-foreground mt-1">Color palette and typography for video avatar styling</p>
          </div>
        </div>
      </section>
    </div>
  );
}