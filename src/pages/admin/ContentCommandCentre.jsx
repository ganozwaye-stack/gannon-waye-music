import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Plus, CheckCircle2, Clock, Eye, Edit3, Trash2,
  Instagram, Youtube, Send, Zap, BarChart2, Image, FileText,
  Hash, Link2, Calendar, TrendingUp, ShoppingBag, RefreshCw
} from 'lucide-react';

const PLATFORMS = [
  { id: 'all', label: 'All' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'youtube_shorts', label: 'YouTube Shorts' },
  { id: 'threads', label: 'Threads' },
  { id: 'pinterest', label: 'Pinterest' },
  { id: 'twitter_x', label: 'X/Twitter' },
];

const CAMPAIGNS = [
  'thank_you_june5', 'merch_launch', 'coffee_mug_campaign',
  'founding_supporters', 'store_promotion', 'community_engagement',
];

const PLATFORM_TIPS = {
  instagram: 'Focus: saves, shares, carousels, emotional story captions',
  tiktok: 'Focus: hooks, watch time, replays, authenticity, short cuts',
  youtube_shorts: 'Focus: retention, curiosity, emotional payoff',
  pinterest: 'Focus: evergreen inspiration, merch/product discovery',
  threads: 'Focus: conversational vulnerability, community replies',
  facebook: 'Focus: emotional storytelling, shares, supporters',
  twitter_x: 'Focus: punchy emotional statements, repostability',
};

const HOOK_LIBRARY = [
  'The moment I stopped chasing perfection, everything changed.',
  'This song exists because I almost gave up.',
  'What if the hardest chapter was also the most important?',
  'I made this for anyone who needed it.',
  'Sometimes "thank you" is the most powerful thing you can say.',
  'You don\'t have to be famous to matter.',
  'This one goes out to everyone who stayed.',
];

const CTA_LIBRARY = [
  'Link in bio → grab yours before it\'s gone 🤍',
  'Comment "THANKYOU" and I\'ll send you something special',
  'Pre-save drops 5 June — be the first to hear it',
  'Visit the store — every order supports the music directly',
  'Share this if it hit different',
  'Save this for when you need it most',
  'Tag someone who needs to hear this',
];

