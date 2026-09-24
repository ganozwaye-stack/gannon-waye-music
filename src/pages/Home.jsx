import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SocialLinks from '@/components/public/SocialLinks';
import SafeSpaceBanner from '@/components/public/SafeSpaceBanner';
import StoreWorldTeaser from '@/components/public/StoreWorldTeaser';
import FeaturedMerchShowcase from '@/components/public/FeaturedMerchShowcase';
import UpcomingMerchVote from '@/components/public/UpcomingMerchVote';
import FirstVisitOnboarding from '@/components/public/FirstVisitOnboarding';
import ThankYouProjectCTA from '@/components/public/ThankYouProjectCTA';
import HomeEmailSignup from '@/components/public/HomeEmailSignup';
import TiltCard from '@/components/public/TiltCard';
import PressKitHomeSection from '@/components/public/PressKitHomeSection';
import ThisIsMeFeature from '@/components/public/ThisIsMeFeature';
import SetFreeSpaceHero from '@/components/public/setfree-hero/SetFreeSpaceHero';
import HomeWelcomeSection from '@/components/public/HomeWelcomeSection';
import { PUBLIC_RELEASE_FILTER, isPublicRelease } from '@/lib/publicRelease';

// House style: never use the em dash (—). Use commas, colons, or the middot (·) instead.
// Release day, 25 September 2026: Set Free is the whole hero (galaxy, heart
// planet on fire, 3D orbit ring). The welcome write-up and Without You Here
// sit directly beneath it.

// Cover art comes from each release's artwork_url in the database, the single source of truth.
// Do not hardcode per-song cover overrides here (that caused mis-assigned artwork in the past).

