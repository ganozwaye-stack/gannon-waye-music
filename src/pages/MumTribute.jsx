import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Real uploaded images of Mum — use these as the single source of truth
// Add real image URLs here as Gannon uploads them
const MUM_IMAGES = [
  // Portrait / face moments
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c053c0cf4_generated_image.png', caption: 'Always herself', type: 'portrait' },
];

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose }) {
  const [current, setCurrent] = useState(index);
  const img = images[current];

  const prev = (e) => { e.stopPropagation(); setCurrent(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setCurrent(i => (i + 1) % images.length); };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <X className="w-4 h-4" />
        </button>
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
              ‹
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
              ›
            </button>
          </>
        )}
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl max-h-[85vh] flex flex-col items-center gap-3"
          onClick={e => e.stopPropagation()}
        >
          <img src={img.url} alt={img.caption || 'Memory'} className="max-h-[75vh] max-w-full object-contain rounded-xl" />
          {img.caption && <p className="font-body text-sm text-white/60 italic text-center">{img.caption}</p>}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Clickable image tile ──────────────────────────────────────────────────────
function MemoryTile({ image, allImages, tileIndex }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => setLightboxOpen(true)}
        className="cursor-pointer overflow-hidden rounded-xl border border-primary/10 hover:border-primary/30 transition-all group relative"
      >
        <img src={image.url} alt={image.caption || 'Memory'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end p-3 opacity-0 group-hover:opacity-100">
          {image.caption && <p className="font-body text-xs text-white/90 italic">{image.caption}</p>}
        </div>
      </motion.div>
      {lightboxOpen && (
        <Lightbox images={allImages} index={tileIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MumTribute() {
  const [storyExpanded, setStoryExpanded] = useState(false);

  return (
    <div className="min-h-screen relative">

      {/* APPROVAL GATE BANNER */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-orange-500/15 border-b border-orange-500/30 px-4 py-2 text-center">
        <p className="font-body text-[10px] tracking-widest uppercase text-orange-400">
          🔒 Built — Awaiting Gannon Review · Not in main nav
        </p>
      </div>

      {/* Cinematic background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, hsl(220,15%,4%) 0%, hsl(0,20%,8%) 40%, hsl(30,15%,6%) 70%, hsl(220,15%,5%) 100%)'
        }} />
        {/* Warm burgundy glow */}
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(ellipse at 30% 40%, hsl(340,40%,20%) 0%, transparent 60%)'
        }} />
        {/* Soft gold shimmer top */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-64 opacity-10"
          animate={{ opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(ellipse at 50% 0%, hsl(40,85%,58%) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 pt-24 pb-20">

        {/* ── HERO ── */}
        <section className="min-h-[85vh] flex items-center justify-center px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <p className="font-body text-[10px] tracking-[0.5em] uppercase gradient-gold-glow mb-8">For Her</p>

              <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6 leading-tight">
                Mum.
              </h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"
              />

              <p className="font-display text-xl md:text-2xl text-foreground/70 italic leading-relaxed mb-6">
                "She was my person.<br />My best friend.<br />The one who truly understood me."
              </p>

              <p className="font-body text-sm text-foreground/50 leading-relaxed max-w-xl mx-auto">
                We lost her only twenty days after diagnosis.<br />
                Even while dying, she was still protecting me.<br />
                Even in her last moments, she was still loving everyone else first.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-10 flex justify-center"
              >
                <Heart className="w-8 h-8 text-primary/40" style={{ filter: 'drop-shadow(0 0 8px hsl(40,85%,58%,0.3))' }} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── PORTRAIT GALLERY ── */}
        {MUM_IMAGES.length > 0 && (
          <section className="px-4 md:px-8 max-w-5xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <p className="font-body text-[10px] tracking-[0.4em] uppercase gradient-gold-glow mb-3">Memories</p>
              <p className="font-body text-xs text-muted-foreground">Click any image to enlarge</p>
            </motion.div>

            <div className="columns-2 md:columns-3 gap-3 space-y-3">
              {MUM_IMAGES.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="break-inside-avoid"
                >
                  <MemoryTile image={img} allImages={MUM_IMAGES} tileIndex={i} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── GANNON'S WORDS ── */}
        <section className="px-4 md:px-8 max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card/40 backdrop-blur-sm border border-primary/10 rounded-3xl p-8 md:p-12"
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase gradient-gold-glow mb-6">In His Own Words</p>

            <div className="space-y-4 font-body text-foreground/75 leading-relaxed text-base">
              <p>
                There has been a lot of loss in my world. Losing Mum not too long ago — who was my best friend and my biggest fan — was something that reshaped everything.
              </p>
              <p>
                She organised for someone to be with me when she called to say she didn't have long left. Twenty days after diagnosis. Even in death, she was still making sure everyone else was okay first.
              </p>

              {/* Expandable */}
              <AnimatePresence>
                {storyExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden space-y-4"
                  >
                    <p>
                      She had silver-grey hair and warm eyes behind her glasses. She wore her gold jewellery every day. She had her coffee in the morning and her garden in the afternoon. She rolled her own cigarettes and didn't apologise for who she was.
                    </p>
                    <p>
                      She was the one person in my life who saw all of me — the complicated parts, the lost parts, the parts still figuring things out — and stayed completely. Unconditionally. Without conditions.
                    </p>
                    <p>
                      At 28, when something inside me broke differently, the first person I called was her. I stayed honest throughout all of it. She made that possible.
                    </p>
                    <p className="italic text-foreground/60 border-l-2 border-primary/30 pl-4">
                      "I called my mum straight away. I stayed honest throughout all of it."
                    </p>
                    <p>
                      This tribute exists because she deserves to be seen. Not just in memory, but here — in the music, in the story, in the reason any of this exists at all.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setStoryExpanded(!storyExpanded)}
              className="mt-6 flex items-center gap-2 font-body text-xs tracking-wider uppercase text-primary/70 hover:text-primary transition-colors"
            >
              {storyExpanded ? 'Read less' : 'Read more'}
              <ChevronDown className={`w-3 h-3 transition-transform ${storyExpanded ? 'rotate-180' : ''}`} />
            </button>
          </motion.div>
        </section>

        {/* ── QUOTE CENTREPIECE ── */}
        <section className="px-4 md:px-8 max-w-2xl mx-auto mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/40 to-transparent mx-auto mb-6" />
            <p className="font-display text-2xl md:text-3xl gradient-gold-glow italic leading-relaxed mb-4">
              "Even while dying, she was still protecting me."
            </p>
            <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">Gannon Waye</p>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/40 to-transparent mx-auto mt-6" />
          </motion.div>
        </section>

        {/* ── OBJECTS & STILL LIFE ── */}
        <section className="px-4 md:px-8 max-w-5xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase gradient-gold-glow mb-3">The Things She Left Behind</p>
            <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto">
              Coffee. A garden. Gold jewellery. Rollies. Her warmth in ordinary objects.
            </p>
          </motion.div>

          {/* Placeholder grid — to be populated with real memory-object images */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {['Coffee', 'Garden', 'Jewellery', 'Home', 'Letters', 'Flowers', 'Garden', 'Memories'].map((label, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="aspect-square bg-card/30 border border-primary/5 rounded-xl flex items-center justify-center"
              >
                <p className="font-body text-[9px] tracking-widest uppercase text-muted-foreground/30">{label}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center font-body text-[10px] text-muted-foreground/40 mt-4 tracking-wide">
            Real images to be uploaded — placeholders only
          </p>
        </section>

        {/* ── FOOTER CTA ── */}
        <section className="px-4 md:px-8 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Heart className="w-8 h-8 text-primary/40 mx-auto" />
            <p className="font-display text-xl text-foreground">She would have loved this.</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              If this story has touched you, the music carries her with it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link to="/music">
                <Button className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase px-8 py-5">
                  Hear the Music
                </Button>
              </Link>
              <Link to="/this-is-my-life">
                <Button variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-primary/10 font-body text-sm tracking-wider uppercase px-8 py-5">
                  Read His Story
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}