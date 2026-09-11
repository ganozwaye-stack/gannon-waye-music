import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpRight, CheckCircle2, Instagram, Mail } from 'lucide-react';

const DOUBLE_OPT_IN_ENABLED = false;

// The approved ambient brand loop, kept very low here so the copy stays readable.
const AMBIENT_VIDEO =
  'https://media.base44.com/videos/public/69eb7905ca6eb4180010f794/8e23b3544_Ambient_Hero_Loop.mp4';

// Slow gold dust, fixed positions so nothing shifts as it floats.
const DUST = [
  { left: '6%', top: '74%', size: 3, duration: 11, delay: 0 },
  { left: '17%', top: '22%', size: 2, duration: 13, delay: 1.6 },
  { left: '31%', top: '64%', size: 3, duration: 10, delay: 3.2 },
  { left: '44%', top: '14%', size: 2, duration: 14, delay: 0.8 },
  { left: '57%', top: '76%', size: 3, duration: 12, delay: 2.4 },
  { left: '71%', top: '26%', size: 2, duration: 11, delay: 4 },
  { left: '84%', top: '62%', size: 3, duration: 13, delay: 1.2 },
  { left: '94%', top: '34%', size: 2, duration: 12, delay: 2.8 },
];

// Warm charcoal, not the blue-tinted page default, with the ambient brand loop
// and slow gold dust behind everything. Subtle by design: the words stay first.
function ImmersiveBackdrop() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: '#08080e' }} aria-hidden />
      <video
        src={AMBIENT_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.13] pointer-events-none"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(85% 65% at 22% 30%, rgba(212,175,55,0.10), rgba(8,8,14,0) 55%)' }}
        aria-hidden
      />
      {DUST.map((dot, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            background: '#d4af37',
            boxShadow: '0 0 8px rgba(212,175,55,0.65)',
          }}
          animate={{ y: [0, -46], opacity: [0, 0.65, 0] }}
          transition={{ duration: dot.duration, delay: dot.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      {/* Readability veil over the immersive layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, hsl(var(--background)) 0%, rgba(8,8,14,0.35) 18%, rgba(8,8,14,0.35) 82%, hsl(var(--background)) 100%)' }}
        aria-hidden
      />
    </>
  );
}

// Brand-gold envelope badge. Antique brand gold (#c9a84c from the brand kit),
// never flat yellow, with a soft gold bloom behind it.
function EnvelopeBadge() {
  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center border border-primary/30 mb-6"
      style={{
        background: 'radial-gradient(circle at 35% 30%, rgba(212,175,55,0.18), rgba(8,8,14,0.6))',
        boxShadow: '0 0 30px rgba(212,175,55,0.28)',
      }}
    >
      <Mail className="w-6 h-6" style={{ color: '#c9a84c', filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.5))' }} />
    </div>
  );
}

// The full-width, asymmetric layout. Left: the story. Right: where to go now.
function PausedActions() {
  return (
    <div className="space-y-4">
      <a
        href="https://www.instagram.com/gann0nwaye"
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-2xl border border-primary/25 p-6 transition-all hover:border-primary/50"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(8,8,14,0.55) 70%)',
          boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
        }}
      >
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.10)' }}>
            <Instagram className="w-4 h-4" style={{ color: '#c9a84c' }} />
          </div>
          <ArrowUpRight className="w-4 h-4 text-primary/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <h3 className="font-display text-xl text-foreground mt-4">Follow on Instagram</h3>
        <p className="font-body text-xs text-muted-foreground mt-1.5 leading-relaxed">
          Creative updates, live sessions and behind the scenes, straight from the studio.
        </p>
      </a>

      <Link
        to="/contact"
        className="group block rounded-2xl border border-border/40 p-6 transition-all hover:border-primary/40"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(8,8,14,0.45))' }}
      >
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center">
            <Mail className="w-4 h-4 text-muted-foreground" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <h3 className="font-display text-xl text-foreground mt-4">Contact Gannon</h3>
        <p className="font-body text-xs text-muted-foreground mt-1.5 leading-relaxed">
          Get in touch directly for collaborations, press, or anything at all.
        </p>
      </Link>
    </div>
  );
}

export default function HomeEmailSignup() {
  const [form, setForm] = useState({ name: '', email: '', consent_updates: false });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!form.consent_updates) {
      setError('Please confirm that you would like to receive music and merchandise updates.');
      return;
    }

    setLoading(true);
    try {
      await base44.entities.EmailSubscriber.create({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        consent_updates: true,
        consent_at: new Date().toISOString(),
        source: 'home_email_signup',
        unsubscribed: false,
      });
      setDone(true);
    } catch {
      setError('The signup could not be saved. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const title = done
    ? "You're on the list."
    : DOUBLE_OPT_IN_ENABLED
      ? 'Join the Update List'
      : 'Email Updates Are Being Prepared';

  const body = done
    ? `Thank you, ${form.name.split(' ')[0]}. Your details have been recorded for Gannon Waye music and merchandise updates.`
    : DOUBLE_OPT_IN_ENABLED
      ? "Receive occasional updates about new music, current merchandise, and Gannon's creative work."
      : 'Email signup is temporarily paused while confirmation and unsubscribe protections are connected. Follow Gannon on Instagram or get in touch directly in the meantime.';

  return (
    <section id="updates" className="relative overflow-hidden py-20 md:py-28">
      <ImmersiveBackdrop />

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 grid md:grid-cols-[1.15fr_1fr] gap-10 md:gap-14 items-start">
        {/* LEFT: the message, left-aligned so the page breathes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <EnvelopeBadge />
          <p className="font-body text-xs tracking-[0.35em] uppercase gradient-gold-glow mb-3 text-left">Stay Connected</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight mb-5 text-left">{title}</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-lg text-left">{body}</p>

          {!done && (
            <ul className="mt-7 space-y-2.5">
              {[
                'First listen to every new release',
                'Presave windows and release-day links',
                'Merch drops and restocks from the boutique',
              ].map((line) => (
                <li key={line} className="flex items-center gap-2.5">
                  <span className="w-1 h-1 rounded-full bg-primary shrink-0" style={{ boxShadow: '0 0 6px rgba(212,175,55,0.8)' }} />
                  <span className="font-body text-xs text-foreground/70 tracking-wide">{line}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* RIGHT: where to go now, the form, or the confirmation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          {done ? (
            <div
              className="rounded-2xl border border-primary/30 p-8 text-center"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.10), rgba(8,8,14,0.5))' }}
            >
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-display text-xl text-foreground mb-2">Welcome to the inner circle</h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                Everything lands in your inbox first from here on.
              </p>
            </div>
          ) : !DOUBLE_OPT_IN_ENABLED ? (
            <PausedActions />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border/40 p-6 space-y-3 text-left"
              style={{ background: 'rgba(8,8,14,0.55)' }}
              noValidate
              aria-describedby={error ? 'update-signup-error' : undefined}
            >
              <label htmlFor="update-signup-name" className="sr-only">Full name</label>
              <Input
                id="update-signup-name"
                name="name"
                required
                aria-invalid={Boolean(error && !form.name.trim())}
                placeholder="Your full name"
                value={form.name}
                onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
                className="bg-secondary/50 border-border/40 font-body text-base"
                autoComplete="name"
              />
              <label htmlFor="update-signup-email" className="sr-only">Email address</label>
              <Input
                id="update-signup-email"
                name="email"
                required
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
                className="bg-secondary/50 border-border/40 font-body text-base"
                autoComplete="email"
                inputMode="email"
              />
              <label className="flex items-start gap-3 rounded-xl border border-border/30 bg-card/30 p-4 cursor-pointer">
                <input
                  id="update-signup-consent"
                  name="consent_updates"
                  required
                  type="checkbox"
                  checked={form.consent_updates}
                  onChange={event => setForm(current => ({ ...current, consent_updates: event.target.checked }))}
                  className="mt-0.5 accent-primary"
                />
                <span className="font-body text-xs text-foreground/70 leading-relaxed">
                  I would like to receive music and merchandise updates from Gannon Waye. I can unsubscribe at any time.
                </span>
              </label>
              {error && <p id="update-signup-error" role="alert" className="font-body text-xs text-destructive">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-5"
              >
                {loading ? 'Saving...' : 'Join the Update List'}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}