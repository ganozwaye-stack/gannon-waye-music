import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SocialVideoEmbed from '@/components/public/SocialVideoEmbed';
import BePartOfThisCTA from '@/components/public/BePartOfThisCTA';
import GoldShards from '@/components/public/GoldShards';

// TODO: Upload the Thank You cover reveal video and replace null with the MP4/hosted URL
const THANK_YOU_REVEAL_VIDEO_URL = null;
// New wide banner — set URL after owner uploads the asset
const THANK_YOU_BANNER_URL = null; // TODO: set to uploaded banner URL e.g. 'https://media.base44.com/...'
const THANK_YOU_COVER = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6dde7d697_2.jpg';

const PLATFORMS = ['all', 'instagram', 'tiktok'];

export default function Videos() {
  const [filter, setFilter] = useState('all');

  const { data: videos } = useQuery({
    queryKey: ['socialVideos'],
    queryFn: () => base44.entities.SocialVideo.list('sort_order'),
    initialData: [],
  });

  const filtered = videos.filter(v => filter === 'all' || v.platform === filter);

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Hero with gold shards atmosphere */}
        <div className="relative text-center mb-12 py-4">
          <GoldShards className="rounded-3xl" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Visual</p>
            <h1 className="font-display text-4xl md:text-6xl text-foreground">Videos</h1>
            <p className="font-body text-sm text-muted-foreground mt-4">Instagram Reels &amp; TikToks · Official 05 June 2026</p>
          </motion.div>
        </div>

        {/* Thank You cover reveal feature card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-12"
        >
          <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-4 text-center">Featured</p>
          {THANK_YOU_REVEAL_VIDEO_URL ? (
            <div className="relative rounded-2xl overflow-hidden border border-primary/30 bg-black max-w-2xl mx-auto shadow-2xl">
              <video
                src={THANK_YOU_REVEAL_VIDEO_URL}
                muted playsInline loop autoPlay preload="metadata"
                className="w-full object-cover"
                style={{ maxHeight: 480 }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                <p className="font-display text-xl text-white">Thank You — Cover Reveal</p>
                <p className="font-body text-xs text-primary mt-1">05 June 2026</p>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto rounded-2xl border border-primary/20 bg-card/60 overflow-hidden">
              {THANK_YOU_BANNER_URL ? (
                <img src={THANK_YOU_BANNER_URL} alt="Thank You — Gannon Waye" className="w-full object-cover" style={{ maxHeight: 320 }} />
              ) : (
                <div className="relative aspect-video bg-gradient-to-br from-secondary/60 to-background overflow-hidden flex items-center justify-center">
                  <img src={THANK_YOU_COVER} alt="Thank You — Gannon Waye" className="h-full w-auto object-contain opacity-70" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                      <Play className="w-7 h-7 text-primary" />
                    </div>
                  </div>
                </div>
              )}
              <div className="p-5 text-center">
                <p className="font-display text-lg text-foreground">Thank You — Cover Reveal Video</p>
                <p className="font-body text-xs text-muted-foreground mt-1">Upload asset to enable preview · 05 June 2026</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Filter tabs */}
        <div className="flex gap-2 justify-center mb-10">
          {PLATFORMS.map(p => (
            <button
             key={p}
             onClick={() => setFilter(p)}
             className={`px-5 py-2 rounded-full font-body text-xs tracking-widest uppercase transition-all ${
               filter === p
                 ? 'gradient-gold-button border-0'
                 : 'bg-secondary/60 text-muted-foreground hover:text-foreground border border-border/40'
             }`}
            >
              {p === 'all' ? 'All' : p === 'instagram' ? 'Instagram' : 'TikTok'}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground">No videos yet. Add some in the admin panel.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filtered.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="break-inside-avoid"
              >
                <SocialVideoEmbed video={video} />
                {video.title && (
                  <p className="font-body text-sm text-foreground/60 mt-2 px-1">{video.title}</p>
                )}
                <div className="flex gap-2 mt-3 px-1">
                  <Link to="/this-is-my-life" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full rounded-full font-body text-xs tracking-wider uppercase border-border/40 hover:border-primary/40">
                      See Full Story <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                  <Link to="/back-this" className="flex-1">
                    <Button size="sm" className="w-full rounded-full font-body text-xs tracking-wider uppercase gradient-gold-button border-0">
                      <Heart className="w-3 h-3" /> Be Part Of This
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <BePartOfThisCTA context="Enjoy the content? You can help fund more of it — directly." />
      </div>
    </div>
  );
}