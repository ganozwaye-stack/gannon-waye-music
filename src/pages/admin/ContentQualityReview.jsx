import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Star, RefreshCw, CheckCircle2, AlertTriangle, ChevronRight, X } from 'lucide-react';

const PLATFORM_META = {
  tiktok: { label: 'TikTok', color: 'text-red-400', bg: 'bg-red-500/10' },
  instagram_reels: { label: 'IG Reels', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  instagram_stories: { label: 'IG Stories', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  twitter_x: { label: 'X', color: 'text-sky-400', bg: 'bg-sky-500/10' },
};

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

function ScoreBar({ score }) {
  const pct = ((score || 0) / 10) * 100;
  const color = score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-body text-xs text-foreground font-semibold w-6 text-right">{score || '—'}</span>
    </div>
  );
}

function ReviewModal({ post, onClose, onSave }) {
  const [reviewing, setReviewing] = useState(false);
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  const runReview = async () => {
    setReviewing(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a senior music marketing content reviewer. Assess the following social media post for Gannon Waye (Australian singer-songwriter, debut single "Thank You", June 5 2026 release).

Platform: ${post.platform}
Sprint Day: ${post.sprint_day}/11 — Theme: ${SPRINT_THEMES[(post.sprint_day || 1) - 1]}

HOOK: ${post.hook || 'N/A'}
CAPTION: ${post.caption || 'N/A'}
CTA: ${post.cta || 'N/A'}
HASHTAGS: ${post.hashtags || 'N/A'}

Score each dimension 1-10 with ONE specific improvement suggestion. Be ruthlessly honest — 9+ is rare.

Evaluate all 8 dimensions:
1. hook_score: Stops scroll in 1-3s? Specific and emotional? Pattern interrupt?
2. caption_score: Personal, brand-consistent, platform-appropriate, non-generic?
3. cta_score: One clear action, natural, compelling?
4. hashtag_score: Mix of niche/mid/broad? No spam? Relevant to music + release?
5. brand_score: Authentic, vulnerable, warm, community-focused? Not AI-sounding?
6. embarrassment_risk_score: Rate 1=high risk, 10=no risk. Would this embarrass Gannon or the brand? Oversharing? Cringey? Off-message?
7. music_sale_value_score: Does this post drive streams, CD purchases, merch, or pre-saves? Is the commercial intent clear and natural?
8. release_relevance_score: Is it timed correctly for Day ${post.sprint_day}/11 of the sprint? Right urgency level? Correct messaging (not "out now" before release)?

overall_score: Weighted average (hook 20%, caption 20%, cta 15%, brand 15%, embarrassment_risk 15%, music_sale 10%, release_relevance 5%)
approved: true if overall_score >= 7 AND embarrassment_risk_score >= 6
improvement_required: true if any dimension < 6 or embarrassment_risk_score < 6`,
        response_json_schema: {
          type: 'object',
          properties: {
            hook_score: { type: 'number' }, caption_score: { type: 'number' },
            cta_score: { type: 'number' }, hashtag_score: { type: 'number' },
            brand_score: { type: 'number' }, embarrassment_risk_score: { type: 'number' },
            music_sale_value_score: { type: 'number' }, release_relevance_score: { type: 'number' },
            overall_score: { type: 'number' },
            approved: { type: 'boolean' }, improvement_required: { type: 'boolean' },
            hook_feedback: { type: 'string' }, caption_feedback: { type: 'string' },
            cta_feedback: { type: 'string' }, hashtag_feedback: { type: 'string' },
            brand_feedback: { type: 'string' }, embarrassment_risk_feedback: { type: 'string' },
            music_sale_feedback: { type: 'string' }, release_relevance_feedback: { type: 'string' },
            overall_feedback: { type: 'string' },
          }
        }
      });
      setResult(res);
    } catch (e) {
      toast({ title: 'Review failed', variant: 'destructive' });
    }
    setReviewing(false);
  };

  const saveReview = async () => {
    if (!result) return;
    await onSave(post.id, {
      quality_score: result.overall_score,
      quality_notes: result.overall_feedback,
      status: result.approved ? 'approved' : 'pending_approval',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl max-w-lg w-full my-8 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <p className="font-body text-xs text-muted-foreground">{PLATFORM_META[post.platform]?.label || post.platform} · Day {post.sprint_day}</p>
            <h3 className="font-display text-lg text-foreground mt-0.5 line-clamp-1">{post.hook || post.caption?.slice(0, 60) || '—'}</h3>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {!result && (
            <Button onClick={runReview} disabled={reviewing} className="w-full gradient-gold-button border-0 gap-2">
              {reviewing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Reviewing...</> : <><Star className="w-4 h-4" /> Run AI Quality Review</>}
            </Button>
          )}

          {result && (
            <>
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${result.approved ? 'bg-green-500/5 border-green-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
                {result.approved
                  ? <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
                  : <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />}
                <div>
                  <p className={`font-body text-sm font-semibold ${result.approved ? 'text-green-400' : 'text-red-400'}`}>
                    {result.approved ? 'Quality Approved' : 'Needs Improvement'} — {result.overall_score}/10
                  </p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{result.overall_feedback}</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Hook (scroll-stop)', score: result.hook_score, feedback: result.hook_feedback },
                  { label: 'Caption', score: result.caption_score, feedback: result.caption_feedback },
                  { label: 'Call to Action', score: result.cta_score, feedback: result.cta_feedback },
                  { label: 'Hashtags', score: result.hashtag_score, feedback: result.hashtag_feedback },
                  { label: 'Brand Authenticity', score: result.brand_score, feedback: result.brand_feedback },
                  { label: '🛡 Embarrassment Risk (10=safe)', score: result.embarrassment_risk_score, feedback: result.embarrassment_risk_feedback },
                  { label: '💿 Music Sale Value', score: result.music_sale_value_score, feedback: result.music_sale_feedback },
                  { label: '📅 Release Relevance', score: result.release_relevance_score, feedback: result.release_relevance_feedback },
                ].map(d => (
                  <div key={d.label} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-body text-xs text-muted-foreground">{d.label}</p>
                    </div>
                    <ScoreBar score={d.score} />
                    {d.feedback && <p className="font-body text-[11px] text-muted-foreground/70 leading-relaxed">{d.feedback}</p>}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={saveReview} className={`flex-1 gap-2 ${result.approved ? 'bg-green-600 hover:bg-green-700 border-0' : ''}`}>
                  <CheckCircle2 className="w-4 h-4" /> Save Review & {result.approved ? 'Approve' : 'Flag for Revision'}
                </Button>
                <Button variant="outline" onClick={runReview} disabled={reviewing} className="gap-1">
                  <RefreshCw className="w-3 h-3" /> Re-run
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContentQualityReview() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['cqr-posts'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ campaign: 'thank_you_june5_sprint' }, 'sprint_day', 200),
    refetchInterval: 60000,
  });

  const updatePost = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ContentCalendarPost.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cqr-posts'] }); toast({ title: 'Review saved ✓' }); }
  });

  const filtered = posts.filter(p => filterStatus === 'all' || p.status === filterStatus);
  const reviewed = posts.filter(p => p.quality_score).length;
  const approved = posts.filter(p => p.status === 'approved' || p.status === 'scheduled' || p.status === 'posted').length;
  const needsWork = posts.filter(p => p.quality_score && p.quality_score < 7).length;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Release Sprint</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Content Quality Review</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">AI-scored quality gates — posts scoring below 7/10 are flagged before approval</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Reviewed', value: reviewed, color: 'text-blue-400' },
          { label: 'Approved (7+)', value: approved, color: 'text-green-400' },
          { label: 'Needs Work (<7)', value: needsWork, color: 'text-red-400' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending_approval', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${filterStatus === s ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
            {s === 'all' ? 'All' : s.replace(/_/g, ' ')} ({posts.filter(p => s === 'all' || p.status === s).length})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12"><RefreshCw className="w-6 h-6 animate-spin text-muted-foreground mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border/50 rounded-xl">
          <p className="font-body text-sm text-muted-foreground">No posts to review. Generate content in Release Sprint or Post Factory first.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(post => {
            const pm = PLATFORM_META[post.platform] || { label: post.platform, color: 'text-foreground', bg: 'bg-secondary' };
            const hasScore = post.quality_score != null;
            const scoreColor = hasScore ? (post.quality_score >= 8 ? 'text-green-400' : post.quality_score >= 6 ? 'text-yellow-400' : 'text-red-400') : 'text-muted-foreground';
            return (
              <button
                key={post.id}
                onClick={() => setSelected(post)}
                className="w-full text-left flex items-start gap-3 p-4 border border-border/40 rounded-xl hover:border-primary/40 hover:bg-secondary/20 transition-all"
              >
                <div className={`${pm.bg} px-2 py-1 rounded-md shrink-0 mt-0.5`}>
                  <span className={`font-body text-[10px] tracking-wider uppercase font-semibold ${pm.color}`}>{pm.label}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold text-foreground line-clamp-1">Day {post.sprint_day} · {SPRINT_THEMES[(post.sprint_day || 1) - 1]}</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5 line-clamp-1">{post.hook || post.caption?.slice(0, 80) || '—'}</p>
                  {hasScore && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-primary" />
                      <span className={`font-body text-xs font-semibold ${scoreColor}`}>{post.quality_score}/10</span>
                      {post.quality_notes && <span className="font-body text-xs text-muted-foreground truncate">· {post.quality_notes}</span>}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!hasScore && <Badge className="bg-amber-500/10 text-amber-400 border-0 text-[9px] tracking-wider uppercase">Unreviewed</Badge>}
                  {hasScore && post.quality_score < 7 && <Badge className="bg-red-500/10 text-red-400 border-0 text-[9px]">Needs Work</Badge>}
                  {hasScore && post.quality_score >= 7 && <Badge className="bg-green-500/10 text-green-400 border-0 text-[9px]">✓ Pass</Badge>}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <ReviewModal
          post={selected}
          onClose={() => setSelected(null)}
          onSave={(id, data) => updatePost.mutateAsync({ id, data })}
        />
      )}
    </div>
  );
}