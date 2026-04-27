import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import SocialVideoEmbed from '@/components/public/SocialVideoEmbed';

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
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">Social</p>
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
                  ? 'bg-primary text-primary-foreground'
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}