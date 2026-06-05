import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Zap, RefreshCw, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import MetricoolBlocker from '@/components/social/MetricoolBlocker';

// Metricool is blocked until METRICOOL_API_TOKEN secret is set
// The token is never in the frontend — this is a UI-level informational block only
const METRICOOL_BLOCKED = false; // Token is set — REST API connected

const PLATFORMS = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram_reels', label: 'IG Reels' },
  { value: 'instagram_stories', label: 'IG Stories' },
  { value: 'instagram_feed', label: 'IG Feed' },
  { value: 'twitter_x', label: 'X / Twitter' },
];

const SPRINT_THEMES = [
  'Kickoff — emotional reveal, the gratitude angle',
  'Raw story — what the song is really about',
  'Behind the scenes — writing/studio process',
  'Merch + CD pre-order CTA',
  'Fan community love and appreciation',
  'Lyric teaser — most emotional line',
  'Countdown urgency — 5 days to go',
  'Personal message to supporters',
  'Final push — T-minus 2 days',
  'June 4 — studio/recording day, release eve content',
  'RELEASE DAY — June 5: Thank You is out now',
];

function CopyBtn({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
      {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : label}
    </button>
  );
}

function ResultSection({ data, platform }) {
  const [expanded, setExpanded] = useState({});
  const toggle = k => setExpanded(e => ({ ...e, [k]: !e[k] }));

  const fields = [
    { key: 'hook', label: 'Hook (1-3s)' },
    { key: 'caption', label: 'Caption' },
    { key: 'on_screen_text', label: 'On-Screen Text' },
    { key: 'shot_list', label: 'Shot List' },
    { key: 'edit_rhythm', label: 'Edit Rhythm' },
    { key: 'broll_ideas', label: 'B-Roll Ideas' },
    { key: 'cta', label: 'Call to Action' },
    { key: 'hashtags', label: 'Hashtags' },
    { key: 'content_notes', label: 'Production Notes' },
  ];

  return (
    <div className="space-y-2">
      {/* Metricool export — top of results */}
      {data.metricool_export && (
        <div className="bg-primary/5 border border-primary/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">📋 Metricool Ready Export</p>
            <CopyBtn text={data.metricool_export} label="Copy for Metricool" />
          </div>
          <pre className="font-body text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{data.metricool_export}</pre>
        </div>
      )}

      {fields.map(f => {
        const val = data[f.key];
        if (!val) return null;
        const long = val.length > 200;
        const isExpanded = expanded[f.key];
        return (
          <div key={f.key} className="bg-secondary/30 border border-border/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{f.label}</p>
              <div className="flex items-center gap-2">
                <CopyBtn text={val} />
                {long && (
                  <button onClick={() => toggle(f.key)} className="text-muted-foreground hover:text-foreground transition-colors">
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
            <p className={`font-body text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed ${long && !isExpanded ? 'line-clamp-3' : ''}`}>{val}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function SocialPostFactory() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [platform, setPlatform] = useState('tiktok');
  const [sprintDay, setSprintDay] = useState('1');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [savedId, setSavedId] = useState(null);

  const { data: assets = [] } = useQuery({
    queryKey: ['social-assets-factory'],
    queryFn: () => base44.entities.SocialAsset.filter({ campaign: 'thank_you_june5_sprint', status: 'ready' }, '-created_date', 50),
  });

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);
    setSavedId(null);

    const dayIdx = parseInt(sprintDay) - 1;
    const theme = SPRINT_THEMES[dayIdx] || SPRINT_THEMES[0];
    const isReleaseDay = parseInt(sprintDay) === 11;

    const RELEASE_DATE = new Date('2026-06-05');
    const daysLeft = Math.max(0, Math.ceil((RELEASE_DATE - new Date()) / (1000 * 60 * 60 * 24)));

    const readyAssets = assets.filter(a => !a.sprint_day || a.sprint_day === parseInt(sprintDay));
    const assetContext = readyAssets.length > 0
      ? `Available approved assets for this day: ${readyAssets.map(a => `${a.asset_type} — "${a.name}"${a.notes ? ' (' + a.notes + ')' : ''}`).join('; ')}`
      : 'No specific assets tagged for this day. Generate concept-only brief.';

    const prompt = `You are a premium music marketing strategist for Gannon Waye, Australian singer-songwriter.

Release: "Thank You" — June 5, 2026. ${daysLeft} days remaining.
Sprint Day ${sprintDay}/11 — Theme: ${theme}
Platform: ${PLATFORMS.find(p => p.value === platform)?.label}
${isReleaseDay ? 'THIS IS RELEASE DAY. Song is OUT. Use "Listen Now", "Out Now", "Available Everywhere".' : 'Song is NOT released. Never say "Out Now". Use "Pre-Save", "Coming June 5", "Drop date: June 5".'}

${assetContext}

Generate a SINGLE complete, production-ready content brief for this platform/day combination.
Be specific to Gannon Waye's brand: authenticity, vulnerability, warmth, community, safe spaces.
No generic AI filler. Write like a human who knows this story deeply.

Return JSON:
{
  "hook": "Stop-the-scroll first 1-3 seconds",
  "caption": "Full caption with line breaks and CTA",
  "on_screen_text": "Text overlay sequence with timing cues",
  "shot_list": "Ordered specific shots — framing, lighting, action",
  "edit_rhythm": "Cut timing, transitions, music sync points",
  "broll_ideas": "Specific B-roll — no generic placeholders",
  "cta": "One clear final action",
  "hashtags": "15-20 targeted hashtags — niche + mid + broad",
  "metricool_export": "Ready-to-paste for Metricool: caption + hashtags only, formatted, no instructions",
  "content_notes": "Production/posting notes"
}`;

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            hook: { type: 'string' }, caption: { type: 'string' },
            on_screen_text: { type: 'string' }, shot_list: { type: 'string' },
            edit_rhythm: { type: 'string' }, broll_ideas: { type: 'string' },
            cta: { type: 'string' }, hashtags: { type: 'string' },
            metricool_export: { type: 'string' }, content_notes: { type: 'string' }
          }
        }
      });

      setResult(res);

      // Auto-save to ContentCalendarPost + ApprovalQueue
      // Day 1 = May 26, Day 11 = June 5: offset = -(10 - (sprintDay-1)) = sprintDay - 11
      const RELEASE_DATE_STR = new Date('2026-06-05');
      RELEASE_DATE_STR.setDate(RELEASE_DATE_STR.getDate() - (10 - (parseInt(sprintDay) - 1)));
      const schedDate = RELEASE_DATE_STR.toISOString().split('T')[0];

      const post = await base44.entities.ContentCalendarPost.create({
        campaign: 'thank_you_june5_sprint',
        sprint_day: parseInt(sprintDay),
        scheduled_date: schedDate,
        platform,
        content_type: isReleaseDay ? 'release_day' : 'video_hook',
        hook: res.hook, caption: res.caption, hashtags: res.hashtags, cta: res.cta,
        shot_list: res.shot_list, on_screen_text: res.on_screen_text,
        edit_rhythm: res.edit_rhythm, broll_ideas: res.broll_ideas,
        content_notes: res.content_notes, metricool_export: res.metricool_export,
        status: 'pending_approval',
        source_chain: `SocialPostFactory → Day${sprintDay}/${platform} → ApprovalQueue`,
        generated_by: 'SocialPostFactory',
      });

      await base44.entities.ApprovalQueue.create({
        agent_name: 'Social Post Factory',
        action_title: `Day ${sprintDay} · ${platform} — ${theme}`,
        action_type: 'social_post',
        proposed_action: `HOOK: ${res.hook}\n\nCAPTION:\n${res.caption}\n\nCTA: ${res.cta}\n\nHASHTAGS: ${res.hashtags}\n\nMETRICOOL:\n${res.metricool_export}`,
        proposed_output: res.caption,
        status: 'pending',
        risk_level: 'low',
        requires_human_review: true,
        source_chain: `SocialPostFactory/Day${sprintDay}/${platform}`,
      });

      setSavedId(post.id);
      qc.invalidateQueries({ queryKey: ['sprint-posts'] });
      toast({ title: 'Brief generated + saved to approval queue ✓' });
    } catch (e) {
      toast({ title: 'Generation failed. Try again.', variant: 'destructive' });
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Release Sprint</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Social Post Factory</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Generate individual platform briefs · auto-saved to approval queue · Metricool export ready</p>
      </div>

      {/* Metricool API blocker */}
      <MetricoolBlocker isBlocked={METRICOOL_BLOCKED} />

      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Generate Brief</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Sprint Day</Label>
              <Select value={sprintDay} onValueChange={setSprintDay}>
                <SelectTrigger className="bg-secondary/50 border-border/40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 11 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      Day {i + 1} — {SPRINT_THEMES[i].slice(0, 40)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="bg-secondary/50 border-border/40"><SelectValue /></SelectTrigger>
                <SelectContent>{PLATFORMS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-secondary/20 rounded-lg p-3 text-xs font-body text-muted-foreground">
            <strong className="text-foreground">Day {sprintDay} theme:</strong> {SPRINT_THEMES[parseInt(sprintDay) - 1]}
            {assets.length > 0 && <span className="ml-2 text-green-400">· {assets.length} ready asset(s) available</span>}
          </div>

          <Button onClick={handleGenerate} disabled={generating} className="w-full gradient-gold-button border-0 gap-2">
            {generating
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating + saving to queue...</>
              : <><Zap className="w-4 h-4" /> Generate Brief for Day {sprintDay} · {PLATFORMS.find(p => p.value === platform)?.label}</>
            }
          </Button>

          {savedId && (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <Check className="w-4 h-4 text-green-400 shrink-0" />
              <p className="font-body text-xs text-green-400">Saved to ContentCalendarPost + ApprovalQueue · Pending your review</p>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-0 text-[10px] tracking-wider uppercase">Day {sprintDay}</Badge>
            <Badge className="bg-secondary text-muted-foreground border-0 text-[10px] tracking-wider uppercase">{PLATFORMS.find(p => p.value === platform)?.label}</Badge>
            <Badge className="bg-green-500/10 text-green-400 border-0 text-[10px] tracking-wider uppercase">Saved ✓</Badge>
          </div>
          <ResultSection data={result} platform={platform} />
        </div>
      )}
    </div>
  );
}