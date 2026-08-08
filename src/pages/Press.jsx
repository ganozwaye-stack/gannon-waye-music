import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Mail, Image, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import TiltCard from '@/components/public/TiltCard';

const APPROVED_EMAIL = 'gannonwayemusic@gmail.com';

// Personal, strategic press copy. Speaks to mission, goals, heart and journey.
const WHO_I_AM = `Gannon Waye is a singer-songwriter born and raised in Adelaide, now calling Melbourne home for more than 13 years. Music has always been more than sound to him. It is the language he uses to understand people, emotion, and the parts of life that do not always have words.

He thinks deeply, feels deeply, and notices what others often miss. He has been misunderstood and mislabelled more times than he can count, and he has learned that being misunderstood does not mean you are wrong. It often means you are seeing something others are not ready for yet.`;

const MISSION = `My mission is to make music that helps anyone who hears it feel less alone, and to honour the people who shaped us. Every song is written from lived experience, about grief, healing, self-worth, boundaries, and the quiet courage it takes to choose yourself. This is independent, heart-first art, powered by community, with 10% of all support going to 1800RESPECT.`;

const GOALS = `To release a debut album that collects these stories into one body of work. To build a community where stories matter and people feel safe to be honest. To keep every release independent, on my own terms, and to let the music reach the people who need it most.`;

const HEART = `I didn't truly love myself until I was 33. Before that, I woke up every day wishing I could be someone else, and a fear of abandonment ran my life. Then something shifted, and for the first time, I didn't want to be anyone else. That shift is in every song I write. This is not music for the sake of music. It is a record of choosing to stay.`;

// Per-release press write-ups, keyed by title. When a new release lands it becomes
// Current and these write-ups travel with each release as it moves down the page.
const PRESS_WRITEUPS = {
  'Without You Here': {
    tagline: `A raw, acoustic letter to his late mother, written in the early hours of Mother's Day.`,
    whyItMatters: `An intimate acoustic pop tribute to Gannon's late mother Sonia, written four years after she passed. It centres on grief, love, memory, and the line that stopped everyone who heard it:`,
    quote: `"Your last breath took mine away, there's not much more I have to say."`,
    audienceFit: `Fans of raw, storytelling-driven acoustic pop. Listeners who connect with Lewis Capaldi, Dean Lewis, and Noah Kahan. Audiences navigating grief, loss, family, and emotional honesty.`,
    interviewTopics: [
      `Writing "Without You Here" on Mother's Day, the story behind the song`,
      `Grief as a creative force, turning loss into music`,
      `The journey from Adelaide to Melbourne and finding his voice`,
      `Self-worth, boundaries, and choosing yourself`,
      `Independent artistry on your own terms`,
      `Honouring Sonia, and why 10% of all support goes to 1800RESPECT`,
    ],
    radioIntro: `"Next up is a song that stopped us in our tracks. Melbourne singer-songwriter Gannon Waye wrote this on Mother's Day as a letter to his late mum. This is "Without You Here," and that opening line says it all."`,
    playlist: `Acoustic pop, emotional pop, singer-songwriter, grief and healing, Mother's Day, independent Australian artists, late-night listening.`,
    reel: `"Comment BREATH and I will send you the song": a hook around the signature lyric line, behind-the-scenes studio footage, Mother's Day tribute reels, and raw vocal and acoustic performance clips.`,
  },
  'Thank You': {
    tagline: `The debut single. A self-respect anthem about survival, rebuilding, and walking away from what breaks you.`,
    whyItMatters: `"Thank You" was written at a turning point, when staying any longer would have meant abandoning himself all over again. It is not about the pain. It is about the line being drawn. It is the moment of choosing self-respect over repetition, the sound of breaking a cycle and refusing to return to it. As a debut, it introduced Gannon Waye's voice and story to the world on his own terms: raw, honest, and unflinching.

This is the song that started everything. Every release since carries the same DNA, lived experience, hard-won self-worth, and the decision to stay. "Thank You" is not a breakup song. It is a beginning.`,
    quote: ``,
    audienceFit: `Listeners drawn to empowerment anthems and redemption arcs. Fans of Dean Lewis, Benson Boone, and Lewis Capaldi. Audiences navigating toxic relationships, self-worth rebuilds, and the courage to walk away.`,
    interviewTopics: [
      `The real story behind "Thank You", the moment the line was drawn`,
      `Breaking cycles, choosing self-respect over repetition`,
      `Turning survival into a debut single`,
      `Self-worth, boundaries, and learning to stay`,
      `Launching as an independent artist with a message, not a marketing campaign`,
      `Why every release since starts from lived experience`,
    ],
    radioIntro: `"This next one is a debut that hits like a confession. Melbourne's Gannon Waye wrote "Thank You" the moment he finally chose himself. It is the sound of a cycle being broken. This is "Thank You."`,
    playlist: `Empowerment pop, singer-songwriter, emotional pop, late-night listening, independent Australian artists, self-worth and healing.`,
    reel: `"Comment THANKYOU for the full story": the line being drawn, before-and-after clips, raw acoustic performance, and the one-quote hook that stops the scroll.`,
  },
};

