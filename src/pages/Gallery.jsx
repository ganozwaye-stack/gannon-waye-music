import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import TiltCard from '@/components/public/TiltCard';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'professional_photo', label: 'Professional' },
  { key: 'tour_snapshot', label: 'Tour' },
  { key: 'release_artwork', label: 'Artwork' },
  { key: 'behind_scenes', label: 'Behind Scenes' },
  { key: 'press', label: 'Press' },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['galleryImages'],
    queryFn: () => base44.entities.GalleryImage.filter({ is_published: true }, 'sort_order'),
    staleTime: 60_000,
  });

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return images;
    return images.filter(i => i.category === activeCategory);
  }, [images, activeCategory]);

  const openLightbox = (idx) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const nextImage = () => setLightbox(prev => prev === null ? null : (prev + 1) % filtered.length);
  const prevImage = () => setLightbox(prev => prev === null ? null : (prev - 1 + filtered.length) % filtered.length);

  const current = lightbox !== null ? filtered[lightbox] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <p className="font-body text-[10px] tracking-[0.4em] uppercase gradient-gold-glow mb-3">Gannon Waye</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground">Gallery</h1>
          <p className="font-body text-sm text-muted-foreground mt-3 max-w-md">Professional photos, tour snapshots, and official release artwork.</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border/30">
        <div className="max-w-7xl mx-auto flex gap-1 px-4 py-3 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-lg font-body text-xs tracking-wide whitespace-nowrap transition-colors ${
                activeCategory === cat.key
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-body text-sm text-muted-foreground">No images in this category yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filtered.map((img, idx) => (
              <TiltCard key={img.id} max={6} className="rounded-xl break-inside-avoid">
              <button
                onClick={() => openLightbox(idx)}
                className="block w-full group relative overflow-hidden rounded-xl border border-border/20 hover:border-primary/40 transition-all"
              >
                <img
                  src={img.image_url}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <div className="text-left">
                    <p className="font-display text-sm text-foreground">{img.title}</p>
                    {img.image_date && <p className="font-body text-[10px] text-muted-foreground">{new Date(img.image_date).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}</p>}
                    {img.photographer_credit && <p className="font-body text-[9px] text-muted-foreground/60">© {img.photographer_credit}</p>}
                  </div>
                </div>
              </button>
              </TiltCard>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {current && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"><X className="w-8 h-8" /></button>
          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 text-muted-foreground hover:text-foreground z-10"><ChevronLeft className="w-8 h-8" /></button>
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 text-muted-foreground hover:text-foreground z-10"><ChevronRight className="w-8 h-8" /></button>
          <div className="max-w-5xl max-h-[85vh] px-4 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img src={current.image_url} alt={current.title} className="max-w-full max-h-[75vh] object-contain rounded-lg" />
            <div className="text-center mt-4">
              <p className="font-display text-lg text-foreground">{current.title}</p>
              {current.description && <p className="font-body text-sm text-muted-foreground mt-1 max-w-md">{current.description}</p>}
              <div className="flex gap-3 justify-center mt-2 text-[10px] text-muted-foreground/50">
                {current.image_date && <span>{new Date(current.image_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
                {current.photographer_credit && <span>© {current.photographer_credit}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}