import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Mail, Instagram, ExternalLink, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VoiceTextarea from '@/components/ui/VoiceTextarea';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';

const SPOTIFY_ARTIST_URL = 'https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz';

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    handle: '@gann0nwaye',
    url: 'https://www.instagram.com/gann0nwaye',
    icon: Instagram,
    desc: 'Behind the scenes, music moments & more',
  },
  {
    label: 'TikTok',
    handle: '@gann0nwaye',
    url: 'https://www.tiktok.com/@gann0nwaye',
    icon: Music,
    desc: 'Short-form stories, music & community',
  },
  {
    label: 'Spotify',
    handle: 'Gannon Waye',
    url: SPOTIFY_ARTIST_URL,
    icon: Music,
    desc: 'Stream & follow on Spotify',
  },
];

export default function ContactGannon() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: bizSettings = [] } = useQuery({
    queryKey: ['BusinessProfileSettings'],
    queryFn: () => base44.entities.BusinessProfileSettings.list('-updated_date', 1),
  });

  const settings = bizSettings[0] || {};
  const contactEmail = settings.public_contact_email || 'gannonwayemusic@gmail.com';
  const instagramUrl = settings.instagram_url || 'https://www.instagram.com/gann0nwaye';
  const tiktokUrl = settings.tiktok_url || 'https://www.tiktok.com/@gann0nwaye';
  const spotifyUrl = settings.spotify_artist_url || SPOTIFY_ARTIST_URL;

  const socialLinks = [
    {
      label: 'Instagram',
      handle: '@gann0nwaye',
      url: instagramUrl,
      icon: Instagram,
      desc: 'Behind the scenes, music moments & more',
    },
    {
      label: 'TikTok',
      handle: '@gann0nwaye',
      url: tiktokUrl,
      icon: Music,
      desc: 'Short-form stories, music & community',
    },
    {
      label: 'Spotify',
      handle: 'Gannon Waye',
      url: spotifyUrl,
      icon: Music,
      desc: 'Stream & follow on Spotify',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: contactEmail,
        subject: `Contact Form: Message from ${form.name}`,
        body: `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
      });
      setSubmitted(true);
    } catch {
      toast({ title: 'Message could not be sent', description: 'Please try again or use the direct email link.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Get in Touch</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-6">Contact</h1>
          <p className="font-body text-foreground/60 max-w-lg mx-auto leading-relaxed">
            For press enquiries, management, collaborations, or general contact, use the details below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left: Direct contact + socials */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Email card */}
            <div className="bg-card border border-primary/20 rounded-2xl p-6 group hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-display text-xl text-foreground">Email Direct</h2>
              </div>
              <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">
                For press enquiries, management, collaborations, or general contact.
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 font-body text-sm text-primary hover:text-primary/80 transition-colors group"
              >
                {contactEmail}
                <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
              </a>
            </div>

            {/* Socials card */}
            <div className="bg-card border border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-colors">
              <h2 className="font-display text-xl text-foreground mb-4">Follow the Journey</h2>
              <div className="space-y-3">
                {socialLinks.map(s => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between group p-3 rounded-xl bg-secondary/30 border border-border/30 hover:bg-secondary/60 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="font-body text-sm text-foreground">{s.label}</p>
                          <p className="font-body text-xs text-muted-foreground">{s.handle}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card border border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-colors h-full">
              <h2 className="font-display text-xl text-foreground mb-5">Send a Message</h2>

              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-display text-xl text-foreground">Message sent 🤍</p>
                  <p className="font-body text-sm text-muted-foreground">We'll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Name</label>
                    <Input
                      id="contact-name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="bg-secondary/50 border-border/40 focus:border-primary/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Email</label>
                    <Input
                      id="contact-email"
                      name="email"
                      required
                      autoComplete="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="bg-secondary/50 border-border/40 focus:border-primary/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Message</label>
                    <VoiceTextarea
                      id="contact-message"
                      name="message"
                      required
                      placeholder="What's on your mind..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      rows={5}
                      className="w-full bg-secondary/50 border border-border/40 text-sm focus:border-primary/40"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}