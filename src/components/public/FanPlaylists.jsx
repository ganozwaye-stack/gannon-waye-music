import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Music2 } from 'lucide-react';
import GoldShards from '@/components/public/GoldShards';

export default function FanPlaylists() {
  const { data: playlists = [] } = useQuery({
    queryKey: ['fanPlaylists'],
    queryFn: () => base44.entities.FanPlaylist.filter({ is_published: true }, 'sort_order'),
    initialData: [],
  });

  if (playlists.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">
      <div className="relative text-center mb-12 py-4">
        <GoldShards className="rounded-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4 flex items-center justify-center gap-2">
            <Music2 className="w-3 h-3" /> Curated for You
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground">Fan Playlists</h2>
          <p className="font-body text-sm text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
            Hand-picked by Gannon. Songs for the quiet moments, the hard moments, and the moments worth holding onto.
          </p>
        </motion.div>
      </div>

      <div className="space-y-10">
        {playlists.map((playlist, i) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border/40 rounded-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-0">
              {/* Spotify Embed */}
              <div className="bg-secondary/30 p-4 md:p-6">
                <iframe
                  src={playlist.spotify_embed_url}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ borderRadius: '12px' }}
                  title={playlist.title}
                />
              </div>

              {/* Curator Note */}
              <div className="p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border/30">
                <h3 className="font-display text-xl md:text-2xl text-foreground mb-2">{playlist.title}</h3>
                {playlist.description && (
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{playlist.description}</p>
                )}
                {playlist.curator_note && (
                  <div className="border-l-2 border-primary/40 pl-4">
                    <p className="font-display text-sm italic gradient-gold-glow leading-relaxed">
                      "{playlist.curator_note}"
                    </p>
                    <p className="font-body text-[10px] text-muted-foreground/60 mt-2 tracking-widest uppercase">— Gannon</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}