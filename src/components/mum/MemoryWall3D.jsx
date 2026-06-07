import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const PHOTOS = [
  // Me & Mum
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/8fe42604b_CopyofIMG_5326.jpg', caption: 'Gannon & Sonia — two of a kind, always', category: 'Me & Mum', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0dd386db9_IMG_5681.jpg', caption: 'Side by side — home was wherever she was', category: 'Me & Mum', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/1ddea2586_CopyofIMG_5327.jpg', caption: 'A love so simple it felt like breathing', category: 'Me & Mum' },
  // Her
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/dc8919b4b_IMG_5624.png', caption: 'Sonia Katisa Waye — this is her', category: 'Her', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e141f17cb_CopyofIMG_5599.JPG', caption: 'That smile. Once seen, never forgotten.', category: 'Her', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/25ab2bda2_CopyofIMG_5493.JPG', caption: 'She had a way of looking at you like you mattered', category: 'Her' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/173717f01_CopyofIMG_5440.jpg', caption: 'A coffee, the sun, and Sonia — perfect morning', category: 'Her' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6101f75c0_CopyofIMG_5449.jpg', caption: 'Joy in the simplest things', category: 'Her' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/8b2d006fe_CopyofIMG_5501.jpg', caption: 'Her world was wherever she planted herself', category: 'Her' },
  // Her Humour
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/fe33da01b_IMG_5732.jpg', caption: '"Best Company" — she always was', category: 'Her Humour', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c6e537a22_CopyofIMG_5466.jpg', caption: 'Nobody could make a room laugh like she could', category: 'Her Humour' },
  // Family
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5544e4f02_5F77A0A5-95B5-4AFC-9BD0-9AAF81AB32DC.jpg', caption: 'The whole family — the way she always wanted it', category: 'Family', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d5b3ed6ae_CopyofIMG_5464.jpg', caption: 'She carried the family — all of it, always', category: 'Family' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c6dfcbbd2_CopyofIMG_5500.png', caption: 'Family gatherings — her favourite place to be', category: 'Family' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/7b5464e8c_CopyofIMG_5519.jpg', caption: 'Old times — when music filled every backyard', category: 'Family' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/af1ae71b5_CopyofIMG_5551.jpg', caption: 'She raised love — not just children', category: 'Family' },
  // Her Animals
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e08e9be77_CopyofD355346C-88AB-482B-AF02-8C0FFBC2FDDE.JPG', caption: 'Her faithful companion, always by her side', category: 'Her Animals', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c1ecb80cd_CopyofIMG_5546.jpg', caption: 'She had a soft spot for every creature', category: 'Her Animals' },
  // Carrying Her
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/41d549365_49CE40E3-DBDB-46A9-87BE-332F16FAF1BF.jpg', caption: "From Mum's chest to Gannon's — her swallow, forever", category: 'Carrying Her', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/942521645_CopyofIMG_5460.JPG', caption: "I love it — and I love her", category: 'Carrying Her' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/01878507b_CopyofIMG_5454.jpg', caption: 'Getting the ink fresh — carrying her always', category: 'Carrying Her' },
  // Her Resting Place
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/a3eb1d69a_CopyofA80FBFEA-ADF6-4CBE-9C7C-D23FF50BE44A.jpg', caption: 'Flowers from those who loved her — Sonia Katisa Waye', category: 'Her Resting Place', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/99cff30c2_CopyofD60349FE-BFB8-42D9-B123-2A36FF11EDDE.jpg', caption: 'She would have loved all those colours', category: 'Her Resting Place' },
  // Her Words
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f4e3e6d46_CopyofIMG_5462.JPG', caption: '"Happy birthday my beautiful son" — Mumma Bear xoxo', category: 'Her Words', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d9e85493f_CopyofIMG_5453.jpg', caption: '"People who still have their Mother have no idea how blessed they are" — Onya Sonia', category: 'Her Words' },
  // Old Days
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/9c9ab1261_CopyofIMG_2987.jpg', caption: 'As a girl — full of life, full of fire', category: 'Old Days', featured: true },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/8a29f8963_CopyofIMG_5548.jpg', caption: 'Young and wild and free', category: 'Old Days' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f779a76cc_CopyofIMG_5505.png', caption: 'A big beautiful family — the old days', category: 'Old Days' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0c56ac323_CopyofIMG_5564.JPG', caption: 'With flowers — her language of love', category: 'Old Days' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c12df93d5_CopyofIMG_5492.JPG', caption: 'Sonia with little ones — she was always the heart of it', category: 'Old Days' },
];

const CATEGORIES = ['All', 'Me & Mum', 'Her', 'Her Humour', 'Family', 'Her Animals', 'Carrying Her', 'Her Resting Place', 'Her Words', 'Old Days'];

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