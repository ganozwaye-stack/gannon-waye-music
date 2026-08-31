import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Download, Mail, Music2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { PUBLIC_RELEASE_FILTER, isPublicRelease } from '@/lib/publicRelease';

const FALLBACK_HEADSHOT = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cb360d5ee_image.png';
const BIO = 'Gannon Waye is an independent Australian singer songwriter born in Adelaide and based in Melbourne. Raised in low socioeconomic conditions, formal music lessons were out of reach, but he built his voice through school choirs, church, worship ministry, drag performance and community stages. After family violence, abusive relationships, addiction, PTSD and the loss of his mum Sonia, he returned to music with I\'m Still Here, a fifteen song project about being knocked down and choosing to rise.';

export default function PressKit() {
  const { data: releaseCandidates = [] } = useQuery({
    queryKey: ['press-kit-public-releases'],
    queryFn: () => base44.entities.Release.filter(PUBLIC_RELEASE_FILTER, '-release_date', 50),
    initialData: [],
  });
  const { data: gallery = [] } = useQuery({
    queryKey: ['press-kit-public-gallery'],
    queryFn: () => base44.entities.GalleryImage.filter({
      is_published: true,
      category: 'professional_photo',
    }, '-sort_order', 12),
    initialData: [],
  });

  const releases = releaseCandidates.filter(isPublicRelease);
  const headshots = gallery.length > 0
    ? gallery
    : [{ id: 'fallback', image_url: FALLBACK_HEADSHOT, title: 'Gannon Waye' }];

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">
            Media resources
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground mb-5">Press Kit</h1>
          <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto">
            Verified biography, official images, contact details, and current public music.
          </p>
        </motion.header>

        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 mb-12">
          <div className="rounded-3xl border border-primary/20 bg-card/55 p-7 md:p-10">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-4">Biography</p>
            <p className="font-body text-base text-foreground/75 leading-relaxed">{BIO}</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mt-5">
              Gannon's purpose is not fame for its own sake. It is to reach people who need a voice or a song for what they cannot yet say. Ten percent of support contributions goes to 1800RESPECT.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link to="/contact">
                <Button className="gap-2 rounded-full gradient-gold-button border-0">
                  <Mail className="w-4 h-4" /> Press and booking contact
                </Button>
              </Link>
              <a href="mailto:gannonwayemusic@gmail.com">
                <Button variant="outline" className="rounded-full border-primary/35 text-primary">
                  gannonwayemusic@gmail.com
                </Button>
              </a>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-border/40 bg-card/55">
            <img
              src={headshots[0].image_url}
              alt={headshots[0].title || 'Gannon Waye'}
              className="w-full h-full min-h-[360px] object-cover object-top"
            />
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-2">Official images</p>
              <h2 className="font-display text-3xl text-foreground">Headshots</h2>
            </div>
            <span className="font-body text-xs text-muted-foreground">High resolution available on request</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {headshots.slice(0, 6).map((image) => (
              <article
                key={image.id || image.image_url}
                className="rounded-2xl overflow-hidden border border-border/40 bg-card/55"
              >
                <img
                  src={image.image_url}
                  alt={image.title || 'Gannon Waye'}
                  className="w-full aspect-[4/5] object-cover object-top"
                />
                <div className="p-4 flex items-center justify-between gap-3">
                  <p className="font-body text-xs text-muted-foreground truncate">
                    {image.title || 'Gannon Waye'}
                  </p>
                  <a href={image.image_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 text-primary" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-primary/20 bg-card/55 p-7 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <Music2 className="w-5 h-5 text-primary" />
            <h2 className="font-display text-3xl text-foreground">Public music</h2>
          </div>
          {releases.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">
              No release is currently approved for public press use. Please contact Gannon for private review material.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {releases.map((release) => (
                <Link
                  key={release.id}
                  to={`/release/${release.id}`}
                  className="rounded-2xl border border-border/40 bg-background/30 p-5 hover:border-primary/35 transition-colors"
                >
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">
                    {release.type || 'release'}
                  </p>
                  <h3 className="font-display text-2xl text-foreground mt-1">{release.title}</h3>
                  {release.version_label && (
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      {release.version_label}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}