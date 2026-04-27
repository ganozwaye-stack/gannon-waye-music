import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Music2, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const STATUS_LABELS = {
  idea: 'In the works',
  writing: 'Writing',
  pre_production: 'Pre-Production',
  recording: 'Recording',
  mixing: 'Mixing',
  mastering: 'Mastering',
  ready: 'Coming Soon',
  released: 'Out Now',
};

export default function Music() {
  const { data: releases } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
    initialData: [],
  });

  const published = releases.filter(r => r.is_published);

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Discography</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground">Music</h1>
        </motion.div>

        {published.length === 0 ? (
          <div className="text-center py-20">
            <Music2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">Music coming soon. Stay tuned.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {published.map((release, i) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0 bg-card border border-border/40 rounded-2xl overflow-hidden hover:border-primary/20 transition-all"
              >
                <div className="aspect-square md:aspect-auto md:h-full bg-secondary/50 overflow-hidden">
                  {release.artwork_url && release.status !== 'released' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-secondary/80 min-h-[200px]" style={{ backgroundImage: 'url(https://media.base44.com/images/public/69eb7905ca6eb4180010f794/bd4d2cad9_generated_image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                        <Gift className="w-10 h-10 text-primary" />
                        <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-text">Artwork Hidden</p>
                      </div>
                    </div>
                  ) : release.artwork_url ? (
                    <img src={release.artwork_url} alt={release.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-16 h-16 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                <div className="p-5 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-body text-[10px] tracking-widest uppercase border-primary/30 text-primary">
                      {release.type}
                    </Badge>
                    <Badge className={`font-body text-[10px] tracking-widest uppercase ${
                      release.status === 'released' ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {STATUS_LABELS[release.status] || release.status}
                    </Badge>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl text-foreground">{release.title}</h2>
                  {release.release_date && (release.status === 'released' || new Date() >= new Date('2026-05-10')) && (
                    <p className="font-body text-sm text-muted-foreground mt-2">
                      {new Date(release.release_date).toLocaleDateString('en-AU', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                  {release.description && (
                    <p className="font-body text-foreground/60 mt-4 leading-relaxed">{release.description}</p>
                  )}
                  {release.credits && (
                    <p className="font-body text-xs text-muted-foreground mt-3">{release.credits}</p>
                  )}

                  {/* Streaming Links */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    {release.spotify_link && (
                       <a href={release.spotify_link} target="_blank" rel="noopener noreferrer">
                         <Button size="sm" className="rounded-full gap-2 font-body text-xs gradient-gold-button border-0">
                           🎧 Spotify <ExternalLink className="w-3 h-3" />
                         </Button>
                       </a>
                     )}
                     {release.apple_music_link && (
                       <a href={release.apple_music_link} target="_blank" rel="noopener noreferrer">
                         <Button size="sm" className="rounded-full gap-2 font-body text-xs gradient-gold-button border-0">
                           🍎 Apple Music <ExternalLink className="w-3 h-3" />
                         </Button>
                       </a>
                     )}
                     {release.youtube_link && (
                       <a href={release.youtube_link} target="_blank" rel="noopener noreferrer">
                         <Button size="sm" className="rounded-full gap-2 font-body text-xs gradient-gold-button border-0">
                           ▶️ YouTube <ExternalLink className="w-3 h-3" />
                         </Button>
                       </a>
                     )}
                     {release.price && release.status === 'released' && (
                       <Button size="sm" className="rounded-full gap-2 font-body text-xs gradient-gold-button border-0">
                         Buy ${release.price.toFixed(2)}
                       </Button>
                     )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}