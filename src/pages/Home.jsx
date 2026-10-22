import { Link, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SafeSpaceBanner from '@/components/public/SafeSpaceBanner';
import StoreWorldTeaser from '@/components/public/StoreWorldTeaser';
import FeaturedMerchShowcase from '@/components/public/FeaturedMerchShowcase';
import FirstVisitOnboarding from '@/components/public/FirstVisitOnboarding';
import ThankYouProjectCTA from '@/components/public/ThankYouProjectCTA';
import TiltCard from '@/components/public/TiltCard';
import PressKitHomeSection from '@/components/public/PressKitHomeSection';
import ThisIsMeFeature from '@/components/public/ThisIsMeFeature';
import SetFreeSpaceHero from '@/components/public/setfree-hero/SetFreeSpaceHero';
import HomeOpening from '@/components/public/HomeOpening';
import HomeActivityFeed from '@/components/public/HomeActivityFeed';
import GannonWayeGroupFeature from '@/components/public/GannonWayeGroupFeature';
import HomeStory from '@/components/public/HomeStory';
import '@/components/public/HomeComposition.css';
import { PUBLIC_RELEASE_FILTER, isPublicRelease } from '@/lib/publicRelease';

// House style: never use the em dash (—). Use commas, colons, or the middot (·) instead.
// Release day, 25 September 2026: Set Free is the whole hero (galaxy, heart
// planet on fire, 3D orbit ring). The welcome greeting, Set Free box and
// previous release all sit up high inside the hero, stacked on the right.

// Cover art comes from each release's artwork_url in the database, the single source of truth.
// Do not hardcode per-song cover overrides here (that caused mis-assigned artwork in the past).

export default function Home() {
  const [previewParams] = useSearchParams();
  const requestedPreview = previewParams.get('home-preview');
  const depthPreview = requestedPreview === 'galaxy';
  const previewOption = depthPreview ? 1 : /^[1-5]$/.test(requestedPreview || '') ? Number(requestedPreview) : null;
  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
    initialData: []
  });

  const { data: releaseCandidates = [] } = useQuery({
    queryKey: ['home-public-releases'],
    queryFn: () => base44.entities.Release.filter(PUBLIC_RELEASE_FILTER, '-release_date', 50),
    initialData: [],
  });

  const site = settings[0] || {};
  const releases = releaseCandidates.filter(isPublicRelease);
  const featuredRelease = releases.find((release) => release.title === 'Set Free') || null;
  const previousRelease = releases.find((release) => release.title === 'Without You Here') || releases[0] || null;
  const previousLink = previousRelease?.id ? `/release/${previousRelease.id}` : '/music';

  const approvedAlbum = releases.find((release) => release.type === 'album') || null;

  return (
    <div className="min-h-screen relative homepage-composition">
      {previewOption ? (
        <>
          <HomeOpening release={featuredRelease} option={previewOption} depthPreview={depthPreview} />
          <div className="mx-auto max-w-6xl px-4"><GannonWayeGroupFeature /></div>
        </>
      ) : <SetFreeSpaceHero previousRelease={previousRelease} previousLink={previousLink} settings={site} />}
      <FirstVisitOnboarding />
      <main className="home-content mx-auto max-w-6xl px-4 md:px-6">
        <HomeActivityFeed />
        <ThisIsMeFeature compact />
        <HomeStory settings={site} />
        <div className="home-thankyou-group home-section">
          <FeaturedMerchShowcase />
          <div className="home-store-companion"><StoreWorldTeaser /></div>
        </div>
      {/* Music: latest releases, moved up to follow the Story */}
      {/* Latest Releases Preview */}
      {releases.length > 0 &&
      <section className="home-section" aria-label="Latest music">
          <div className="mx-auto">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6">
            
              <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Latest</p>
              <h2 className="font-body text-3xl md:text-5xl gradient-gold-text">Music</h2>
              <p className="font-body text-base md:text-lg text-foreground/85 mt-4">Thank you. Without you here, I’m set free. But will you even listen?</p>
              <p className="font-body text-xs text-muted-foreground mt-2">“Will You Even Listen?” is an upcoming single.</p>
            </motion.div>

            {/* Album, featured at top center */}
            {approvedAlbum &&
          <div className="mb-6">
                <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-left"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(245,208,110,0.06) 50%, rgba(212,175,55,0.12) 100%)',
              border: '2px solid rgba(245,208,110,0.35)',
              boxShadow: '0 0 50px rgba(212,175,55,0.12)'
            }}>
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Current Album</p>
                  <h3 className="font-body text-3xl md:text-4xl gradient-gold-text mb-2">{approvedAlbum.title}</h3>
                  <p className="font-body text-sm text-muted-foreground">{approvedAlbum.description}</p>
                  <div className="flex items-center justify-start gap-2 mt-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="font-body text-xs gradient-gold-text uppercase tracking-wider">Public Release</span>
                  </div>
                </div>
              </div>
          }

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Without You Here now shows from the published releases list below, no longer a Coming Soon card */}
              {releases.slice(0, 3).map((release) =>
            <TiltCard key={release.id} max={6} className="rounded-2xl">
                <Link to={`/release/${release.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40 hover:border-primary/30 transition-all h-full">
                  
                  <div className="aspect-square bg-secondary/50 overflow-hidden">
                    {release.artwork_url ?
                    <img
                      src={release.artwork_url}
                      alt={`${release.title}, Gannon Waye`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> :


                    <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    }
                  </div>
                  <div className="p-4 md:p-5">
                    <p className="font-body text-xs tracking-widest uppercase gradient-gold-text">{release.type}</p>
                    <h3 className="font-body text-2xl gradient-gold-text mt-1">{release.title}</h3>
                    <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-2">{release.description}</p>
                    {release.release_date &&
                    <p className="font-body text-xs text-muted-foreground mt-3">
                        Released {new Date(release.release_date).toLocaleDateString('en-AU', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    }
                  </div>
                </motion.div>
                </Link>
                </TiltCard>
            )}
            </div>
            <div className="text-center mt-6">
              <Link to="/music">
                <Button className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase gradient-gold-button border-0">
                  View All Music <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      }


        <div className="home-community-row home-section">
          <ThankYouProjectCTA context="Listen to the music, explore the current merchandise, and share the story with someone who may need it." />
          <SafeSpaceBanner />
        </div>
        <PressKitHomeSection />
      </main>
    </div>
  );
}
