import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function FeaturedVideoSection() {
  const { data: videos } = useQuery({
    queryKey: ['featuredVideos'],
    queryFn: () => base44.entities.FeaturedVideo.filter({ is_active: true }),
    initialData: [],
  });

  const featured = videos[0];
  if (!featured) return null;

  const isYoutube = featured.url?.includes('youtube') || featured.url?.includes('youtu.be');
  const isVimeo = featured.url?.includes('vimeo');
  const isTiktok = featured.url?.includes('tiktok');
  const isInstagram = featured.url?.includes('instagram');

  let embedUrl = featured.url;
  if (isYoutube && !featured.url.includes('embed')) {
    const videoId = featured.url.split('v=')[1] || featured.url.split('youtu.be/')[1];
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1`;
  }
  if (isVimeo && !featured.url.includes('player.vimeo')) {
    const videoId = featured.url.split('vimeo.com/')[1];
    embedUrl = `https://player.vimeo.com/video/${videoId}`;
  }

  return (
    <section className="py-12 md:py-10 md:py-12 px-4 md:px-6 bg-secondary/20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-left mb-8"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Official Video</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground">{featured.title || 'Thank You'}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden bg-black shadow-2xl"
        >
          {isYoutube || isVimeo ? (
            <iframe
              width="100%"
              height="600"
              src={embedUrl}
              title={featured.title}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
              allowFullScreen
              className="w-full aspect-video"
            />
          ) : (
            <a href={featured.url} target="_blank" rel="noopener noreferrer" className="block relative group">
              {featured.thumbnail_url ? (
                <img src={featured.thumbnail_url} alt={featured.title} className="w-full h-auto" />
              ) : (
                <div className="w-full aspect-video bg-secondary flex items-center justify-center">
                  <Play className="w-16 h-16 text-primary" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                <Play className="w-16 h-16 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
