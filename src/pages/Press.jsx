import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Mail, Music, Radio, Mic, Headphones, Clapperboard, Image } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import TiltCard from '@/components/public/TiltCard';

const APPROVED_EMAIL = 'gannonwayemusic@gmail.com';

const BIO = `Gannon Waye is a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to him. It's the language he uses to understand people, emotion, and the parts of life that don't always have words.

His debut single "Thank You" marks the beginning of a deeply personal catalog. His upcoming single "Without You Here," releasing July 23, 2026, is a raw acoustic letter to his late mother, written on Mother's Day and produced by Will Henderson.

Gannon's work explores self-worth, boundaries, grief, and the courage to choose yourself. This is more than music. This is choosing yourself.`;

const SOCIAL_LINKS = [
  { label: 'Spotify', url: 'https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz' },
  { label: 'Apple Music', url: 'https://music.apple.com/au/artist/gannon-waye' },
  { label: 'YouTube', url: 'https://www.youtube.com/@ganozwaye' },
  { label: 'Instagram', url: 'https://www.instagram.com/ganozwaye' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@ganozwaye' },
];

export default function Press() {
  const { data: releases = [] } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
  });

  const withoutYouHere = releases.find(r => r.title === 'Without You Here');
  const thankYou = releases.find(r => r.title === 'Thank You');

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
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3">Gannon Waye</h1>
        <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto">Independent artist · Singer-songwriter · Melbourne, Australia</p>
      </motion.div>

      {/* Artist Bio */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 bg-card/50 border border-border/40 rounded-2xl p-6 md:p-8">
        <h2 className="font-display text-xl text-foreground mb-4">Artist Bio</h2>
        <p className="font-body text-sm text-foreground/70 leading-relaxed whitespace-pre-line">{BIO}</p>
      </motion.section>

      {/* Current Release Pitch — Without You Here */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow">Current Release Pitch</p>
        </div>
        <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">Without You Here</h2>
        <p className="font-body text-xs text-muted-foreground mb-6">Single · Release date: July 23, 2026 · Produced by Will Henderson</p>

        <div className="space-y-5">
          <div>
            <h3 className="font-body text-xs tracking-widest uppercase text-primary mb-2">Why the song matters</h3>
            <p className="font-body text-sm text-foreground/70 leading-relaxed">An intimate acoustic pop tribute to Gannon Waye's late mother, written on Mother's Day. It centres around grief, love, memory, and the line:</p>
            <blockquote className="font-display text-lg italic text-foreground/80 mt-3 pl-4 border-l-2 border-primary/40">
              "Your last breath took mine away,<br />There's not much more I have to say."
            </blockquote>
          </div>

          <div>
            <h3 className="font-body text-xs tracking-widest uppercase text-primary mb-2">Best audience fit</h3>
            <p className="font-body text-sm text-foreground/70 leading-relaxed">Fans of raw, storytelling-driven acoustic pop. Listeners who connect with artists like Lewis Capaldi, Dean Lewis, and Noah Kahan. Audiences navigating grief, loss, family, and emotional honesty.</p>
          </div>

          <div>
            <h3 className="font-body text-xs tracking-widest uppercase text-primary mb-2">Suggested interview topics</h3>
            <ul className="font-body text-sm text-foreground/70 leading-relaxed space-y-1 list-disc pl-5">
              <li>Writing "Without You Here" on Mother's Day — the story behind the song</li>
              <li>Grief as a creative force — turning loss into music</li>
              <li>The journey from Adelaide to Melbourne and finding his voice</li>
              <li>Self-worth, boundaries, and choosing yourself</li>
              <li>Independent artistry and building a music brand on your own terms</li>
            </ul>
          </div>

          <div>
            <h3 className="font-body text-xs tracking-widest uppercase text-primary mb-2">Suggested radio intro</h3>
            <p className="font-body text-sm text-foreground/70 leading-relaxed italic">"Next up is a song that stopped us in our tracks. Melbourne singer-songwriter Gannon Waye wrote this on Mother's Day as a letter to his late mum. This is 'Without You Here,' and that opening line says it all."</p>
          </div>

          <div>
            <h3 className="font-body text-xs tracking-widest uppercase text-primary mb-2">Suggested playlist placement</h3>
            <p className="font-body text-sm text-foreground/70 leading-relaxed">Acoustic pop, emotional pop, singer-songwriter, grief &amp; healing, Mother's Day, independent Australian artists, late-night listening.</p>
          </div>

          <div>
            <h3 className="font-body text-xs tracking-widest uppercase text-primary mb-2">Suggested reel or creator angle</h3>
            <p className="font-body text-sm text-foreground/70 leading-relaxed">"Comment BREATH and I'll send you the song": hook around the signature lyric line. Behind-the-scenes studio footage. Mother's Day tribute reels. Raw vocal and acoustic performance clips.</p>
          </div>
        </div>
      </motion.section>

      {/* Secondary Release — Thank You */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 bg-card/50 border border-border/40 rounded-2xl p-6 md:p-8">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Previous Release</p>
        <h2 className="font-display text-2xl text-foreground mb-3">Thank You</h2>
        <p className="font-body text-sm text-foreground/70 leading-relaxed">A self-respect anthem about survival, rebuilding, and walking away from what breaks you. The debut single that introduced Gannon Waye's voice and story to the world.</p>
      </motion.section>

      {/* Official Links */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 bg-card/50 border border-border/40 rounded-2xl p-6 md:p-8">
        <h2 className="font-display text-xl text-foreground mb-4">Official Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SOCIAL_LINKS.map(link => (
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
        <div className="bg-card/50 border border-border/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
          <img
            src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e8df43132_ChatGPTImageJun23202603_50_22PM.png"
            alt="Without You Here — Gannon Waye single cover"
            className="w-32 h-32 rounded-lg object-cover border border-primary/20"
          />
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground/60">Single Artwork</p>
          <p className="font-body text-[10px] text-muted-foreground/40">Without You Here — cover art</p>
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card/50 border border-border/40 rounded-2xl p-6 md:p-8">
        <h2 className="font-display text-xl text-foreground mb-2">Contact</h2>
        <p className="font-body text-sm text-muted-foreground mb-4">For press, radio, podcasts, interviews, playlist curators, sync opportunities, and collaboration enquiries.</p>
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-4 h-4 text-primary" />
          <a href={`mailto:${APPROVED_EMAIL}`} className="font-body text-sm text-foreground hover:text-primary transition-colors">{APPROVED_EMAIL}</a>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <p className="font-body text-base text-primary mb-2">Thank you — your enquiry has been sent.</p>
            <p className="font-body text-sm text-muted-foreground">Gannon's team will be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
            <input type="text" placeholder="Your name *" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40" required />
            <input type="email" placeholder="Your email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40" required />
            <input type="text" placeholder="Company / Publication / Station" value={form.company_venue} onChange={e => setForm({ ...form, company_venue: e.target.value })} className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40" />
            <select value={form.booking_type} onChange={e => setForm({ ...form, booking_type: e.target.value })} className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40">
              <option value="interview">Interview</option>
              <option value="podcast">Podcast</option>
              <option value="media_appearance">Media Appearance</option>
              <option value="brand_collaboration">Brand Collaboration</option>
              <option value="partnership">Partnership / Sync</option>
              <option value="creative_collaboration">Creative Collaboration</option>
            </select>
            <textarea placeholder="Your enquiry *" value={form.event_details} onChange={e => setForm({ ...form, event_details: e.target.value })} rows={4} className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40" required />
            <Button type="submit" disabled={loading} className="w-full rounded-full gradient-gold-button border-0">
              {loading ? '...' : 'Send Enquiry'}
            </Button>
          </form>
        )}
      </motion.section>
    </div>
  );
}