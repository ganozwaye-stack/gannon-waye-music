import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, ArrowLeft, Video, DollarSign, TrendingUp, ChevronRight,
  Loader2, CheckCircle2, AlertTriangle, Music, Play, ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';

const CONTENT_FORMATS = [
  { id: 'behind_scenes', label: 'Behind the Scenes', desc: 'Studio recording, song writing, production process', cta: 'Shop merch in bio', revenue_link: 'Merch', effort: 'Low', potential: 'High' },
  { id: 'acoustic_cover', label: 'Acoustic / Stripped Version', desc: 'Just Gannon and a guitar — raw and emotional', cta: 'Listen to full version — link in bio', revenue_link: 'Streams + Merch', effort: 'Low', potential: 'Very High' },
  { id: 'lyric_breakdown', label: 'Lyric Story', desc: 'What does the line mean? Personal story behind lyrics', cta: 'Listen to the full song', revenue_link: 'Streams + Fan Connection', effort: 'Low', potential: 'High' },
  { id: 'fan_reaction', label: 'Fan Reaction Response', desc: 'React to a fan comment or DM — builds personal connection', cta: 'Reply in comments', revenue_link: 'Fan Loyalty + Merch', effort: 'Very Low', potential: 'High' },
  { id: 'day_in_life', label: 'Day in the Life', desc: 'Artist lifestyle content — morning routine, rehearsal, creative process', cta: 'Follow for more', revenue_link: 'Follower Growth + Merch', effort: 'Medium', potential: 'High' },
  { id: 'merch_reveal', label: 'Merch Reveal / Unboxing', desc: 'Show new merch arriving, quality, how it looks on', cta: 'Get yours — link in bio', revenue_link: 'Direct Merch Sales', effort: 'Low', potential: 'Very High' },
  { id: 'challenge', label: 'Song Challenge', desc: 'Challenge fans to recreate a hook, lyrics, or melody', cta: 'Use my sound and tag me', revenue_link: 'Streams + Viral Growth', effort: 'Medium', potential: 'Viral' },
];

const PIPELINE_STAGES = [
  { stage: 'Idea', desc: 'Content concept identified', color: 'bg-slate-500/20 text-slate-400' },
  { stage: 'Draft', desc: 'Brief written, ready to film', color: 'bg-blue-500/20 text-blue-400' },
  { stage: 'Recorded', desc: 'Video captured on device', color: 'bg-yellow-500/20 text-yellow-400' },
  { stage: 'Uploaded to Draft', desc: 'Submitted to TikTok as private draft', color: 'bg-orange-500/20 text-orange-400' },
  { stage: 'Approved', desc: 'Gannon approved for publishing', color: 'bg-green-500/20 text-green-400' },
  { stage: 'Live', desc: 'Published — tracking revenue attribution', color: 'bg-primary/20 text-primary' },
];

