import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Camera } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import TiltCard from '@/components/public/TiltCard';

// Behind the scenes: studio photos from the recording sessions. Reads published
// Gallery photos in the "behind_scenes" category. Left aligned, 3D tilt cards,
// first photo feature sized.
export default function BehindTheScenes() {
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['bts-photos'],
    queryFn: () => base44.entities.GalleryImage.filter({ category: 'behind_scenes', is_published: true }, 'sort_order', 9),
  });

  return (
    <section className="py-10 md:py-14 px-4 md:px-6">
      <div className="max-w-6xl mx-auto text-left">
        <Link to="/gallery" className="group inline-block mb-8">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">In the Studio</p>
          <h2 className="font-body text-3xl md:text-5xl gradient-gold-text inline-flex items-center gap-3">
            Behind the Scenes <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
          </h2>
          <p className="font-body text-sm text-foreground/70 mt-3 max-w-lg">Moments from the recording sessions, where the songs were built line by line.</p>
        </Link>

        {!isLoading && photos.length === 0 && (
          <div className="rounded-2xl border border-primary/25 bg-card/40 p-6 flex items-start gap-4 max-w-xl">
            <Camera className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <p className="font-body text-sm text-foreground/75 leading-relaxed">Studio photos from the Set Free sessions are on their way. Check back soon.</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[220px] gap-3 md:gap-4" style={{ perspective: 1200 }}>
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30, rotateX: 18 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              className={i === 0 ? 'col-span-2 row-span-2' : ''}
            >
              <TiltCard max={10} className="h-full rounded-2xl">
                <Link to="/gallery" className="group relative block h-full rounded-2xl overflow-hidden border border-primary/20 shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
                  <img src={photo.image_url} alt={photo.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
                    <p className="font-body text-xs text-foreground/90 line-clamp-1">{photo.title}</p>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}