export default function Home() {
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
  const previousRelease = releases.find((release) => release.title === 'Without You Here') || releases[0] || null;
  const previousLink = previousRelease?.id ? `/release/${previousRelease.id}` : '/music';
  const approvedAlbum = releases.find((release) => release.type === 'album') || null;

  return (
    <div className="min-h-screen relative">
      <SetFreeSpaceHero />

      <HomeWelcomeSection previousRelease={previousRelease} previousLink={previousLink} />

      {/* Welcome prompt: appears the first time a visitor reaches this point */}
      <FirstVisitOnboarding />

      {/* This Is Me: the video series behind the music, launched 17 September 2026 */}
      <ThisIsMeFeature />

      {/* Featured merchandise display: the Thank You collection */}
      <FeaturedMerchShowcase />

      {/* About Section: magazine 3-column */}
      <section className="py-10 md:py-14 px-4 md:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10">
            
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">About</p>
            <h2 className="font-body text-3xl md:text-5xl gradient-gold-text text-[hsl(var(--foreground))]">The Story</h2>
          </motion.div>

          {/* 3-column magazine layout, hidden on mobile */}
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-4 items-start">
            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-body text-foreground/70 leading-relaxed text-sm text-left space-y-4 pt-8">
              
              <p>I was born and raised in Adelaide and now call Melbourne home. We did not have the money for formal music lessons, no matter how often I asked, cried or begged, but that never weakened the drive. I learned by taking every chance available: leading school choirs, singing in church and eventually serving as a worship minister.</p>
              <p>I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.</p>
              <p className="italic text-sm">I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.</p>
            </motion.div>

            {/* Centre, quote centrepiece */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-52 flex flex-col items-center gap-1">
              
              <div className="w-0.5 h-6 bg-gradient-to-b from-primary to-primary/30" />
              <div className="font-display text-base gradient-gold-glow leading-7 italic text-center space-y-0">
                <p>I didn't truly love myself</p>
                <p>until I was 33.</p>
                <p>Before that, I woke up</p>
                <p>every day wishing</p>
                <p>I could be someone else.</p>
                <p>That fear of abandonment</p>
                <p>ran my life.</p>
                <p>Then something shifted</p>
                <p>and for the first time,</p>
                <p>I didn't want to be</p>
                <p>anyone else.</p>
                <p className="mt-2 text-primary/50 not-italic tracking-widest uppercase text-[9px]">Gannon Waye</p>
              </div>
              <div className="w-0.5 h-6 bg-gradient-to-b from-primary/30 to-primary" />
            </motion.div>

            {/* Right column */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-foreground/70 leading-relaxed text-sm text-right space-y-4 pt-8">
              
              <p>My journey has not been simple. Childhood was shaped by family violence, an abusive father and a mother who struggled to regulate overwhelming emotion. In adulthood I survived abusive relationships, coercive control, addiction, PTSD and the loss of Mum. Each time life knocked me down, music gave me a way to stand again.</p>
              <p>The stages kept coming: I twice reached the grand final of Adelaide's Search for a Star, reached the Top 100 of Australian Idol, performed as a drag artist and opened Feast Festival in 2012. But the purpose is not trophies or fame. It is finding the voice I was denied and using it to reach someone else.</p>
              <p>I'm Still Here brings that purpose together. It is for the person searching for a song that can say what they cannot yet say, and for anyone who needs proof that being knocked down is not the end of the story.</p>
            </motion.div>
          </div>

          {/* Mobile fallback, stacked, full story */}
          <div className="md:hidden space-y-6">
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center">
              I was born and raised in Adelaide and now call Melbourne home. We did not have the money for formal music lessons, no matter how often I asked, cried or begged, but that never weakened the drive. I learned by taking every chance available: leading school choirs, singing in church and eventually serving as a worship minister.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center">
              I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center italic">
              I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.
            </p>
            <div className="border-l-2 border-primary pl-4 font-display text-sm gradient-gold-glow italic leading-7">
              <p>I didn't truly love myself</p>
              <p>until I was 33.</p>
              <p>Before that, I woke up</p>
              <p>every day wishing</p>
              <p>I could be someone else.</p>
              <p>That fear of abandonment</p>
              <p>ran my life.</p>
              <p>Then something shifted</p>
              <p>and for the first time,</p>
              <p>I didn't want to be</p>
              <p>anyone else.</p>
            </div>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center">
              My journey has not been simple. Childhood was shaped by family violence, an abusive father and a mother who struggled to regulate overwhelming emotion. In adulthood I survived abusive relationships, coercive control, addiction, PTSD and the loss of Mum. Each time life knocked me down, music gave me a way to stand again.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center">
              The stages kept coming: I twice reached the grand final of Adelaide's Search for a Star, reached the Top 100 of Australian Idol, performed as a drag artist and opened Feast Festival in 2012. But the purpose is not trophies or fame. It is finding the voice I was denied and using it to reach someone else.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center">
              I'm Still Here brings that purpose together. It is for the person searching for a song that can say what they cannot yet say, and for anyone who needs proof that being knocked down is not the end of the story.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex justify-center">
            
            <SocialLinks settings={site} className="justify-center" />
          </motion.div>
        </div>
      </section>

      {/* Music: latest releases, moved up to follow the Story */}
      {/* Latest Releases Preview */}
      {releases.length > 0 &&
      <section className="py-10 md:py-14 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12">
            
              <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Latest</p>
              <h2 className="font-body text-3xl md:text-5xl gradient-gold-text">Music</h2>
            </motion.div>

            {/* Album, featured at top center */}
            {approvedAlbum &&
          <div className="mb-8 max-w-2xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(245,208,110,0.06) 50%, rgba(212,175,55,0.12) 100%)',
              border: '2px solid rgba(245,208,110,0.35)',
              boxShadow: '0 0 50px rgba(212,175,55,0.12)'
            }}>
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Current Album</p>
                  <h3 className="font-body text-3xl md:text-4xl gradient-gold-text mb-2">{approvedAlbum.title}</h3>
                  <p className="font-body text-sm text-muted-foreground">{approvedAlbum.description}</p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="font-body text-xs gradient-gold-text uppercase tracking-wider">Public Release</span>
                  </div>
                </div>
              </div>
          }

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 max-w-xl mx-auto">
              {/* Without You Here now shows from the published releases list below, no longer a Coming Soon card */}
              {releases.slice(0, 2).map((release) =>
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
                  <div className="p-6">
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
            <div className="text-center mt-10">
              <Link to="/music">
                <Button className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase gradient-gold-button border-0">
                  View All Music <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      }

      {/* Digital Press Kit */}
      <PressKitHomeSection />

      {/* Boutique Store World CTA */}
      <StoreWorldTeaser />

      {/* Upcoming merch with private fan voting */}
      <UpcomingMerchVote />

      {/* Thank You Project CTA: donations, community, socials */}
      <section className="py-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <ThankYouProjectCTA context="Listen to the music, explore the current merchandise, and share the story with someone who may need it." />
        </div>
      </section>

      {/* Email Signup, collect fan emails for release updates */}
      <HomeEmailSignup />

      {/* Safe Space Banner */}
      <SafeSpaceBanner />
    </div>);

}