const SOCIAL_LINKS = [
  { label: 'Spotify', url: 'https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz' },
  { label: 'Apple Music', url: 'https://music.apple.com/au/artist/gannon-waye' },
  { label: 'YouTube', url: 'https://www.youtube.com/@ganozwaye' },
  { label: 'Instagram', url: 'https://www.instagram.com/gann0nwaye' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@gann0nwaye' },
];

function writeupFor(release) {
  if (release && PRESS_WRITEUPS[release.title]) return PRESS_WRITEUPS[release.title];
  return {
    tagline: release?.description || '',
    whyItMatters: release?.current_single_behind_story || release?.description || '',
    quote: '',
    audienceFit: '',
    interviewTopics: [],
    radioIntro: '',
    playlist: '',
    reel: '',
  };
}

function streamLinks(release) {
  return [
    { name: 'Spotify', url: release?.spotify_link },
    { name: 'Apple Music', url: release?.apple_music_link },
    { name: 'YouTube', url: release?.youtube_link },
    ...(release?.other_links || []).map((l) => ({ name: l.platform, url: l.url })),
  ].filter((p) => p.url);
}

function ReleaseFeature({ release, label }) {
  if (!release) return null;
  const w = writeupFor(release);
  const links = streamLinks(release);
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-10 rounded-2xl p-[1px]"
      style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.5) 0%, rgba(212,175,55,0.08) 50%, rgba(212,175,55,0.4) 100%)' }}
    >
      <div className="rounded-2xl bg-card/60 backdrop-blur-sm p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow">{label}</p>
        </div>

        <div className="grid md:grid-cols-[260px_1fr] gap-6 md:gap-8 items-start">
          {/* Display */}
          <TiltCard max={6} className="rounded-2xl">
            <div className="aspect-square rounded-2xl overflow-hidden border border-primary/30" style={{ boxShadow: '0 0 40px rgba(212,175,55,0.1)' }}>
              {release.artwork_url ? (
                <img src={release.artwork_url} alt={`${release.title}, Gannon Waye`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center"><Sparkles className="w-10 h-10 text-primary/40" /></div>
              )}
            </div>
          </TiltCard>

          {/* Write-up */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary/70" />
              <h2 className="font-display text-2xl md:text-3xl gradient-gold-text">{release.title}</h2>
            </div>
            <p className="font-body text-xs text-muted-foreground mb-4 flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary uppercase tracking-widest text-[9px]">{release.type || 'Single'}</span>
              {release.release_date && (
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(release.release_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              )}
              {release.credits && <span className="text-muted-foreground/70">· {release.credits}</span>}
            </p>

            <p className="font-body text-sm gradient-gold-text italic mb-4">{w.tagline}</p>

            <h3 className="font-body text-xs tracking-widest uppercase text-primary mb-2">Why it matters</h3>
            <p className="font-body text-sm text-foreground/70 leading-relaxed whitespace-pre-line mb-3">{w.whyItMatters}</p>
            {w.quote && (
              <blockquote className="font-display text-lg italic text-foreground/80 mb-4 pl-4 border-l-2 border-primary/40">{w.quote}</blockquote>
            )}

            {w.audienceFit && (
              <>
                <h3 className="font-body text-xs tracking-widest uppercase text-primary mb-2">Best audience fit</h3>
                <p className="font-body text-sm text-foreground/70 leading-relaxed mb-4">{w.audienceFit}</p>
              </>
            )}

            {w.interviewTopics.length > 0 && (
              <>
                <h3 className="font-body text-xs tracking-widest uppercase text-primary mb-2">Suggested interview topics</h3>
                <ul className="font-body text-sm text-foreground/70 leading-relaxed space-y-1 list-disc pl-5 mb-4">
                  {w.interviewTopics.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </>
            )}

            {w.radioIntro && (
              <>
                <h3 className="font-body text-xs tracking-widest uppercase text-primary mb-2">Suggested radio intro</h3>
                <p className="font-body text-sm text-foreground/70 leading-relaxed italic mb-4">{w.radioIntro}</p>
              </>
            )}

            {w.playlist && (
              <>
                <h3 className="font-body text-xs tracking-widest uppercase text-primary mb-2">Suggested playlist placement</h3>
                <p className="font-body text-sm text-foreground/70 leading-relaxed mb-4">{w.playlist}</p>
              </>
            )}

            {w.reel && (
              <>
                <h3 className="font-body text-xs tracking-widest uppercase text-primary mb-2">Suggested reel or creator angle</h3>
                <p className="font-body text-sm text-foreground/70 leading-relaxed mb-4">{w.reel}</p>
              </>
            )}

            {links.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border/30">
                {links.map((p) => (
                  <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="rounded-full gap-2 font-body text-xs gradient-gold-button border-0">{p.name} <ExternalLink className="w-3 h-3" /></Button>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function Press() {
  const { data: releases = [] } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
  });

  // Dynamic release flow: Current, then Previous, then the rest (where new releases land as they come out).
  const published = releases.filter((r) => r.is_published);
  const sorted = [...published].sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
  const currentRelease = sorted[0];
  const previousRelease = sorted[1];
  const otherReleases = sorted.slice(2);

  const [form, setForm] = useState({ full_name: '', email: '', company_venue: '', booking_type: 'interview', event_details: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.booking_type) return;
    setLoading(true);
    try {
      await base44.entities.BookingEnquiry.create({
        full_name: form.full_name,
        email: form.email,
        company_venue: form.company_venue,
        booking_type: form.booking_type,
        event_details: form.event_details,
        status: 'new_enquiry',
      });
      setSubmitted(true);
    } catch {
      // non-blocking
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Press &amp; Pitch</p>
        <h1 className="font-display text-4xl md:text-5xl gradient-gold-text mb-3">Gannon Waye</h1>
        <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto">Independent artist · Singer-songwriter · Melbourne, Australia</p>
      </motion.div>

      {/* Who I Am */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 bg-card/50 border border-border/40 rounded-2xl p-6 md:p-8">
        <h2 className="font-display text-xl gradient-gold-text mb-4">Who I Am</h2>
        <p className="font-body text-sm text-foreground/70 leading-relaxed whitespace-pre-line">{WHO_I_AM}</p>
      </motion.section>

      {/* Mission · Goals · Heart */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 grid md:grid-cols-2 gap-4">
        <div className="bg-card/50 border border-border/40 rounded-2xl p-6">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">My Mission</p>
          <p className="font-body text-sm text-foreground/70 leading-relaxed">{MISSION}</p>
        </div>
        <div className="bg-card/50 border border-border/40 rounded-2xl p-6">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">My Goals</p>
          <p className="font-body text-sm text-foreground/70 leading-relaxed">{GOALS}</p>
        </div>
        <div className="bg-card/50 border border-border/40 rounded-2xl p-6 md:col-span-2">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">My Heart</p>
          <p className="font-body text-sm text-foreground/70 leading-relaxed">{HEART}</p>
        </div>
      </motion.section>

      {/* Current Release */}
      <ReleaseFeature release={currentRelease} label="Current Release" />

      {/* Previous Release */}
      <ReleaseFeature release={previousRelease} label="Previous Release" />

      {/* Other Releases, where future releases land as they come out */}
      {otherReleases.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-2">Other Releases</p>
          <h2 className="font-display text-xl gradient-gold-text mb-4">The Catalogue</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {otherReleases.map((r) => (
              <TiltCard key={r.id} max={5} className="rounded-2xl">
                <Link to={`/release/${r.id}`} className="block group">
                  <div className="aspect-square rounded-2xl overflow-hidden border border-primary/30 relative">
                    {r.artwork_url ? (
                      <img src={r.artwork_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full grid place-items-center"><Sparkles className="w-8 h-8 text-primary/40" /></div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
                      <p className="font-body text-[9px] tracking-widest uppercase gradient-gold-text">{r.type}</p>
                      <h4 className="font-display text-sm text-foreground italic leading-tight">{r.title}</h4>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            ))}
          </div>
        </motion.section>
      )}

      {/* Official Links */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 bg-card/50 border border-border/40 rounded-2xl p-6 md:p-8">
        <h2 className="font-display text-xl gradient-gold-text mb-4">Official Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SOCIAL_LINKS.map((link) => (
            <TiltCard key={link.label} max={6} className="rounded-lg">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                <span className="font-body text-sm text-foreground">{link.label}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </a>
            </TiltCard>
          ))}
        </div>
      </motion.section>

      {/* Placeholders */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card/50 border border-border/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
          <Image className="w-8 h-8 text-muted-foreground/40" />
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground/60">Press Photo</p>
          <p className="font-body text-[10px] text-muted-foreground/40">Upload high-res press photo in admin</p>
        </div>
        {currentRelease?.artwork_url && (
          <div className="bg-card/50 border border-border/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
            <img src={currentRelease.artwork_url} alt={`${currentRelease.title} cover`} className="w-32 h-32 rounded-lg object-cover border border-primary/30" />
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground/60">Current Single Artwork</p>
            <p className="font-body text-[10px] text-muted-foreground/40">{currentRelease.title}</p>
          </div>
        )}
      </motion.section>

      {/* Contact */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card/50 border border-border/40 rounded-2xl p-6 md:p-8">
        <h2 className="font-display text-xl gradient-gold-text mb-2">Contact</h2>
        <p className="font-body text-sm text-muted-foreground mb-4">For press, radio, podcasts, interviews, playlist curators, sync opportunities, and collaboration enquiries.</p>
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-4 h-4 text-primary" />
          <a href={`mailto:${APPROVED_EMAIL}`} className="font-body text-sm text-foreground hover:text-primary transition-colors">{APPROVED_EMAIL}</a>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <p className="font-body text-base text-primary mb-2">Thank you, your enquiry has been sent.</p>
            <p className="font-body text-sm text-muted-foreground">Gannon's team will be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
            <input type="text" placeholder="Your name *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40" required />
            <input type="email" placeholder="Your email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40" required />
            <input type="text" placeholder="Company / Publication / Station" value={form.company_venue} onChange={(e) => setForm({ ...form, company_venue: e.target.value })} className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40" />
            <select value={form.booking_type} onChange={(e) => setForm({ ...form, booking_type: e.target.value })} className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40">
              <option value="interview">Interview</option>
              <option value="podcast">Podcast</option>
              <option value="media_appearance">Media Appearance</option>
              <option value="brand_collaboration">Brand Collaboration</option>
              <option value="partnership">Partnership / Sync</option>
              <option value="creative_collaboration">Creative Collaboration</option>
            </select>
            <textarea placeholder="Your enquiry *" value={form.event_details} onChange={(e) => setForm({ ...form, event_details: e.target.value })} rows={4} className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40" required />
            <Button type="submit" disabled={loading} className="w-full rounded-full gradient-gold-button border-0 gap-2">
              {loading ? '...' : <>Send Enquiry <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>
        )}
      </motion.section>
    </div>
  );
}