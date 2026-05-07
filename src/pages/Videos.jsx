import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SocialVideoEmbed from '@/components/public/SocialVideoEmbed';
import BePartOfThisCTA from '@/components/public/BePartOfThisCTA';

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Social</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground">Videos</h1>
          <p className="font-body text-sm text-muted-foreground mt-4">Instagram Reels & TikToks</p>
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