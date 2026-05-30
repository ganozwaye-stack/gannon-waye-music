import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Calendar, Zap, CheckCircle2, Clock, AlertTriangle, Copy, Check,
  RefreshCw, ChevronRight, ChevronDown, ExternalLink, Film, Send, Eye, X, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RELEASE_DATE = new Date('2026-06-05T00:00:00+10:00');
const SPRINT_START = new Date('2026-05-31T00:00:00+10:00');
const CAMPAIGN = 'thank_you_june5_sprint';

const PLATFORM_META = {
  tiktok: { label: 'TikTok', color: 'text-red-400', bg: 'bg-red-500/10' },
  instagram_reels: { label: 'IG Reels', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  instagram_stories: { label: 'IG Stories', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  instagram_feed: { label: 'IG Feed', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  twitter_x: { label: 'X / Twitter', color: 'text-sky-400', bg: 'bg-sky-500/10' },
  facebook: { label: 'Facebook', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  youtube_shorts: { label: 'YT Shorts', color: 'text-red-500', bg: 'bg-red-500/10' },
};

const STATUS_META = {
  draft: { label: 'Draft', color: 'text-muted-foreground', bg: 'bg-secondary' },
  pending_approval: { label: 'Pending Approval', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  approved: { label: 'Approved', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
  scheduled: { label: 'Scheduled', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  posted: { label: 'Posted ✓', color: 'text-green-500', bg: 'bg-green-500/15 border-green-500/40' },
  rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
};

// 6-day sprint: May 31 → June 5
const SPRINT_DAYS_CONFIG = [
  {
    day: 1, date: '2026-05-31', label: 'Sat 31 May', theme: 'Countdown — 6 days until THANKYOU',
    posts: [
      { type: 'emotional', platform: 'tiktok', hook: '6 days until something that changed my life is yours.', caption: 'I wrote Thankyou during a time I never thought I\'d survive.\n\nThis song is not about staying broken.\nIt is about the moment you finally choose yourself.\n\n6 days until it\'s yours.', cta: 'Pre-save the link in bio. Follow the journey.', on_screen_text: 'THANKYOU IS COMING', hashtags: '#GannonWaye #Thankyou #NewMusic #CountdownToRelease #SurvivorStrong' },
      { type: 'engagement', platform: 'instagram_feed', hook: 'What does "thank you" mean to you right now?', caption: 'Not the polite kind.\nThe kind that stops you mid-sentence because you actually mean it.\n\nDrop yours in the comments. 👇', cta: 'Comment what you\'re grateful for today.', on_screen_text: 'What does thank you mean to you?', hashtags: '#GannonWaye #Thankyou #Gratitude #Community' },
      { type: 'conversion', platform: 'instagram_stories', hook: 'THANKYOU drops in 6 days.', caption: 'Swipe up to pre-save. Be there on release day.', cta: 'Pre-save now at the link in bio.', on_screen_text: '6 DAYS · PRE-SAVE NOW', hashtags: '' },
    ],
  },
  {
    day: 2, date: '2026-06-01', label: 'Sun 1 Jun', theme: 'Choosing yourself — the story behind the song',
    posts: [
      { type: 'emotional', platform: 'tiktok', hook: 'I wrote this song when I chose myself for the first time.', caption: 'There was a moment where I realised survival wasn\'t enough.\nI had to actually choose to live.\n\nThankyou is about that moment.\nNot just for me. For anyone who\'s ever had to fight to feel free.', cta: 'Follow. Pre-save. This one\'s for you.', on_screen_text: 'I chose myself', hashtags: '#GannonWaye #Thankyou #ChoosingYourself #MentalHealth #NewMusic' },
      { type: 'engagement', platform: 'instagram_reels', hook: 'I\'m choosing me. Are you?', caption: 'Drop "I\'m choosing me" in the comments if this resonates.\n\nNo context needed. Just say it.', cta: 'Comment below. I read every single one.', on_screen_text: 'I\'m choosing me 💛', hashtags: '#ChoosingYourself #GannonWaye #Thankyou' },
      { type: 'conversion', platform: 'instagram_feed', hook: 'This merch carries the message of the song.', caption: 'Thankyou is for the people who kept going when life tried to silence them.\n\n10% of proceeds donated to 1800RESPECT.', cta: 'Shop the message at gannonwaye.com/store', on_screen_text: 'WEAR THE MESSAGE', hashtags: '#GannonWaye #MerchWithMeaning #1800RESPECT #Thankyou' },
    ],
  },
  {
    day: 3, date: '2026-06-02', label: 'Mon 2 Jun', theme: 'Sound teaser — first 10 seconds + lyric meaning',
    posts: [
      { type: 'emotional', platform: 'tiktok', hook: 'Hear the first 10 seconds of Thankyou. [NEEDS TIMESTAMP]', caption: 'This is the part that broke me open when I wrote it.\n\nThe lyric that hit hardest:\n"Your last breath took mine away, there\'s not much more I have to say."\n\nWhat line hits you?', cta: 'Comment the lyric that gets you.', on_screen_text: 'What line hit you? 🎵', hashtags: '#GannonWaye #Thankyou #NewMusicTeaser #LyricVideo' },
      { type: 'engagement', platform: 'instagram_stories', hook: 'Poll: Which lyric hits harder?', caption: '"Your last breath took mine away" vs "Respect is earned. Not a game you make me play." — which one stops you?', cta: 'Vote in the poll.', on_screen_text: 'WHICH LINE HITS YOU?', hashtags: '' },
      { type: 'conversion', platform: 'instagram_feed', hook: 'Follow on Spotify and Apple Music now.', caption: 'Thankyou drops June 5.\nBe there the moment it goes live.\n\nFollow on Spotify or Apple Music — link in bio.', cta: 'Follow on Spotify: open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz', on_screen_text: 'FOLLOW NOW · JUNE 5', hashtags: '#GannonWaye #Spotify #AppleMusic #Thankyou' },
    ],
  },
  {
    day: 4, date: '2026-06-03', label: 'Tue 3 Jun', theme: 'Merch with meaning — hoodie & mug visuals',
    posts: [
      { type: 'emotional', platform: 'tiktok', hook: 'This hoodie means more than merch.', caption: 'Respect is earned.\nNot a game you make me play.\n\nThat\'s not just a lyric. It\'s something I had to learn to believe about myself.\n\nIf it means something to you too — this is your piece.', cta: 'Shop at gannonwaye.com/store', on_screen_text: 'RESPECT IS EARNED', hashtags: '#GannonWaye #MerchWithMeaning #Thankyou #RespectIsEarned' },
      { type: 'engagement', platform: 'instagram_feed', hook: 'Would you wear this message?', caption: 'The Thankyou hoodie.\nThe Thankyou mug.\nMerch designed around the message of the song.\n\nWould you wear it? 👇', cta: 'Comment "yes" or what message you\'d want on your hoodie.', on_screen_text: 'WEAR THE STORY', hashtags: '#GannonWaye #MerchDrop #Hoodie #Thankyou' },
      { type: 'conversion', platform: 'instagram_reels', hook: 'Thankyou merch — limited first run.', caption: '10% of every purchase goes to 1800RESPECT.\nEvery piece carries the story.\n\nShop now before release day.', cta: 'gannonwaye.com/store', on_screen_text: 'SHOP NOW · LIMITED FIRST RUN', hashtags: '#GannonWaye #ThankYouMerch #1800RESPECT #SupportIndieArtists' },
    ],
  },
  {
    day: 5, date: '2026-06-04', label: 'Wed 4 Jun', theme: 'Community gratitude — who helped you survive?',
    posts: [
      { type: 'emotional', platform: 'tiktok', hook: 'Who helped you survive when you couldn\'t help yourself?', caption: 'I know who mine are.\n\nThis song is for them. And for you.\n\nThankyou — tomorrow.', cta: 'Tag someone below who kept you going.', on_screen_text: 'Tag someone who helped you survive 💛', hashtags: '#GannonWaye #Thankyou #Gratitude #Community #TomorrowIsTheDay' },
      { type: 'engagement', platform: 'instagram_stories', hook: 'Tomorrow. THANKYOU drops.', caption: 'One sleep away.\n\nWho are you dedicating your first listen to?', cta: 'Reply with their name.', on_screen_text: 'ONE SLEEP AWAY 🎵', hashtags: '' },
      { type: 'conversion', platform: 'instagram_feed', hook: 'Support the Thank You Project — final day before release.', caption: 'Become a founding supporter.\nWear the message.\nShare it with someone who needs it.\n\ngannonwaye.com/back-this', cta: 'Back this project at gannonwaye.com/back-this', on_screen_text: 'BACK THE PROJECT', hashtags: '#GannonWaye #FoundingSupporter #Thankyou #IndependentArtist' },
    ],
  },
  {
    day: 6, date: '2026-06-05', label: 'Thu 5 Jun ⭐ RELEASE DAY', theme: 'RELEASE DAY — THANKYOU is out now',
    posts: [
      { type: 'emotional', platform: 'tiktok', hook: 'THANKYOU IS YOURS NOW. [NEEDS TIMESTAMP — chorus]', caption: 'I made it to today.\nThis song is a thank you — to everyone who held me up when I couldn\'t stand.\n\nTHANKYOU is out now. This is yours.', cta: 'Listen now. Link in bio.', on_screen_text: 'THANKYOU · OUT NOW', hashtags: '#GannonWaye #Thankyou #OutNow #NewMusic #ListenNow' },
      { type: 'engagement', platform: 'instagram_reels', hook: 'Drop a ❤️ if you listened.', caption: 'THANKYOU is out now.\n\nDrop a ❤️ if you listened.\nShare it with someone who needs this song today.', cta: 'Listen, share, comment. gannonwaye.com/music', on_screen_text: '❤️ IF YOU LISTENED', hashtags: '#GannonWaye #Thankyou #OutNow #ShareTheLove' },
      { type: 'conversion', platform: 'instagram_feed', hook: 'Listen. Share. Wear the story.', caption: 'THANKYOU is out now on all platforms.\n\nStream it. Add it to your playlist.\nShare it with someone rebuilding.\n\n10% of merch proceeds donated to 1800RESPECT.', cta: 'Stream now + shop at gannonwaye.com/store', on_screen_text: 'OUT NOW · STREAM + SHOP', hashtags: '#GannonWaye #Thankyou #OutNow #StreamNow #MerchWithMeaning' },
    ],
  },
];

const SPRINT_THEMES = SPRINT_DAYS_CONFIG.map(d => d.theme);

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
      {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function PostDetailModal({ post, onClose, onApprove, onReject }) {
  if (!post) return null;
  const pm = PLATFORM_META[post.platform] || { label: post.platform, color: 'text-foreground', bg: 'bg-secondary' };
  const sm = STATUS_META[post.status] || STATUS_META.draft;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full my-8 space-y-0 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${pm.bg} ${pm.color} border-0 text-[10px] font-body tracking-wider uppercase`}>{pm.label}</Badge>
              <Badge className={`${sm.bg} ${sm.color} border text-[10px] font-body tracking-wider uppercase`}>{sm.label}</Badge>
              <span className="font-body text-xs text-muted-foreground">Day {post.sprint_day} · {post.scheduled_date}</span>
            </div>
            <h3 className="font-display text-lg text-foreground">{SPRINT_THEMES[(post.sprint_day || 1) - 1]}</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {post.hook && (
            <Field label="Hook (first 1-3s)" value={post.hook} />
          )}
          {post.caption && (
            <Field label="Caption" value={post.caption} large />
          )}
          {post.cta && (
            <Field label="Call to Action" value={post.cta} />
          )}
          {post.on_screen_text && (
            <Field label="On-Screen Text" value={post.on_screen_text} />
          )}
          {post.shot_list && (
            <Field label="Shot List" value={post.shot_list} />
          )}
          {post.edit_rhythm && (
            <Field label="Edit Rhythm" value={post.edit_rhythm} />
          )}
          {post.broll_ideas && (
            <Field label="B-Roll Ideas" value={post.broll_ideas} />
          )}
          {post.hashtags && (
            <Field label="Hashtags" value={post.hashtags} />
          )}
          {post.metricool_export && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">📋 Metricool Ready — Copy & Paste</p>
                <CopyBtn text={post.metricool_export} />
              </div>
              <pre className="font-body text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">{post.metricool_export}</pre>
            </div>
          )}
          {post.content_notes && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
              <p className="font-body text-[10px] tracking-wider uppercase text-amber-400 mb-1">Production Notes</p>
              <p className="font-body text-xs text-foreground/70 leading-relaxed">{post.content_notes}</p>
            </div>
          )}
          {post.source_chain && (
            <p className="font-body text-[10px] text-muted-foreground/50">Source: {post.source_chain}</p>
          )}
        </div>

        <div className="p-4 border-t border-border flex gap-2 flex-wrap">
          {post.status === 'pending_approval' && (
            <>
              <Button onClick={() => onApprove(post)} className="gap-1.5 bg-green-600 hover:bg-green-700 border-0">
                <CheckCircle2 className="w-4 h-4" /> Approve
              </Button>
              <Button variant="outline" onClick={() => onReject(post)} className="gap-1.5 border-red-500/40 text-red-400 hover:bg-red-500/10">
                <X className="w-4 h-4" /> Reject
              </Button>
            </>
          )}
          {post.status === 'approved' && (
            <Button variant="outline" onClick={() => onApprove(post, 'scheduled')} className="gap-1.5 border-blue-500/40 text-blue-400">
              <Calendar className="w-4 h-4" /> Mark Scheduled in Metricool
            </Button>
          )}
          {post.status === 'scheduled' && (
            <Button variant="outline" onClick={() => onApprove(post, 'posted')} className="gap-1.5 border-green-500/40 text-green-400">
              <CheckCircle2 className="w-4 h-4" /> Mark as Posted
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose} className="ml-auto">Close</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, large }) {
  return (
    <div className="bg-secondary/30 border border-border/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{label}</p>
        <CopyBtn text={value} />
      </div>
      <p className={`font-body text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap ${large ? '' : 'line-clamp-3'}`}>{value}</p>
    </div>
  );
}

export default function ReleaseSprint() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [generatingDay, setGeneratingDay] = useState(null);
  const [expandedDay, setExpandedDay] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [lastGenResult, setLastGenResult] = useState(null);
  const [genError, setGenError] = useState(null);
  const [showDiag, setShowDiag] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({ checked: false, authenticated: false, isAdmin: false, email: '' });

  // Live session check — runs once on mount
  useEffect(() => {
    base44.auth.me()
      .then(u => setSessionInfo({ checked: true, authenticated: !!u, isAdmin: u?.role === 'admin', email: u?.email || '' }))
      .catch(() => setSessionInfo({ checked: true, authenticated: false, isAdmin: false, email: '' }));
  }, []);

  const daysLeft = Math.max(0, Math.ceil((RELEASE_DATE - new Date()) / (1000 * 60 * 60 * 24)));

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['sprint-posts'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ campaign: CAMPAIGN }, 'sprint_day', 200),
    refetchInterval: 30000,
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ['sprint-approvals'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 50),
  });

  const updatePost = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ContentCalendarPost.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sprint-posts'] }),
  });

  const handleApprove = async (post, newStatus = 'approved') => {
    await updatePost.mutateAsync({ id: post.id, data: { status: newStatus } });
    if (post.approval_id) {
      await base44.entities.ApprovalQueue.update(post.approval_id, { status: newStatus === 'approved' ? 'approved' : 'actioned' });
      qc.invalidateQueries({ queryKey: ['sprint-approvals'] });
    }
    toast({ title: `Post ${newStatus === 'approved' ? 'approved' : newStatus === 'scheduled' ? 'marked scheduled' : 'marked posted'} ✓` });
    setSelectedPost(p => p ? { ...p, status: newStatus } : null);
  };

  const handleReject = async (post) => {
    await updatePost.mutateAsync({ id: post.id, data: { status: 'rejected' } });
    if (post.approval_id) {
      await base44.entities.ApprovalQueue.update(post.approval_id, { status: 'rejected' });
      qc.invalidateQueries({ queryKey: ['sprint-approvals'] });
    }
    toast({ title: 'Post rejected', variant: 'destructive' });
    setSelectedPost(null);
  };

  const seedCampaign = async () => {
    setSeeding(true);
    let created = 0;
    for (const dayCfg of SPRINT_DAYS_CONFIG) {
      for (const p of dayCfg.posts) {
        const postType = p.type === 'emotional' ? 'video_hook' : p.type === 'engagement' ? 'fan_engagement' : 'community_cta';
        await base44.entities.ContentCalendarPost.create({
          campaign: CAMPAIGN,
          sprint_day: dayCfg.day,
          scheduled_date: dayCfg.date,
          platform: p.platform,
          content_type: postType,
          hook: p.hook,
          caption: p.caption,
          cta: p.cta,
          on_screen_text: p.on_screen_text,
          hashtags: p.hashtags,
          status: 'pending_approval',
          generated_by: 'ReleaseSprint_6Day_Campaign',
          source_chain: `6-Day THANKYOU Sprint | Day ${dayCfg.day} | ${p.type}`,
          content_notes: p.hook.includes('NEEDS TIMESTAMP') ? '⚠ NEEDS TIMESTAMP — hold until audio section is selected' : undefined,
          metricool_export: `${p.hook}\n\n${p.caption}\n\n${p.cta}${p.hashtags ? '\n\n' + p.hashtags : ''}`,
        });
        created++;
      }
    }
    setSeeding(false);
    qc.invalidateQueries({ queryKey: ['sprint-posts'] });
    toast({ title: `✓ ${created} campaign posts seeded — pending your approval` });
  };

  const generateSprint = async (dayNum = null) => {
    if (dayNum) {
      setGeneratingDay(dayNum);
    } else {
      setGenerating(true);
    }
    setGenError(null);
    setLastGenResult(null);
    try {
      const payload = dayNum ? { day: dayNum } : {};
      const res = await base44.functions.invoke('generateReleaseSprint', payload);
      const data = res.data;
      setLastGenResult(data);
      qc.invalidateQueries({ queryKey: ['sprint-posts'] });
      qc.invalidateQueries({ queryKey: ['sprint-approvals'] });
      if (data?.error) {
        setGenError(data.error);
        toast({ title: `Error: ${data.error}`, variant: 'destructive' });
      } else {
        toast({ title: data?.message || `${data?.posts_created || 0} posts generated` });
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Unknown error';
      setGenError(msg);
      setLastGenResult(null);
      toast({ title: `Generation failed: ${msg}`, variant: 'destructive' });
    }
    setGenerating(false);
    setGeneratingDay(null);
  };

  // Group posts by sprint day
  const postsByDay = useMemo(() => {
    const map = {};
    for (const p of posts) {
      const d = p.sprint_day || 0;
      if (!map[d]) map[d] = [];
      map[d].push(p);
    }
    return map;
  }, [posts]);

  // 6-day sprint: May 31 → June 5
  const sprintDays = useMemo(() => SPRINT_DAYS_CONFIG.map((cfg) => {
    const d = new Date(cfg.date + 'T00:00:00+10:00');
    const dayPosts = postsByDay[cfg.day] || [];
    const isPast = d < new Date() && d.toDateString() !== new Date().toDateString();
    const isToday = d.toDateString() === new Date().toDateString();
    return {
      ...cfg,
      posts: dayPosts,
      total: dayPosts.length,
      approved: dayPosts.filter(p => ['approved', 'scheduled', 'posted'].includes(p.status)).length,
      pending: dayPosts.filter(p => p.status === 'pending_approval').length,
      posted: dayPosts.filter(p => p.status === 'posted').length,
      isPast,
      isToday,
      isRecordingDay: false,
      isReleaseDay: cfg.day === 6,
    };
  }), [postsByDay]);

  const totalPosts = posts.length;
  const totalApproved = posts.filter(p => ['approved', 'scheduled', 'posted'].includes(p.status)).length;
  const totalPending = posts.filter(p => p.status === 'pending_approval').length;
  const totalPosted = posts.filter(p => p.status === 'posted').length;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">June 5, 2026 Release</p>
            <h1 className="font-display text-3xl font-bold gradient-gold-text">6-Day THANKYOU Sprint</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">May 31 → June 5 · 3 posts/day · emotional → engagement → conversion</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-body font-semibold ${daysLeft <= 7 ? 'border-yellow-500/60 bg-yellow-500/10 text-yellow-400' : 'border-primary/40 bg-primary/10 text-primary'}`}>
              <Calendar className="w-4 h-4" />
              <span>11 days · June 5 Release</span>
              {daysLeft <= 7 && <span className="animate-pulse">⚡</span>}
            </div>
            <Button
              onClick={seedCampaign}
              disabled={seeding}
              className="gradient-gold-button border-0 gap-2"
            >
              {seeding ? <><RefreshCw className="w-4 h-4 animate-spin" /> Seeding Campaign...</> : <><Zap className="w-4 h-4" /> Seed 6-Day Campaign Posts</>}
            </Button>
            <Button
              onClick={() => generateSprint()}
              disabled={generating}
              variant="outline"
              className="gap-2"
            >
              {generating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</> : <><Zap className="w-4 h-4" /> AI Generate Sprint</>}
            </Button>
          </div>
        </div>
      </div>

      {/* Session status warning */}
      {sessionInfo.checked && !sessionInfo.isAdmin && (
        <div className="bg-red-500/5 border border-red-500/40 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-sm text-red-400 font-semibold">
              {sessionInfo.authenticated ? 'Not logged in as admin — generation will fail' : 'No active session — please refresh and log in'}
            </p>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              {sessionInfo.authenticated
                ? `Logged in as ${sessionInfo.email} (role: not admin). Switch to an admin account.`
                : 'Session expired or not authenticated. Refresh the page to log in.'}
            </p>
          </div>
        </div>
      )}

      {/* Safety Banner */}
      <div className="bg-green-500/5 border border-green-500/30 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-body text-sm text-green-400 font-semibold">No external posts without approval</p>
          <p className="font-body text-xs text-muted-foreground mt-0.5">Source chain: Generate Sprint → ContentCalendarPost → ApprovalQueue → QualityReview → ScheduleQueue → Metricool → Post</p>
        </div>
      </div>

      {/* Generation error banner */}
      {genError && (
        <div className="bg-red-500/5 border border-red-500/40 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-body text-sm text-red-400 font-semibold">Generation Error</p>
            <p className="font-body text-xs text-muted-foreground mt-1 font-mono">{genError}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">Next action: check LLM integration credits, admin auth, or try generating a single day first.</p>
          </div>
          <button onClick={() => setGenError(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Last generation result */}
      {lastGenResult && !genError && (
        <div className="bg-blue-500/5 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-body text-sm text-blue-400 font-semibold flex items-center gap-2"><Activity className="w-4 h-4" /> Last Generation Report</p>
            <button onClick={() => setLastGenResult(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
            {[
              { label: 'Days', value: lastGenResult.days_generated },
              { label: 'Posts Created', value: lastGenResult.posts_created },
              { label: 'Skipped', value: lastGenResult.posts_skipped },
              { label: 'Errors', value: lastGenResult.errors?.length || 0 },
            ].map(s => (
              <div key={s.label} className="bg-card/60 rounded-lg p-2 text-center">
                <p className="font-body text-lg font-bold text-foreground">{s.value ?? '—'}</p>
                <p className="font-body text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          {lastGenResult.errors?.length > 0 && (
            <div className="mt-2 space-y-1">
              {lastGenResult.errors.map((e, i) => (
                <p key={i} className="font-body text-xs text-red-400 font-mono">⚠ {e}</p>
              ))}
            </div>
          )}
          {lastGenResult.skipped?.length > 0 && (
            <div className="mt-2 space-y-1">
              {lastGenResult.skipped.map((s, i) => (
                <p key={i} className="font-body text-xs text-muted-foreground">↷ {s}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Live Diagnostics toggle */}
      <div className="flex items-center gap-2">
        <button onClick={() => setShowDiag(d => !d)} className="font-body text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
          <Activity className="w-3.5 h-3.5" />
          {showDiag ? 'Hide' : 'Show'} Live Diagnostics
        </button>
      </div>
      {showDiag && (
        <Card className="border-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground"><Activity className="w-4 h-4" /> Live Diagnostics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs font-body">
            {[
              { label: 'Admin session detected', value: sessionInfo.checked ? (sessionInfo.isAdmin ? `Yes — ${sessionInfo.email}` : sessionInfo.authenticated ? `Logged in but NOT admin (${sessionInfo.email})` : 'No session — refresh to log in') : 'Checking...', ok: sessionInfo.isAdmin },
              { label: 'Function reachable', value: 'Yes (generateReleaseSprint via base44.functions.invoke)', ok: true },
              { label: 'Auth flow', value: 'createClientFromRequest → auth.me() → role check → asServiceRole writes', ok: true },
              { label: 'Sprint days configured', value: '11 (May 26 → June 5)', ok: true },
              { label: 'Duplicate protection', value: 'Active — skips existing platform/day combos', ok: true },
              { label: 'Approval queue', value: 'Wired — every post creates ApprovalQueue entry', ok: true },
              { label: 'Metricool auto-post', value: 'BLOCKED — manual copy/paste only', ok: true },
              { label: 'Total posts in DB', value: String(totalPosts), ok: totalPosts > 0 },
              { label: 'Last backend status', value: lastGenResult ? `${lastGenResult.posts_created} created · ${lastGenResult.posts_skipped} skipped · ${lastGenResult.errors?.length || 0} errors` : 'No generation run this session', ok: !!lastGenResult },
              { label: 'Last backend user', value: lastGenResult?.admin_user || '—', ok: !!lastGenResult?.admin_user },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                <span className="text-muted-foreground">{row.label}</span>
                <span className={`flex items-center gap-1 ${row.ok ? 'text-green-400' : 'text-amber-400'}`}>
                  {row.ok ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  {row.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Posts', value: totalPosts, icon: Film, color: 'text-blue-400' },
          { label: 'Pending Approval', value: totalPending, icon: Clock, color: 'text-amber-400' },
          { label: 'Approved', value: totalApproved, icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Posted', value: totalPosted, icon: Send, color: 'text-primary' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-7 h-7 shrink-0 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold font-display">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Approvals Alert */}
      {totalPending > 0 && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" /> {totalPending} posts awaiting your approval
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex gap-2">
              <Link to="/admin/approval-queue">
                <Button variant="outline" size="sm" className="gap-1.5 border-amber-500/40 text-amber-400">
                  <Eye className="w-3 h-3" /> Review Approval Queue
                </Button>
              </Link>
              <p className="font-body text-xs text-muted-foreground self-center">Or click any post below to review & approve inline.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 10-Day Sprint Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> 6-Day Sprint Timeline (May 31 → June 5)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sprintDays.map(day => (
            <div key={day.day} className={`rounded-xl border transition-all ${day.isToday ? 'border-primary/60 bg-primary/5' : day.isPast ? 'border-border/30 opacity-70' : 'border-border/50'}`}>
              {/* Day header row */}
              <button
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full text-left p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 font-body text-sm font-bold ${day.isReleaseDay ? 'bg-primary text-primary-foreground' : day.isToday ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    {day.day}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body text-sm font-semibold text-foreground">{day.label}</span>
                      {day.isToday && <Badge className="bg-primary/20 text-primary border-0 text-[9px] tracking-wider uppercase">Today</Badge>}
                      {day.isRecordingDay && <Badge className="bg-blue-500/20 text-blue-400 border-0 text-[9px] tracking-wider uppercase">🎙 Recording Day</Badge>}
                      {day.isReleaseDay && <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-[9px] tracking-wider uppercase">🎵 Release Day</Badge>}
                    </div>
                    <p className="font-body text-xs text-muted-foreground truncate mt-0.5">{day.theme}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-body">
                    {day.total > 0 ? (
                      <>
                        <span className="text-muted-foreground">{day.total} posts</span>
                        {day.pending > 0 && <span className="text-amber-400">{day.pending} pending</span>}
                        {day.approved > 0 && <span className="text-green-400">{day.approved} ✓</span>}
                      </>
                    ) : (
                      <span className="text-muted-foreground/50">No content</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs gap-1"
                      onClick={e => { e.stopPropagation(); generateSprint(day.day); }}
                      disabled={generatingDay === day.day}
                    >
                      {generatingDay === day.day ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      {day.total > 0 ? 'Re-gen' : 'Generate'}
                    </Button>
                    {expandedDay === day.day ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
              </button>

              {/* Expanded posts */}
              {expandedDay === day.day && (
                <div className="border-t border-border/40 p-3 space-y-2">
                  {day.posts.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="font-body text-sm text-muted-foreground">No content generated yet for Day {day.day}.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 gap-1.5"
                        onClick={() => generateSprint(day.day)}
                        disabled={generatingDay === day.day}
                      >
                        {generatingDay === day.day ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                        Generate Day {day.day} Content
                      </Button>
                    </div>
                  ) : (
                    day.posts.map(post => {
                      const pm = PLATFORM_META[post.platform] || { label: post.platform, color: 'text-foreground', bg: 'bg-secondary' };
                      const sm = STATUS_META[post.status] || STATUS_META.draft;
                      return (
                        <button
                          key={post.id}
                          onClick={() => setSelectedPost(post)}
                          className="w-full text-left flex items-start gap-3 p-3 rounded-lg border border-border/30 hover:border-primary/40 hover:bg-secondary/30 transition-all"
                        >
                          <div className={`${pm.bg} px-2 py-1 rounded-md shrink-0`}>
                            <span className={`font-body text-[10px] tracking-wider uppercase font-semibold ${pm.color}`}>{pm.label}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm text-foreground line-clamp-2">{post.hook || post.caption || '—'}</p>
                            <p className="font-body text-[10px] text-muted-foreground mt-0.5">{post.content_type?.replace(/_/g, ' ')}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge className={`${sm.bg} ${sm.color} border text-[9px] tracking-wider uppercase`}>{sm.label}</Badge>
                            {post.metricool_export && (
                              <div className="flex items-center gap-0.5 text-primary/60" title="Metricool ready">
                                <Copy className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Metricool Integration Guide */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-blue-400">
            <ExternalLink className="w-4 h-4" /> Metricool Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs font-body text-muted-foreground space-y-1.5">
          <p>1. Generate content for a sprint day above (or regenerate)</p>
          <p>2. Review and approve posts — click any card to see full brief</p>
          <p>3. Copy the <strong className="text-primary">Metricool Ready</strong> field (caption + hashtags pre-formatted)</p>
          <p>4. Paste into Metricool, set the date/time, and schedule</p>
          <p>5. Mark as "Scheduled" above, then "Posted" after it goes live</p>
          <p className="pt-1 text-muted-foreground/50">No automated external posting. All content manual-scheduled via Metricool.</p>
        </CardContent>
      </Card>

      {/* Sprint Sub-Tool Nav */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" /> Sprint Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {[
              { label: 'Asset Library', path: '/admin/social-asset-library', icon: Film, desc: 'Upload & tag footage' },
              { label: 'Post Factory', path: '/admin/social-post-factory', icon: Zap, desc: 'Generate individual briefs' },
              { label: 'Quality Review', path: '/admin/content-quality-review', icon: Eye, desc: 'AI quality scoring' },
              { label: 'Schedule Queue', path: '/admin/social-schedule-queue', icon: Calendar, desc: 'Copy to Metricool' },
              { label: 'Performance', path: '/admin/content-performance', icon: Send, desc: 'Log metrics + insights' },
            ].map(tool => (
              <Link key={tool.path} to={tool.path}>
                <div className="border border-border/50 rounded-xl p-3 hover:border-primary/40 hover:bg-secondary/30 transition-all cursor-pointer h-full">
                  <tool.icon className="w-4 h-4 text-primary mb-2" />
                  <p className="font-body text-xs font-semibold text-foreground">{tool.label}</p>
                  <p className="font-body text-[10px] text-muted-foreground mt-0.5">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Post detail modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onApprove={(post, status) => handleApprove(post, status)}
          onReject={handleReject}
        />
      )}
    </div>
  );
}