import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, ChevronDown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GannonSignature from '@/components/global/GannonSignature';

export default function LyricsPage() {
  const [openId, setOpenId] = useState(null);

  // SAFETY: Only fetch lyrics that are BOTH is_published: true AND publishing_safe: true.
  // RLS also enforces is_published on the server side, so unpublished lyrics are never returned to public users.
  // Until Gannon explicitly approves a lyric, this query returns empty and the page shows a "Coming Soon" teaser.
  const { data: lyrics = [] } = useQuery({
    queryKey: ['publishedSafeLyrics'],
    queryFn: () => base44.entities.Lyric.filter({ is_published: true, publishing_safe: true }, 'sort_order'),
    initialData: [],
  });

  return (
    <>
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4c4319141_image.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/75 to-background" />
    </div>
    <div className="min-h-screen py-24 px-4 md:px-8 relative">
      <div className="max-w-3xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Words & Meaning</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Lyrics</h1>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Every word is intentional. Read along, sit with it, or find the line that feels like yours.
          </p>
        </motion.div>

        {lyrics.length === 0 ? (
          /* ── COMING SOON / TEASER ── No full lyrics visible until a Lyric record is both is_published: true AND publishing_safe: true */
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center border border-primary/20 text-primary/60 mx-auto mb-6">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-display text-2xl text-foreground mb-3">Lyrics Coming Soon</h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              The full lyrics archive is being carefully prepared. Each song's words will appear here once they're finalised and approved for publishing.
            </p>
            <Link to="/music" className="mt-6 inline-block">
              <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase">
                Go to Music
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {lyrics.map((lyric, i) => (
              <motion.div
                key={lyric.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/40 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(openId === lyric.id ? null : lyric.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-secondary/20 transition-colors"
                >
                  <div>
                    <p className="font-display text-xl text-foreground">{lyric.title}</p>
                    {lyric.release_title && (
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mt-0.5">{lyric.release_title}</p>
                    )}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openId === lyric.id ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openId === lyric.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 border-t border-border/30 pt-6 space-y-6">
                        <pre className="font-display text-foreground/80 leading-loose text-base whitespace-pre-wrap italic bg-secondary/20 rounded-xl p-6">
                          {lyric.lyrics_text}
                        </pre>
                        {lyric.copyright_year && (
                          <p className="font-body text-xs text-muted-foreground mt-6 pt-4 border-t border-border/30">
                            Copyright © Gannon Waye {lyric.copyright_year}
                          </p>
                        )}
                        <div className="flex justify-end mt-8 pr-4">
                          <GannonSignature />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/back-this">
            <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
              Support the Music 🤍
            </Button>
          </Link>
        </div>

      </div>
    </div>
    </>
  );
}