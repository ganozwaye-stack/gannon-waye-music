import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// ─── Real Sonia images — add more as uploaded ────────────────────────────────
const MUM_IMAGES = [
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c053c0cf4_generated_image.png', caption: 'Always herself', type: 'portrait' },
];

// ─── Gold lace heart SVG motif ────────────────────────────────────────────────
function GoldLaceHeart({ className = '', size = 320 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="heartGold" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffe8a0" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#d4a850" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a07828" stopOpacity="0.4" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer heart shape */}
      <path
        d="M100 170 C100 170 10 110 10 55 C10 30 28 15 50 15 C68 15 84 26 100 42 C116 26 132 15 150 15 C172 15 190 30 190 55 C190 110 100 170 100 170Z"
        stroke="url(#heartGold)"
        strokeWidth="1.2"
        fill="none"
        filter="url(#glow)"
        opacity="0.9"
      />

      {/* Inner lace heart */}
      <path
        d="M100 155 C100 155 22 102 22 57 C22 37 37 24 55 24 C71 24 86 34 100 48 C114 34 129 24 145 24 C163 24 178 37 178 57 C178 102 100 155 100 155Z"
        stroke="url(#heartGold)"
        strokeWidth="0.7"
        strokeDasharray="4 3"
        fill="none"
        opacity="0.55"
      />

      {/* Decorative inner dots at the top curves */}
      <circle cx="55" cy="30" r="2" fill="#d4a850" opacity="0.6" />
      <circle cx="145" cy="30" r="2" fill="#d4a850" opacity="0.6" />
      <circle cx="68" cy="20" r="1.2" fill="#ffe8a0" opacity="0.5" />
      <circle cx="132" cy="20" r="1.2" fill="#ffe8a0" opacity="0.5" />

      {/* Filigree horizontal lines */}
      <line x1="62" y1="55" x2="138" y2="55" stroke="#d4a850" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.35" />
      <line x1="52" y1="72" x2="148" y2="72" stroke="#d4a850" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />
      <line x1="47" y1="90" x2="153" y2="90" stroke="#d4a850" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.25" />

      {/* GW monogram at bottom of heart */}
      <text
        x="100"
        y="138"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="11"
        fill="url(#heartGold)"
        opacity="0.75"
        letterSpacing="3"
      >
        GW
      </text>

      {/* Small cross at bottom point */}
      <line x1="100" y1="162" x2="100" y2="172" stroke="#d4a850" strokeWidth="0.7" opacity="0.5" />
      <line x1="96" y1="166" x2="104" y2="166" stroke="#d4a850" strokeWidth="0.7" opacity="0.5" />
    </svg>
  );
}

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
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <X className="w-4 h-4" />
        </button>
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <ChevronRight className="w-5 h-5" />
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
      {lightboxOpen && <Lightbox images={allImages} index={tileIndex} onClose={() => setLightboxOpen(false)} />}
    </>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center gap-4 my-16 px-4 max-w-2xl mx-auto">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/30" />
      <Heart className="w-4 h-4 text-primary/50" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/30" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MumTribute() {
  const [storyExpanded, setStoryExpanded] = useState(false);

  return (
    <div className="min-h-screen relative">

      {/* Cinematic background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, hsl(220,15%,4%) 0%, hsl(0,20%,8%) 40%, hsl(30,15%,6%) 70%, hsl(220,15%,5%) 100%)'
        }} />
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(ellipse at 30% 40%, hsl(340,40%,20%) 0%, transparent 60%)'
        }} />
        <motion.div
          className="absolute top-0 left-0 right-0 h-64 opacity-10"
          animate={{ opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(ellipse at 50% 0%, hsl(40,85%,58%) 0%, transparent 70%)' }}
        />
      </div>

      {/* Page content — pt accounts for fixed nav (80px) + no admin bar on this page */}
      <div className="relative z-10 pt-28 pb-40">

        {/* ── HERO ── */}
        <section className="min-h-[90vh] flex items-center justify-center px-4 relative">

          {/* Background gold lace heart — large, centred, translucent */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: 'easeOut' }}
            >
              <GoldLaceHeart size={520} className="opacity-[0.12]" />
            </motion.div>
          </div>

          <div className="text-center max-w-3xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              {/* Eyebrow */}
              <p className="font-body text-[10px] tracking-[0.6em] uppercase gradient-gold-glow mb-6">For Sonia</p>

              {/* Main title */}
              <h1 className="font-display text-5xl md:text-8xl text-foreground mb-4 leading-none">
                For Mum
              </h1>
              <p className="font-display text-lg md:text-2xl text-foreground/50 italic mb-8 tracking-wide">
                Sonia Katisa Waye
              </p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-10"
              />

              {/* Primary lyric hook — in a gold bordered card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="border border-primary/20 rounded-2xl px-8 py-7 mb-8 backdrop-blur-sm bg-black/20 max-w-xl mx-auto"
              >
                <p className="font-display text-2xl md:text-3xl text-foreground/90 italic leading-relaxed mb-3">
                  "Your last breath took mine away,<br />
                  there's not much more I have to say."
                </p>
                <div className="w-12 h-px bg-primary/30 mx-auto my-3" />
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">From "Without You Here"</p>
                <p className="font-body text-[10px] text-muted-foreground/60 mt-1">Written by Gannon Waye · Mother's Day · 10 May 2026 · 12:30am</p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="font-body text-sm text-foreground/50 leading-relaxed max-w-lg mx-auto mb-10"
              >
                A page for the woman whose love, strength, humour and wisdom still carry me.
              </motion.p>

              {/* Scroll cue */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="flex flex-col items-center gap-2"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ChevronDown className="w-5 h-5 text-primary/40" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── WHO SHE WAS ── */}
        <section className="px-4 md:px-8 max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase gradient-gold-glow mb-3">Who She Was</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card/40 backdrop-blur-sm border border-primary/10 rounded-3xl p-8 md:p-12"
          >
            <div className="space-y-4 font-body text-foreground/75 leading-relaxed text-base">
              <p>
                There has been a lot of loss in my world. Losing Mum not too long ago — who was my best friend and my biggest fan — was something that reshaped everything.
              </p>
              <p>
                She organised for someone to be with me when she called to say she didn't have long left. Twenty days after diagnosis. Even in death, she was still making sure everyone else was okay first.
              </p>

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

        <GoldDivider />

        {/* ── HER WORLD ── */}
        <section className="px-4 md:px-8 max-w-5xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase gradient-gold-glow mb-3">Her World</p>
            <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto">
              Coffee. A garden. Gold jewellery. Rollies. Ugg boots. Dogs. Her warmth in every ordinary moment.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Morning Coffee', icon: '☕', desc: 'First thing, every day' },
              { label: 'The Garden', icon: '🌿', desc: 'Her quiet place' },
              { label: 'Gold Jewellery', icon: '✨', desc: 'Always wearing it' },
              { label: 'Rollies', icon: '🍃', desc: 'Didn\'t apologise for who she was' },
              { label: 'Ugg Boots', icon: '🏡', desc: 'Home was her domain' },
              { label: 'The Dogs', icon: '🐾', desc: 'Loved unconditionally' },
              { label: 'Her Robe', icon: '🫶', desc: 'Burgundy, warm, hers' },
              { label: 'Garden Flowers', icon: '🌸', desc: 'Orange vine, elephant ears' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-card/30 border border-primary/10 rounded-2xl p-4 text-center hover:border-primary/25 transition-all"
              >
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="font-display text-sm text-foreground/80 mb-1">{item.label}</p>
                <p className="font-body text-[10px] text-muted-foreground/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <GoldDivider />

        {/* ── QUOTE CENTREPIECE ── */}
        <section className="px-4 md:px-8 max-w-2xl mx-auto mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/40 to-transparent mx-auto mb-6" />
            <p className="font-display text-2xl md:text-3xl gradient-gold-glow italic leading-relaxed mb-4">
              "She was my person. My best friend.<br />The one who truly understood me."
            </p>
            <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">Gannon Waye</p>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/40 to-transparent mx-auto mt-6" />
          </motion.div>
        </section>

        {/* ── WITHOUT YOU HERE ── */}
        <section className="px-4 md:px-8 max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase gradient-gold-glow mb-3">Without You Here</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card/40 border border-primary/10 rounded-2xl p-6"
            >
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">The Song</p>
              <p className="font-body text-foreground/70 leading-relaxed text-sm mb-4">
                Written at 12:30am on Mother's Day, 10 May 2026. The words came all at once — grief and love arriving in the same breath.
              </p>
              <p className="font-body text-foreground/70 leading-relaxed text-sm">
                This song was never planned. It arrived the way real things do — when there was no other option but to let it out.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card/40 border border-primary/10 rounded-2xl p-6 flex flex-col gap-4"
            >
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Lyric Moments</p>

              <div className="border-l-2 border-primary/30 pl-4">
                <p className="font-display text-base italic text-foreground/80 leading-relaxed">
                  "Your last breath took mine away,<br />
                  there's not much more I have to say."
                </p>
              </div>

              <div className="border-l-2 border-primary/20 pl-4">
                <p className="font-display text-sm italic text-foreground/60 leading-relaxed">
                  "Even while dying, she was still protecting me."
                </p>
              </div>

              <p className="font-body text-[10px] text-muted-foreground/50 mt-auto">
                Mother's Day · 10 May 2026 · 12:30am
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── GALLERY ── */}
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

        <GoldDivider />

        {/* ── CARRYING HER WITH ME ── */}
        <section className="px-4 md:px-8 max-w-2xl mx-auto mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase gradient-gold-glow mb-6">Carrying Her With Me</p>
            <GoldLaceHeart size={120} className="mx-auto opacity-40 mb-6" />
            <p className="font-body text-foreground/60 leading-relaxed text-sm max-w-md mx-auto">
              She lives in the music. In the courage it took to put it all out there. In every person who hears it and feels less alone. She made that possible.
            </p>
            <p className="font-display text-lg italic text-foreground/50 mt-6">
              "This tribute exists because she deserves to be seen."
            </p>
          </motion.div>
        </section>

        {/* ── LETTER TO MUM ── */}
        <section className="px-4 md:px-8 max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card/40 backdrop-blur-sm border border-primary/10 rounded-3xl p-8 md:p-12"
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase gradient-gold-glow mb-6">A Letter</p>
            <div className="font-body text-foreground/70 leading-relaxed text-base space-y-4 italic">
              <p>Mum,</p>
              <p>
                I built this for you. I don't know if that's strange. But you would have loved it. You would have shown everyone. You would have cried. Then made a joke about crying.
              </p>
              <p>
                You're in every part of this — in the music, in the reason I kept going, in the warmth I'm trying to share with the world.
              </p>
              <p>
                I miss you every day. Some days that's quiet. Some days it's everything.
              </p>
              <p className="not-italic font-medium text-foreground/80">With everything I've got,</p>
              <p className="not-italic font-medium text-foreground/80 gradient-gold-glow">Gannon x</p>
            </div>
          </motion.div>
        </section>

        {/* ── AI MEMORIAL PLACEHOLDER ── */}
        <section className="px-4 md:px-8 max-w-2xl mx-auto mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-primary/10 rounded-2xl p-8 opacity-60"
          >
            <Heart className="w-8 h-8 text-primary/30 mx-auto mb-4" />
            <p className="font-display text-xl text-foreground/50 mb-2">Hear Mum's Wisdom</p>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/40 mb-4">Coming Later · Requires Gannon Approval</p>
            <p className="font-body text-xs text-muted-foreground/50 leading-relaxed max-w-sm mx-auto">
              One day, this space may become an interactive memory experience built from approved stories, words and memories. It will be a tribute, not a replacement.
            </p>
          </motion.div>
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