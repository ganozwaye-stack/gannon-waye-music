import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, Music2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';

const SOCIAL_LINKS = [
  { label: 'Instagram', handle: '@gannonwaye', url: 'https://instagram.com/gannonwaye', icon: Instagram },
  { label: 'TikTok', handle: '@gannonwaye', url: 'https://tiktok.com/@gannonwaye', icon: Music2 },
];

export default function ContactGannon() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    await base44.integrations.Core.SendEmail({
      to: 'hello@gannonwaye.com',
      subject: `Contact Form: Message from ${form.name}`,
      body: `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
    });
    setSubmitted(true);
    setLoading(false);
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
            Whether it's a booking enquiry, a collaboration idea, press, or just something the music made you feel — this is the right place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Direct contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-card border border-border/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl text-foreground">Email Direct</h2>
              </div>
              <p className="font-body text-sm text-muted-foreground mb-3 leading-relaxed">
                For bookings, press enquiries, management, or general contact:
              </p>
              <a
                href="mailto:hello@gannonwaye.com"
                className="font-body text-base text-primary hover:underline transition-colors"
              >
                hello@gannonwaye.com
              </a>
            </div>

            <div className="bg-card border border-border/40 rounded-2xl p-6">
              <h2 className="font-display text-xl text-foreground mb-4">Follow Along</h2>
              <div className="space-y-3">
                {SOCIAL_LINKS.map(s => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between group p-3 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-primary" />
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

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card border border-border/40 rounded-2xl p-6">
              <h2 className="font-display text-xl text-foreground mb-5">Send a Message</h2>

              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-display text-xl text-foreground">Message sent 🤍</p>
                  <p className="font-body text-sm text-muted-foreground">We'll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Name</label>
                    <Input
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="bg-secondary/50 border-border/40"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Email</label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="bg-secondary/50 border-border/40"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Message</label>
                    <textarea
                      placeholder="What's on your mind..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      rows={5}
                      className="w-full bg-secondary/50 border border-border/40 rounded-md px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
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