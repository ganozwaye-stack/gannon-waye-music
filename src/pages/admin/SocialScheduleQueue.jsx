import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, CheckCircle2, Send, Copy, Check, ExternalLink, AlertTriangle, ChevronRight, X, ImageOff, Video } from 'lucide-react';
import MetricoolBlocker from '@/components/social/MetricoolBlocker';

const METRICOOL_BLOCKED = false; // Token is set — REST API connected

// Platforms that REQUIRE a visual/video — text-only posts cannot be scheduled
const VISUAL_REQUIRED_PLATFORMS = new Set(['tiktok', 'instagram_reels', 'instagram_stories', 'youtube_shorts', 'facebook']);

function isMetricoolReady(post) {
  if (!post.caption) return false;
  if (VISUAL_REQUIRED_PLATFORMS.has(post.platform)) {
    return !!(post.public_media_url && post.media_status === 'approved_public' && post.metricool_ready);
  }
  return true; // text-only platforms (twitter_x, instagram_feed) just need caption
}

const PLATFORM_META = {
  tiktok: { label: 'TikTok', color: 'text-red-400', bg: 'bg-red-500/10' },
  instagram_reels: { label: 'IG Reels', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  instagram_stories: { label: 'IG Stories', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  instagram_feed: { label: 'IG Feed', color: 'text-purple-300', bg: 'bg-purple-500/10' },
  twitter_x: { label: 'X / Twitter', color: 'text-sky-400', bg: 'bg-sky-500/10' },
  facebook: { label: 'Facebook', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  youtube_shorts: { label: 'YT Shorts', color: 'text-red-500', bg: 'bg-red-600/10' },
};

const STATUS_ORDER = ['visual_required', 'approved', 'scheduled', 'posted'];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
      {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function PostRow({ post, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const pm = PLATFORM_META[post.platform] || { label: post.platform, color: 'text-foreground', bg: 'bg-secondary' };
  const needsVisual = VISUAL_REQUIRED_PLATFORMS.has(post.platform);
  const ready = isMetricoolReady(post);
  const isVisualRequired = post.status === 'visual_required' || (needsVisual && !ready);

  const borderClass = post.status === 'scheduled'
    ? 'border-blue-500/30 bg-blue-500/5'
    : post.status === 'posted'
    ? 'border-green-500/20 opacity-70'
    : isVisualRequired
    ? 'border-amber-500/40 bg-amber-500/5'
    : 'border-border/50';

  return (
    <div className={`border rounded-xl transition-all ${borderClass}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left p-4 flex items-start gap-3">
        <div className={`${pm.bg} px-2 py-1 rounded-md shrink-0 mt-0.5`}>
          <span className={`font-body text-[10px] tracking-wider uppercase font-semibold ${pm.color}`}>{pm.label}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body text-sm font-semibold text-foreground">Day {post.sprint_day} · {post.scheduled_date}</p>
          <p className="font-body text-xs text-muted-foreground mt-0.5 line-clamp-2">{post.hook || post.caption?.slice(0, 100) || '—'}</p>
          {isVisualRequired && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <ImageOff className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Caption ready · Visual/video missing — NOT Metricool ready</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className={`text-[9px] tracking-wider uppercase border-0 ${
            post.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400'
            : post.status === 'posted' ? 'bg-green-500/10 text-green-400'
            : isVisualRequired ? 'bg-amber-500/10 text-amber-400'
            : 'bg-green-500/10 text-green-400'
          }`}>
            {isVisualRequired ? 'visual required' : post.status}
          </Badge>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border/40 p-4 space-y-3">
          {/* Visual blocker */}
          {isVisualRequired && (
            <div className="border border-amber-500/40 bg-amber-500/10 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-foreground/80">
                  <p className="font-semibold text-amber-300 mb-1">Metricool scheduling blocked — visual/video required</p>
                  <p>This is a <strong>{pm.label}</strong> post. Video/visual platforms require an approved public media URL before scheduling.</p>
                  <p className="mt-1">Required: <code className="bg-secondary/50 px-1 rounded">public_media_url</code> + <code className="bg-secondary/50 px-1 rounded">media_status = approved_public</code> + <code className="bg-secondary/50 px-1 rounded">metricool_ready = true</code></p>
                  {post.visual_brief && <p className="mt-1 text-muted-foreground">Visual brief: {post.visual_brief}</p>}
                </div>
              </div>
            </div>
          )}

          {post.metricool_export && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="font-body text-[10px] tracking-wider uppercase text-primary font-semibold">📋 Caption Ready (visual still needed)</p>
                <CopyBtn text={post.metricool_export} />
              </div>
              <pre className="font-body text-xs text-foreground/80 whitespace-pre-wrap">{post.metricool_export}</pre>
            </div>
          )}
          {post.caption && <div className="bg-secondary/30 rounded-xl p-3 font-body text-sm text-foreground/80 whitespace-pre-wrap">{post.caption}</div>}

          {/* Media info */}
          {post.public_media_url && (
            <div className="flex items-center gap-2 text-xs text-green-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Public media URL: <a href={post.public_media_url} target="_blank" rel="noopener noreferrer" className="underline">{post.public_media_url.slice(0, 60)}…</a></span>
            </div>
          )}

          <div className="flex gap-2 flex-wrap pt-1">
            {post.status === 'approved' && ready && (
              <Button size="sm" onClick={() => onStatusChange(post.id, 'scheduled')} className="gap-1.5 bg-blue-600 hover:bg-blue-700 border-0">
                <Calendar className="w-3 h-3" /> Mark Scheduled in Metricool
              </Button>
            )}
            {post.status === 'approved' && !ready && isVisualRequired && (
              <Button size="sm" disabled className="gap-1.5 opacity-40 cursor-not-allowed">
                <ImageOff className="w-3 h-3" /> Scheduling blocked — add visual first
              </Button>
            )}
            {post.status === 'scheduled' && (
              <Button size="sm" onClick={() => onStatusChange(post.id, 'posted')} className="gap-1.5 bg-green-600 hover:bg-green-700 border-0">
                <CheckCircle2 className="w-3 h-3" /> Mark as Posted
              </Button>
            )}
            {post.status !== 'posted' && ready && (
              <a href="https://app.metricool.com" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="gap-1.5"><ExternalLink className="w-3 h-3" /> Open Metricool</Button>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SocialScheduleQueue() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState('approved');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['schedule-queue'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ campaign: 'thank_you_june5_sprint' }, 'sprint_day', 200),
    refetchInterval: 30000,
  });

  const update = useMutation({
    mutationFn: ({ id, status }) => base44.entities.ContentCalendarPost.update(id, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['schedule-queue'] }); toast({ title: 'Status updated ✓' }); }
  });

  const byStatus = {
    visual_required: posts.filter(p => p.status === 'visual_required' || (VISUAL_REQUIRED_PLATFORMS.has(p.platform) && !isMetricoolReady(p) && p.status !== 'scheduled' && p.status !== 'posted')),
    approved: posts.filter(p => p.status === 'approved' && isMetricoolReady(p)),
    scheduled: posts.filter(p => p.status === 'scheduled'),
    posted: posts.filter(p => p.status === 'posted'),
  };
  const filtered = byStatus[tab] || [];

  // Group approved posts by date for calendar view
  const byDate = filtered.reduce((acc, p) => {
    const d = p.scheduled_date || 'Unknown';
    if (!acc[d]) acc[d] = [];
    acc[d].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Release Sprint</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Social Schedule Queue</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Approved posts → copy to Metricool → mark scheduled → mark posted</p>
      </div>

      {/* Metricool blocker */}
      <MetricoolBlocker isBlocked={METRICOOL_BLOCKED} />

      {/* Visual blocker warning */}
      {byStatus.visual_required.length > 0 && (
        <div className="border border-amber-500/40 bg-amber-500/10 rounded-xl p-3 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-foreground/80">
            <p className="font-semibold text-amber-300">{byStatus.visual_required.length} post{byStatus.visual_required.length !== 1 ? 's' : ''} blocked — caption ready, visual/video missing</p>
            <p className="text-muted-foreground mt-0.5">These posts are NOT Metricool ready. Video/visual platforms require an approved public media URL before scheduling. Do not schedule caption-only on TikTok, IG Reels, Stories, YouTube Shorts, or Facebook video.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { key: 'visual_required', label: 'Visual Missing', color: 'text-amber-400' },
          { key: 'approved', label: 'Ready to Schedule', color: 'text-green-400' },
          { key: 'scheduled', label: 'In Metricool', color: 'text-blue-400' },
          { key: 'posted', label: 'Posted Live', color: 'text-primary' },
        ].map(s => (
          <Card key={s.key} className={`cursor-pointer transition-all ${tab === s.key ? 'border-primary/60' : ''}`} onClick={() => setTab(s.key)}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold font-display ${s.color}`}>{byStatus[s.key]?.length || 0}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_ORDER.map(s => (
          <button key={s} onClick={() => setTab(s)}
            className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${tab === s ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)} ({byStatus[s]?.length || 0})
          </button>
        ))}
      </div>

      {/* Workflow guide for approved tab */}
      {tab === 'approved' && filtered.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 text-xs font-body text-muted-foreground space-y-1.5">
            <p className="text-primary font-semibold text-sm mb-2">How to Schedule in Metricool</p>
            <p>1. Click any post below to expand and see the Metricool Export field</p>
            <p>2. Copy the export text (caption + hashtags, pre-formatted)</p>
            <p>3. Open Metricool → New Post → paste → set date/time → Schedule</p>
            <p>4. Come back here → "Mark Scheduled in Metricool"</p>
            <p>5. After it goes live → "Mark as Posted"</p>
          </CardContent>
        </Card>
      )}

      {/* Posts */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-body text-sm">Loading...</div>
      ) : Object.keys(byDate).length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-xl">
          <Calendar className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">No {tab} posts yet. Approve content in the Release Sprint or Content Quality Review.</p>
        </div>
      ) : (
        Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, datePosts]) => (
          <div key={date}>
            <p className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> {date}
            </p>
            <div className="space-y-2">
              {datePosts.map(post => (
                <PostRow key={post.id} post={post} onStatusChange={(id, status) => update.mutate({ id, status })} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}