import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Play, Music, Camera, ShoppingBag, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { base44 } from '@/api/base44Client';
import { PUBLIC_RELEASE_FILTER, isPublicRelease } from '@/lib/publicRelease';

// A dynamic, live-updating feed of Gannon's recent activity: new music, new
// videos, studio photos and merch drops, pulled straight from the live data
// and sorted into one left-aligned timeline. Auto-refreshes every 15 seconds.
export default function HomeActivityFeed() {
  const { data: releases = [] } = useQuery({
    queryKey: ['feed-releases'],
    queryFn: () => base44.entities.Release.filter(PUBLIC_RELEASE_FILTER, '-release_date', 5),
    refetchInterval: 15000,
    initialData: [],
  });

  const { data: videos = [] } = useQuery({
    queryKey: ['feed-videos'],
    queryFn: () => base44.entities.SocialVideo.list('-created_date', 3),
    refetchInterval: 15000,
    initialData: [],
  });

  const { data: photos = [] } = useQuery({
    queryKey: ['feed-photos'],
    queryFn: () => base44.entities.GalleryImage.filter({ is_published: true }, '-created_date', 3),
    refetchInterval: 15000,
    initialData: [],
  });

  const { data: merch = [] } = useQuery({
    queryKey: ['feed-merch'],
    queryFn: () => base44.entities.MerchProduct.list('-created_date', 5),
    refetchInterval: 15000,
    initialData: [],
  });

  const items = [
    ...releases.filter(isPublicRelease).map((r) => ({
      key: `release-${r.id}`,
      icon: Music,
      label: 'New Music',
      title: r.title,
      sub: `Out now · ${r.type}`,
      date: r.release_date || r.created_date,
      to: r.id ? `/release/${r.id}` : '/music',
    })),
    ...videos.map((v) => ({
      key: `video-${v.id}`,
      icon: Play,
      label: 'Latest Video',
      title: v.title || 'New video',
      sub: v.platform === 'tiktok' ? 'TikTok' : v.platform === 'youtube_shorts' ? 'YouTube Shorts' : 'Instagram',
      date: v.created_date,
      to: '/videos',
    })),
    ...photos.map((p) => ({
      key: `photo-${p.id}`,
      icon: Camera,
      label: 'From the Studio',
      title: p.title || 'Studio photo',
      sub: 'Behind the scenes',
      date: p.created_date,
      to: '/gallery',
    })),
    ...merch.filter((m) => m.is_active && m.publication_status === 'live').map((m) => ({
      key: `merch-${m.id}`,
      icon: ShoppingBag,
      label: 'Merch Drop',
      title: m.name,
      sub: m.sale_price != null ? `Now $${m.sale_price} AUD` : 'Now in the store',
      date: m.created_date,
      to: '/store',
    })),
  ]
    .filter((i) => i.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <section className="py-10 md:py-14 px-4 md:px-6">
      <div className="max-w-6xl mx-auto text-left">
        <div className="flex items-center gap-3 mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow">Live Updates</p>
        </div>
        <h2 className="font-body text-3xl md:text-5xl gradient-gold-text mb-8">What I've Been Up To</h2>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-border/30 bg-card/40 p-6 flex items-start gap-3">
            <Activity className="w-5 h-5 text-primary mt-0.5" />
            <p className="font-body text-sm text-foreground/75">Fresh news is on the way. Check back in a moment.</p>
          </div>
        ) : (
          <div className="relative pl-2">
            <div className="absolute left-[26px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-border/40 to-transparent" />
            <div className="space-y-3">
              {items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                  >
                    <Link
                      to={item.to}
                      className="group relative flex items-center gap-4 rounded-2xl border border-border/30 bg-card/40 px-4 py-3.5 hover:border-primary/40 hover:bg-card/70 transition-all text-left"
                    >
                      <div className="relative z-10 w-10 h-10 rounded-full bg-secondary/70 border border-primary/30 flex items-center justify-center group-hover:border-primary/60 transition-colors">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <p className="font-body text-[10px] tracking-[0.25em] uppercase gradient-gold-text">{item.label}</p>
                          <p className="font-body text-[10px] text-muted-foreground/50">
                            {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                          </p>
                        </div>
                        <p className="font-display text-base text-foreground group-hover:text-primary transition-colors truncate">{item.title}</p>
                        <p className="font-body text-xs text-muted-foreground truncate">{item.sub}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}