import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Mail, Music2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { PUBLIC_RELEASE_FILTER, isPublicRelease } from '@/lib/publicRelease';
import ThisIsMeFeature from '@/components/public/ThisIsMeFeature';
import PressReleaseCard from '@/components/public/press/PressReleaseCard';
import PressHeadshotStrip from '@/components/public/press/PressHeadshotStrip';

const FALLBACK_HEADSHOT = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/46d4a449f_34508B53-5E54-4EAB-9923-73CB67595C65.png';
const BIO = 'Gannon Waye is an independent Australian singer songwriter born in Adelaide and based in Melbourne. Raised in low socioeconomic conditions, formal music lessons were out of reach, but he built his voice through school choirs, church, worship ministry, drag performance and community stages. After family violence, abusive relationships, addiction, PTSD and the loss of his mum Sonia, he returned to music with I\'m Still Here, a fifteen song project about being knocked down and choosing to rise.';

export default function PressKit() {
  const { data: releaseCandidates = [], isLoading: isLoadingReleases } = useQuery({
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
    <div className="min-h-screen pt-6 md:pt-8 pb-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2">
            Media resources
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-3">Press Kit</h1>
          <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto">
            Official biography, approved images, contact details, and current public music.
          </p>
        </motion.header>

        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 mb-12">
          <div className="rounded-3xl border border-primary/20 bg-card/55 p-6 md:p-8">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-4">Biography</p>
            <p className="font-body text-base text-foreground/75 leading-relaxed">{BIO}</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mt-5">
              Gannon's purpose is not fame for its own sake. It is to reach people who need a voice or a song for what they cannot yet say through independent, emotionally honest music and storytelling.
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

            <div className="h-px bg-border/50 my-7" />
            <PressHeadshotStrip images={headshots.slice(1, 7)} />
          </div>

          <div className="rounded-3xl overflow-hidden border border-border/40 bg-card/55">
            {/* object-[center_38%] crops the empty navy above his head so his face
                sits higher in the frame. */}
            <img
              src={headshots[0].image_url}
              alt={headshots[0].title || 'Gannon Waye'}
              className="w-full h-full min-h-[360px] object-cover object-[center_38%]"
            />
          </div>
        </section>

        {/* Music sits above the video series: this is a music site first. */}
        <section className="rounded-3xl border border-primary/20 bg-card/55 p-7 md:p-10 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Music2 className="w-5 h-5 text-primary" />
            <h2 className="font-display text-3xl text-foreground">Public music</h2>
          </div>
          {isLoadingReleases ? (
            <p className="font-body text-sm text-muted-foreground">
              Loading approved music…
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Set Free, the next single, out 25 September 2026. Its Release record
                  is still behind the public approval gates, so the press details are
                  carried here directly. Sits above the public catalogue. */}
              <article className="rounded-2xl border border-primary/35 bg-background/30 p-5">
                <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">
                  Single · Out 25 September 2026
                </p>
                <h3 className="font-display text-2xl text-foreground mt-1">Set Free</h3>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Written by Gannon Waye · Produced by Will Henderson
                </p>
                <p className="font-body text-sm text-foreground/70 leading-relaxed mt-3">
                  Set Free captures the moment a boundary becomes non negotiable, built on the line "I'm not the one you're breaking anymore." It moves towards peace, freedom and reclaiming your voice.
                </p>
                <a
                  href="https://too.fm/setfree_gannonwaye"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full gradient-gold-button border-0 px-5 py-2.5 mt-4 font-body text-xs tracking-wider uppercase"
                >
                  Presave Set Free
                </a>
              </article>
              {releases.length === 0 && (
                <p className="font-body text-sm text-muted-foreground">
                  No release is currently approved for public press use. Please contact Gannon for private review material.
                </p>
              )}
              {releases.map((release) => (
                <PressReleaseCard key={release.id} release={release} />
              ))}
            </div>
          )}
        </section>

        <ThisIsMeFeature compact />
      </div>
    </div>
  );
}