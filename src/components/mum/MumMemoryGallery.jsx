import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const PHOTOS = [
  // Me & Mum — best portraits first
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/a318d431c_30A6307B-653A-406E-9CBD-1288498D26C9.jpg',
    caption: 'A love I still carry',
    category: 'Me & Mum',
  },
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/918c9ea94_79AD025F-80B8-414D-B842-C468362D88C2.jpg',
    caption: 'Home, in human form',
    category: 'Me & Mum',
  },
  // Sonia portrait
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/7df2f998b_A181BD35-93F3-41FB-B671-2FABC71B701A.jpg',
    caption: 'Her humour, her strength, her heart',
    category: 'Her',
  },
  // Birthday — Sonia cutting cake
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/899b8e651_5298157B-5E45-43E1-859C-24D8320B2894.jpg',
    caption: 'Happy Birthday, Sonia xo',
    category: 'Her',
  },
  // Hospital selfie — cheeky peace sign, pink hair
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0300de0f5_3B567D3B-59A6-4B35-8222-64534D6BE5BB.jpg',
    caption: 'Still smiling, always',
    category: 'Her Humour',
  },
  // Burgundy robe outside — the garden scene
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3892d6143_093DD58D-2A3E-46F2-B235-ABD31D530F48.jpg',
    caption: 'Her world — morning sun, garden, presence',
    category: 'Her World',
  },
  // Family around her — hospital, everyone gathered
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/64eef2bbd_506D6251-6B61-450E-85C6-8CB774A1E977.jpg',
    caption: 'Loved by so many',
    category: 'Family',
  },
  // Outdoor family group — wheelchair
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c828ecdaa_48963FA0-D6D3-4132-94AC-BCDE290D8224.jpg',
    caption: 'The woman who kept showing up',
    category: 'Family',
  },
  // Casket — flowers, name plate
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d4bf542bf_E6BC1469-782B-438C-99BE-17596D2C85EC.jpg',
    caption: 'Sonia K. Waye · 27.04.2022',
    category: 'Final Chapter',
  },
  // Swallow tattoo collage
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f739f95a9_7A480C51-5118-4A98-899B-6885A7AC415A.jpg',
    caption: 'From her chest to mine — carrying her always',
    category: 'Carrying Her',
  },
  // Slippers & letter
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d3e4f0abf_5EF039F6-B914-4631-85F9-E2FA515E9949.jpg',
    caption: 'A letter I wrote for her',
    category: 'Carrying Her',
  },
  // Old family photo — Adidas era
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0aecb0f25_882C79FF-0CD6-4379-9F15-06F4C8D5BB73.jpeg',
    caption: 'A lifetime of family',
    category: 'Memories',
  },
  // Big family gathering — guitar, backyard
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c8a44cfd3_EC8C41F8-38A5-480A-993B-D80ED296C3AA.jpg',
    caption: 'Where music and love gathered',
    category: 'Memories',
  },
  // Early hospital — laughing, new baby
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6c1d1f71e_FF948CCF-003E-45CB-A1EA-E7632AD074EA.jpg',
    caption: 'Joy, always joy',
    category: 'Memories',
  },
  // Hospital — rollie, sitting up
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d67b6bc40_5F4167C5-F30A-4B6C-BB25-231D0441B72D.jpg',
    caption: 'Still herself, all the way through',
    category: 'Final Chapter',
  },
  // Facebook birthday message
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/7598e8e3b_C3EFE3B0-1E31-4685-BBCF-CC69457A62CD.jpeg',
    caption: '"Happy birthday my beautiful awesome adorable son" — Mumma Bear xoxo',
    category: 'Her Words',
  },
  // Mum poem card
  {
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/27c0ec8e0_EBDF2C43-F947-4E64-BB11-282431835072.jpeg',
    caption: 'Words that hold forever',
    category: 'Her Words',
  },
];

function Lightbox({ photos, index, onClose }) {
  const [current, setCurrent] = useState(index);
  const prev = (e) => { e.stopPropagation(); setCurrent(i => (i - 1 + photos.length) % photos.length); };
  const next = (e) => { e.stopPropagation(); setCurrent(i => (i + 1) % photos.length); };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm px-4"
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl max-h-[85vh] flex flex-col items-center gap-4"
          onClick={e => e.stopPropagation()}
        >
          <img
            src={photos[current].url}
            alt={photos[current].caption}
            className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl"
            loading="lazy"
          />
          {photos[current].caption && (
            <div className="text-center">
              <p className="font-body text-sm text-white/60 italic">{photos[current].caption}</p>
              {photos[current].category && (
                <p className="font-body text-[10px] tracking-widest uppercase text-primary/40 mt-1">{photos[current].category}</p>
              )}
            </div>
          )}
          <p className="font-body text-[10px] text-white/20">{current + 1} / {photos.length}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function MumMemoryGallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <section id="memories" className="px-4 md:px-8 max-w-6xl mx-auto py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="font-body text-[10px] tracking-[0.5em] uppercase gradient-gold-glow mb-3">Memories</p>
        <p className="font-body text-xs text-muted-foreground/60">Click any image to open</p>
      </motion.div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {PHOTOS.map((photo, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 8) * 0.05 }}
            className="break-inside-avoid"
          >
            <div
              className="relative overflow-hidden rounded-xl border border-primary/10 hover:border-primary/35 transition-all duration-500 cursor-pointer group"
              onClick={() => setLightboxIndex(i)}
            >
              <img
                src={photo.url}
                alt={photo.caption}
                loading="lazy"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-3">
                <p className="font-body text-xs text-white/85 italic leading-snug">{photo.caption}</p>
                {photo.category && (
                  <p className="font-body text-[9px] tracking-widest uppercase text-primary/60 mt-1">{photo.category}</p>
                )}
              </div>
              {/* Gold glow on hover */}
              <div className="absolute inset-0 ring-0 group-hover:ring-1 ring-primary/20 rounded-xl transition-all duration-500 pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox photos={PHOTOS} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </section>
  );
}