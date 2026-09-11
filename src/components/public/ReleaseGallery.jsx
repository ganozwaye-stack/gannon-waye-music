import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';

// The Set Free making-of gallery: official artwork and production photos,
// published from the admin gallery (GalleryImage, is_published true) and
// framed in the gold aesthetic. Nothing renders until the owner publishes
// imagery, so no placeholders and no stock photos ever appear.

export default function ReleaseGallery({ releaseTitle = 'Set Free' }) {
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['releaseGallery', releaseTitle],
    queryFn: () => base44.entities.GalleryImage.filter(
      { is_published: true, related_release: releaseTitle },
      'sort_order'
    ),
    staleTime: 60_000,
  });

  if (isLoading || images.length === 0) return null;

  return (
    <section className="mt-20" aria-label={`${releaseTitle} artwork and production gallery`}>
      <div className="text-center mb-8">
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2">Behind the Release</p>
        <h2 className="font-display text-2xl md:text-3xl text-foreground">The Making of {releaseTitle}</h2>
        <p className="font-body text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Official artwork and moments from the studio.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
        {images.map((img, i) => (
          <motion.figure
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-primary/25 bg-card/40 p-2"
          >
            <img
              src={img.image_url}
              alt={img.title || `${releaseTitle} artwork`}
              loading="lazy"
              className="w-full aspect-square object-cover rounded-xl"
            />
            <figcaption className="px-2 pt-2 pb-1">
              <p className="font-body text-xs text-foreground truncate">{img.title}</p>
              {img.photographer_credit && (
                <p className="font-body text-[10px] text-muted-foreground truncate">{img.photographer_credit}</p>
              )}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}