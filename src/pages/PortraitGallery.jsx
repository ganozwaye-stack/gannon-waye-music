import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Music, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function PortraitGallery() {
  const { data: posts = [] } = useQuery({
    queryKey: ['galleryPosts'],
    queryFn: () => base44.entities.FanPost.filter({ status: 'approved' }, '-created_date', 20),
    initialData: [],
  });

  const { data: media = [] } = useQuery({
    queryKey: ['galleryMedia'],
    queryFn: () => base44.entities.FanMedia.filter({ is_featured: true }, '-created_date', 16),
    initialData: [],
  });

  const combined = [...posts.slice(0, 8), ...media.slice(0, 8)].sort((a, b) => 
    new Date(b.created_date || 0) - new Date(a.created_date || 0)
  );

  return (
    <div className="min-h-screen py-20 px-4 md:px-6 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Portrait Gallery</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-4">Community Portraits</h1>
          <p className="font-body text-foreground/60 max-w-xl mx-auto">
            Every supporter has a story. Every story matters. This is our collective portrait.
          </p>
        </motion.div>

        {/* Portrait Grid - Vertical/Portrait Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {combined.map((item, i) => {
            const isMedia = item.file_url;
            const height = i % 5 === 0 ? 'break-inside-avoid' : 'break-inside-avoid';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className={`${height} relative rounded-2xl overflow-hidden bg-card border border-border/30 hover:border-primary/40 transition-all group`}
              >
                {isMedia ? (
                  <div className="relative">
                    {item.file_type === 'photo' ? (
                      <img
                        src={item.file_url}
                        alt={item.name}
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <video
                        src={item.file_url}
                        className="w-full h-auto object-cover"
                        muted
                        loop
                        onMouseEnter={e => e.target.play()}
                        onMouseLeave={e => {
                          e.target.pause();
                          e.target.currentTime = 0;
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="text-white">
                        <p className="font-display text-sm">{item.name}</p>
                        <p className="font-body text-[10px] text-white/70 mt-1 line-clamp-2">{item.caption}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-gradient-to-br from-secondary/40 to-secondary/10 min-h-[200px]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="font-display text-[10px] text-primary">
                          {item.author_name?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <p className="font-body text-[10px] font-medium text-foreground truncate">
                        {item.author_name || 'Anonymous'
                      }</p>
                    </div>
                    <p className="font-body text-xs text-foreground leading-relaxed line-clamp-6">
                      {item.content}
                    </p>
                  </div>
                )}

                {/* Hover actions */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-primary/80 transition-colors">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-primary/80 transition-colors">
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {combined.length === 0 && (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">No portraits yet. Be the first to share your story.</p>
            <Link to="/community">
              <Button className="mt-4 rounded-full gradient-gold-button border-0">
                Share Your Story
              </Button>
            </Link>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="font-body text-sm text-muted-foreground mb-4">Want to be part of the gallery?</p>
          <Link to="/community">
            <Button className="rounded-full gap-2 gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">
              <Music className="w-4 h-4" /> Join the Movement
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}