import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function FanHighlightCommunity() {
  const { data: posts = [] } = useQuery({
    queryKey: ['highlightPosts'],
    queryFn: () => base44.entities.FanPost.filter({ status: 'approved' }, '-created_date', 12),
    initialData: [],
  });

  const { data: media = [] } = useQuery({
    queryKey: ['highlightMedia'],
    queryFn: () => base44.entities.FanMedia.filter({ is_featured: true }, '-created_date', 8),
    initialData: [],
  });

  const combined = [...posts.slice(0, 6), ...media.slice(0, 6)];
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <section className="py-20 md:py-28 px-4 md:px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Community Spotlight</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">Fan Highlight Wall</h2>
          <p className="font-body text-foreground/60 max-w-xl mx-auto">
            Real fans. Real stories. Real support. This is what the movement looks like.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {combined.map((item, i) => {
            const isMedia = item.file_url;
            const height = i % 3 === 0 ? 'row-span-2' : '';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedItem(item)}
                className={`${height} relative rounded-2xl overflow-hidden cursor-pointer group bg-card border border-border/30 hover:border-primary/40 transition-all`}
              >
                {/* Media preview */}
                {isMedia ? (
                  <div className="w-full h-full min-h-[250px]">
                    {item.file_type === 'photo' ? (
                      <img
                        src={item.file_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <video
                        src={item.file_url}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="text-white">
                        <p className="font-display text-lg">{item.name}</p>
                        <p className="font-body text-xs text-white/70 mt-1">{item.caption}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 h-full flex flex-col justify-between bg-gradient-to-br from-secondary/40 to-secondary/10 min-h-[250px]">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-display text-xs text-primary">
                            {item.author_name?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <p className="font-body text-xs font-medium text-foreground">{item.author_name || 'Anonymous'}</p>
                      </div>
                      <p className="font-body text-sm text-foreground leading-relaxed line-clamp-4">
                        {item.content}
                      </p>
                    </div>
                    <p className="font-body text-[10px] text-muted-foreground mt-4">
                      {item.created_date ? format(new Date(item.created_date), 'MMM d') : ''}
                    </p>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-body text-xs text-white tracking-wider uppercase">View Story</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA + Join Community */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-primary/20 rounded-2xl p-8 text-center"
        >
          <p className="font-body text-foreground/70 mb-2">Want to be featured here?</p>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Share your story, art, or support moment. Tag @gannonwaye on TikTok or Instagram.
          </p>
          <Link to="/community">
            <Button className="rounded-full gap-2 gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">
              Join the Community <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card rounded-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col border border-primary/30"
            >
              {/* Media */}
              {selectedItem.file_url ? (
                <div className="bg-secondary/60 overflow-hidden max-h-[60vh]">
                  {selectedItem.file_type === 'photo' ? (
                    <img src={selectedItem.file_url} alt={selectedItem.name} className="w-full h-full object-contain" />
                  ) : (
                    <video src={selectedItem.file_url} controls className="w-full h-full" />
                  )}
                </div>
              ) : null}

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-display text-xs text-primary">
                      {selectedItem.author_name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-body font-medium text-foreground">{selectedItem.author_name || 'Anonymous'}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      {selectedItem.created_date ? format(new Date(selectedItem.created_date), 'MMM d, yyyy') : ''}
                    </p>
                  </div>
                </div>

                <h3 className="font-display text-2xl text-foreground mb-3">{selectedItem.name || selectedItem.title}</h3>
                <p className="font-body text-foreground/70 leading-relaxed mb-4">
                  {selectedItem.content || selectedItem.caption}
                </p>

                {selectedItem.description && (
                  <p className="font-body text-sm text-muted-foreground italic border-l-2 border-primary/40 pl-4 py-2">
                    {selectedItem.description}
                  </p>
                )}

                <div className="flex gap-3 mt-6 pt-4 border-t border-border/30">
                  <button className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Heart className="w-4 h-4" /> Love
                  </button>
                  <button className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}