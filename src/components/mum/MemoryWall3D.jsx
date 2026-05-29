import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const PHOTOS = [
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/a318d431c_30A6307B-653A-406E-9CBD-1288498D26C9.jpg', caption: 'A love I still carry', category: 'Me & Mum', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/918c9ea94_79AD025F-80B8-414D-B842-C468362D88C2.jpg', caption: 'Home, in human form', category: 'Me & Mum', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/7df2f998b_A181BD35-93F3-41FB-B671-2FABC71B701A.jpg', caption: 'Her humour, her strength, her heart', category: 'Her', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/899b8e651_5298157B-5E45-43E1-859C-24D8320B2894.jpg', caption: 'Happy Birthday, Sonia xo', category: 'Her' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0300de0f5_3B567D3B-59A6-4B35-8222-64534D6BE5BB.jpg', caption: 'Still smiling. Always.', category: 'Her Humour', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3892d6143_093DD58D-2A3E-46F2-B235-ABD31D530F48.jpg', caption: 'Her world — morning sun, garden, presence', category: 'Her Garden' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/64eef2bbd_506D6251-6B61-450E-85C6-8CB774A1E977.jpg', caption: 'Loved by so many', category: 'Family' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c828ecdaa_48963FA0-D6D3-4132-94AC-BCDE290D8224.jpg', caption: 'The woman who kept showing up', category: 'Family' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d4bf542bf_E6BC1469-782B-438C-99BE-17596D2C85EC.jpg', caption: 'Sonia K. Waye · 27.04.2022', category: 'Final Chapter' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f739f95a9_7A480C51-5118-4A98-899B-6885A7AC415A.jpg', caption: 'From her chest to mine', category: 'Carrying Her' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d3e4f0abf_5EF039F6-B914-4631-85F9-E2FA515E9949.jpg', caption: 'A letter I wrote for her', category: 'Carrying Her' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0aecb0f25_882C79FF-0CD6-4379-9F15-06F4C8D5BB73.jpeg', caption: 'A lifetime of family', category: 'Family' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c8a44cfd3_EC8C41F8-38A5-480A-993B-D80ED296C3AA.jpg', caption: 'Where music and love gathered', category: 'Family' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6c1d1f71e_FF948CCF-003E-45CB-A1EA-E7632AD074EA.jpg', caption: 'Joy, always joy', category: 'Family' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d67b6bc40_5F4167C5-F30A-4B6C-BB25-231D0441B72D.jpg', caption: 'Still herself, all the way through', category: 'Final Chapter' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/7598e8e3b_C3EFE3B0-1E31-4685-BBCF-CC69457A62CD.jpeg', caption: '"Happy birthday my beautiful awesome son" — Mumma Bear xoxo', category: 'Her Words' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/27c0ec8e0_EBDF2C43-F947-4E64-BB11-282431835072.jpeg', caption: 'Words that hold forever', category: 'Her Words' },
];

const CATEGORIES = ['All', 'Me & Mum', 'Her', 'Her Humour', 'Her Garden', 'Family', 'Carrying Her', 'Final Chapter', 'Her Words'];

// 3D-tilt card
function MemoryCard({ photo, index, onClick }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({
      x: (e.clientY - cy) / rect.height * 12,
      y: -(e.clientX - cx) / rect.width * 12,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 6) * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="break-inside-avoid cursor-pointer"
      style={{ perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      onClick={onClick}
    >
      <motion.div
        animate={{
          rotateX: hovered ? tilt.x : 0,
          rotateY: hovered ? tilt.y : 0,
          scale: hovered ? 1.04 : 1,
          y: hovered ? -6 : 0,
          boxShadow: hovered
            ? '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.25)'
            : '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.06)',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative overflow-hidden rounded-xl border border-primary/10 bg-card/20"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <img
          src={photo.url}
          alt={photo.caption}
          loading="lazy"
          className="w-full h-auto object-cover"
        />
        {/* Caption overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3"
        >
          <p className="font-body text-xs text-white/90 italic leading-snug">{photo.caption}</p>
          {photo.category && (
            <p className="font-body text-[9px] tracking-widest uppercase text-primary/60 mt-1">{photo.category}</p>
          )}
        </motion.div>
        {/* Gold shimmer on hover */}
        {hovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, transparent 60%)' }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

function Lightbox({ photos, index, onClose }) {
  const [current, setCurrent] = useState(index);
  const prev = (e) => { e.stopPropagation(); setCurrent(i => (i - 1 + photos.length) % photos.length); };
  const next = (e) => { e.stopPropagation(); setCurrent(i => (i + 1) % photos.length); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/96 backdrop-blur-md px-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <X className="w-4 h-4" />
      </button>
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <ChevronRight className="w-5 h-5" />
      </button>
      <motion.div
        key={current}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl max-h-[85vh] flex flex-col items-center gap-4"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={photos[current].url}
          alt={photos[current].caption}
          className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl border border-primary/10"
          loading="lazy"
        />
        <div className="text-center">
          <p className="font-body text-sm text-white/65 italic">{photos[current].caption}</p>
          {photos[current].category && (
            <p className="font-body text-[10px] tracking-widest uppercase text-primary/40 mt-1">{photos[current].category}</p>
          )}
          <p className="font-body text-[10px] text-white/20 mt-2">{current + 1} / {photos.length}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MemoryWall3D() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = activeCategory === 'All' ? PHOTOS : PHOTOS.filter(p => p.category === activeCategory);

  return (
    <section id="memories" className="px-4 md:px-8 max-w-6xl mx-auto py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <p className="font-body text-[10px] tracking-[0.5em] uppercase gradient-gold-glow mb-3">Memories That Still Move</p>
        <p className="font-body text-xs text-muted-foreground/50">Hover to feel them. Click to enter.</p>
      </motion.div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full font-body text-[10px] tracking-wider uppercase border transition-all duration-300 ${
              activeCategory === cat
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-border/30 text-muted-foreground/60 hover:border-primary/30 hover:text-muted-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry 3D wall */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        <AnimatePresence>
          {filtered.map((photo, i) => (
            <MemoryCard
              key={photo.url}
              photo={photo}
              index={i}
              onClick={() => setLightboxIndex(PHOTOS.indexOf(photo))}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox photos={PHOTOS} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}