function PostCard({ post, onApprove, onReject, onEdit }) {
  const platformColors = {
    instagram: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
    tiktok: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    facebook: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    youtube_shorts: 'bg-red-500/10 text-red-300 border-red-500/20',
    threads: 'bg-gray-500/10 text-gray-300 border-gray-500/20',
    pinterest: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    twitter_x: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  };

  const statusColors = {
    draft: 'bg-secondary text-muted-foreground border-border',
    awaiting_approval: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    approved: 'bg-green-500/20 text-green-300 border-green-500/30',
    scheduled: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    posted: 'bg-green-600/20 text-green-200 border-green-600/30',
    rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex gap-2 flex-wrap">
            <Badge className={`${platformColors[post.platform] || 'bg-secondary text-muted-foreground'} text-xs`} variant="outline">
              {post.platform?.replace('_', ' ')}
            </Badge>
            <Badge className={`${statusColors[post.status] || ''} text-xs`} variant="outline">
              {post.status?.replace('_', ' ')}
            </Badge>
            {post.campaign && (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs" variant="outline">{post.campaign}</Badge>
            )}
          </div>
          {post.predicted_viral_probability > 0 && (
            <span className="text-xs text-amber-300 font-mono shrink-0">{Math.round(post.predicted_viral_probability * 100)}% viral</span>
          )}
        </div>

        {post.hook && (
          <p className="text-sm font-medium text-foreground border-l-2 border-primary/40 pl-3 italic">"{post.hook}"</p>
        )}

        {post.caption && (
          <p className="text-xs text-muted-foreground line-clamp-3">{post.caption}</p>
        )}

        {post.hashtags && (
          <p className="text-xs text-primary/60 line-clamp-1">{post.hashtags}</p>
        )}

        {(post.actual_likes > 0 || post.actual_saves > 0) && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            {post.actual_likes > 0 && <span>❤️ {post.actual_likes}</span>}
            {post.actual_saves > 0 && <span>🔖 {post.actual_saves}</span>}
            {post.actual_shares > 0 && <span>↗ {post.actual_shares}</span>}
            {post.store_clicks > 0 && <span>🛍 {post.store_clicks} clicks</span>}
          </div>
        )}

        <div className="flex gap-2 flex-wrap pt-1">
          {post.status === 'awaiting_approval' && (
            <>
              <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700" onClick={() => onApprove(post)}>
                <CheckCircle2 className="w-3 h-3 mr-1" />Approve
              </Button>
              <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => onReject(post)}>Reject</Button>
            </>
          )}
          {post.status === 'approved' && (
            <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700">
              <Send className="w-3 h-3 mr-1" />Send to Metricool
            </Button>
          )}
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onEdit(post)}>
            <Edit3 className="w-3 h-3 mr-1" />Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NewPostModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    platform: 'instagram', status: 'draft', hook: '', caption: '',
    hashtags: '', cta: '', campaign: '', visual_prompt: '',
    predicted_viral_probability: 0,
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-card border border-border/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">New Post Draft</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Platform</label>
              <select value={form.platform} onChange={e => setForm(f => ({...f, platform: e.target.value}))}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground">
                {PLATFORMS.filter(p => p.id !== 'all').map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Campaign</label>
              <select value={form.campaign} onChange={e => setForm(f => ({...f, campaign: e.target.value}))}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground">
                <option value="">None</option>
                {CAMPAIGNS.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
          </div>

          {PLATFORM_TIPS[form.platform] && (
            <p className="text-xs text-primary/70 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
              💡 {PLATFORM_TIPS[form.platform]}
            </p>
          )}

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Hook (first 3 seconds)</label>
            <textarea value={form.hook} onChange={e => setForm(f => ({...f, hook: e.target.value}))} rows={2}
              placeholder="The most powerful opening line..."
              className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground" />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Caption</label>
            <textarea value={form.caption} onChange={e => setForm(f => ({...f, caption: e.target.value}))} rows={4}
              placeholder="Full post caption..."
              className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground" />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Hashtags</label>
            <input value={form.hashtags} onChange={e => setForm(f => ({...f, hashtags: e.target.value}))}
              placeholder="#thankyou #gannonwaye #newmusic"
              className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground" />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">CTA</label>
            <input value={form.cta} onChange={e => setForm(f => ({...f, cta: e.target.value}))}
              placeholder="Link in bio → grab yours before it's gone 🤍"
              className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground" />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Visual Direction / Prompt</label>
            <textarea value={form.visual_prompt} onChange={e => setForm(f => ({...f, visual_prompt: e.target.value}))} rows={2}
              placeholder="CapCut / Canva / Runway prompt or visual direction..."
              className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={() => onSave({...form, status: 'draft'})} variant="outline" className="flex-1">Save Draft</Button>
            <Button onClick={() => onSave({...form, status: 'awaiting_approval'})} className="flex-1">Submit for Approval</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContentCommandCentre() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState('queue');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [editPost, setEditPost] = useState(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['contentPosts', platformFilter],
    queryFn: () => platformFilter === 'all'
      ? base44.entities.ContentPost.list('-created_date', 50)
      : base44.entities.ContentPost.filter({ platform: platformFilter }, '-created_date', 50),
    refetchInterval: 30000,
  });

  const createPost = useMutation({
    mutationFn: data => base44.entities.ContentPost.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['contentPosts'] }); setShowNewPost(false); toast({ title: 'Post created!' }); },
  });

  const updatePost = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ContentPost.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['contentPosts'] }); setEditPost(null); toast({ title: 'Post updated!' }); },
  });

  const handleApprove = post => updatePost.mutate({ id: post.id, data: { status: 'approved', approved_at: new Date().toISOString() } });
  const handleReject = post => updatePost.mutate({ id: post.id, data: { status: 'rejected' } });

  const grouped = {
    awaiting_approval: posts.filter(p => p.status === 'awaiting_approval'),
    approved: posts.filter(p => p.status === 'approved'),
    scheduled: posts.filter(p => p.status === 'scheduled'),
    draft: posts.filter(p => p.status === 'draft'),
    posted: posts.filter(p => p.status === 'posted'),
  };

  const tabs = [
    { id: 'queue', label: `Queue (${grouped.awaiting_approval.length})` },
    { id: 'approved', label: `Approved (${grouped.approved.length})` },
    { id: 'drafts', label: `Drafts (${grouped.draft.length})` },
    { id: 'posted', label: `Posted (${grouped.posted.length})` },
    { id: 'hooks', label: 'Hook Library' },
    { id: 'ctas', label: 'CTA Library' },
  ];

  const currentPosts = {
    queue: grouped.awaiting_approval,
    approved: grouped.approved,
    drafts: grouped.draft,
    posted: grouped.posted,
  }[tab] || [];

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Content Command Centre</h1>
            <p className="text-sm text-muted-foreground mt-1">AI-assisted · Human-approved · Metricool-scheduled</p>
          </div>
        </div>
        <Button onClick={() => setShowNewPost(true)}>
          <Plus className="w-4 h-4 mr-1" />New Post Draft
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Awaiting Approval', count: grouped.awaiting_approval.length, color: 'text-amber-400' },
          { label: 'Approved', count: grouped.approved.length, color: 'text-green-400' },
          { label: 'Scheduled', count: grouped.scheduled.length, color: 'text-blue-400' },
          { label: 'Drafts', count: grouped.draft.length, color: 'text-muted-foreground' },
          { label: 'Posted', count: grouped.posted.length, color: 'text-primary' },
        ].map(({ label, count, color }) => (
          <Card key={label}><CardContent className="p-3 text-center">
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Platform filter */}
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map(p => (
          <Button key={p.id} variant={platformFilter === p.id ? 'default' : 'outline'} size="sm"
            onClick={() => setPlatformFilter(p.id)}>{p.label}</Button>
        ))}
      </div>

      {/* Metricool status */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="p-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <p className="text-sm text-amber-300 font-medium">Metricool — Setup Required</p>
            <p className="text-xs text-muted-foreground">Connect METRICOOL_API_TOKEN to enable scheduling</p>
          </div>
          <Link to="/admin/metricool-command">
            <Button variant="outline" size="sm">Configure Metricool →</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Content tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <Button key={t.id} variant={tab === t.id ? 'default' : 'outline'} size="sm" onClick={() => setTab(t.id)}>{t.label}</Button>
        ))}
      </div>

      {/* Queue / Approved / Drafts / Posted */}
      {['queue', 'approved', 'drafts', 'posted'].includes(tab) && (
        <div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading posts...</p>
          ) : currentPosts.length === 0 ? (
            <Card><CardContent className="p-8 text-center">
              <p className="text-muted-foreground text-sm">No {tab} posts yet</p>
              <Button className="mt-4" onClick={() => setShowNewPost(true)}>
                <Plus className="w-4 h-4 mr-1" />Create First Post
              </Button>
            </CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onEdit={p => setEditPost(p)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hook Library */}
      {tab === 'hooks' && (
        <div className="space-y-3">
          <Card className="border-primary/20 bg-primary/5"><CardContent className="p-4">
            <p className="text-sm font-semibold text-primary mb-1">Hook Library — High-performing emotional openers</p>
            <p className="text-xs text-muted-foreground">Click any hook to copy. Add to a new post draft.</p>
          </CardContent></Card>
          {HOOK_LIBRARY.map((hook, i) => (
            <div key={i} className="border border-border/40 rounded-lg p-4 flex items-center justify-between gap-3 hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => { navigator.clipboard.writeText(hook); toast({ title: 'Hook copied!' }); }}>
              <p className="text-sm italic text-foreground">"{hook}"</p>
              <Button variant="ghost" size="sm" className="shrink-0 text-xs">Copy</Button>
            </div>
          ))}
          <Button variant="outline" className="w-full" onClick={() => setShowNewPost(true)}>
            <Plus className="w-4 h-4 mr-1" />Add Custom Hook
          </Button>
        </div>
      )}

      {/* CTA Library */}
      {tab === 'ctas' && (
        <div className="space-y-3">
          <Card className="border-primary/20 bg-primary/5"><CardContent className="p-4">
            <p className="text-sm font-semibold text-primary mb-1">CTA Library — Conversion-focused calls to action</p>
            <p className="text-xs text-muted-foreground">Click any CTA to copy. Add to caption or post draft.</p>
          </CardContent></Card>
          {CTA_LIBRARY.map((cta, i) => (
            <div key={i} className="border border-border/40 rounded-lg p-4 flex items-center justify-between gap-3 hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => { navigator.clipboard.writeText(cta); toast({ title: 'CTA copied!' }); }}>
              <p className="text-sm text-foreground">{cta}</p>
              <Button variant="ghost" size="sm" className="shrink-0 text-xs">Copy</Button>
            </div>
          ))}
        </div>
      )}

      {/* New Post Modal */}
      {showNewPost && (
        <NewPostModal
          onClose={() => setShowNewPost(false)}
          onSave={data => createPost.mutate(data)}
        />
      )}

      {/* Edit Post Modal */}
      {editPost && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-card border border-border/40 rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Edit Post</h2>
              <button onClick={() => setEditPost(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Status</label>
              <select value={editPost.status} onChange={e => setEditPost(p => ({...p, status: e.target.value}))}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground">
                {['draft','awaiting_approval','approved','scheduled','posted','rejected','archived'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Caption</label>
              <textarea value={editPost.caption || ''} onChange={e => setEditPost(p => ({...p, caption: e.target.value}))} rows={4}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Hook</label>
              <input value={editPost.hook || ''} onChange={e => setEditPost(p => ({...p, hook: e.target.value}))}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setEditPost(null)}>Cancel</Button>
              <Button className="flex-1" onClick={() => updatePost.mutate({ id: editPost.id, data: editPost })}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}