export default function ContentToCash() {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [brief, setBrief] = useState('');
  const [topic, setTopic] = useState('');
  const [tab, setTab] = useState('pipeline');

  const { data: videos = [] } = useQuery({
    queryKey: ['social-videos'],
    queryFn: () => base44.entities.SocialVideo.list('-created_date', 50),
  });

  const generateBrief = async () => {
    if (!selectedFormat || !topic) { toast.error('Select a format and enter a topic first'); return; }
    setGenerating(true);
    try {
      const format = CONTENT_FORMATS.find(f => f.id === selectedFormat);
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a TikTok content strategist for Gannon Waye, an independent Australian singer-songwriter.
        
Generate a detailed content brief for the following:
- Format: ${format.label}
- Topic/Angle: ${topic}
- Revenue Link: ${format.revenue_link}
- CTA: ${format.cta}

The brief should include:
1. Hook (first 3 seconds — what makes someone stop scrolling)
2. Opening line (spoken or shown)
3. Content structure (what happens in the 15-60 second video)
4. Emotional core (what feeling should viewer leave with)
5. Exact CTA (what to say/show at the end)
6. Caption (150 chars max, with 3-5 hashtags)
7. Best time to post (AEST)
8. Why this will drive ${format.revenue_link}

Keep it practical. Gannon will read this brief and film it himself. Make it feel natural, not scripted.`,
        response_json_schema: {
          type: 'object',
          properties: {
            hook: { type: 'string' },
            opening_line: { type: 'string' },
            structure: { type: 'string' },
            emotional_core: { type: 'string' },
            cta: { type: 'string' },
            caption: { type: 'string' },
            best_post_time: { type: 'string' },
            revenue_rationale: { type: 'string' },
          },
        },
      });
      setBrief(JSON.stringify(res, null, 2));
    } catch (err) {
      toast.error('Generation failed: ' + err.message);
    }
    setGenerating(false);
  };

  let parsedBrief = null;
  try { parsedBrief = JSON.parse(brief); } catch (_) {}

  const liveVideos = videos.filter(v => v.status === 'published' || v.platform_id);
  const draftVideos = videos.filter(v => v.status === 'draft' || v.status === 'pending');

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary/40 rounded transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Content-to-Cash Engine</h1>
          <p className="text-muted-foreground text-sm">Every piece of content has a revenue purpose — brief → film → draft → approve → publish → track</p>
        </div>
      </div>

      {/* Pipeline visual */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {PIPELINE_STAGES.map((s, i) => (
            <div key={s.stage} className="flex items-center gap-2">
              <div className={`${s.color} rounded-lg px-3 py-2 text-xs font-medium min-w-28 text-center`}>
                <p className="font-semibold">{s.stage}</p>
                <p className="text-[10px] opacity-70 mt-0.5">{s.desc}</p>
              </div>
              {i < PIPELINE_STAGES.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline ({videos.length})</TabsTrigger>
          <TabsTrigger value="brief">Brief Generator</TabsTrigger>
          <TabsTrigger value="formats">Formats</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Attribution</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Card><CardContent className="p-3"><p className="text-xl font-bold">{videos.length}</p><p className="text-xs text-muted-foreground">Total Videos</p></CardContent></Card>
            <Card><CardContent className="p-3"><p className="text-xl font-bold text-green-400">{liveVideos.length}</p><p className="text-xs text-muted-foreground">Live</p></CardContent></Card>
            <Card><CardContent className="p-3"><p className="text-xl font-bold text-yellow-400">{draftVideos.length}</p><p className="text-xs text-muted-foreground">In Draft</p></CardContent></Card>
            <Card><CardContent className="p-3"><p className="text-xl font-bold text-primary">{videos.filter(v=>v.revenue_attributed).length}</p><p className="text-xs text-muted-foreground">With Revenue</p></CardContent></Card>
          </div>
          {videos.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <Video className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No videos yet. Use the Brief Generator to start your first content piece.</p>
              <Button variant="outline" className="mt-3 text-xs" onClick={() => setTab('brief')}>Generate First Brief</Button>
            </div>
          ) : (
            videos.slice(0, 20).map(v => (
              <div key={v.id} className="border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="text-xs">{v.status || 'draft'}</Badge>
                      {v.platform && <Badge className="text-xs bg-secondary">{v.platform}</Badge>}
                    </div>
                    <p className="font-semibold text-sm">{v.title || 'Untitled Video'}</p>
                    {v.revenue_attributed && <p className="text-xs text-green-400 mt-0.5">💰 ${v.revenue_attributed} attributed</p>}
                  </div>
                  {v.platform_url && (
                    <a href={v.platform_url} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline" className="text-xs gap-1"><Play className="w-3 h-3" />View</Button>
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
          <div className="flex gap-2">
            <Link to="/tiktok-platform-review"><Button variant="outline" className="text-xs gap-1"><Video className="w-3 h-3" />TikTok Draft Studio</Button></Link>
            <Link to="/admin/social-content"><Button variant="outline" className="text-xs gap-1"><Zap className="w-3 h-3" />Social Content Gen</Button></Link>
          </div>
        </TabsContent>

        <TabsContent value="brief" className="mt-4 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">1. Choose a Content Format</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {CONTENT_FORMATS.map(f => (
                <button key={f.id} onClick={() => setSelectedFormat(f.id)}
                  className={`text-left border rounded-xl p-3 transition-all ${selectedFormat === f.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}>
                  <p className="font-semibold text-sm">{f.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-green-400">Revenue: {f.revenue_link}</span>
                    <span className="text-xs text-muted-foreground">Effort: {f.effort}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">2. Enter Your Topic / Angle</p>
            <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. 'Writing the bridge of Break The Walls' or 'What inspired the chorus'" className="text-sm" />
          </div>
          <Button className="gradient-gold-button border-0 gap-2" onClick={generateBrief} disabled={generating}>
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {generating ? 'Generating Brief...' : 'Generate Content Brief'}
          </Button>
          {parsedBrief && (
            <div className="space-y-3 border border-primary/20 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Generated Brief</p>
              {Object.entries(parsedBrief).map(([key, val]) => (
                <div key={key}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{key.replace(/_/g, ' ')}</p>
                  <p className="text-sm bg-secondary/30 rounded-lg p-2.5">{val}</p>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Link to="/tiktok-platform-review">
                  <Button size="sm" className="gradient-gold-button border-0 text-xs gap-1"><Video className="w-3 h-3" />Go to TikTok Studio</Button>
                </Link>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="formats" className="mt-4 space-y-3">
          {CONTENT_FORMATS.map(f => (
            <div key={f.id} className="border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm mb-1">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                  <div className="flex gap-3 mt-2 text-xs">
                    <span className="text-green-400">💰 {f.revenue_link}</span>
                    <span className="text-primary">CTA: {f.cta}</span>
                    <span className="text-muted-foreground">Effort: {f.effort} | Potential: {f.potential}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs shrink-0" onClick={() => { setSelectedFormat(f.id); setTab('brief'); }}>
                  Brief This
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="revenue" className="mt-4 space-y-4">
          <div className="bg-secondary/30 rounded-xl p-5">
            <p className="text-sm font-semibold mb-3">How Content Drives Revenue</p>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-2"><TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" /><p><strong className="text-foreground">Merch Sales:</strong> Merch reveal and lifestyle content directly drives store visits. Track via promo codes per video.</p></div>
              <div className="flex items-start gap-2"><Music className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" /><p><strong className="text-foreground">Streaming Revenue:</strong> Song-based content (lyric breakdowns, acoustic versions) drives Spotify/Apple saves.</p></div>
              <div className="flex items-start gap-2"><DollarSign className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /><p><strong className="text-foreground">Email List Growth:</strong> Fan connection content grows the email list. Email list drives 3-5x more revenue than social.</p></div>
              <div className="flex items-start gap-2"><Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" /><p><strong className="text-foreground">Coaching Pipeline:</strong> Behind-the-scenes and personal story content builds the authority needed for coaching programs.</p></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-green-500/20">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Highest Revenue Content Type</p>
                <p className="font-semibold text-sm">Merch Reveal</p>
                <p className="text-xs text-green-400">Direct store CTA → immediate sales</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Highest Viral Potential</p>
                <p className="font-semibold text-sm">Song Challenge</p>
                <p className="text-xs text-primary">UGC amplification → stream spike</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}