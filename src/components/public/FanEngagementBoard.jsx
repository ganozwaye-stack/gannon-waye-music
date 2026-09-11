import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MessagesSquare, Star } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// The engagement board: interaction history from the fan wall (approved
// posts, comments and likes) aggregated per fan, so the most engaged
// listeners get recognised. Founding supporters wear the gold star badge.

function Badge({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-body text-[10px] tracking-wider uppercase text-primary">
      <Icon className="w-3 h-3" /> {label}
    </span>
  );
}

export default function FanEngagementBoard({ foundingNames = [] }) {
  const { data: posts = [] } = useQuery({
    queryKey: ['leaderboardFanPosts'],
    queryFn: () => base44.entities.FanPost.filter({ status: 'approved' }, '-created_date', 200),
    staleTime: 60_000,
  });
  const { data: comments = [] } = useQuery({
    queryKey: ['leaderboardFanComments'],
    queryFn: () => base44.entities.FanComment.filter({ status: 'approved' }, '-created_date', 200),
    staleTime: 60_000,
  });
  const { data: likes = [] } = useQuery({
    queryKey: ['leaderboardCommunityLikes'],
    queryFn: () => base44.entities.CommunityLike.list('-created_date', 300),
    staleTime: 60_000,
  });

  const foundingSet = useMemo(
    () => new Set(foundingNames.map((n) => String(n || '').trim().toLowerCase())),
    [foundingNames]
  );

  const fans = useMemo(() => {
    const map = new Map();
    const track = (name, field) => {
      const clean = String(name || '').trim();
      if (!clean || clean.toLowerCase() === 'anonymous') return;
      const key = clean.toLowerCase();
      if (!map.has(key)) map.set(key, { name: clean, posts: 0, comments: 0, likes: 0 });
      map.get(key)[field] += 1;
    };
    posts.forEach((p) => track(p.author_name, 'posts'));
    comments.forEach((c) => track(c.author_name, 'comments'));
    likes.forEach((l) => track(l.liker_name, 'likes'));
    return [...map.values()]
      .map((f) => ({ ...f, total: f.posts * 3 + f.comments * 2 + f.likes }))
      .filter((f) => f.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [posts, comments, likes]);

  if (fans.length === 0) return null;

  return (
    <div className="bg-card/50 border border-border/40 rounded-xl p-5">
      <h2 className="font-display text-lg text-foreground mb-1 flex items-center gap-2">
        <MessagesSquare className="w-4 h-4 text-primary" /> Most Engaged Listeners
      </h2>
      <p className="font-body text-xs text-muted-foreground mb-4">
        Ranked from fan wall posts, comments and likes. Founding supporters wear the gold star.
      </p>
      <div className="space-y-2">
        {fans.map((fan, i) => (
          <motion.div
            key={fan.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-4 p-3 bg-secondary/20 rounded-lg"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="font-display text-sm text-primary">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-body text-sm text-foreground font-medium truncate">{fan.name}</p>
                {foundingSet.has(fan.name.toLowerCase()) && <Badge icon={Star} label="Founding Supporter" />}
                {fan.posts >= 3 && <Badge icon={MessageCircle} label="Voice" />}
                {fan.likes >= 5 && <Badge icon={Heart} label="Heart Giver" />}
              </div>
              <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                {fan.posts} {fan.posts === 1 ? 'post' : 'posts'} · {fan.comments} {fan.comments === 1 ? 'comment' : 'comments'} · {fan.likes} {fan.likes === 1 ? 'like' : 'likes'}
              </p>
            </div>
            <p className="font-body text-sm text-primary font-semibold shrink-0">{fan.total}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}