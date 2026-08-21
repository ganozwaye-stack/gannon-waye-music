import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const FALLBACK_HEADSHOT = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cb360d5ee_image.png';

const MISSION =
  "To make music that helps anyone who hears it feel less alone, and to honour the people who shaped us. Independent, heart-first art, with 10% of all support going to 1800RESPECT.";

const BIO =
  "Gannon Waye is a singer-songwriter born and raised in Adelaide and based in Melbourne for over thirteen years. He writes from lived experience about grief, healing, and the quiet courage it takes to love yourself. His sound is contemporary and acoustic-led, voice and guitar first, with an album in production for release next year. His new single, Without You Here, is a raw letter to his late mother Sonia, released alongside a short film for Mum.";

// Dedicated digital press kit section for press.
// Mission statement, professional biography, and high-quality headshots,
// all styled in the antique-gold brand kit.
export default function PressKitHomeSection() {
  const { data: gallery } = useQuery({
    queryKey: ['galleryPressKit'],
    queryFn: () => base44.entities.GalleryImage.list('-sort_order', 20),
    initialData: []
  });

  const headshots = (gallery || [])
    .filter((g) => g.is_published && g.category === 'professional_photo')
    .slice(0, 3);
  const shots = headshots.length > 0 ? headshots : [{ image_url: FALLBACK_HEADSHOT, title: 'Gannon Waye' }];
  const cols = shots.length >= 3 ? 'grid-cols-3' : shots.length === 2 ? 'grid-cols-2' : 'grid-cols-1';

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">For Press</p>
          <h2 className="font-body text-3xl md:text-5xl gradient-gold-text">Digital Press Kit</h2>
        </motion.div>

        <div
          className="relative rounded-2xl overflow-hidden border border-primary/30"
          style={{
            background:
              'radial-gradient(circle at 18% 20%, rgba(212,175,55,0.18), transparent 32%), radial-gradient(circle at 84% 80%, rgba(212,175,55,0.13), transparent 30%), radial-gradient(circle at 50% 52%, rgba(212,175,55,0.06), transparent 46%), linear-gradient(135deg, #0c0c12 0%, #0a0a0f 50%, #0c0c12 100%)'
          }}>
          {/* Full-bleed wallpaper veil for text legibility */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(8,8,14,0.28) 0%, rgba(8,8,14,0.04) 42%, rgba(8,8,14,0.28) 100%)' }} />
          <div className="relative z-10 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)' }} />

          <div className="relative z-10 grid md:grid-cols-2 gap-0">
            {/* Left: mission + bio */}
            <div className="p-8 md:p-10">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-text mb-3">Mission</p>
              <p className="font-body text-sm md:text-base text-foreground/80 leading-relaxed italic mb-6">{MISSION}</p>

              <div className="h-px bg-border/50 mb-6" />

              <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-text mb-3">Biography</p>
              <p className="font-body text-sm text-foreground/70 leading-relaxed">{BIO}</p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/press-kit">
                  <Button className="gap-2 rounded-full gradient-gold-button border-0 px-6 py-3 text-xs tracking-wider uppercase font-body">
                    <Download className="w-3.5 h-3.5" /> Full Press Kit
                  </Button>
                </Link>
                <Link to="/press">
                  <Button variant="outline" className="gap-2 rounded-full border-primary/40 text-primary hover:bg-primary/10 px-6 py-3 text-xs tracking-wider uppercase font-body">
                    Press & Booking <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: headshots */}
            <div className="p-8 md:p-10 border-t md:border-t-0 md:border-l border-primary/20">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-text mb-4">Headshots</p>
              <div className={`grid ${cols} gap-3`}>
                {shots.map((s, i) => (
                  <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden border border-primary/20 bg-secondary/40">
                    <img src={s.image_url} alt={s.title || 'Gannon Waye'} className="w-full h-full object-cover object-[right_top]" />
                  </div>
                ))}
              </div>
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-4">
                High-resolution images available on request
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}