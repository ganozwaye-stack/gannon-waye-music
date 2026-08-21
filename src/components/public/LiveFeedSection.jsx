import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Heart, MessageCircle, Music } from 'lucide-react';
import { format } from 'date-fns';

export default function LiveFeedSection() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: videos } = useQuery({
    queryKey: ['liveFeedVideos'],
    queryFn: () => base44.entities.SocialVideo.list('-created_date'),
    initialData: [],
  });

  const { data: supporters } = useQuery({
    queryKey: ['liveFeedSupporters'],
    queryFn: () => base44.entities.SupporterProfile.filter({ is_public: true }, '-created_date'),
    initialData: [],
  });

  const { data: posts } = useQuery({
    queryKey: ['liveFeedPosts'],
    queryFn: () => base44.entities.FanPost.filter({ status: 'approved' }, '-created_date'),
    initialData: [],
  });

  const { data: releases } = useQuery({
    queryKey: ['liveFeedReleases'],
    queryFn: () => base44.entities.Release.filter({ is_published: true }, '-updated_date'),
    initialData: [],
  });

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['liveFeedVideos'] });
      queryClient.invalidateQueries({ queryKey: ['liveFeedSupporters'] });
      queryClient.invalidateQueries({ queryKey: ['liveFeedPosts'] });
      queryClient.invalidateQueries({ queryKey: ['liveFeedReleases'] });
    }, 10000);
    return () => clearInterval(interval);
  }, [queryClient]);

  const latestVideo = videos[0];
  const latestSupporter = supporters[0];
  const latestPost = posts[0];
  const latestRelease = releases[0];

  const items = [
    latestVideo && {
      key: 'video',
      icon: <Play className="w-4 h-4 text-primary" />,
      label: 'Latest Video',
      title: latestVideo.title || 'New video',
      sub: latestVideo.platform === 'tiktok' ? 'TikTok' : 'Instagram',
      date: latestVideo.created_date,
      onClick: () => navigate('/videos'),
    },
    latestRelease && {
      key: 'release',
      icon: <Music className="w-4 h-4 text-primary" />,
      label: 'Latest Release',
      title: latestRelease.title,
      sub: latestRelease.status?.replace(/_/g, ' '),
      date: latestRelease.updated_date,
      onClick: () => navigate('/music'),
    },
    latestSupporter && {
      key: 'supporter',
      icon: <Heart className="w-4 h-4 text-primary" />,
      label: 'Latest Supporter',
      title: latestSupporter.supporter_name || 'A supporter',
      sub: latestSupporter.tier?.replace(/_/g, ' ') || 'supporter',
      date: latestSupporter.created_date,
      onClick: () => navigate('/back-this'),
    },
    latestPost && {
      key: 'post',
      icon: <MessageCircle className="w-4 h-4 text-primary" />,
      label: 'Community',
      title: latestPost.author_name || 'A fan',
      sub: latestPost.content?.slice(0, 60) + (latestPost.content?.length > 60 ? '…' : ''),
      date: latestPost.created_date,
      onClick: () => navigate('/community'),
    },
  ].filter(Boolean);

  if (items.length === 0) return null;

  return (
    <section className="py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Live Feed</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={item.onClick}
              className="text-left bg-card/60 border border-border/30 rounded-2xl p-5 hover:border-primary/30 hover:bg-card/80 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="font-body text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50">{item.label}</span>
              </div>
              <p className="font-display text-base text-foreground group-hover:text-primary transition-colors leading-tight mb-1">{item.title}</p>
              <p className="font-body text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.sub}</p>
              {item.date && (
                <p className="font-body text-[10px] text-muted-foreground/40 mt-2">
                  {format(new Date(item.date), 'MMM d')}
                </p>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}