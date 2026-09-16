import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { trackEvent } from '@/lib/analytics';

const STORAGE_KEY = 'gw-release-updates-asked';
const DELAY_MS = 30000;

// After 30 seconds on the site, one gentle prompt asking the visitor if they
// want to stay updated on new releases. Asked once per visitor, then never again.
export default function ReleaseUpdatesPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let asked = false;
    try { asked = localStorage.getItem(STORAGE_KEY) === '1'; } catch {}
    if (asked) return undefined;
    const timer = setTimeout(() => setShow(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setShow(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      await base44.entities.EmailSubscriber.create({
        email: trimmed,
        name: 'Fan',
        consent_updates: true,
        consent_at: new Date().toISOString(),
        source: 'site_popup',
      });
      trackEvent('release_updates_popup_signup', { source: '30s_popup' });
      setDone(true);
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    } catch (err) {
      toast({
        title: 'Could not save that right now',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="release-updates-title"
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close">
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-xl p-6 md:p-8 text-center"
            style={{ boxShadow: '0 0 46px rgba(212,175,55,0.14), 0 20px 50px rgba(0,0,0,0.5)' }}>
            {done ? (
              <>
                <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-display text-2xl text-foreground mb-2">You are on the list</h2>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                  Thank you kindly. You will be the first to hear when new music arrives.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full px-7 py-2.5 text-xs tracking-wider uppercase font-body gradient-gold-button border-0">
                  Back to the site
                </button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Stay Close</p>
                <h2 id="release-updates-title" className="font-display text-2xl text-foreground leading-tight mb-2">
                  Stay updated on new releases?
                </h2>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                  Be the first to hear about new music, including Set Free, out 25 September.
                </p>
                <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    aria-label="Your email address"
                    className="flex-1 rounded-full bg-background/70 border border-border/60 px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full px-6 py-2.5 text-xs tracking-wider uppercase font-body gradient-gold-button border-0 whitespace-nowrap disabled:opacity-60">
                    {submitting ? 'Saving' : 'Keep Me Updated'}
                  </button>
                </form>
                <button
                  type="button"
                  onClick={close}
                  className="block mx-auto mt-5 font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
                  No thanks, I am just browsing
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}